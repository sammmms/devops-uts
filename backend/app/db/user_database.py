import json
from pathlib import Path
from app.models.user_model import UserModel


class UserDatabase:
    _instance = None
    _db_path: str = "app/db/local/users.json"

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._init_db()
        return cls._instance

    def _init_db(self):
        """Initialize database file if it doesn't exist"""
        Path(self._db_path).parent.mkdir(parents=True, exist_ok=True)
        if not Path(self._db_path).exists():
            Path(self._db_path).write_text("{}")

    def _read_all(self) -> dict:
        """Read all users from JSON file"""
        with open(self._db_path, "r") as f:
            return json.load(f)

    def _write_all(self, data: dict):
        """Write all users to JSON file"""
        with open(self._db_path, "w") as f:
            json.dump(data, f, indent=2)

    def get_by_email(self, email: str) -> UserModel | None:
        """Get user by email"""
        data = self._read_all()
        for user_id, user_data in data.items():
            if user_data.get("email") == email:
                return UserModel(**user_data)
        return None

    def get_by_id(self, user_id: int) -> UserModel | None:
        """Get user by ID"""
        data = self._read_all()
        user_data = data.get(str(user_id))
        if user_data:
            return UserModel(**user_data)
        return None

    def create(self, user: UserModel, password_hash: str) -> UserModel:
        """Create a new user"""
        data = self._read_all()
        
        # Generate new ID
        max_id = max([int(uid) for uid in data.keys()], default=0)
        user_id = max_id + 1
        
        user_data = {
            "id": user_id,
            "email": user.email,
            "username": user.username,
            "password_hash": password_hash,
        }
        
        data[str(user_id)] = user_data
        self._write_all(data)
        
        return UserModel(**user_data)

    def get_by_username(self, username: str) -> UserModel | None:
        """Get user by username"""
        data = self._read_all()
        for user_id, user_data in data.items():
            if user_data.get("username") == username:
                return UserModel(**user_data)
        return None

    def get_password_hash(self, email: str) -> str | None:
        """Get password hash for a user by email"""
        data = self._read_all()
        for user_id, user_data in data.items():
            if user_data.get("email") == email:
                return user_data.get("password_hash")
        return None
