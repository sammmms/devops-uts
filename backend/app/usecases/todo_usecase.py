from app.models.pydantic.todo_model import TodoModel
from app.interfaces.repositories.todo_repository import ITodoRepository

class TodoUseCase:
    repository: ITodoRepository

    def __init__(self, repository: ITodoRepository):
        self.repository = repository

    def create(self, item: TodoModel) -> TodoModel:
        return self.repository.insert(item)

    def get_all(
        self,
        user_id: str | None = None,
        category_id: int | None = None,
        completed: bool | None = None,
        overdue: bool | None = None,
        priority: str | None = None,
        search: str | None = None,
    ) -> list[TodoModel]:
        return self.repository.get_all(user_id, category_id, completed, overdue, priority, search)

    def get_by_id(self, todo_id: int) -> TodoModel | None:
        return self.repository.get(todo_id)

    def update(self, todo_id: int, updated_item: TodoModel) -> TodoModel | None:
        return self.repository.update(todo_id, updated_item)

    def delete(self, todo_id: int) -> bool:
        return self.repository.delete(todo_id)

    def get_todo_by_category(self, category_id: int, user_id: str | None = None) -> list[TodoModel]:
        return self.get_all(user_id=user_id, category_id=category_id)

    def delete_by_category_id(self, category_id: int, user_id: str | None = None):
        return self.repository.delete_by_category(category_id, user_id)
