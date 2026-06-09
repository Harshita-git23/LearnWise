from pydantic import BaseModel


class ChatRequest(BaseModel):
    document_id: str
    question: str
    history: list = []

class QuizRequest(BaseModel):
    document_id: str
    topic: str
    difficulty: str
    num_questions: int


class FlashcardRequest(BaseModel):
    document_id: str
    topic: str


class DiagramRequest(BaseModel):
    document_id: str
    topic: str

class UploadResponse(BaseModel):
    document_id: str
    filename: str
    chunks: int