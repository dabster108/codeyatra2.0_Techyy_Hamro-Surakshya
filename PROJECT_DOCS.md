# 🇳🇵 Hamro Suraksha — Project Reference

> Smart Disaster Management & Public Transparency Platform for Nepal

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Language:** JavaScript (JSX)
- **Fonts:** Geist Sans / Geist Mono

---

## 8 Core Modules (Build Order)

### Module 0: Foundation
- Responsive layout with navbar + sidebar
- Nepal-themed color scheme (red, blue, white)
- Dark/light mode support
- Shared UI components (buttons, cards, badges, modals)

### Module 1: Real-Time Disaster Alert System
- **Route:** `/alerts`
- Live alerts: Flood, Landslide, Wildfire, Earthquake, Extreme Weather
- Location-based (district/municipality)
- Color-coded risk levels (Red/Orange/Yellow/Green)
- Alert cards with type, location, severity, timestamp

### Module 2: AI-Based Disaster Prediction Engine
- **Route:** `/predictions`
- Risk probability scores per district
- Heatmap visualization
- Short-term disaster forecast cards
- Historical data trends (charts)

### Module 3: Citizen Incident Reporting
- **Route:** `/report`
- Report form: image, video, GPS, description, disaster type
- Status tracking: Submitted → Under Review → Action Taken
- My reports history view

### Module 4: Government Admin Dashboard
- **Route:** `/admin`
- Live incident monitoring
- SOS alert tracking
- Resource allocation
- Announcements publisher
- Analytics & reports

### Module 5: Emergency SOS & Offline Support
- **Route:** `/sos`
- One-click SOS button
- GPS capture + alert dispatch
- Offline SMS fallback info
- Emergency contacts management

### Module 6: Nearest Evacuation Center Finder
- **Route:** `/evacuate`
- Map showing shelters, hospitals, police stations
- Safe route display
- Distance + estimated time

### Module 7: Transparency & Public Information
- **Route:** `/transparency`
- Budget allocation table per disaster
- Relief fund distribution details
- Affected population statistics
- Government updates feed

### Module 8: Volunteer & Relief Management
- **Route:** `/volunteer`
- Volunteer registration form
- Skill tagging (Medical, Rescue, Logistics)
- Task assignment board
- Donation tracking
- Relief inventory

---

## Data Flow (Closed-Loop)
```
AI Predicts Risk → Alert Sent → Citizens Report → Dashboard Notified
→ SOS Dispatched → Rescue Deployed → Evacuation Activated
→ Relief Funds Allocated → Public Tracks via Transparency Module
```

## Color Scheme
- **Primary:** #DC2626 (Nepal Red)
- **Secondary:** #1E3A5F (Deep Blue)
- **Accent:** #F59E0B (Amber/Warning)
- **Success:** #10B981 (Green)
- **Background:** #F8FAFC (Light) / #0F172A (Dark)

## Risk Level Colors
- **Critical:** Red (#DC2626)
- **High:** Orange (#F97316)
- **Moderate:** Yellow (#EAB308)
- **Low:** Green (#22C55E)

## File Structure Plan
```
web/app/
├── layout.js              (Root layout with navbar)
├── page.js                (Landing page)
├── globals.css            (Global styles)
├── alerts/page.js         (Module 1)
├── predictions/page.js    (Module 2)
├── report/page.js         (Module 3)
├── admin/page.js          (Module 4)
├── sos/page.js            (Module 5)
├── evacuate/page.js       (Module 6)
├── transparency/page.js   (Module 7)
├── volunteer/page.js      (Module 8)
└── components/
    ├── Navbar.js
    ├── Sidebar.js
    ├── AlertCard.js
    ├── RiskBadge.js
    ├── SOSButton.js
    ├── ReportForm.js
    └── ...
```
