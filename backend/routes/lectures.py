from fastapi import APIRouter, HTTPException
from database import supabase
from pydantic import BaseModel

router = APIRouter()


class LectureCreate(BaseModel):
    teacher_id: str
    subject_name: str
    class_name: str
    division: str | None = None
    lecture_title: str
    lecture_date: str
    start_time: str | None = None
    end_time: str | None = None
    notes: str | None = None
    material_url: str | None = None


class LectureUpdate(BaseModel):
    teacher_id: str | None = None
    subject_name: str | None = None
    class_name: str | None = None
    division: str | None = None
    lecture_title: str | None = None
    lecture_date: str | None = None
    start_time: str | None = None
    end_time: str | None = None
    notes: str | None = None
    material_url: str | None = None


@router.get("/lectures")
def get_lectures():
    response = (
        supabase
        .table("lectures")
        .select("*, staff(name)")
        .execute()
    )

    return response.data


@router.get("/lectures/{lecture_id}")
def get_lecture(lecture_id: str):
    response = (
        supabase
        .table("lectures")
        .select("*")
        .eq("id", lecture_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=404, detail="Lecture not found")

    return response.data[0]


@router.post("/lectures")
def create_lecture(lecture: LectureCreate):
    response = (
        supabase
        .table("lectures")
        .insert({
            "teacher_id": lecture.teacher_id,
            "subject_name": lecture.subject_name,
            "class_name": lecture.class_name,
            "division": lecture.division,
            "lecture_title": lecture.lecture_title,
            "lecture_date": lecture.lecture_date,
            "start_time": lecture.start_time,
            "end_time": lecture.end_time,
            "notes": lecture.notes,
            "material_url": lecture.material_url
        })
        .execute()
    )

    return response.data


@router.put("/lectures/{lecture_id}")
def update_lecture(lecture_id: str, lecture: LectureUpdate):
    update_data = lecture.model_dump(exclude_unset=True)

    response = (
        supabase
        .table("lectures")
        .update(update_data)
        .eq("id", lecture_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=404, detail="Lecture not found")

    return response.data[0]


@router.delete("/lectures/{lecture_id}")
def delete_lecture(lecture_id: str):
    response = (
        supabase
        .table("lectures")
        .delete()
        .eq("id", lecture_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=404, detail="Lecture not found")

    return {"message": "Lecture deleted successfully"}