import requests
import json
import time

BASE_URL = "http://127.0.0.1:8005"

# Colors for terminal output
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_step(message):
    print(f"\n{Colors.HEADER}{Colors.BOLD}>>> {message}{Colors.ENDC}")

def simulate_rbac():
    print(f"{Colors.OKCYAN}=== NDRRMA RBAC TERMINAL VERIFICATION ==={Colors.ENDC}")
    
    # Define test users
    test_users = [
        {
            "name": "NDRRMA HQ Admin",
            "email": "hq_admin@ndrrma.gov.np",
            "password": "password123",
            "role": "SUPER_ADMIN"
        },
        {
            "name": "Bagmati Province Admin",
            "email": "bagmati_admin@province.gov.np",
            "password": "password123",
            "role": "PROVINCE_ADMIN",
            "province_id": 3
        }
    ]

    tokens = {}

    # 1. Registration and Login
    for u in test_users:
        print_step(f"Setting up user: {u['name']} ({u['role']})")
        
        # Register
        requests.post(f"{BASE_URL}/auth/register", json=u)
        
        # Login to get JWT
        login_res = requests.post(f"{BASE_URL}/auth/login", data={"username": u['email'], "password": u['password']})
        if login_res.status_code == 200:
            tokens[u['role']] = login_res.json()['access_token']
            print(f"{Colors.OKGREEN}DONE Authenticated successfully{Colors.ENDC}")
        else:
            print(f"{Colors.FAIL}ERROR Auth failed (Check if .env Supabase keys are set!){Colors.ENDC}")
            return

    # 2. Test Access - SUPER_ADMIN
    print_step("TESTING: SUPER_ADMIN (HQ) ACCESS")
    headers_hq = {"Authorization": f"Bearer {tokens['SUPER_ADMIN']}"}
    
    # Can see National
    res = requests.get(f"{BASE_URL}/dashboard/national", headers=headers_hq)
    print(f"National Dashboard: {Colors.OKGREEN if res.status_code == 200 else Colors.FAIL}{res.status_code}{Colors.ENDC}")
    
    # Can see any Province
    res = requests.get(f"{BASE_URL}/dashboard/province/3", headers=headers_hq)
    print(f"Province 3 Dashboard: {Colors.OKGREEN if res.status_code == 200 else Colors.FAIL}{res.status_code}{Colors.ENDC}")

    # 3. Test Access - PROVINCE_ADMIN
    print_step("TESTING: PROVINCE_ADMIN (Bagmati) ACCESS")
    headers_p3 = {"Authorization": f"Bearer {tokens['PROVINCE_ADMIN']}"}
    
    # Should be forbidden for National
    res = requests.get(f"{BASE_URL}/dashboard/national", headers=headers_p3)
    print(f"National Dashboard (Expected 403): {Colors.OKGREEN if res.status_code == 403 else Colors.FAIL}{res.status_code}{Colors.ENDC}")
    
    # Should see THEIR OWN province (3)
    res = requests.get(f"{BASE_URL}/dashboard/province/3", headers=headers_p3)
    print(f"Own Province (3) Dashboard: {Colors.OKGREEN if res.status_code == 200 else Colors.FAIL}{res.status_code}{Colors.ENDC}")
    
    # Should NOT see OTHER province (1)
    res = requests.get(f"{BASE_URL}/dashboard/province/1", headers=headers_p3)
    print(f"Other Province (1) Dashboard (Expected 403): {Colors.OKGREEN if res.status_code == 403 else Colors.FAIL}{res.status_code}{Colors.ENDC}")

if __name__ == "__main__":
    simulate_rbac()
