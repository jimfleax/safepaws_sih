import pytest
from sqlalchemy.schema import CreateTable
from app.db.models import Pet, Sighting

def test_pet_model():
    table = Pet.__table__
    assert table.name == "pets"
    assert "microchip_id" in table.c
    assert "qr_tag_id" in table.c
    assert table.c.microchip_id.unique == True
    assert table.c.qr_tag_id.unique == True
    assert "owner_name" in table.c
    assert "owner_phone" in table.c

def test_sighting_model():
    table = Sighting.__table__
    assert table.name == "sightings"
    assert "location_geom" in table.c
    # Check geography type
    assert type(table.c.location_geom.type).__name__ == "Geography"
    assert table.c.location_geom.type.srid == 4326
