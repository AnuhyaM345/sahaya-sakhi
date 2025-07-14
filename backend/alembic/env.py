from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

import os
import sys
from dotenv import load_dotenv
import models

# Set up project base path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Load environment variables
load_dotenv()

# Alembic Config object
config = context.config

# Set sqlalchemy.url dynamically using sync DB URL from .env
config.set_main_option("sqlalchemy.url", os.getenv("SYNC_DATABASE_URL"))

# Logging configuration
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Import Base and models
from database import Base
import models  # ensure __init__.py exists if models is a folder

# Set target metadata
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
