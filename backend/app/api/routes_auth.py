from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.models.user_model import UserCreate, UserLogin, UserModel, TokenResponse
from app.db.user_database import UserDatabase
from app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
)
from app.utils.response_util import create_json_response

router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer()
user_db = UserDatabase()


@router.post("/register")
async def register(user_data: UserCreate):
    """Register a new user"""
    # Check if user already exists
    existing_user = user_db.get_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    existing_username = user_db.get_by_username(user_data.username)
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create new user with hashed password
    hashed_password = hash_password(user_data.password)
    user_model = UserModel(
        id=None,
        email=user_data.email,
        username=user_data.username,
        password_hash=hashed_password
    )
    user = user_db.create(user=user_model, password_hash=hashed_password)
    
    # Generate token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    token_response = TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user
    )
    
    return create_json_response(
        "User registered successfully",
        {"data": token_response.model_dump()},
        status_code=201
    )


@router.post("/login")
async def login(credentials: UserLogin):
    """Login with email or username and password"""
    # Find user by email or username
    user = None
    password_hash = None
    
    if credentials.email:
        user = user_db.get_by_email(credentials.email)
        password_hash = user_db.get_password_hash(credentials.email)
    elif credentials.username:
        user = user_db.get_by_username(credentials.username)
        if user:
            # Get password hash by email since that's the only way available
            password_hash = user_db.get_password_hash(user.email)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username is required"
        )
    
    if not user or not password_hash or not verify_password(credentials.password, password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Generate token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    token_response = TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user
    )
    
    return create_json_response(
        "Login successful",
        {"data": token_response.model_dump()}
    )


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Dependency to get current user from JWT token"""
    token = credentials.credentials
    
    try:
        payload = decode_access_token(token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user = user_db.get_by_id(int(user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user


@router.get("/me")
async def get_me(current_user: UserModel = Depends(get_current_user)):
    """Get current user info"""
    return create_json_response(
        "User retrieved",
        {"data": current_user.model_dump()}
    )


@router.post("/refresh")
async def refresh_token(current_user: UserModel = Depends(get_current_user)):
    """Refresh access token"""
    access_token = create_access_token(data={"sub": str(current_user.id)})
    
    token_response = TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=current_user
    )
    
    return create_json_response(
        "Token refreshed",
        {"data": token_response.model_dump()}
    )
