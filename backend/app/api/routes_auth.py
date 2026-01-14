from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.models.pydantic.user_model import UserCreate, UserLogin, UserModel, TokenResponse
from app.usecases.auth_usecase import AuthUseCase, decode_access_token
from app.utils.response_util import create_json_response
from app.dependencies import get_auth_usecase

router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer()

@router.post("/register")
async def register(user_data: UserCreate, auth_usecase: AuthUseCase = Depends(get_auth_usecase)):
    """Register a new user"""
    try:
        user = auth_usecase.register_user(user_data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    
    access_token = auth_usecase.create_access_token(data={"sub": str(user.id)})
    
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
async def login(credentials: UserLogin, auth_usecase: AuthUseCase = Depends(get_auth_usecase)):
    """Login with email or username and password"""
    user = auth_usecase.authenticate_user(credentials)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    access_token = auth_usecase.create_access_token(data={"sub": str(user.id)})
    
    token_response = TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user
    )
    
    return create_json_response(
        "Login successful",
        {"data": token_response.model_dump()}
    )


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), auth_usecase: AuthUseCase = Depends(get_auth_usecase)):
    """Dependency to get current user from JWT token"""
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user_in_db = auth_usecase.repository.get(user_id)
    if not user_in_db:
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
        
    # user_in_db is UserInDB, convert to UserModel for route usage
    return UserModel(
            id=user_in_db.id,
            email=user_in_db.email,
            username=user_in_db.username,
            full_name=user_in_db.full_name
        )


@router.get("/me")
async def get_me(current_user: UserModel = Depends(get_current_user)):
    """Get current user info"""
    return create_json_response(
        "User retrieved",
        {"data": current_user.model_dump()}
    )


@router.post("/refresh")
async def refresh_token(current_user: UserModel = Depends(get_current_user), auth_usecase: AuthUseCase = Depends(get_auth_usecase)):
    """Refresh access token"""
    access_token = auth_usecase.create_access_token(data={"sub": str(current_user.id)})
    
    token_response = TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=current_user
    )
    
    return create_json_response(
        "Token refreshed",
        {"data": token_response.model_dump()}
    )
