from abc import ABC, abstractmethod
from app.models.pydantic.user_model import UserInDB

class IUserRepository(ABC):
    @abstractmethod
    def get_by_email(self, email: str) -> UserInDB | None:
        pass

    @abstractmethod
    def get_by_username(self, username: str) -> UserInDB | None:
        pass

    @abstractmethod
    def get(self, user_id: str) -> UserInDB | None:
        pass

    @abstractmethod
    def insert(self, user: UserInDB) -> UserInDB:
        pass
