# LockMe AI — Production AI-Powered Security, Privacy & Trust Platform

LockMe AI is a state-of-the-art security platform built to protect sensitive mobile and desktop applications (WhatsApp, Banking Vaults, Photos, Instagram, Telegram, etc.) with biometric AI face recognition, intelligent intruder detection snapshot traps, and Google Gemini powered threat intelligence.

---

## 🌟 Key Features

1. **Biometric Face Recognition Engine**: Real-time camera integration with HTML5 Canvas tracking overlays, 128-d face descriptor vector matching, and confidence score verification.
2. **Interactive App Lock Simulator**: Authenticate via AI Face Scan, Master PIN, or Password before accessing protected apps.
3. **Intruder Photo Trap**: Automatically captures timestamped photo snapshots whenever an unrecognized face attempts access.
4. **Google Gemini Threat Analysis (`@google/genai`)**: Analyzes attempt frequency, intruder photo anomalies, and generates dynamic Risk Scores (Low, Medium, High, Critical) with automated recommendations.
5. **AI Security Advisor**: Full-page interactive chatbot powered by Google Gemini to guide users on mobile hardening and zero-trust policies.
6. **Security Attempt Audit Logs**: Timestamped history table displaying snapshot pictures, confidence scores, device identifiers, and location tags.
7. **Supabase PostgreSQL & Row Level Security (RLS)**: Database schema with RLS policies isolating user data (`auth.uid() = user_id`).

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Recharts, Lucide Icons, Zod, WebRTC & HTML5 Canvas.
- **Backend**: Node.js, Express, TypeScript, `@google/genai`, `@supabase/supabase-js`, bcryptjs, jsonwebtoken, helmet, cors, express-rate-limit.
- **Database**: PostgreSQL (Supabase) with Row Level Security (RLS).

---

## 🚀 Quick Start Guide

### 1. Install Dependencies

In the project root directory:

```bash
# Install root orchestration packages
npm install

# Install client packages
cd client && npm install

# Install server packages
cd ../server && npm install
```

### 2. Environment Variables Setup

Create a `.env` file in the `server/` directory:

```env
PORT=5000
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
JWT_SECRET=lockme_ai_super_secret_jwt_key_2026
GOOGLE_API_KEY=your-google-gemini-api-key
DATABASE_URL=postgresql://postgres:password@db.your-supabase-project.supabase.co:5432/postgres
FCM_SERVER_KEY=your-fcm-server-key
```

> **Note**: If `GOOGLE_API_KEY` or Supabase credentials are left empty during quick local testing, LockMe AI automatically activates a high-fidelity local AI fallback engine so all features remain 100% operational!

### 3. Run Development Servers

Run client and server concurrently from the root:

```bash
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend Server API**: http://localhost:5000/api/health

---

## 🗄️ Database Setup (Supabase PostgreSQL)

Execute the PostgreSQL DDL migration script located at [`sql/schema.sql`](file:///c:/Users/chara/OneDrive/Desktop/Build%20to%20Ship%20Hackathon/sql/schema.sql) in your Supabase SQL Editor.

Included tables with RLS enabled:
- `users`
- `protected_apps`
- `face_profiles`
- `unlock_logs`
- `notifications`
- `ai_reports`

---

## 🧪 Verification & Acceptance Criteria

- [x] Full Authentication (Signup, Login, Logout, Session token)
- [x] Protected Apps Management (Add, Remove, Toggle Lock, Change PIN/Face)
- [x] Lock Screen Modal with live webcam scanning & canvas reticle
- [x] Intruder Snapshot Trap recording failed attempts
- [x] Gemini AI Threat Analysis (`@google/genai`)
- [x] AI Security Advisor Chatbot
- [x] Recharts Analytics & Attempt History Table
- [x] SQL Migration & Row Level Security (RLS) policies
