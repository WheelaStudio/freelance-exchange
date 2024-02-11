from sqlalchemy import desc

from database import Session
from fastapi import APIRouter
from pydantic import BaseModel
from orders_model import Vacancy, VacancyResponse

router = APIRouter(prefix="/vacancies", tags=["vacancies"])

session = Session()


class VacancyData(BaseModel):
    title: str
    description: str
    price: int
    time: int


class ResponseData(BaseModel):
    freelancer_id: int
    description: str


@router.post('/{manager_id}/post')
async def post_vacancy(manager_id: int, data: VacancyData):
    new_vacancy = Vacancy(manager_id)
    new_vacancy.title = data.title
    new_vacancy.description = data.description
    new_vacancy.price = data.price
    new_vacancy.time = data.time
    session.add(new_vacancy)
    session.commit()

    return {"message": "new vacancy created"}


@router.get('/list')
async def get_vacancies(page: int, page_size: int):
    query = session.query(Vacancy).order_by(desc(Vacancy.vacancy_id)).offset(
        (page - 1) * page_size).limit(page_size)

    orders = []

    for o in query:
        orders.append(o)

    return orders


@router.get('/{manager_id}/list')
async def get_vacancies(manager_id: int):
    query = session.query(Vacancy).filter(Vacancy.manager_id == manager_id).order_by(
        desc(Vacancy.vacancy_id))

    orders = []

    for o in query:
        orders.append(o)

    return orders


@router.post('/{vacancy_id}/post/response')
async def post_response(vacancy_id: int, data: ResponseData):
    new_response = VacancyResponse(vacancy_id, data.freelancer_id)
    new_response.description = data.description
    session.add(new_response)
    session.commit()

    return {"message": "response posted"}


@router.get('/{vacancy_id}/responses')
async def get_responses(vacancy_id: int):
    query = session.query(VacancyResponse).filter(VacancyResponse.vacancy_id == vacancy_id).order_by(desc(VacancyResponse.response_id))

    responses = []

    for o in query:
        responses.append(o)

    return responses
