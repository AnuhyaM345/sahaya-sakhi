"""Updated schema to match models

Revision ID: 64411ee8b736
Revises: ea457ff96bcc
Create Date: 2025-04-12 16:47:07.880190
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '64411ee8b736'
down_revision: Union[str, None] = 'ea457ff96bcc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema: drop old tables and constraints cleanly."""
    
    # Drop foreign key constraints before dropping tables
    op.drop_constraint('user_career_recommendations_career_id_fkey', 'user_career_recommendations', type_='foreignkey')
    op.drop_constraint('courses_career_path_id_fkey', 'courses', type_='foreignkey')
    op.drop_constraint('user_talent_association_talent_category_id_fkey', 'user_talent_association', type_='foreignkey')
    op.drop_constraint('user_answers_question_id_fkey', 'user_answers', type_='foreignkey')
    op.drop_constraint('user_answers_user_id_fkey', 'user_answers', type_='foreignkey')
    op.drop_constraint('user_career_recommendations_user_id_fkey', 'user_career_recommendations', type_='foreignkey')
    
    # Drop tables in safe dependency order (dependent tables first)
    op.drop_table('user_career_recommendations')
    op.drop_table('user_talent_association')
    op.drop_table('courses')
    op.drop_table('career_paths')
    op.drop_table('talent_categories')
    op.drop_table('questions')
    op.drop_table('user_answers')
    op.drop_table('users')


def downgrade() -> None:
    """Downgrade schema: recreate tables and constraints in correct order."""
    
    # Recreate users table (base table)
    op.create_table('users',
        sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('users_id_seq'::regclass)"), autoincrement=True, nullable=False),
        sa.Column('name', sa.VARCHAR(), nullable=False),
        sa.Column('email', sa.VARCHAR(), nullable=False),
        sa.Column('password', sa.VARCHAR(), nullable=False),
        sa.Column('role', sa.VARCHAR(), nullable=True),
        sa.PrimaryKeyConstraint('id', name='users_pkey'),
        postgresql_ignore_search_path=False
    )
    op.create_index('ix_users_id', 'users', ['id'], unique=False)
    op.create_index('ix_users_email', 'users', ['email'], unique=True)

    # Recreate talent_categories table (base table)
    op.create_table('talent_categories',
        sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('talent_categories_id_seq'::regclass)"), autoincrement=True, nullable=False),
        sa.Column('name', sa.VARCHAR(), nullable=False),
        sa.Column('description', sa.TEXT(), nullable=True),
        sa.PrimaryKeyConstraint('id', name='talent_categories_pkey'),
        postgresql_ignore_search_path=False
    )

    # Recreate career_paths table (depends on talent_categories)
    op.create_table('career_paths',
        sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('name', sa.VARCHAR(), nullable=False),
        sa.Column('description', sa.TEXT(), nullable=True),
        sa.Column('talent_category_id', sa.INTEGER(), nullable=True),
        sa.ForeignKeyConstraint(['talent_category_id'], ['talent_categories.id'], name='career_paths_talent_category_id_fkey'),
        sa.PrimaryKeyConstraint('id', name='career_paths_pkey')
    )

    # Recreate courses table (depends on career_paths)
    op.create_table('courses',
        sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('title', sa.VARCHAR(), nullable=False),
        sa.Column('description', sa.TEXT(), nullable=True),
        sa.Column('link', sa.VARCHAR(), nullable=True),
        sa.Column('career_path_id', sa.INTEGER(), nullable=True),
        sa.ForeignKeyConstraint(['career_path_id'], ['career_paths.id'], name='courses_career_path_id_fkey'),
        sa.PrimaryKeyConstraint('id', name='courses_pkey')
    )

    # Recreate user_career_recommendations table (depends on users and career_paths)
    op.create_table('user_career_recommendations',
        sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.INTEGER(), nullable=False),
        sa.Column('career_id', sa.INTEGER(), nullable=False),
        sa.Column('score', sa.DOUBLE_PRECISION(precision=53), nullable=False),
        sa.ForeignKeyConstraint(['career_id'], ['career_paths.id'], name='user_career_recommendations_career_id_fkey'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='user_career_recommendations_user_id_fkey'),
        sa.PrimaryKeyConstraint('id', name='user_career_recommendations_pkey')
    )

    # Recreate questions table (standalone)
    op.create_table('questions',
        sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('questions_id_seq'::regclass)"), autoincrement=True, nullable=False),
        sa.Column('question_text', sa.TEXT(), nullable=False),
        sa.Column('category', sa.VARCHAR(), nullable=True),
        sa.PrimaryKeyConstraint('id', name='questions_pkey'),
        postgresql_ignore_search_path=False
    )

    # Recreate user_answers table (depends on users and questions)
    op.create_table('user_answers',
        sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.INTEGER(), nullable=False),
        sa.Column('question_id', sa.INTEGER(), nullable=False),
        sa.Column('answer_value', sa.DOUBLE_PRECISION(precision=53), nullable=False),
        sa.ForeignKeyConstraint(['question_id'], ['questions.id'], name='user_answers_question_id_fkey'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='user_answers_user_id_fkey'),
        sa.PrimaryKeyConstraint('id', name='user_answers_pkey')
    )
    op.create_index('ix_user_answers_user_id', 'user_answers', ['user_id'], unique=False)

    # Recreate user_talent_association table (depends on users and talent_categories)
    op.create_table('user_talent_association',
        sa.Column('user_id', sa.INTEGER(), nullable=True),
        sa.Column('talent_category_id', sa.INTEGER(), nullable=True),
        sa.ForeignKeyConstraint(['talent_category_id'], ['talent_categories.id'], name='user_talent_association_talent_category_id_fkey'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='user_talent_association_user_id_fkey')
    )
