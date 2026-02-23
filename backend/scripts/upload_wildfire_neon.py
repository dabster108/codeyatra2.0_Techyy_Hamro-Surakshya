import os
import sys
import pandas as pd
import psycopg2
from psycopg2.extras import execute_values
from io import StringIO
import argparse
from datetime import datetime
from dotenv import load_dotenv

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables
load_dotenv()

def get_db_connection():
    """Create database connection"""
    database_url = os.getenv('NEON_DATABASE_URL')
    if not database_url:
        raise ValueError("NEON_DATABASE_URL not found in environment variables")
    
    return psycopg2.connect(database_url)

def test_connection():
    """Test database connection"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        print(f"✅ Connected to PostgreSQL")
        print(f"📊 Version: {version[0]}")
        
        # Check if table exists
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'wildfire_predictions'
            );
        """)
        table_exists = cursor.fetchone()[0]
        
        if table_exists:
            cursor.execute("SELECT COUNT(*) FROM wildfire_predictions;")
            count = cursor.fetchone()[0]
            print(f"✅ Table 'wildfire_predictions' exists with {count} records")
        else:
            print("⚠️  Table 'wildfire_predictions' does not exist. Run the SQL schema first!")
        
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False

def upload_wildfire_csv(csv_path, batch_size=5000, use_copy=True):
    """Upload wildfire predictions from CSV to Neon database"""
    try:
        print(f"📂 Reading CSV file: {csv_path}")
        df = pd.read_csv(csv_path)
        print(f"✅ Loaded {len(df)} rows from CSV\n")
        
        # Display sample data
        print("📋 Sample data (first 2 rows):")
        print(df.head(2).to_string())
        print()
        
        # Rename columns to match database schema
        column_mapping = {
            'latitude': 'latitude',
            'longitude': 'longitude',
            'Elevation': 'elevation',
            'valid_time': 'valid_time',
            'fire_prob': 'fire_prob',
            'prediction_class': 'prediction_class',
            'fire_category': 'fire_category',
            'gapa_napa': 'gapa_napa',
            'district': 'district',
            'pr_name': 'pr_name',
            'province': 'province'
        }
        df = df.rename(columns=column_mapping)
        
        # Handle missing values - use None instead of pd.NA
        df['elevation'] = df['elevation'].fillna(0).astype(int)
        df['province'] = df['province'].fillna(0).astype(int)
        df['gapa_napa'] = df['gapa_napa'].fillna('')
        df['district'] = df['district'].fillna('')
        df['pr_name'] = df['pr_name'].fillna('')
        
        # Convert valid_time to datetime
        df['valid_time'] = pd.to_datetime(df['valid_time'])
        df['prediction_date'] = df['valid_time'].dt.date
        
        # Ensure proper data types
        df['latitude'] = df['latitude'].astype(float)
        df['longitude'] = df['longitude'].astype(float)
        df['fire_prob'] = df['fire_prob'].astype(float)
        df['prediction_class'] = df['prediction_class'].astype(int)
        
        # Connect to database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check existing data for this date
        cursor.execute("""
            SELECT COUNT(*) FROM wildfire_predictions 
            WHERE prediction_date = %s
        """, (df['prediction_date'].iloc[0],))
        existing_count = cursor.fetchone()[0]
        
        if existing_count > 0:
            print(f"⚠️  Found {existing_count} existing records for {df['prediction_date'].iloc[0]}")
            response = input("Do you want to delete existing records and upload new ones? (yes/no): ")
            if response.lower() == 'yes':
                cursor.execute("""
                    DELETE FROM wildfire_predictions 
                    WHERE prediction_date = %s
                """, (df['prediction_date'].iloc[0],))
                conn.commit()
                print(f"✅ Deleted {existing_count} existing records")
            else:
                print("❌ Upload cancelled")
                cursor.close()
                conn.close()
                return
        
        if use_copy:
            print(f"🚀 Using COPY method for fast bulk insert...")
            
            # Prepare data for COPY
            df_copy = df[[
                'latitude', 'longitude', 'elevation', 'valid_time', 'fire_prob',
                'prediction_class', 'fire_category', 'gapa_napa', 'district',
                'pr_name', 'province', 'prediction_date'
            ]].copy()
            
            # Convert to CSV string
            output = StringIO()
            df_copy.to_csv(output, sep='\t', header=False, index=False, na_rep='\\N')
            output.seek(0)
            
            # Use COPY command
            cursor.copy_from(
                output,
                'wildfire_predictions',
                columns=[
                    'latitude', 'longitude', 'elevation', 'valid_time', 'fire_prob',
                    'prediction_class', 'fire_category', 'gapa_napa', 'district',
                    'pr_name', 'province', 'prediction_date'
                ],
                sep='\t',
                null='\\N'
            )
            conn.commit()
            print(f"✅ Successfully uploaded {len(df)} records using COPY")
            
        else:
            print(f"📤 Uploading in batches of {batch_size}...")
            
            # Prepare data for batch insert
            records = []
            for _, row in df.iterrows():
                records.append((
                    float(row['latitude']),
                    float(row['longitude']),
                    int(row['elevation']),
                    row['valid_time'],
                    float(row['fire_prob']),
                    int(row['prediction_class']),
                    str(row['fire_category']),
                    str(row['gapa_napa']),
                    str(row['district']),
                    str(row['pr_name']),
                    int(row['province']),
                    row['prediction_date']
                ))
            
            # Insert in batches
            insert_query = """
                INSERT INTO wildfire_predictions (
                    latitude, longitude, elevation, valid_time, fire_prob,
                    prediction_class, fire_category, gapa_napa, district,
                    pr_name, province, prediction_date
                ) VALUES %s
            """
            
            total_inserted = 0
            for i in range(0, len(records), batch_size):
                batch = records[i:i + batch_size]
                execute_values(cursor, insert_query, batch)
                conn.commit()
                total_inserted += len(batch)
                print(f"✅ Uploaded {total_inserted}/{len(records)} records...")
            
            print(f"✅ Successfully uploaded {total_inserted} records")
        
        # Show statistics
        cursor.execute("""
            SELECT 
                COUNT(*) as total_records,
                COUNT(DISTINCT prediction_date) as unique_dates,
                MIN(fire_prob) as min_prob,
                MAX(fire_prob) as max_prob,
                AVG(fire_prob) as avg_prob,
                SUM(CASE WHEN fire_category = 'high' THEN 1 ELSE 0 END) as high_risk_count
            FROM wildfire_predictions
        """)
        stats = cursor.fetchone()
        
        print("\n📊 Database Statistics:")
        print(f"   Total Records: {stats[0]}")
        print(f"   Unique Dates: {stats[1]}")
        print(f"   Fire Probability Range: {stats[2]:.4f} - {stats[3]:.4f}")
        print(f"   Average Fire Probability: {stats[4]:.4f}")
        print(f"   High Risk Areas: {stats[5]}")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

def upload_directory(directory_path, batch_size=5000):
    """Upload all CSV files from a directory"""
    csv_files = [f for f in os.listdir(directory_path) if f.endswith('.csv')]
    
    if not csv_files:
        print(f"❌ No CSV files found in {directory_path}")
        return
    
    print(f"📁 Found {len(csv_files)} CSV files")
    
    for i, csv_file in enumerate(csv_files, 1):
        print(f"\n{'='*60}")
        print(f"Processing file {i}/{len(csv_files)}: {csv_file}")
        print('='*60)
        
        csv_path = os.path.join(directory_path, csv_file)
        upload_wildfire_csv(csv_path, batch_size)

def main():
    parser = argparse.ArgumentParser(description='Upload wildfire predictions to Neon database')
    parser.add_argument('--test', action='store_true', help='Test database connection')
    parser.add_argument('--file', type=str, help='Path to CSV file')
    parser.add_argument('--directory', type=str, help='Path to directory containing CSV files')
    parser.add_argument('--batch-size', type=int, default=5000, help='Batch size for inserts')
    parser.add_argument('--no-copy', action='store_true', help='Use INSERT instead of COPY')
    
    args = parser.parse_args()
    
    if args.test:
        test_connection()
    elif args.file:
        upload_wildfire_csv(args.file, args.batch_size, use_copy=not args.no_copy)
    elif args.directory:
        upload_directory(args.directory, args.batch_size)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()