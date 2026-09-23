# Celestial AI — Application Architecture & System Documentation

## 1. Executive Project Overview

**Celestial AI** is a state-of-the-art full-stack spiritual intelligence platform that fuses ancient esoteric wisdom traditions with modern computer vision, artificial intelligence, and predictive analytics.

The application brings together **Palmistry (Chiromancy)**, **Tarot Divination**, and **Astrological Natal Data** into a single cohesive, quantitative spiritual report. By converting physical palm line features and card draw dynamics into normalized datasets, Celestial AI provides users with actionable guidance across career, relationships, personal growth, and emotional well-being.

---

## 2. Technical Stack & Infrastructure

### Frontend Architecture
- **Framework**: React 19 with TypeScript 5.8
- **Build Tool**: Vite 6.2 with Hot Module Replacement & Express Dev Middleware
- **Styling**: Tailwind CSS v4 featuring custom dark celestial glassmorphism styling, radial glow accents, and responsive layout primitives
- **Component & Animation Libraries**:
  - `lucide-react`: High-density iconography for navigation, palm lines, tarot arcana, and dashboard metrics
  - `motion` (Framer Motion): Smooth tab transitions, card flipping physics, and progress bar animations
- **Document Export Engine**: `jspdf` for client-side rendering of multi-page PDF spiritual intelligence certificates

### Backend & AI Architecture
- **Server Runtime**: Node.js with Express v4, executed via `tsx` in development and bundled into CommonJS via `esbuild` for production
- **AI Model Integration**: `@google/genai` SDK using `gemini-3.6-flash` (Gemini 2.5 Flash) for image recognition, palm line feature extraction, and tarot card synergy synthesis
- **Computer Vision Pipeline**:
  - HTML5 Canvas API for real-time video stream capture and binarization edge enhancement
  - MediaPipe 21-point Hand Landmark joint coordinate mapping
  - Bezier curve geometry modeling for major palm lines (Life Line, Head Line, Heart Line, Fate Line, Sun Line)

---

## 3. Core Datasets Used

Celestial AI relies on three foundational datasets to deliver accurate, structured analysis:

### 3.1 FreiHAND Hand Landmark Dataset (3D Hand Pose Mesh)
- **Source Context**: Inspired by the FreiHAND benchmark dataset (comprising 33,000+ annotated hand pose samples with 21 3D joint locations).
- **Application**: Used to establish normalized 21-point landmark coordinates (`(x, y)` relative percentages) across fingers, joints, knuckles, and wrist.
- **Landmark Mapping**:
  - `Landmark 0`: Wrist Origin
  - `Landmarks 1-4`: Thumb CMC, MCP, IP, Tip
  - `Landmarks 5-8`: Index Finger MCP, PIP, DIP, Tip
  - `Landmarks 9-12`: Middle Finger MCP, PIP, DIP, Tip
  - `Landmarks 13-16`: Ring Finger MCP, PIP, DIP, Tip
  - `Landmarks 17-20`: Pinky Finger MCP, PIP, DIP, Tip

### 3.2 Rider-Waite 78-Card Tarot Deck Dataset
- **Arcana Split**:
  - **22 Major Arcana Cards**: From 0 (*The Fool*) to 21 (*The World*), representing major archetypal life themes and karmic shifts.
  - **56 Minor Arcana Cards**: Divided across four elemental suits:
    - *Wands* (Fire - Drive, Ambition, Action)
    - *Cups* (Water - Emotion, Relationships, Intuition)
    - *Swords* (Air - Intellect, Mind, Conflict Resolution)
    - *Pentacles* (Earth - Material Wealth, Health, Stability)
- **Data Attributes per Card**: Name, suit, arcana category, elemental association, upright keywords, reversed keywords, detailed lore interpretation, and image metadata.

### 3.3 Astrological & Natal Geometry Map
- **Zodiac Signs**: 12 Sun/Moon/Rising signs categorized by element (*Fire, Earth, Air, Water*) and modality (*Cardinal, Fixed, Mutable*).
- **Planetary Alignments**: Houses and planetary ruler attributes mapped against user birth date, time, and location to customize reading focus areas.

---

## 4. How the Application Works (Step-by-Step User Journey)

1. **Authentication & User Registration**:
   - The user opens the platform and clicks **User Login** or **Sign In**.
   - They can sign in directly via **Google SSO**, **Apple SSO**, or **Email & Password**.
   - The system checks the database state. If no existing account matches the email, the system automatically alerts the user and guides them through creating a new account registration.

2. **Astrological Profile Setup**:
   - In the **User Profile Modal**, the user configures their birth date, time, birth location, zodiac sign, natal moon/rising sign, spiritual goals, and deck preferences.

3. **Palmistry Mesh Scanning**:
   - The user navigates to the **Palmistry** page.
   - They click **Open Camera** to capture a live photo of their hand, or **Upload Image**.
   - The vision engine overlays 21 MediaPipe hand joint landmarks and draws colored Bezier curves representing the **Life Line** (rose), **Head Line** (sky blue), **Heart Line** (pink), and **Fate Line** (violet).
   - The captured image is sent to the backend API (`/api/palm/analyze`), which utilizes Gemini AI to analyze palm curvature, hand element type (e.g. *Fire Palm*), and line depth.

4. **Tarot Studio Reading**:
   - The user switches to the **Tarot Studio** tab.
   - They select a spread type:
     - *1-Card Daily Insight*
     - *3-Card Timeline (Past, Present, Future)*
     - *5-Card Cross of Truth (Core, Challenge, Mind, Subconscious, Outcome)*
     - *7-Card Horoscope Spread*
   - They type an optional focus question (e.g., *"What career direction should I align with this season?"*).
   - The user shuffles the deck and draws cards. Cards flip to reveal upright or reversed orientations.
   - The backend (`/api/tarot/interpret`) synthesizes individual card meanings and inter-card synergies into structured guidance.

5. **Unified Synthesis & Weighted Multi-Factor Scoring**:
   - The user visits the **Synthesis** tab.
   - The engine aggregates data from both the Palm Scan and Tarot Reading using the weighted formula:
     $$\text{Overall Score} = (0.30 \times \text{Palm Conf}) + (0.25 \times \text{Tarot Rel}) + (0.20 \times \text{Personality Align}) + (0.15 \times \text{Context Rel}) + (0.10 \times \text{Consistency})$$
   - The user receives a comprehensive report featuring:
     - Personality Archetype (e.g., *The Visionary Catalyst*)
     - 3-Horizon Life Trend Timeline (3 Months, 6 Months, 1 Year)
     - Executive Guidance across Career, Relationships, Health, and Spiritual growth
     - One-click **Download PDF Report** button.

6. **Role-Based Dashboard Navigation**:
   - Depending on the user's role (*Seeker*, *Reader*, *Consultant*, *Admin*), they can view tailored metrics, client management queues, or system health logs in the **Dashboard** view.

---

## 5. Segment-by-Segment Module Breakdown

### Segment 1: Navigation & Shell (`Navbar.tsx`, `App.tsx`)
- Provides responsive top bar with sticky blurred glass styling.
- Controls tab navigation between `home`, `palm`, `tarot`, `synthesis`, `dashboard`, and `admin`.
- Features real-time notification badge counter and user avatar with astrological zodiac tag.

### Segment 2: Palmistry Vision Engine (`PalmScanner.tsx`)
- Implements interactive camera feed capture via HTML5 `getUserMedia` API.
- Draws 21-joint skeletal wireframe and custom curved lines for Life, Head, Heart, Fate, and Sun lines.
- Supports hand side toggling (*Right Hand* / *Left Hand*) and edge binarization contrast enhancement.
- Outputs detailed line quality readings (length, depth, interpretation) and palm shape element classifications.

### Segment 3: Interactive Tarot Studio (`TarotStudio.tsx`)
- Includes full dataset of 78 Rider-Waite cards with high-resolution imagery and keyword metadata.
- Offers interactive deck shuffling animation, card picking, upright/reversed state determination, and card reset controls.
- Renders detailed card interpretation cards highlighting position meaning, upright/reversed lore, and AI synergy summaries.

### Segment 4: Unified Synthesis Engine (`UnifiedReadingView.tsx`)
- Calculates multi-factor weighted spiritual intelligence score ($0-100\%$).
- Generates 3-Horizon life trend timeline forecast cards (*Next 3 Months*, *6 Months*, *1 Year*).
- Formats elemental balance breakdown bars (*Fire, Water, Air, Earth*).
- Renders exportable PDF reports formatted with custom styling via `jspdf`.

### Segment 5: Multi-Role Dashboards (`/src/components/Dashboards/`)
1. **UserDashboard.tsx**: Personal reading history table, score progress charts, daily quest progress bar, and saved report downloads.
2. **ReaderDashboard.tsx**: Active client session queue, card spread designer tool, client session notes recorder, and reading status updates.
3. **ConsultantDashboard.tsx**: Client archetype distribution breakdown, holistic growth metric cards, appointment scheduling calendar, and consultation history.
4. **AdminDashboard.tsx**: Platform telemetry metrics, API request latency graphs, user role management table, system log monitor, and database backup controls.

### Segment 6: Authentication & Profile Portal (`AuthModal.tsx`, `UserProfileModal.tsx`)
- **AuthModal.tsx**: Features Google and Apple SSO buttons, email/password form, database verification, automatic credential sync into the password vault, and registration flow.
- **UserProfileModal.tsx**: User astrological data manager allowing editing of full name, birth date, birth time, location, zodiac sign, natal moon/rising sign, reading deck preferences, and spiritual goals.

### Segment 7: Database & User Credentials Vault (`userCredentialsDatabase.ts`, `userCredentials.ts`, `userDatabase.ts`)
- **userCredentialsDatabase.ts**: Persistent storage layer (`celestial_user_credentials_vault`) for user ID and password records with automatic real-time updates upon user registration or sign-in, login verification, and JSON export.
- **userCredentials.ts**: Initial seed credentials data model (`UserCredentialRecord`) defining default credentials for users, readers, consultants, and administrators.
- **userDatabase.ts**: Primary user storage layer managing user account profiles (`celestial_user_accounts_db`) and email-isolated activity records (`celestial_user_data_db`) for personal reports, palm scans, and tarot sessions.
- **autoStorageManager.ts**: Snapshot backup generation, automated integrity audits, and full database JSON export/import.

---

