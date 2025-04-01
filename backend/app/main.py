from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
import os
from app.controllers.chat_Controller import router as chat_router

# Initialize FastAPI
app = FastAPI(title="Chatting API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://ai-chat-interface.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods for SPA routing
    allow_headers=["*"],
)

# Get correct paths using pathlib (more reliable than os.path)
current_dir = Path(__file__).parent
backend_dir = current_dir.parent
frontend_dist_dir = backend_dir.parent / "frontend" / "dist"

# Serve static files (JS, CSS, images from the 'static' directory)
static_files_dir = frontend_dist_dir / "static"
if static_files_dir.exists():
    app.mount(
        "/static",
        StaticFiles(directory=str(static_files_dir)),
        name="static"
    )

# API Routes (should come before catch-all)
app.include_router(chat_router, prefix="/api")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

# Catch-all route for SPA (must be last)
@app.get("/{full_path:path}")
async def serve_spa(request: Request, full_path: str):
    # Don't interfere with API or static files
    if full_path.startswith(("api/", "static/")):
        return None
    
    # Serve index.html for all other routes
    index_path = frontend_dist_dir / "index.html"
    if not index_path.exists():
        raise RuntimeError("Frontend index.html not found")
    
    return FileResponse(str(index_path))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)