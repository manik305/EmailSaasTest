import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv(override=True)

router = APIRouter()

EURI_API_KEY = os.getenv("EURI_API_KEY", "")

def _is_key_configured() -> bool:
    """Check if a real API key is set (not a placeholder)."""
    if not EURI_API_KEY:
        return False
    placeholders = ["your_", "placeholder", "dummy", "xxx", "change_me"]
    return not any(p in EURI_API_KEY.lower() for p in placeholders) and len(EURI_API_KEY) > 10

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    model: str
    messages: List[ChatMessage]
    max_tokens: int = 500
    temperature: float = 0.7

def _mock_response(request: ChatRequest) -> dict:
    """Return a simulated response for testing without a real API key."""
    return {
        "choices": [
            {
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": (
                        f"[Simulated {request.model} Response] "
                        f"You asked: \"{request.messages[-1].content}\". "
                        f"To get real AI responses, set your EURI_API_KEY in backend/.env "
                        f"with a valid key from api.euron.one."
                    )
                },
                "finish_reason": "stop"
            }
        ],
        "usage": {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}
    }

@router.post("/completions")
async def chat_completion(request: ChatRequest):
    if not _is_key_configured():
        return _mock_response(request)
    
    try:
        from openai import OpenAI
        client = OpenAI(
            api_key=EURI_API_KEY,
            base_url="https://api.euron.one/api/v1/euri"
        )
        response = client.chat.completions.create(
            model=request.model,
            messages=[{"role": m.role, "content": m.content} for m in request.messages],
            max_tokens=request.max_tokens,
            temperature=request.temperature
        )
        return response
    except Exception as e:
        # If the API call itself fails (bad key, network, etc.), fall back to mock
        error_str = str(e)
        if "401" in error_str or "403" in error_str or "auth" in error_str.lower():
            return _mock_response(request)
        raise HTTPException(status_code=400, detail=error_str)

@router.get("/models")
async def list_available_models():
    """Return the list of models available through the Euron API."""
    return {
        "models": [
            {"id": "gpt-4o-mini", "name": "GPT-4o Mini", "provider": "OpenAI"},
            {"id": "gemini-2.5-flash", "name": "Gemini 2.5 Flash", "provider": "Google"},
            {"id": "claude-sonnet-4-6", "name": "Claude Sonnet 4.6", "provider": "Anthropic"},
            {"id": "llama-4-scout-17b-16e-instruct", "name": "Llama 4 Scout", "provider": "Meta"},
        ]
    }
