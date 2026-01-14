from typing import List
from app.interfaces.repositories.todo_repository import ITodoRepository
from app.models.pydantic.todo_model import TodoModel
from app.datasources.local_datasource import LocalDataSource
import datetime

class TodoRepository(ITodoRepository):
    def __init__(self):
        self.data_source = LocalDataSource()

    def get_all(
        self,
        user_id: str | None = None,
        category_id: int | None = None,
        completed: bool | None = None,
        overdue: bool | None = None,
    ) -> List[TodoModel]:
        todos = self.data_source.todos.values()
        
        if user_id:
            todos = [t for t in todos if t.user_id == user_id]
        if category_id is not None:
            todos = [t for t in todos if t.category_id == category_id]
        if completed is not None:
            todos = [t for t in todos if t.completed == completed]
        if overdue:
            today = datetime.date.today()
            todos = [t for t in todos if t.deadline and t.deadline < today and not t.completed]
            
        return list(todos)

    def get(self, todo_id: int) -> TodoModel | None:
        return self.data_source.todos.get(todo_id)

    def insert(self, todo: TodoModel) -> TodoModel:
        if not self.data_source.todos:
            new_id = 1
        else:
            new_id = max(self.data_source.todos.keys()) + 1
            
        new_todo = todo.model_copy(update={"id": new_id})
        self.data_source.todos[new_id] = new_todo
        return new_todo

    def update(self, todo_id: int, todo: TodoModel) -> TodoModel | None:
        if todo_id not in self.data_source.todos:
            return None
        
        updated_todo = todo.model_copy(update={"id": todo_id})
        self.data_source.todos[todo_id] = updated_todo
        return updated_todo

    def delete(self, todo_id: int) -> bool:
        if todo_id in self.data_source.todos:
            del self.data_source.todos[todo_id]
            return True
        return False

    def delete_by_category(self, category_id: int, user_id: str | None = None) -> bool:
        todos_to_delete = []
        for t in self.data_source.todos.values():
            match = t.category_id == category_id
            if user_id:
                match = match and t.user_id == user_id
            if match:
                todos_to_delete.append(t.id)
        
        for tid in todos_to_delete:
            del self.data_source.todos[tid]
            
        return True
