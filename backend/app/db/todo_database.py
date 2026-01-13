from app.db.base_database import BaseDatabase
from app.models.todo_model import TodoModel


class TodoDatabase(BaseDatabase):
    _instance = None
    _db_path: str = "app/db/local/todos.json"

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def get_all(
        self,
        user_id: str | None = None,
        category_id: int | None = None,
        completed: bool | None = None,
        overdue: bool | None = None,
    ) -> list[TodoModel]:
        data_dict = self.all()
        todos = [TodoModel(**item) for item in data_dict.values()]
        
        # Filter by user
        if user_id is not None:
            todos = [t for t in todos if t.user_id == user_id]
        
        # Filter by category
        if category_id is not None:
            if category_id == -1:
                todos = [t for t in todos if t.category_id is None]
            else:
                todos = [t for t in todos if t.category_id == category_id]

        # Filter by completed status
        if completed is not None:
            todos = [t for t in todos if t.completed == completed]

        # Filter by overdue
        if overdue is not None:
            from datetime import date
            today = date.today().isoformat()
            if overdue:
                todos = [t for t in todos if t.deadline and t.deadline < today and not t.completed]
            else:
                # Not overdue (either future deadline, no deadline, or completed)
                todos = [t for t in todos if not (t.deadline and t.deadline < today and not t.completed)]

        return todos

    def delete_by_category(self, category_id: int, user_id: str | None = None):
        data_dict = self.all()
        # Find all keys (todo_ids) that belong to this category
        ids_to_delete = [
            t_id
            for t_id, t_data in data_dict.items()
            if t_data.get("category_id") == category_id
            and (user_id is None or t_data.get("user_id") == user_id)
        ]
        
        for t_id in ids_to_delete:
            self.delete(t_id)
