from app.db.todo_database import TodoDatabase
from app.models.todo_model import TodoModel
from app.services.base_services import BaseServices


class TodoServices(BaseServices[TodoModel]):
    db: TodoDatabase = None

    def __init__(self, db: TodoDatabase, model: type = TodoModel):
        super().__init__(db, model)

    def get_all(
        self,
        user_id: str | None = None,
        category_id: int | None = None,
        completed: bool | None = None,
        overdue: bool | None = None,
    ):
        return self.db.get_all(user_id, category_id, completed, overdue)

    def get_todo_by_category(self, category_id: int, user_id: str | None = None) -> list[TodoModel]:
        return self.get_all(user_id, category_id)

    def delete_by_category_id(self, category_id: int, user_id: str | None = None):
        return self.db.delete_by_category(category_id, user_id)
