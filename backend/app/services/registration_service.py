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
        from app.db.models import Owner, Pet
        import uuid
        
        pet_id = f"pet-{uuid.uuid4().hex[:8]}"
        qr_tag_id = f"qr-{pet_id}"
        owner_id = f"owner-{uuid.uuid4().hex[:8]}"
        
        # 1. Create Owner
        db_owner = Owner(
            id=owner_id,
            name=pet_in.owner_name,
            phone=pet_in.owner_phone,
            email=pet_in.owner_email,
            neighborhood=pet_in.neighborhood
        )
        self.db.add(db_owner)
        
        # 2. Create Pet
        db_pet = Pet(
            id=pet_id,
            owner_id=owner_id,
            name=pet_in.name,
            species=pet_in.species,
            breed=pet_in.breed,
            color=pet_in.color,
            age=pet_in.age,
            weight=pet_in.weight,
            microchip_id=pet_in.microchip_id,
            status="safe",
            medical_notes=pet_in.medical_notes,
            diet_notes=pet_in.diet_notes,
            reward=pet_in.reward,
            distinctive_features=pet_in.distinctive_features,
            qr_tag_id=qr_tag_id
        )
        self.db.add(db_pet)
        
        await self.db.commit()
        
        # Return response matching the flat schema
        return PetResponse(
            id=pet_id,
            photo_url="",
            status="safe",
            qr_tag_id=qr_tag_id,
            **pet_in.model_dump()
        )

    async def enroll_image(self, pet_id: str, file_name: str, file_bytes: bytes, content_type: str) -> dict:
        from app.db.models import PetPhoto, PetBiometricEnrollment
        import uuid
        
        # 1. Pipeline ML processing (Detection, Quality, Embed)
        embedding = await self.pipeline._process_image(file_bytes)
        mode = "DEMONSTRATOR" if getattr(self.pipeline.embedder, "is_scaffold_mode", False) else "PRODUCTION"
        
        # 2. Upload to storage (Assume we do this before DB/FAISS commit)
        photo_url = await self.storage.upload_image(file_name, file_bytes, content_type)
        
        # 3. Two-Phase Enrollment Orchestration (Compensation Strategy)
        try:
            photo_id = f"photo-{uuid.uuid4().hex[:8]}"
            db_photo = PetPhoto(
                id=photo_id,
                pet_id=pet_id,
                photo_url=photo_url
            )
            self.db.add(db_photo)
            
            db_enrollment = PetBiometricEnrollment(
                pet_id=pet_id,
                photo_id=photo_id,
                embedding=embedding.tolist(),
                model_version=mode,
                dimension=embedding.shape[0],
                normalization="L2"
            )
            self.db.add(db_enrollment)
            
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
