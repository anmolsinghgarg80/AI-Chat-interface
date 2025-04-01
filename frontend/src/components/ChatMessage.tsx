import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Message } from "@/types";
import { Bot, User } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

interface ChatMessageProps {
  message: Message;
  isLatest: boolean;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAssistant = message.role === "assistant";

  // Format timestamp
  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  const timestamp = message.createdAt ? formatTime(message.createdAt) : "";

  const renderContent = () => {
    if (!message.content) return null;
  
    // Process markdown-like bold and italic formatting
    const formatText = (text:string )=> {
      return text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
        .replace(/\*(.*?)\*/g, "<em>$1</em>"); // Italic
    };
  
    if (message.content.includes("```")) {
      const parts = message.content.split(/(```[\s\S]*?```)/g);
      return (
        <div>
          {parts.map((part, index) => {
            if (part.startsWith("```") && part.endsWith("```")) {
              const codeContent = part.substring(3, part.length - 3).trim();
              return (
                <div
                  key={index}
                  className="my-2 overflow-auto rounded-lg bg-slate-100 p-3 font-mono text-sm text-slate-800 shadow-inner"
                >
                  <pre>{codeContent}</pre>
                </div>
              );
            }
            return (
              <p key={index} className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatText(part) }} />
            );
          })}
        </div>
      );
    }
  
    return <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatText(message.content) }} />;
  };
  

  return (
    <div
      key={message.id}
      className={`flex w-full items-start gap-4 px-4 py-5 ${isAssistant ? 'bg-indigo-50/50' : 'bg-white'} transition-colors`}
    >
      <Avatar className={`h-8 w-8 shadow-sm ring-2 ring-white ${isAssistant ? "bg-indigo-600" : "bg-slate-700"}`}>
        <AvatarFallback className="text-xs text-white">
          {isAssistant ? <Bot size={16} /> : <User size={16} />}
        </AvatarFallback>
        {isAssistant && (
          <AvatarImage src="/assistant-avatar.png" alt="Assistant" />
        )}
        {!isAssistant && <AvatarImage src="/user-avatar.png" alt="User" />}
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-slate-800">
            {isAssistant ? "Assistant" : "You"}
          </h3>
          <span className="text-xs text-indigo-500 font-medium">{timestamp}</span>
        </div>

        <Card className={`border-0 ${isAssistant ? 'bg-white' : 'bg-indigo-50/50'} shadow-sm transition-all hover:shadow`}>
          <CardContent className="p-4 text-sm text-slate-700">{renderContent()}</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatMessage;