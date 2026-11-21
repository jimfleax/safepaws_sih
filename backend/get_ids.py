import asyncio
import sys

sys.path.append('.')
from sqlalchemy import text

from app.db.session import async_session_maker


async def main():
    async with async_session_maker() as s:
        p = await s.execute(text('SELECT qr_tag_id FROM pets WHERE qr_tag_id IS NOT NULL LIMIT 1'))
        post = await s.execute(text('SELECT id FROM community_posts LIMIT 1'))
        print(f"TAG_ID:{p.scalar()}")
        print(f"POST_ID:{post.scalar()}")

asyncio.run(main())
