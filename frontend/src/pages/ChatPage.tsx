import ChatSidebar from "@/components/ChatSidebar";
import ChatInput from "@/components/ChatInput";
import { Message } from "@/types";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import { getConversation, sendMessage } from "@/api/api";
import ChatMessage from "@/components/ChatMessage";
import EmptyChat from "@/components/EmptyChat";
import { MessageSquare } from "lucide-react";

const Chat = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    if (!conversationId) {
      setMessages([]);
      return;
    }
    fetchMessages();
  }, [conversationId, user]);

  const fetchMessages = async () => {
    if (!conversationId) return;

    try {
      setLoading(true);
      const data = await getConversation(conversationId);
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!conversationId || !content.trim()) {
      alert("Create a new conversation in sidebar to start chatting");
      return;
    }

    const tempMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    scrollToBottom();

    try {
      setSendingMessage(true);
      const response = await sendMessage(content, conversationId);

      const assistantMessage: Message = {
        id: response.message_id,
        content: response.content,
        role: "assistant",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendingMessage(false);
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <ChatSidebar currentConversationId={conversationId || null} />
      <main className="flex-1 ml-0 md:ml-72 flex flex-col h-full bg-slate-50">
        <div className="flex flex-col md:flex-row md:gap-3 justify-center items-center bg-white font-bold text-lg p-3 text-slate-800 border-b border-indigo-100 shadow-sm">
          <div>Welcome</div>
          <div className="text-indigo-600">{user?.email}</div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin px-2 pt-2 pb-40">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse text-indigo-500 flex items-center gap-2">
                Loading conversation ...
              </div>
            </div>
          ) : !conversationId ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-indigo-600 flex items-center flex-col gap-3 bg-white p-6 rounded-xl shadow-sm">
                <MessageSquare className="h-10 w-10 text-indigo-500" />
                Add a new conversation in sidebar to continue
              </div>
            </div>
          ) : messages.length === 0 ? (
            <EmptyChat />
          ) : (
            <>
              <div className="pb-20">
                {messages.map((message, index) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isLatest={index === messages.length - 1}
                  />
                ))}
                {isSendingMessage && (
                  <div className="text-xs text-indigo-500 mt-1 ml-2 flex items-center gap-1">
                    Waiting for response ...
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white py-4 px-4 md:pl-80 border-t border-indigo-100 shadow-md">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </main>
    </div>
  );
};

export default Chat;
