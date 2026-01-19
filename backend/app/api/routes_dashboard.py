from datetime import date, timedelta
from fastapi import APIRouter, Depends
from app.usecases.todo_usecase import TodoUseCase
from app.usecases.category_usecase import CategoryUseCase

from app.dependencies import get_todo_usecase, get_category_usecase
from app.api.auth_dependencies import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats", tags=["dashboard"])
async def get_dashboard_stats(
    current_user: str = Depends(get_current_user),
    todo_service: TodoUseCase = Depends(get_todo_usecase),
    category_service: CategoryUseCase = Depends(get_category_usecase)
):
    todos = todo_service.get_all(user_id=current_user)
    categories = category_service.get_all(user_id=current_user)
    
    today = date.today()
    next_week = today + timedelta(days=7)

    total_todos = len(todos)
    completed_todos = len([t for t in todos if t.completed])
    pending_todos = total_todos - completed_todos
    total_categories = len(categories)
    
    # Overdue tasks (past deadline and not completed)
    overdue_todos = [
        t for t in todos 
        if t.deadline and t.deadline < today and not t.completed
    ]
    
    # Upcoming tasks (deadline within next 7 days and not completed)
    upcoming_todos = [
        t for t in todos 
        if t.deadline and today <= t.deadline <= next_week and not t.completed
    ]
    
    # Category distribution
    category_map = {c.id: c.name for c in categories}
    category_distribution = {}
    for t in todos:
        if t.category_id in category_map:
            cat_name = category_map[t.category_id]
            category_distribution[cat_name] = category_distribution.get(cat_name, 0) + 1
        else:
            category_distribution["Uncategorized"] = category_distribution.get("Uncategorized", 0) + 1

    # Priority distribution
    priority_distribution = {"low": 0, "medium": 0, "high": 0, "urgent": 0}
    for t in todos:
        priority = getattr(t, 'priority', 'medium') or 'medium'
        if priority in priority_distribution:
            priority_distribution[priority] += 1

    return {
        "status": "success",
        "data": {
            "total_todos": total_todos,
            "completed_todos": completed_todos,
            "pending_todos": pending_todos,
            "total_categories": total_categories,
            "overdue_todos": overdue_todos,
            "upcoming_todos": upcoming_todos,
            "category_distribution": [
                {"name": k, "value": v} for k, v in category_distribution.items()
            ],
            "priority_distribution": [
                {"name": k, "value": v, "color": {"low": "#9ca3af", "medium": "#3b82f6", "high": "#f97316", "urgent": "#ef4444"}[k]} 
                for k, v in priority_distribution.items()
            ]
        }
    }
