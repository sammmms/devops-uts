from datetime import date, timedelta
from fastapi import APIRouter
from app.services.todo_services import TodoServices
from app.db.todo_database import TodoDatabase
from app.services.category_services import CategoryServices
from app.db.category_database import CategoryDatabase

router = APIRouter()

todo_service = TodoServices(db=TodoDatabase())
category_service = CategoryServices(db=CategoryDatabase())

@router.get("/dashboard/stats", tags=["dashboard"])
def get_dashboard_stats():
    todos = todo_service.get_all()
    categories = category_service.get_all()
    
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
            ]
        }
    }
