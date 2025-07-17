"""Initial migration

Revision ID: ea457ff96bcc
Revises: 
Create Date: 2025-04-12 01:33:13.223405
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'ea457ff96bcc'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Creating tables as per your models
    op.create_table('users',
    sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('users_id_seq'::regclass)"), autoincrement=True, nullable=False),
    sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('email', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('password', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('role', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='users_pkey'),
    postgresql_ignore_search_path=False
    )
    op.create_index('ix_users_id', 'users', ['id'], unique=False)
    op.create_index('ix_users_email', 'users', ['email'], unique=True)

    op.create_table('talent_categories',
    sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('talent_categories_id_seq'::regclass)"), autoincrement=True, nullable=False),
    sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('description', sa.TEXT(), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='talent_categories_pkey'),
    postgresql_ignore_search_path=False
    )

    op.create_table('career_paths',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('description', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('talent_category_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['talent_category_id'], ['talent_categories.id'], name='career_paths_talent_category_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='career_paths_pkey')
    )

    op.create_table('courses',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('title', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('description', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('link', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('career_path_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['career_path_id'], ['career_paths.id'], name='courses_career_path_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='courses_pkey')
    )

    op.create_table('questions',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('question_text', sa.TEXT(), autoincrement=False, nullable=False),
    sa.Column('category', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='questions_pkey')
    )

    op.create_table('responses',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('question_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('answer', sa.TEXT(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['question_id'], ['questions.id'], name='responses_question_id_fkey'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='responses_user_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='responses_pkey')
    )

    op.create_table('user_talent_association',
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('talent_category_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['talent_category_id'], ['talent_categories.id'], name='user_talent_association_talent_category_id_fkey'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='user_talent_association_user_id_fkey')
    )

def downgrade() -> None:
    """Downgrade schema."""
    # Dropping all tables (if rollback is needed)
    op.drop_table('user_talent_association')
    op.drop_table('responses')
    op.drop_table('courses')
    op.drop_table('career_paths')
    op.drop_table('questions')
    op.drop_table('talent_categories')
    op.drop_index('ix_users_email', table_name='users')
    op.drop_index('ix_users_id', table_name='users')
    op.drop_table('users')
