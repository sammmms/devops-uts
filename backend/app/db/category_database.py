from app.db.base_database import BaseDatabase
from app.models.category_model import CategoryModel


class CategoryDatabase(BaseDatabase):
    _instance = None
    _db_path: str = "app/db/local/categories.json"

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def get_all(self, user_id: str | None = None) -> list[CategoryModel]:
        """Get all categories, optionally filtered by user_id"""
        data_dict = self.all()
        categories = [CategoryModel(**item) for item in data_dict.values()]
        
        if user_id is not None:
            categories = [c for c in categories if c.user_id == user_id]
        
        return categories
