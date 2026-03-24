# student-friendly-jd-summarizer
AI-powered Student Friendly Job Description Summarizer using React JS and Express JS
# 🎯 CareerLens — Student-Friendly Job Description Summarizer

An AI-powered career assistant that helps students understand job descriptions,
analyze skill gaps, and generate personalized learning roadmaps.

---

## 🏗️ Full Project Architecture

```
jd-summarizer/
│
├── 📁 backend/                          ← Node.js + Express Server
│   │
│   ├── 📁 controllers/                  ← Business Logic Layer
│   │   ├── jd.controller.js             ← Handles JD analysis requests
│   │   ├── skill.controller.js          ← Handles skill gap requests
│   │   ├── roadmap.controller.js        ← Handles roadmap generation
│   │   └── chat.controller.js           ← Handles chat requests
│   │
│   ├── 📁 routes/                       ← API Route Definitions
│   │   ├── jd.routes.js                 ← POST /api/analyze-jd
│   │   ├── skill.routes.js              ← POST /api/match-skills
│   │   ├── roadmap.routes.js            ← POST /api/generate-roadmap
│   │   └── chat.routes.js              ← POST /api/chat
│   │
│   ├── 📁 services/                     ← AI Integration Layer
│   │   └── groq.service.js              ← ALL Groq AI prompts and calls
│   │
│   ├── 📁 utils/                        ← Helper Utilities
│   │   ├── pdfParser.js                 ← Extracts text from PDF files
│   │   └── multerConfig.js              ← File upload configuration
│   │
│   ├── 📁 uploads/                      ← Temporary PDF storage
│   ├── server.js                        ← Express app entry point
│   ├── package.json                     ← Backend dependencies
│   └── .env.example                     ← Environment variables template
│
│
├── 📁 frontend/                         ← React.js + Tailwind CSS
│   │
│   ├── 📁 public/
│   │   └── index.html                   ← HTML template
│   │
│   ├── 📁 src/
│   │   │
│   │   ├── 📁 components/
│   │   │   ├── UploadJD.jsx             ← Tab 1: Paste text or upload PDF
│   │   │   ├── SummaryCard.jsx          ← Tab 1: Display AI analysis results
│   │   │   ├── SkillGap.jsx             ← Tab 2: Resume vs JD comparison
│   │   │   ├── Roadmap.jsx              ← Tab 3: Learning roadmap display
│   │   │   └── ChatAssistant.jsx        ← Tab 4: AI career chatbot
│   │   │
│   │   ├── 📁 utils/
│   │   │   └── api.js                   ← All Axios API call functions
│   │   │
│   │   ├── App.js                       ← Root component + tab navigation
│   │   ├── index.js                     ← React DOM entry point
│   │   └── index.css                    ← Tailwind + custom dark theme
│   │
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

---

## 🔄 Application Flow Architecture

```
User Browser (React Frontend)
        │
        │  HTTP Request
        ▼
Express Backend (Node.js)
        │
        ├── /api/analyze-jd
        │       ├── If PDF → pdfParser.js → Extract text
        │       └── If Text → Direct to Groq
        │
        ├── /api/match-skills
        │       └── JD Text + Resume Text → Groq
        │
        ├── /api/generate-roadmap
        │       └── Missing Skills → Groq
        │
        └── /api/chat
                └── Question + History → Groq
                        │
                        ▼
                Groq API (LLaMA 3.3 70B)
                        │
                        ▼
                JSON Response
                        │
                        ▼
                React UI Display
```

---

## 🧠 AI Prompts Architecture (groq.service.js)

```
groq.service.js
│
├── callGroq()              ← Base Groq API caller (used by all functions)
│
├── summarizeJD()           ← Prompt 1: Explain JD in simple/professional terms
│       └── Returns: roleOverview, skills, tools, difficulty, keywords
│
├── matchSkills()           ← Prompt 2: Compare JD vs Resume
│       └── Returns: matched, missing, niceToHave, matchPercentage
│
├── generateRoadmap()       ← Prompt 3: Week-by-week learning plan
│       └── Returns: phases, tasks, resources, milestones
│
├── extractKeywords()       ← Prompt 4: ATS resume keywords
│       └── Returns: mustHave, technical, softSkill, resumeTips
│
├── chatAssistant()         ← Prompt 5: Career Q&A chatbot
│       └── Returns: conversational answer
│
└── parseJSON()             ← Helper: safely parse AI JSON responses
```

---

## 🖥️ Frontend Components Architecture

```
App.js  (Root - manages global state + tab navigation)
│
├── Tab 1: Analyze JD
│       ├── UploadJD.jsx        ← Input: paste text or upload PDF
│       └── SummaryCard.jsx     ← Output: role overview, skills, keywords
│               ├── DifficultyMeter   ← Easy/Medium/Hard gauge
│               └── Chip              ← Skill/keyword pill badges
│
├── Tab 2: Skill Gap
│       └── SkillGap.jsx        ← Resume input + comparison results
│               └── MatchGauge        ← Circular % match indicator
│
├── Tab 3: Roadmap
│       └── Roadmap.jsx         ← Learning plan display
│               └── PhaseCard         ← Collapsible phase with tasks/resources
│
└── Tab 4: AI Chat
        └── ChatAssistant.jsx   ← Full chat interface
                ├── MessageBubble     ← User/AI chat bubbles
                └── TypingIndicator   ← AI thinking animation
```

---

## 🔌 API Endpoints

| Method | Endpoint | Input | Output |
|--------|----------|-------|--------|
| POST | `/api/analyze-jd` | JD text or PDF file | Summary, keywords, difficulty |
| POST | `/api/match-skills` | JD text + Resume text | Matched/missing skills, % match |
| POST | `/api/generate-roadmap` | Missing skills array | Week-by-week learning plan |
| POST | `/api/chat` | Question + history | AI answer |
| GET | `/health` | Nothing | Server status |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend UI | React.js 18 | Component-based UI |
| Styling | Tailwind CSS | Utility-first CSS |
| HTTP Client | Axios | API calls to backend |
| Backend | Node.js + Express | REST API server |
| AI Model | Groq LLaMA 3.3 70B | All AI features |
| PDF Parsing | pdf-parse | Extract text from PDFs |
| File Upload | Multer | Handle PDF uploads |
| Environment | dotenv | Manage API keys |

---

## 🚀 Setup Instructions

### Step 1: Get Groq API Key
1. Go to https://console.groq.com
2. Sign up free and create an API key
3. Copy the key (starts with gsk_...)

### Step 2: Setup Backend
```bash
cd backend
npm install
cp .env.example .env
```

Edit .env file:
```
GROQ_API_KEY=gsk_your_actual_key_here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

```bash
npm run dev
```

### Step 3: Setup Frontend
```bash
cd frontend
npm install
npm start
```

---

## 📦 Backend Dependencies

```json
{
  "express": "^4.18.2",
  "axios": "^1.6.0",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "multer": "^1.4.5",
  "pdf-parse": "^1.1.1",
  "nodemon": "^3.0.1"
}
```

---

## ⚠️ Troubleshooting

| Error | Fix |
|-------|-----|
| All Groq models failed | Update model to llama-3.3-70b-versatile in groq.service.js |
| CORS error | Make sure backend runs on port 5000 |
| PDF parsing failed | Use real PDF not scanned image. Max 5MB |
| Frontend not connecting | Check proxy in frontend/package.json |

---

## 🔄 Future Updates Git Commands

```bash
git add .
git commit -m "describe your change"
git push origin main
```

---

Built with love for students. Powered by Groq LLaMA3.