from pathlib import Path


def extract_text(filename: str, data: bytes) -> str:
    suffix = Path(filename).suffix.lower()

    if suffix in {".txt", ".md", ".csv"}:
        return data.decode("utf-8", errors="ignore")

    if suffix == ".pdf":
        from pypdf import PdfReader
        import io
        reader = PdfReader(io.BytesIO(data))
        return "\n".join((page.extract_text() or "") for page in reader.pages)

    if suffix == ".docx":
        from docx import Document
        import io
        document = Document(io.BytesIO(data))
        return "\n".join(p.text for p in document.paragraphs)

    raise ValueError("Unsupported file type. Use PDF, DOCX, TXT, MD or CSV.")
