"""Add location to sightings

Revision ID: c5d3d3ad8d0f
Revises: 57e8908c9b17
Create Date: 2026-09-17 12:14:48.387620

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import geoalchemy2


# revision identifiers, used by Alembic.
revision: str = 'c5d3d3ad8d0f'
down_revision: Union[str, Sequence[str], None] = '57e8908c9b17'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('sightings', sa.Column('location', sa.String(), nullable=False))
    op.alter_column('sightings', 'location_geom',
               existing_type=geoalchemy2.types.Geography(geometry_type='POINT', srid=4326, dimension=2, from_text='ST_GeogFromText', name='geography', nullable=False, _spatial_index_reflected=True),
               nullable=True)


def downgrade() -> None:
    op.alter_column('sightings', 'location_geom',
               existing_type=geoalchemy2.types.Geography(geometry_type='POINT', srid=4326, dimension=2, from_text='ST_GeogFromText', name='geography', nullable=False, _spatial_index_reflected=True),
               nullable=False)
    op.drop_column('sightings', 'location')
