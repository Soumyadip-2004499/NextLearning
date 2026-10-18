# 🚀 NextLearning — AI-Powered Learning-to-Livelihood Platform for Rural India

> **Citi India Hackathon 2026** — *Reimagining Education and Economic Empowerment for Rural India*

---

## 🌟 Executive Summary

**NextLearning** is an intelligent, accessible, multilingual digital ecosystem bridging the critical divide between schooling and sustainable livelihoods for rural and semi-urban Indian youth (Class 9 through graduation).

Unlike conventional job portals, static course websites, or generic chatbots, **NextLearning provides a unified student journey**:
1. **Discover**: Conversational, local-language AI profile building and explainable career matching across 12 diverse sectors (STEM, vocational, agriculture, renewable energy, rural entrepreneurship).
2. **Learn**: Personalized milestone-based roadmaps connecting learners directly to accredited open educational resources (DIKSHA, SWAYAM, Skill India, Spoken Tutorials) and 20+ facilitator-created vocational training modules.
3. **Connect & Earn**: Verified discovery and tracking for scholarships, apprenticeships (NAPS), government schemes (PM Surya Ghar, PM Vishwakarma, PM-YASASVI), and grassroots organizations.
4. **Facilitate**: Village teachers, NGOs, and facilitators can mentor students, track progress, recommend opportunities, and build community training modules.
5. **Low-Bandwidth & Voice-First**: Native Web Speech API integration, offline-first IndexedDB/localStorage sync queue, and mobile responsiveness.

---

## 🏗️ Architecture & Tech Stack

```
                                  ┌───────────────────────────────┐
                                  │ NextLearning Next.js Client   │
                                  │   (Tailwind CSS + shadcn/ui)  │
                                  └──────────────┬────────────────┘
                                                 │
                   ┌─────────────────────────────┼─────────────────────────────┐
                   │                             │                             │
                   ▼                             ▼                             ▼
       ┌──────────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐
       │   Career Matcher     │      │   AI Assistant & RAG │      │   Offline Sync Queue │
       │  Weighted Heuristic  │      │  (Gemini + Fallback) │      │  (Auto-sync online)  │
       └──────────┬───────────┘      └──────────┬───────────┘      └──────────┬───────────┘
                  │                             │                             │
                  └──────────────────────┐      │      ┌──────────────────────┘
                                         ▼      ▼      ▼
                                  ┌───────────────────────────────┐
                                  │   Next.js 16 Route Handlers   │
                                  │    (Zod Input Validation)     │
                                  └──────────────┬────────────────┘
                                                 │
                                                 ▼
                                  ┌───────────────────────────────┐
                                  │     Prisma 6.9 ORM Client     │
                                  │     (SQLite Dev / PG Prod)    │
                                  └──────────────┬────────────────┘
                                                 │
                                                 ▼
                                  ┌───────────────────────────────┐
                                  │  Database (dev.db / Postgres) │
                                  │  36 Careers | 34 Skills       │
                                  │  23 Training Modules | DIKSHA │
                                  └───────────────────────────────┘
```

- **Design System & Aesthetics**: **Nothing OS Dotmatrix Design System** — Deep Obsidian backdrop (`#08080a`), Dot-matrix grid backgrounds, NDot typography via Google Fonts Silkscreen (`--font-dot`), Nothing Red (`#eb0028`) and Glyph Green (`#00dc82`) accents, hardware-style tactile bento widgets, glowing glyph light strips, voice soundwave visualizers, and fluid Framer Motion micro-interactions.
- **Frontend**: Next.js 16 (App Router with Turbopack), React 19, TypeScript (Strict Mode), Tailwind CSS v4, shadcn/ui primitives, Framer Motion, Lucide Icons.
- **Backend & APIs**: Next.js Server Components & Route Handlers, Zod v4 validation, NextAuth.js v5 / JWT session handling.
- **Data Persistence**: Prisma ORM 6.9 with SQLite (`file:./dev.db`) for zero-friction local development, fully migration-ready for PostgreSQL / MySQL.
- **AI & Reasoning**: Google Gemini API (`@google/genai`, model `gemini-2.0-flash`) with structured prompts, marks-grounded eligibility rules, non-deterministic variation, and robust offline fallback providers.
- **Multilingual & Voice**: Pluggable Voice Provider Architecture (browser Web Speech API + Bhashini adapter specification) supporting 11 Indian languages.
- **Offline & Resiliency**: Custom `OfflineProvider` with local sync queue, network change listeners, and retry mechanisms.

---

## 📦 Implemented Modules (Acceptance Criteria Verified)

| Module | Features & Capabilities | Route / Component |
|---|---|---|
| **A: Student Onboarding** | Conversational multi-step wizard, interests, skills, education level, district, career preference, learning style. | `/onboarding`, `/api/profile` |
| **B: AI Career Discovery** | 36 careers across 12 sectors, explainable weighted scoring (Interest 30%, Skill 25%, Goal 25%, Education 20%), suitability insights. | `/careers`, `/careers/[slug]`, `/api/careers/recommend` |
| **C: Learning Roadmap** | Interactive timeline, step-by-step milestones (learn, practice, exam), status updates (in-progress/completed), dynamic progress KPIs. | `/roadmap`, `/roadmap/[id]`, `/api/roadmap/generate` |
| **D: Grounded AI Assistant** | Streaming AI Voice HUD chat interface with student context, marks & interest grounding, non-deterministic course suggestions. | `/chat`, `/api/chat` |
| **E: Opportunity Discovery** | Search & filter scholarships, government schemes, apprenticeships, NAPS, and training programs with verification status tags. | `/opportunities`, `/opportunities/[id]` |
| **F: Application Tracker** | 7-stage pipeline (Interested → Preparing Docs → Ready → Submitted → Completed) with notes, next actions, and external application integrity. | `/opportunities/applications`, `/opportunities/saved` |
| **G: Facilitator Dashboard** | Teacher portal: assigned student rosters, student roadmap progress monitoring, direct resource & scheme recommendations. | `/facilitator`, `/facilitator/students/[id]` |
| **H: Training Module Builder** | Curriculum creator: 23 published modules by Facilitator G. Sai Kavya (69 structured lessons), drag-reordering, quizzes, student preview. | `/facilitator/modules`, `/facilitator/modules/[id]` |
| **I: Mentor & NGO Directory** | Ecosystem directory featuring grassroots NGOs, verified skilling hubs, rural employers, and mentorship contacts. | `/directory`, `/facilitator/directory`, `/api/directory` |
| **J: Multilingual & Voice** | 11 Indian languages (Hindi, Tamil, Telugu, Bengali, Marathi, etc.), Web Speech API voice input and speech synthesis playback. | `/language`, `src/lib/voice/provider.ts` |
| **K: Offline & Low-Bandwidth** | Lightweight assets, offline status banner, local sync queue for deferred operations, auto-reconnection synchronization. | `src/lib/offline/offline-provider.tsx` |

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- Node.js 20+ (Node.js 26 supported)
- npm 10+

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Soumyadip-2004499/NextLearning.git
cd NextLearning

# Install dependencies
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Key configuration values in `.env`:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="nextlearning-production-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="NextLearning"
NEXT_PUBLIC_DEMO_MODE="true"
GEMINI_API_KEY="" # Optional: configure your Google Gemini API Key for live AI responses
```

### 4. Database Setup & Seeding
```bash
# Push Prisma schema to SQLite
npx prisma db push

# Seed careers, skills, opportunities, training modules, and demo users
npm run db:seed
```

### 5. Run Automated Tests
```bash
npm test
```
*Executes all 30 unit & integration tests (auth, utils, career matcher, Zod schemas, database integrity, AI variation) with 100% pass rate.*

### 6. Build & Launch
```bash
# Production build
npm run build

# Start production server
npm start

# OR run in development mode
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 👥 Demo Accounts (Pre-configured)

| Role | Email | Password | Pre-seeded Context |
|---|---|---|---|
| **Student (Soumyadip)** | `Soumya@student.com` | `Soumya@2004` | **Soumyadip Chattopadhyay**, Class 10: 88.5% (Distinction), Class 12: 86.2% (PCM). Clean energy & tech focus. Active Solar PV roadmap & PM Surya Ghar application. |
| **Student (Demo)** | `demo@student.com` | `demo1234` | Direct demo student login with complete profile pre-loaded. |
| **Facilitator (G. Sai Kavya)**| `Kavya@facilitator.com` | `Kavya@2005` | **G. Sai Kavya**, Pratham Career Centre Facilitator. Assigned to Soumyadip, author of 23 vocational training modules. |
| **Facilitator (Demo)** | `demo@teacher.com` | `demo1234` | Direct demo facilitator login with full access to curriculum builder. |

---

## 📋 Comprehensive Demonstration Walkthrough

1. **Language Selection (`/language`)**:
   - Choose from 11 Indian regional languages with native script displays.
2. **Student Onboarding (`/onboarding`)**:
   - Experience the conversational wizard asking Class 10/12 marks, subjects, and vocational preferences.
3. **Student Dashboard (`/dashboard`)**:
   - Review personalized greeting, quick stats, active Solar PV Roadmap progress, and upcoming scheme deadlines.
4. **AI Career Discovery (`/careers`)**:
   - Filter across 12 sectors, search "solar" or "drone", or click **"Get AI Recommendations"** to see transparent matching scores.
5. **Career Detail & Pathway (`/careers/solar-pv-rooftop-technician`)**:
   - Inspect qualification prerequisites, salary range (₹15,000 - ₹35,000/mo), first steps, and click **"Generate Learning Roadmap"**.
6. **Learning Roadmap (`/roadmap`)**:
   - Interactive timeline of 6 progressive milestones with accredited DIKSHA & Skill India curricula; toggle steps to `completed` and watch progress calculate dynamically.
7. **AI Voice HUD & Career Assistant (`/chat`)**:
   - Speak or ask: *"Recommend courses matching my marks & interests"*. AI evaluates 88.5% (10th) & 86.2% (12th PCM) and dynamically recommends fresh, varied course tracks on repeated queries.
8. **Opportunities & Scholarships (`/opportunities`)**:
   - Filter by *Government Schemes* or *Scholarships* (PM Surya Ghar, PM Vishwakarma, PM-YASASVI); click to view official portal links, document checklists, and eligibility.
9. **Application Tracking (`/opportunities/applications`)**:
   - Track Soumyadip's PM Surya Ghar application in the visual Kanban pipeline from *Checking Eligibility* to *Ready to Apply*.
10. **Facilitator Portal (`/facilitator`)**:
    - Switch to G. Sai Kavya's dashboard, inspect assigned student roadmaps, log mentorship notes, and deliver a recommended learning resource.
11. **Training Module Builder (`/facilitator/modules`)**:
    - Review or author modular courses with interactive lessons, quizzes, and student preview mode across 23 published modules.
12. **In-Portal Facilitator Directory & Resources (`/facilitator/directory`, `/facilitator/resources`)**:
    - Browse verified NGOs, employers, and DIKSHA/NCERT resources directly within the facilitator portal without getting redirected to student views.

---

## 📊 Citi India Hackathon Evaluation Criteria Mapping

| Evaluation Parameter | Weight | NextLearning's Implementation Highlights |
|---|---|---|
| **Innovation & Originality** | **25%** | Replaces fragmented portals with an integrated *discovery-to-livelihood* continuum; transparent heuristic career matching engine; voice-first conversational AI HUD tailored to rural contexts with marks & interest grounding. |
| **Technical Feasibility & Architecture** | **20%** | Modern Next.js 16 + Prisma stack; typed Zod APIs; modular AI provider abstraction (Gemini + offline fallback); edge-ready authentication; 100% test pass rate across 30 tests. |
| **Usability & Scalability** | **20%** | Mobile-first responsive UI (Android low-end phone friendly); high-contrast Nothing OS design system; WCAG-compliant touch targets; offline synchronization queue; multilingual native script support. |
| **Business Value & Monetization** | **15%** | Sustainable hybrid model: free access for rural students, sponsored CSR partnerships with corporates/NABARD, and optional facilitator premium module subscriptions. |
| **Customer Impact & UX** | **20%** | Directly addresses unemployability and lack of guidance in rural India; empowers non-STEM and vocational paths (electricians, agritech, solar); facilitator tooling ensures community multiplier effect. |

---

## 📄 License & Attribution
Developed for the **Citi India Hackathon 2026**. Open-source under the MIT License.
