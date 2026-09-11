from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "SafePaws API"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/safepaws"
    DEBUG: bool = True
    FAISS_INDEX_PATH: str = "faiss_index.bin"
    EMBEDDING_DIMENSION: int = 128

    # Biometric Decision Thresholds
    # PROVISIONAL: These values (0.85/0.70) are strictly uncalibrated placeholders for M0 development.
    # They DO NOT correspond to any verified FAR/FRR/EER metrics.
    # Final production thresholds MUST be calibrated by Panel 7 using an appropriate 
    # real biometric evaluation protocol.
    MATCH_THRESHOLD: float = 0.85
    AMBIGUOUS_THRESHOLD: float = 0.70

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
