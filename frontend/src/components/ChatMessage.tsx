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
                  className="my-2 overflow-auto rounded-md bg-gray-100 p-2 font-mono text-sm text-gray-800"
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
      className={`flex w-full items-start gap-4 px-4 py-6 ${isAssistant ? 'bg-gray-100' : 'bg-white'}`}
    >
      <Avatar className={`h-8 w-8 ${isAssistant ? "bg-gray-600" : "bg-gray-800"}`}>
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
          <h3 className="font-semibold text-sm text-gray-800">
            {isAssistant ? "Assistant" : "You"}
          </h3>
          <span className="text-xs text-gray-500">{timestamp}</span>
        </div>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-3 text-sm text-gray-800">{renderContent()}</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatMessage;