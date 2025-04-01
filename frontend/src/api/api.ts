const API_URL = import.meta.env.VITE_BASE_URL;

const getUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || " {}");
    return user;
  } catch (error) {
    console.error("Error parsing ", error);
    return {};
  }
};

export async function sendMessage(message: string, conversationId: string) {
  const user = await getUser();
  const token = user?.token;

  if (!token) {
    throw new Error("Not authenticated");
  }

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
  const user = await getUser();
  const token = user?.token;

  if (!token) {
    throw new Error("Not authenticated");
  }
    //added this for extra security. so that token doesn't gets invalid due to time delay
   await new Promise((resolve) => setTimeout(resolve, 3000));

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
  const user = await getUser();
  const token = user?.token;

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
  const user = await getUser();
  const token = user?.token;
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
