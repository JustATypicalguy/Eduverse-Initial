import os
import pickle
import numpy as np
from dotenv import load_dotenv
from google import genai
from google.genai import types
import tiktoken

# Extra imports for PDFs and CSVs
import PyPDF2
import pandas as pd

# -----------------------
# Config / client
# -----------------------
load_dotenv()
client = genai.Client()  # will read GEMINI_API_KEY from .env

# -----------------------
# Settings
# -----------------------
LESSONS_DIR = "lessons"
EMBED_MODEL = "gemini-embedding-001"
CHUNK_TOKEN_SIZE = 500
OVERLAP_TOKENS = 50
BATCH_SIZE = 50
OUTPUT_EMB_FILE = "embeddings.npy"
OUTPUT_META_FILE = "metadata.pkl"

# Tokenizer
enc = tiktoken.get_encoding("cl100k_base")

# -----------------------
# Helpers
# -----------------------
def chunk_text(text, chunk_size=CHUNK_TOKEN_SIZE, overlap=OVERLAP_TOKENS):
    toks = enc.encode(text)
    chunks = []
    i = 0
    L = len(toks)
    while i < L:
        j = min(i + chunk_size, L)
        chunk = enc.decode(toks[i:j])
        chunks.append(chunk)
        next_i = j - overlap
        if next_i <= i:
            next_i = j
        i = next_i
    return chunks

def read_txt(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read().strip()

def read_pdf(file_path):
    text = ""
    with open(file_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            text += page.extract_text() + "\n"
    return text.strip()

def read_csv(file_path):
    df = pd.read_csv(file_path)
    # Join all text columns into a single string per row
    texts = []
    for idx, row in df.iterrows():
        row_text = " ".join([str(v) for v in row.values if pd.notna(v)])
        if row_text:
            texts.append(row_text)
    return "\n".join(texts).strip()

def read_lessons(lessons_dir=LESSONS_DIR):
    items = []
    if not os.path.isdir(lessons_dir):
        raise FileNotFoundError(f"Lessons directory not found: {lessons_dir}")
    for fname in sorted(os.listdir(lessons_dir)):
        path = os.path.join(lessons_dir, fname)
        text = ""
        try:
            if fname.lower().endswith(".txt"):
                text = read_txt(path)
            elif fname.lower().endswith(".pdf"):
                text = read_pdf(path)
            elif fname.lower().endswith(".csv"):
                text = read_csv(path)
            else:
                print(f"Skipping unsupported file type: {fname}")
                continue
        except Exception as e:
            print(f"Failed to read {fname}: {e}")
            continue

        if text:
            items.append((fname, text))
    return items

def create_embeddings(all_texts, model=EMBED_MODEL, batch_size=BATCH_SIZE):
    vectors = []
    for i in range(0, len(all_texts), batch_size):
        batch = all_texts[i:i+batch_size]
        resp = client.models.embed_content(
            model=model,
            contents=[types.Part(text=t) for t in batch],
            config=types.EmbedContentConfig(task_type="RETRIEVAL_DOCUMENT")
        )
        for emb_obj in resp.embeddings:
            vectors.append(np.array(emb_obj.values, dtype=np.float32))
        print(f"  embedded batch {i//batch_size + 1} / {((len(all_texts)-1)//batch_size)+1}")
    return np.vstack(vectors)

# -----------------------
# Main build
# -----------------------
def build_index():
    lessons = read_lessons()
    if not lessons:
        print("No lessons found. Add .txt, .pdf, or .csv files to the lessons/ folder and rerun.")
        return

    all_texts = []
    metadata = []
    id_counter = 0
    for fname, text in lessons:
        chunks = chunk_text(text)
        for idx, chunk in enumerate(chunks):
            all_texts.append(chunk)
            metadata.append({
                "id": id_counter,
                "source": fname,
                "chunk_index": idx,
                "text": chunk
            })
            id_counter += 1

    print(f"Total chunks to embed: {len(all_texts)}")

    embeddings = create_embeddings(all_texts, model=EMBED_MODEL, batch_size=BATCH_SIZE)

    # Save embeddings & metadata
    np.save(OUTPUT_EMB_FILE, embeddings)
    with open(OUTPUT_META_FILE, "wb") as f:
        pickle.dump(metadata, f)

    print(f"Saved {OUTPUT_EMB_FILE} and {OUTPUT_META_FILE}")

# -----------------------
# Run
# -----------------------
if __name__ == "__main__":
    build_index()
