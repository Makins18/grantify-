import io
from pypdf import PdfReader
from docx import Document
import logging

logger = logging.getLogger("DocumentProcessor")

class DocumentProcessor:
    @staticmethod
    def extract_text(file_content: bytes, filename: str) -> str:
        """
        Extracts text from PDF or DOCX files.
        """
        extension = filename.split(".")[-1].lower()
        
        try:
            if extension == "pdf":
                return DocumentProcessor._extract_from_pdf(file_content)
            elif extension == "docx":
                return DocumentProcessor._extract_from_docx(file_content)
            elif extension in ["txt", "md"]:
                return file_content.decode("utf-8")
            else:
                raise ValueError(f"Unsupported file extension: {extension}")
        except Exception as e:
            logger.error(f"Error extracting text from {filename}: {e}")
            raise

    @staticmethod
    def _extract_from_pdf(file_content: bytes) -> str:
        reader = PdfReader(io.BytesIO(file_content))
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()

    @staticmethod
    def _extract_from_docx(file_content: bytes) -> str:
        doc = Document(io.BytesIO(file_content))
        text = ""
        for para in doc.paragraphs:
            text += para.text + "\n"
        return text.strip()
