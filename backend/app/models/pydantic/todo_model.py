from pydantic import BaseModel
from datetime import date
from app.models.pydantic.category_model import CategoryModel

class TodoModel(BaseModel):
    id: int | None = None
    name: str
    deadline: date | None = None
    description: str | None = None
    completed: bool = False
    category_id: int | None = None
    user_id: str | None = None # UUID string

class TodoResponseModel(TodoModel):
    category: CategoryModel | None = None

class TodoCreateModel(BaseModel):
    name: str
    deadline: date | None = None
    description: str | None = None
    category_id: int | None = None
