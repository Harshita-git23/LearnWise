from fastapi import APIRouter

from app.models.request_models import (
    DiagramRequest
)

from app.models.response_models import (
    DiagramResponse
)

from app.services.diagram_service import (
    diagram_service
)

router = APIRouter(
    prefix="/diagrams",
    tags=["Diagrams"]
)


@router.post(
    "/",
    response_model=DiagramResponse
)
async def generate_diagram(
    request: DiagramRequest
):

    mermaid = await (
        diagram_service.generate_diagram(
            request.document_id,
            request.topic
        )
    )

    return DiagramResponse(
        mermaid_code=mermaid
    )