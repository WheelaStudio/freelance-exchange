from database import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship


class Order(Base):
    __tablename__ = 'order'
    order_id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey('customer.customer_id'))
    team_id = Column(Integer, ForeignKey('team.team_id'))
    title = Column(String)
    description = Column(String)
    price = Column(Integer)
    time = Column(Integer)
    status = Column(String)

    def __init__(self, name: str, email: str, password: str, a_type: str):
        self.name = name
        self.email = email
        self.password = password
        self.account_type = a_type


class Team(Base):
    __tablename__ = 'team'
    team_id = Column(Integer, primary_key=True)
    manager_id = Column(Integer, ForeignKey('manager.manager_id'))


class TeamFreelancer(Base):
    team_freelancer_id = Column(Integer, primary_key=True)
    team_id = Column(Integer, ForeignKey('team.team_id'))
    freelancer_id = Column(Integer, ForeignKey('freelancer.freelancer_id'))

