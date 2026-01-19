from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.datasources.session import Base

class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    deadline = Column(Date, nullable=True)
    completed = Column(Boolean, default=False)
    priority = Column(String, default="medium", nullable=False)  # low, medium, high, urgent
    
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)

    category = relationship("Category", back_populates="todos")
    user = relationship("User", back_populates="todos")
