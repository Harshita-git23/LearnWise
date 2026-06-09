from pydantic import BaseModel
from typing import List


class ChatResponse(BaseModel):
    answer: str


class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    answer: str


class QuizResponse(BaseModel):
    quiz: List[QuizQuestion]


class Flashcard(BaseModel):
    question: str
    answer: str


class FlashcardResponse(BaseModel):
    flashcards: List[Flashcard]


class DiagramResponse(BaseModel):
    mermaid_code: str

class UploadResponse(BaseModel):
    document_id: str
    filename: str
    chunks: int