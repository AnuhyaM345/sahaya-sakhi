"""Add options column to questions table

Revision ID: 680bc172ec99
Revises: 64411ee8b736
Create Date: 2025-04-12 17:16:48.558998
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '680bc172ec99'
down_revision: Union[str, None] = '64411ee8b736'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add options column to questions table
    op.add_column('questions', sa.Column('options', postgresql.JSON(astext_type=sa.Text()), nullable=True))

    # If needed, you can add a constraint or index for the new column
    # op.create_index('ix_questions_options', 'questions', ['options'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    # Remove options column from questions table
    op.drop_column('questions', 'options')
