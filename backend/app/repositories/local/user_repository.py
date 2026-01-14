from app.interfaces.repositories.user_repository import IUserRepository
from app.models.pydantic.user_model import UserInDB
from app.datasources.local_datasource import LocalDataSource
import uuid

class UserRepository(IUserRepository):
    def __init__(self):
        self.data_source = LocalDataSource()
    
    def get_by_email(self, email: str) -> UserInDB | None:
        for user in self.data_source.users.values():
            if user.email == email:
                return user
        return None

    def get_by_username(self, username: str) -> UserInDB | None:
        for user in self.data_source.users.values():
            if user.username == username:
                return user
        return None

    def get(self, user_id: str) -> UserInDB | None:
        return self.data_source.users.get(user_id)

    def insert(self, user: UserInDB) -> UserInDB:
        user_id = user.id if user.id else str(uuid.uuid4())
        new_user = user.model_copy(update={"id": user_id})
        self.data_source.users[user_id] = new_user
        return new_user
