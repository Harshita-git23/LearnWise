import fitz
import re

from app.services.embedding_service import (
    embedding_service
)

from app.services.llm_service import (
    llm_service
)

from app.db.database import (
    VectorStore
)


class RAGService:

    def __init__(self):
        pass

    def load_pdf(
        self,
        path: str
    ) -> str:

        doc = fitz.open(path)

        return "\n".join(
            page.get_text()
            for page in doc
        )

    def chunk_text(
        self,
        text: str,
        chunk_size: int = 600,
        overlap: int = 80
    ):

        sentences = re.split(
            r'(?<=[.!?])\s+',
            text.strip()
        )

        chunks = []
        current = []
        current_len = 0

        for sent in sentences:

            sent_len = len(sent)

            if (
                current_len + sent_len > chunk_size
                and current
            ):

                chunks.append(
                    " ".join(current)
                )

                overlap_sents = []
                overlap_count = 0

                for s in reversed(current):

                    if (
                        overlap_count + len(s)
                        > overlap
                    ):
                        break

                    overlap_sents.insert(
                        0,
                        s
                    )

                    overlap_count += len(s)

                current = overlap_sents
                current_len = overlap_count

            current.append(sent)
            current_len += sent_len

        if current:

            chunks.append(
                " ".join(current)
            )

        return chunks

    async def ingest_pdf(
        self,
        document_id: str,
        pdf_path: str
    ):

        text = self.load_pdf(
            pdf_path
        )

        chunks = self.chunk_text(
            text
        )

        embeddings = (
            embedding_service.embed(
                chunks
            )
        )

        vector_store = VectorStore(
            document_id
        )

        vector_store.build(
            embeddings,
            chunks
        )

        return len(chunks)

    async def chat(
        self,
        document_id: str,
        question: str,
        history: list = None
    ):

        vector_store = VectorStore(
            document_id
        )

        loaded = (
            vector_store.load()
        )

        if not loaded:

            return {
                "answer": "Document not found.",
                "sources": []
            }

        query_embedding = (
            embedding_service.embed(
                [question]
            )[0]
        )

        relevant_chunks = (
            vector_store.search(
                query_embedding,
                top_k=5
            )
        )

        context = "\n\n".join(
            relevant_chunks
        )

        history_text = ""

        if history:

            history_text = "\n".join(
                [
                    f"{msg['role']}: {msg['text']}"
                    for msg in history[-6:]
                ]
            )

        prompt = f"""
You are a study assistant.

Use the document context and the conversation history.

Rules:
- Use conversation history to understand follow-up questions.
- Use the document context as the source of truth.
- Do NOT repeat context.
- Return only the answer.
- If information is not present in the document say:
  "I could not find that information in the uploaded document."

Conversation History:
{history_text}

Context:
{context}

Current Question:
{question}

Answer:
"""

        answer = await llm_service.generate(
            prompt
        )

        return {
            "answer": answer,
        }


rag_service = RAGService()