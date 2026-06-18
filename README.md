# BreatheBetter

> *Spira. Scio. Vive.* — A lung function monitoring platform by Ryan Tyagi, DPS International MYP Personal Project.

---

## Overview

BreatheBetter connects to a custom HC-SR04 ultrasonic spirometer via USB (Arduino) and measures FVC and FEV1 by tracking how far water rises in a sealed tube when a user exhales. Results are displayed in real-time, saved to a Supabase database, and visualised with a flow-volume curve.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Recharts, i18next |
| Backend | Node.js, Express |
| Auth | JWT (issued by backend, verified on every API call) |
| Database | Supabase (PostgreSQL) |
| Serial | Web Serial API (browser-native, Chrome/Edge only) |
| Deployment | Vercel (frontend) + Railway or Render (backend) |

---

## Supabase setup

1. Create a new Supabase project at [supabase.com](https://supabase.com).
2. Enable **Email/Password** auth under Authentication → Providers.
3. Run this SQL in the Supabase SQL Editor:

```sql
create table results (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade,
  email         text,
  fev1          numeric(5,3),
  fvc           numeric(5,3),
  ratio         numeric(5,2),
  status        text,
  readings      jsonb default '[]',
  calibration_factor numeric(8,4) default 1.0,
  created_at    timestamptz default now()
);

-- Row-level security: users can only read/write their own rows
alter table results enable row level security;
create policy "Own results" on results using (auth.uid() = user_id);
```

4. Copy your **Project URL** and **service_role** key from Settings → API.

---

## Local development

### Prerequisites
- Node.js 18+
- Google Chrome or Microsoft Edge (Web Serial API)
- Arduino connected via USB with the HC-SR04 sketch uploaded

### 1. Clone and install

```bash
# Backend
cd backend
cp .env.example .env   # fill in your Supabase credentials + JWT_SECRET
npm install
npm run dev            # runs on :4000

# Frontend (new terminal)
cd frontend
npm install
npm run dev            # runs on :5173
```

### 2. Environment variables

**backend/.env**
```
PORT=4000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
JWT_SECRET=some-long-random-string
FRONTEND_URL=http://localhost:5173
```

---

## Arduino wiring

### Components
- Arduino Uno (or Nano)
- HC-SR04 ultrasonic sensor
- Sealed tube (≈1.5 cm internal diameter) filled with water to a baseline level
- Mouthpiece attached to top of tube

### Wiring table

| HC-SR04 pin | Arduino pin |
|---|---|
| VCC | 5V |
| GND | GND |
| TRIG | D9 |
| ECHO | D10 |

### Arduino sketch

Upload the following sketch via the Arduino IDE:

```cpp
const int TRIG = 9;
const int ECHO = 10;

void setup() {
  Serial.begin(9600);
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
}

void loop() {
  digitalWrite(TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);

  long duration = pulseIn(ECHO, HIGH, 30000);
  float distance = duration * 0.034 / 2.0;

  if (distance > 0 && distance < 400) {
    Serial.println(distance);
  }

  delay(50); // ~20 Hz sample rate
}
```

After uploading, open the Serial Monitor at 9600 baud to verify cm values are printing.

---

## How it works

1. **Baseline** (2.5 s) — sensor reads resting water level (highest cm value = lowest water).
2. **Exhale** (5 s) — user blows into tube; water rises, sensor reads lower cm values. All readings are timestamped.
3. **FVC** = peak volume computed from maximum water rise across full 5 s.
4. **FEV1** = peak volume from readings in the first 1 000 ms only — a real time-based measurement.
5. **FEV1/FVC ratio** determines status: ≥ 70 % Normal, 60–70 % Borderline, < 60 % Low.

Volume formula: `V = min(height / MAX_HEIGHT, 1.0) × 5.0` scaled to realistic FVC range, multiplied by optional calibration factor.

---

## Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Push to GitHub, then import into Vercel.
# Set VITE_API_URL to your Railway/Render backend URL.
```

### Backend → Railway or Render
- Point root to `backend/`
- Start command: `npm start`
- Add all env vars from `.env.example`

---

## Disclaimer

⚠ **This is not medical advice.** BreatheBetter is an educational awareness tool built as part of an MYP Personal Project. Do not use it to diagnose or treat any medical condition.
