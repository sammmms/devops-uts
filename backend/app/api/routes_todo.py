from fastapi import APIRouter, HTTPException
from app.models.todo_model import TodoModel
from app.services.todo_services import TodoServices
from app.db.todo_database import TodoDatabase

router = APIRouter()
todo_service = TodoServices(db=TodoDatabase())


@router.post("/todo")
async def create_todo(todo: TodoModel):
    return {"message": "Todo created", "todo": todo_service.create_todo(todo)}


@router.get("/todo")
async def read_todos():
    return {"todos": todo_service.get_all_todos()}


@router.get("/todo/{todo_id}")
async def read_todo(todo_id: int):
    todo = todo_service.get_todo_by_id(todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"todo": todo}


@router.put("/todo/{todo_id}")
async def update_todo(todo: TodoModel, todo_id: int):
    updated_todo = todo_service.update_todo(todo_id, todo)
    if not updated_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"message": "Todo updated", "todo": updated_todo}


@router.delete("/todo/{todo_id}")
async def delete_todo(todo_id: int):
    deleted = todo_service.delete_todo(todo_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"message": "Todo deleted"}
