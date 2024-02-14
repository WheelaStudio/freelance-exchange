from pydantic import BaseModel
from datetime import date
from database import Session
from orders_model import TaskTracker, Team, TeamFreelancer, Task, Order
from users_model import User
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from sqlalchemy import desc

router = APIRouter(prefix="/tracker", tags=["task tracker"])

session = Session()


class TaskDataModel(BaseModel):
    title: str
    start_date: str
    end_date: str
    freelancer_id: int
    progress: int


@router.post('/create')
async def create_task_tracker(order_id: int, manager_id: int):
    team = Team(manager_id=manager_id)
    session.add(team)
    session.commit()

    task_tracker = TaskTracker(team=team.team_id, order=order_id, manager=manager_id)
    session.add(task_tracker)
    session.commit()

    order = session.query(Order).filter(Order.order_id == order_id)[0]
    order.tracker_id = task_tracker.task_tracker_id
    session.add(order)
    session.commit()

    team.task_tracker_id = task_tracker.task_tracker_id
    session.add(team)
    session.commit()

    return {"message": "task tracker created"}


@router.post('/team/{tracker_id}/add_freelancer/{freelancer_id}/')
async def add_freelancer(tracker_id: int, freelancer_id: int):

    query = session.query(TeamFreelancer).filter(
        TeamFreelancer.team_id == tracker_id and TeamFreelancer.freelancer_id == freelancer_id
    )

    if query.count() == 0:
        new_freelancer = TeamFreelancer(t_id=tracker_id, f_id=freelancer_id)

        freelancer = session.query(User).filter(
            User.user_id == freelancer_id
        )[0]

        new_freelancer.name = freelancer.name
        new_freelancer.email = freelancer.email
        session.add(new_freelancer)
        session.commit()

        freelancer = session.query(User).filter(
            User.user_id == freelancer_id
        )[0]

        return {freelancer}
    else:
        return JSONResponse(content={"message": "user already exists"}, status_code=400)


@router.get('/{tracker_id}/tasks')
async def get_tasks(tracker_id: int):
    query = session.query(Task).filter(Task.tracker_id == tracker_id)
    tasks = []

    for t in query:
        tasks.append(t)

    return tasks


@router.get('/{tracker_id}/team')
async def get_team(tracker_id: int):
    query = session.query(TeamFreelancer).filter(
        TeamFreelancer.team_id == tracker_id
    )
    team = []

    for t in query:

        team.append(t)

    return team


@router.post('/{tracker_id}/create_task')
async def create_task(tracker_id: int):
    new_task = Task(tracker_id)
    session.add(new_task)
    session.commit()
    new_task = session.query(Task).filter(Task.tracker_id == tracker_id).order_by(
        desc(Task.task_id)
    ).first()
    return {new_task}


@router.put('/{tracker_id}/task/{task_id}')
async def edit_task(tracker_id: int, task_id: int, task_data: TaskDataModel):
    task = session.query(Task).filter(Task.task_id == task_id)[0]
    task.title = task_data.title
    task.start_date = date.fromisoformat(task_data.start_date)
    task.end_date = date.fromisoformat(task_data.end_date)
    task.progress = task_data.progress
    task.freelancer_id = task_data.freelancer_id
    session.add(task)
    session.commit()
    return {"message": "task edited"}


@router.delete('/{tracker_id}/task/{task_id}/delete')
async def delete_task(tracker_id: int, task_id: int):
    task = session.query(Task).filter(Task.task_id == task_id)[0]
    session.delete(task)
    session.commit()

    return {"message": "task deleted"}


@router.delete('/{tracker_id}/team/freelancer/{freelancer_id}/delete')
async def delete_task(tracker_id: int, freelancer_id: int):
    task = session.query(TeamFreelancer).filter(
        TeamFreelancer.team_id == tracker_id and TeamFreelancer.freelancer_id == freelancer_id)[0]
    session.delete(task)
    session.commit()

    return {"message": "freelancer deleted"}

