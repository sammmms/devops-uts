from pydantic import BaseModel, field_validator
from datetime import date
from typing import Literal
from app.models.pydantic.category_model import CategoryModel

# Priority levels
PriorityType = Literal["low", "medium", "high", "urgent"]

class TodoModel(BaseModel):
    id: int | None = None
    name: str
    deadline: date | None = None
    description: str | None = None
    completed: bool = False
    priority: PriorityType = "medium"
    category_id: int | None = None
    user_id: str | None = None # UUID string

class TodoResponseModel(TodoModel):
    category: CategoryModel | None = None

class TodoCreateModel(BaseModel):
    name: str
    deadline: date | None = None
    description: str | None = None
    completed: bool = False
    priority: PriorityType = "medium"
    category_id: int | None = None
