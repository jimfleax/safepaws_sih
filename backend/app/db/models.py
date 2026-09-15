import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, Boolean, ARRAY
from sqlalchemy.orm import relationship
from geoalchemy2 import Geography
from app.db.base_class import Base

def generate_uuid():
    return str(uuid.uuid4())

class Owner(Base):
    __tablename__ = 'owners'

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False, index=True)
    email = Column(String, nullable=True)
    neighborhood = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    pets = relationship("Pet", back_populates="owner")

class Pet(Base):
    __tablename__ = 'pets'

    id = Column(String, primary_key=True, default=generate_uuid)
    owner_id = Column(String, ForeignKey("owners.id"), nullable=False)
    name = Column(String, nullable=False)
    species = Column(String, nullable=False)
    breed = Column(String, nullable=True)
    color = Column(String, nullable=True)
    age = Column(String, nullable=True)
    weight = Column(String, nullable=True)
    microchip_id = Column(String, nullable=True, unique=True)
    status = Column(String, nullable=False, default="safe")
    medical_notes = Column(String, nullable=True)
    diet_notes = Column(String, nullable=True)
    reward = Column(String, nullable=True)
    distinctive_features = Column(ARRAY(String), nullable=True)
    qr_tag_id = Column(String, nullable=True, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("Owner", back_populates="pets")
    photos = relationship("PetPhoto", back_populates="pet")
    biometric_enrollments = relationship("PetBiometricEnrollment", back_populates="pet")

    @property
    def owner_name(self) -> str:
        return self.owner.name if self.owner else ""

    @property
    def owner_phone(self) -> str:
        return self.owner.phone if self.owner else ""

    @property
    def neighborhood(self) -> str:
        return self.owner.neighborhood if self.owner else ""

    @property
    def owner_email(self) -> str | None:
        return self.owner.email if self.owner else None

    @property
    def consent_given(self) -> bool:
        return True

    @property
    def photo_url(self) -> str:
        return self.photos[0].photo_url if self.photos else ""


class PetPhoto(Base):
    __tablename__ = 'pet_photos'

    id = Column(String, primary_key=True, default=generate_uuid)
    pet_id = Column(String, ForeignKey("pets.id"), nullable=False)
    photo_url = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    pet = relationship("Pet", back_populates="photos")
    enrollment = relationship("PetBiometricEnrollment", uselist=False, back_populates="photo")

class PetBiometricEnrollment(Base):
    __tablename__ = 'pet_biometric_enrollments'

    id = Column(String, primary_key=True, default=generate_uuid)
    pet_id = Column(String, ForeignKey("pets.id"), nullable=False)
    photo_id = Column(String, ForeignKey("pet_photos.id"), nullable=False)
    embedding = Column(ARRAY(Float), nullable=False)
    model_version = Column(String, nullable=False)
    dimension = Column(Integer, nullable=False)
    normalization = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    pet = relationship("Pet", back_populates="biometric_enrollments")
    photo = relationship("PetPhoto", back_populates="enrollment")

class Sighting(Base):
    __tablename__ = 'sightings'

    id = Column(String, primary_key=True, default=generate_uuid)
    alert_id = Column(String, nullable=True, index=True)
    reporter_name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    location_geom = Column(Geography(geometry_type='POINT', srid=4326), nullable=True)
    notes = Column(String, nullable=True)
    time = Column(DateTime, default=datetime.utcnow)
    confirmed = Column(Boolean, default=False)
