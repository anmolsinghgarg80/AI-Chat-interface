import { auth } from "../firebase";

const API_URL = "http://localhost:8000";

export async function sendMessage(message: string, conversationId: string) {
  const token = await auth.currentUser?.getIdToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  // Log what we're sending to help debug
  console.log("Sending to API:", {
    content: message, // Use 'content' to match backend expectation
    conversation_id: conversationId,
  });

  const response = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      content: message,
      conversation_id: conversationId,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API error response:", errorText);
    throw new Error(`Failed to send message: ${response.status} ${errorText}`);
  }

  return response.json();
}

export async function getConversations() {
  const token = await auth.currentUser?.getIdToken();
  console.log(token);
  if (!token) {
    throw new Error("Not authenticated");
  }
  const response = await fetch(`${API_URL}/api/conversations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get conversations");
  }

  return response.json();
}

export async function getConversation(conversationId: string) {
  const token = await auth.currentUser?.getIdToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${API_URL}/api/conversations/${conversationId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get conversation");
  }

  return response.json();
}

export async function createConversation(title: string) {
  const token = await auth.currentUser?.getIdToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}/api/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error("Failed to create conversation");
  }

  return response.json();
}

export async function changeTite(title: string) {
  const token = auth.currentUser?.getIdToken;

  if (!token) {
    throw new Error("Not authenticated");
  }
  const response = await fetch(`${API_URL}/api/changeTitle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error("Failed to create conversation");
  }
  return response.json();
}
