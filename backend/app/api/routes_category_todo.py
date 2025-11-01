from fastapi import APIRouter
from app.utils.response_util import create_json_response
from app.services.todo_services import TodoServices
from app.db.todo_database import TodoDatabase

router = APIRouter()
todo_services = TodoServices(db=TodoDatabase())


@router.post("/category/{id}/todo")
def get_todo_by_category(id: int):
    todos = todo_services.get_todo_by_category(category_id=id)
    return create_json_response(
        message="Todos fetched successfully", data={"todos": todos}
    )
