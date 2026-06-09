from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "AI Study Copilot"
    
    GEMINI_API_KEY: str = ""

    EMBEDDING_MODEL: str = "text-embedding-3-small"
    LLM_MODEL: str = "llama-3.3-70b-versatile"

    FAISS_INDEX_PATH: str = "faiss_index"

    class Config:
        env_file = ".env"


settings = Settings()