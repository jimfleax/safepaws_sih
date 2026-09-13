# DEMO CHECKLIST

## Pass/Fail Gates

- [ ] **DB Running**: PostgreSQL must be active on port 5432.
- [ ] **PostGIS Working**: The PostGIS extension must be installed and active (`CREATE EXTENSION postgis`).
- [ ] **Migration Complete**: `alembic upgrade head` completes successfully.
- [ ] **Backend Healthy**: FastAPI server starts without internal errors on port 8000.
- [ ] **Frontend Healthy**: Vite React server running on port 3000.
- [ ] **Registration Works**: Pet creation persists correctly to PostgreSQL.
- [ ] **Enrollment Works**: Biometric image enrollment writes to both PostgreSQL (`PetBiometricEnrollment`) and FAISS.
- [ ] **Identification Works**: Submitting an image triggers FAISS lookup and returns the registered pet.
- [ ] **Profile Retrieval Works**: `GET /pets/{pet_id}` retrieves the real database record.
- [ ] **Sighting Works**: Submitting a lost pet sighting persists to the database with PostGIS geometry.
- [ ] **Failure Handling Works**: Submitting an invalid/mock text file triggers graceful UI error boundaries (HTTP 422).
- [ ] **Prototype Mode Visible**: The UI clearly discloses that the ML is running in Prototype Mode.
- [ ] **No LocalStorage/Mock Fallback**: M0 local mocks are strictly disabled.
- [ ] **No Fake Metrics**: No scientific metrics (FAR/FRR) are falsely claimed.
