from abc import ABC, abstractmethod
from typing import List
from app.models.pydantic.category_model import CategoryModel

class ICategoryRepository(ABC):
    @abstractmethod
    def get_all(self, user_id: str | None = None) -> List[CategoryModel]:
        pass

    @abstractmethod
    def get(self, category_id: int) -> CategoryModel | None:
        pass

    @abstractmethod
    def insert(self, category: CategoryModel) -> CategoryModel:
        pass

    @abstractmethod
    def update(self, category_id: int, category: CategoryModel) -> CategoryModel | None:
        pass

    @abstractmethod
    def delete(self, category_id: int) -> bool:
        pass
