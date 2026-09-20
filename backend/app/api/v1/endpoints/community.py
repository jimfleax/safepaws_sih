from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api import dependencies
from app.db import models
from app.schemas.community import (
    CommunityPost, CommunityPostCreate,
    CommunityReply, CommunityReplyCreate,
    Report, ReportCreate,
    CommunityPreference, CommunityPreferenceCreate,
    RecoveryTask, Notification
)

router = APIRouter()

@router.post("/posts", response_model=CommunityPost)
async def create_post(
    *,
    db: AsyncSession = Depends(dependencies.get_db),
    post_in: CommunityPostCreate,
    current_user: models.Owner = Depends(dependencies.get_current_owner)
) -> Any:
    """
    Create a new community post.
    """
    post = models.CommunityPost(
        **post_in.model_dump(),
        author_id=current_user.id
    )
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return post

@router.get("/posts", response_model=List[CommunityPost])
async def read_posts(
    db: AsyncSession = Depends(dependencies.get_db),
    skip: int = 0,
    limit: int = 100,
    channel: str | None = None
) -> Any:
    """
    Retrieve community posts.
    """
    query = select(models.CommunityPost).order_by(models.CommunityPost.created_at.desc())
    if channel:
        query = query.where(models.CommunityPost.channel == channel)
        
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    posts = result.scalars().all()
    return posts

@router.get("/posts/{post_id}", response_model=CommunityPost)
async def read_post(
    post_id: str,
    db: AsyncSession = Depends(dependencies.get_db)
) -> Any:
    """
    Get a specific post by id.
    """
    result = await db.execute(select(models.CommunityPost).where(models.CommunityPost.id == post_id))
    post = result.scalars().first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.post("/posts/{post_id}/replies", response_model=CommunityReply)
async def create_reply(
    *,
    db: AsyncSession = Depends(dependencies.get_db),
    post_id: str,
    reply_in: CommunityReplyCreate,
    current_user: models.Owner = Depends(dependencies.get_current_owner)
) -> Any:
    """
    Reply to a post.
    """
    # Verify post exists
    post_res = await db.execute(select(models.CommunityPost).where(models.CommunityPost.id == post_id))
    if not post_res.scalars().first():
        raise HTTPException(status_code=404, detail="Post not found")

    reply = models.CommunityReply(
        **reply_in.model_dump(),
        post_id=post_id,
        author_id=current_user.id
    )
    db.add(reply)
    await db.commit()
    await db.refresh(reply)
    return reply

@router.get("/posts/{post_id}/replies", response_model=List[CommunityReply])
async def read_replies(
    post_id: str,
    db: AsyncSession = Depends(dependencies.get_db)
) -> Any:
    """
    Get replies for a post.
    """
    query = select(models.CommunityReply).where(models.CommunityReply.post_id == post_id).order_by(models.CommunityReply.created_at.asc())
    result = await db.execute(query)
    replies = result.scalars().all()
    return replies

@router.post("/reports", response_model=Report)
async def create_report(
    *,
    db: AsyncSession = Depends(dependencies.get_db),
    report_in: ReportCreate,
    current_user: models.Owner = Depends(dependencies.get_current_owner)
) -> Any:
    """
    Report a post or reply for moderation.
    """
    report = models.Report(
        **report_in.model_dump(),
        reporter_id=current_user.id
    )
    db.add(report)
    await db.commit()
    await db.refresh(report)
    return report

@router.get("/preferences", response_model=CommunityPreference)
async def get_preferences(
    db: AsyncSession = Depends(dependencies.get_db),
    current_user: models.Owner = Depends(dependencies.get_current_owner)
) -> Any:
    """
    Get current user's community preferences (interests).
    """
    result = await db.execute(select(models.CommunityPreference).where(models.CommunityPreference.user_id == current_user.id))
    pref = result.scalars().first()
    if not pref:
        # Return a default empty preference instead of 404
        return models.CommunityPreference(user_id=current_user.id, interests=[], id="temp")
    return pref

@router.post("/preferences", response_model=CommunityPreference)
async def update_preferences(
    *,
    db: AsyncSession = Depends(dependencies.get_db),
    pref_in: CommunityPreferenceCreate,
    current_user: models.Owner = Depends(dependencies.get_current_owner)
) -> Any:
    """
    Update or create community preferences.
    """
    result = await db.execute(select(models.CommunityPreference).where(models.CommunityPreference.user_id == current_user.id))
    pref = result.scalars().first()
    
    if pref:
        pref.interests = pref_in.interests
    else:
        pref = models.CommunityPreference(
            user_id=current_user.id,
            interests=pref_in.interests
        )
        db.add(pref)
        
    await db.commit()
    await db.refresh(pref)
    return pref

@router.get("/search", response_model=List[CommunityPost])
async def search_community(
    query: str,
    db: AsyncSession = Depends(dependencies.get_db)
) -> Any:
    """
    Search community posts.
    """
    # Simple ILIKE search for functional completeness
    stmt = select(models.CommunityPost).where(
        models.CommunityPost.title.ilike(f"%{query}%") |
        models.CommunityPost.content.ilike(f"%{query}%")
    ).order_by(models.CommunityPost.created_at.desc())
    
    result = await db.execute(stmt)
    posts = result.scalars().all()
    return posts
