from sqlalchemy import desc

from database import Session
from fastapi import APIRouter
from pydantic import BaseModel
from orders_model import Vacancy, VacancyResponse

router = APIRouter(prefix="/vacancies", tags=["vacancies"])

session = Session()


class VacancyData(BaseModel):
    order_id: int
    title: str
    description: str
    price: int
    time: int


class ResponseData(BaseModel):
    order_id: int
    freelancer_id: int
    description: str


@router.post('/{manager_id}/post')
async def post_vacancy(manager_id: int, data: VacancyData):
    new_vacancy = Vacancy(manager_id)
    new_vacancy.order_id = data.order_id
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


@router.get('/{vacancy_id}')
async def get_vacancies(vacancy_id: int):
    query = session.query(Vacancy).filter(Vacancy.vacancy_id == vacancy_id)[0]

    return query


@router.get('/{manager_id}/list')
async def get_vacancies(manager_id: int):
    query = session.query(Vacancy).filter(Vacancy.manager_id == manager_id).order_by(
        desc(Vacancy.vacancy_id))

    orders = []

    for o in query:
        orders.append(o)

    return orders


@router.delete('/{vacancy_id}/delete')
async def delete_vacancy(vacancy_id: int):
    query = session.query(Vacancy).filter(Vacancy.vacancy_id == vacancy_id)[0]
    session.delete(query)

    return {'message': 'vacancy deleted'}


@router.delete('/responses/{response_id}/delete')
async def delete_response(response_id: int):
    query = session.query(VacancyResponse).filter(
        VacancyResponse.response_id == response_id)[0]
    session.delete(query)

    return {'message': 'response deleted'}


@router.post('/{vacancy_id}/post/response')
async def post_response(vacancy_id: int, data: ResponseData):
    new_response = VacancyResponse(vacancy_id, data.freelancer_id)
    new_response.order_id = data.order_id
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
