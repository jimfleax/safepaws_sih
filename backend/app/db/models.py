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
    photos = relationship("PetPhoto", back_populates="pet", cascade="all, delete-orphan")
    biometric_enrollments = relationship("PetBiometricEnrollment", back_populates="pet", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="pet", cascade="all, delete-orphan")

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

class Alert(Base):
    __tablename__ = 'alerts'

    id = Column(String, primary_key=True, default=generate_uuid)
    pet_id = Column(String, ForeignKey("pets.id"), nullable=False)
    status = Column(String, default="active", nullable=False)
    last_seen_address = Column(String, nullable=True)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    pet = relationship("Pet", back_populates="alerts")
    sightings = relationship("Sighting", back_populates="alert", cascade="all, delete-orphan")

    @property
    def pet_name(self) -> str:
        return self.pet.name if self.pet else "Unknown"
        
    @property
    def breed(self) -> str:
        return self.pet.breed if self.pet else "Unknown"
        
    @property
    def photo_url(self) -> str:
        return self.pet.photo_url if self.pet else ""

class Sighting(Base):
    __tablename__ = 'sightings'

    id = Column(String, primary_key=True, default=generate_uuid)
    alert_id = Column(String, ForeignKey("alerts.id"), nullable=True, index=True)
    reporter_name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    location_geom = Column(Geography(geometry_type='POINT', srid=4326), nullable=True)
    notes = Column(String, nullable=True)
    time = Column(DateTime, default=datetime.utcnow)
    confirmed = Column(Boolean, default=False)

    alert = relationship("Alert", back_populates="sightings")

class CommunityPost(Base):
    __tablename__ = 'community_posts'

    id = Column(String, primary_key=True, default=generate_uuid)
    author_id = Column(String, ForeignKey("owners.id"), nullable=False)
    channel = Column(String, nullable=False) # e.g. "Lost & Found", "Sightings", "Local Alerts"
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    associated_alert_id = Column(String, ForeignKey("alerts.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    author = relationship("Owner", backref="community_posts")
    alert = relationship("Alert", backref="community_posts")
    replies = relationship("CommunityReply", back_populates="post")
    reports = relationship("Report", back_populates="post")

class CommunityReply(Base):
    __tablename__ = 'community_replies'

    id = Column(String, primary_key=True, default=generate_uuid)
    post_id = Column(String, ForeignKey("community_posts.id"), nullable=False)
    author_id = Column(String, ForeignKey("owners.id"), nullable=False)
    content = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    post = relationship("CommunityPost", back_populates="replies")
    author = relationship("Owner", backref="community_replies")
    reports = relationship("Report", back_populates="reply")

class Report(Base):
    __tablename__ = 'reports'

    id = Column(String, primary_key=True, default=generate_uuid)
    reporter_id = Column(String, ForeignKey("owners.id"), nullable=False)
    post_id = Column(String, ForeignKey("community_posts.id"), nullable=True)
    reply_id = Column(String, ForeignKey("community_replies.id"), nullable=True)
    reason = Column(String, nullable=False) # e.g. spam, harassment, scam, inappropriate, misinformation
    status = Column(String, default="pending") # pending, reviewed, resolved, dismissed
    created_at = Column(DateTime, default=datetime.utcnow)

    reporter = relationship("Owner", backref="reports_submitted")
    post = relationship("CommunityPost", back_populates="reports")
    reply = relationship("CommunityReply", back_populates="reports")

class Notification(Base):
    __tablename__ = 'notifications'

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("owners.id"), nullable=False)
    type = Column(String, nullable=False) # e.g. new_sighting, reply, system
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("Owner", backref="notifications")

class CommunityPreference(Base):
    __tablename__ = 'community_preferences'

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("owners.id"), nullable=False, unique=True)
    interests = Column(ARRAY(String), default=list) # e.g. ["Lost & Found", "Rescue"]
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("Owner", backref="community_preference")

class RecoveryTask(Base):
    __tablename__ = 'recovery_tasks'
    
    id = Column(String, primary_key=True, default=generate_uuid)
    alert_id = Column(String, ForeignKey("alerts.id"), nullable=False)
    assignee_id = Column(String, ForeignKey("owners.id"), nullable=True)
    task_type = Column(String, nullable=False) # e.g. put_up_flyers, search_area
    description = Column(String, nullable=False)
    status = Column(String, default="open") # open, assigned, completed
    created_at = Column(DateTime, default=datetime.utcnow)
    
    alert = relationship("Alert", backref="recovery_tasks")
    assignee = relationship("Owner", backref="assigned_tasks")

