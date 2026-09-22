# Project Requirements Document (PRD)
## Project Name: Pressure Meter (API Rate Limiter Gateway Demo)
**Version:** 1.0.0  
**Status:** Approved  
**Author:** AI Pair Programmer & Lead Engineering  

---

## 1. Executive Summary
**Pressure Meter** is an interactive, full-stack demonstration web application that visually and measurably proves the mission-critical value of API rate limiting in modern web infrastructure. Featuring a terminal/hacker aesthetic, it contrasts an uncontrolled API (experiencing traffic spikes, service degradation, and outages) with a rate-limited API (maintaining strict throughput control, stability, and predictable response times).

All metrics, graphs, counters, and logs displayed in the application are driven by real backend state stored in Redis—never fabricated or hardcoded.

---

## 2. Target Audience & Use Cases
- **Software Engineers & System Architects:** Evaluating rate limiting algorithms (Fixed Window vs. Sliding Window) and their trade-offs.
- **DevOps & Infrastructure Engineers:** Understanding Redis resource footprint, latency impacts, and boundary burst behavior.
- **Technical Recruiters & Engineering Teams:** Demonstrating production-grade full-stack architecture, real-time data streaming, and security hardening.

---

## 3. Core Functional Requirements

### 3.1 Rate Limiting Engine
- **Algorithm Selection:**
  - **Fixed Window Counter:** Implemented using Redis atomic operations (`INCR` + `EXPIRE`). Tracks requests per discrete time window (e.g., 60 seconds).
  - **Sliding Window Log:** Implemented using Redis Sorted Sets (`ZADD`, `ZREMRANGEBYSCORE`, `ZCARD`). Provides precise continuous time-window filtering.
- **Dynamic Configurable Limit:** Adjustable request limit between 10 and 1,000 requests per minute (default: 100 req/min).
- **Master Rate Limiter Toggle:** Ability to dynamically enable or disable rate limiting on the fly with instantaneous application to all protected routes.
- **Per-Client Isolation:** Identifies clients based on IP address (`ratelimit:{algorithm}:{ip}`) with proxy-aware IP resolution.
- **Standard HTTP Compliance:**
  - When allowed: Returns `200 OK` with rate limit telemetry headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`).
  - When throttled: Returns `429 Too Many Requests` with a compliant `Retry-After` header and structured error payload.

### 3.2 Protected Dummy Endpoints
The backend exposes realistic API endpoints that pass through the rate limiter:
- `GET /api/data`: Returns simulated system telemetry.
- `POST /api/login`: Simulates authentication and session creation.
- `POST /api/upload`: Simulates file upload metadata processing.
- `GET /api/profile`: Returns mock authenticated user profile.

### 3.3 System Control & Traffic Simulation
- **Traffic Burst Simulator (`POST /api/send-burst`):**
  - Triggers an immediate burst of 20 concurrent requests against protected endpoints.
  - Allows immediate visual demonstration of how the rate limiter accepts valid requests and rejects surplus traffic with 429 status codes.
- **Configuration Endpoints:**
  - `POST /api/toggle`: Toggles rate limiting state (ON/OFF).
  - `POST /api/algorithm`: Switches active algorithm (`fixed-window` vs. `sliding-window`).
  - `POST /api/limit`: Updates request limit threshold (10–1,000 req/min).
  - `POST /api/reset`: Resets counters, logs, and activity metrics for clean testing.

### 3.4 Live Telemetry & Metrics
- **Aggregated Stats (`GET /api/stats`):**
  - Total requests processed.
  - Blocked requests count (`429`).
  - Successful requests count (`200`).
  - Rolling average response latency (in milliseconds).
  - Sparkline data arrays for historical trend rendering.
- **Time-Bucket Traffic Activity (`GET /api/activity`):**
  - Tracks traffic over the last 5 minutes grouped into 15-second time buckets.
  - Returns dual-series data (allowed requests vs. blocked requests) for stacked bar visualization.
- **Recent Request Logs (`GET /api/logs`):**
  - FIFO list of recent 8–10 requests.
  - Fields: Timestamp, HTTP Method, Endpoint, Status Code, Client IP, Latency (ms).
- **System Health Status (`GET /api/status`):**
  - API Gateway health (`HEALTHY`).
  - Redis connection status (`CONNECTED` or `LOCAL_FALLBACK`).
  - Server uptime formatted in human-readable time (`00h 12m 34s`).
  - Last health check timestamp and active algorithm settings.

---

## 4. Frontend & User Experience Requirements

### 4.1 Layout Hierarchy (Single Page Application)
1. **Top Bar:** Terminal window controls (red/yellow/green dots), `~/pressure-meter $` prompt, application label, live real-time clock, GitHub source link, and `[ run --live-demo ]` quick-burst CTA.
2. **Hero Section:** Radar animation logo, "Pressure Meter" title, tagline "SAME API. A HEALTHIER INTERNET.", and explanatory subtext.
3. **System Status Block:** Monospaced live status bar showing gateway health, Redis status, uptime, and last ping.
4. **Side-by-Side Comparison Panels:**
   - **Left Panel (Red - Chaos):** `[ WITHOUT RATE LIMITING ]`, glitchy ASCII-art brain, simulated service degradation alerts (`ERR: 503 Service Unavailable`, `ERR: Server Overload`, `ERR: High Infrastructure Cost`), footer `> UNCONTROLLED REQUESTS = CHAOS <`.
   - **Right Panel (Green - Order):** `[ WITH RATE LIMITING ]`, clean ASCII-art shield with checkmark, stream of `[OK] 200 Request Allowed`, footer `> CONTROLLED REQUESTS = A HEALTHIER INTERNET <`.
5. **Interactive Control Bar:**
   - Toggle switch: Rate Limiting (ON/OFF).
   - Segmented selector: Fixed Window vs. Sliding Window.
   - Interactive slider: 10 to 1,000 requests/minute with live value readout.
   - Action button: `send-burst --requests=20` with loading/burst state.
6. **Stat Cards Row:**
   - Four distinct stat cards (`total_requests`, `blocked_requests`, `successful_requests`, `avg_response_time`), each featuring dynamic counters and live SVG sparklines.
7. **Operational Dashboard Panels (Dual Columns):**
   - **Left:** `recent_requests.log` table with pulsing green "LIVE" indicator, method badges, status color coding, and client IP.
   - **Right:** `request_activity (last 5 minutes)` stacked bar chart visualizing allowed (green) vs. blocked (red) requests per bucket.
8. **Footer:** Technology stack attribution badges (React, Node.js, Redis, Express.js) and closing manifesto.

### 4.2 Polling & Data Refresh
- Periodic asynchronous polling every 2.5 seconds fetching `/api/stats`, `/api/logs`, `/api/activity`, and `/api/status`.
- Zero page reloads; seamless UI re-rendering.

---

## 5. Security & Vulnerability Hardening Requirements
*(Prioritized per explicit project requirements)*

1. **Defend Against DDoS & Traffic Exhaustion:**
   - The rate limiter itself acts as a defensive shield against brute force, credential stuffing, and volumetric DoS.
2. **Hardened HTTP Headers (OWASP Compliance):**
   - Integrate `helmet` to set Content Security Policy (CSP), prevent Clickjacking (`X-Frame-Options: DENY`), prevent MIME-sniffing (`X-Content-Type-Options: nosniff`), and remove `X-Powered-By`.
3. **Strict CORS Policy:**
   - Explicit origin whitelisting preventing unauthorized cross-origin credentialed requests.
4. **Input Sanitization & Schema Validation:**
   - Strict validation on all control endpoints (`/api/toggle`, `/api/algorithm`, `/api/limit`) rejecting malformed payloads, non-numeric values, or out-of-bound configurations.
5. **No Sensitive Information Leakage:**
   - Standardized JSON error responses without stack traces or internal server paths in non-development modes.
6. **Redis Injection & Memory Abuse Prevention:**
   - Parameterized Redis commands (no raw command injection).
   - Strict TTL on all counter keys to prevent unbounded memory leaks.
   - Fixed size capping (`LTRIM`) on log lists to avoid memory exhaustion.
7. **Safe Client IP Resolution:**
   - Validate and sanitize IP addresses; handle `X-Forwarded-For` with trusted proxy configuration to avoid IP spoofing bypasses.
