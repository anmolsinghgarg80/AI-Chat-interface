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
          className="fixed top-4 left-4 z-50"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}

      <div
        className={cn(
          "bg-card h-full fixed left-0 top-0 bottom-0 z-40 w-72 border-r transition-transform duration-300 flex flex-col",
          isMobile && !sidebarOpen && "-translate-x-full"
        )}
      >
        <div className="p-4 flex-1 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              <h1 className="font-bold text-xl">Chatopia</h1>
            </div>
          </div>

          <Button className="w-full mb-4 flex items-center gap-2" onClick={handleCreateConversation} disabled={loading}>
            <Plus className="h-4 w-4" />
            New Chat
          </Button>

          <div className="space-y-1 flex-1 overflow-y-auto scrollbar-thin">
            {loading && conversations.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No conversations yet</div>
            ) : (
              conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => {
                    navigate(`/chat/${conversation.id}`);
                    if (isMobile) setSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 overflow-hidden",
                    conversation.id === currentConversationId
                      ? "bg-secondary text-secondary-foreground"
                      : "hover:bg-secondary/50 text-muted-foreground"
                  )}
                >
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="truncate">{conversation.title}</span>
                </button>
              ))
            )}
          </div>

          <div className="mt-auto pt-4 border-t">
            {user && (
              <div className="flex items-center justify-between">
                <div className="flex items-center overflow-hidden">
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  )}
                  <div className="truncate">
                    <p className="text-sm truncate font-medium">
                      {user.displayName || user.email || "User"}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={logout} title="Sign out">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}
    </>
  );
};

export default ChatSidebar;
