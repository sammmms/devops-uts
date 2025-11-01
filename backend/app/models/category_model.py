from pydantic import BaseModel


class CategoryModel(BaseModel):
    id: int
    name: str


class CategoryResponseModel(CategoryModel):
    pass


class CategoryCreateModel(BaseModel):
    name: str
