-- ============================================================
-- relief_records table — Direct Entry / Operational Registration
-- ============================================================

CREATE TABLE IF NOT EXISTS relief_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    citizenship_no TEXT NOT NULL,
    relief_amount NUMERIC(20, 2) NOT NULL,
    province TEXT NOT NULL,
    district TEXT NOT NULL,
    disaster_type TEXT NOT NULL,
    officer_name TEXT NOT NULL,
    officer_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast analytics queries
CREATE INDEX IF NOT EXISTS idx_relief_records_province      ON relief_records (province);
CREATE INDEX IF NOT EXISTS idx_relief_records_district      ON relief_records (district);
CREATE INDEX IF NOT EXISTS idx_relief_records_disaster_type ON relief_records (disaster_type);
CREATE INDEX IF NOT EXISTS idx_relief_records_officer_id    ON relief_records (officer_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_relief_records_updated_at ON relief_records;
CREATE TRIGGER trg_relief_records_updated_at
BEFORE UPDATE ON relief_records
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE relief_records ENABLE ROW LEVEL SECURITY;

-- Authenticated users (admin roles) can INSERT / UPDATE / DELETE
CREATE POLICY "Admins can insert relief_records"
ON relief_records FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Admins can update relief_records"
ON relief_records FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Admins can delete relief_records"
ON relief_records FOR DELETE
TO authenticated
USING (true);

-- Everyone can read (for public analytics)
CREATE POLICY "Public read relief_records"
ON relief_records FOR SELECT
USING (true);
