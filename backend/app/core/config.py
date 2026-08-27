from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    app_name: str = "Indian Standards Recommendation Engine"

    database_url: str = ""

    ai_api_key: str = ""

    class Config:
        env_file = ".env"


settings = Settings()