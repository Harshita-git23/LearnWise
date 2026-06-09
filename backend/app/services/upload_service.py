import os
import shutil
import uuid

from fastapi import UploadFile

from app.services.rag_service import (
    rag_service
)


class UploadService:

    UPLOAD_DIR = "uploads"

    def __init__(self):

        os.makedirs(
            self.UPLOAD_DIR,
            exist_ok=True
        )

    async def upload_pdf(
        self,
        file: UploadFile
    ):

        if not file.filename:

            raise ValueError(
                "Invalid filename"
            )

        if not file.filename.lower().endswith(
            ".pdf"
        ):

            raise ValueError(
                "Only PDF files are allowed"
            )

        document_id = str(
            uuid.uuid4()
        )

        file_path = os.path.join(
            self.UPLOAD_DIR,
            f"{document_id}.pdf"
        )

        with open(
            file_path,
            "wb"
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

        chunks = await (
            rag_service.ingest_pdf(
                document_id,
                file_path
            )
        )

        return {
            "document_id": document_id,
            "filename": file.filename,
            "chunks": chunks
        }


upload_service = UploadService()