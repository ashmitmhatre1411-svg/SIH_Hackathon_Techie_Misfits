"""Single source of the SQLAlchemy engine, session factory, and
declarative Base access for the whole project. Every other file —
ai/tools.py, database/SeedScript.py, backend routes — imports
SessionLocal / get_db from HERE instead of building its own engine.
Switching from SQLite to Postgres later means changing DATABASE_URL
in .env — nothing else in the codebase moves."""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database.models import Base

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./standards.db")

# check_same_thread is only needed for SQLite; harmless to gate on it
# so this also works unchanged if DATABASE_URL later points at Postgres.
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db() -> None:
    """Creates any tables that don't exist yet. Safe to call
    repeatedly — never drops or alters existing tables."""
    Base.metadata.create_all(bind=engine)


def get_db():
    """FastAPI dependency: yields a session, always closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
