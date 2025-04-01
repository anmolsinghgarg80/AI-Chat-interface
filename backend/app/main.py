from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from fastapi.staticfiles import StaticFiles
from app.controllers.chat_Controller import router as chat_router

PORT = 8080

# Initialize FastAPI
app = FastAPI(title="Chatting API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://ai-chat-interface.onrender.com"],  
    allow_credentials=True,
    allow_methods=["GET","POST","OPTIONS"],
    allow_headers=["*"],
)

current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
# Construct the path to frontend/dist
frontend_dist_dir = os.path.join(backend_dir, "..", "frontend", "dist")

# Check if directory exists, otherwise use a fallback
if os.path.exists(frontend_dist_dir):
    app.mount(
        "/",  
        StaticFiles(directory=frontend_dist_dir, html=True),
        name="frontend"
    )

# Routes
app.include_router(chat_router,prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to Chatting API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app,port=PORT)
