"""Retrieval and reranking pipeline definition module."""

from langchain_chroma import Chroma
from langchain_classic.retrievers import ContextualCompressionRetriever
from langchain_classic.retrievers.document_compressors import CrossEncoderReranker
from langchain_community.cross_encoders import HuggingFaceCrossEncoder
from loguru import logger

from retrieval_pipeline.config import DEVICE, RERANKER_MODEL, TOP_K, TOP_N


def build_pipeline(
    vectorstore: Chroma,
    reranker_model: str = RERANKER_MODEL,
    top_k: int = TOP_K,
    top_n: int = TOP_N,
    device: str = DEVICE,
) -> tuple[object, ContextualCompressionRetriever, HuggingFaceCrossEncoder]:
    """Assemble the bi-encoder retriever and the cross-encoder reranker."""
    base_retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": top_k},
    )

    cross_encoder = HuggingFaceCrossEncoder(
        model_name=reranker_model,
        model_kwargs={"device": device},
    )

    compressor = CrossEncoderReranker(model=cross_encoder, top_n=top_n)
    compression_retriever = ContextualCompressionRetriever(
        base_compressor=compressor,
        base_retriever=base_retriever,
    )

    logger.info(f"Pipeline: bi-encoder top-{top_k} → cross-encoder rerank → top-{top_n}")
    return base_retriever, compression_retriever, cross_encoder
