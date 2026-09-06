from fastapi import APIRouter, HTTPException
from database import supabase
from pydantic import BaseModel

router = APIRouter()


class StudentCreate(BaseModel):
    name: str
    roll_no: str
    class_name: str | None = None
    division: str | None = None
    email: str | None = None


class StudentUpdate(BaseModel):
    name: str | None = None
    roll_no: str | None = None
    class_name: str | None = None
    division: str | None = None
    email: str | None = None


# GET ALL STUDENTS
@router.get("/students")
def get_students():
    response = supabase.table("students").select("*").execute()
    return response.data


# GET ONE STUDENT
@router.get("/students/{student_id}")
def get_student(student_id: str):

    response = (
        supabase
        .table("students")
        .select("*")
        .eq("id", student_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return response.data[0]


# CREATE STUDENT
@router.post("/students")
def create_student(student: StudentCreate):

    response = (
        supabase
        .table("students")
        .insert({
            "name": student.name,
            "roll_no": student.roll_no,
            "class_name": student.class_name,
            "division": student.division,
            "email": student.email
        })
        .execute()
    )

    return response.data


# UPDATE STUDENT
@router.put("/students/{student_id}")
def update_student(
    student_id: str,
    student: StudentUpdate
):

    update_data = student.model_dump(
        exclude_unset=True
    )

    response = (
        supabase
        .table("students")
        .update(update_data)
        .eq("id", student_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return response.data[0]


# DELETE STUDENT
@router.delete("/students/{student_id}")
def delete_student(student_id: str):

    response = (
        supabase
        .table("students")
        .delete()
        .eq("id", student_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return {
        "message": "Student deleted successfully"
    }