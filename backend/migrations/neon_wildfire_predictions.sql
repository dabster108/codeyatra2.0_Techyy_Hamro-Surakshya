-- Wildfire Prediction Table for Neon Database (PostgreSQL)
-- Run this SQL in Neon SQL Editor or via psql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create wildfire predictions table
CREATE TABLE IF NOT EXISTS wildfire_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    elevation INTEGER,
    valid_time TIMESTAMP NOT NULL,
    fire_prob DOUBLE PRECISION NOT NULL CHECK (fire_prob >= 0 AND fire_prob <= 1),
    prediction_class INTEGER NOT NULL CHECK (prediction_class IN (0, 1)),
    fire_category VARCHAR(20) NOT NULL CHECK (fire_category IN ('minimal', 'low', 'medium', 'high', 'extreme')),
    gapa_napa VARCHAR(255),
    district VARCHAR(100) NOT NULL,
    pr_name VARCHAR(100),
    province DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_wildfire_province ON wildfire_predictions(province);
CREATE INDEX IF NOT EXISTS idx_wildfire_district ON wildfire_predictions(district);
CREATE INDEX IF NOT EXISTS idx_wildfire_valid_time ON wildfire_predictions(valid_time);
CREATE INDEX IF NOT EXISTS idx_wildfire_fire_category ON wildfire_predictions(fire_category);
CREATE INDEX IF NOT EXISTS idx_wildfire_location ON wildfire_predictions(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_wildfire_fire_prob ON wildfire_predictions(fire_prob DESC);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_wildfire_province_date ON wildfire_predictions(province, valid_time);
CREATE INDEX IF NOT EXISTS idx_wildfire_district_date ON wildfire_predictions(district, valid_time);

-- View for latest predictions by district
CREATE OR REPLACE VIEW wildfire_latest_by_district AS
SELECT DISTINCT ON (district)
    district,
    province,
    pr_name,
    COUNT(*) OVER (PARTITION BY district) as total_predictions,
    AVG(fire_prob) OVER (PARTITION BY district) as avg_fire_prob,
    MAX(fire_prob) OVER (PARTITION BY district) as max_fire_prob,
    valid_time
FROM wildfire_predictions
ORDER BY district, valid_time DESC;

-- View for high-risk areas (medium, high, extreme)
CREATE OR REPLACE VIEW wildfire_high_risk_areas AS
SELECT 
    id,
    latitude,
    longitude,
    elevation,
    fire_prob,
    fire_category,
    gapa_napa,
    district,
    pr_name,
    province,
    valid_time,
    created_at
FROM wildfire_predictions
WHERE fire_category IN ('medium', 'high', 'extreme')
ORDER BY fire_prob DESC;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_wildfire_predictions_updated_at 
    BEFORE UPDATE ON wildfire_predictions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE wildfire_predictions IS 'Stores wildfire prediction data for Nepal with geographic and temporal information';
COMMENT ON COLUMN wildfire_predictions.elevation IS 'Elevation in meters';
COMMENT ON COLUMN wildfire_predictions.fire_prob IS 'Fire probability (0-1)';
COMMENT ON COLUMN wildfire_predictions.prediction_class IS 'Binary classification: 0=no fire, 1=fire';
COMMENT ON COLUMN wildfire_predictions.fire_category IS 'Risk category: minimal, low, medium, high, extreme';

-- Create a function to get statistics
CREATE OR REPLACE FUNCTION get_wildfire_stats()
RETURNS TABLE (
    total_predictions BIGINT,
    avg_fire_prob DOUBLE PRECISION,
    max_fire_prob DOUBLE PRECISION,
    min_fire_prob DOUBLE PRECISION,
    high_risk_count BIGINT,
    provinces_affected BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_predictions,
        AVG(fire_prob) as avg_fire_prob,
        MAX(fire_prob) as max_fire_prob,
        MIN(fire_prob) as min_fire_prob,
        COUNT(*) FILTER (WHERE fire_category IN ('medium', 'high', 'extreme'))::BIGINT as high_risk_count,
        COUNT(DISTINCT province)::BIGINT as provinces_affected
    FROM wildfire_predictions;
END;
$$ LANGUAGE plpgsql;

-- Success message
DO $$ 
BEGIN 
    RAISE NOTICE '✅ Wildfire predictions table created successfully!';
    RAISE NOTICE '📊 Views created: wildfire_latest_by_district, wildfire_high_risk_areas';
    RAISE NOTICE '🔧 Function created: get_wildfire_stats()';
END $$;
