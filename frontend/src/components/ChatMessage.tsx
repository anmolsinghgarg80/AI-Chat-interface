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

  // Basic code block rendering
  const renderContent = () => {
    if (!message.content) return null;

    // Simple code block detection
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
                  className="my-2 overflow-auto rounded-md bg-black/10 p-2 font-mono text-sm"
                >
                  <pre>{codeContent}</pre>
                </div>
              );
            }
            return (
              <p key={index} className="whitespace-pre-wrap">
                {part}
              </p>
            );
          })}
        </div>
      );
    }

    return <div className="whitespace-pre-wrap">{message.content}</div>;
  };

  return (
    <div
      key={message.id}
      className="flex w-full items-start gap-4 px-4 py-6 bg-slate-100"
    >
      <Avatar className="h-8 w-8 bg-slate-500">
        <AvatarFallback className="text-xs">
          {isAssistant ? <Bot size={16} /> : <User size={16} />}
        </AvatarFallback>
        {isAssistant && (
          <AvatarImage src="/assistant-avatar.png" alt="Assistant" />
        )}
        {!isAssistant && <AvatarImage src="/user-avatar.png" alt="User" />}
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">
            {isAssistant ? "Assistant" : "You"}
          </h3>
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </div>

        <Card>
          <CardContent className="p-3 text-sm">{renderContent()}</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatMessage;
