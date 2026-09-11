from typing import Any
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.pet import PetCreate, PetResponse
from app.services.biometric_service import BiometricPipelineService
from app.storage.interfaces import ImageStorage
from app.core.exceptions import InfrastructureError

class RegistrationService:
    def __init__(
        self,
        db: AsyncSession,
        biometric_pipeline: BiometricPipelineService,
        storage: ImageStorage
    ):
        self.db = db
        self.pipeline = biometric_pipeline
        self.storage = storage

    async def register_pet(self, pet_in: PetCreate) -> PetResponse:
        # P0 Scaffold: In reality we would insert into PostgreSQL via SQLAlchemy.
        # This is scaffolded to adhere to the architecture while Panel 5 does the DB.
        pet_id = f"pet-{uuid.uuid4().hex[:8]}"
        qr_tag_id = f"qr-{pet_id}"
        
        # Simulate DB insert...
        return PetResponse(
            id=pet_id,
            photo_url="",
            status="safe",
            qr_tag_id=qr_tag_id,
            **pet_in.model_dump()
        )

    async def enroll_image(self, pet_id: str, file_name: str, file_bytes: bytes, content_type: str) -> dict:
        # 1. Pipeline ML processing (Detection, Quality, Embed)
        embedding = await self.pipeline._process_image(file_bytes)
        
        # 2. Upload to storage (Assume we do this before DB/FAISS commit)
        photo_url = await self.storage.upload_image(file_name, file_bytes, content_type)
        
        # 3. DB and FAISS transactional boundary logic
        # Since FAISS isn't atomic with Postgres, we save to DB first but don't commit.
        # In a real SQLAlchemy setup, we'd do:
        # self.db.add(ImageRecord(...))
        
        try:
            # 4. Insert into FAISS
            success = await self.pipeline.vector_store.add_vector(pet_id, embedding)
            if not success:
                raise InfrastructureError("Failed to add vector to FAISS")
                
            # 5. Commit DB
            await self.db.commit()
            return {"status": "success", "message": f"Image enrolled for pet {pet_id}", "photo_url": photo_url}
            
        except Exception as e:
            # Rollback DB transaction on FAISS failure
            await self.db.rollback()
            raise InfrastructureError(f"Enrollment failed during orchestration: {str(e)}")
