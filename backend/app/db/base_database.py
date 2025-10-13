from pydantic import BaseModel
from app.db.database import Database


class BaseDatabase(Database):
    _data: dict = {}
    _key_counter: int = 0

    def __init__(self):
        self._data = {}

    def get(self, key) -> dict | None:
        return self._data.get(key)

    def append(self, value: BaseModel) -> dict:
        self._key_counter += 1
        self._data[self._key_counter] = {**value.model_dump(), "id": self._key_counter}
        return self._data[self._key_counter]

    def insert(self, key: int, value: BaseModel) -> dict:
        if key in self._data:
            raise KeyError("Key already exists.")
        self._data[key] = {**value.model_dump(), "id": key}
        if key > self._key_counter:
            self._key_counter = key
        return self._data[key]

    def update(self, key: int, value: BaseModel) -> dict:
        if key not in self._data:
            raise KeyError("Key does not exist.")
        self._data[key] = {**value.model_dump(), "id": key}
        return self._data[key]

    def delete(self, key: int) -> bool:
        if key in self._data:
            del self._data[key]
            return True
        return False

    def all(self) -> dict:
        return self._data
