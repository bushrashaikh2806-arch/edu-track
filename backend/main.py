from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.lectures import router as lectures_router
from routes.students import router as students_router
from routes.teachers import router as teachers_router
from routes.attendance import router as attendance_router
from routes.reports import router as reports_router
from routes.accounts import router as accounts_router
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(students_router)
app.include_router(teachers_router)
app.include_router(lectures_router)
app.include_router(attendance_router)
app.include_router(reports_router)
app.include_router(accounts_router)

@app.get("/")
def home():
    return {"message": "EduTrack Backend is running!"}