from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings

from app.routes.chat import router as chat_router
from app.routes.quiz import router as quiz_router
from app.routes.flashcards import router as flashcard_router
from app.routes.diagrams import router as diagram_router
from app.routes.upload import router as upload_router


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(quiz_router)
app.include_router(flashcard_router)
app.include_router(diagram_router)
app.include_router(upload_router)


@app.get("/")
async def root():

    return {
        "message": "AI Study Copilot Running"
    }


@app.get("/health")
async def health():

    return {
        "status": "healthy"
    }