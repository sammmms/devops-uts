from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models.pydantic.todo_model import TodoCreateModel, TodoModel, TodoResponseModel
from app.usecases.todo_usecase import TodoUseCase

from app.utils.response_util import create_json_response
from app.usecases.category_usecase import CategoryUseCase

from app.usecases.auth_usecase import AuthUseCase, decode_access_token # decode_access_token needs check if it is exported from usecase

from app.dependencies import get_todo_usecase, get_category_usecase

router = APIRouter(prefix="/todo", tags=["todo"])
security = HTTPBearer()
# todo_service = TodoServices() # Removed
# category_service = CategoryServices() # Removed
# user_db = UserDatabase() # Use AuthServices or Repo if needed


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
async def create_todo(
    todo: TodoCreateModel, 
    current_user: str = Depends(get_current_user),
    todo_service: TodoUseCase = Depends(get_todo_usecase),
    category_service: CategoryUseCase = Depends(get_category_usecase)
):
    if todo.category_id is not None:
        category = category_service.get_by_id(todo.category_id)
        if not category or category.user_id != current_user:
            raise HTTPException(status_code=404, detail="Category not found")
    
    # Create todo with user_id
    todo_dict = todo.model_dump()
    todo_dict["user_id"] = current_user
    todo_model = TodoModel(**todo_dict)
    created_todo = todo_service.create(todo_model)
    return create_json_response("Todo created", {"todo": created_todo}, status_code=201)


@router.get("")
async def get_todos(
    category_id: int | None = None,
    completed: bool | None = None,
    overdue: bool | None = None,
    current_user: str = Depends(get_current_user),
    todo_service: TodoUseCase = Depends(get_todo_usecase),
):
    # Pass filters to service with user_id
    todos = todo_service.get_all(user_id=current_user, category_id=category_id, completed=completed, overdue=overdue)
    return create_json_response("Todos fetched", {"todos": todos})


@router.get("/{todo_id}")
async def get_todo(
    todo_id: int, 
    current_user: str = Depends(get_current_user),
    todo_service: TodoUseCase = Depends(get_todo_usecase),
    category_service: CategoryUseCase = Depends(get_category_usecase)
):
    todo = todo_service.get_by_id(todo_id)
    if not todo or todo.user_id != current_user:
        raise HTTPException(status_code=404, detail="Todo not found")
    if todo.category_id is not None:
        category = category_service.get_by_id(todo.category_id)
    return create_json_response(
        "Todo fetched",
        {
            "todo": TodoResponseModel(
                **todo.model_dump(), category=category if todo.category_id else None
            )
        },
    )


@router.put("/{todo_id}")
async def update_todo(
    todo_id: int, 
    todo: TodoModel, 
    current_user: str = Depends(get_current_user),
    todo_service: TodoUseCase = Depends(get_todo_usecase),
):
    existing_todo = todo_service.get_by_id(todo_id)
    if not existing_todo or existing_todo.user_id != current_user:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    # Update the todo with the path parameter id and preserve user_id
    todo.id = todo_id
    todo.user_id = current_user
    updated_todo = todo_service.update(todo_id, todo)
    if not updated_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return create_json_response("Todo updated", {"todo": updated_todo})


@router.delete("/{todo_id}")
async def delete_todo(
    todo_id: int, 
    current_user: str = Depends(get_current_user),
    todo_service: TodoUseCase = Depends(get_todo_usecase)
):
    existing_todo = todo_service.get_by_id(todo_id)
    if not existing_todo or existing_todo.user_id != current_user:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    deleted = todo_service.delete(todo_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Todo not found")
    return create_json_response("Todo deleted")
