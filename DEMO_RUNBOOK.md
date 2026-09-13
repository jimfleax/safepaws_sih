# SafePaws Demo Runbook

This document provides the exact sequence of steps required to start the SafePaws application for tomorrow's hackathon demo. 

**IMPORTANT**: This application runs in **Demonstrator / Prototype Mode**. The biometric identification engine uses a deterministic scaffold designed to prove system architecture, database mechanics (PostgreSQL/PostGIS), and vector retrieval (FAISS). It does **not** represent a scientifically validated, real-world open-set canine biometric model.

## 1. Machine Prerequisites
- Windows 10/11 OS
- Python 3.10+
- Node.js (v18+)
- Local portable PostgreSQL + PostGIS (via `setup_db.ps1`)

## 2. PostgreSQL & PostGIS Startup
The database runs as a portable binary, requiring no administrator privileges.
1. Open PowerShell in the root directory.
2. Run the startup script (if you haven't extracted it yet):
   ```powershell
   .\setup_db.ps1
   ```
   *(If already extracted, simply start the server):*
   ```powershell
   .\pgsql_bin\pgsql\bin\pg_ctl.exe -D "$PWD\pgsql_data" -l "$PWD\pgsql_data\logfile" start
   ```

## 3. Database Migration
Apply the latest SQLAlchemy architecture to the `safepaws` database:
1. Open a new terminal and activate the virtual environment:
   ```powershell
   .\.venv\Scripts\Activate.ps1
   ```
2. Navigate to the backend folder:
   ```powershell
   cd backend
   ```
3. Run Alembic migrations:
   ```powershell
   alembic upgrade head
   ```

## 4. Backend Startup
1. In the same terminal (with `.venv` active in the `backend` folder), start the FastAPI server:
   ```powershell
   $env:PYTHONPATH="."
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
   ```
2. Wait for the `Uvicorn running on http://127.0.0.1:8000` message.

## 5. Frontend Startup
1. Open a new terminal in the root directory.
2. Start the Vite React development server:
   ```powershell
   npm run dev
   ```
3. The frontend will be accessible at `http://localhost:3000`.

## 6. Exact Demo Flow
1. Open `http://localhost:3000`.
2. Observe the "Prototype Mode" indicator.
3. Click **"Join the Neighborhood"**.
4. Fill out the pet's details (e.g., Name: Bailey, Breed: Beagle).
5. Upload the **intended valid demo image**.
6. Click **"Complete Profile"**. The system will register the pet in PostgreSQL and enroll the embedding in FAISS.
7. Return to the home screen and click **"Identify"** in the navigation header.
8. Upload the **SAME** intended demo image.
9. The system will report a MATCH and link you to Bailey's profile.

## 7. Intended Demo Image Requirements
The demo operates using a controlled deterministic scaffold for the biometric embedding model. The exact identical image file must be used for enrollment and identification to demonstrate the end-to-end integration mechanics (PostgreSQL -> FAISS -> API -> React).

## 8. Failure Case Demonstration
To show the judges how the pipeline handles invalid images, upload images containing specific mock text strings (which our mock detector/quality gate interpret as failures):
- **No Dog Detected**: Upload an image/file containing the text `mock_no_dog`. The UI will display a clean "No dog detected" failure state.
- **Low Quality / Blurry**: Upload an image/file containing the text `mock_low_quality`. The UI will display a clean "Image quality insufficient" failure state.

## 9. What to Tell Judges
- **WE BUILT**: A production-grade, end-to-end architecture (FastAPI, React, PostgreSQL, FAISS).
- **WE IMPLEMENTED**: The complete metric-learning integration pattern, database persistence, geospatial sighting support, and a two-phase ML enrollment pipeline.
- **WE DESIGNED**: A mobile-first, robust UI with integrated ML failure-state UX.

## 10. What NOT to Claim
- **DO NOT CLAIM** that the biometric model is fully trained and scientifically validated.
- **DO NOT CLAIM** specific False Acceptance Rates (FAR) or False Rejection Rates (FRR).
- **DO NOT HIDE** the fact that the ML is running in Prototype Mode.

## 11. Troubleshooting
- **Database Connection Refused**: Ensure `pg_ctl` was successfully executed.
- **500 Internal Server Error**: Verify `alembic upgrade head` was run successfully.

## 12. Shutdown / Cleanup
To gracefully stop the database:
```powershell
.\pgsql_bin\pgsql\bin\pg_ctl.exe -D "$PWD\pgsql_data" stop
```
Close the terminal windows for Vite and Uvicorn.
