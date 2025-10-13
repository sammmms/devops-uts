from pydantic import BaseModel
from datetime import date


class TodoModel(BaseModel):
    id: int | None = None
    name: str
    deadline: date | None = None
    description: str | None = None
