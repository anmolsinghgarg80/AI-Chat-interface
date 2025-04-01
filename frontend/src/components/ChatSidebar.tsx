import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, LogOut, X, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { createConversation, getConversations } from "../api/api";

type Conversation = {
  id: string;
  title: string;
  createdAt: string;
};

interface ChatSidebarProps {
  currentConversationId: string | null;
}

const ChatSidebar = ({ currentConversationId }: ChatSidebarProps) => {
  const { logout, user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 800);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await getConversations();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConversation = async () => {
    try {
      setLoading(true);
      const response = await createConversation("New conversation");
      setConversations((prev) => [response.conversation, ...prev]);
      navigate(`/chat/${response.conversation.id}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-50 bg-white border-indigo-200 text-indigo-600 hover:bg-indigo-50 shadow-sm rounded-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      )}

      <div
        className={cn(
          "bg-white h-full fixed left-0 top-0 bottom-0 z-40 w-72 border-r border-indigo-100 transition-transform duration-300 flex flex-col shadow-sm",
          isMobile && !sidebarOpen && "-translate-x-full"
        )}
      >
        <div className="p-4 flex-1 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center space-x-2">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <MessageSquare className="h-3 w-3 text-indigo-600" />
              </div>
              <h1 className="font-bold text-xl text-slate-800">Chatting App</h1>
            </div>
          </div>

          <Button
            className="w-full mb-5 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer text-white shadow-sm transition-all"
            onClick={handleCreateConversation}
            disabled={loading}
          >
            <Plus className="h-4 w-4 text-white" />
            <h3 className="text-white font-medium">New Chat</h3>
          </Button>

          <div className="space-y-1 flex-1 overflow-y-auto scrollbar-thin">
            {loading && conversations.length === 0 ? (
              <div className="text-center py-4 text-indigo-500">Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-4 text-indigo-500">
                No conversations yet
              </div>
            ) : (
              conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => {
                    navigate(`/chat/${conversation.id}`);
                    if (isMobile) setSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 overflow-hidden text-slate-700",
                    conversation.id === currentConversationId
                      ? "bg-indigo-100 text-indigo-900 font-medium"
                      : "hover:bg-indigo-50"
                  )}
                >
                  <MessageSquare className="h-4 w-4 shrink-0 text-indigo-600" />
                  <span className="truncate">{conversation.title}</span>
                </button>
              ))
            )}
          </div>

          <div className="mt-auto pt-4 border-t border-indigo-100">
            {user && (
              <div className="flex items-center justify-between">
                <div className="flex items-center overflow-hidden">
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="w-8 h-8 rounded-full mr-2 ring-2 ring-indigo-100"
                    />
                  )}
                  <div className="truncate">
                    <p className="text-sm truncate font-medium text-slate-800">
                      {user.displayName || user.email || "User"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  title="Sign out"
                  className="bg-indigo-100 hover:bg-indigo-200 cursor-pointer text-indigo-600 rounded-lg"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMobile && sidebarOpen && (
        <div
          className="fixed backdrop-blur-sm inset-0 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default ChatSidebar;
