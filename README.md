# BreatheBetter

> *Spira. Scio. Vive.* — A lung function monitoring platform by Ryan Tyagi, DPS International MYP Personal Project.

---

## Overview

BreatheBetter connects to a custom HC-SR04 ultrasonic spirometer via USB (Arduino) and measures FVC and FEV1 by tracking how far water rises in a sealed tube when a user exhales. Results are displayed in real-time, saved to **Firebase (Firestore)**, and visualised with a flow-volume curve.

The app is a static, single-page React application — there is no custom server. Authentication and data storage are handled directly by Firebase from the browser, secured by Firestore security rules.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Recharts, i18next |
| Auth | Firebase Authentication (email/password) |
| Database | Firebase Firestore |
| Serial | Web Serial API (browser-native, Chrome/Edge only) |
| Icons / i18n | Phosphor icons, i18next (English + Hindi) |
| Deployment | Vercel (static frontend) |

---

## Firebase setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. **Authentication → Sign-in method →** enable **Email/Password**.
3. **Firestore Database →** create a database.
4. Put the project's web config into `frontend/src/lib/firebase.js` (the `apiKey`, `authDomain`, `projectId`, etc.). These web values are public identifiers, not secrets — access is controlled by the rules below.
5. **Deploy the security rules** (this is what actually protects the data):

```bash
npm install -g firebase-tools
firebase login
firebase use --add        # select your project
firebase deploy --only firestore:rules
```

The rules live in [`firestore.rules`](firestore.rules) and restrict every `results` document to its authenticated owner. **Do not leave Firestore in test mode** — that exposes all users' health data.

6. *(Recommended)* Enable **Firebase App Check** to stop non-app clients from hitting your backend, and confirm **Authentication → Settings → Authorized domains** lists only your domains.

---

## Local development

### Prerequisites
- Node.js 18+
- Google Chrome or Microsoft Edge (Web Serial API is Chromium-only)
- An Arduino connected via USB with the HC-SR04 sketch uploaded

### Run it

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173 (open in Chrome/Edge)
```

There are no environment variables to configure — the Firebase web config is in `frontend/src/lib/firebase.js`.

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
3. **FVC** = peak volume computed from maximum water rise across the full 5 s.
4. **FEV1** = peak volume from readings in the first 1 000 ms only — a real time-based measurement.
5. **FEV1/FVC ratio** determines status: ≥ 70 % Normal, 60–70 % Borderline, < 60 % Low.

Volume formula: `V = min(height / MAX_HEIGHT, 1.0) × 5.0` scaled to a realistic FVC range, multiplied by an optional calibration factor.

---

## Deployment (Vercel)

1. Push to GitHub.
2. Import the repo at [vercel.com](https://vercel.com) and set **Root Directory** to `frontend`.
3. Deploy. Security headers (CSP etc.) are configured in [`frontend/vercel.json`](frontend/vercel.json).

Every push to `main` auto-deploys. Remember to also deploy the Firestore rules (see Firebase setup) — they are not part of the Vercel deploy.

---

## Security

- Firestore access is owner-only, enforced by [`firestore.rules`](firestore.rules) — the client-side query filter is convenience, not security.
- Security headers (Content-Security-Policy, HSTS, etc.) are set in `frontend/vercel.json`.
- The embedded explainer runs in a sandboxed iframe.
- The Firebase web config in the source is a public identifier, not a secret.

---

## Disclaimer

⚠ **This is not medical advice.** BreatheBetter is an educational awareness tool built as part of an MYP Personal Project. Do not use it to diagnose or treat any medical condition.
