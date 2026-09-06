from fastapi import APIRouter, HTTPException
from database import supabase
from pydantic import BaseModel
from datetime import datetime, timezone

router = APIRouter()


# =========================
# MODELS
# =========================

class AttendanceCreate(BaseModel):
    lecture_id: str
    student_id: str
    status: str


class AttendanceUpdate(BaseModel):
    status: str


class BulkAttendanceCreate(BaseModel):
    lecture_id: str
    attendance: list[dict]


# =========================
# GET PRESENT TODAY
# =========================

@router.get("/attendance/today/present")
def get_present_today():

    today = datetime.now(timezone.utc).date().isoformat()

    # Get today's lectures
    lectures_response = (
        supabase
        .table("lectures")
        .select("id")
        .eq("lecture_date", today)
        .execute()
    )

    lecture_ids = [
        lecture["id"]
        for lecture in (lectures_response.data or [])
    ]

    if not lecture_ids:
        return {"count": 0}

    response = (
        supabase
        .table("student_attendance")
        .select("id", count="exact")
        .eq("status", "present")
        .in_("lecture_id", lecture_ids)
        .execute()
    )

    return {
        "count": response.count or 0
    }


# =========================
# GET ABSENT TODAY
# =========================

@router.get("/attendance/today/absent")
def get_absent_today():

    today = datetime.now(timezone.utc).date().isoformat()

    # Get today's lectures
    lectures_response = (
        supabase
        .table("lectures")
        .select("id")
        .eq("lecture_date", today)
        .execute()
    )

    lecture_ids = [
        lecture["id"]
        for lecture in (lectures_response.data or [])
    ]

    if not lecture_ids:
        return {"count": 0}

    response = (
        supabase
        .table("student_attendance")
        .select("id", count="exact")
        .eq("status", "absent")
        .in_("lecture_id", lecture_ids)
        .execute()
    )

    return {
        "count": response.count or 0
    }


# ============================================================
# GET TODAY ATTENDANCE SUMMARY
# ============================================================

@router.get("/attendance/today-summary")
def get_today_attendance_summary():

    today = datetime.now(timezone.utc).date().isoformat()

    # -----------------------------------------
    # Get today's lectures
    # -----------------------------------------

    lectures_response = (
        supabase
        .table("lectures")
        .select("id")
        .eq("lecture_date", today)
        .execute()
    )

    today_lectures = lectures_response.data or []

    lecture_ids = [
        lecture["id"]
        for lecture in today_lectures
    ]

    # -----------------------------------------
    # No lectures today
    # -----------------------------------------

    if not lecture_ids:
        return {
            "present": 0,
            "late": 0,
            "absent": 0,
            "total": 0
        }

    # -----------------------------------------
    # Get attendance for today's lectures
    # -----------------------------------------

    attendance_response = (
        supabase
        .table("student_attendance")
        .select("status")
        .in_("lecture_id", lecture_ids)
        .execute()
    )

    records = attendance_response.data or []

    # -----------------------------------------
    # Count attendance
    # -----------------------------------------

    present = sum(
        1
        for record in records
        if record["status"] == "present"
    )

    late = sum(
        1
        for record in records
        if record["status"] == "late"
    )

    absent = sum(
        1
        for record in records
        if record["status"] == "absent"
    )

    return {
        "present": present,
        "late": late,
        "absent": absent,
        "total": present + late + absent
    }


# =========================
# GET AVERAGE ATTENDANCE
# =========================

@router.get("/attendance/average")
def get_average_attendance():

    response = (
        supabase
        .table("student_attendance")
        .select("status")
        .execute()
    )

    records = response.data

    if not records:
        return {
            "percentage": 0
        }

    total = len(records)

    present = sum(
        1
        for record in records
        if record["status"] == "present"
    )

    late = sum(
        1
        for record in records
        if record["status"] == "late"
    )

    # Late is counted as attended
    attended = present + late

    percentage = round(
        (attended / total) * 100,
        1
    )

    return {
        "percentage": percentage
    }


# ============================================================
# CLASSES OVERVIEW
# ============================================================

@router.get("/classes/overview")
def get_classes_overview():

    # -----------------------------------------
    # Get all students
    # -----------------------------------------

    students_response = (
        supabase
        .table("students")
        .select("*")
        .execute()
    )

    students = students_response.data or []

    total_students = len(students)


    # -----------------------------------------
    # Get all lectures
    # -----------------------------------------

    lectures_response = (
        supabase
        .table("lectures")
        .select("*")
        .execute()
    )

    lectures = lectures_response.data or []


    # -----------------------------------------
    # Get all attendance records
    # -----------------------------------------

    attendance_response = (
        supabase
        .table("student_attendance")
        .select("*")
        .execute()
    )

    attendance = attendance_response.data or []


    # ========================================================
    # TODAY
    # ========================================================

    today = datetime.now(timezone.utc).date().isoformat()

    today_lectures = [
        lecture
        for lecture in lectures
        if lecture["lecture_date"] == today
    ]

    today_lecture_ids = {
        lecture["id"]
        for lecture in today_lectures
    }

    completed_lecture_ids = {
        record["lecture_id"]
        for record in attendance
        if record["lecture_id"] in today_lecture_ids
    }

    lectures_completed = len(completed_lecture_ids)


    # -----------------------------------------
    # Today's attendance
    # -----------------------------------------

    today_attendance = [
        record
        for record in attendance
        if record["lecture_id"] in completed_lecture_ids
    ]

    present_today = sum(
        1
        for record in today_attendance
        if record["status"] == "present"
    )

    late_today = sum(
        1
        for record in today_attendance
        if record["status"] == "late"
    )

    absent_today = sum(
        1
        for record in today_attendance
        if record["status"] == "absent"
    )


    # ========================================================
    # SUBJECT-WISE ATTENDANCE
    # ========================================================

    subject_names = sorted({
        lecture["subject_name"]
        for lecture in lectures
    })

    subject_wise = []

    for subject in subject_names:

        subject_lectures = [
            lecture
            for lecture in lectures
            if lecture["subject_name"] == subject
        ]

        subject_lecture_ids = {
            lecture["id"]
            for lecture in subject_lectures
        }

        subject_attendance = [
            record
            for record in attendance
            if record["lecture_id"] in subject_lecture_ids
        ]

        present = sum(
            1
            for record in subject_attendance
            if record["status"] == "present"
        )

        late = sum(
            1
            for record in subject_attendance
            if record["status"] == "late"
        )

        absent = sum(
            1
            for record in subject_attendance
            if record["status"] == "absent"
        )

        total = len(subject_attendance)

        if total > 0:
            percentage = round(
                ((present + late) / total) * 100,
                1
            )
        else:
            percentage = 0

        subject_wise.append({
            "subject": subject,
            "lectures": len(subject_lectures),
            "present": present,
            "late": late,
            "absent": absent,
            "attendance_percentage": percentage
        })


    # ========================================================
    # CLASS-WISE ATTENDANCE
    # ========================================================

    class_keys = sorted({
        (
            student["class_name"],
            student["division"]
        )
        for student in students
        if student.get("class_name")
    })

    class_wise = []

    for class_name, division in class_keys:

        class_students = [
            student
            for student in students
            if student.get("class_name") == class_name
            and student.get("division") == division
        ]

        class_student_ids = {
            student["id"]
            for student in class_students
        }

        class_attendance = [
            record
            for record in attendance
            if record["student_id"] in class_student_ids
        ]

        present = sum(
            1
            for record in class_attendance
            if record["status"] == "present"
        )

        late = sum(
            1
            for record in class_attendance
            if record["status"] == "late"
        )

        absent = sum(
            1
            for record in class_attendance
            if record["status"] == "absent"
        )

        total = len(class_attendance)

        if total > 0:
            percentage = round(
                ((present + late) / total) * 100,
                1
            )
        else:
            percentage = 0

        class_wise.append({
            "class_name": class_name,
            "division": division,
            "students": len(class_students),
            "present": present,
            "late": late,
            "absent": absent,
            "attendance_percentage": percentage
        })


    # ========================================================
    # TODAY'S LECTURE ACTIVITY
    # ========================================================

    lecture_activity = []

    for lecture in today_lectures:

        lecture_id = lecture["id"]

        lecture_attendance = [
            record
            for record in attendance
            if record["lecture_id"] == lecture_id
        ]

        present = sum(
            1
            for record in lecture_attendance
            if record["status"] == "present"
        )

        late = sum(
            1
            for record in lecture_attendance
            if record["status"] == "late"
        )

        absent = sum(
            1
            for record in lecture_attendance
            if record["status"] == "absent"
        )

        teacher_response = (
            supabase
            .table("staff")
            .select("name")
            .eq("id", lecture["teacher_id"])
            .execute()
        )

        teacher_name = ""

        if teacher_response.data:
            teacher_name = teacher_response.data[0]["name"]

        lecture_activity.append({
            "id": lecture["id"],
            "subject": lecture["subject_name"],
            "title": lecture["lecture_title"],
            "class_name": lecture["class_name"],
            "division": lecture["division"],
            "date": lecture["lecture_date"],
            "start_time": lecture["start_time"],
            "end_time": lecture["end_time"],
            "teacher": teacher_name,
            "present": present,
            "late": late,
            "absent": absent,
            "completed": lecture_id in completed_lecture_ids
        })


    # ========================================================
    # FINAL RESPONSE
    # ========================================================

    return {
        "today": {
            "date": today,
            "lectures_completed": lectures_completed,
            "total_students": total_students,
            "present": present_today,
            "late": late_today,
            "absent": absent_today
        },

        "subject_wise": subject_wise,

        "class_wise": class_wise,

        "lecture_activity": lecture_activity
    }


# ============================================================
# GET STUDENTS FOR LECTURE
# ============================================================

@router.get("/lectures/{lecture_id}/students")
def get_students_for_lecture(lecture_id: str):

    lecture_response = (
        supabase
        .table("lectures")
        .select("class_name, division")
        .eq("id", lecture_id)
        .execute()
    )

    if not lecture_response.data:
        raise HTTPException(
            status_code=404,
            detail="Lecture not found"
        )

    lecture = lecture_response.data[0]

    query = (
        supabase
        .table("students")
        .select("*")
        .eq("class_name", lecture["class_name"])
    )

    if lecture["division"]:
        query = query.eq(
            "division",
            lecture["division"]
        )

    response = query.execute()

    return response.data


# ============================================================
# GET EXISTING ATTENDANCE FOR A LECTURE
# ============================================================

@router.get("/lectures/{lecture_id}/attendance")
def get_lecture_attendance(lecture_id: str):

    lecture_response = (
        supabase
        .table("lectures")
        .select("id")
        .eq("id", lecture_id)
        .execute()
    )

    if not lecture_response.data:
        raise HTTPException(
            status_code=404,
            detail="Lecture not found"
        )

    response = (
        supabase
        .table("student_attendance")
        .select("*")
        .eq("lecture_id", lecture_id)
        .execute()
    )

    return response.data


# =========================
# CREATE ATTENDANCE
# =========================

@router.post("/attendance")
def create_attendance(
    attendance: AttendanceCreate
):

    if attendance.status not in [
        "present",
        "absent",
        "late"
    ]:
        raise HTTPException(
            status_code=400,
            detail="Status must be present, absent, or late"
        )

    response = (
        supabase
        .table("student_attendance")
        .insert({
            "lecture_id": attendance.lecture_id,
            "student_id": attendance.student_id,
            "status": attendance.status
        })
        .execute()
    )

    return response.data


# =========================
# CREATE BULK ATTENDANCE
# =========================

@router.post("/attendance/bulk")
def create_bulk_attendance(
    data: BulkAttendanceCreate
):

    records = []

    for item in data.attendance:

        if item["status"] not in [
            "present",
            "absent",
            "late"
        ]:
            raise HTTPException(
                status_code=400,
                detail="Status must be present, absent, or late"
            )

        records.append({
            "lecture_id": data.lecture_id,
            "student_id": item["student_id"],
            "status": item["status"]
        })

    response = (
        supabase
        .table("student_attendance")
        .upsert(
            records,
            on_conflict="lecture_id,student_id"
        )
        .execute()
    )

    return response.data


# =========================
# UPDATE ATTENDANCE
# =========================

@router.put("/attendance/{attendance_id}")
def update_attendance(
    attendance_id: str,
    attendance: AttendanceUpdate
):

    if attendance.status not in [
        "present",
        "absent",
        "late"
    ]:
        raise HTTPException(
            status_code=400,
            detail="Status must be present, absent, or late"
        )

    response = (
        supabase
        .table("student_attendance")
        .update({
            "status": attendance.status
        })
        .eq("id", attendance_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Attendance record not found"
        )

    return response.data[0]


# =========================
# DELETE ATTENDANCE
# =========================

@router.delete("/attendance/{attendance_id}")
def delete_attendance(
    attendance_id: str
):

    response = (
        supabase
        .table("student_attendance")
        .delete()
        .eq("id", attendance_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Attendance record not found"
        )

    return {
        "message": "Attendance deleted successfully"
    }


# ============================================================
# GET STUDENTS FOR SELECTED CLASS
# ============================================================

@router.get("/classes/students")
def get_class_students(
    class_name: str,
    division: str
):

    # Get students belonging to selected class/division
    students_response = (
        supabase
        .table("students")
        .select("id, name, roll_no, email")
        .eq("class_name", class_name)
        .eq("division", division)
        .execute()
    )

    students = students_response.data or []


    # Find lectures conducted for this class/division
    lectures_response = (
        supabase
        .table("lectures")
        .select("id")
        .eq("class_name", class_name)
        .eq("division", division)
        .execute()
    )

    lecture_ids = [
        lecture["id"]
        for lecture in lectures_response.data
    ]


    attendance = []

    if lecture_ids:

        attendance_response = (
            supabase
            .table("student_attendance")
            .select("student_id, status")
            .in_("lecture_id", lecture_ids)
            .execute()
        )

        attendance = attendance_response.data or []


    result = []

    for student in students:

        student_records = [
            record
            for record in attendance
            if record["student_id"] == student["id"]
        ]

        present = sum(
            1
            for record in student_records
            if record["status"] == "present"
        )

        late = sum(
            1
            for record in student_records
            if record["status"] == "late"
        )

        absent = sum(
            1
            for record in student_records
            if record["status"] == "absent"
        )

        total = len(student_records)

        percentage = (
            round(
                ((present + late) / total) * 100,
                1
            )
            if total > 0
            else 0
        )

        result.append({
            "id": student["id"],
            "name": student["name"],
            "roll_no": student["roll_no"],
            "email": student.get("email"),
            "present": present,
            "late": late,
            "absent": absent,
            "attendance_percentage": percentage,
        })

    return result