from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from app.datasources.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True) # UUID string or similar
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=True)

    todos = relationship("Todo", back_populates="user")
