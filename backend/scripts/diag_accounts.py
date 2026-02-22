from app.db.supabase import get_supabase_admin
import json

def list_users():
    supabase = get_supabase_admin()
    res = supabase.table("users").select("email, role, province_id").execute()
    print("--- Official Accounts in Database ---")
    for user in res.data:
        print(f"Email: {user['email']} | Role: {user['role']} | Province: {user['province_id']}")

if __name__ == "__main__":
    list_users()
