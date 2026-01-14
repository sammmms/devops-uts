from app.interfaces.repositories.user_repository import IUserRepository
from app.models.pydantic.user_model import UserInDB
from app.models.orm import User
from app.datasources.remote_datasource import RemoteDataSource
import uuid

class UserRepository(IUserRepository):
    def __init__(self):
        self.data_source = RemoteDataSource()

    def get_by_email(self, email: str) -> UserInDB | None:
        db = self.data_source.get_session()
        try:
            user = db.query(User).filter(User.email == email).first()
            if user:
                return UserInDB(
                    id=user.id,
                    email=user.email,
                    username=user.username,
                    hashed_password=user.password_hash,
                    full_name=user.full_name
                )
            return None
        finally:
            db.close()

    def get_by_username(self, username: str) -> UserInDB | None:
        db = self.data_source.get_session()
        try:
            user = db.query(User).filter(User.username == username).first()
            if user:
                return UserInDB(
                    id=user.id,
                    email=user.email,
                    username=user.username,
                    hashed_password=user.password_hash,
                    full_name=user.full_name
                )
            return None
        finally:
            db.close()

    def get(self, user_id: str) -> UserInDB | None:
        db = self.data_source.get_session()
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                return UserInDB(
                    id=user.id,
                    email=user.email,
                    username=user.username,
                    hashed_password=user.password_hash,
                    full_name=user.full_name
                )
            return None
        finally:
            db.close()

    def insert(self, user: UserInDB) -> UserInDB:
        db = self.data_source.get_session()
        try:
            user_id = user.id if user.id else str(uuid.uuid4())
            db_user = User(
                id=user_id,
                email=user.email,
                username=user.username,
                password_hash=user.hashed_password,
                full_name=user.full_name
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            return UserInDB(
                id=db_user.id,
                email=db_user.email,
                username=db_user.username,
                hashed_password=db_user.password_hash,
                full_name=db_user.full_name
            )
        finally:
            db.close()
