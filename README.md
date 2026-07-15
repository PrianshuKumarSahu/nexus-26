<div align="center">

  <h1>🏟️ Nexus 26</h1>
  <p><b>Intelligent Stadium Operations & Fan Experience Platform for FIFA World Cup 2026</b></p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  </p>
  
  <p><i>Nexus 26 is a GenAI-powered dual-interface platform that seamlessly connects stadium staff and global fans through real-time operational intelligence, multi-lingual assistance, and dynamic crowd management.</i></p>

</div>

---

## ✨ Key Features

### 👤 Fan Experience Mode
* **Multilingual GenAI Assistant:** Instant, context-aware help in 7+ languages powered by Google Gemini 1.5 Flash.
* **Interactive Smart Map:** Live SVG stadium mapping with real-time zone density and AI-suggested gate routing.
* **AI Transport Hub:** Live transport options (Shuttles, Metro, Walking) with dynamic crowd levels and AI recommendations.
* **Live Match Intelligence:** Real-time scores, schedules, and stadium statuses updated instantly.

### 🛡️ Staff Operations HQ
* **Live Crowd Density Monitoring:** Visual progress trackers with trend arrows for all stadium gates.
* **Incident Alert System:** Color-coded priority alerts (Critical, Warning, Info) for rapid response deployment.
* **Operational AI Insights:** One-click GenAI analysis of traffic flow, food court loads, and crowd bottlenecks.
* **Sustainability Tracker:** Real-time metrics on waste recycling, renewable energy, and carbon offsets.

---

## 🏗️ System Architecture

Nexus 26 operates on a decoupled Client-Server architecture utilizing a RESTful GenAI Bridge.

```mermaid
graph TD
    subgraph Frontend [React + Vite + Tailwind v4]
        UI[User Interface]
        FM[Fan Mode]
        SM[Staff Mode]
        UI --> FM
        UI --> SM
    end

    subgraph Backend [Node.js + Express]
        API[Express API Gateway]
        AI[GenAI Service Controller]
        Fallback[Smart Fallback Engine]
    end
    
    subgraph External [External Services]
        Gemini[Google Gemini 1.5 Flash]
    end

    FM -->|Chat / Routing Queries| API
    SM -->|Operations / Intel Queries| API
    API --> AI
    
    AI -->|Active API Key| Gemini
    AI -->|No Key Detected| Fallback
    
    Gemini -.->|Inference Output| AI
    Fallback -.->|Mock Intelligence| AI
    
    AI -->|JSON Response| UI
```

---

## 📊 Crowd Routing & Density Logic

The platform dynamically calculates crowd limits and wait times to safely route millions of fans.

```mermaid
pie title Average MatchDay Gate Distribution
    "Gate A (North)" : 18
    "Gate B (East)" : 24
    "Gate C (South) - Congested" : 35
    "Gate D (West)" : 15
    "VIP & Other" : 8
```

```mermaid
sequenceDiagram
    participant Fan as Fan (Mobile App)
    participant Map as Nexus 26 Smart Map
    participant AI as Gemini GenAI
    participant Staff as Staff Dashboard

    Fan->>Map: Clicks on Gate C (Congested 85%)
    Map->>AI: Request routing logic for Gate C
    AI-->>Map: Suggest redirect to Gate D (42%)
    Map-->>Fan: Displays visual route to Gate D (< 2 min wait)
    
    rect rgb(255, 71, 87, 0.1)
    Note over Staff, AI: Meanwhile at Staff HQ...
    Staff->>AI: Query "Current Crowd Analysis"
    AI-->>Staff: "ALERT: Gate C at 85%. Redirecting fans to D. Deploy 2 stewards to South Concourse."
    end
```

---

## 🚀 Getting Started

### Prerequisites
* Node.js v18+
* npm or yarn
* [Google Gemini API Key](https://aistudio.google.com/app/apikey) (Free)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PrianshuKumarSahu/fifa26-smart-assist.git
   cd fifa26-smart-assist
   ```

2. **Setup the Backend**
   ```bash
   cd backend
   npm install
   
   # Add your Gemini API Key
   # Open .env and replace YOUR_GEMINI_API_KEY_HERE with your real key
   
   # Start the backend server (runs on Port 3001)
   npm run dev
   ```

3. **Setup the Frontend**
   ```bash
   # In a new terminal
   cd frontend
   npm install
   
   # Start the Vite development server
   npm run dev
   ```

4. **Open the App**
   Navigate to `http://localhost:5174` in your browser.

---

## 🎨 UI/UX Design System

Nexus 26 employs a **Premium Dark Glassmorphic Aesthetic** designed to look cutting-edge while remaining highly accessible.

* **Primary Palette:** Emerald Green `#00e676` (representing the pitch), Cyan `#00d4ff` (AI elements), and FIFA Gold `#ffbe0b`.
* **Typography:** `Orbitron` for futuristic numerics and dynamic data; `Rajdhani` for highly legible, dense operational text.
* **Micro-animations:** Glow pulses, smooth width transitions on data bars, and shimmer loading states ensure the interface feels alive and responsive.

<div align="center">
  <br/>
  <i>Built for the Future of Football ⚽</i>
</div>
