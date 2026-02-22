-- NDRRMA Disaster Budget Transparency Dashboard Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ROLES TYPE
CREATE TYPE user_role AS ENUM (
    'SUPER_ADMIN', 
    'PROVINCE_ADMIN', 
    'DISTRICT_OFFICER', 
    'DATA_ENTRY_OFFICER', 
    'PUBLIC_VIEW'
);

-- USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'PUBLIC_VIEW',
    province_id INTEGER,
    district_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BUDGET MASTER (National level)
CREATE TABLE budget_master (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fiscal_year TEXT UNIQUE NOT NULL, -- e.g., "2080/81"
    total_nepal_budget NUMERIC(20, 2) NOT NULL,
    ndrrma_allocation NUMERIC(20, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PROVINCE ALLOCATION
CREATE TABLE province_allocation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    budget_master_id UUID REFERENCES budget_master(id),
    province_id INTEGER NOT NULL, -- 1 to 7
    allocated_amount NUMERIC(20, 2) NOT NULL DEFAULT 0,
    released_amount NUMERIC(20, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(budget_master_id, province_id)
);

-- DISTRICT ALLOCATION
CREATE TABLE district_allocation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    province_allocation_id UUID REFERENCES province_allocation(id),
    district_id INTEGER NOT NULL,
    allocated_amount NUMERIC(20, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(province_allocation_id, district_id)
);

-- BENEFICIARY
CREATE TABLE beneficiary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    citizenship_number TEXT UNIQUE NOT NULL,
    province_id INTEGER NOT NULL,
    district_id INTEGER NOT NULL,
    ward INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RELIEF DISTRIBUTION
CREATE TABLE relief_distribution (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beneficiary_id UUID REFERENCES beneficiary(id),
    district_allocation_id UUID REFERENCES district_allocation(id),
    disaster_type TEXT NOT NULL, -- Earthquake, Flood, etc.
    relief_type TEXT NOT NULL, -- Cash, Food, Shelter, etc.
    amount NUMERIC(20, 2) NOT NULL DEFAULT 0,
    officer_id UUID REFERENCES users(id),
    gps_lat DOUBLE PRECISION,
    gps_long DOUBLE PRECISION,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AUDIT LOG
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action TEXT NOT NULL, -- CREATE, UPDATE
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Views for Computations (Used/Remaining)

-- Province Utilization View
CREATE OR REPLACE VIEW province_utilization AS
SELECT 
    pa.id as province_allocation_id,
    pa.province_id,
    pa.allocated_amount as allocated,
    COALESCE(SUM(da.allocated_amount), 0) as used,
    (pa.allocated_amount - COALESCE(SUM(da.allocated_amount), 0)) as remaining
FROM province_allocation pa
LEFT JOIN district_allocation da ON pa.id = da.province_allocation_id
GROUP BY pa.id, pa.province_id, pa.allocated_amount;

-- District Utilization View
CREATE OR REPLACE VIEW district_utilization AS
SELECT 
    da.id as district_allocation_id,
    da.district_id,
    da.allocated_amount as allocated,
    COALESCE(SUM(rd.amount), 0) as used,
    (da.allocated_amount - COALESCE(SUM(rd.amount), 0)) as remaining
FROM district_allocation da
LEFT JOIN relief_distribution rd ON da.id = rd.district_allocation_id
GROUP BY da.id, da.district_id, da.allocated_amount;

-- PROVINCES OF NEPAL REFERENCE:
-- 1: Koshi, 2: Madhesh, 3: Bagmati, 4: Gandaki, 5: Lumbini, 6: Karnali, 7: Sudurpashchim
