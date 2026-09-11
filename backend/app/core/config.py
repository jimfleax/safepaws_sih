from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "SafePaws API"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/safepaws"
    DEBUG: bool = True
    FAISS_INDEX_PATH: str = "faiss_index.bin"
    EMBEDDING_DIMENSION: int = 128

    # Biometric Decision Thresholds (Configurable)
    MATCH_THRESHOLD: float = 0.85
    AMBIGUOUS_THRESHOLD: float = 0.70

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
