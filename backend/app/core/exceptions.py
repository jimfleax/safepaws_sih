from fastapi import Request
from fastapi.responses import JSONResponse
from typing import Optional, Any, Dict

class DomainException(Exception):
    def __init__(
        self, 
        message: str, 
        error_code: str, 
        status_code: int = 400,
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)

async def domain_exception_handler(request: Request, exc: DomainException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error_code": exc.error_code,
            "message": exc.message,
            "details": exc.details,
        },
    )

class NoDogDetectedError(DomainException):
    def __init__(self, message: str = "No dog detected in the provided image."):
        super().__init__(message=message, error_code="NO_DOG_DETECTED", status_code=400)

class LowQualityImageError(DomainException):
    def __init__(self, message: str = "Image quality is too low for reliable processing."):
        super().__init__(message=message, error_code="LOW_QUALITY_IMAGE", status_code=400)

class VectorStoreError(DomainException):
    def __init__(self, message: str = "Vector store operation failed."):
        super().__init__(message=message, error_code="VECTOR_STORE_FAILURE", status_code=500)

class MultiDogDetectedError(DomainException):
    def __init__(self, message: str = "Multiple dogs detected in the image. Please upload an image with only one dog."):
        super().__init__(message=message, error_code="MULTI_DOG_DETECTED", status_code=400)

