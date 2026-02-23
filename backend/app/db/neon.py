"""
Neon Database Connection (PostgreSQL)
For wildfire predictions and other ML prediction data
"""

from sqlalchemy import create_engine, pool
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from contextlib import contextmanager
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Generator
from app.core.config import settings

# SQLAlchemy setup
engine = create_engine(
    settings.NEON_DATABASE_URL,
    poolclass=pool.NullPool,  # Neon handles connection pooling
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# Dependency for FastAPI
def get_db() -> Generator[Session, None, None]:
    """
    Dependency for FastAPI routes to get database session.
    Usage:
        @router.get("/")
        def route(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@contextmanager
def get_db_context():
    """
    Context manager for database session.
    Usage:
        with get_db_context() as db:
            result = db.execute(...)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_neon_connection():
    """
    Get a raw psycopg2 connection to Neon database.
    Remember to close the connection when done.
    """
    return psycopg2.connect(settings.NEON_DATABASE_URL)


def execute_query(query: str, params: tuple = None, fetch_one: bool = False, fetch_all: bool = True):
    """
    Execute a SQL query and return results as dictionaries.
    
    Args:
        query: SQL query string
        params: Query parameters
        fetch_one: Return only one result
        fetch_all: Return all results (default)
    
    Returns:
        List of dictionaries or single dictionary
    """
    conn = get_neon_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(query, params or ())
            
            if fetch_one:
                return dict(cursor.fetchone()) if cursor.rowcount > 0 else None
            elif fetch_all:
                return [dict(row) for row in cursor.fetchall()]
            else:
                conn.commit()
                return cursor.rowcount
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()


def execute_many(query: str, data_list: list):
    """
    Execute a query multiple times with different parameters.
    Useful for bulk inserts.
    
    Args:
        query: SQL query with placeholders
        data_list: List of tuples/dicts with parameters
    
    Returns:
        Number of rows affected
    """
    conn = get_neon_connection()
    try:
        with conn.cursor() as cursor:
            cursor.executemany(query, data_list)
            conn.commit()
            return cursor.rowcount
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()


def test_connection():
    """
    Test if the Neon database connection is working.
    """
    try:
        conn = get_neon_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT version();")
            version = cursor.fetchone()[0]
            print(f"✅ Connected to Neon PostgreSQL: {version}")
        conn.close()
        return True
    except Exception as e:
        print(f"❌ Failed to connect to Neon: {str(e)}")
        return False
