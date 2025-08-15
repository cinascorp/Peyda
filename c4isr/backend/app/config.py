import os
from dotenv import load_dotenv

load_dotenv()

OPEN_SKY_USERNAME = os.getenv("OPEN_SKY_USERNAME")
OPEN_SKY_PASSWORD = os.getenv("OPEN_SKY_PASSWORD")
BACKEND_CORS_ORIGINS = os.getenv("BACKEND_CORS_ORIGINS", "*").split(",")
REQUEST_TIMEOUT_SECONDS = float(os.getenv("REQUEST_TIMEOUT_SECONDS", "8"))
CACHE_TTL_SECONDS = int(os.getenv("CACHE_TTL_SECONDS", "5"))