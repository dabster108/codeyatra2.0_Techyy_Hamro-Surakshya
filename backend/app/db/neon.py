"""
Neon Database Connection (PostgreSQL)
For wildfire predictions and other ML prediction data
"""

from sqlalchemy import create_engine, pool
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from contextlib import contextmanager
import asyncpg
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Generator, Optional, Any
from app.core.config import settings

# ─── Async connection pool (asyncpg) ──────────────────────────────────────────
# A single pool is shared for the entire application lifetime, eliminating the
# per-request TCP connection overhead that causes slow first-response times.

_pool: Optional[asyncpg.Pool] = None


async def init_neon_pool() -> None:
    """
    Create the asyncpg connection pool.
    Must be called once at application startup (via FastAPI lifespan).
    """
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(
            settings.NEON_DATABASE_URL,
            min_size=2,          # keep 2 connections ready at all times
            max_size=10,         # allow up to 10 concurrent DB connections
            command_timeout=30,
            # Required by Neon / PgBouncer: disable prepared-statement caching
            statement_cache_size=0,
        )


async def close_neon_pool() -> None:
    """
    Close the asyncpg connection pool.
    Must be called at application shutdown (via FastAPI lifespan).
    """
    global _pool
    if _pool:
        await _pool.close()
        _pool = None


def _convert_placeholders(query: str) -> str:
    """
    Replace %s placeholders with $1, $2, … for asyncpg.
    Queries that already use $N notation are left untouched.
    """
    if "%s" not in query:
        return query
    result = []
    count = 0
    i = 0
    while i < len(query):
        if query[i: i + 2] == "%s":
            count += 1
            result.append(f"${count}")
            i += 2
        else:
            result.append(query[i])
            i += 1
    return "".join(result)


async def execute_query_async(
    query: str,
    params: tuple = None,
    fetch_one: bool = False,
) -> Any:
    """
    Execute a SQL query **asynchronously** using the asyncpg pool.

    * Automatically converts %s placeholders to $1/$2/… style.
    * Queries using $N notation (standard PostgreSQL) work as-is.
    * fetch_one=True  → returns a single dict or None
    * fetch_one=False → returns a list of dicts  (default)

    This must be awaited from an async context (FastAPI route handlers).
    """
    global _pool
    if _pool is None:
        await init_neon_pool()

    # asyncpg requires PostgreSQL $N placeholders
    converted_query = _convert_placeholders(query)

    async with _pool.acquire() as conn:
        if fetch_one:
            row = await conn.fetchrow(converted_query, *(params or ()))
            return dict(row) if row else None
        else:
            rows = await conn.fetch(converted_query, *(params or ()))
            return [dict(row) for row in rows]


# ─── SQLAlchemy setup (kept for non-wildfire routes) ──────────────────────────

engine = create_engine(
    settings.NEON_DATABASE_URL,
    poolclass=pool.NullPool,  # Neon handles connection pooling
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that yields a SQLAlchemy session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@contextmanager
def get_db_context():
    """Context-manager version of get_db for use outside of FastAPI DI."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ─── Legacy synchronous helpers (kept for scripts / non-route usage) ──────────

def get_neon_connection():
    """
    Open a raw psycopg2 connection.  Close it when done.
    Prefer execute_query_async in route handlers.
    """
    return psycopg2.connect(settings.NEON_DATABASE_URL)


def execute_query(query: str, params: tuple = None, fetch_one: bool = False, fetch_all: bool = True):
    """
    Synchronous query helper (psycopg2).

    ⚠️  Calling this from an async FastAPI route handler blocks the event loop.
    Use execute_query_async instead in route handlers.
    Kept here for CLI scripts and backward compatibility.
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
