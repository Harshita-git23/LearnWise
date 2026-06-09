from app.services.llm_service import (
    llm_service
)
from fastapi import HTTPException

from app.services.embedding_service import (
    embedding_service
)
from app.utils.json_parser import (
    parse_json_response
)

from app.db.database import (
    VectorStore
)


class FlashcardService:

    async def generate_flashcards(
        self,
        document_id: str,
        topic: str
    ):

        vector_store = VectorStore(
            document_id
        )

        if not vector_store.load():

            raise HTTPException(
                status_code=404,
                detail="Document not found."
            )

        query_embedding = (
            embedding_service.embed(
                [topic]
            )[0]
        )

        relevant_chunks = (
            vector_store.search(
                query_embedding,
                top_k=8
            )
        )

        context = "\n\n".join(
            relevant_chunks
        )

        prompt = f"""
Generate flashcards from the context.

Topic:
{topic}

Context:
{context}

Rules:
- Use ONLY the provided context.
- Generate concise study flashcards.
- Return ONLY valid JSON.
- No markdown.
- No explanations.

Format:

{{
  "flashcards":[
    {{
      "question":"",
      "answer":""
    }}
  ]
}}
"""

        response = await (
            llm_service.generate(
                prompt
            )
        )

        try:

            return parse_json_response(
                response
            )

        except Exception:

            return {
                "flashcards": []
            }


flashcard_service = FlashcardService()