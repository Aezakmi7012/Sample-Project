"""Configuration settings for the retrieval pipeline."""

import os

CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "300"))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "50"))
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "BAAI/bge-small-en-v1.5")
RERANKER_MODEL = os.getenv("RERANKER_MODEL", "BAAI/bge-reranker-base")
CHROMA_DIR = os.getenv("CHROMA_DIR", "./chroma_store")
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "generic_docs")
TOP_K = int(os.getenv("TOP_K", "6"))
TOP_N = int(os.getenv("TOP_N", "3"))
DEVICE = os.getenv("DEVICE", "cpu")
