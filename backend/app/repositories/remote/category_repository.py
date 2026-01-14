from typing import List
from app.interfaces.repositories.category_repository import ICategoryRepository
from app.models.pydantic.category_model import CategoryModel
from app.models.orm import Category
from app.datasources.remote_datasource import RemoteDataSource

class CategoryRepository(ICategoryRepository):
    def __init__(self):
        self.data_source = RemoteDataSource()

    def get_all(self, user_id: str | None = None) -> List[CategoryModel]:
        db = self.data_source.get_session()
        try:
            query = db.query(Category)
            if user_id:
                query = query.filter(Category.user_id == user_id)
            categories = query.all()
            return [CategoryModel(id=c.id, name=c.name, user_id=c.user_id) for c in categories]
        finally:
            db.close()

    def get(self, category_id: int) -> CategoryModel | None:
        db = self.data_source.get_session()
        try:
            category = db.query(Category).filter(Category.id == category_id).first()
            if category:
                return CategoryModel(id=category.id, name=category.name, user_id=category.user_id)
            return None
        finally:
            db.close()

    def insert(self, category: CategoryModel) -> CategoryModel:
        db = self.data_source.get_session()
        try:
            db_category = Category(name=category.name, user_id=category.user_id) 
            db.add(db_category)
            db.commit()
            db.refresh(db_category)
            return CategoryModel(id=db_category.id, name=db_category.name, user_id=db_category.user_id)
        finally:
            db.close()

    def update(self, category_id: int, category: CategoryModel) -> CategoryModel | None:
        db = self.data_source.get_session()
        try:
            db_category = db.query(Category).filter(Category.id == category_id).first()
            if not db_category:
                return None
            
            db_category.name = category.name
            # Typically we don't update user_id or we check it matches, but keeping it simple for now as route handles auth check
            db.commit()
            db.refresh(db_category)
            return CategoryModel(id=db_category.id, name=db_category.name, user_id=db_category.user_id)
        finally:
            db.close()

    def delete(self, category_id: int) -> bool:
        db = self.data_source.get_session()
        try:
            db_category = db.query(Category).filter(Category.id == category_id).first()
            if db_category:
                db.delete(db_category)
                db.commit()
                return True
            return False
        finally:
            db.close()
