import os
import socket

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.exc import SQLAlchemyError

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.exceptions import DomainException, domain_exception_handler

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS - Explicit origins only (reject wildcard '*' when credentials are true)
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
raw_origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]
# Disallow wildcard origin with credentials per CORS security standard
allowed_origins = [o for o in raw_origins if o != "*"] if raw_origins else [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    if settings.USE_SQLITE_DEV:
        # Ensure all models are imported so metadata knows about them
        from app.db.base_class import Base
        from app.db.session import engine
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

app.add_exception_handler(DomainException, domain_exception_handler)

@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request, exc):
    import traceback
    traceback.print_exc()
    print("SQLALCHEMY ERROR:", exc)
    return JSONResponse(
        status_code=503,
        content={
            "error_code": "DATABASE_UNAVAILABLE",
            "message": "The database is currently unavailable or unreachable. Ensure PostgreSQL is running.",
        },
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    # Sanitize errors to prevent reflection of sensitive user input or credentials in 422 responses
    sanitized_errors = []
    for err in exc.errors():
        sanitized_errors.append({
            "loc": err.get("loc"),
            "msg": err.get("msg"),
            "type": err.get("type"),
        })
    return JSONResponse(
        status_code=422,
        content={"detail": sanitized_errors},
    )

@app.exception_handler(OSError)
async def os_error_handler(request, exc):
    # Catch socket/connection errors when asyncpg fails to reach postgres entirely
    if isinstance(exc, (ConnectionRefusedError, socket.error)):
        return JSONResponse(
            status_code=503,
            content={
                "error_code": "INFRASTRUCTURE_CONNECTION_REFUSED",
                "message": "Failed to connect to required infrastructure (likely PostgreSQL).",
            },
        )
    # Re-raise standard OSError
    raise exc

# Ensure static/images exists so mount doesn't fail
os.makedirs("static/images", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(api_router, prefix=settings.API_V1_STR)

from app.api.v1.endpoints import auth, users

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
