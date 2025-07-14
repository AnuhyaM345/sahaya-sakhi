# 🌸 Sahaya Sakhi – An AI-powered Women’s Empowerment Platform

**Sahaya Sakhi** is an intelligent, voice-enabled web platform designed to empower women by providing **legal assistance**, **personalized talent recognition**, and **financial support guidance** based on government schemes in India.

---

## 🧠 Core Features

### 🔹 1. Legal Assistance Chatbot (Voice Enabled)
- Provides voice/text-based legal help tailored for Indian women.
- Wake-word activation: **"Sakhi"**
- Integrates **OpenRouter**, **AssemblyAI**, **Hugging Face**, and **ElevenLabs**.
- Responds to queries on rights, domestic abuse, workplace laws, marriage, etc.

### 🔹 2. Talent Recognition System
- Conducts MCQ-based assessments to identify hidden talents.
- Maps talents to career paths, skillsets, and relevant courses.
- Offers personalised recommendations and a downloadable report.

### 🔹 3. Financial Supporter System
- Asks personal questions (age, income, category, disability, etc.)
- Recommends **state/central government schemes** the woman is eligible for.
- Displays scheme links, eligibility, and benefits clearly.

---

## ⚙️ Tech Stack

| Layer     | Technologies Used                           |
|-----------|----------------------------------------------|
| Frontend  | **Next.js**, **Tailwind CSS**, **React**, HTML/CSS |
| Backend   | **FastAPI**, **PostgreSQL**, **SQLAlchemy**  |
| AI & Voice| HuggingFace, AssemblyAI, OpenRouter, ElevenLabs, pyttsx3 |
| Others    | Picovoice Porcupine (custom wake word model) |
| Tools     | Git, GitHub, VS Code, Alembic (DB migrations) |

---

## 📂 Project Structure
      ```bash
      sahaya-sakhi/
      ├── backend/
      │   ├── __pycache__/
      │   ├── alembic/
      │   ├── pydanticmodels/
      │   ├── routers/
      │   ├── scripts/
      │   ├── services/
      │   ├── venv/                # (Ignored by Git using .gitignore)
      │   ├── .env                 # Environment variables
      │   ├── alembic.ini
      │   ├── auth.py
      │   ├── config.py
      │   ├── crud.py
      │   ├── database.py
      │   ├── main.py              # FastAPI entry point
      │   ├── models.py
      │   ├── schemas.py
      │   └── requirements.txt     # Python dependencies
      
      ├── frontend/
      │   ├── .next/               # Next.js build output
      │   ├── app/
      │   ├── components/
      │   ├── lib/
      │   ├── node_modules/        # Node packages (auto-generated)
      │   ├── public/
      │   ├── types/
      │   ├── .env.local           # Frontend env variables
      │   ├── .gitignore
      │   ├── global.d.ts
      │   ├── next-env.d.ts
      │   ├── next.config.ts
      │   ├── package-lock.json
      │   ├── package.json         # NPM dependencies
      │   ├── postcss.config.mjs
      │   ├── README.md
      │   └── tsconfig.json
      
      ├── .gitignore
      └── README.md

---

## 👩‍💻 How to Run Locally

1. Clone the repo:
   ```bash
   git clone https://github.com/AnuhyaM345/sahaya-sakhi.git
   cd sahaya-sakhi

2. Set up Python backend:
    ```yaml
    cd backend
    python -m venv venv
    venv\Scripts\activate
    pip install -r requirements.txt
    uvicorn main:app --reload

3. Set up frontend:
    ```bash
    cd ../frontend
    npm install
    npm run dev

- Make sure to configure your .env files with API keys and DB URLs.

---

## 🧪 Admin Dashboard (Optional)
- Admin can:

  - Add new talents
  - Update courses and career paths
  - Monitor system usage and chatbot queries

---

## 🌟 Future Enhancements
- 🌍 Multi-language support (Telugu, Hindi)

- 📲 Mobile app integration (React Native)

- 📊 Visual analytics dashboard for user insights

---

## 🙋‍♀️ Built With Passion by
**Anuhya Mattaparthi**

Final Year B.Tech Student | Passionate about Cybersecurity, AI, and Empowerment Tech

🔗 https://github.com/AnuhyaM345

---

## 📜 License
This project is licensed under the MIT License — feel free to use and improve it!

---
