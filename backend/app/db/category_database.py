from app.db.base_database import BaseDatabase


class CategoryDatabase(BaseDatabase):
    _instance = None
    _db_path: str = "app/db/local/categories.json"

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
