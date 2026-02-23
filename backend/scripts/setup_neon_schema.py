"""
Setup script to create the wildfire_predictions table in Neon database
"""

import os
import sys
import psycopg2
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_schema():
    """Create the wildfire_predictions table and related objects"""
    
    database_url = os.getenv('NEON_DATABASE_URL')
    if not database_url:
        print("❌ NEON_DATABASE_URL not found in .env file")
        return False
    
    try:
        print("🔗 Connecting to Neon database...")
        conn = psycopg2.connect(database_url)
        conn.autocommit = True
        cursor = conn.cursor()
        
        print("📋 Creating schema...")
        
        # Enable UUID extension
        cursor.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
        print("✅ UUID extension enabled")
        
        # Create table
        cursor.execute("""
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
                prediction_date DATE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        """)
        print("✅ Table 'wildfire_predictions' created")
        
        # Create indexes
        indexes = [
            ("idx_wildfire_province", "province"),
            ("idx_wildfire_district", "district"),
            ("idx_wildfire_valid_time", "valid_time"),
            ("idx_wildfire_fire_category", "fire_category"),
            ("idx_wildfire_fire_prob", "fire_prob DESC"),
            ("idx_wildfire_prediction_date", "prediction_date"),
        ]
        
        for idx_name, idx_column in indexes:
            cursor.execute(f"""
                CREATE INDEX IF NOT EXISTS {idx_name} 
                ON wildfire_predictions({idx_column});
            """)
        print(f"✅ Created {len(indexes)} indexes")
        
        # Create composite indexes
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_wildfire_province_date 
            ON wildfire_predictions(province, valid_time);
        """)
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_wildfire_district_date 
            ON wildfire_predictions(district, valid_time);
        """)
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_wildfire_location 
            ON wildfire_predictions(latitude, longitude);
        """)
        print("✅ Created composite indexes")
        
        # Create views
        cursor.execute("""
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
        """)
        print("✅ Created view 'wildfire_latest_by_district'")
        
        cursor.execute("""
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
        """)
        print("✅ Created view 'wildfire_high_risk_areas'")
        
        # Create function for statistics
        cursor.execute("""
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
        """)
        print("✅ Created function 'get_wildfire_stats()'")
        
        # Verify
        cursor.execute("""
            SELECT table_name FROM information_schema.tables 
            WHERE table_name = 'wildfire_predictions';
        """)
        if cursor.fetchone():
            print("\n🎉 Schema setup complete!")
            print("✅ Ready to upload CSV data")
            return True
        else:
            print("❌ Table verification failed")
            return False
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    print("="*60)
    print("Neon Database Schema Setup for Wildfire Predictions")
    print("="*60)
    print()
    
    if create_schema():
        print("\n✅ You can now upload CSV files using:")
        print('   python scripts/upload_wildfire_neon.py --file "your_file.csv"')
    else:
        print("\n❌ Setup failed. Please check your NEON_DATABASE_URL in .env")
