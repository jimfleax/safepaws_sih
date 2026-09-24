from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "SafePaws API"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/safepaws"
    # Set USE_SQLITE_DEV=true in .env to run without PostgreSQL (local development only)
    USE_SQLITE_DEV: bool = False
    SQLITE_URL: str = "sqlite+aiosqlite:///./safepaws_dev.db"
    DEBUG: bool = True
    FAISS_INDEX_PATH: str = "faiss_index.bin"
    EMBEDDING_DIMENSION: int = 1280

    # Biometric Decision Thresholds
    # PROVISIONAL: These values (0.85/0.70) are strictly uncalibrated placeholders for M0 development.
    # They DO NOT correspond to any verified FAR/FRR/EER metrics.
    # Final production thresholds MUST be calibrated by Panel 7 using an appropriate 
    # real biometric evaluation protocol.
    MATCH_THRESHOLD: float = 0.85
    AMBIGUOUS_THRESHOLD: float = 0.70

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def effective_database_url(self) -> str:
        """Returns SQLite URL in dev mode, Postgres URL in production."""
        if self.USE_SQLITE_DEV:
            return self.SQLITE_URL
        return self.DATABASE_URL

settings = Settings()
