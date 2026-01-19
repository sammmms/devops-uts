from abc import ABC, abstractmethod
from typing import List
from app.models.pydantic.todo_model import TodoModel

class ITodoRepository(ABC):
    @abstractmethod
    def get_all(
        self,
        user_id: str | None = None,
        category_id: int | None = None,
        completed: bool | None = None,
        overdue: bool | None = None,
        priority: str | None = None,
        search: str | None = None,
    ) -> List[TodoModel]:
        pass

    @abstractmethod
    def get(self, todo_id: int) -> TodoModel | None:
        pass

    @abstractmethod
    def insert(self, todo: TodoModel) -> TodoModel:
        pass

    @abstractmethod
    def update(self, todo_id: int, todo: TodoModel) -> TodoModel | None:
        pass

    @abstractmethod
    def delete(self, todo_id: int) -> bool:
        pass
    
    @abstractmethod
    def delete_by_category(self, category_id: int, user_id: str | None = None) -> bool:
        pass
