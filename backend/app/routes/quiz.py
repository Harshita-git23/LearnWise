from fastapi import APIRouter

from app.models.request_models import QuizRequest
from app.models.response_models import QuizResponse

from app.services.quiz_service import (
    quiz_service
)

router = APIRouter(
    prefix="/quiz",
    tags=["Quiz"]
)


@router.post(
    "/",
    response_model=QuizResponse
)
async def generate_quiz(
    request: QuizRequest
):

    result = await (
        quiz_service.generate_quiz(
            document_id=request.document_id,
            topic=request.topic,
            difficulty=request.difficulty,
            num_questions=request.num_questions
        )
    )

    return QuizResponse(**result)