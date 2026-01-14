from typing import List
from app.interfaces.repositories.todo_repository import ITodoRepository
from app.models.pydantic.todo_model import TodoModel
from app.models.orm import Todo
from app.datasources.remote_datasource import RemoteDataSource
import datetime

class TodoRepository(ITodoRepository):
    def __init__(self):
        self.data_source = RemoteDataSource()

    def get_all(
        self,
        user_id: str | None = None,
        category_id: int | None = None,
        completed: bool | None = None,
        overdue: bool | None = None,
    ) -> List[TodoModel]:
        db = self.data_source.get_session()
        try:
            query = db.query(Todo)
            if user_id:
                query = query.filter(Todo.user_id == user_id)
            if category_id is not None:
                query = query.filter(Todo.category_id == category_id)
            if completed is not None:
                query = query.filter(Todo.completed == completed)
            if overdue:
                query = query.filter(
                    Todo.deadline < datetime.date.today(),
                    Todo.completed == False
                )

            todos = query.all()
            return [
                TodoModel(
                    id=t.id,
                    name=t.name,
                    deadline=t.deadline,
                    description=t.description,
                    completed=t.completed,
                    category_id=t.category_id,
                    user_id=t.user_id,
                )
                for t in todos
            ]
        finally:
            db.close()

    def get(self, todo_id: int) -> TodoModel | None:
        db = self.data_source.get_session()
        try:
            todo = db.query(Todo).filter(Todo.id == todo_id).first()
            if todo:
                return TodoModel(
                    id=todo.id,
                    name=todo.name,
                    deadline=todo.deadline,
                    description=todo.description,
                    completed=todo.completed,
                    category_id=todo.category_id,
                    user_id=todo.user_id,
                )
            return None
        finally:
            db.close()

    def insert(self, todo: TodoModel) -> TodoModel:
        db = self.data_source.get_session()
        try:
            db_todo = Todo(
                name=todo.name,
                deadline=todo.deadline,
                description=todo.description,
                completed=todo.completed,
                category_id=todo.category_id,
                user_id=todo.user_id,
            )
            db.add(db_todo)
            db.commit()
            db.refresh(db_todo)
            return TodoModel(
                id=db_todo.id,
                name=db_todo.name,
                deadline=db_todo.deadline,
                description=db_todo.description,
                completed=db_todo.completed,
                category_id=db_todo.category_id,
                user_id=db_todo.user_id,
            )
        finally:
            db.close()

    def update(self, todo_id: int, todo: TodoModel) -> TodoModel | None:
        db = self.data_source.get_session()
        try:
            db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
            if not db_todo:
                return None
            
            db_todo.name = todo.name
            db_todo.deadline = todo.deadline
            db_todo.description = todo.description
            db_todo.completed = todo.completed
            db_todo.category_id = todo.category_id
            
            db.commit()
            db.refresh(db_todo)
            return TodoModel(
                id=db_todo.id,
                name=db_todo.name,
                deadline=db_todo.deadline,
                description=db_todo.description,
                completed=db_todo.completed,
                category_id=db_todo.category_id,
                user_id=db_todo.user_id,
            )
        finally:
            db.close()

    def delete(self, todo_id: int) -> bool:
        db = self.data_source.get_session()
        try:
            db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
            if db_todo:
                db.delete(db_todo)
                db.commit()
                return True
            return False
        finally:
            db.close()

    def delete_by_category(self, category_id: int, user_id: str | None = None) -> bool:
        db = self.data_source.get_session()
        try:
            query = db.query(Todo).filter(Todo.category_id == category_id)
            if user_id:
                query = query.filter(Todo.user_id == user_id)
            
            count = query.delete(synchronize_session=False)
            db.commit()
            return True
        finally:
            db.close()
