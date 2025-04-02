from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from app.controllers.chat_Controller import router as chat_router


# Initialize FastAPI
app = FastAPI(title="Chatting API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["GET","POST","OPTIONS"],
    allow_headers=["*"],
)

# Routes
app.include_router(chat_router,prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to Chatting API"}

if __name__ == "__main__":
    import uvicorn
    PORT = 8080
    uvicorn.run(app,port=PORT)
