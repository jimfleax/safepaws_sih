from fastapi import APIRouter

from app.api.v1.endpoints import pets, search, sightings, health, alerts, community

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(pets.router, prefix="/pets", tags=["pets"])
api_router.include_router(search.router, prefix="/pets", tags=["search"])
api_router.include_router(sightings.router, prefix="/sightings", tags=["sightings"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
api_router.include_router(community.router, prefix="/community", tags=["community"])
