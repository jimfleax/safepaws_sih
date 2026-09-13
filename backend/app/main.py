from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router
from app.core.exceptions import domain_exception_handler, DomainException

from sqlalchemy.exc import SQLAlchemyError
import socket

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

app.include_router(api_router, prefix=settings.API_V1_STR)
