import os
import uuid
from app.storage.interfaces import ImageStorage
from app.core.exceptions import DomainException

class LocalFileSystemStorage(ImageStorage):
    def __init__(self, base_dir: str = "static/images"):
        self.base_dir = base_dir
        os.makedirs(self.base_dir, exist_ok=True)

    async def upload_image(self, file_name: str, file_bytes: bytes, content_type: str) -> str:
        try:
            unique_name = f"{uuid.uuid4().hex}_{file_name}"
            file_path = os.path.join(self.base_dir, unique_name)
            
            with open(file_path, "wb") as out_file:
                out_file.write(file_bytes)
                
            # Return a URL that matches the static mount we'll configure
            return f"/static/images/{unique_name}"
        except Exception as e:
            raise DomainException(
                message=f"Failed to save image locally: {str(e)}",
                error_code="STORAGE_FAILURE",
                status_code=500
            )
