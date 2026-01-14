from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.response_util import create_json_response
from app.usecases.todo_usecase import TodoUseCase
# from app.db.todo_database import TodoDatabase # Removed
from app.usecases.auth_usecase import decode_access_token

from app.dependencies import get_todo_usecase

router = APIRouter(prefix="/category-todos", tags=["category-todos"])
security = HTTPBearer()
# todo_services = TodoServices() # Removed


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Get current user ID from JWT token"""
    token = credentials.credentials
    try:
        payload = decode_access_token(token)
        if not payload:
            raise Exception("Invalid token")
        user_id = payload.get("sub")
        if not user_id:
            raise Exception("Invalid token")
        return user_id
    except Exception:
        raise Exception("Invalid token")


@router.post("/{id}/todo")
async def get_todo_by_category(
    id: int, 
    current_user: str = Depends(get_current_user),
    todo_services: TodoUseCase = Depends(get_todo_usecase)
):
    todos = todo_services.get_todo_by_category(category_id=id, user_id=current_user)
    return create_json_response(
        message="Todos fetched successfully", data={"todos": todos}
    )
