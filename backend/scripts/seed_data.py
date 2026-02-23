"""
Seed realistic data for Nepal disaster relief dashboard.
Run: python scripts/seed_data.py
"""
import sys
import os
import random
from datetime import datetime, timedelta

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.supabase import get_supabase_admin

sb = get_supabase_admin()

# ───────────────────────────────────────────────────────────────
# Configuration
# ───────────────────────────────────────────────────────────────
PROVINCE_MAP = {
    "koshi":         {"id": 1, "alloc": 2_100_000_000},
    "madhesh":       {"id": 2, "alloc": 1_800_000_000},
    "bagmati":       {"id": 3, "alloc": 1_900_000_000},
    "gandaki":       {"id": 4, "alloc": 1_200_000_000},
    "lumbini":       {"id": 5, "alloc": 1_100_000_000},
    "karnali":       {"id": 6, "alloc":   900_000_000},
    "sudurpashchim": {"id": 7, "alloc":   800_000_000},
}

DISTRICTS = {
    "koshi":         ["Morang", "Sunsari", "Jhapa", "Taplejung", "Ilam", "Dhankuta", "Terhathum", "Sankhuwasabha"],
    "madhesh":       ["Saptari", "Siraha", "Dhanusha", "Mahottari", "Sarlahi", "Rautahat", "Bara", "Parsa"],
    "bagmati":       ["Kathmandu", "Lalitpur", "Bhaktapur", "Sindhupalchok", "Nuwakot", "Dhading", "Chitwan", "Makwanpur"],
    "gandaki":       ["Kaski", "Tanahun", "Lamjung", "Gorkha", "Nawalpur", "Syangja", "Myagdi", "Mustang"],
    "lumbini":       ["Rupandehi", "Kapilvastu", "Palpa", "Arghakhanchi", "Gulmi", "Rolpa", "Pyuthan", "Banke"],
    "karnali":       ["Surkhet", "Dailekh", "Jajarkot", "Salyan", "Dolpa", "Humla", "Mugu", "Kalikot"],
    "sudurpashchim": ["Kailali", "Kanchanpur", "Dadeldhura", "Doti", "Bajhang", "Baitadi", "Darchula", "Bajura"],
}

DISASTER_TYPES = ["Flood", "Earthquake", "Landslide", "Drought", "Fire", "Cold Wave", "Epidemic"]

OFFICER_NAMES = [
    "Ram Bahadur Thapa", "Sita Devi Sharma", "Hari Prasad Koirala",
    "Kamala Shrestha", "Binod Kumar Yadav", "Gita Kumari Pun",
    "Narayan Prasad Bhattarai", "Sunita Gurung", "Prakash Raj Adhikari",
    "Anita Bhusal", "Deepak Karki", "Prabha Devi Oli",
]

FIRST_NAMES = [
    "Ram", "Sita", "Hari", "Kamala", "Binod", "Gita", "Narayan",
    "Sunita", "Prakash", "Anita", "Deepak", "Prabha", "Mohan",
    "Durga", "Shiva", "Laxmi", "Gopal", "Radha", "Krishna", "Saraswati",
    "Bimala", "Dil", "Mina", "Roshan", "Nisha", "Sajan", "Maya",
    "Suresh", "Meena", "Rajan", "Kabita", "Bikram", "Rekha",
]

LAST_NAMES = [
    "Thapa", "Sharma", "Koirala", "Shrestha", "Yadav", "Pun",
    "Bhattarai", "Gurung", "Adhikari", "Bhusal", "Karki", "Oli",
    "Bista", "Tamang", "Magar", "Rai", "Limbu", "Neupane",
    "Rijal", "Khanal", "Pokhrel", "Acharya", "Dhakal", "Giri",
]

random.seed(42)

def rand_name():
    return f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"

def rand_citizenship():
    return f"{random.randint(10,99)}-{random.randint(10,99)}-{random.randint(10,99)}-{random.randint(10000,99999)}"

def rand_date(days_back=365):
    base = datetime.now() - timedelta(days=random.randint(1, days_back))
    return base.isoformat()

def rand_amount(min_amt, max_amt):
    return round(random.uniform(min_amt, max_amt), 2)


# ───────────────────────────────────────────────────────────────
# Step 1: Get or create budget_master row
# ───────────────────────────────────────────────────────────────
print("Step 1: Checking budget_master...")
bm_res = sb.table("budget_master").select("id, fiscal_year, ndrrma_allocation").execute()
if bm_res.data:
    bm_id = bm_res.data[0]["id"]
    print(f"  Found existing budget_master: {bm_id} | {bm_res.data[0]['fiscal_year']}")
else:
    bm_insert = sb.table("budget_master").insert({
        "fiscal_year": "2081/82",
        "total_nepal_budget": 1_750_000_000_000,
        "ndrrma_allocation": 12_500_000_000,
    }).execute()
    bm_id = bm_insert.data[0]["id"]
    print(f"  Created budget_master: {bm_id}")


# ───────────────────────────────────────────────────────────────
# Step 2: Seed province_allocation
# ───────────────────────────────────────────────────────────────
print("\nStep 2: Seeding province_allocation...")

# Delete existing province_allocation for this budget_master
sb.table("province_allocation").delete().eq("budget_master_id", bm_id).execute()

pa_rows = []
for prov_name, prov_info in PROVINCE_MAP.items():
    alloc = prov_info["alloc"]
    released = round(alloc * random.uniform(0.65, 0.85), 2)
    pa_rows.append({
        "budget_master_id": bm_id,
        "province_id": prov_info["id"],
        "allocated_amount": alloc,
        "released_amount": released,
    })

pa_res = sb.table("province_allocation").insert(pa_rows).execute()
print(f"  Inserted {len(pa_res.data)} province_allocation rows")


# ───────────────────────────────────────────────────────────────
# Step 3: Seed relief_records
# ───────────────────────────────────────────────────────────────
print("\nStep 3: Seeding relief_records...")

# Delete existing records
existing = sb.table("relief_records").select("id").execute()
if existing.data:
    ids = [r["id"] for r in existing.data]
    # Delete in batches
    for i in range(0, len(ids), 100):
        batch = ids[i:i+100]
        for rid in batch:
            sb.table("relief_records").delete().eq("id", rid).execute()
    print(f"  Deleted {len(ids)} existing records")

# Generate realistic records
records = []
officer_counter = 1000

for prov_name, districts_list in DISTRICTS.items():
    prov_alloc = PROVINCE_MAP[prov_name]["alloc"]
    # Generate 15-30 records per province
    num_records = random.randint(15, 30)
    
    for _ in range(num_records):
        district = random.choice(districts_list)
        disaster = random.choice(DISASTER_TYPES)
        # Scale amount based on province wealth
        relief_amount = rand_amount(50_000, prov_alloc * 0.0008)
        officer_name = random.choice(OFFICER_NAMES)
        officer_counter += 1
        
        records.append({
            "full_name": rand_name(),
            "citizenship_no": rand_citizenship(),
            "relief_amount": relief_amount,
            "province": prov_name,          # lowercase to match existing data pattern
            "district": district,
            "disaster_type": disaster,
            "officer_name": officer_name,
            "officer_id": f"OFF{officer_counter}",
            "created_at": rand_date(365),
        })

# Insert in batches of 50
inserted_count = 0
for i in range(0, len(records), 50):
    batch = records[i:i+50]
    res = sb.table("relief_records").insert(batch).execute()
    inserted_count += len(res.data)
    print(f"  Inserted batch {i//50 + 1}: {len(res.data)} records")

print(f"\nTotal relief_records inserted: {inserted_count}")


# ───────────────────────────────────────────────────────────────
# Step 4: Update budget_master ndrrma_allocation to match sum
# ───────────────────────────────────────────────────────────────
total_alloc = sum(p["alloc"] for p in PROVINCE_MAP.values())
print(f"\nStep 4: Updating budget_master ndrrma_allocation to {total_alloc:,}")
sb.table("budget_master").update({"ndrrma_allocation": total_alloc}).eq("id", bm_id).execute()

print("\n✅ Seeding complete!")
print(f"   Provinces seeded: {len(PROVINCE_MAP)}")
print(f"   Relief records:   {inserted_count}")
print(f"   Total allocation: NPR {total_alloc:,.0f}")
