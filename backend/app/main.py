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

# Get correct paths using pathlib
current_file = Path(__file__)  # This is /backend/app/main.py
backend_dir = current_file.parent.parent  # This is /backend/
frontend_dist_dir = backend_dir.parent / "frontend" / "dist"  # This is /frontend/dist/

print(f"Frontend dist directory: {frontend_dist_dir}")

# Check if the frontend dist directory exists
if not frontend_dist_dir.exists():
    print(f"Warning: Frontend dist directory not found at {frontend_dist_dir}")

# Check the actual structure of your frontend build
# Vite typically puts assets in an "assets" folder
assets_dir = frontend_dist_dir / "assets"
if assets_dir.exists():
    print(f"Mounting assets directory from {assets_dir}")
    app.mount(
        "/assets",
        StaticFiles(directory=str(assets_dir)),
        name="assets"
    )
else:
    print(f"Warning: Assets directory not found at {assets_dir}")
    # Fallback to "static" if it exists
    static_dir = frontend_dist_dir / "static"
    if static_dir.exists():
        print(f"Mounting static directory from {static_dir}")
        app.mount(
            "/static",
            StaticFiles(directory=str(static_dir)),
            name="static"
        )
    else:
        print(f"Warning: Neither assets nor static directory found")

# API Routes (should come before catch-all)
app.include_router(chat_router, prefix="/api")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

# Catch-all route for SPA (must be last)
@app.get("/{full_path:path}")
async def serve_spa(request: Request, full_path: str):
    # Don't interfere with API routes
    if full_path.startswith("api/"):
        return {"detail": "Not Found"}
    
    # Log the requested path for debugging
    print(f"Serving SPA for path: {full_path}")
    
    # Serve index.html for all other routes
    index_path = frontend_dist_dir / "index.html"
    
    if not index_path.exists():
        print(f"Error: index.html not found at {index_path}")
        return {"detail": f"Frontend index.html not found at {index_path}"}
    
    return FileResponse(str(index_path))

# Welcome route (will be overridden by catch-all for SPA when frontend is available)
@app.get("/")
async def root():
    index_path = frontend_dist_dir / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    return {"message": "Welcome to Chatting API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)