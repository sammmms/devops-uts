from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes_todo import router as todo_router
from app.api.routes_category import router as category_router
from app.api.routes_dashboard import router as dashboard_router
from app.api.routes_category_todo import router as category_todo_router
from app.utils.response_util import create_json_response

async def http_exception_handler(_, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail, "data": None},
    )


def add_cors_middleware(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

router = APIRouter()

@router.get("/health", tags=["health"])
def health():
    return create_json_response(message="API is running")

routes: list[dict[str:APIRouter]] = [
    {
        "health": router,
        "todos": todo_router,
        "categories": category_router,
        "category_todos": category_todo_router,
        "dashboard": dashboard_router,
    }
]


def create_app() -> FastAPI:
    app = FastAPI(
        title="Todo API",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    app.add_exception_handler(HTTPException, http_exception_handler)

    add_cors_middleware(app)

    for route in routes:
        for prefix, router in route.items():
            app.include_router(router, prefix=f"/api/v1", tags=[prefix])

    return app


app = create_app()
