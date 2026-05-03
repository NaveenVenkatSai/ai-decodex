# 🧠 AI DecodeX — Smart Past Paper Analyzer

> **AI-powered past paper analyzer** that maps topic frequency against syllabus, ranks high-yield topics, and generates a smart study planner.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://ai-decodex.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Public-blue?style=for-the-badge&logo=github)](https://github.com/yourusername/ai-decodex)

---

## 🎬 Demo Video

📹 **[Watch the Demo on Google Drive](https://drive.google.com/your-video-link-here)**

> *Replace this link with your recorded screen capture before submission.*

---

## 🚀 Live Demo

🌐 **[https://ai-decodex.vercel.app](https://ai-decodex.vercel.app)**

---

## 📖 Problem Statement

Students often rely on past question papers to prepare for exams but lack a structured way to analyze trends and identify important topics. Manually reviewing multiple years of papers is time-consuming and fails to reveal deeper patterns. **AI DecodeX** solves this with an end-to-end AI-powered analysis pipeline.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📤 **Multi-Paper Upload** | Drag & drop multiple PDFs (any year) + optional syllabus |
| 🤖 **AI Pattern Analysis** | Google Gemini 1.5 Flash extracts topics, types, difficulty |
| 📚 **Syllabus Cross-Reference** | Maps topics against official syllabus, finds gaps |
| 🎯 **Importance Scoring** | Ranks topics Critical → High → Medium → Low |
| 📅 **Smart Study Planner** | AI-generated 6-week personalized schedule |
| 📊 **Visual Analytics** | Frequency charts, year trends, heatmaps, difficulty curves |
| 📝 **Practice Questions** | AI generates exam-style questions for any topic |
| 🔄 **Demo Mode** | Fully functional without uploading any files |

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Vanilla CSS (Custom Design System) |
| AI | Google Gemini 1.5 Flash API |
| Charts | Chart.js + react-chartjs-2 |
| PDF Parsing | pdf-parse (server-side) |
| Hosting | Vercel |

---

## 📸 Screenshots

### Landing Page
![Landing Page](./screenshots/landing.png)

### Upload Flow
![Upload](./screenshots/upload.png)

### Analytics Dashboard
![Dashboard](./screenshots/dashboard.png)

### Study Planner
![Study Planner](./screenshots/planner.png)

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Gemini API key (optional — demo mode works without it)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-decodex.git
cd ai-decodex
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables (optional)
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Get your free API key at https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note:** The app works in demo mode without an API key. Add the key to enable real AI analysis of your uploaded papers.

### 4. Run locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Build for production
```bash
npm run build
npm start
```

---

## 🚀 Deploy to Vercel

1. Push code to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Add `GEMINI_API_KEY` environment variable in Vercel dashboard
4. Deploy!

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── upload/page.tsx       # Upload & analysis flow
│   ├── dashboard/page.tsx    # Analytics dashboard (5 tabs)
│   ├── study-planner/page.tsx # 6-week study plan
│   └── api/
│       ├── analyze/route.ts  # AI analysis endpoint
│       └── practice-questions/route.ts
├── components/
│   ├── Navbar.tsx
│   └── charts/               # Chart.js components
├── lib/
│   ├── gemini.ts             # AI client + mock fallback
│   ├── mockData.ts           # Demo data
│   └── types.ts              # TypeScript types
└── app/globals.css           # Full design system
```

---

## 🧠 How It Works

```
PDF Upload → Text Extraction (pdf-parse)
    → Gemini AI Analysis (topics, types, difficulty)
    → Importance Scoring (frequency × recency × marks weight)
    → Syllabus Gap Detection
    → Study Plan Generation
    → Visual Dashboard
```

---

## 📊 Evaluation Criteria Coverage

| Criteria | Implementation |
|---|---|
| **Impact (20%)** | Directly addresses exam prep inefficiency with data-driven insights |
| **Innovation (20%)** | Multi-signal importance scoring + year-wise heatmap + AI practice Q generation |
| **Technical (20%)** | Next.js 14, TypeScript, Gemini AI, Chart.js, server-side PDF parsing |
| **UX (25%)** | Dark glassmorphism design, drag-drop upload, animated analysis flow, responsive |
| **Presentation (15%)** | Demo video + live Vercel deployment |

---

## 👨‍💻 Author

Built for the **AI DecodeX Hackathon** by UnsaidTalks Education.

---

## 📄 License

MIT License — free to use and modify.
