# AI Chat Application

A full-stack chat application built with React, TypeScript, and FastAPI that integrates with Google's Gemini AI.

## Overview

This application consists of:

- **Frontend**: React + TypeScript application with modern UI using Tailwind CSS
- **Backend**: FastAPI-based Python server integrating Gemini AI
- **Authentication**: Firebase Authentication with email/password and Google sign-in
- **Database**: Firebase Firestore for storing conversations and messages

### Key Features

- Functional chat UI
- Real-time chat interface with AI responses
- User authentication and authorization using firebase
- Store all chat history on firestore
- Conversation history management to load and revisit previous chat sessions

## Installation

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Firebase account
- Google Cloud account with Gemini API access

### Clone the repository

```sh
git clone https://github.com/anmolsinghgarg80/AI-Chat-interface.git
cd AI-Chat-interface
```

### Backend Setup

1. Navigate to the backend directory:

```sh
cd backend
```

2. Create a virtual environment:

```sh
python -m venv venv
source venv\Scripts\activate
```

3. Install dependencies:

```sh
pip install -r requirements.txt
```

4. create a .env file in the backend directory

```sh
GOOGLE_PROJECT_ID=your_project_id
GOOGLE_PRIVATE_KEY_ID=your_private_key_id
GOOGLE_PRIVATE_KEY=your_private_key
GOOGLE_CLIENT_EMAIL=your_client_email
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
GOOGLE_TOKEN_URI=https://oauth2.googleapis.com/token
GOOGLE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
GOOGLE_CLIENT_X509_CERT_URL=your_cert_url
GOOGLE_UNIVERSE_DOMAIN=googleapis.com
GEMINI_API_KEY=your_gemini_api_key
```

5. Start the backend server:

```sh
python -m app.main
```

### Frontend Setup

1. Navigate to the frontend directory

```sh
cd frontend
```

2. Install dependencies:

```sh
npm install
```

3. Create a .env file in the frontend directory

```sh
VITE_BASE_URL=http://localhost:8080
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_FIREBASE_DATABASE_URL=your_database_url
```

4. Start the development server:

```sh
npm run dev
```

The application will be available at http://localhost:5173

### Usage

- Sign up for a new account or sign in with Google
- Create a new conversation from the sidebar
- Start chatting with the AI
- View conversation history in the sidebar
- Switch between different conversations

## API Documentation

#### Chat with AI

**POST** `/api/chat`  
Send a message to the AI and receive a response.

**Request Body:**

```json
{
  "content": "Your message here",
  "conversation_id": "existing_conversation_id_or_new"
}
```

**Response:**

```json
{
  "message_id": "unique_message_id",
  "content": "AI response",
  "conversation_id": "conversation_id"
}
```

#### Get Conversations

**GET** `/api/conversations`  
Retrieve a list of all conversations for the authenticated user.

**Response:**

```json
{
  "conversations": [
    {
      "id": "conversation_id",
      "title": "Conversation Title",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

#### Get Conversation Messages

**GET** `/api/conversations/{conversation_id}`  
Retrieve all messages in a specific conversation.

**Response:**

```json
{
  "id": "conversation_id",
  "title": "Conversation Title",
  "createdAt": "timestamp",
  "messages": [
    {
      "id": "message_id",
      "content": "Message content",
      "role": "user_or_assistant",
      "createdAt": "timestamp"
    }
  ]
}
```

#### Create a New Conversation

**POST** `/api/conversations`  
Create a new conversation.

**Request Body:**

```json
{
  "title": "Conversation Title"
}
```

**Response:**

```json
{
  "conversation": {
    "id": "conversation_id",
    "title": "Conversation Title",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

## Deployment Guide

Frontend is deployed on render and the Backend on Google Cloud using App Engine.

### Frontend Deployement

#### Step 1: Prepare Your React App

1. Navigate to Frontend

```sh
cd frontend
```

2. Build the app

```sh
npm run build
```

3. Initialize a Git Repository

```sh
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repository-url>
git push -u origin main
```

#### Step 2: Create a New Web Service on Render

1. Go to Render → https://dashboard.render.com/

2. Click "New" → Select "Static Site".

3. Connect your GitHub account and select your React app repository.

#### Step 3: Configure Deployment Settings

1. Name Your Project

2. Select Branch (choose main)

3. Root Directory -> frontend

4. Build Commands -> frontend / npm install; npm run build

5. Publish Directory -> frontend / dist

6. Add the Environment Variables(same as in frontend .env file)

7. Click Create Static Site to start deployment.

### Backend Deployement

#### 1. Set Up a Google Cloud Project

1. Go to Google Cloud Console and create a new Project

#### 2. Enable App Engine Admin API

1. Search for "App Engine Admin API".

2. Click Enable to activate it.

#### 3. Create an App Engine

1. Search "App Engine" and select it.

2. Create Application and choose the deployment region nearest to you.

3. Click Next and wait for the App Engine setup to complete.

#### 4. Prepare Your Python Application

Ensure you have

- app/main.py -> contains backend service.
- requirements.txt -> list of dependencies.
- app.yaml -> configuration file for App Engine.

#### 5. Deploy application

1. Open Cloud Shell and run

```sh
gcloud init
```

2. Now Copy the folders and files in the open Editor

3. run the following command

```sh
gcloud app deploy
```

4. Run the following command to view your app

```sh
gcloud app browse
```

#### Update frontend environment

Get the App Engine Url and update the VITE_BASE_URL variable in .env file present in the Frontend environment on render.

Following these Steps, both the frontend and backend will be deployed.
