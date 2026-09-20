with open('app/api/v1/endpoints/community.py', 'a') as f:
    f.write("""
@router.get("/notifications", response_model=List[Notification])
async def get_notifications(
    db: AsyncSession = Depends(dependencies.get_db),
    current_user: models.Owner = Depends(dependencies.get_current_owner)
) -> Any:
    \"\"\"Get current user's notifications.\"\"\"
    query = select(models.Notification).where(
        models.Notification.user_id == current_user.id
    ).order_by(models.Notification.created_at.desc()).limit(50)
    result = await db.execute(query)
    return result.scalars().all()

@router.patch("/notifications/{notification_id}/read", response_model=Notification)
async def mark_notification_read(
    notification_id: str,
    db: AsyncSession = Depends(dependencies.get_db),
    current_user: models.Owner = Depends(dependencies.get_current_owner)
) -> Any:
    \"\"\"Mark a notification as read.\"\"\"
    result = await db.execute(select(models.Notification).where(
        models.Notification.id == notification_id,
        models.Notification.user_id == current_user.id
    ))
    notif = result.scalars().first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.read = True
    await db.commit()
    await db.refresh(notif)
    return notif
""")
