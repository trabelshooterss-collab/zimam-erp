import os
import psycopg2
from dotenv import load_dotenv
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent

# Load environment variables
load_dotenv(os.path.join(BASE_DIR, '.env'))

dbname = os.getenv('DB_NAME', 'zimam_db')
user = os.getenv('DB_USER', 'postgres')
password = os.getenv('DB_PASSWORD', 'postgres')
host = os.getenv('DB_HOST', 'localhost')
port = os.getenv('DB_PORT', '5432')

print(f"Connecting to database '{dbname}' on {host}:{port} as user '{user}'...")

try:
    conn = psycopg2.connect(
        dbname=dbname,
        user=user,
        password=password,
        host=host,
        port=port
    )
    conn.autocommit = True
    cur = conn.cursor()
    
    print("⚠️  WARNING: This will delete all data in the database!")
    print("Dropping schema 'public'...")
    cur.execute("DROP SCHEMA public CASCADE;")
    
    print("Recreating schema 'public'...")
    cur.execute("CREATE SCHEMA public;")
    
    print("✅ Database schema reset successfully.")
    
    cur.close()
    conn.close()

except Exception as e:
    print(f"❌ Error: {e}")
    print("Please check your .env file credentials.")
