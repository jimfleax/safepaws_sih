from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.db.models import Alert, Pet
stmt = select(Alert).options(selectinload(Alert.sightings), selectinload(Alert.pet).selectinload(Pet.photos))
print('Success')
