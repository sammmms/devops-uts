from pydantic import BaseModel


class CategoryModel(BaseModel):
    id: int
    name: str
    user_id: str | None = None


class CategoryResponseModel(CategoryModel):
    pass


class CategoryCreateModel(BaseModel):
    name: str
