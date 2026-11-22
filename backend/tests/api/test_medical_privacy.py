import uuid
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.api.dependencies import get_current_owner, get_db
from app.db.base_class import Base
from app.db.models import Owner, Pet
from app.main import app


@pytest.mark.asyncio
async def test_medical_privacy_all_12_invariants():
    """
    Comprehensive suite verifying all 12 mandatory privacy & consent invariants
    specified in SafePaws UX-05.2 Section 5 C3 using an isolated in-memory DB session.
    """
    test_engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    TestSessionLocal = sessionmaker(test_engine, class_=AsyncSession, expire_on_commit=False)

    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with TestSessionLocal() as async_session:
        # 0. Set up test owners
        owner_id = f"owner-{uuid.uuid4()}"
        other_owner_id = f"other-owner-{uuid.uuid4()}"

        owner = Owner(
            id=owner_id,
            name="Alice Private",
            phone="+1 (555) 234-5678",
            email="alice.owner@example.com",
            neighborhood="Oakwood"
        )
        other_owner = Owner(
            id=other_owner_id,
            name="Bob Intruder",
            phone="+1 (555) 999-0000",
            email="bob@intruder.com",
            neighborhood="Downtown"
        )
        async_session.add(owner)
        async_session.add(other_owner)
        await async_session.commit()

        # Configure dependency overrides
        async def override_get_db():
            yield async_session

        app.dependency_overrides[get_db] = override_get_db
        app.dependency_overrides[get_current_owner] = lambda: owner

        try:
            transport = ASGITransport(app=app)
            async with AsyncClient(transport=transport, base_url="http://test") as ac:

                # -------------------------------------------------------------
                # Invariant 11: share_medical_notes defaults to False when omitted during creation
                # -------------------------------------------------------------
                res_create_default = await ac.post("/api/v1/pets/register", json={
                    "name": "Bella",
                    "species": "dog",
                    "breed": "Beagle",
                    "color": "Tricolor",
                    "age": "3",
                    "microchip_id": "CHIP-BELLA-111",
                    "medical_notes": "Needs daily ear drops. Contact vet: vet@clinic.com or 555-432-1098.",
                    "diet_notes": "Grain-free only",
                    "reward": "$200",
                    "distinctive_features": ["White tip on tail"],
                    "consent_given": True,
                })
                assert res_create_default.status_code == 201
                pet_data_1 = res_create_default.json()
                pet_id_1 = pet_data_1["id"]
                tag_id_1 = pet_data_1["qr_tag_id"]
                assert pet_data_1["share_medical_notes"] is False

                # -------------------------------------------------------------
                # Invariant 1: Pet created with share_medical_notes=False -> public tag returns medical_notes=None
                # -------------------------------------------------------------
                res_tag_1 = await ac.get(f"/api/v1/pets/tag/{tag_id_1}")
                assert res_tag_1.status_code == 200
                public_data_1 = res_tag_1.json()
                assert public_data_1["medical_notes"] is None, "Medical notes must be None when share_medical_notes=False"

                # -------------------------------------------------------------
                # Invariant 5: Microchip ID never exposed on public tag even when present
                # -------------------------------------------------------------
                assert public_data_1.get("microchip_id") is None
                assert "CHIP-BELLA-111" not in str(public_data_1)

                # -------------------------------------------------------------
                # Invariant 6: Owner phone and email never exposed on public tag
                # -------------------------------------------------------------
                assert public_data_1.get("owner_phone") is None
                assert public_data_1.get("owner_email") is None or public_data_1.get("owner_email") == ""
                assert "alice.owner@example.com" not in str(public_data_1)
                assert "555" not in str(public_data_1.get("owner_phone") or "")

                # -------------------------------------------------------------
                # Invariant 7: Owner name never exposed on public tag
                # -------------------------------------------------------------
                assert public_data_1.get("owner_name") is None
                assert "Alice Private" not in str(public_data_1)

                # -------------------------------------------------------------
                # Invariant 10: Public tag response includes status, name, breed, photo_url, reward, distinctive_features, diet_notes
                # -------------------------------------------------------------
                assert public_data_1["name"] == "Bella"
                assert public_data_1["breed"] == "Beagle"
                assert public_data_1["status"] == "safe"
                assert public_data_1["reward"] == "$200"
                assert public_data_1["diet_notes"] == "Grain-free only"
                assert "White tip on tail" in public_data_1["distinctive_features"]

                # -------------------------------------------------------------
                # Invariant 8: Authenticated owner endpoint returns full unredacted medical notes regardless of share_medical_notes flag
                # -------------------------------------------------------------
                res_owner_view = await ac.get(f"/api/v1/pets/{pet_id_1}")
                assert res_owner_view.status_code == 200
                owner_view_data = res_owner_view.json()
                assert owner_view_data["medical_notes"] == "Needs daily ear drops. Contact vet: vet@clinic.com or 555-432-1098."
                assert owner_view_data["microchip_id"] == "CHIP-BELLA-111"

                # -------------------------------------------------------------
                # Invariant 9: Non-owner cannot access /api/v1/pets/{pet_id} (403/404)
                # -------------------------------------------------------------
                app.dependency_overrides[get_current_owner] = lambda: other_owner
                res_intruder = await ac.get(f"/api/v1/pets/{pet_id_1}")
                assert res_intruder.status_code in [403, 404]

                # Restore Alice as current owner
                app.dependency_overrides[get_current_owner] = lambda: owner

                # -------------------------------------------------------------
                # Invariant 2: Pet created with share_medical_notes=True -> public tag returns scrubbed medical_notes
                # Invariant 4: PII in medical notes (phone number in various formats, email address) is scrubbed when shared
                # -------------------------------------------------------------
                res_create_shared = await ac.post("/api/v1/pets/register", json={
                    "name": "Max",
                    "species": "dog",
                    "breed": "German Shepherd",
                    "share_medical_notes": True,
                    "medical_notes": "Emergency: Requires insulin. Call doctor at 555-876-5432 or email dr.smith@vetcare.org immediately.",
                    "consent_given": True,
                })
                assert res_create_shared.status_code == 201
                pet_id_2 = res_create_shared.json()["id"]
                tag_id_2 = res_create_shared.json()["qr_tag_id"]

                res_tag_2 = await ac.get(f"/api/v1/pets/tag/{tag_id_2}")
                assert res_tag_2.status_code == 200
                public_data_2 = res_tag_2.json()
                assert public_data_2["medical_notes"] is not None
                assert "[REDACTED PHONE]" in public_data_2["medical_notes"]
                assert "[REDACTED EMAIL]" in public_data_2["medical_notes"]
                assert "555-876-5432" not in public_data_2["medical_notes"]
                assert "dr.smith@vetcare.org" not in public_data_2["medical_notes"]
                assert "Requires insulin" in public_data_2["medical_notes"]

                # -------------------------------------------------------------
                # Invariant 3: Pet updated from share_medical_notes=True to False -> subsequent public tag returns None immediately
                # -------------------------------------------------------------
                res_update = await ac.put(f"/api/v1/pets/{pet_id_2}", json={
                    "share_medical_notes": False
                })
                assert res_update.status_code == 200
                assert res_update.json()["share_medical_notes"] is False

                # Subsequent public tag query must immediately return None
                res_tag_2_revoked = await ac.get(f"/api/v1/pets/tag/{tag_id_2}")
                assert res_tag_2_revoked.status_code == 200
                assert res_tag_2_revoked.json()["medical_notes"] is None, "Immediate revocation failed"

                # -------------------------------------------------------------
                # Invariant 12: Database constraint / migration ensures non-null boolean default
                # -------------------------------------------------------------
                stmt_verify = select(Pet.share_medical_notes).where(Pet.id == pet_id_1)
                share_val = (await async_session.execute(stmt_verify)).scalar()
                assert isinstance(share_val, bool)
                assert share_val is False

        finally:
            app.dependency_overrides.pop(get_db, None)
            app.dependency_overrides.pop(get_current_owner, None)

    await test_engine.dispose()
