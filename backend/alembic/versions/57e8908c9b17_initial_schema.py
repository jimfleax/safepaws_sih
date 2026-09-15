"""Initial schema

Revision ID: 57e8908c9b17
Revises: 
Create Date: 2026-09-11 17:59:18.222395

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '57e8908c9b17'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


import geoalchemy2

def upgrade() -> None:
    """Upgrade schema."""
    # Ensure PostGIS is enabled
    op.execute("CREATE EXTENSION IF NOT EXISTS postgis;")
    
    op.create_table(
        'owners',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('phone', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=True),
        sa.Column('neighborhood', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_owners_phone'), 'owners', ['phone'], unique=False)
    
    op.create_table(
        'pets',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('owner_id', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('species', sa.String(), nullable=False),
        sa.Column('breed', sa.String(), nullable=True),
        sa.Column('color', sa.String(), nullable=True),
        sa.Column('age', sa.String(), nullable=True),
        sa.Column('weight', sa.String(), nullable=True),
        sa.Column('microchip_id', sa.String(), nullable=True),
        sa.Column('status', sa.String(), nullable=False),
        sa.Column('medical_notes', sa.String(), nullable=True),
        sa.Column('diet_notes', sa.String(), nullable=True),
        sa.Column('reward', sa.String(), nullable=True),
        sa.Column('distinctive_features', sa.ARRAY(sa.String()), nullable=True),
        sa.Column('qr_tag_id', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['owner_id'], ['owners.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('microchip_id'),
        sa.UniqueConstraint('qr_tag_id')
    )
    
    op.create_table(
        'pet_photos',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('pet_id', sa.String(), nullable=False),
        sa.Column('photo_url', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['pet_id'], ['pets.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table(
        'pet_biometric_enrollments',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('pet_id', sa.String(), nullable=False),
        sa.Column('photo_id', sa.String(), nullable=False),
        sa.Column('embedding', sa.ARRAY(sa.Float()), nullable=False),
        sa.Column('model_version', sa.String(), nullable=False),
        sa.Column('dimension', sa.Integer(), nullable=False),
        sa.Column('normalization', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['pet_id'], ['pets.id'], ),
        sa.ForeignKeyConstraint(['photo_id'], ['pet_photos.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table(
        'sightings',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('alert_id', sa.String(), nullable=True),
        sa.Column('reporter_name', sa.String(), nullable=False),
        sa.Column('location_geom', geoalchemy2.types.Geography(geometry_type='POINT', srid=4326, from_text='ST_GeogFromText', name='geography', nullable=False), nullable=False),
        sa.Column('notes', sa.String(), nullable=True),
        sa.Column('time', sa.DateTime(), nullable=True),
        sa.Column('confirmed', sa.Boolean(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_sightings_alert_id'), 'sightings', ['alert_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_sightings_alert_id'), table_name='sightings')
    op.drop_table('sightings')
    op.drop_table('pet_biometric_enrollments')
    op.drop_table('pet_photos')
    op.drop_table('pets')
    op.drop_index(op.f('ix_owners_phone'), table_name='owners')
    op.drop_table('owners')
    op.execute("DROP EXTENSION IF EXISTS postgis;")
