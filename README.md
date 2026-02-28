# 📚 WordTrace

WordTrace is a process-based authorship transparency platform designed to restore trust in academic writing in the age of AI.

Traditional AI detection tools analyze only the final output and often produce false positives, leading to unfair accusations and academic stress.

WordTrace shifts the focus from output to **process verification** by tracking **how** a document is written — not just **what** is submitted.

By logging real-time writing behavior, detecting paste events, capturing document snapshots, and generating authorship confidence scores, WordTrace provides educators with contextual transparency instead of black-box suspicion.

---

## 🚀 Tech Stack

### Frontend
- **React (Vite)** – UI framework
- **Tailwind CSS** – Styling
- **React Router DOM** – Routing & navigation

### Backend & Data Handling
- **Supabase** – Backend database & cloud persistence
- **React Hooks** – State management (`useState`, `useEffect`)
- **UUID** – Unique event tracking

---

## ✨ Features

### 1️⃣ Real-Time Writing Log
Tracks insert, delete, and paste events with timestamped writing behavior to build a complete writing history.

### 2️⃣ Paste Detection + Explanation Prompt
Detects large paste blocks and prompts students to declare:
- Source
- Reason
- AI usage (if applicable)

### 3️⃣ Timeline Replay
Captures periodic document snapshots and includes an interactive slider to replay the evolution of the writing.

### 4️⃣ Authorship Confidence Meter
Heuristic scoring based on:
- Writing activity depth  
- Revision patterns  
- Paste dependency  

### 5️⃣ AI Transparency Log
Displays:
- Paste events  
- Declared AI usage  
- Source explanations  

### 6️⃣ Professor Dashboard
Allows educators to:
- View submissions  
- Check authorship scores  
- Replay writing timelines  

### 7️⃣ Integrity Report
Generates a downloadable certificate of authorship for verified student work.

---

## 🏗 Architecture Overview

```
Login
   ↓
Student Dashboard
   ↓
Document Editor
   ↓
Process Tracking Engine (Supabase)
   ↓
Submission
   ↓
Professor Dashboard
   ↓
View Student Documents
   ↓
Generate Report
```

---

## 🛠 Installation & Setup

### Prerequisites
- Node.js (v16+ recommended)
- npm installed
- A Supabase project with:
  - `documents` table
  - `submissions` table

---

### Clone Repository

```bash
git clone https://github.com/Navaneetha-Rajesh/WordTrace.git
cd WordTrace
npm install
```

---

### Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

### Run Project

```bash
npm run dev
```

Then open:

```
http://localhost:5173
```

---

## 👥 Team Members

- **Navaneetha Rajesh**
- **Eza Mariyam Robin**

---

## 📄 License

Distributed under the MIT License.

© 2026 Navaneetha Rajesh, Eza Mariyam Robin.
