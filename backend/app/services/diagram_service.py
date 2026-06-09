from fastapi import HTTPException

from app.services.llm_service import (
    llm_service
)

from app.services.embedding_service import (
    embedding_service
)

from app.db.database import (
    VectorStore
)


class DiagramService:

    async def generate_diagram(
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
Generate a Mermaid flowchart.

Topic:
{topic}

Context:
{context}

STRICT RULES:

- Start with graph TD
- Use IDs like A,B,C,D
- Use labels inside []
- Labels must contain only letters, numbers and spaces
- No colons
- No semicolons
- No parentheses
- No quotes
- No markdown

Example:

graph TD
A[Operating System]
A --> B[Process Management]
A --> C[Memory Management]

Return ONLY Mermaid code.
"""

        return await (
            llm_service.generate(
                prompt
            )
        )


diagram_service = DiagramService()