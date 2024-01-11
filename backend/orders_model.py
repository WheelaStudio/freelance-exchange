from database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Date, Text


class Order(Base):
    __tablename__ = 'order'

    order_id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey('customer.customer_id'))
    team_id = Column(Integer, ForeignKey('team.team_id'), nullable=True)

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
    manager_id = Column(Integer, ForeignKey('manager.manager_id'))

    def __init__(self, manager_id: int):
        self.manager_id = manager_id


class TeamFreelancer(Base):
    __tablename__ = 'freelancer_in_team'

    team_freelancer_id = Column(Integer, primary_key=True)
    team_id = Column(Integer, ForeignKey('team.team_id'))
    freelancer_id = Column(Integer, ForeignKey('freelancer.freelancer_id'))

    def __int__(self, t_id:int, f_id:int):
        self.team_id = t_id
        self.freelancer_id = f_id


class Task(Base):
    __tablename__ = 'task'

    team_id = Column(Integer, ForeignKey('team.team_id'))
    freelancer_id = Column(Integer, ForeignKey('freelancer.freelancer_id'))
    task_id = Column(Integer, primary_key=True)

    title = Column(String)
    start_data = Column(Date)
    end_date = Column(Date)
    progress = Column(Integer)



