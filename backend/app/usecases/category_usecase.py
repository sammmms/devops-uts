from app.models.pydantic.category_model import CategoryModel
from app.interfaces.repositories.category_repository import ICategoryRepository

class CategoryUseCase:
    repository: ICategoryRepository

    def __init__(self, repository: ICategoryRepository):
        self.repository = repository

    def create(self, item: CategoryModel) -> CategoryModel:
        return self.repository.insert(item)

    def get_all(self, user_id: str | None = None) -> list[CategoryModel]:
        return self.repository.get_all(user_id)

    def get_by_id(self, category_id: int) -> CategoryModel | None:
        return self.repository.get(category_id)

    def update(self, category_id: int, updated_item: CategoryModel) -> CategoryModel | None:
        return self.repository.update(category_id, updated_item)

    def delete(self, category_id: int) -> bool:
        return self.repository.delete(category_id)
