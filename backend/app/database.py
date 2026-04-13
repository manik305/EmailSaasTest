import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv

load_dotenv()

# We expect a standard PostgreSQL connection string
# like: postgresql://user:password@localhost/dbname
# For Supabase, this is the 'Connection string' found in Project Settings -> Database
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# If DATABASE_URL is not set or is the placeholder, fallback to local sqlite for development
if not SQLALCHEMY_DATABASE_URL or "your_database_url_here" in SQLALCHEMY_DATABASE_URL:
    SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
    print("WARNING: DATABASE_URL not set or invalid. Falling back to sqlite:///./test.db")

# Automatically handling standard connection strings for postgresql
# Note: For newer versions of SQLAlchemy and PostgreSQL, you might need to use postgresql+psycopg2://
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    # check_same_thread is only needed for sqlite
    connect_args={"check_same_thread": False} if "sqlite" in SQLALCHEMY_DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
