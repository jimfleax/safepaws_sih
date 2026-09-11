import pytest
from sqlalchemy.schema import CreateTable
from app.db.models import Owner, Pet, PetPhoto, PetBiometricEnrollment, Sighting

def test_owner_model():
    table = Owner.__table__
    assert table.name == "owners"
    assert "id" in table.c
    assert "name" in table.c
    assert "phone" in table.c

def test_pet_model():
    table = Pet.__table__
    assert table.name == "pets"
    assert "microchip_id" in table.c
    assert "qr_tag_id" in table.c
    assert table.c.microchip_id.unique == True
    assert table.c.qr_tag_id.unique == True
    assert "owner_id" in table.c
    assert len(table.foreign_keys) == 1

def test_enrollment_model():
    table = PetBiometricEnrollment.__table__
    assert table.name == "pet_biometric_enrollments"
    assert "embedding" in table.c
    assert "model_version" in table.c
    assert "dimension" in table.c
    assert "normalization" in table.c
    assert len(table.foreign_keys) == 2

def test_sighting_model():
    table = Sighting.__table__
    assert table.name == "sightings"
    assert "location_geom" in table.c
    # Check geography type
    assert type(table.c.location_geom.type).__name__ == "Geography"
    assert table.c.location_geom.type.srid == 4326

def test_relationships():
    # Verify relations are configured (if improperly configured, mapper will fail on import)
    assert Pet.owner
    assert Pet.photos
    assert Pet.enrollments
    assert Owner.pets
    assert PetPhoto.pet
    assert PetBiometricEnrollment.pet
    assert PetBiometricEnrollment.photo
