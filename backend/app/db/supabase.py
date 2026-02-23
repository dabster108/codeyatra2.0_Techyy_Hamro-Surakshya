import httpx
from supabase import create_client, Client
from app.core.config import settings

# Use a shared httpx client with a hard 7-second timeout so Supabase calls
# never hang indefinitely inside a FastAPI async endpoint.
_HTTP_TIMEOUT = httpx.Timeout(7.0, connect=5.0)

# Singleton clients — reuse connections across requests instead of
# creating a new client (and new connection pool) on every call.
_supabase_client: Client | None = None
_supabase_admin_client: Client | None = None


def _make_client(key: str) -> Client:
    client = create_client(settings.SUPABASE_URL, key)
    try:
        client.postgrest.session.timeout = _HTTP_TIMEOUT
    except Exception:
        pass
    return client


def get_supabase() -> Client:
    global _supabase_client
    if _supabase_client is None:
        _supabase_client = _make_client(settings.SUPABASE_KEY)
    return _supabase_client


def get_supabase_admin() -> Client:
    global _supabase_admin_client
    if _supabase_admin_client is None:
        _supabase_admin_client = _make_client(settings.SUPABASE_SERVICE_ROLE_KEY)
    return _supabase_admin_client
