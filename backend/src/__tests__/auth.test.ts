import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app.ts';
import User from '../models/User.ts';
import { jest } from '@jest/globals';

// Mock the google-auth-library to simulate real Google validation failure
jest.mock('google-auth-library', () => {
  return {
    OAuth2Client: jest.fn().mockImplementation(() => ({
      verifyIdToken: jest.fn().mockRejectedValue(new Error('Invalid token')),
    })),
  };
});

// Mock the User model so we don't need a real MongoDB connection
jest.mock('../models/User.ts', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn().mockImplementation((data) => ({ ...data, _id: 'mock_mongo_id' })),
    deleteMany: jest.fn(),
  }
}));

describe('Auth Controller - Google Login', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('[Baseline] Should allow mock_token in non-production', async () => {
    process.env.NODE_ENV = 'development';
    
    const res = await request(app)
      .post('/api/auth/google')
      .send({ token: 'mock_token' });
      
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe('mockuser@example.com');
  });

  it('[Fix] Should NOT allow mock_token in production', async () => {
    process.env.NODE_ENV = 'production';
    
    const res = await request(app)
      .post('/api/auth/google')
      .send({ token: 'mock_token' });
      
    // Currently this will fail because the fix is not implemented,
    // so it returns 200. We expect it to return 400 or 401.
    expect(res.status).not.toBe(200);
  });

  it('[Fix] Should fail fast for invalid ID token without calling access token endpoint', async () => {
    // We send an invalid JWT token (not mock_token).
    // The current implementation catches verifyIdToken error and blindly calls fetch('https://www.googleapis.com...').
    // Since fetch is not mocked, it might attempt a real request and fail with 401.
    // However, with our fix, it shouldn't even call fetch.
    
    // We'll mock global fetch to detect if it was called.
    global.fetch = jest.fn().mockResolvedValue({
      ok: false
    });

    const res = await request(app)
      .post('/api/auth/google')
      .send({ token: 'invalid.jwt.token' });

    // Should return an error
    expect(res.status).toBe(401);
    
    // With the fix, we expect fetch NOT to be called because 'invalid.jwt.token' is a JWT format, 
    // so it should strictly use verifyIdToken and throw if it fails.
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
