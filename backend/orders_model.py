from database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Date


class Order(Base):
    __tablename__ = 'order'

    order_id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey('customer.customer_id'))
    tracker_id = Column(Integer, ForeignKey('task_tracker.task_tracker_id'), nullable=True)

    title = Column(String)
    description = Column(String)
    price = Column(Integer)
    time = Column(Integer)
    status = Column(String)

    def __init__(self, customer_id: int, title: str, description: str, price: int, time: int, status: int):
        self.customer_id = customer_id
        self.title = title
        self.description = description
        self.price = price
        self.time = time
        self.status = status


class OrderResponse(Base):
    __tablename__ = 'order_response'

    response_id = Column(Integer, primary_key=True)

    description = Column(String)
    order_id = Column(Integer, ForeignKey('order.order_id'))
    manager_id = Column(Integer, ForeignKey('manager.manager_id'))

    def __init__(self, manager_id: int, order_id: int, description: str):
        self.description = description
        self.manager_id = manager_id
        self.order_id = order_id


class Team(Base):
    __tablename__ = 'team'

    team_id = Column(Integer, primary_key=True)
    task_tracker_id = Column(Integer, ForeignKey('task_tracker.task_tracker_id'))

    def __init__(self, manager_id: int):
        self.manager_id = manager_id


class TeamFreelancer(Base):
    __tablename__ = 'freelancer_in_team'

    team_freelancer_id = Column(Integer, primary_key=True)
    team_id = Column(Integer, ForeignKey('team.team_id'))
    freelancer_id = Column(Integer, ForeignKey('freelancer.freelancer_id'))
    name = Column(String, ForeignKey('user.name'))
    email = Column(String, ForeignKey('user.email'))

    def __init__(self, t_id: int, f_id: int):
        self.team_id = t_id
        self.freelancer_id = f_id


class Task(Base):
    __tablename__ = 'task'

    task_id = Column(Integer, primary_key=True)
    tracker_id = Column(Integer, ForeignKey('task_tracker.task_tracker_id'))
    freelancer_id = Column(Integer, ForeignKey('freelancer.freelancer_id'),
                           nullable=True)


    title = Column(String, nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    progress = Column(Integer, default=0)

    def __init__(self, t_id):
        self.tracker_id = t_id


class TaskTracker(Base):
    __tablename__ = 'task_tracker'

    task_tracker_id = Column(Integer, primary_key=True)
    team_id = Column(Integer, ForeignKey('team.team_id'))
    order_id = Column(Integer, ForeignKey('order.order_id'))
    manager_id = Column(Integer, ForeignKey('manager.manager_id'))

    def __init__(self, team, order, manager):
        self.team_id = team
        self.order_id = order
        self.manager_id = manager


class Vacancy(Base):
    __tablename__ = 'vacancy'

    vacancy_id = Column(Integer, primary_key=True)
    manager_id = Column(Integer, ForeignKey('manager.manager_id'))
    order_id = Column(Integer, ForeignKey('order.order_id'))

    title = Column(String)
    description = Column(String)
    price = Column(Integer)
    time = Column(Integer)

    def __init__(self, manager_id):
        self.manager_id = manager_id


class VacancyResponse(Base):
    __tablename__ = 'vacancies_response'

    response_id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey('order.order_id'))

    description = Column(String)
    vacancy_id = Column(Integer, ForeignKey('vacancy.vacancy_id'))
    freelancer_id = Column(Integer, ForeignKey('freelancer.freelancer_id'))

    def __init__(self, v_id, f_id):
        self.freelancer_id = f_id
        self.vacancy_id = v_id

