-- Wildfire Prediction Table for Nepal
-- This table stores predicted wildfire data with location and probability information

CREATE TABLE wildfire_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    valid_time TIMESTAMP NOT NULL,
    fire_prob DOUBLE PRECISION NOT NULL,
    prediction_class INTEGER NOT NULL, -- 0 or 1 (binary classification)
    fire_category TEXT NOT NULL, -- minimal, low, medium, high, extreme
    gapa_napa TEXT, -- Municipality name (Gaupalika/Nagarpalika)
    district TEXT NOT NULL,
    pr_name TEXT, -- Province name
    province INTEGER NOT NULL, -- Province number (1-7)
    prediction_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_wildfire_province ON wildfire_predictions(province);
CREATE INDEX idx_wildfire_district ON wildfire_predictions(district);
CREATE INDEX idx_wildfire_valid_time ON wildfire_predictions(valid_time);
CREATE INDEX idx_wildfire_prediction_date ON wildfire_predictions(prediction_date);
CREATE INDEX idx_wildfire_fire_category ON wildfire_predictions(fire_category);
CREATE INDEX idx_wildfire_location ON wildfire_predictions(latitude, longitude);

-- Create a composite index for common query patterns
CREATE INDEX idx_wildfire_province_date ON wildfire_predictions(province, prediction_date);
CREATE INDEX idx_wildfire_district_date ON wildfire_predictions(district, prediction_date);

-- View for latest predictions by district
CREATE OR REPLACE VIEW wildfire_latest_by_district AS
SELECT DISTINCT ON (district)
    district,
    province,
    pr_name,
    COUNT(*) OVER (PARTITION BY district) as total_predictions,
    AVG(fire_prob) OVER (PARTITION BY district) as avg_fire_prob,
    MAX(fire_prob) OVER (PARTITION BY district) as max_fire_prob,
    prediction_date
FROM wildfire_predictions
ORDER BY district, prediction_date DESC;

-- View for high-risk areas (medium, high, extreme)
CREATE OR REPLACE VIEW wildfire_high_risk_areas AS
SELECT 
    id,
    latitude,
    longitude,
    fire_prob,
    fire_category,
    gapa_napa,
    district,
    pr_name,
    province,
    valid_time,
    prediction_date
FROM wildfire_predictions
WHERE fire_category IN ('medium', 'high', 'extreme')
ORDER BY fire_prob DESC;

-- Add comment to table
COMMENT ON TABLE wildfire_predictions IS 'Stores wildfire prediction data for Nepal with geographic and temporal information';
