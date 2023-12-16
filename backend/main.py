import hashlib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import create_db, Session
from users import User, Freelancer, ProjectManager, Customer
from pydantic import BaseModel
from sqlalchemy.exc import IntegrityError


session = Session()

create_db()

app = FastAPI()

origins = [
    'http://localhost:3000'
]

app.add_middleware(CORSMiddleware,
                   allow_origins=origins,
                   allow_credentials=True,
                   allow_methods=['*'],
                   allow_headers=['*'])


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


class ProfileData(BaseModel):
    rate: str
    skills: str
    description: str

def validate_password(p: str):
    if len(p) >= 8:
        return True
    if not p.islower():
        return True
    else:
        return False


@app.put("/profile/edit/{user_id}")
async def edit_profile(user_id: int, data: ProfileData):
    query = session.query(Freelancer).filter(Freelancer.freelancer_id == user_id)
    for u in query:
        u.rate = data.rate
        u.skills = data.skills
        u.description = data.description
        session.add(u)
        session.commit()
    return {"message": "data changed"}


@app.get("/profile/{user_id}")
async def get_profile(user_id: int):
    query = session.query(Freelancer).filter(Freelancer.freelancer_id == user_id)
    for u in query:
        return u


@app.post("/auth/register")
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
        raise HTTPException(status_code=403, detail="User already exists")
    session.close()
    return {"message": "user created"}


@app.post("/auth/login")
async def login(data: UserLoginData):
    hashed_password = hashlib.sha256(data.password.encode('utf-8')).hexdigest()
    query = session.query(User).filter(User.email == data.email)

    for u in query:
        a = UserOutModel(user_id=u.user_id, name=u.name, email=u.email, account_type=u.account_type)

        if u.password == hashed_password:
            return a
        else:
            raise HTTPException(status_code=403, detail="Incorrect email or password")
