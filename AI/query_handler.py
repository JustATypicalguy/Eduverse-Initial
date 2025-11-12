# query_handler_gemini_teacher_v2.py
import os
import time
import pickle
import numpy as np
from dotenv import load_dotenv
import tiktoken
from typing import List, Dict, Any

from google import genai
from google.genai import types

# ------------- CONFIG -------------
load_dotenv()
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_KEY:
    raise ValueError("GEMINI_API_KEY missing. Put GEMINI_API_KEY=... in .env")

client = genai.Client(api_key=GEMINI_KEY)

EMB_FILE = "embeddings.npy"
META_FILE = "metadata.pkl"
if not (os.path.exists(EMB_FILE) and os.path.exists(META_FILE)):
    raise FileNotFoundError("embeddings.npy or metadata.pkl missing. Run index_builder first.")

embeddings = np.load(EMB_FILE)
with open(META_FILE, "rb") as f:
    metadata = pickle.load(f)

enc = tiktoken.get_encoding("cl100k_base")

EMBED_MODEL = "gemini-embedding-001"
GEN_MODEL = "gemini-2.5-flash"
TOP_K = 3
SIMILARITY_THRESHOLD = 0.06
MAX_RETRIES = 4
BACKOFF_BASE = 1.7

# Quick safety keywords (heuristic). Add as needed; production should use moderation API.
FORBIDDEN_KEYWORDS = [
    "bomb", "explode", "how to kill", "kill ", "suicide", "self-harm", "hard drugs",
    "child sexual", "rape", "porn", "manufacture weapon", "weaponize", "how to make a bomb"
]

# ------------- Session state (in-memory) -------------
session = {
    "last_question": None,
    "last_answer": None,
    "last_used_chunks": None
}

# ------------- UTILITIES -------------
def contains_forbidden_request(text: str) -> bool:
    t = text.lower()
    for kw in FORBIDDEN_KEYWORDS:
        if kw in t:
            return True
    return False

def retry(func, *args, max_tries=MAX_RETRIES, **kwargs):
    delay = 1.0
    for attempt in range(1, max_tries + 1):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            if attempt == max_tries:
                raise
            time.sleep(delay)
            delay *= BACKOFF_BASE

# ------------- EMBEDDING & RETRIEVAL -------------
def embed_query_gemini(text: str) -> np.ndarray:
    resp = client.models.embed_content(
        model=EMBED_MODEL,
        contents=[types.Part(text=text)],
        config=types.EmbedContentConfig(task_type="RETRIEVAL_DOCUMENT")
    )
    if getattr(resp, "embedding", None) and getattr(resp.embedding, "values", None):
        return np.array(resp.embedding.values, dtype=np.float32)
    if getattr(resp, "embeddings", None):
        return np.array(resp.embeddings[0].values, dtype=np.float32)
    raise RuntimeError("Unexpected embedding response")

def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    na = np.linalg.norm(a)
    nb = np.linalg.norm(b)
    if na == 0 or nb == 0:
        return 0.0
    return float(np.dot(a, b) / (na * nb))

def retrieve_top_k(query_emb: np.ndarray, k=TOP_K) -> List[Dict[str,Any]]:
    sims = [cosine_similarity(query_emb, e) for e in embeddings]
    idxs = np.argsort(sims)[::-1][:k]
    results = []
    for i in idxs:
        results.append({
            "score": float(sims[i]),
            "text": metadata[i]["text"],
            "source": metadata[i].get("source"),
            "chunk_index": metadata[i].get("chunk_index")
        })
    return results

# ------------- PROMPT BUILDING -------------
TEACHER_BEHAVIOR = (
    "You are a helpful AI teacher. Primary material is the CONTEXT from lesson files. "
    "If the CONTEXT fully answers the question, answer only from CONTEXT and cite chunk(s) like [Chunk 1]. "
    "If the CONTEXT does not fully answer, you may add a short labeled block 'Outside lessons — additional context:' "
    "using your general knowledge to help the student (max 2 short sentences). Never invent facts and never present outside info as lesson content.\n\n"
    "When the answer exists in CONTEXT, produce labeled sections in order:\n"
    "Answer: 1–3 concise sentences (cite chunk(s)).\n"
    "Simplified: one plain-language sentence rephrasing the answer.\n"
    "Analogy/Example: one short analogy or real-life example.\n"
    "Try this: two quick actionable practice steps the student can do now.\n"
    "Quick check: one short question to test understanding.\n"
    "When the student submits the quick check answer, correct mistakes, explain the correction, and cite chunk(s).\n"
    "If student asks 'I don't understand', re-explain in simpler language with a new example and one quick step.\n"
    "End with: 'Would you like another explanation, an example, or a short quiz?'\n"
)

def build_prompt(chunks: List[Dict[str,Any]], question: str, grounded: bool, reexplain: bool=False) -> str:
    ctxs = []
    for i,c in enumerate(chunks, start=1):
        ctxs.append(f"Chunk {i} (score:{c['score']:.4f}, source:{c.get('source')}, idx:{c.get('chunk_index')}):\n{c['text']}")
    context_block = "\n\n".join(ctxs) if ctxs else "/* no lesson context provided */"

    extra = ""
    if not grounded:
        extra = (
            "\nNOTE: The CONTEXT above does not fully answer the question. "
            "Provide a short labeled block 'Outside lessons — additional context:' with up to 2 short sentences "
            "using your general knowledge to help explain. Keep it distinct from lesson material.\n\n"
        )
    if reexplain:
        extra += "The student requested a simpler re-explanation. Focus on simpler wording, one short example, and one quick practice step.\n\n"

    prompt = (
        f"CONTEXT:\n{context_block}\n\n"
        f"QUESTION:\n{question}\n\n"
        f"{TEACHER_BEHAVIOR}\n"
        f"{extra}"
        "Respond now using the labeled sections requested. Do not invent facts. Keep answers student-friendly and concise.\n"
    )
    return prompt

# ------------- GENERATION -------------
def parse_gen_response(resp) -> str:
    try:
        if getattr(resp, "text", None):
            return resp.text
        if getattr(resp, "output_text", None):
            return resp.output_text
        if getattr(resp, "output", None) and len(resp.output) > 0:
            out0 = resp.output[0]
            if getattr(out0, "content", None) and len(out0.content) > 0 and getattr(out0.content[0], "text", None):
                return out0.content[0].text
        if getattr(resp, "candidates", None) and len(resp.candidates) > 0:
            c = resp.candidates[0]
            if getattr(c, "content", None):
                return c.content
            if getattr(c, "text", None):
                return c.text
    except Exception:
        pass
    return str(resp)

def generate_with_gemini(prompt: str) -> str:
    resp = client.models.generate_content(
        model=GEN_MODEL,
        contents=[types.Part(text=prompt)]
    )
    return parse_gen_response(resp)

# ------------- HIGH-LEVEL FLOW -------------
def produce_answer(question: str, reexplain: bool=False) -> Dict[str,Any]:
    question = question.strip()
    if not question:
        return {"error": "Empty question."}

    if contains_forbidden_request(question):
        return {"error": "I cannot help with that request. It may be unsafe or disallowed."}

    try:
        q_emb = retry(embed_query_gemini, question)
    except Exception as e:
        return {"error": f"Embedding failed: {e}"}

    matches = retrieve_top_k(q_emb, TOP_K)
    grounded = bool(matches and matches[0]["score"] >= SIMILARITY_THRESHOLD)

    # if not grounded, still include best matches as context but allow outside
    prompt = build_prompt(matches if matches else [], question, grounded=grounded, reexplain=reexplain)

    try:
        gen = retry(generate_with_gemini, prompt)
    except Exception as e:
        return {"error": f"Generation failed: {e}", "used_chunks": matches}

    # update session
    session["last_question"] = question
    session["last_answer"] = gen
    session["last_used_chunks"] = matches

    return {"answer_text": gen, "used_chunks": matches, "grounded": grounded}

# ------------- Follow-up helpers -------------
def is_reexplain_query(text: str) -> bool:
    t = text.strip().lower()
    triggers = [
        "i don't understand", "i dont understand", "explain again",
        "can you explain", "simplify", "simpler", "rephrase",
        "another way", "dont understand", "i need help", "i'm lost", "i am lost"
    ]
    return any(tr in t for tr in triggers)

def is_quiz_request(text: str) -> bool:
    t = text.strip().lower()
    return "quiz" in t or "test me" in t or "ask me questions" in t

def is_summary_request(text: str) -> bool:
    t = text.strip().lower()
    return "summary" in t or "summarize" in t

# ------------- CLI -------------
if __name__ == "__main__":
    print("✅ AI Study Teacher. Type 'exit' to quit.")
    print("Ask a question, say 'I don't understand' to re-explain, 'quiz me' for practice, or 'summarize' for a summary.\n")

    while True:
        try:
            user = input("You: ").strip()
        except KeyboardInterrupt:
            print("\nGoodbye.")
            break

        if not user:
            continue
        if user.lower() == "exit":
            print("Goodbye.")
            break

        # safety quick check
        if contains_forbidden_request(user):
            print("Assistant: I cannot help with that request. It may be unsafe. Try a different, lesson-related question.")
            continue

        # follow-ups
        if is_reexplain_query(user):
            if session["last_question"] is None:
                print("Assistant: I don't have a previous question to re-explain. Ask a specific lesson question.")
                continue
            out = produce_answer(session["last_question"], reexplain=True)
        elif is_quiz_request(user):
            # produce quiz based on last_used_chunks or current query
            ctx_chunks = session["last_used_chunks"]
            if not ctx_chunks:
                try:
                    q_emb = retry(embed_query_gemini, user)
                    ctx_chunks = retrieve_top_k(q_emb, TOP_K)
                except Exception:
                    ctx_chunks = []
            quiz_prompt = "CONTEXT:\n"
            for i,c in enumerate(ctx_chunks or [], start=1):
                quiz_prompt += f"Chunk {i}:\n{c['text']}\n\n"
            quiz_prompt += (
                "INSTRUCTIONS: Generate 3 short quiz questions (with correct answers) based only on the CONTEXT. "
                "Provide simple correct answers after each question. Label Q1/Q2/Q3."
            )
            try:
                gen = retry(generate_with_gemini, quiz_prompt)
                out = {"answer_text": gen, "used_chunks": ctx_chunks or []}
            except Exception as e:
                out = {"error": f"Quiz generation failed: {e}"}
        elif is_summary_request(user):
            # ask Gemini to summarize from last_used_chunks or retrieved chunks
            ctx_chunks = session["last_used_chunks"]
            if not ctx_chunks:
                try:
                    q_emb = retry(embed_query_gemini, user)
                    ctx_chunks = retrieve_top_k(q_emb, TOP_K)
                except Exception:
                    ctx_chunks = []
            prompt = build_prompt(ctx_chunks or [], user, grounded=bool(ctx_chunks and ctx_chunks[0]["score"]>=SIMILARITY_THRESHOLD))
            # request a summary explicitly (reexplain=False)
            try:
                gen = retry(generate_with_gemini, prompt + "\nPlease provide a concise summary labelled 'Summary (based on lessons):' ")
                out = {"answer_text": gen, "used_chunks": ctx_chunks or []}
            except Exception as e:
                out = {"error": f"Summary generation failed: {e}"}
        else:
            out = produce_answer(user, reexplain=False)

        if "error" in out:
            print("Assistant:", out["error"])
            continue

        print("\nAssistant:\n")
        print(out["answer_text"])
        print("\nUsed chunks:")
        for c in out["used_chunks"] or []:
            print(f" - source:{c.get('source')} idx:{c.get('chunk_index')} score:{c.get('score'):.3f}")
        print("\n---\n")
