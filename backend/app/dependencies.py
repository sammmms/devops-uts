import os
from functools import lru_cache

from app.interfaces.repositories.todo_repository import ITodoRepository
from app.interfaces.repositories.category_repository import ICategoryRepository
from app.interfaces.repositories.user_repository import IUserRepository

from app.usecases.todo_usecase import TodoUseCase
from app.usecases.category_usecase import CategoryUseCase
from app.usecases.auth_usecase import AuthUseCase

# Import Implementations
from app.repositories.remote.todo_repository import TodoRepository as RemoteTodoRepository
from app.repositories.remote.category_repository import CategoryRepository as RemoteCategoryRepository
from app.repositories.remote.user_repository import UserRepository as RemoteUserRepository

from app.repositories.local.todo_repository import TodoRepository as LocalTodoRepository
from app.repositories.local.category_repository import CategoryRepository as LocalCategoryRepository
from app.repositories.local.user_repository import UserRepository as LocalUserRepository

def get_repository_mode():
    return os.getenv("REPOSITORY_MODE", "remote").lower()

@lru_cache()
def get_user_repository() -> IUserRepository:
    mode = get_repository_mode()
    if mode == "local":
        return LocalUserRepository()
    return RemoteUserRepository()

@lru_cache()
def get_todo_repository() -> ITodoRepository:
    mode = get_repository_mode()
    if mode == "local":
        return LocalTodoRepository()
    return RemoteTodoRepository()

@lru_cache()
def get_category_repository() -> ICategoryRepository:
    mode = get_repository_mode()
    if mode == "local":
        return LocalCategoryRepository()
    return RemoteCategoryRepository()

# UseCase Factories
def get_auth_usecase() -> AuthUseCase:
    repo = get_user_repository()
    return AuthUseCase(repository=repo)

def get_todo_usecase() -> TodoUseCase:
    repo = get_todo_repository()
    return TodoUseCase(repository=repo)

def get_category_usecase() -> CategoryUseCase:
    repo = get_category_repository()
    return CategoryUseCase(repository=repo)
