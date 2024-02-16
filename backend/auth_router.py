import hashlib
from users_model import User, Freelancer, ProjectManager, Customer
from pydantic import BaseModel
from sqlalchemy.exc import IntegrityError
from database import Session
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/auth", tags=["auth"])

session = Session()


class UserInModel(BaseModel):
    name: str
    email: str
    password: str
    account_type: str


class UserOutModel(BaseModel):
    user_id: int
    name: str
    email: str
    account_type: str

    class Config:
        orm_mode = True


class UserLoginData(BaseModel):
    email: str
    password: str


def validate_password(p: str):
    if len(p) >= 8:
        return True
    if not p.islower():
        return True
    else:
        return False


@router.get("/get_account_type/{user_id}")
async def get_account_type(user_id: int):
    query = session.query(User).filter(User.user_id == user_id)
    for u in query:
        return u.account_type


@router.post("/register")
async def register(u: UserInModel):
    if not validate_password(u.password):
        raise HTTPException(status_code=403, detail="Password not validated")
    password = hashlib.sha256(u.password.encode('utf-8')).hexdigest()
    try:
        new_user = User(name=u.name, email=u.email, password=password, a_type=u.account_type)
        session.add(new_user)
        account_type = u.account_type
        if account_type == 'freelancer':
            freelancer = Freelancer(user_id=new_user.user_id)
            new_user.freelancer_data.append(freelancer)
        elif account_type == 'customer':
            customer = Customer(user_id=new_user.user_id)
            new_user.customer_data.append(customer)
        elif account_type == 'manager':
            manager = ProjectManager(user_id=new_user.user_id)
            new_user.pm_data.append(manager)

        session.commit()
    except IntegrityError:
        session.rollback()
        raise HTTPException(status_code=403, detail="User already exists")
    session.close()
    return {"message": "user created"}


@router.post("/login")
async def login(data: UserLoginData):
    hashed_password = hashlib.sha256(data.password.encode('utf-8')).hexdigest()
    query = session.query(User).filter(User.email == data.email)

    for u in query:
        a = UserOutModel(user_id=u.user_id, name=u.name, email=u.email, account_type=u.account_type)

        if u.password == hashed_password:
            return a
        else:
            raise HTTPException(status_code=403, detail="Incorrect email or password")

