from fastapi import APIRouter

from app.models.request_models import ChatRequest
from app.models.response_models import ChatResponse

from app.services.rag_service import rag_service

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


@router.post(
    "/",
    response_model=ChatResponse
)
async def chat(
    request: ChatRequest
):

    result = await rag_service.chat(
        request.document_id,
        request.question,
        request.history
    )

    return ChatResponse(**result)