from fastapi import APIRouter, HTTPException
from database import supabase
from pydantic import BaseModel

router = APIRouter()


class TeacherCreate(BaseModel):
    name: str
    employee_id: str | None = None
    email: str | None = None
    phone: str | None = None
    role: str | None = None


class TeacherUpdate(BaseModel):
    name: str | None = None
    employee_id: str | None = None
    email: str | None = None
    phone: str | None = None
    role: str | None = None


@router.get("/teachers")
def get_teachers():
    response = supabase.table("staff").select("*").execute()
    return response.data


@router.get("/teachers/{teacher_id}")
def get_teacher(teacher_id: str):
    response = (
        supabase
        .table("staff")
        .select("*")
        .eq("id", teacher_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=404, detail="Teacher not found")

    return response.data[0]


@router.post("/teachers")
def create_teacher(teacher: TeacherCreate):
    response = (
        supabase
        .table("staff")
        .insert({
            "name": teacher.name,
            "employee_id": teacher.employee_id,
            "email": teacher.email,
            "phone": teacher.phone,
            "role": teacher.role
        })
        .execute()
    )

    return response.data


@router.put("/teachers/{teacher_id}")
def update_teacher(teacher_id: str, teacher: TeacherUpdate):
    update_data = teacher.model_dump(exclude_unset=True)

    response = (
        supabase
        .table("staff")
        .update(update_data)
        .eq("id", teacher_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=404, detail="Teacher not found")

    return response.data[0]


@router.delete("/teachers/{teacher_id}")
def delete_teacher(teacher_id: str):
    response = (
        supabase
        .table("staff")
        .delete()
        .eq("id", teacher_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=404, detail="Teacher not found")

    return {"message": "Teacher deleted successfully"}