with open('app/api/v1/endpoints/community.py', 'a') as f:
    f.write("""
@router.post("/tasks", response_model=RecoveryTask)
async def create_recovery_task(
    *,
    db: AsyncSession = Depends(dependencies.get_db),
    task_in: RecoveryTaskCreate,
    alert_id: str,
    current_user: models.Owner = Depends(dependencies.get_current_owner)
) -> Any:
    \"\"\"Create a recovery task for an alert.\"\"\"
    task = models.RecoveryTask(
        **task_in.model_dump(),
        alert_id=alert_id
    )
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task

@router.get("/tasks/{alert_id}", response_model=List[RecoveryTask])
async def get_recovery_tasks(
    alert_id: str,
    db: AsyncSession = Depends(dependencies.get_db)
) -> Any:
    \"\"\"Get recovery tasks for an alert.\"\"\"
    query = select(models.RecoveryTask).where(models.RecoveryTask.alert_id == alert_id)
    result = await db.execute(query)
    return result.scalars().all()
""")
