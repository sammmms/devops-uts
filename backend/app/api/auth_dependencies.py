"""
Centralized authentication dependencies for API routes.
This module provides shared authentication utilities to avoid code duplication.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.usecases.auth_usecase import decode_access_token

# Shared security scheme
security = HTTPBearer()


async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """
    Get current user ID from JWT token.
    
    This dependency extracts and validates the JWT token from the Authorization header,
    returning the user ID (subject) from the token payload.
    
    Args:
        credentials: The HTTP Bearer credentials containing the JWT token
        
    Returns:
        str: The user ID extracted from the token
        
    Raises:
        HTTPException: 401 if token is invalid or missing user ID
    """
    token = credentials.credentials
    try:
        payload = decode_access_token(token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user ID",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_id
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )


# Alias for backward compatibility and cleaner imports
get_current_user = get_current_user_id
