from users_model import Freelancer
from pydantic import BaseModel
from database import Session
from fastapi import APIRouter

router = APIRouter(prefix="/profile", tags=["freelancer profile"])

session = Session()


class ProfileData(BaseModel):
    rate: str
    skills: str
    description: str


@router.put("/edit/{user_id}")
async def edit_profile(user_id: int, data: ProfileData):
    query = session.query(Freelancer).filter(Freelancer.freelancer_id == user_id)
    for u in query:
        u.rate = data.rate
        u.skills = data.skills
        u.description = data.description
        session.add(u)
        session.commit()
    return {"message": "data changed"}


@router.get("/{user_id}")
async def get_profile(user_id: int):
    query = session.query(Freelancer).filter(Freelancer.freelancer_id == user_id)
    for u in query:
        return u

