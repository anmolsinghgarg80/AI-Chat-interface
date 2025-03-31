import { MessageSquare } from "lucide-react";

const EmptyChat = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center justify-center max-w-lg text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Welcome to Chatopia</h1>
        <p className="text-muted-foreground">Start a new conversation.</p>
      </div>
    </div>
  );
};

export default EmptyChat;
