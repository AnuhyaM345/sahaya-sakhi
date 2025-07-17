# 🌸 Sahaya Sakhi – An AI-powered Women’s Empowerment Platform

![MIT License](https://img.shields.io/badge/License-MIT-green.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/AnuhyaM345/sahaya-sakhi)
![GitHub repo size](https://img.shields.io/github/repo-size/AnuhyaM345/sahaya-sakhi)
![GitHub issues](https://img.shields.io/github/issues/AnuhyaM345/sahaya-sakhi)
![GitHub pull requests](https://img.shields.io/github/issues-pr/AnuhyaM345/sahaya-sakhi)
![GitHub stars](https://img.shields.io/github/stars/AnuhyaM345/sahaya-sakhi?style=social)

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

2. Set up Frontend:
    ```bash
    cd frontend
    npm install
    npm run dev
    
- Frontend runs on: http://localhost:3000

3. Set up Python Backend:
    ```bash
    cd backend
    python -m venv venv
    venv\Scripts\activate  # or source venv/bin/activate on Linux/macOS
    pip install -r requirements.txt
    uvicorn main:app --reload
- Backend runs on: http://localhost:8000

---

## 🛠️ Setting Up the PostgreSQL Database

### 1. 🐘 Install PostgreSQL
Ensure PostgreSQL is installed and running on your system.  
You can download it from: [https://www.postgresql.org/download/](https://www.postgresql.org/download/)

---

### 2. 📦 Install Required Python Packages (IF NOT DONE BEFORE)

- From the `backend/` directory, activate your virtual environment and install the required dependencies:

    ```bash
    cd backend
    python -m venv venv
    venv\Scripts\activate   # or source venv/bin/activate on Linux/macOS
    pip install -r requirements.txt

---

3. 🧪 Create the Database
- You can create a PostgreSQL database using the psql CLI or a GUI tool like pgAdmin:


        CREATE DATABASE sahaya_sakhi;

---

4. 📁 Configure Environment Variables

- Create a .env file in the backend/ directory with the following content:


       DATABASE_URL=postgresql+asyncpg://username:password@localhost:5432/sahaya_sakhi

Replace:

username → your PostgreSQL username

password → your PostgreSQL password

5432 → your PostgreSQL port (default is 5432 unless changed)

✅ Example:

      DATABASE_URL=postgresql+asyncpg://postgres:admin123@localhost:5432/sahaya_sakhi

---

5. 📜 Run Alembic Migrations
From the backend/ directory, apply the existing migrations to set up your schema:

    ```bash
    alembic upgrade head

- ⚠️ Do not run "alembic revision --autogenerate" unless you're creating new migrations.
The existing migration files are already included and version-controlled.

6. ✅ Done!
Your database is now fully set up and connected 🎉
You can now start the FastAPI server:

    ```bash
    uvicorn main:app --reload

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
