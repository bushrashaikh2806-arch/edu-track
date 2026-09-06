from fastapi import APIRouter
from database import supabase

router = APIRouter()


@router.get("/reports/overview")
def get_reports_overview():

    # Get all attendance records
    attendance_response = (
        supabase
        .table("student_attendance")
        .select("*")
        .execute()
    )

    attendance = attendance_response.data

    # Get all students
    students_response = (
        supabase
        .table("students")
        .select("*")
        .execute()
    )

    students = students_response.data

    # Get all lectures
    lectures_response = (
        supabase
        .table("lectures")
        .select("*")
        .execute()
    )

    lectures = lectures_response.data

    # -----------------------------
    # Overall Attendance
    # -----------------------------

    total_attendance = len(attendance)

    present = sum(
        1
        for record in attendance
        if record["status"] == "present"
    )

    absent = sum(
        1
        for record in attendance
        if record["status"] == "absent"
    )

    late = sum(
        1
        for record in attendance
        if record["status"] == "late"
    )

    attended = present + late

    overall_percentage = (
        round((attended / total_attendance) * 100, 1)
        if total_attendance > 0
        else 0
    )

    # -----------------------------
    # Student-wise Report
    # -----------------------------

    student_reports = []

    for student in students:

        student_id = student["id"]

        records = [
            record
            for record in attendance
            if record["student_id"] == student_id
        ]

        student_present = sum(
            1
            for record in records
            if record["status"] == "present"
        )

        student_absent = sum(
            1
            for record in records
            if record["status"] == "absent"
        )

        student_late = sum(
            1
            for record in records
            if record["status"] == "late"
        )

        total = len(records)

        percentage = (
            round(
                ((student_present + student_late) / total) * 100,
                1,
            )
            if total > 0
            else 0
        )

        student_reports.append({
            "id": student["id"],
            "name": student["name"],
            "roll_no": student["roll_no"],
            "class_name": student.get("class_name"),
            "division": student.get("division"),
            "email": student.get("email"),
            "present": student_present,
            "absent": student_absent,
            "late": student_late,
            "total_lectures": total,
            "attendance_percentage": percentage,
            "below_75": percentage < 75,
        })

    # -----------------------------
    # Below 75% Students
    # -----------------------------

    below_75 = [
        student
        for student in student_reports
        if student["below_75"]
    ]

    # -----------------------------
    # Subject-wise Report
    # -----------------------------

    subject_names = sorted({
        lecture["subject_name"]
        for lecture in lectures
    })

    subject_reports = []

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

        subject_present = sum(
            1
            for record in subject_attendance
            if record["status"] == "present"
        )

        subject_absent = sum(
            1
            for record in subject_attendance
            if record["status"] == "absent"
        )

        subject_late = sum(
            1
            for record in subject_attendance
            if record["status"] == "late"
        )

        subject_total = len(subject_attendance)

        subject_percentage = (
            round(
                ((subject_present + subject_late) / subject_total) * 100,
                1,
            )
            if subject_total > 0
            else 0
        )

        subject_reports.append({
            "subject": subject,
            "lectures": len(subject_lectures),
            "present": subject_present,
            "absent": subject_absent,
            "late": subject_late,
            "attendance_percentage": subject_percentage,
        })

    return {
        "overview": {
            "total_students": len(students),
            "total_lectures": len(lectures),
            "total_attendance_records": total_attendance,
            "present": present,
            "absent": absent,
            "late": late,
            "attendance_percentage": overall_percentage,
        },
        "student_reports": student_reports,
        "below_75": below_75,
        "subject_reports": subject_reports,
    }