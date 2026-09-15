# DEMO CHECKLIST

## Pass/Fail Gates

- [x] **DB Running**: PostgreSQL must be active on port 5432.
- [x] **PostGIS Working**: The PostGIS extension must be installed and active (`CREATE EXTENSION postgis`).
- [x] **Migration Complete**: `alembic upgrade head` completes successfully.
- [x] **Backend Healthy**: FastAPI server starts without internal errors on port 8000.
- [x] **Frontend Healthy**: Vite React server running on port 3000.
- [x] **Registration Works**: Pet creation persists correctly to PostgreSQL.
- [x] **Enrollment Works**: Biometric image enrollment writes to both PostgreSQL (`PetBiometricEnrollment`) and FAISS.
- [x] **Identification Works**: Submitting an image triggers FAISS lookup and returns the registered pet.
- [x] **Profile Retrieval Works**: `GET /pets/{pet_id}` retrieves the real database record.
- [x] **Sighting Works**: Submitting a lost pet sighting persists to the database with PostGIS geometry.
- [x] **Failure Handling Works**: Submitting an invalid/mock text file triggers graceful UI error boundaries (HTTP 422).
- [x] **Prototype Mode Visible**: The UI clearly discloses that the ML is running in Prototype Mode.
- [x] **No LocalStorage/Mock Fallback**: M0 local mocks are strictly disabled.
- [x] **No Fake Metrics**: No scientific metrics (FAR/FRR) are falsely claimed.
