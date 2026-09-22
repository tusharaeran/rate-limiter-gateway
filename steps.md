# Development Steps & Approach Ledger (steps.md)
## Project: Pressure Meter (Rate Limiter Gateway Demo)
**Record Keeper:** AI Pair Programmer & Lead Engineering  
**Initialized:** 2026-09-22  

---

## 1. Architectural Philosophy & Strategy

Our goal is to build a rock-solid, production-grade, highly engaging full-stack application that is **hackproof**, **low-latency**, and **resilient to modern web vulnerabilities**. 

To maintain transparency, high code quality, and maintainability, development follows structured phases. Every step is logged below with technical rationale, security checks, and verification results.

---

## 2. Phase-by-Phase Execution Plan

### Phase 1: Architectural Blueprint & Documentation
- [x] **Step 1.1:** Create `PRD.md` covering all functional/non-functional requirements, routes, controls, and telemetry specifications.
- [x] **Step 1.2:** Create `TRD.md` detailing technical stack decisions, Redis data structures, algorithm mechanisms (Fixed Window & Sliding Window), and comprehensive security hardening.
- [x] **Step 1.3:** Create `UI_UX_THEME.md` specifying color palette, design tokens, typography (`Space Grotesk`, `JetBrains Mono`), layout wireframes, and CRT terminal micro-interactions.
- [x] **Step 1.4:** Initialize `steps.md` to continuously record engineering decisions and execution milestones.

### Phase 2: Repository Scaffolding & Git Tracking
- [ ] **Step 2.1:** Configure root `.gitignore` (node_modules, .env, build artifacts, logs).
- [ ] **Step 2.2:** Establish backend structure (`backend/package.json`, `src/config`, `src/middleware`, `src/routes`, `src/utils`).
- [ ] **Step 2.3:** Commit: `feat: initialize monorepo structure, documentation and .gitignore`.

### Phase 3: Backend Security Shield, Redis Client & Fallback Engine
- [ ] **Step 3.1:** Implement `redisClient.js` with auto-reconnection, ping health checks, and in-memory fallback mirror for zero-dependency local testing.
- [ ] **Step 3.2:** Harden HTTP layer with `helmet`, strict CORS, and payload body parser limits (`10kb`).
- [ ] **Step 3.3:** Build request logger and metrics accumulator (`requestLogger.js`), logging timestamps, latency, status codes, IPs, and 15s bucket aggregation.
- [ ] **Step 3.4:** Commit: `feat: setup express security shield and resilient redis client`.

### Phase 4: Rate Limiting Algorithms Implementation
- [ ] **Step 4.1:** Implement **Fixed Window Counter** (`fixedWindow.js`) using Redis `INCR` + `EXPIRE` with standard rate limit headers.
- [ ] **Step 4.2:** Implement **Sliding Window Log** (`slidingWindow.js`) using Redis sorted sets (`ZADD`, `ZREMRANGEBYSCORE`, `ZCARD`).
- [ ] **Step 4.3:** Build `rateLimiterDispatcher.js` to dynamically toggle rate limiting and route traffic through the selected algorithm.
- [ ] **Step 4.4:** Commit: `feat: implement fixed window and sliding window rate limiting algorithms`.

### Phase 5: API Endpoints, Metrics & Burst Traffic Simulator
- [ ] **Step 5.1:** Implement protected dummy routes (`GET /api/data`, `POST /api/login`, `POST /api/upload`, `GET /api/profile`).
- [ ] **Step 5.2:** Implement control endpoints with strict schema validation (`POST /api/toggle`, `POST /api/algorithm`, `POST /api/limit`, `POST /api/reset`).
- [ ] **Step 5.3:** Implement server-side burst traffic simulator (`POST /api/send-burst`) firing 20 concurrent requests.
- [ ] **Step 5.4:** Implement telemetry routes (`GET /api/stats`, `GET /api/activity`, `GET /api/logs`, `GET /api/status`).
- [ ] **Step 5.5:** Commit: `feat: implement api routes, telemetry polling endpoints and burst simulator`.

### Phase 6: Frontend Scaffolding & Terminal Hacker Design System
- [ ] **Step 6.1:** Initialize React + Vite frontend application.
- [ ] **Step 6.2:** Set up Google Fonts (`Space Grotesk` & `JetBrains Mono`) and configure `index.css` with dark theme design tokens, CRT scanlines, and glow effects.
- [ ] **Step 6.3:** Commit: `feat: scaffold react vite frontend with terminal hacker design system`.

### Phase 7: UI Components & Dashboard Assembly
- [ ] **Step 7.1:** Build `TopBar.jsx` (terminal dots, live clock, GitHub link, demo burst CTA).
- [ ] **Step 7.2:** Build `HeroSection.jsx` (pulsing radar scanner, typography, taglines).
- [ ] **Step 7.3:** Build `SystemStatus.jsx` (Gateway health, Redis connectivity, uptime counter).
- [ ] **Step 7.4:** Build `ComparisonPanels.jsx` (Chaos vs. Order ASCII art panels).
- [ ] **Step 7.5:** Build `ControlBar.jsx` (toggle switch, algorithm segmented control, slider, burst button).
- [ ] **Step 7.6:** Build `StatCards.jsx` (4 cards with real-time SVG sparklines).
- [ ] **Step 7.7:** Build `DashboardPanels.jsx` (recent requests table with live pulsing dot & 15-second stacked activity bar chart).
- [ ] **Step 7.8:** Build `Footer.jsx` (tech stack badges and manifesto).
- [ ] **Step 7.9:** Commit: `feat: build complete dashboard layout and terminal components`.

### Phase 8: Real-Time Live Polling & State Synchronization
- [ ] **Step 8.1:** Implement `useDashboardPolling` custom hook fetching `/api/stats`, `/api/logs`, `/api/activity`, `/api/status` every 2.5 seconds.
- [ ] **Step 8.2:** Wire interactive controls to backend APIs with instant UI optimism and error feedback.
- [ ] **Step 8.3:** Commit: `feat: wire live polling, data streaming and interactive controls`.

### Phase 9: Verification, Security Audit & README Documentation
- [ ] **Step 9.1:** Perform end-to-end integration test (Fixed Window vs. Sliding Window, Burst 20 requests, Rate Limiting toggle).
- [ ] **Step 9.2:** Perform security vulnerability audit (CORS validation, helmet headers check, payload limit test, input sanitization verification).
- [ ] **Step 9.3:** Author comprehensive `README.md` with architecture diagrams, algorithmic trade-off tables, and setup instructions.
- [ ] **Step 9.4:** Commit: `docs: add comprehensive README with architecture and security specs`.

---

## 3. Security & Vulnerability Defense Checklist

| Security Requirement | Defense Mechanism Chosen | Verification Status |
|---|---|---|
| **DDoS / Request Flooding** | Redis-backed Fixed Window & Sliding Window rate limiters | Planned |
| **Control Route Abuse** | Concurrency cap & limit boundary validation (10–1000) | Planned |
| **JSON Memory Bombs** | `express.json({ limit: '10kb' })` body size limit | Planned |
| **XSS & Clickjacking** | `helmet` CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff` | Planned |
| **Cross-Origin Scraping** | Explicit CORS whitelist configuration | Planned |
| **Redis Injection** | 100% Parameterized Redis queries; zero raw string interpolation | Planned |
| **Redis Memory Exhaustion** | Strict TTL on rate limit keys + `LTRIM` capped at 50 logs | Planned |
| **IP Spoofing Bypass** | Safe IP extraction with configured `trust proxy` | Planned |
| **Information Disclosure** | Error masking middleware; `X-Powered-By` header stripped | Planned |

---

## 4. Execution Log & Status

| Phase | Milestone | Execution Date | Status |
|---|---|---|---|
| Phase 1 | Requirements & Design Documents | 2026-09-22 | **Completed** |
| Phase 2 | Monorepo & Git Init | Pending | Ready to execute |
| Phase 3 | Backend Security & Redis Core | Pending | Queued |
| Phase 4 | Rate Limiting Algorithms | Pending | Queued |
| Phase 5 | API Routes & Burst Simulator | Pending | Queued |
| Phase 6 | Frontend Scaffolding | Pending | Queued |
| Phase 7 | UI Components & Visuals | Pending | Queued |
| Phase 8 | Polling & Control Binding | Pending | Queued |
| Phase 9 | Verification & Security Audit | Pending | Queued |
