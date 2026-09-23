# 🌌Palmistry & Tarot Intelligence Platform

> **Live Application**: 🚀 **[https://ai-palmistry-tarot-app.vercel.app/](https://ai-palmistry-tarot-app.vercel.app/)**  
> Experience the full interactive web application directly in your browser.

[![Live App](https://img.shields.io/badge/Live%20App-ai--palmistry--tarot--app.vercel.app-7928CA?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-palmistry-tarot-app.vercel.app/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-Vision_AI-00A389?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/mediapipe)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

---

## 📖 Executive Overview

**Palmistry and Tarot Intelligence Platform** is an enterprise-grade spiritual intelligence platform that bridges ancient esoteric wisdom (Palmistry/Chiromancy, Rider-Waite Tarot, Vedic Jyotish, and Western Natal Astrology) with state-of-the-art Computer Vision, Generative AI, and real-time interactive consultations.

Unlike generic horoscope generators or static fortune-telling apps, Palmistry and Tarot Intelligence Platform transforms physical palm topography and interactive card selections into normalized mathematical vectors. It synthesizes these inputs via a **weighted multi-factor scoring model**, delivering personalized forecasts, life trend timelines, downloadable PDF reports, and real-time 1-on-1 expert consultation sessions with live speech synthesis and remedy prescriptions.

---

## 🌟 Key Platform Features

### ✋ 1. Computer Vision Palmistry Scanner (Chiromancy Mesh Engine)
* **Real-Time Video & Photo Capture**: Uses HTML5 Canvas and `getUserMedia` for live camera stream capture or high-resolution hand image uploads.
* **21-Point Skeletal Mesh Overlay**: Implements MediaPipe Hand landmark coordinates normalized against benchmark hand pose geometry (FreiHAND coordinate system).
* **Major Palm Line Extraction & Bezier Rendering**: Accurately traces and evaluates:
  * **Life Line** (*Rose*): Vitality, life transitions, resilience, and energy stamina.
  * **Head Line** (*Sky Blue*): Cognitive style, intellectual focus, logic vs. intuitive balance.
  * **Heart Line** (*Pink*): Emotional depth, relationship dynamics, attachment patterns.
  * **Fate Line** (*Violet*): Career trajectory, vocation, sense of destiny and purpose.
  * **Sun Line (Apollo)** (*Amber*): Creative expression, public recognition, prosperity.
* **Hand Element Topology**: Evaluates palm aspect ratio and finger-to-palm proportions to classify hands into classical elemental archetypes: *Fire, Earth, Air, Water*.
* **Dual-Hand Support & Binarization**: Switch between Left Hand (innate potential/karmic blueprint) and Right Hand (manifested life choices/current reality) with high-contrast edge binarization filters.

---

### 🎴 2. 78-Card Interactive Rider-Waite Tarot Studio
* **Complete 78-Card Deck Dataset**:
  * **22 Major Arcana**: Spiritual milestones and archetypal life lessons (The Fool, The Magician, The Wheel of Fortune, The World, etc.).
  * **56 Minor Arcana**: 4 Elemental Suits (*Wands / Fire, Cups / Water, Swords / Air, Pentacles / Earth*).
* **Multi-Card Divination Spreads**:
  * **1-Card Daily Insight**: Quick alignment, morning clarity, daily theme.
  * **3-Card Timeline**: Sequential Past $\rightarrow$ Present $\rightarrow$ Future analysis.
  * **5-Card Cross of Truth**: Core Situation $\rightarrow$ Hidden Challenge $\rightarrow$ Conscious Mind $\rightarrow$ Subconscious Driver $\rightarrow$ Projected Outcome.
  * **7-Card Astrological Horoscope**: 7-house alignment mapping vitality, finances, relationships, career, and spirituality.
* **Realistic Physics & Card Dynamics**: Smooth 3D card flips, random deck shuffle animations, upright vs. reversed card orientations, and intelligent multi-card synergy synthesis powered by Gemini AI.

---

### 🔮 3. Unified Synthesis & Weighted Multi-Factor Scoring
The platform aggregates inputs from Palmistry, Tarot readings, and Natal Astrological birth charts to calculate a unified spiritual intelligence score ($0-100\%$):

$$\text{Overall Score} = (0.30 \times \text{Palm Conf}) + (0.25 \times \text{Tarot Rel}) + (0.20 \times \text{Personality Align}) + (0.15 \times \text{Context Rel}) + (0.10 \times \text{Consistency})$$

* **Personalized Archetype Detection**: Classifies seekers into unique composite archetypes (e.g., *The Visionary Catalyst*, *The Empathic Alchemist*, *The Grounded Sovereign*).
* **3-Horizon Life Trend Timeline**: Quantitative trend trajectories for **3 Months**, **6 Months**, and **1 Year** across Career, Relationships, and Spiritual Evolution.
* **Elemental Energy Balance**: Breakdown of personal constitution across Fire, Earth, Air, and Water.
* **Exportable Spiritual Certificate (PDF)**: One-click export of high-resolution, multi-page vector PDF reports generated client-side via `jspdf`.

---

### 📞 4. Live Experts Studio & 1-on-1 Video Consultation Room
* **Astrologer Directory & Specializations**: Connect with verified astrologers, tarot masters, Vedic Jyotish scholars, and palmistry experts with hourly/per-minute INR rates and experience badges.
* **Simulated WebRTC Video Consultation Room (`LiveVideoCallRoom.tsx`)**:
  * Full audio/speech synthesis integration for interactive voice playback.
  * Live camera stream toggle, microphone mute/unmute, and picture-in-picture modes.
  * Real-time in-call chat box with immediate astrologer responses.
  * Astrologer note-taking and customized remedy prescriptions (Gemstones, Mantras, Yantras, Lifestyle rituals).
  * Session timer with seamless extension controls and post-call feedback reviews.
* **Free Trial Quota Protection**: Built-in 2-session free trial per verified phone number/email with simulated OTP verification.
* **Calendar Integration**: Instant `.ics` calendar invitation file generation and download for booked slots.

---

### ☀️ 5. Daily Spiritual Guidance & Adaptive Affirmations
* **Daily Affirmation Cards (`DailySpiritualAffirmationCard.tsx`)**: Generates fresh spiritual mantras tailored to the user's zodiac sign, recent card draws, and elemental balance.
* **Daily Quests & Practice Tracker**: Actionable spiritual habits (e.g., *5-minute breathwork*, *grounding ritual*, *gratitude reflection*) linked to user streak tracking.

---

### 👥 6. Role-Based Access Control & Dashboards
The platform provides custom-tailored dashboards across 4 distinct user roles:

| Role | Target Audience | Primary Functionality |
| :--- | :--- | :--- |
| **Spiritual Seeker** (`user`) | End Users & Clients | Personal reading history, trend graphs, daily guidance, downloadable PDF reports, expert booking drawer. |
| **Tarot Reader** (`reader`) | Professional Tarot Practitioners | Live client queue, custom card spread designer, client reading notes, status updates. |
| **Spiritual Consultant** (`consultant`) | Senior Astrologers / Counselors | Holistic client archetype distribution, client progress metrics, appointment scheduler. |
| **Platform Admin** (`admin`) | System Administrators | Platform telemetry, real-time API latency metrics, user database manager, audit logs, backup tools. |

---

### 💾 7. Resilient Dual-Layer Persistence & Auto-Sync
* **Client-Side Storage**: Fast local caching via namespaced `localStorage` keys (`celestial_user_accounts_db`, `celestial_user_data_db`, `celestial_user_credentials`, `celestial_consult_db_v2`).
* **Server-Side Atomic JSON Vault (`dbServer.ts`)**: Automatic bidirectional sync between client state and server storage (`/api/users/save-data`, `/api/auth/sync-credentials`).
* **Data Integrity Audit & Export**: Automatic snapshot backups, integrity validators, and one-click JSON export/import.

---

## 🏗️ System Architecture & Data Flow

```mermaid
flowchart TD
    subgraph Client["Client Application Tier (React 19 + TypeScript + Tailwind CSS v4)"]
        UI_Nav["Navbar & Tab Orchestrator (App.tsx)"]
        UI_Home["Landing & Daily Affirmations (FrontPageLanding.tsx)"]
        UI_Palm["Palmistry Scanner (PalmScanner.tsx)\n• MediaPipe 21 Landmarks\n• FreiHAND Normalized Coordinates\n• Line Vector Tracing"]
        UI_Tarot["Tarot Studio (TarotStudio.tsx)\n• 78 Rider-Waite Cards\n• 1/3/5/7 Card Layouts\n• Upright / Reversed Physics"]
        UI_Synth["Unified Synthesis Engine (UnifiedReadingView.tsx)\n• Weighted Multi-Factor Score\n• 3-Horizon Trend Forecast\n• jsPDF Certificate Exporter"]
        UI_Dash["Role Dashboards (User, Reader, Consultant, Admin)"]
        UI_Experts["Live Experts Studio (LiveExpertsStudio.tsx)"]
        UI_Call["Interactive Video Consultation Room (LiveVideoCallRoom.tsx)\n• Simulated WebRTC & Audio Speech\n• In-Call Chat & Remedies\n• .ICS Calendar Generator"]
    end

    subgraph Storage["Dual Persistence Layer"]
        LocalCache[("Browser LocalStorage\n• Accounts\n• Scans & Sessions\n• Credential Vault\n• Trial Quota")]
        ServerDB[("Server JSON Database (data/db.json)\n• Atomic File Read/Write\n• Schema Integrity Validators\n• User Registry")]
    end

    subgraph Backend["Backend API Server Tier (Node.js / Express v4 / tsx)"]
        ServerRoute["Express Server (server.ts - Port 3000)"]
        AuthModule["Auth & Credential Vault Endpoints\n/api/auth/login, /api/auth/register, /api/auth/me"]
        SyncModule["Data Synchronization Endpoints\n/api/users/save-data, /api/auth/sync-credentials"]
        ConsultModule["Consultation & Trial Engine\n/api/consultations/experts, /api/consultations/trial-status"]
        AI_Gateway["Gemini Multi-Model Fallback Gateway\n(gemini-2.5-flash -> gemini-2.0-flash)"]
    end

    subgraph External["External AI & Cloud Services"]
        GeminiVision["Google Gemini AI Vision & LLM Engine\n• Image Analysis & Line Depth Interpretation\n• Multi-Card Synergy Synthesis\n• Daily Affirmation Generator"]
    end

    UI_Palm -->|Base64 Image / Landmarks| ServerRoute
    UI_Tarot -->|Card Draws & Question| ServerRoute
    UI_Synth -->|Generate Synthesis| ServerRoute
    UI_Home -->|Daily Affirmation| ServerRoute

    ServerRoute --> AuthModule
    ServerRoute --> SyncModule
    ServerRoute --> ConsultModule
    ServerRoute --> AI_Gateway

    AI_Gateway <-->|@google/genai SDK| GeminiVision

    Client <-->|Real-Time Local Sync| LocalCache
    LocalCache <-->|Auto Sync Endpoint| SyncModule
    SyncModule <-->|Atomic File I/O| ServerDB

    UI_Synth -->|Escalate to 1-on-1| UI_Experts
    UI_Experts --> UI_Call
```

---

## 💻 Tech Stack & Dependencies

### Frontend
* **Core Framework**: React 19 (`react`, `react-dom`)
* **Language**: TypeScript 5.8
* **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`) with custom cosmic glassmorphism themes
* **Icons**: Lucide React (`lucide-react`)
* **Motion & Animations**: Motion (`motion`)
* **Computer Vision**: `@mediapipe/camera_utils`, `@mediapipe/hands`, `@mediapipe/tasks-vision`
* **Document Generation**: `jspdf` for client-side downloadable PDF certificates

### Backend
* **Runtime**: Node.js v18+
* **Web Server**: Express v4 (`express`, `@types/express`)
* **TypeScript Execution**: `tsx` (zero-config TypeScript execution for Node.js)
* **Bundler**: `esbuild` & `vite` (Vite dev middleware integration in development, static bundle in production)
* **Environment Configuration**: `dotenv`

### Artificial Intelligence
* **SDK**: `@google/genai`
* **Models**: `gemini-2.5-flash` (Primary), `gemini-2.0-flash`, `gemini-1.5-flash` (Fallback pipeline)

---

## 📁 Project Directory Structure

```plaintext
palmistry-&-tarot-intelligence-platform/
├── assets/                          # Static project assets & illustrations
├── data/                            # Persistent server-side JSON storage files
├── dist/                            # Production build output (client assets & server.cjs)
├── src/
│   ├── components/                  # React UI Components
│   │   ├── Dashboards/              # Role-Based Custom Dashboards
│   │   │   ├── AdminDashboard.tsx       # System telemetry, audit logs, API latency metrics
│   │   │   ├── ConsultantDashboard.tsx  # Archetype distribution & client scheduling
│   │   │   ├── ReaderDashboard.tsx      # Reader workspace, client queues, card spread designer
│   │   │   └── UserDashboard.tsx        # Seeker readings history, scores & downloadable reports
│   │   ├── AuthModal.tsx            # Multi-provider login (Google, Apple, Email/Password) & Registration
│   │   ├── AutoStorageWidget.tsx    # Live storage sync status & database health badge
│   │   ├── DailySpiritualAffirmationCard.tsx # Daily affirmation, elemental breakdown & quests
│   │   ├── ExpertCtaBanner.tsx      # Seamless banner linking readings to 1-on-1 consultations
│   │   ├── FrontPageLanding.tsx     # Hero section, feature showcases, CTA quick-starts
│   │   ├── LiveExpertsStudio.tsx    # Astrologer marketplace, slot booking & trial verification
│   │   ├── LiveVideoCallRoom.tsx    # Interactive consultation room, live speech audio, remedies & chat
│   │   ├── Navbar.tsx               # Sticky blurred glass navigation, tab switch & user badge
│   │   ├── NotificationCenter.tsx   # Slide-over notification panel for daily horoscopes & alerts
│   │   ├── PalmScanner.tsx          # MediaPipe 21-landmark palm scanner, edge filter & line tracer
│   │   ├── TarotStudio.tsx          # 78-card Rider-Waite deck, 3D flip, spreads & synergy viewer
│   │   ├── UnifiedReadingView.tsx   # Synthesis engine, multi-factor scoring & jsPDF report exporter
│   │   └── UserProfileModal.tsx     # Astrological profile editor (Birth date/time/place, Natal signs)
│   ├── data/                        # Static Datasets & Seed Repositories
│   │   ├── dbServer.ts              # Server-side atomic file database & schema validator
│   │   ├── expertsData.ts           # Certified astrologers, specialties, pricing & available slots
│   │   ├── mockDatabase.ts          # Default mock users, notifications, reports & analytics
│   │   ├── palmistryData.ts         # Hand shape elementals, palm mounts & line attributes
│   │   ├── tarotData.ts             # 78 Rider-Waite cards dataset with upright/reversed meanings
│   │   └── userCredentials.ts       # Seed credential records for all platform roles
│   ├── database/                    # Client Persistence & Storage Vaults
│   │   ├── autoStorageManager.ts    # Real-time auto-persistence, snapshot backup & JSON exporter
│   │   ├── consultDatabase.ts       # Free trial quota enforcement, bookings store & .ICS generator
│   │   ├── userCredentialsDatabase.ts # Encrypted credential vault with auto-sync on registration
│   │   └── userDatabase.ts          # Multi-store manager for accounts, scans, tarot draws & reports
│   ├── utils/                       # Core Algorithms & Utility Helpers
│   │   ├── affirmationGenerator.ts  # Dynamic affirmation & spiritual quest generation engine
│   │   ├── inr.ts                   # Currency formatter & Indian Standard Time (IST) slot parser
│   │   └── synthesisGenerator.ts    # Multi-factor weighted scoring & 3-horizon timeline generator
│   ├── App.tsx                      # Root component, global state container & tab router
│   ├── index.css                    # Tailwind CSS v4 design system & custom scrollbar styles
│   ├── main.tsx                     # React application entry point
│   └── types.ts                     # TypeScript interfaces, types, and domain definitions
├── .env.example                     # Environment variable template
├── firebase-applet-config.json      # Optional Firebase/Applet runtime configuration
├── index.html                       # HTML5 entry page with Google Fonts & responsive viewport
├── package.json                     # Project scripts and dependency declarations
├── server.ts                        # Full-featured Node.js / Express backend server
├── tsconfig.json                    # TypeScript compiler configuration
└── vite.config.ts                   # Vite configuration with React & Tailwind plugins
```

---

## ⚡ Getting Started Locally

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-org/celestial-ai.git
cd celestial-ai
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Setup
Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Open `.env` and configure your API key:
```env
# Optional: Google Gemini API Key for dynamic AI interpretations
GEMINI_API_KEY=your_gemini_api_key_here
```
> **Heuristic Fallback Notice**: If `GEMINI_API_KEY` is not provided, the platform automatically switches to high-accuracy offline heuristic models and built-in palmistry/tarot rule engines, ensuring the app remains 100% operational without external API dependencies.

---

### Step 4: Run Terminal Scripts

#### Development Mode (Recommended)
Starts the Express server with live Vite HMR middleware on port `3000`:
```bash
npm run dev
```
Open your browser and navigate to: **`http://localhost:3000`**

#### Type Checking & Linting
Validate all TypeScript typings across the client and server codebase:
```bash
npm run lint
```

#### Production Build
Compiles the React frontend using Vite and bundles the Express backend server with `esbuild` into `dist/server.cjs`:
```bash
npm run build
```

#### Run Production Server
Launches the compiled production bundle:
```bash
npm run start
```

---

## 🔑 Pre-Configured Demo Credentials

The platform is pre-seeded with accounts for all roles. You can immediately log in using the credentials below:

| Role | Email | Password | Display Name | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Spiritual Seeker** | `user@palmistry.ai` | `Password123!` | Aria Vance | Personal readings, PDF exports, book astrologers |
| **Tarot Reader** | `reader@palmistry.ai` | `ReaderSecret2026!` | Elara Thorne | Client queues, card spread designer, session notes |
| **Spiritual Consultant**| `consultant@palmistry.ai`| `ConsultantPass2026!`| Dr. Seraphina Moon| Archetype analytics, client growth metrics |
| **Platform Admin** | `admin@palmistry.ai` | `AdminMasterKey2026!`| Master Orion | Platform telemetry, user control, system logs |
| **Active Seeker** | `dardaharshika@gmail.com`| `UserSecure2026!` | Harshika Darda | Full seeker access with pre-saved palm & tarot data |

> **Note**: You can also register a brand new account directly from the **Sign In** modal. New accounts are automatically synchronized into both the client-side credential vault and the server database.

---

## 🌐 Complete API Reference

All backend endpoints are hosted on `http://localhost:3000/api` (or relative path on deployed URLs):

### Authentication & Credential Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate with email/password; returns user profile and updates login timestamp |
| `POST` | `/api/auth/register` | Register new account, create initial profile, and sync into credentials vault |
| `GET` | `/api/auth/credentials` | Retrieve all credential records (restricted to Admin role) |
| `POST` | `/api/auth/sync-credentials` | Synchronize client-side registered credentials to server storage |
| `GET` | `/api/auth/me` | Fetch active session user profile |

### User Profile & Data Sync Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/users` | List all registered users |
| `GET` | `/api/users/:email` | Get single user account and reading history by email |
| `POST` | `/api/users/profile` | Update user astrological birth profile (Zodiac, birth time, coordinates) |
| `POST` | `/api/users/save-data` | Synchronize client palm scans, tarot sessions, and synthesis reports |
| `GET` | `/api/database/status` | Audit database record counts and storage integrity |

### AI Divination & Synthesis Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/palm/analyze` | Process base64 palm image, extract landmarks, and return line depth analysis |
| `POST` | `/api/tarot/interpret` | Interpret card spread (1, 3, 5, or 7 cards) with orientation lore and synergies |
| `POST` | `/api/ai/synthesize` | Compute weighted multi-factor score and generate 3-horizon trend forecast |
| `POST` | `/api/ai/daily-affirmation` | Generate personalized affirmation and daily quest based on user profile |

### Consultations & Telemetry Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/consultations/experts` | Get list of certified astrologers, specialties, pricing, and availability |
| `POST` | `/api/consultations/trial-status` | Verify free consultation trial quota (2 free sessions) by phone/email |
| `GET` | `/api/reports` | Get global reports summary |
| `GET` | `/api/analytics` | Retrieve platform-wide telemetry, user growth, and active session metrics |
| `GET` | `/api/notifications` | Fetch system notifications and horoscope alerts |
| `POST` | `/api/notifications/read` | Mark user notifications as read |

---

## 🚀 Deployment Guide

### Deploying to Vercel
The frontend is optimized for deployment on Vercel:
1. Push your repository to GitHub / GitLab.
2. Import the repository into your [Vercel Dashboard](https://vercel.com).
3. Set the build settings:
   * **Framework Preset**: Vite
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Add Environment Variables:
   * `GEMINI_API_KEY`: *(Optional)* Your Google Gemini API Key.
5. Click **Deploy**. Your app will be live at `https://your-app.vercel.app`.

### Deploying to Docker / Cloud Run / VPS
To deploy the full-stack app including the Node.js Express server:
```bash
# 1. Build the production assets and server
npm run build

# 2. Start the production server on port 3000
npm run start
```

---

## 🛡️ Security, Privacy & Ethical AI

* **Biometric Palm Privacy**: Palm scan images are analyzed client-side via MediaPipe and processed in memory. Images are never permanently retained or sold to third-party ad networks.
* **Astrological Natal Protection**: User birth dates, times, and geographic coordinates are stored in isolated, email-partitioned storage records.
* **Ethical AI Disclaimer**: All readings provided by Celestial AI are designed for personal growth, self-reflection, mindfulness, and entertainment. The platform does not claim to replace licensed medical, financial, or psychological counsel.

---

## 📄 License

This project is licensed under the **MIT License**. You are free to modify, distribute, and integrate this software into your personal and commercial projects. See the `LICENSE` file for details.

---

<div align="center">
  <sub>Built with 💜 by Celestial AI Engineering Team • Fusing Esoteric Wisdom with Machine Intelligence</sub><br/>
  <b><a href="https://ai-palmistry-tarot-app.vercel.app/">Launch Celestial AI Web Application →</a></b>
</div>
