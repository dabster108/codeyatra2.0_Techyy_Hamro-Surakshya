from app.db.supabase import get_supabase_admin
from app.models.schemas import AuditLogCreate

async def log_action(log_data: AuditLogCreate):
    supabase = get_supabase_admin()
    data = {
        "user_id": log_data.user_id,
        "action": log_data.action,
        "table_name": log_data.table_name,
        "record_id": log_data.record_id,
        "old_data": log_data.old_data,
        "new_data": log_data.new_data
    }
    supabase.table("audit_log").insert(data).execute()
