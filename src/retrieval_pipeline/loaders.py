"""Document loading module."""

from pathlib import Path

import pandas as pd
from langchain_community.document_loaders import (
    CSVLoader,
    JSONLoader,
    SQLDatabaseLoader,
    TextLoader,
    UnstructuredHTMLLoader,
    UnstructuredPowerPointLoader,
    UnstructuredWordDocumentLoader,
    WebBaseLoader,
)
from langchain_community.utilities import SQLDatabase
from langchain_core.documents import Document
from loguru import logger


def load_source(
    source: str | pd.DataFrame | list,
    json_jq_schema: str = ".",
    sql_query: str = "SELECT * FROM documents",
) -> list[Document]:
    """Load documents from various data sources."""
    if isinstance(source, pd.DataFrame):
        docs = []
        for i, row in source.iterrows():
            content = "\n".join(f"{col}: {val}" for col, val in row.items())
            docs.append(Document(page_content=content, metadata={"row": i, "source": "dataframe"}))
        logger.info(f"[DataFrame] {len(docs)} rows loaded.")
        return docs

    if isinstance(source, list):
        docs = [
            Document(page_content=str(item), metadata={"source": f"list[{i}]"})
            for i, item in enumerate(source)
        ]
        logger.info(f"[List] {len(docs)} items loaded.")
        return docs

    if isinstance(source, str) and source.startswith(("http://", "https://")):
        loader = WebBaseLoader(source)
        docs = loader.load()
        logger.info(f"[URL] {len(docs)} page(s) loaded from {source}")
        return docs

    path = Path(source)
    if not path.exists():
        raise FileNotFoundError(f"Source not found: {source}")

    ext = path.suffix.lower()

    if ext in (".txt", ".md"):
        docs = TextLoader(str(path), encoding="utf-8").load()
    elif ext == ".pdf":
        from langchain_docling import DoclingLoader

        logger.info(f"Loading PDF via Docling: {source}")
        loader = DoclingLoader(file_path=str(source))
        docs = loader.load()
    elif ext == ".csv":
        docs = CSVLoader(str(path)).load()
    elif ext == ".json":
        docs = JSONLoader(file_path=str(path), jq_schema=json_jq_schema, text_content=False).load()
    elif ext in (".docx", ".doc"):
        docs = UnstructuredWordDocumentLoader(str(path)).load()
    elif ext in (".pptx", ".ppt"):
        docs = UnstructuredPowerPointLoader(str(path)).load()
    elif ext in (".html", ".htm"):
        docs = UnstructuredHTMLLoader(str(path)).load()
    elif ext in (".db", ".sqlite", ".sqlite3"):
        db = SQLDatabase.from_uri(f"sqlite:///{path}")
        docs = SQLDatabaseLoader(db=db, query=sql_query).load()
    else:
        logger.warning(f"Unknown extension '{ext}' – falling back to TextLoader.")
        docs = TextLoader(str(path), encoding="utf-8").load()

    logger.info(f"[{ext.upper()}] {len(docs)} document(s) loaded from '{path.name}'")
    return docs


def load_directory(
    directory: str,
    extensions: list[str] = None,
    **kwargs,
) -> list[Document]:
    """Recursively load all supported files from a directory."""
    supported = {
        ".txt",
        ".md",
        ".pdf",
        ".csv",
        ".json",
        ".docx",
        ".doc",
        ".pptx",
        ".ppt",
        ".html",
        ".htm",
        ".db",
        ".sqlite",
        ".sqlite3",
    }
    if extensions:
        supported = {e.lower() for e in extensions}

    all_docs: list[Document] = []
    for file in Path(directory).rglob("*"):
        if file.suffix.lower() in supported:
            try:
                all_docs.extend(load_source(str(file), **kwargs))
            except Exception as exc:
                logger.error(f"[SKIP] {file.name}: {exc}")

    logger.info(f"Total documents loaded from directory: {len(all_docs)}")
    return all_docs
