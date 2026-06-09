from fastapi import APIRouter

from app.models.request_models import (
    FlashcardRequest
)

from app.models.response_models import (
    FlashcardResponse
)

from app.services.flashcard_service import (
    flashcard_service
)

router = APIRouter(
    prefix="/flashcards",
    tags=["Flashcards"]
)


@router.post(
    "/",
    response_model=FlashcardResponse
)
async def generate_flashcards(
    request: FlashcardRequest
):

    result = await (
        flashcard_service.generate_flashcards(
            request.document_id,
            request.topic
        )
    )

    return FlashcardResponse(**result)