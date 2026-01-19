from fastapi import APIRouter, Depends
from app.utils.response_util import create_json_response
from app.usecases.todo_usecase import TodoUseCase

from app.dependencies import get_todo_usecase
from app.api.auth_dependencies import get_current_user

router = APIRouter(prefix="/category-todos", tags=["category-todos"])


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
