# SAFEPAWS — BACKEND AUTH/PROFILE CONTRACT RESOLUTION

## Objective
Resolve the missing backend contract required by the E2E flow (`Authentication -> Setup Profile -> Pet Registration`), specifically the absence of the `PUT /api/users/profile` endpoint in the new FastAPI service which led to "localStorage" frontend hacks.

## Findings & Implementation

1. **Audit of Existing Identity Mechanism:**
   * The original `Node.js` legacy backend utilized a `jwt` HTTP-only cookie signed with `JWT_SECRET`, created during a `POST /api/auth/google` request.
   * FastAPI had no authentication mechanism, dependency, or routes exposed for auth/profile handling.
   * `Owner` in Postgres uses a UUID, while the frontend expects to pass `phone` and `neighborhood` sequentially during "Setup Profile".

2. **Resolution Delivered (BACKEND ONLY):**
   * **Installed required dependency:** Added `pyjwt` and `requests/httpx` capability to decode Google OAuth access tokens.
   * **`POST /api/auth/google` (Implemented):**
     * Validates Google access token directly against Google's OAuth2 endpoints.
     * Identifies or creates a Postgres `Owner` matching the Google ID (`sub`).
     * Issues an HTTP-only `jwt` cookie mirroring the legacy Node behavior.
   * **`PUT /api/users/profile` (Implemented):**
     * Intercepts the request and parses the `jwt` cookie using the `get_current_owner` dependency.
     * Extracts the user's `userId`, fetches the Postgres `Owner`, and updates `phone` and `neighborhood`.
     * Satisfies the required schema and `OwnerResponse`.
   * **`main.py` routing updated:** Registered `/api/auth` and `/api/users` natively.

## Testing & Verification
* **Automated Tests:** Wrote `test_users.py` containing endpoint verification.
* **Manual Verification:** Tested endpoints over `uvicorn` using HTTP `POST` and `PUT` requests, verifying that endpoints correctly route, parse bodies, and return schema-accurate `400` / `401` errors when unauthenticated or lacking payload tokens. (Note: Database persistence verification requires a running Postgres instance).

## Next Steps for Project Team
* The frontend team should revert the `localStorage` hacks and point `Header.tsx` to `fetch('/api/auth/google')` once more, allowing the `credentials: 'include'` flag to propagate the newly-supported FastAPI `jwt` session cookie correctly to `/api/users/profile`.
