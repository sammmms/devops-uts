import os
import uuid
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
from passlib.context import CryptContext
from pydantic import ValidationError
from dotenv import load_dotenv

from app.models.pydantic.user_model import UserLogin, UserModel, UserCreate, TokenResponse, UserInDB
from app.interfaces.repositories.user_repository import IUserRepository

load_dotenv()

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.JWTError:
        return None

class AuthUseCase:
    repository: IUserRepository

    def __init__(self, repository: IUserRepository):
        self.repository = repository

    def verify_password(self, plain_password, hashed_password):
        return pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password):
        return pwd_context.hash(password)

    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    def authenticate_user(self, login_data: UserLogin) -> UserModel | None:
        user = None
        if login_data.email:
            user = self.repository.get_by_email(login_data.email)
        elif login_data.username:
            user = self.repository.get_by_username(login_data.username)
            
        if not user:
            return None
        if not self.verify_password(login_data.password, user.hashed_password):
            return None
        
        return UserModel(
            id=user.id,
            email=user.email,
            username=user.username,
            full_name=user.full_name
        )

    def register_user(self, user_create: UserCreate) -> UserModel:
        hashed_pw = self.get_password_hash(user_create.password)
        
        # Check if exists
        if self.repository.get_by_email(user_create.email):
            raise ValueError("Email already registered")
        if self.repository.get_by_username(user_create.username):
            raise ValueError("Username already taken")

        user_in_db = UserInDB(
            id=str(uuid.uuid4()),
            email=user_create.email,
            username=user_create.username,
            full_name=user_create.full_name,
            hashed_password=hashed_pw
        )
        
        created_user = self.repository.insert(user_in_db)
        return UserModel(
            id=created_user.id,
            email=created_user.email,
            username=created_user.username,
            full_name=created_user.full_name
        )
