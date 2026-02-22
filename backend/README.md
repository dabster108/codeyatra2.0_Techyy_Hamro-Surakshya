# NDRRMA Disaster Budget Transparency Dashboard - Backend

A production-ready FastAPI backend for multi-level disaster budget tracking in Nepal.

## Features
- **4-Level Tracking**: National -> Province -> District -> Beneficiary.
- **RBAC**: Roles for Super Admin, Province Admin, District Officer, and Data Entry.
- **Anti-Corruption**: Budget limit enforcement, unique beneficiary validation, and mandatory audit logging.
- **Public API**: Transparent aggregated statistics for citizens.

## Setup Instructions

### 1. Database Setup (Supabase)
- Create a new project on [Supabase.com](https://supabase.com).
- Go to the **SQL Editor** in Supabase.
- Copy the contents of `supabase_schema.sql` and run them.
- Insert initial National Budget in `budget_master` table:
```sql
INSERT INTO budget_master (fiscal_year, total_nepal_budget, ndrrma_allocation)
VALUES ('2080/81', 100000000.00, 50000000.00);
```

### 2. Environment Configuration
- Rename `.env.example` to `.env`.
- Fill in your Supabase credentials:
  - `SUPABASE_URL`: Your project URL.
  - `SUPABASE_KEY`: Your `anon` key.
  - `SUPABASE_SERVICE_ROLE_KEY`: Your `service_role` key (required for admin actions).
  - `JWT_SECRET`: A long random string.

### 3. Installation
```bash
pip install -r requirements.txt
```

### 4. Running the API
```bash
uvicorn app.main:app --reload
```

## API Documentation
Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- Redoc: `http://localhost:8000/redoc`

## Folder Structure
- `app/api`: Endpoint controllers (Routers).
- `app/core`: Security, JWT, and Config.
- `app/services`: Business logic (Budget checks, Audit logging).
- `app/models`: Pydantic validation schemas.
- `app/db`: Supabase client initialization.
