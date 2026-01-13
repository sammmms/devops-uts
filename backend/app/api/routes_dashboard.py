from datetime import date, timedelta
from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.todo_services import TodoServices
from app.db.todo_database import TodoDatabase
from app.services.category_services import CategoryServices
from app.db.category_database import CategoryDatabase
from app.services.auth_service import decode_access_token

router = APIRouter(prefix="/dashboard", tags=["dashboard"])
security = HTTPBearer()

todo_service = TodoServices(db=TodoDatabase())
category_service = CategoryServices(db=CategoryDatabase())


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


@router.get("/stats", tags=["dashboard"])
async def get_dashboard_stats(current_user: str = Depends(get_current_user)):
    todos = todo_service.get_all(user_id=current_user)
    categories = category_service.get_all(whereQuery={"user_id": current_user})
    
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
