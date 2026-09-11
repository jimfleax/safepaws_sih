import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, Boolean, ARRAY, JSON
from sqlalchemy.orm import relationship
from geoalchemy2 import Geography
from app.db.base_class import Base

def generate_uuid():
    return str(uuid.uuid4())

class Pet(Base):
    __tablename__ = 'pets'

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    species = Column(String, nullable=False)
    breed = Column(String, nullable=False)
    color = Column(String, nullable=False)
    age = Column(String, nullable=False)
    owner_name = Column(String, nullable=False)
    owner_phone = Column(String, nullable=False)
    neighborhood = Column(String, nullable=False)
    
    weight = Column(String, nullable=True)
    microchip_id = Column(String, nullable=True, unique=True)
    owner_email = Column(String, nullable=True)
    medical_notes = Column(String, nullable=True)
    diet_notes = Column(String, nullable=True)
    reward = Column(String, nullable=True)
    distinctive_features = Column(ARRAY(String), default=[])
    
    consent_given = Column(Boolean, nullable=False, default=False)
    
    status = Column(String, nullable=False, default="safe")
    qr_tag_id = Column(String, nullable=True, unique=True)
    photo_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Sighting(Base):
    __tablename__ = 'sightings'

    id = Column(String, primary_key=True, default=generate_uuid)
    alert_id = Column(String, nullable=True, index=True)
    reporter_name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    location_geom = Column(Geography(geometry_type='POINT', srid=4326), nullable=True)
    notes = Column(String, nullable=True)
    time = Column(String, nullable=False, default=lambda: datetime.utcnow().isoformat())
    confirmed = Column(Boolean, default=False)
