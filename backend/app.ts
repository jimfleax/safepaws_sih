import authRoutes from "./src/routes/authRoutes.ts";
import userRoutes from "./src/routes/userRoutes.ts";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { globalErrorHandler } from "./src/middleware/errorHandler.ts";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    dbConnected: !!process.env.MONGODB_URI,
  });
});


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use(globalErrorHandler);

export default app;
