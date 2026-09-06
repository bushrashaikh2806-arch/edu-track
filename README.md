# EduTrack 🎓

EduTrack is a Student Management and Lecture Attendance System designed for colleges and educational institutions.

## ✨ Features

- 🔐 Secure email and password login
- 👨‍🎓 Student management
- 👩‍🏫 Teacher/staff management
- 📚 Lecture management
- 📝 Lecture notes and study material
- ✅ Student lecture attendance
- 📊 Attendance percentage tracking
- ⚠️ Attendance warning below 75%
- 🏫 Class and division management
- 📈 Attendance reports and statistics
- 📢 Notice Board
- 🗄️ Real database storage

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend

- Python
- FastAPI
- Uvicorn

### Database & Authentication

- Supabase
- PostgreSQL
- Supabase Authentication

## 🏗️ Architecture

```text
Frontend (Next.js + React)
          ↓
       FastAPI
          ↓
Supabase PostgreSQL
          +
Supabase Authentication

📂 Project Structure:

edu-track/
│
├── app/
│   ├── (dashboard)/
│   │   ├── attendance/
│   │   ├── classes/
│   │   ├── dashboard/
│   │   ├── reports/
│   │   ├── staff/
│   │   └── students/
│   └── login/
│
├── backend/
│   ├── routes/
│   │   ├── accounts.py
│   │   ├── attendance.py
│   │   ├── lectures.py
│   │   ├── reports.py
│   │   ├── students.py
│   │   └── teachers.py
│   ├── database.py
│   ├── main.py
│   └── requirements.txt
│
├── components/
├── lib/
├── public/
├── package.json
└── README.md