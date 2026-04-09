"""Output formatting and terminal display functions."""

import textwrap

from retrieval_pipeline.config import TOP_K, TOP_N


def display_retriever_results(query, base_retriever, cross_encoder, top_k=TOP_K, width=80):
    """Show raw bi-encoder results WITH their cross-encoder scores attached."""
    raw_docs = base_retriever.invoke(query)
    pairs = [(query, doc.page_content) for doc in raw_docs]
    scores = cross_encoder.score(pairs)

    print(f"\n{'='*width}")
    print(f"  [BI-ENCODER] Top-{top_k} by cosine similarity  |  QUERY: {query}")
    print(f"{'='*width}")

    for i, (doc, score) in enumerate(zip(raw_docs, scores, strict=False), 1):
        source = doc.metadata.get("source", "unknown")
        print(f"\n  [{i}] cross_score={score:.4f} (retrieval rank #{i}) | source={source}")
        print("  " + "-" * (width - 2))
        print(
            textwrap.fill(
                doc.page_content.strip(),
                width=width,
                initial_indent="  ",
                subsequent_indent="  ",
            )
        )
    print()


def display_reranker_results(query, compression_retriever, cross_encoder, top_n=TOP_N, width=80):
    """Show cross-encoder reranked results, sorted by reranker score."""
    reranked_docs = compression_retriever.invoke(query)
    pairs = [(query, doc.page_content) for doc in reranked_docs]
    scores = cross_encoder.score(pairs)
    ranked = sorted(zip(scores, reranked_docs, strict=False), key=lambda x: x[0], reverse=True)

    print(f"\n{'='*width}")
    print(f"  [RERANKER]   Top-{top_n} after cross-encoder rerank  |  QUERY: {query}")
    print(f"{'='*width}")

    for i, (score, doc) in enumerate(ranked, 1):
        source = doc.metadata.get("source", "unknown")
        print(f"\n  [{i}] reranker_score={score:.4f} | source={source}")
        print("  " + "-" * (width - 2))
        print(
            textwrap.fill(
                doc.page_content.strip(),
                width=width,
                initial_indent="  ",
                subsequent_indent="  ",
            )
        )
    print()


def compare_and_display(
    query,
    base_retriever,
    compression_retriever,
    cross_encoder,
    top_k=TOP_K,
    top_n=TOP_N,
    width=80,
):
    """Run BOTH retrievers and print them side-by-side."""
    print(f"\n{'#'*width}")
    print(f"  QUERY: {query}")
    print(f"{'#'*width}")
    display_retriever_results(query, base_retriever, cross_encoder, top_k, width)
    display_reranker_results(query, compression_retriever, cross_encoder, top_n, width)
