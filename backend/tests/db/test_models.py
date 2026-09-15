import pytest
from sqlalchemy.schema import CreateTable
from app.db.models import Owner, Pet, PetPhoto, PetBiometricEnrollment, Sighting

def test_owner_model():
    table = Owner.__table__
    assert table.name == "owners"
    assert "name" in table.c
    assert "phone" in table.c

def test_pet_model():
    table = Pet.__table__
    assert table.name == "pets"
    assert "owner_id" in table.c
    assert "microchip_id" in table.c
    assert "qr_tag_id" in table.c
    assert table.c.microchip_id.unique == True
    assert table.c.qr_tag_id.unique == True

def test_pet_photo_model():
    table = PetPhoto.__table__
    assert table.name == "pet_photos"
    assert "pet_id" in table.c
    assert "photo_url" in table.c

def test_pet_biometric_enrollment_model():
    table = PetBiometricEnrollment.__table__
    assert table.name == "pet_biometric_enrollments"
    assert "pet_id" in table.c
    assert "photo_id" in table.c
    assert "embedding" in table.c
    assert "model_version" in table.c
    assert "dimension" in table.c
    assert "normalization" in table.c

def test_sighting_model():
    table = Sighting.__table__
    assert table.name == "sightings"
    assert "location_geom" in table.c
    # Check geography type
    assert type(table.c.location_geom.type).__name__ == "Geography"
    assert table.c.location_geom.type.srid == 4326
