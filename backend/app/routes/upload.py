from fastapi import APIRouter
from fastapi import File
from fastapi import UploadFile
from fastapi import HTTPException

from app.services.upload_service import (
    upload_service
)

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)


@router.post("/")
async def upload_pdf(
    file: UploadFile = File(...)
):

    try:

        return await (
            upload_service.upload_pdf(
                file
            )
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )