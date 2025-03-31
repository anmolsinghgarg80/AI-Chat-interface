from fastapi import FastAPI, HTTPException, Depends, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import uuid
import firebase_admin
from firebase_admin import credentials, firestore, auth
import google.generativeai as genai
from datetime import datetime
import json
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase
firebase_admin.initialize_app()
db = firestore.client()

# Initialize Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI(title="Chatopia API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    content: str
    conversation_id: str

class Conversation(BaseModel):
    title: str

# Auth middleware
async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.split("Bearer ")[1]

    try:

        decoded_token = auth.verify_id_token(token)
        
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

# Gemini API
def get_gemini_response(prompt, conversation_history=None):
    model = genai.GenerativeModel('gemini-2.0-flash')
    
    if conversation_history:
        chat = model.start_chat(history=conversation_history)
        response = chat.send_message(prompt)
    else:
        response = model.generate_content(prompt)
    print(response.text)
    return response.text

# Format conversation history for Gemini
def format_conversation_history(messages):
    history = []
    for msg in messages:
        history.append({
            "role": msg["role"],
            "parts": [msg["content"]]
        })
    return history

# Routes
@app.post("/api/chat")
async def chat(message: Message, user=Depends(get_current_user)):
    user_id = user["uid"]
    conversation_id = message.conversation_id
    
    # Check if conversation exists and belongs to user
    conversation_ref = db.collection("conversations").document(conversation_id)
    conversation = conversation_ref.get()

    if not conversation.exists or conversation.to_dict()["user_id"] != user_id:
        if conversation_id == "new":
            # Create a new conversation
            conversation_id = str(uuid.uuid4())
            conversation_ref = db.collection("conversations").document(conversation_id)
            conversation_ref.set({
                "user_id": user_id,
                "title": message.content[:30] + "..." if len(message.content) > 30 else message.content,
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            })
        else:
            raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Get existing messages for context
    messages_ref = conversation_ref.collection("messages").order_by("created_at").stream()
    messages = [msg.to_dict() for msg in messages_ref]
    
    # if the first message is sent then the name of the title should be changed to the question asked, make changes below
    if not messages:
        conversation_ref.update({
            "title": message.content[:30] + "..." if len(message.content) > 30 else message.content,
        })   

    # Add user message to database
# Add user message to database (CORRECTED)
    user_message_id = str(uuid.uuid4())
    conversation_ref.collection("messages").document(user_message_id).set({
        "id": user_message_id,
        "content": message.content,
        "role": "user",
        "created_at": datetime.now().isoformat()
    })
    
    # Update messages with the new user message
    messages.append({
        "id": user_message_id,
        "content": message.content,
        "role": "user",
        "created_at": datetime.now().isoformat()
    })
    
    # Prepare conversation history for Gemini
    conversation_history = format_conversation_history(messages) if messages else None
    
    try:
        # Get response from Gemini
        ai_response = get_gemini_response(message.content, conversation_history)
        
        # Add AI response to database
        ai_message_id = str(uuid.uuid4())
        conversation_ref.collection("messages").document(ai_message_id).set({
            "id": ai_message_id,
            "content": ai_response,
            "role": "assistant",
            "created_at": datetime.now().isoformat()
        })
        
        # Update conversation timestamp
        conversation_ref.update({
            "updated_at": datetime.now().isoformat()
        })
        
        # If this is a new conversation and we haven't set a good title yet
        if conversation.exists and conversation.to_dict()["title"] == (message.content[:30] + "..." if len(message.content) > 30 else message.content):
            # Generate a better title using Gemini
            title_prompt = f"Generate a short, concise title (maximum 5 words) for this conversation. The first message is: {message.content}"
            title = get_gemini_response(title_prompt)
            
            # Clean up and trim the title
            title = title.strip().strip('"').strip("'")
            if len(title) > 30:
                title = title[:27] + "..."
                
            conversation_ref.update({
                "title": title
            })
        
        return {
            "message_id": ai_message_id,
            "content": ai_response,
            "conversation_id": conversation_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

@app.get("/api/conversations")
async def get_conversations(user=Depends(get_current_user)):
    user_id = user["uid"]
    print("working")
    # Get all conversations for the user
    conversations_ref = db.collection("conversations").where("user_id", "==", user_id).stream()
    conversations = []
    for conversation in conversations_ref:
        data = conversation.to_dict()
        conversations.append({
            "id": conversation.id,
            "title": data.get("title", "Untitled Conversation"),
            "createdAt": data.get("created_at"),
            "updatedAt": data.get("updated_at")
        })
    return {"conversations": conversations}

@app.get("/api/conversations/{conversation_id}")
async def get_conversation(conversation_id: str, user=Depends(get_current_user)):
    user_id = user["uid"]
    
    # Check if conversation exists and belongs to user
    conversation_ref = db.collection("conversations").document(conversation_id)
    conversation = conversation_ref.get()
    
    if not conversation.exists or conversation.to_dict()["user_id"] != user_id:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Get messages in the conversation
    messages_ref = conversation_ref.collection("messages").order_by("created_at").stream()
    
    messages = []
    for message in messages_ref:
        data = message.to_dict()
        messages.append({
            "id": data.get("id"),
            "content": data.get("content"),
            "role": data.get("role"),
            "createdAt": data.get("created_at")
        })
    
    conversation_data = conversation.to_dict()
    return {
        "id": conversation_id,
        "title": conversation_data.get("title", "Untitled Conversation"),
        "createdAt": conversation_data.get("created_at"),
        "messages": messages
    }

@app.post("/api/conversations")
async def create_conversation(conversation: Conversation, user=Depends(get_current_user)):
    user_id = user["uid"]
    
    # Create a new conversation
    conversation_id = str(uuid.uuid4())
    db.collection("conversations").document(conversation_id).set({
        "user_id": user_id,
        "title": conversation.title,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    })
    
    return {
        "conversation": {
            "id": conversation_id,
            "title": conversation.title,
            "createdAt": datetime.now().isoformat()
        }
    }


@app.get("/")
async def root():
    return {"message": "Welcome to Chatopia API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
