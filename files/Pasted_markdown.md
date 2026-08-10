Build a production-ready, ultra-modern, high-performance UPSC CSE 2027 AIR-1 Preparation Portal & Command Center Dashboard named "UPSC Mission AIR-1 Command Hub".

### 1. CORE PURPOSE & SYSTEM OVERVIEW
The application serves as a 24x7 intelligent preparation portal for UPSC CSE aspirant Vivekanand Kishorkumar Burange, targeting All India Rank 1 (AIR 1) for UPSC CSE 2027. It integrates static syllabus tracking (based strictly on iasscore micro-topics structure), dynamic current affairs logging, error analytics, Google Workspace sync links, and a strict 6-hour daily study execution engine.

---

### 2. DESIGN SYSTEM & UI/UX SPECIFICATIONS
- **Theme:** Dark Mode Executive Aesthetic (Slate #0f172a background, Amber Gold #d97706 highlights, Emerald Green #16a34a completion accents, Indigo #1e3a8a structural cards).
- **Layout:** Responsive Sidebar + Header Metrics Bar + Multi-Tab Workspace.
- **Typography:** Inter / Helvetica Neue, high legibility, clean data visualization hierarchy.
- **Widgets:** Dynamic Doughnut Progress Gauges, Stacked Status Bars, Interactive Checklists, Filterable Tables, Real-time Countdown Timers, Floating Quick-Note Drawer.

---

### 3. MANDATORY DASHBOARD MODULES & DATA SCHEMA

#### MODULE A: TOP KPI METRICS BAR (Executive Dashboard)
Display real-time visual scorecards at the top:
1. **Overall Syllabus Progress:** Interactive Doughnut Chart showing total completed micro-topics (Current State: 37 / 131 topics completed = 28.2%).
2. **Polity (GS-2) Status:** Gauge Chart at 100% (29/29 micro-topics locked).
3. **Economy (GS-3) Status:** Progress Bar at 50% (10/20 core pillars locked).
4. **Current Test Accuracy Rate:** Metric Card (Default: 80% accuracy).
5. **PYQ Trend Index:** Metric Card (Default: 85% alignment).
6. **Days Remaining for UPSC 2027:** Dynamic live countdown timer to Prelims 2027.

---

#### MODULE B: IAS-SCORE MICRO-TOPIC SYLLABUS & CHECKLIST TRACKER
Create a hierarchical, expandable accordion checklist categorized by GS Pillars:
- **Paper 1: Polity (GS-2):** Pre-loaded with 29 micro-topics. Status: ALL MARKED AS "COMPLETED" (Green Badge).
- **Paper 2: Economy (GS-3):** 20 Core Pillars.
  - *Marked Completed (10 Pillars):* National Income Accounting, SDGs & HDI, Public Finance (Art 266/267), Direct & Indirect Taxation (GST Art 279A), Tax Reforms (Cess/Surcharge Exclusion, BEPS), Money Market (T-Bills, Call Money, CP/CD), Capital Market (SEBI, FSDC, Masala Bonds), Banking System (BR Act 2020, Payment Banks, SFBs, SARFAESI, Bad Bank NARCL, NBFC SBR), Monetary Policy & RBI (Repo, SDF Sec 17(37), CRR/SLR, MPC Sec 45ZB, Inflation Target 4%+/-2%), Money Supply (M0-M4, Money Multiplier, Basel III CAR 9%, CBDC e-Rupee).
  - *Marked Pending (10 Pillars):* External Sector (BOP/BOT, NEER/REER), Global Institutions (IMF, World Bank, WTO), Agriculture Sector (Land Reforms, Agri Credit, PDS, Agri-Tech), Food Processing, Infrastructure (NIP, PM Gati Shakti), etc.
- **Paper 3: Modern History (GS-1):** 18 Micro-topics (Status: Pending - 0%).
- **Paper 4: Geography (GS-1):** 16 Micro-topics (Status: Pending - 0%).
- **Paper 5: Environment & Ecology (GS-3):** 14 Micro-topics (Status: Pending - 0%).
- **Paper 6: Science & Technology (GS-3):** 12 Micro-topics (Status: Pending - 0%).
- **Paper 7: International Relations (GS-2):** 4 Micro-topics (Status: Pending - 0%).

*Feature:* Toggling a checklist item automatically recalculates and updates the Top KPI Bar & Analytics Charts.

---

#### MODULE C: GOOGLE WORKSPACE SYNC HUB (Master Docs & Keep Integration)
A central repository section containing action buttons & embedded preview windows for synced external assets:
1. **Google Docs Master Notes Hub:** Direct links to generated notes:
   - `UPSC_CSE_2027_Economy_Financial_Market_and_Banking_Master_Notes_Exhaustive_V3`
   - `UPSC_CSE_2027_Economy_Monetary_Policy_and_RBI_Master_Notes_Exhaustive_V2`
   - `UPSC_CSE_2027_Executive_Project_Progress_Report_V1`
2. **Google Keep Elimination Traps Pinboard:** Interactive card grid displaying high-yield elimination traps (e.g., "T-Bills Center Only", "SDF Needs NO Collateral", "GST Council 1/3 Center 2/3 States", "CEC Committee: No CJI", "FRA 2006 Nodal: Ministry of Tribal Affairs").
3. **Google Sheets Progress Tracker:** Embedded view for `UPSC_CSE_2027_Prelims_Progress_KPI_Dashboard`.

---

#### MODULE D: DYNAMIC BRIDGE - DAILY CURRENT AFFAIRS BULLETIN
A structured daily logging portal strictly mapping news items to static GS topics with exact timelines & sources:
- **Columns:** Date | Primary Source (The Hindu / PIB / 2nd ARC / SC Judgment / Gazette) | Static GS Link | Key Timeline/Dates | UPSC Elimination Trap / Core Insight.
- **Pre-populated Entries:**
  1. *GST Council Decisions & Federalism:* Art 279A | 15 Sep 2016 Est, 01 Jul 2017 Impl | Voting: Center 1/3, States 2/3, 75% Majority required.
  2. *NBFC Scale-Based Regulation (SBR):* RBI Bulletin | 22 Oct 2021 Rules, 01 Oct 2022 Impl | NBFCs cannot accept Demand Deposits; DICGC 5L insurance does NOT apply.
  3. *G7 Global Minimum Tax (Pillar 2):* OECD / The Hindu | 08 Oct 2021 Deal, 01 Jan 2024 Impl | Sets 15% global minimum corporate tax.
  4. *RBI Surplus Transfer:* PIB | 26 Aug 2019 (Jalan Comm), 23 May 2024 (Rs 2.11L Cr) | Non-tax revenue receipt (No liability/asset reduction).
  5. *CEC & EC Appointment Act 2023:* Gazette of India | 28 Dec 2023 Act, 15 Mar 2024 Appt | Selection Committee: PM + Opposition Leader + Cabinet Min (CJI NOT in committee).
  6. *Forest Rights Act (FRA 2006):* MoEFCC / SC Orders | 29 Dec 2006 Act, 19 Feb 2024 SC Order | Nodal Ministry: Ministry of Tribal Affairs (NOT MoEFCC).

---

#### MODULE E: DAILY 6-HOUR SPLIT ROUTINE SCHEDULER & TIMER
Interactive execution dashboard based on the 4-Block Split:
- **Block 1 (Static GS Core - 3 Hours):** Deep Active Recall Protocol (3-Read method).
- **Block 2 (Applied MCQ Drilling - 1 Hour):** Reverse-engineering 25-30 MCQs.
- **Block 3 (The Dynamic Bridge - 1 Hour):** Current Affairs static alignment.
- **Block 4 (CSAT Insurance - 1 Hour):** Quant & Logical Reasoning drills (Number System, Cyclicity, Remainder Theorem, Trailing Zeros, P&C).
*Features:* Integrated Pomodoro timer, Daily Completion Checkbox, Weekly Execution Heatmap (Mon-Sun).

---

#### MODULE F: ERROR MATRIX & CSAT PRACTICE LOG
- **Error Matrix Logger:** Ability to log incorrect mock test questions under 3 categories:
  - *Category A: Conceptual Gap* (Triggers immediate source review).
  - *Category B: Information Omission* (Generates instant flashcard).
  - *Category C: Reading Reflex Error* (Underlines qualifiers).
- **CSAT Formula & Concept Vault:** Interactive reference cards for Number System rules (Cyclicity of 4, Remainder Patterns, Trailing Zeros $2 \times 5$ pairs, Divisibility rules).

---

### 4. DATA PERSISTENCE & TECHNICAL FUNCTIONALITY
- Implement LocalStorage / Database Persistence so all checked syllabus items, current affairs entries, error logs, and notes persist across sessions.
- Provide JSON Import/Export capability to back up user progress data.
- Search and Filter functionality across all modules (Syllabus, CA Bulletin, Error Matrix).