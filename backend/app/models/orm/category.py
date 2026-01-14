from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.datasources.session import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    user_id = Column(String, index=True)

    todos = relationship("Todo", back_populates="category", cascade="all, delete-orphan")
