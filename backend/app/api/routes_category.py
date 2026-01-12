from fastapi import APIRouter, HTTPException
from app.utils.response_util import create_json_response
from app.db.category_database import CategoryDatabase
from app.models.category_model import CategoryCreateModel, CategoryModel
from app.services.category_services import CategoryServices
from app.services.todo_services import TodoServices
from app.db.todo_database import TodoDatabase

router = APIRouter()
category_service = CategoryServices(db=CategoryDatabase())
todo_service = TodoServices(db=TodoDatabase())


@router.post("/category")
async def create_category(category: CategoryCreateModel):
    created_category = category_service.create(category)
    return create_json_response(
        "Category created", {"category": created_category}, status_code=201
    )


@router.get("/category")
async def get_categories():
    categories = category_service.get_all()
    return create_json_response("Categories fetched", {"categories": categories})


@router.get("/category/{category_id}")
async def get_category(category_id: int):
    category = category_service.get_by_id(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return create_json_response("Category fetched", {"category": category})


@router.put("/category/{category_id}")
async def update_category(category: CategoryModel, category_id: int):
    updated_category = category_service.update(category_id, category)
    if not updated_category:
        raise HTTPException(status_code=404, detail="Category not found")
    return create_json_response("Category updated", {"category": updated_category})


@router.delete("/category/{category_id}")
async def delete_category(category_id: int):
    # Cascade delete todos
    todo_service.delete_by_category_id(category_id)
    
    deleted = category_service.delete(category_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Category not found")
    return create_json_response("Category deleted")
