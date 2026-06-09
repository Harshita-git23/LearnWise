import os
import pickle

import faiss
import numpy as np


class VectorStore:

    BASE_DIR = "storage/documents"

    def __init__(self, document_id: str):

        self.document_id = document_id

        self.doc_dir = os.path.join(
            self.BASE_DIR,
            document_id
        )

        os.makedirs(
            self.doc_dir,
            exist_ok=True
        )

        self.index_path = os.path.join(
            self.doc_dir,
            "index.faiss"
        )

        self.chunk_path = os.path.join(
            self.doc_dir,
            "chunks.pkl"
        )

        self.index = None
        self.chunks = []

    def build(
        self,
        embeddings,
        chunks
    ):

        embeddings = np.array(
            embeddings,
            dtype="float32"
        )

        faiss.normalize_L2(
            embeddings
        )

        dimension = embeddings.shape[1]

        self.index = faiss.IndexFlatIP(
            dimension
        )

        self.index.add(
            embeddings
        )

        self.chunks = chunks

        self.save()

    def search(
        self,
        query_embedding,
        top_k=5
    ):

        if self.index is None:
            return []

        query_embedding = np.array(
            [query_embedding],
            dtype="float32"
        )

        faiss.normalize_L2(
            query_embedding
        )

        scores, indices = self.index.search(
            query_embedding,
            top_k
        )

        results = []

        for idx in indices[0]:

            if idx < len(self.chunks):

                results.append(
                    self.chunks[idx]
                )

        return results

    def save(self):

        if self.index is None:
            return

        faiss.write_index(
            self.index,
            self.index_path
        )

        with open(
            self.chunk_path,
            "wb"
        ) as file:

            pickle.dump(
                self.chunks,
                file
            )

    def load(self):

        if (
            not os.path.exists(self.index_path)
            or
            not os.path.exists(self.chunk_path)
        ):
            return False

        self.index = faiss.read_index(
            self.index_path
        )

        with open(
            self.chunk_path,
            "rb"
        ) as file:

            self.chunks = pickle.load(
                file
            )

        return True