"""Main orchestrator for the retrieval and reranking pipeline."""

from langchain_community.vectorstores.utils import filter_complex_metadata
from loguru import logger

from retrieval_pipeline.config import (
    CHROMA_DIR,
    CHUNK_OVERLAP,
    CHUNK_SIZE,
    COLLECTION_NAME,
    DEVICE,
    EMBEDDING_MODEL,
    RERANKER_MODEL,
    TOP_K,
    TOP_N,
)
from retrieval_pipeline.display import (
    compare_and_display,
    display_reranker_results,
    display_retriever_results,
)
from retrieval_pipeline.loaders import load_directory, load_source
from retrieval_pipeline.pipeline import build_pipeline
from retrieval_pipeline.splitters import split_documents
from retrieval_pipeline.vectorstore import build_vectorstore


def run_pipeline(
    source,
    queries: list[str],
    is_directory: bool = False,
    extensions: list[str] = None,
    json_jq_schema: str = ".",
    sql_query: str = "SELECT * FROM documents",
    chunk_size: int = CHUNK_SIZE,
    chunk_overlap: int = CHUNK_OVERLAP,
    embedding_model: str = EMBEDDING_MODEL,
    reranker_model: str = RERANKER_MODEL,
    chroma_dir: str = CHROMA_DIR,
    collection_name: str = COLLECTION_NAME,
    top_k: int = TOP_K,
    top_n: int = TOP_N,
    device: str = DEVICE,
    show: str = "both",
):
    """Execute the end-to-end document loading, chunking, and querying process."""
    logger.info("Step 1: Loading documents")
    if is_directory:
        docs = load_directory(
            source,
            extensions=extensions,
            json_jq_schema=json_jq_schema,
            sql_query=sql_query,
        )
    else:
        docs = load_source(source, json_jq_schema=json_jq_schema, sql_query=sql_query)

    logger.info("Step 2: Splitting")
    chunks = split_documents(docs, chunk_size, chunk_overlap)

    logger.info("Step 3: Embedding & vector store")
    clean_chunks = filter_complex_metadata(chunks)
    vectorstore, _ = build_vectorstore(
        clean_chunks, embedding_model, chroma_dir, collection_name, device
    )

    logger.info("Step 4: Building retrieval pipeline")
    base_retriever, compression_retriever, cross_encoder = build_pipeline(
        vectorstore, reranker_model, top_k, top_n, device
    )

    logger.info("Step 5: Querying")
    for q in queries:
        if show == "retriever":
            print(f"\n{'#'*80}\n  QUERY: {q}\n{'#'*80}")
            display_retriever_results(q, base_retriever, cross_encoder, top_k)
        elif show == "reranker":
            print(f"\n{'#'*80}\n  QUERY: {q}\n{'#'*80}")
            display_reranker_results(q, compression_retriever, cross_encoder, top_n)
        else:
            compare_and_display(
                q, base_retriever, compression_retriever, cross_encoder, top_k, top_n
            )

    return base_retriever, compression_retriever, cross_encoder


if __name__ == "__main__":
    logger.info("Pipeline ready. Uncomment examples inside main.py to execute.")

    # Example PDF Pipeline:
    base_ret, rerank_ret, ce = run_pipeline(
        source="/workspaces/Sample-Project/data/data.csv",
        queries=["What is the average age?"],
        show="reranker",
    )
