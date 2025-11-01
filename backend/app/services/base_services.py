from typing import TypeVar, Generic, Type
from pydantic import BaseModel
from app.db.base_database import BaseDatabase

T = TypeVar("T", bound=BaseModel)


class BaseServices(Generic[T]):
    db: BaseDatabase
    model: Type[T]

    def __init__(self, db: BaseDatabase, model: Type[T]):
        self.db = db
        self.model = model

    def create(self, item: T) -> T:
        item_dict = self.db.append(item)
        return self.model(**item_dict)

    def get_all(self, whereQuery: dict | None = None) -> list[T]:
        return [
            self.model(**data) for data in self.db.all(whereQuery=whereQuery).values()
        ]

    def get_by_id(self, item_id: int) -> T | None:
        data = self.db.get(item_id)
        return self.model(**data) if data else None  # 👈

    def update(self, item_id: int, updated_item: T) -> T | None:
        item_dict = self.db.update(item_id, updated_item)
        return self.model(**item_dict) if item_dict else None

    def delete(self, item_id: int) -> bool:
        return self.db.delete(item_id)
