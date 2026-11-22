"""Add share_medical_notes to pets

Revision ID: b2f1a8e9c0d3
Revises: ae440fbabbfa
Create Date: 2026-11-22 15:30:00.000000

"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'b2f1a8e9c0d3'
down_revision: str | Sequence[str] | None = 'ae440fbabbfa'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema to add share_medical_notes with safe server default."""
    op.add_column(
        'pets',
        sa.Column('share_medical_notes', sa.Boolean(), nullable=False, server_default=sa.text('false'))
    )


def downgrade() -> None:
    """Downgrade schema to drop share_medical_notes."""
    op.drop_column('pets', 'share_medical_notes')
