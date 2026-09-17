"""Add alerts table

Revision ID: ad8d4ee6c3e4
Revises: c5d3d3ad8d0f
Create Date: 2026-09-17 12:29:46.482279

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ad8d4ee6c3e4'
down_revision: Union[str, Sequence[str], None] = 'c5d3d3ad8d0f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('alerts',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('pet_id', sa.String(), nullable=False),
    sa.Column('status', sa.String(), nullable=False),
    sa.Column('last_seen_address', sa.String(), nullable=True),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['pet_id'], ['pets.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_foreign_key(None, 'sightings', 'alerts', ['alert_id'], ['id'])


def downgrade() -> None:
    op.drop_constraint(None, 'sightings', type_='foreignkey')
    op.drop_table('alerts')
