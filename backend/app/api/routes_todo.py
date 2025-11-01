from fastapi import APIRouter, HTTPException
from app.models.todo_model import TodoCreateModel, TodoModel, TodoResponseModel
from app.services.todo_services import TodoServices
from app.db.todo_database import TodoDatabase
from app.utils.response_util import create_json_response
from app.services.category_services import CategoryServices
from app.db.category_database import CategoryDatabase

router = APIRouter()
todo_service = TodoServices(db=TodoDatabase())
category_service = CategoryServices(db=CategoryDatabase())


@router.post("/todo")
async def create_todo(todo: TodoCreateModel):
    if todo.category_id is not None:
        category = category_service.get_by_id(todo.category_id)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
    created_todo = todo_service.create(todo)
    return create_json_response("Todo created", {"todo": created_todo}, status_code=201)


@router.get("/todo")
async def get_todos():
    todos = todo_service.get_all()
    return create_json_response("Todos fetched", {"todos": todos})


@router.get("/todo/{todo_id}")
async def get_todo(todo_id: int):
    todo = todo_service.get_by_id(todo_id)
    if not todo:
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


@router.put("/todo/{todo_id}")
async def update_todo(todo: TodoModel, todo_id: int):
    updated_todo = todo_service.update(todo_id, todo)
    if not updated_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return create_json_response("Todo updated", {"todo": updated_todo})


@router.delete("/todo/{todo_id}")
async def delete_todo(todo_id: int):
    deleted = todo_service.delete(todo_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Todo not found")
    return create_json_response("Todo deleted")
