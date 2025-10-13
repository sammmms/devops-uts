from app.db.todo_database import TodoDatabase
from app.models.todo_model import TodoModel


class TodoServices:
    def __init__(self, db: TodoDatabase):
        self.db = db

    def create_todo(self, todo: TodoModel) -> TodoModel:
        todo_dict = self.db.append(todo)
        return TodoModel(**todo_dict)

    def get_all_todos(self) -> list[TodoModel]:
        return [TodoModel(**item) for item in self.db.all().values()]

    def get_todo_by_id(self, todo_id: int) -> TodoModel:
        return TodoModel(**self.db.get(todo_id)) if self.db.get(todo_id) else None

    def update_todo(self, todo_id: int, updated_todo: TodoModel) -> TodoModel:
        todo_dict = self.db.update(todo_id, updated_todo)
        if not todo_dict:
            return None
        updated_todo = TodoModel(**todo_dict)
        return updated_todo

    def delete_todo(self, todo_id: int) -> bool:
        return self.db.delete(todo_id)
