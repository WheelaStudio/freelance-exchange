from database import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = 'user'
    user_id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)
    account_type = Column(String)

    def __init__(self, name: str, email: str, password: str, a_type: str):
        self.name = name
        self.email = email
        self.password = password
        self.account_type = a_type


class Customer(Base):
    __tablename__ = 'customer'
    customer_id = Column(Integer, ForeignKey('user.user_id'), primary_key=True)
    user = relationship("User", backref="customer_data")

    def __init__(self, user_id: int):
        self.customer_id = user_id


class ProjectManager(Base):
    __tablename__ = 'manager'
    manager_id = Column(Integer, ForeignKey('user.user_id'), primary_key=True)
    user = relationship("User", backref="pm_data")

    def __init__(self, user_id: int):
        self.manager_id = user_id


class Freelancer(Base):
    __tablename__ = 'freelancer'
    freelancer_id = Column(Integer, ForeignKey('user.user_id'), primary_key=True)
    user = relationship("User", backref="freelancer_data")
    rate = Column(Integer, nullable=True)
    skills = Column(String, nullable=True)
    description = Column(String, nullable=True)

    def __init__(self, user_id: int):
        self.freelancer_id = user_id


