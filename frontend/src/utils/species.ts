export type Species = 'dog' | 'cat' | 'other' | 'unknown';

/**
 * Strict explicit species classifier (Contract C2 Invariant):
 * 1. Explicit supported species = 'dog' -> 'dog'
 * 2. Explicit supported species = 'cat' -> 'cat'
 * 3. Explicit supported species = 'other' -> 'other'
 * 4. Missing, undefined, null, or unrecognized species -> 'unknown'
 *
 * Absolutely NO breed dictionaries, heuristics, regex, or guessing.
 * If the API or fixture does not provide an explicit species, returns 'unknown'.
 */
export function getExplicitSpecies(petOrAlert: { species?: string | null }): Species {
  if (!petOrAlert || !petOrAlert.species) {
    return 'unknown';
  }

  const normalized = petOrAlert.species.toLowerCase().trim();
  if (normalized === 'dog') return 'dog';
  if (normalized === 'cat') return 'cat';
  if (normalized === 'other') return 'other';

  return 'unknown';
}
