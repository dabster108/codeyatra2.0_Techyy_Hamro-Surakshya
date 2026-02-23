-- SOS Emergency Alerts – minimal table
-- Citizen taps SOS → row inserted with name + GPS → gov/province sees it

CREATE TABLE IF NOT EXISTS sos_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL DEFAULT 'Unknown Citizen',
    contact_number TEXT DEFAULT 'N/A',
    gps_lat DOUBLE PRECISION,
    gps_long DOUBLE PRECISION,
    status TEXT NOT NULL DEFAULT 'pending',      -- pending | acknowledged | dispatched | resolved | cancelled
    response_team TEXT,
    notes TEXT,
    acknowledged_at TIMESTAMPTZ,
    dispatched_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sos_status ON sos_requests(status);
CREATE INDEX IF NOT EXISTS idx_sos_created ON sos_requests(created_at DESC);
