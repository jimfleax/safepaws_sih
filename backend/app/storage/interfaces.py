from typing import Protocol

class ImageStorage(Protocol):
    async def upload_image(self, file_name: str, file_bytes: bytes, content_type: str) -> str:
        """
        Input: File name, raw bytes, and MIME type.
        Output: Publicly accessible URL or storage path.
        Failure: Raises DomainException on storage failure.
        Ownership: Infrastructure
        """
        pass
