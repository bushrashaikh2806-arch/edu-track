from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import supabase

router = APIRouter()


class AccountCreate(BaseModel):
    email: str
    password: str
    name: str
    role: str

    # Student fields
    roll_no: str | None = None
    class_name: str | None = None
    division: str | None = None

    # Teacher fields
    employee_id: str | None = None
    phone: str | None = None


@router.post("/accounts/create")
def create_account(account: AccountCreate):

    if account.role not in ["student", "teacher"]:
        raise HTTPException(
            status_code=400,
            detail="Role must be student or teacher"
        )

    if len(account.password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters"
        )

    try:
        # 1. Create Supabase Auth user
        auth_response = supabase.auth.admin.create_user({
            "email": account.email,
            "password": account.password,
            "email_confirm": True,
            "user_metadata": {
                "name": account.name,
                "role": account.role
            }
        })

        auth_user = auth_response.user

        if not auth_user:
            raise HTTPException(
                status_code=400,
                detail="Failed to create authentication user"
            )

        # 2. Create corresponding database record
        if account.role == "student":

            response = (
                supabase
                .table("students")
                .insert({
                    "name": account.name,
                    "roll_no": account.roll_no,
                    "class_name": account.class_name,
                    "division": account.division,
                    "email": account.email
                })
                .execute()
            )

        else:

            response = (
                supabase
                .table("staff")
                .insert({
                    "name": account.name,
                    "employee_id": account.employee_id,
                    "email": account.email,
                    "phone": account.phone,
                    "role": "teacher"
                })
                .execute()
            )

        return {
            "message": f"{account.role.capitalize()} account created successfully",
            "auth_user_id": auth_user.id,
            "profile": response.data
        }

    except Exception as error:

        print("Account creation error:", error)

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )