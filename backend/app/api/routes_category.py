from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.response_util import create_json_response
from app.db.category_database import CategoryDatabase
from app.models.category_model import CategoryCreateModel, CategoryModel
from app.services.category_services import CategoryServices
from app.services.todo_services import TodoServices
from app.db.todo_database import TodoDatabase
from app.services.auth_service import decode_access_token

router = APIRouter(prefix="/category", tags=["category"])
security = HTTPBearer()
category_service = CategoryServices(db=CategoryDatabase())
todo_service = TodoServices(db=TodoDatabase())


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Get current user ID from JWT token"""
    token = credentials.credentials
    try:
        payload = decode_access_token(token)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid token")
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.post("")
async def create_category(category: CategoryCreateModel, current_user: str = Depends(get_current_user)):
    # Create category with user_id
    category_dict = category.model_dump()
    category_dict["user_id"] = current_user
    category_dict["id"] = int(max([int(k) for k in category_service.db.all().keys()] + [0])) + 1
    category_model = CategoryModel(**category_dict)
    created_category = category_service.create(category_model)
    return create_json_response(
        "Category created", {"category": created_category}, status_code=201
    )


@router.get("")
async def get_categories(current_user: str = Depends(get_current_user)):
    categories = category_service.get_all(whereQuery={"user_id": current_user})
    todos = todo_service.get_all(user_id=current_user)
    
    # Count todos per category
    todo_counts = {}
    for todo in todos:
        # Assuming todo has category_id field
        cat_id = getattr(todo, "category_id", None)
        if cat_id is not None:
            todo_counts[cat_id] = todo_counts.get(cat_id, 0) + 1
            
    # Add count to category objects (convert to dict first if needed, or set attribute)
    categories_with_count = []
    for cat in categories:
        cat_dict = cat.model_dump()
        cat_dict["todos_count"] = todo_counts.get(cat.id, 0)
        categories_with_count.append(cat_dict)
        
    return create_json_response("Categories fetched", {"categories": categories_with_count})


@router.get("/{category_id}")
async def get_category(category_id: int, current_user: str = Depends(get_current_user)):
    category = category_service.get_by_id(category_id)
    if not category or category.user_id != current_user:
        raise HTTPException(status_code=404, detail="Category not found")
    return create_json_response("Category fetched", {"category": category})


@router.put("/{category_id}")
async def update_category(category_id: int, category: CategoryCreateModel, current_user: str = Depends(get_current_user)):
    existing_category = category_service.get_by_id(category_id)
    if not existing_category or existing_category.user_id != current_user:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Create a CategoryModel with the update data
    category_model = CategoryModel(id=category_id, name=category.name, user_id=current_user)
    updated_category = category_service.update(category_id, category_model)
    if not updated_category:
        raise HTTPException(status_code=404, detail="Category not found")
    return create_json_response("Category updated", {"category": updated_category})


@router.delete("/{category_id}")
async def delete_category(category_id: int, current_user: str = Depends(get_current_user)):
    existing_category = category_service.get_by_id(category_id)
    if not existing_category or existing_category.user_id != current_user:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Cascade delete todos
    todo_service.delete_by_category_id(category_id, user_id=current_user)
    
    deleted = category_service.delete(category_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Category not found")
    return create_json_response("Category deleted")
