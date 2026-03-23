# 🎯 CareerLens — Student-Friendly Job Description Summarizer

An AI-powered career assistant that helps students understand job descriptions,
analyze skill gaps, and generate personalized learning roadmaps.

---

## 🗂️ Folder Structure

```
jd-summarizer/
│
├── backend/
│   ├── controllers/
│   │   ├── jd.controller.js        ← JD analysis logic
│   │   ├── skill.controller.js     ← Skill gap logic
│   │   ├── roadmap.controller.js   ← Roadmap generation
│   │   └── chat.controller.js      ← Chat handling
│   │
│   ├── routes/
│   │   ├── jd.routes.js            ← POST /api/analyze-jd
│   │   ├── skill.routes.js         ← POST /api/match-skills
│   │   ├── roadmap.routes.js       ← POST /api/generate-roadmap
│   │   └── chat.routes.js          ← POST /api/chat
│   │
│   ├── services/
│   │   └── groq.service.js         ← 🔑 ALL Groq AI prompts here
│   │
│   ├── utils/
│   │   ├── pdfParser.js            ← PDF text extraction
│   │   └── multerConfig.js         ← File upload config
│   │
│   ├── uploads/                    ← Temp PDF storage (auto-created)
│   ├── server.js                   ← Express entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── index.html
    │
    ├── src/
    │   ├── components/
    │   │   ├── UploadJD.jsx         ← Step 1: Input JD
    │   │   ├── SummaryCard.jsx      ← Step 2: View results
    │   │   ├── SkillGap.jsx         ← Step 3: Compare resume
    │   │   ├── Roadmap.jsx          ← Step 4: Learning plan
    │   │   └── ChatAssistant.jsx    ← Step 5: Ask AI
    │   │
    │   ├── utils/
    │   │   └── api.js               ← Axios API calls
    │   │
    │   ├── App.js                   ← Root + navigation
    │   ├── index.js
    │   └── index.css                ← Tailwind + custom styles
    │
    ├── package.json
    └── tailwind.config.js
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+ installed
- A free Groq API key from https://console.groq.com

---

### Step 1: Get Your Groq API Key
1. Go to https://console.groq.com
2. Sign up (free) and create an API key
3. Copy the key — you'll need it in Step 3

---

### Step 2: Clone / Download the Project

```bash
# If using git:
git clone <your-repo-url>
cd jd-summarizer

# Or just unzip the downloaded folder
```

---

### Step 3: Setup the Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create your .env file
cp .env.example .env

# Edit .env and add your Groq API key:
# GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
```

Your `.env` file should look like:
```env
GROQ_API_KEY=gsk_your_actual_key_here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

```bash
# Start the backend server
npm run dev
# ✅ Server running on http://localhost:5000
```

---

### Step 4: Setup the Frontend

Open a **new terminal**:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the React app
npm start
# ✅ App opens at http://localhost:3000
```

---

### Step 5: Use the App! 🎉

1. **Analyze JD tab** — Paste a job description or upload PDF → click Analyze
2. **Skill Gap tab** — Paste your resume → see matched/missing skills
3. **Roadmap tab** — Auto-generates from missing skills, or enter manually
4. **AI Chat tab** — Ask career questions in natural language

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze-jd` | Analyze a job description (text or PDF) |
| POST | `/api/match-skills` | Compare JD + resume, find skill gaps |
| POST | `/api/generate-roadmap` | Generate learning roadmap for missing skills |
| POST | `/api/chat` | Career Q&A chatbot |
| GET | `/health` | Server health check |

### Example: Analyze JD
```bash
curl -X POST http://localhost:5000/api/analyze-jd \
  -F "jdText=We are looking for a React developer..." \
  -F "mode=student"
```

### Example: Chat
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What is REST API?"}'
```

---

## 🧠 Groq Prompt Templates

All prompts live in `backend/services/groq.service.js`:

| Function | Prompt Purpose |
|----------|----------------|
| `summarizeJD()` | Explain JD in student/professional mode |
| `matchSkills()` | Compare JD vs resume, output gap analysis |
| `generateRoadmap()` | Week-by-week learning plan |
| `extractKeywords()` | ATS keywords for resume |
| `chatAssistant()` | Career Q&A with conversation history |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| AI | Groq API (LLaMA3-70B) |
| PDF | pdf-parse |
| Upload | Multer |

---

## ⚠️ Troubleshooting

**"CORS error"**
→ Make sure backend is running on port 5000 and `CLIENT_URL=http://localhost:3000` in .env

**"AI service unavailable"**
→ Check your GROQ_API_KEY in .env — must start with `gsk_`

**"PDF parsing failed"**
→ Make sure it's a real PDF (not scanned image). Max 5MB.

**Frontend not connecting to backend**
→ Check `"proxy": "http://localhost:5000"` exists in frontend/package.json

---

## 📦 Production Deployment

```bash
# Build frontend
cd frontend
npm run build

# Serve with backend (add to server.js):
# app.use(express.static(path.join(__dirname, '../frontend/build')));
```

---

Built with ❤️ for students by students.
