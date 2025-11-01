from pydantic import BaseModel
from app.db.database import Database
import json
import os


class BaseDatabase(Database):
    _data: dict = {}
    _key_counter: int = 0
    _db_path: str | None = None

    def __init__(self):
        self._data = {}
        self._initialize_database()

    def get(self, key) -> dict | None:
        return self._data.get(key)

    def append(self, value: BaseModel) -> dict:
        self._key_counter += 1
        import json

        self._data[self._key_counter] = json.loads(value.model_dump_json())
        self._data[self._key_counter]["id"] = self._key_counter

        self._update_database()
        return self._data[self._key_counter]

    def insert(self, key: int, value: BaseModel) -> dict:
        if key in self._data:
            raise KeyError("Key already exists.")
        self._data[key] = json.loads(value.model_dump_json())
        self._data[key]["id"] = key
        if key > self._key_counter:
            self._key_counter = key

        self._update_database()
        return self._data[key]

    def update(self, key: int, value: BaseModel) -> dict:
        if key not in self._data:
            raise KeyError("Key does not exist.")
        self._data[key] = json.loads(value.model_dump_json())

        self._update_database()
        return self._data[key]

    def delete(self, key: int) -> bool:
        if key in self._data:
            del self._data[key]
            self._update_database()
            return True

        return False

    def all(self, whereQuery: dict | None = None) -> dict:
        datas = {**self._data}
        if whereQuery is not None:
            return {
                key: value
                for key, value in datas.items()
                if all(value.get(k) == v for k, v in whereQuery.items())
            }

        return datas

    def _update_database(self) -> None:
        print(self._db_path)
        if self._db_path is None:
            return

        dirpath = os.path.dirname(self._db_path)
        if dirpath:
            os.makedirs(dirpath, exist_ok=True)

        with open(self._db_path, "w", encoding="utf-8") as db_file:
            json.dump(self._data, db_file)

    def _initialize_database(self) -> dict | None:
        if self._db_path is None:
            self._data = {}
            self._key_counter = 0
            return self._data

        if not os.path.exists(self._db_path):
            dirpath = os.path.dirname(self._db_path)
            if dirpath:
                os.makedirs(dirpath, exist_ok=True)
            with open(self._db_path, "w", encoding="utf-8") as db_file:
                json.dump({}, db_file)
            self._data = {}
            self._key_counter = 0
            return self._data

        try:
            with open(self._db_path, "r", encoding="utf-8") as db_file:
                raw = json.load(db_file)
        except (json.JSONDecodeError, FileNotFoundError):
            raw = {}

        if isinstance(raw, dict):
            data = {int(k): v for k, v in raw.items()}
        else:
            data = {}

        self._data = data
        self._key_counter = max(data.keys()) if data else 0
        return self._data
