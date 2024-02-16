from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_db
import auth_router
import profile_router
import order_router
import task_tracker_router
import vacancies_router

create_db()

app = FastAPI()

origins = [
    '*'
]

app.add_middleware(CORSMiddleware,
                   allow_origins=origins,
                   allow_credentials=True,
                   allow_methods=['*'],
                   allow_headers=['*'])

app.include_router(auth_router.router)
app.include_router(profile_router.router)
app.include_router(order_router.router)
app.include_router(task_tracker_router.router)
app.include_router(vacancies_router.router)
