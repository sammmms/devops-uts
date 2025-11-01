from app.db.todo_database import TodoDatabase
from app.models.todo_model import TodoModel
from app.services.base_services import BaseServices


class TodoServices(BaseServices[TodoModel]):
    db: TodoDatabase = None

    def __init__(self, db: TodoDatabase, model: type = TodoModel):
        super().__init__(db, model)

    def get_todo_by_category(self, category_id: int) -> list[TodoModel]:
        return self.get_all(whereQuery={"category_id": category_id})
