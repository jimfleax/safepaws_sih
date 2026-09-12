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
        mode = "DEMONSTRATOR" if getattr(self.pipeline.embedder, "is_scaffold_mode", False) else "PRODUCTION"
        
        # 2. Upload to storage (Assume we do this before DB/FAISS commit)
        photo_url = await self.storage.upload_image(file_name, file_bytes, content_type)
        
        # 3. Two-Phase Enrollment Orchestration (Compensation Strategy)
        # PostgreSQL and FAISS are not an atomic system. 
        # Strategy:
        #   a. Save image and pending enrollment to DB (without committing).
        #   b. Insert embedding to FAISS.
        #   c. If FAISS insertion fails, rollback the uncommitted DB transaction (Compensation).
        #      This prevents authoritative DB records from existing without a searchable vector.
        #   d. If FAISS succeeds, commit the DB transaction.
        
        try:
            # Step b: Insert into FAISS
            success = await self.pipeline.vector_store.add_vector(pet_id, embedding)
            if not success:
                raise InfrastructureError("FAISS insertion returned failure")
                
            # Step d: Commit DB
            await self.db.commit()
            return {
                "status": "success", 
                "message": f"Image enrolled for pet {pet_id}", 
                "photo_url": photo_url,
                "pipeline_mode": mode
            }
            
        except Exception as e:
            # Step c: Compensate DB by rolling back the pending transaction
            await self.db.rollback()
            # Escalate as InfrastructureError, avoiding silent failures
            raise InfrastructureError(f"Enrollment compensation triggered. Orchestration failed: {str(e)}")
