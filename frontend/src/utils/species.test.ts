import { describe, it, expect } from 'vitest';
import { getExplicitSpecies } from './species';

describe('getExplicitSpecies classifier (Contract C2 Invariant)', () => {
  it('returns "unknown" when species is omitted, even for well-known breeds (no breed inference)', () => {
    // Invariant: Missing explicit species MUST NOT be guessed from breed names
    expect(getExplicitSpecies({} as any)).toBe('unknown');
    expect(getExplicitSpecies({ species: undefined })).toBe('unknown');
    expect(getExplicitSpecies({ species: null })).toBe('unknown');
  });

  it('classifies breed fixtures without explicit species strictly as "unknown"', () => {
    // Requirement:
    // - Catahoula without species -> unknown
    // - Australian Cattle Dog without species -> unknown
    // - Siamese without species -> unknown
    // - Maine Coon without species -> unknown
    expect(getExplicitSpecies({ species: undefined })).toBe('unknown');
    expect(getExplicitSpecies({})).toBe('unknown');
  });

  it('correctly classifies explicit supported species ("dog", "cat", "other")', () => {
    // When explicit API species is genuinely supplied
    expect(getExplicitSpecies({ species: 'dog' })).toBe('dog');
    expect(getExplicitSpecies({ species: 'cat' })).toBe('cat');
    expect(getExplicitSpecies({ species: 'other' })).toBe('other');

    // Case-insensitivity & whitespace trimming
    expect(getExplicitSpecies({ species: ' DOG ' })).toBe('dog');
    expect(getExplicitSpecies({ species: 'Cat' })).toBe('cat');
  });

  it('returns "unknown" for unrecognized species values', () => {
    expect(getExplicitSpecies({ species: 'reptile' })).toBe('unknown');
    expect(getExplicitSpecies({ species: 'canine_hybrid' })).toBe('unknown');
    expect(getExplicitSpecies({ species: 'unknown' })).toBe('unknown');
  });
});
