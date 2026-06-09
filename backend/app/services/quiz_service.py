from fastapi import HTTPException

from app.services.llm_service import (
    llm_service
)

from app.services.embedding_service import (
    embedding_service
)

from app.utils.json_parser import (
    parse_json_response
)

from app.db.database import (
    VectorStore
)


class QuizService:

    async def generate_quiz(
        self,
        document_id: str,
        topic: str,
        difficulty: str,
        num_questions: int
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
Generate exactly {num_questions} MCQs.

Topic: {topic}
Difficulty: {difficulty}

Use ONLY the provided context.

Context:
{context}

Return ONLY valid JSON.
Do not include markdown.
Do not include explanations.

Format:
{{
  "quiz":[
    {{
      "question":"",
      "options":["","","",""],
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
                "quiz": []
            }


quiz_service = QuizService()