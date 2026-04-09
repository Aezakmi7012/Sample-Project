"""Vector store management module."""

from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings
from loguru import logger

from retrieval_pipeline.config import (
    CHROMA_DIR,
    COLLECTION_NAME,
    DEVICE,
    EMBEDDING_MODEL,
)


def build_vectorstore(
    chunks: list[Document],
    embedding_model: str = EMBEDDING_MODEL,
    chroma_dir: str = CHROMA_DIR,
    collection_name: str = COLLECTION_NAME,
    device: str = DEVICE,
) -> tuple[Chroma, HuggingFaceEmbeddings]:
    """Build or load the Chroma vector database."""
    embeddings = HuggingFaceEmbeddings(
        model_name=embedding_model,
        model_kwargs={"device": device},
        encode_kwargs={"normalize_embeddings": True, "batch_size": 32},
    )

    # Optional test for dimension logging
    test_embed = embeddings.embed_query("test")
    logger.info(f"Embedding model: {embedding_model} | dim: {len(test_embed)}")

    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        collection_name=collection_name,
        persist_directory=chroma_dir,
    )

    logger.info(f"Vector store ready: {vectorstore._collection.count()} vectors stored.")
    return vectorstore, embeddings
