"""
CSV Upload Script for Wildfire Predictions
This script uploads wildfire prediction CSV files to Supabase database.
"""

import pandas as pd
import sys
import os
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.supabase import get_supabase_admin
from app.core.config import settings


def upload_wildfire_csv(csv_file_path: str, batch_size: int = 1000):
    """
    Upload wildfire predictions from CSV file to Supabase.
    
    Args:
        csv_file_path: Path to the CSV file
        batch_size: Number of rows to upload in each batch (default: 1000)
    
    CSV columns expected:
        latitude, longitude, valid_time, fire_prob, prediction_class, 
        fire_category, GaPa_NaPa, DISTRICT, PR_NAME, PROVINCE, prediction_date
    """
    
    print(f"📂 Reading CSV file: {csv_file_path}")
    
    try:
        # Read CSV
        df = pd.read_csv(csv_file_path)
        print(f"✅ Loaded {len(df)} rows from CSV")
        
        # Rename columns to match database schema (lowercase with underscores)
        column_mapping = {
            'GaPa_NaPa': 'gapa_napa',
            'DISTRICT': 'district',
            'PR_NAME': 'pr_name',
            'PROVINCE': 'province'
        }
        df = df.rename(columns=column_mapping)
        
        # Convert date columns to proper format
        if 'valid_time' in df.columns:
            df['valid_time'] = pd.to_datetime(df['valid_time'])
        
        if 'prediction_date' in df.columns:
            df['prediction_date'] = pd.to_datetime(df['prediction_date'])
        
        # Ensure fire_category is lowercase
        if 'fire_category' in df.columns:
            df['fire_category'] = df['fire_category'].str.lower()
        
        # Convert DataFrame to list of dictionaries
        records = df.to_dict('records')
        
        # Initialize Supabase client
        supabase = get_supabase_admin()
        
        # Upload in batches
        total_uploaded = 0
        total_batches = (len(records) + batch_size - 1) // batch_size
        
        print(f"📤 Uploading {len(records)} records in {total_batches} batches...")
        
        for i in range(0, len(records), batch_size):
            batch = records[i:i + batch_size]
            batch_num = (i // batch_size) + 1
            
            try:
                # Insert batch into Supabase
                response = supabase.table("wildfire_predictions").insert(batch).execute()
                total_uploaded += len(batch)
                print(f"  ✅ Batch {batch_num}/{total_batches}: Uploaded {len(batch)} records (Total: {total_uploaded})")
            
            except Exception as e:
                print(f"  ❌ Error in batch {batch_num}: {str(e)}")
                print(f"     First record in failed batch: {batch[0]}")
                # Continue with next batch instead of stopping
                continue
        
        print(f"\n🎉 Upload complete! Total records uploaded: {total_uploaded}/{len(records)}")
        
        # Verify upload
        count_response = supabase.table("wildfire_predictions").select("id", count="exact").execute()
        print(f"📊 Total records in database: {count_response.count}")
        
        return total_uploaded
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise


def upload_multiple_csv_files(directory_path: str):
    """
    Upload all CSV files from a directory.
    
    Args:
        directory_path: Path to directory containing CSV files
    """
    import glob
    
    csv_files = glob.glob(os.path.join(directory_path, "*.csv"))
    
    if not csv_files:
        print(f"❌ No CSV files found in {directory_path}")
        return
    
    print(f"📁 Found {len(csv_files)} CSV files in {directory_path}\n")
    
    total_uploaded = 0
    for csv_file in csv_files:
        print(f"\n{'='*60}")
        print(f"Processing: {os.path.basename(csv_file)}")
        print('='*60)
        
        try:
            uploaded = upload_wildfire_csv(csv_file)
            total_uploaded += uploaded
        except Exception as e:
            print(f"⚠️  Skipping {csv_file} due to error: {str(e)}")
            continue
    
    print(f"\n{'='*60}")
    print(f"🎉 ALL FILES PROCESSED")
    print(f"📊 Total records uploaded from all files: {total_uploaded}")
    print('='*60)


def clear_wildfire_predictions():
    """
    Clear all records from wildfire_predictions table.
    USE WITH CAUTION!
    """
    response = input("⚠️  Are you sure you want to DELETE ALL wildfire predictions? (yes/no): ")
    
    if response.lower() == 'yes':
        supabase = get_supabase_admin()
        
        # Get count before deletion
        count_before = supabase.table("wildfire_predictions").select("id", count="exact").execute().count
        
        # Delete all records
        supabase.table("wildfire_predictions").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
        
        # Verify
        count_after = supabase.table("wildfire_predictions").select("id", count="exact").execute().count
        
        print(f"✅ Deleted {count_before} records. Remaining: {count_after}")
    else:
        print("❌ Deletion cancelled")


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Upload wildfire prediction CSV files to Supabase")
    parser.add_argument("--file", type=str, help="Path to single CSV file")
    parser.add_argument("--directory", type=str, help="Path to directory containing CSV files")
    parser.add_argument("--clear", action="store_true", help="Clear all existing records (USE WITH CAUTION)")
    parser.add_argument("--batch-size", type=int, default=1000, help="Batch size for uploads (default: 1000)")
    
    args = parser.parse_args()
    
    if args.clear:
        clear_wildfire_predictions()
    elif args.file:
        upload_wildfire_csv(args.file, args.batch_size)
    elif args.directory:
        upload_multiple_csv_files(args.directory)
    else:
        print("❌ Please provide either --file or --directory argument")
        print("\nExamples:")
        print("  python scripts/upload_wildfire_csv.py --file data/wildfire_predictions.csv")
        print("  python scripts/upload_wildfire_csv.py --directory data/wildfire_csvs/")
        print("  python scripts/upload_wildfire_csv.py --clear  # Delete all records")
        sys.exit(1)
