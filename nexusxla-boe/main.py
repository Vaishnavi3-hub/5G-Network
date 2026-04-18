from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from boe_agent import run_boe

app = FastAPI(
    title="NexusXLA — Business Outcome Engine",
    description="5G Network as a Service | Technoverse Hackathon 2026",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class BOERequest(BaseModel):
    enterprise_input: str

@app.get("/")
def root():
    return {
        "platform": "NexusXLA",
        "tagline": "Network as a Service — Outcome-Indexed 5G",
        "agent": "Business Outcome Engine (BOE)",
        "status": "running"
    }

@app.post("/configure-slice")
def configure_slice(request: BOERequest):
    if not request.enterprise_input.strip():
        raise HTTPException(
            status_code=400,
            detail="Enterprise input cannot be empty"
        )
    result = run_boe(request.enterprise_input)
    if result.get("status") == "ERROR":
        raise HTTPException(
            status_code=500,
            detail=result.get("message")
        )
    return result

@app.get("/health")
def health():
    return {"status": "healthy", "agent": "BOE v1.0"}
