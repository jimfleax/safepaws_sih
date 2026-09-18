from fastapi import APIRouter, Depends, HTTPException, Response, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import httpx
import jwt
import os
from datetime import datetime, timedelta

from app.api.dependencies import get_db, get_current_owner
from app.db.models import Owner
from app.schemas.user import GoogleLoginRequest

router = APIRouter()
SECRET_KEY = os.getenv('JWT_SECRET', 'supersecret')

@router.post("/google")
async def google_login(request_data: GoogleLoginRequest, response: Response, db: AsyncSession = Depends(get_db)):
    token = request_data.token
    if not token:
        raise HTTPException(status_code=400, detail="Token is required")
        
    try:
        async with httpx.AsyncClient() as client:
            user_info_response = await client.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {token}"}
            )
            if not user_info_response.is_success:
                raise HTTPException(status_code=401, detail="Invalid Google token")
            payload = user_info_response.json()
    except Exception:
        raise HTTPException(status_code=401, detail="Failed to verify Google token")
        
    email = payload.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Invalid token payload")
        
    google_id = payload.get("sub")
    name = payload.get("name", email.split('@')[0])
    
    # In the legacy server, they used email to find the user.
    # In PostgreSQL, Owner uses a uuid, but we'll use sub as the ID for consistency if we create them here.
    stmt = select(Owner).where(Owner.id == google_id)
    result = await db.execute(stmt)
    owner = result.scalars().first()
    
    if not owner:
        owner = Owner(
            id=google_id,
            name=name,
            email=email,
            phone=""  # Dummy phone to satisfy NOT NULL constraint before profile setup
        )
        db.add(owner)
        await db.commit()
        await db.refresh(owner)
        
    # Generate JWT
    exp = datetime.utcnow() + timedelta(days=30)
    jwt_payload = {
        "userId": owner.id,
        "tokenVersion": 0,
        "exp": exp
    }
    jwt_token = jwt.encode(jwt_payload, SECRET_KEY, algorithm="HS256")
    
    response.set_cookie(
        key="jwt",
        value=jwt_token,
        httponly=True,
        max_age=30 * 24 * 60 * 60,
        samesite="lax",
        secure=os.getenv("NODE_ENV") == "production"
    )
    
    # We return the profileCompleted flag based on whether they have a real phone number
    profile_completed = bool(owner.phone and owner.phone != "")
    
    return {
        "success": True,
        "user": {
            "id": owner.id,
            "name": owner.name,
            "email": owner.email,
            "picture": payload.get("picture", ""),
            "profileCompleted": profile_completed
        }
    }

@router.get("/me")
async def get_current_session(current_owner: Owner = Depends(get_current_owner)):
    profile_completed = bool(current_owner.phone and current_owner.phone != "")
    return {
        "id": current_owner.id,
        "name": current_owner.name,
        "email": current_owner.email,
        "phone": current_owner.phone,
        "neighborhood": current_owner.neighborhood,
        "profileCompleted": profile_completed
    }

@router.post("/logout")
async def logout(response: Response, current_owner: Owner = Depends(get_current_owner)):
    response.delete_cookie(
        key="jwt",
        httponly=True,
        samesite="lax",
        secure=os.getenv("NODE_ENV") == "production"
    )
    return {"success": True, "message": "Logged out successfully"}
