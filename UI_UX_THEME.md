# UI/UX Theme & Design System Document
## Project Name: Pressure Meter (Terminal / Cyberpunk Hacker Aesthetic)
**Version:** 1.0.0  
**Design Lead:** Antigravity AI UI/UX Studio  

---

## 1. Visual Design Philosophy

The design philosophy for **Pressure Meter** is rooted in **Retro-Futuristic Terminal Cyberpunk**:
- **Pure Black Abyss:** Absolute dark backgrounds (`#0D0D0D`) create deep contrast, reminiscent of old-school CRT computer consoles and high-security security operations center (SOC) monitors.
- **Matrix Phosphor Green:** Primary interactive elements, data streams, and healthy indicators glow in phosphor matrix green (`#00FF66`).
- **Emergency Crimson:** Blocked traffic, chaos states, and throttled requests alert the user with sharp neon red/crimson accents (`#FF3366`).
- **Hairline ASCII Wireframes:** Rather than heavy card shadows or glossy gradients, containers are defined by subtle, razor-thin borders (`1px solid #1E293B`) or dashed ASCII-box terminal separators (`#334155`).
- **Living Interface:** Dynamic micro-animations—such as a CRT scanline overlay, glowing text shadows, pulsing live indicators, and animated counters—make the dashboard feel alive and reactive.

---

## 2. Color Palette & Design Tokens

### 2.1 CSS Variables (`:root`)

```css
:root {
  /* Surface & Background Colors */
  --bg-abyss: #0a0a0c;          /* Deepest background */
  --bg-surface: #0f1115;        /* Card & container background */
  --bg-surface-elevated: #161922;/* Hover & active states */
  --bg-panel: #11141a;          /* Dashboard sub-panels */

  /* Terminal Accent Colors */
  --matrix-green: #00ff66;      /* Matrix terminal primary */
  --matrix-green-glow: rgba(0, 255, 102, 0.35);
  --matrix-green-subtle: rgba(0, 255, 102, 0.1);

  --crimson-red: #ff3366;       /* Alert / 429 blocked accent */
  --crimson-red-glow: rgba(255, 51, 102, 0.35);
  --crimson-red-subtle: rgba(255, 51, 102, 0.1);

  --cyber-cyan: #00e5ff;        /* Informational & metric accent */
  --cyber-cyan-glow: rgba(0, 229, 255, 0.3);
  --cyber-cyan-subtle: rgba(0, 229, 255, 0.08);

  --terminal-amber: #ffb703;     /* Warnings / Fixed window indicator */
  
  /* Text & Typography Hierarchy */
  --text-primary: #e6edf3;       /* High-contrast crisp white */
  --text-secondary: #8b949e;     /* Subtext & descriptions */
  --text-muted: #484f58;         /* Disabled & background labels */
  --text-terminal: #00ff66;      /* Monospace console text */

  /* Hairline Borders & Dividers */
  --border-hairline: 1px solid #1f242c;
  --border-dashed: 1px dashed #2d333b;
  --border-active-green: 1px solid #00ff66;
  --border-active-red: 1px solid #ff3366;

  /* Elevation & Glow Shadows */
  --glow-green-sm: 0 0 10px rgba(0, 255, 102, 0.25);
  --glow-green-lg: 0 0 25px rgba(0, 255, 102, 0.4);
  --glow-red-sm: 0 0 10px rgba(255, 51, 102, 0.25);
  --glow-cyan-sm: 0 0 10px rgba(0, 229, 255, 0.25);
}
```

---

## 3. Typography System

### 3.1 Font Families
- **Headings & Badges:** `Space Grotesk`, sans-serif (Weights: 600, 700).  
  *Provides a sharp, geometric, modern industrial tech feel.*
- **Body, Code, Numbers & Data Tables:** `JetBrains Mono`, monospace (Weights: 400, 500, 700).  
  *Ensures tabular numbers align perfectly without jittering during live polling updates.*

### 3.2 Font Scale & Tracking
- **Hero Title:** `2.5rem` / `3.25rem`, `font-weight: 700`, `letter-spacing: -0.03em`.
- **Section Headers:** `1.15rem`, `font-weight: 600`, `text-transform: uppercase`, `letter-spacing: 0.08em`.
- **Stat Values:** `1.85rem`, `font-family: 'JetBrains Mono'`, `font-weight: 700`.
- **Table Data & Logs:** `0.85rem`, `font-family: 'JetBrains Mono'`, `font-weight: 400`, `line-height: 1.5`.
- **Terminal Tags:** `0.75rem`, `text-transform: uppercase`, `letter-spacing: 0.1em`.

---

## 4. Spacing, Layout & Grid Architecture

### 4.1 Layout Specifications
- **Max Width:** `1280px`, centered with `padding: 0 1.5rem`.
- **Vertical Spacing Rhythm:**
  - Between major sections: `2rem` (`32px`).
  - Between cards & grid elements: `1rem` (`16px`).
  - Internal card padding: `1.25rem` (`20px`).

### 4.2 Section-by-Section Wireframe Breakdown

#### 1. Top Bar
- Height: `44px`.
- macOS/Linux terminal title bar: 3 circular dots (`#FF5F56`, `#FFBD2E`, `#27C93F`).
- Monospace prompt: `~/pressure-meter $ [demo:live]`.
- Live real-time clock (updates every 1000ms): `2026-09-22 22:15:40 UTC`.
- Right-aligned buttons: `[ GitHub Repo ]` and `[ run --live-demo ]`.

#### 2. Hero Section
- Radar Scanner: SVG radar with rotating sweeping phosphor ray.
- Title: `PRESSURE METER` with soft green neon shadow.
- Tagline: `SAME API. A HEALTHIER INTERNET.`
- Subtext: `Real-time visualization contrasting uncontrolled API traffic chaos with controlled rate-limited infrastructure.`

#### 3. System Status Block
- Monospaced grid of 4 indicators:
  - `[API GATEWAY]` -> `STATUS: HEALTHY` (flashing green beacon).
  - `[REDIS STORE]` -> `STATUS: CONNECTED (127.0.0.1:6379)` / `LOCAL RUNTIME`.
  - `[SERVER UPTIME]` -> `UPTIME: 00h 14m 28s` (increments dynamically).
  - `[LAST HEALTH CHECK]` -> `22:15:42 (0.8ms latency)`.

#### 4. Comparison Panels (Side-by-Side)
- **Left: [ WITHOUT RATE LIMITING ] (Red-Tinted Chaos)**
  - Red dashed hairline border.
  - Glitch ASCII Brain graphic.
  - Alert stream: `ERR: 503 Service Unavailable`, `ERR: Server Overload`, `ERR: High Infrastructure Cost`, `ERR: Cascading Failures`.
  - Footer badge: `> UNCONTROLLED REQUESTS = CHAOS <`.
- **Right: [ WITH RATE LIMITING ] (Green-Tinted Order)**
  - Green dashed hairline border.
  - ASCII Shield with verified checkmark graphic.
  - Steady stream: `[OK] 200 Request Allowed (12ms)`, `[OK] 200 Request Allowed (11ms)`.
  - Footer badge: `> CONTROLLED REQUESTS = A HEALTHIER INTERNET <`.

#### 5. Interactive Control Bar
- Container: Terminal command console look with dashed green border.
- Controls:
  - **Rate Limiting Switch:** Custom terminal toggle switch (OFF / ON) with active neon glow.
  - **Algorithm Segmented Control:** Dual-button toggle between `[ Fixed Window ]` and `[ Sliding Window ]`.
  - **Request Limit Slider:** Range slider from 10 to 1000 req/min with live numeric readout: `[ LIMIT: 100 REQ/MIN ]`.
  - **Burst Trigger Button:** High-visibility green neon button: `send-burst --requests=20` with execution progress indicator.

#### 6. Four Stat Cards (Row Grid)
- `1fr 1fr 1fr 1fr` responsive grid.
- Cards:
  1. `TOTAL_REQUESTS`: Cyan accent, cumulative count, mini SVG sparkline.
  2. `BLOCKED_REQUESTS`: Red alert accent, blocked 429 count, mini SVG sparkline.
  3. `SUCCESSFUL_REQUESTS`: Green accent, 200 count, mini SVG sparkline.
  4. `AVG_RESPONSE_TIME`: Amber accent, rolling average in ms, mini SVG sparkline.

#### 7. Operations Panels (Side-by-Side Dual Columns)
- **Left Column:** `recent_requests.log`
  - Terminal window header with pulsing green "LIVE" indicator.
  - Monospace table: `TIME | METHOD | ENDPOINT | STATUS | CLIENT IP | LATENCY`.
  - Status badges: `200 OK` (green background pill) vs `429 BLOCKED` (red background pill).
- **Right Column:** `request_activity (last 5 minutes)`
  - Header: Stacked bar chart showing requests grouped into 15-second buckets.
  - Legend: Green bars = Allowed (`200`), Red bars = Throttled (`429`).
  - Terminal gridlines and dark tooltip.

#### 8. Footer
- Attribution links, GitHub URL, and tech stack tags: `[ React ]`, `[ Node.js ]`, `[ Redis ]`, `[ Express.js ]`.
- Closing manifesto: `"A safer internet, one request at a time."`

---

## 5. Micro-Animations & Hacker Effects

1. **CRT Scanline Overlay (Performant CSS):**
   - Subtle repeating linear gradient overlay (`rgba(0,0,0,0) 50%, rgba(0,0,0,0.25) 50%`) with `pointer-events: none` across the viewport.
2. **Pulsing "LIVE" Beacon:**
   - CSS `@keyframes livePulse`: Soft green dot expanding and contracting with `box-shadow` ripple.
3. **Number Ticker Transition:**
   - Smooth tabular transition on stat card number increments.
4. **Button Click Feedback:**
   - Terminal active press effect (`transform: translateY(1px)` with rapid neon brightness flash).
