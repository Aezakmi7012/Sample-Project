"""Document splitting and chunking module."""

from langchain_core.documents import Document
from langchain_text_splitters import (
    MarkdownTextSplitter,
    RecursiveCharacterTextSplitter,
)
from loguru import logger

from retrieval_pipeline.config import CHUNK_OVERLAP, CHUNK_SIZE


def split_documents(
    docs: list[Document],
    chunk_size: int = CHUNK_SIZE,
    chunk_overlap: int = CHUNK_OVERLAP,
) -> list[Document]:
    """Split documents based on their type."""
    md_docs = [d for d in docs if d.metadata.get("source", "").endswith(".md")]
    other_docs = [d for d in docs if not d.metadata.get("source", "").endswith(".md")]

    chunks = []

    if md_docs:
        splitter = MarkdownTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
        chunks.extend(splitter.split_documents(md_docs))

    if other_docs:
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size, chunk_overlap=chunk_overlap
        )
        chunks.extend(splitter.split_documents(other_docs))

    logger.info(f"Total chunks after splitting: {len(chunks)}")
    return chunks
