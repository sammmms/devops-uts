from typing import List
from app.interfaces.repositories.category_repository import ICategoryRepository
from app.models.pydantic.category_model import CategoryModel
from app.datasources.local_datasource import LocalDataSource

class CategoryRepository(ICategoryRepository):
    def __init__(self):
        self.data_source = LocalDataSource()

    def get_all(self, user_id: str | None = None) -> List[CategoryModel]:
        categories = self.data_source.categories.values()
        if user_id:
             categories = [c for c in categories if getattr(c, 'user_id', None) == user_id or getattr(c, 'user_id', None) is None] 
        return list(categories)

    def get(self, category_id: int) -> CategoryModel | None:
        return self.data_source.categories.get(category_id)

    def insert(self, category: CategoryModel) -> CategoryModel:
        if not self.data_source.categories:
            new_id = 1
        else:
            new_id = max(self.data_source.categories.keys()) + 1
            
        new_cat = category.model_copy(update={"id": new_id})
        self.data_source.categories[new_id] = new_cat
        return new_cat

    def update(self, category_id: int, category: CategoryModel) -> CategoryModel | None:
        if category_id not in self.data_source.categories:
            return None
        updated_cat = category.model_copy(update={"id": category_id})
        self.data_source.categories[category_id] = updated_cat
        return updated_cat

    def delete(self, category_id: int) -> bool:
        if category_id in self.data_source.categories:
            del self.data_source.categories[category_id]
            return True
        return False
