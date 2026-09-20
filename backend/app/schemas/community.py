from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class CommunityPostBase(BaseModel):
    channel: str
    title: str
    content: str
    associated_alert_id: Optional[str] = None

class CommunityPostCreate(CommunityPostBase):
    pass

class CommunityPost(CommunityPostBase):
    id: str
    author_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CommunityReplyBase(BaseModel):
    content: str

class CommunityReplyCreate(CommunityReplyBase):
    pass

class CommunityReply(CommunityReplyBase):
    id: str
    post_id: str
    author_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class ReportBase(BaseModel):
    post_id: Optional[str] = None
    reply_id: Optional[str] = None
    reason: str

class ReportCreate(ReportBase):
    pass

class Report(ReportBase):
    id: str
    reporter_id: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class Notification(BaseModel):
    id: str
    user_id: str
    type: str
    title: str
    content: str
    read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class CommunityPreferenceBase(BaseModel):
    interests: List[str]

class CommunityPreferenceCreate(CommunityPreferenceBase):
    pass

class CommunityPreference(CommunityPreferenceBase):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class RecoveryTaskBase(BaseModel):
    task_type: str
    description: str
    status: Optional[str] = "open"

class RecoveryTaskCreate(RecoveryTaskBase):
    pass

class RecoveryTask(RecoveryTaskBase):
    id: str
    alert_id: str
    assignee_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
