# 🇳🇵 Hamro Suraksha — हाम्रो सुरक्षा

> **Smart Disaster Management & Public Transparency Platform for Nepal**

Hamro Suraksha is a full-stack, multi-platform disaster management system built for Nepal. It combines real-time alerting, AI-based risk prediction, emergency SOS, transparent fund tracking, and a government admin dashboard — all in one unified platform.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green?logo=fastapi)](https://fastapi.tiangolo.com)
[![Expo](https://img.shields.io/badge/Expo-54-blue?logo=expo)](https://expo.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss)](https://tailwindcss.com)

---

## Table of Contents

- [Overview](#overview)
- [Repository Structure](#repository-structure)
- [Tech Stack](#tech-stack)
- [Core Modules](#core-modules)
- [Data Flow](#data-flow)
- [Getting Started](#getting-started)
  - [Backend Setup](#1-backend-python--fastapi)
  - [Web App Setup](#2-web-app-nextjs)
  - [Mobile App Setup](#3-mobile-app-expo--react-native)
  - [Aid Dashboard Setup](#4-aid-dashboard-nextjs)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Database](#database)
- [UI & Design](#ui--design)
- [Contributing](#contributing)

---

## Overview

Nepal is one of the most disaster-prone countries in the world, facing annual floods, landslides, earthquakes, and wildfires. Hamro Suraksha addresses this by creating a closed-loop system:

```
AI Predicts Risk → Alert Sent → Citizens Report → Dashboard Notified
→ SOS Dispatched → Rescue Deployed → Evacuation Activated
→ Relief Funds Allocated → Public Tracks via Transparency Module
```

The platform serves **three audiences**:

- **Citizens** — real-time alerts, SOS, incident reporting, evacuation guidance
- **Government Officials** — admin dashboard, resource management, announcements
- **General Public** — fund transparency, disaster statistics, relief tracking

---

## Repository Structure

```
Hamro-Surakshya/
│
├── backend/                        # Python FastAPI backend
│   ├── app/
│   │   ├── main.py                 # App entry point, CORS, router registration
│   │   ├── api/                    # Route controllers
│   │   │   ├── auth.py             # Authentication & JWT
│   │   │   ├── blockchain.py       # Solana blockchain endpoints
│   │   │   ├── dashboard.py        # Admin dashboard API
│   │   │   ├── government.py       # Province/government dashboards
│   │   │   ├── predictions.py      # Disaster predictions (Supabase)
│   │   │   ├── predictions_neon.py # Wildfire predictions (Neon DB)
│   │   │   ├── public.py           # Public-facing stats API
│   │   │   ├── records.py          # Beneficiary records
│   │   │   ├── relief.py           # Relief fund management
│   │   │   └── sos.py              # SOS alert handling
│   │   ├── core/
│   │   │   ├── config.py           # App settings & env vars
│   │   │   └── security.py         # Password hashing, JWT utils
│   │   ├── db/
│   │   │   ├── supabase.py         # Supabase client
│   │   │   └── neon.py             # Neon (asyncpg) connection pool
│   │   ├── models/
│   │   │   └── schemas.py          # Pydantic request/response schemas
│   │   └── services/
│   │       ├── audit_service.py    # Audit log writes
│   │       ├── blockchain_service.py # Solana transaction logic
│   │       └── budget_service.py   # Budget limit validation
│   ├── migrations/                 # SQL migration files
│   │   ├── supabase_schema.sql
│   │   ├── sos_requests.sql
│   │   ├── relief_records.sql
│   │   ├── wildfire_predictions.sql
│   │   ├── neon_wildfire_predictions.sql
│   │   └── add_blockchain_columns.sql
│   ├── scripts/                    # Utility & seed scripts
│   │   ├── seed_data.py
│   │   ├── setup_neon_schema.py
│   │   ├── upload_wildfire_csv.py
│   │   ├── upload_wildfire_neon.py
│   │   ├── verify_rbac.py
│   │   └── diag_accounts.py
│   ├── requirements.txt
│   ├── .env                        # Environment variables (not committed)
│   └── README.md
│
├── web/                            # Next.js 16 web application
│   ├── app/
│   │   ├── layout.js               # Root layout (Navbar, fonts)
│   │   ├── page.js                 # Landing page
│   │   ├── globals.css
│   │   ├── alerts/page.js          # Module 1: Disaster Alerts
│   │   ├── predictions/page.js     # Module 2: AI Predictions
│   │   ├── sos/page.js             # Module 5: Emergency SOS
│   │   ├── transparency/page.js    # Module 7: Fund Transparency
│   │   ├── government/             # Module 4: Government dashboard
│   │   ├── chatbot/page.js         # AI chatbot
│   │   ├── login/                  # Authentication pages
│   │   ├── province/               # Province-level data views
│   │   ├── api/
│   │   │   └── chat/               # Chatbot API route
│   │   └── components/
│   │       ├── Navbar.js
│   │       ├── Footer.js
│   │       ├── NepalMap.js
│   │       ├── EarthGlobe.js       # Three.js globe component
│   │       ├── AnimateOnView.js
│   │       └── Providers.js
│   ├── public/                     # Static assets
│   ├── tailwind.config.mjs
│   ├── next.config.mjs
│   ├── package.json
│   └── .env                        # Environment variables (not committed)
│
├── web/aid/                        # Aid Distribution Dashboard (TypeScript)
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Overview
│   │   ├── overview/
│   │   ├── beneficiaries/
│   │   ├── provinces/
│   │   ├── activity-log/
│   │   └── settings/
│   ├── components/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   ├── province/
│   │   └── providers/
│   ├── lib/
│   │   ├── api.ts
│   │   ├── data.ts
│   │   ├── nepal-districts.ts
│   │   └── utils.ts
│   └── package.json
│
└── app/hamrosuraksha/              # Expo React Native mobile app
    ├── app/
    │   ├── _layout.tsx             # Root layout
    │   ├── index.tsx               # Entry / onboarding
    │   ├── home.tsx                # Home screen
    │   ├── alert.tsx               # Alerts screen
    │   ├── dashboard.tsx           # User dashboard
    │   ├── map.tsx                 # Map & evacuation
    │   ├── settings.tsx            # App settings
    │   ├── modal.tsx               # Modal screen
    │   └── (tabs)/                 # Tab navigation screens
    ├── components/
    │   ├── screens/
    │   │   ├── HomeScreen.tsx
    │   │   └── SplashScreen.tsx
    │   └── ui/
    │       └── BottomNav.tsx
    ├── hooks/
    │   ├── use-color-scheme.ts
    │   ├── use-theme-color.ts
    │   └── useEmergencySOS.ts      # SOS hook (GPS + SMS)
    ├── services/
    │   └── publicApi.ts            # Backend API calls
    ├── context/
    │   └── LanguageContext.tsx     # i18n (English / Nepali)
    ├── locales/
    │   ├── en.ts
    │   └── ne.ts
    ├── constants/
    │   └── theme.ts
    ├── app.json
    └── package.json
```

---

## Tech Stack

### Backend

| Technology                | Purpose                               |
| ------------------------- | ------------------------------------- |
| **FastAPI**               | REST API framework                    |
| **Uvicorn**               | ASGI server                           |
| **Supabase**              | Primary PostgreSQL database + Auth    |
| **Neon (asyncpg)**        | Wildfire predictions database         |
| **Solana / solders**      | Blockchain audit trail                |
| **Pydantic v2**           | Request/response validation           |
| **python-jose / PassLib** | JWT authentication & password hashing |
| **Pandas**                | Data processing for CSV uploads       |

### Web Application

| Technology                  | Purpose                        |
| --------------------------- | ------------------------------ |
| **Next.js 16**              | React framework (App Router)   |
| **React 19**                | UI library                     |
| **Tailwind CSS v4**         | Utility-first styling          |
| **Leaflet / React-Leaflet** | Interactive maps               |
| **Three.js**                | 3D Earth globe on landing page |
| **Lucide React**            | Icon library                   |
| **react-markdown**          | Chatbot message rendering      |

### Mobile Application

| Technology            | Purpose                  |
| --------------------- | ------------------------ |
| **Expo SDK 54**       | React Native framework   |
| **React Native 0.81** | Mobile UI                |
| **expo-location**     | GPS coordinates          |
| **expo-sms**          | Offline SMS SOS fallback |
| **expo-router**       | File-based navigation    |
| **React Navigation**  | Tab & stack navigation   |

### Infrastructure

| Service               | Purpose                                      |
| --------------------- | -------------------------------------------- |
| **Supabase**          | Auth, PostgreSQL DB, Row-Level Security      |
| **Neon**              | Serverless Postgres for wildfire data        |
| **Solana Blockchain** | Immutable audit trail for fund disbursements |

---

## Core Modules

### Module 0 — Foundation

- Nepal-themed responsive layout (red `#DC2626`, deep blue `#1E3A5F`)
- Shared components: buttons, cards, badges, modals
- Dark / light mode support

### Module 1 — Real-Time Disaster Alert System

**Route:** `/alerts`

- Live alerts: Flood, Landslide, Wildfire, Earthquake, Extreme Weather
- Location-based filtering by district / municipality
- Color-coded severity: Critical (Red) → High (Orange) → Moderate (Yellow) → Low (Green)
- Alert cards with type, location, severity, and timestamp

### Module 2 — AI-Based Disaster Prediction Engine

**Route:** `/predictions`

- Risk probability scores per district
- Heatmap visualization across Nepal
- Short-term disaster forecast cards
- Historical trend charts

### Module 3 — Citizen Incident Reporting

**Route:** `/report`

- Report form: image, video, GPS coordinates, description, disaster type
- Status tracking pipeline: Submitted → Under Review → Action Taken
- Personal report history view

### Module 4 — Government Admin Dashboard

**Route:** `/government` (web) | `/admin`

- Live incident monitoring
- SOS alert tracking & dispatch management
- Resource allocation panel
- Announcements publisher
- Analytics and downloadable reports
- 4-level hierarchy: National → Province → District → Beneficiary

### Module 5 — Emergency SOS & Offline Support

**Route:** `/sos` (web) | `alert.tsx` (mobile)

- One-click SOS button with GPS capture
- Automated alert dispatch to emergency services
- Offline SMS fallback via `expo-sms`
- Emergency contacts management

### Module 6 — Nearest Evacuation Center Finder

**Route:** `/evacuate` | `map.tsx` (mobile)

- Interactive Leaflet map showing shelters, hospitals, police stations
- Safe route display with turn-by-turn guidance
- Distance and estimated travel time

### Module 7 — Transparency & Public Information

**Route:** `/transparency`

- Budget allocation table per disaster event
- Relief fund distribution details on the Solana blockchain
- Affected population statistics
- Government announcements feed

### Module 8 — Volunteer & Relief Management

**Route:** `/volunteer`

- Volunteer registration with skill tagging (Medical, Rescue, Logistics)
- Task assignment board
- Donation tracking
- Relief inventory management

---

## Data Flow

```
┌────────────────┐     ┌──────────────────┐     ┌───────────────────┐
│  AI Prediction │────▶│  Alert Dispatch  │────▶│ Citizen Reports   │
└────────────────┘     └──────────────────┘     └────────┬──────────┘
                                                          │
                       ┌──────────────────┐              ▼
                       │ Evacuation Center│     ┌───────────────────┐
                       │    Activated     │◀────│  Admin Dashboard  │
                       └──────────────────┘     └────────┬──────────┘
                                                          │
┌────────────────┐     ┌──────────────────┐              ▼
│ Public Tracks  │◀────│  Relief Funds    │◀────┌───────────────────┐
│ Transparency   │     │  Allocated       │     │  SOS Dispatched   │
└────────────────┘     └──────────────────┘     └───────────────────┘
         │
         ▼
┌────────────────────────┐
│  Solana Blockchain     │
│  (Immutable Audit Log) │
└────────────────────────┘
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+
- **Python** 3.10+
- **Expo CLI** (`npm install -g expo-cli`)
- A **Supabase** project
- A **Neon** database (for wildfire predictions)

---

### 1. Backend (Python + FastAPI)

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your credentials (see Environment Variables section)

# Run database migrations
# Go to Supabase SQL Editor → paste supabase_schema.sql → run
# For Neon wildfire tables:
python scripts/setup_neon_schema.py

# (Optional) Seed sample data
python scripts/seed_data.py

# Start the API server
uvicorn app.main:app --reload
```

API will be available at `http://localhost:8000`  
Interactive docs: `http://localhost:8000/docs`

---

### 2. Web App (Next.js)

```bash
cd web

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API URL and keys

# Run development server
npm run dev
```

App will be available at `http://localhost:3000`

---

### 3. Mobile App (Expo + React Native)

```bash
cd app/hamrosuraksha

# Install dependencies
npm install

# Start Expo development server
npx expo start

# Run on specific platform
npx expo start --android
npx expo start --ios
npx expo start --web
```

Scan the QR code with **Expo Go** (Android/iOS) to run on your device.

---

### 4. Aid Dashboard (Next.js)

```bash
cd web/aid

# Install dependencies
npm install

# Run development server
npm run dev
```

Aid dashboard will be available at `http://localhost:3001` (or next available port).

---

## Environment Variables

### Backend (`backend/.env`)

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Neon Database
NEON_DATABASE_URL=postgresql://user:password@host/dbname

# Authentication
JWT_SECRET=your-very-long-random-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# App
PROJECT_NAME=NDRRMA API
```

### Web App (`web/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## API Reference

Base URL: `http://localhost:8000`

| Method | Endpoint                    | Description                 | Auth           |
| ------ | --------------------------- | --------------------------- | -------------- |
| `GET`  | `/`                         | Health check                | No             |
| `GET`  | `/health`                   | API status                  | No             |
| `POST` | `/auth/login`               | Login, returns JWT          | No             |
| `POST` | `/auth/register`            | Register new user           | No             |
| `GET`  | `/dashboard/summary`        | Admin dashboard stats       | Admin          |
| `GET`  | `/public/stats`             | Public disaster statistics  | No             |
| `GET`  | `/public/alerts`            | Active disaster alerts      | No             |
| `POST` | `/sos/create`               | Submit SOS request          | User           |
| `GET`  | `/sos/list`                 | List SOS requests           | Admin          |
| `GET`  | `/predictions/districts`    | Risk scores per district    | No             |
| `GET`  | `/predictions/wildfire`     | Wildfire predictions (Neon) | No             |
| `GET`  | `/relief/allocations`       | Relief fund records         | Admin          |
| `POST` | `/relief/disburse`          | Disburse relief funds       | Admin          |
| `GET`  | `/records/beneficiaries`    | Beneficiary records         | Admin          |
| `GET`  | `/government/province/{id}` | Province-level dashboard    | Province Admin |
| `GET`  | `/blockchain/transactions`  | Audit trail                 | Admin          |

Full interactive documentation available at `/docs` (Swagger UI) and `/redoc`.

---

## Database

### Supabase (Primary)

The main PostgreSQL database managed by Supabase handles:

- User accounts and RBAC (4 roles: Super Admin, Province Admin, District Officer, Data Entry)
- Disaster records and incident reports
- SOS requests
- Relief fund allocations and beneficiary records
- Audit logs

Run the initial schema:

```sql
-- In Supabase SQL Editor
-- Paste and run: backend/supabase_schema.sql

-- Insert initial national budget
INSERT INTO budget_master (fiscal_year, total_nepal_budget, ndrrma_allocation)
VALUES ('2080/81', 100000000.00, 50000000.00);
```

### Neon (Wildfire Predictions)

A separate serverless Postgres database on Neon stores wildfire prediction data for faster geospatial queries.

```bash
python backend/scripts/setup_neon_schema.py
python backend/scripts/upload_wildfire_neon.py
```

---

## UI & Design

### Color Palette

| Role                   | Color                                                      | Hex       |
| ---------------------- | ---------------------------------------------------------- | --------- |
| Primary (Nepal Red)    | ![red](https://via.placeholder.com/12/DC2626/DC2626.png)   | `#DC2626` |
| Secondary (Deep Blue)  | ![blue](https://via.placeholder.com/12/1E3A5F/1E3A5F.png)  | `#1E3A5F` |
| Accent (Amber/Warning) | ![amber](https://via.placeholder.com/12/F59E0B/F59E0B.png) | `#F59E0B` |
| Success                | ![green](https://via.placeholder.com/12/10B981/10B981.png) | `#10B981` |
| Background Light       |                                                            | `#F8FAFC` |
| Background Dark        |                                                            | `#0F172A` |

### Risk Level Colors

| Level    | Color  | Hex       |
| -------- | ------ | --------- |
| Critical | Red    | `#DC2626` |
| High     | Orange | `#F97316` |
| Moderate | Yellow | `#EAB308` |
| Low      | Green  | `#22C55E` |

### Fonts

- **Web:** Geist Sans / Geist Mono
- **Mobile:** System default (SF Pro on iOS, Roboto on Android)

---

## Localization

The mobile app supports **English** and **Nepali (नेपाली)** via a `LanguageContext` provider.

Translation files are located in `app/hamrosuraksha/locales/`:

- `en.ts` — English
- `ne.ts` — Nepali

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation changes
- `style:` — formatting, no logic change
- `refactor:` — code restructuring
- `chore:` — build scripts, dependencies

---

## License

This project is developed for the benefit of the people of Nepal. All rights reserved.

---

<div align="center">
  <strong>Built with ❤️ for Nepal 🇳🇵</strong><br/>
  <em>Hamro Suraksha — हाम्रो सुरक्षा</em>
</div>
