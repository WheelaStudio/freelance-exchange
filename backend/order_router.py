from fastapi import APIRouter
from database import Session
from pydantic import BaseModel
from orders_model import Order, OrderResponse, TeamFreelancer, TaskTracker
from sqlalchemy import desc


router = APIRouter(prefix="/order", tags=["orders"])
session = Session()


class OrderData(BaseModel):
    customer_id: int
    title: str
    description: str
    price: int
    time: int
    status: str


class ResponseData(BaseModel):
    manager_id: int
    description: str


@router.post('/create')
async def create_order(data: OrderData):
    new_order = Order(customer_id=data.customer_id,
                      title=data.title,
                      description=data.description,
                      price=data.price,
                      time=data.time,
                      status=data.status)

    session.add(new_order)
    session.commit()
    return {"message": f"order with id {new_order.order_id} created"}



@router.get('/orders/')
async def get_orders(page: int, page_size: int, user_id: int = None):

    if user_id is not None:
        query = session.query(Order).filter(Order.customer_id == user_id)

    else:
        query = session.query(Order).filter(Order.status == 'not_started').order_by(desc(Order.order_id)).offset(
            (page - 1) * page_size).limit(page_size)

    orders = []

    for o in query:
        orders.append(o)

    return orders


@router.get('/orders/freelancer/{freelancer_id}')
async def get_freelancer_orders(freelancer_id: int):
    start_orders = session.query(Order).filter(Order.status == 'working')
    result = []
    for order in start_orders:
        freelancers = session.query(TeamFreelancer).filter(TeamFreelancer.team_id == order.tracker_id)
        for freelancer in freelancers:
            if freelancer.freelancer_id == freelancer_id:
                result.append(order)

    return result


@router.get('/orders/manager/{manager_id}')
async def get_customer_orders(manager_id: int):
    trackers = session.query(TaskTracker).filter(TaskTracker.manager_id == manager_id)
    result = []
    for tracker in trackers:
        order = session.query(Order).filter(Order.order_id == tracker.order_id)[0]
        result.append(order)

    return result


@router.get('/{order_id}')
async def get_order_by_id(order_id: int):
    query = session.query(Order).filter(Order.order_id == order_id)
    return query[0]


@router.post('/{order_id}/response')
async def response_order(order_id: int, data: ResponseData):
    new_response = OrderResponse(data.manager_id, order_id, data.description)

    session.add(new_response)
    session.commit()
    return {"message": "response sent"}


@router.get('/{order_id}/responses')
async def response_order(order_id: int):

    query = session.query(OrderResponse).filter(OrderResponse.order_id == order_id).order_by(desc(OrderResponse.response_id))

    responses = []

    for o in query:
        responses.append(o)

    return responses


@router.put('/{order_id}/change')
async def change_order(order_id: int):

    query = session.query(Order).filter(Order.order_id == order_id)
    o = query[0]
    o.status = 'working'
    session.add(o)
    session.commit()

    return {'order changed'}




