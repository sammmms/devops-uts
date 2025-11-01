from app.db.category_database import CategoryDatabase
from app.models.category_model import CategoryModel
from app.services.base_services import BaseServices


class CategoryServices(BaseServices[CategoryModel]):
    db: CategoryDatabase = None

    def __init__(self, db: CategoryDatabase, model: type = CategoryModel):
        super().__init__(db, model)
