import { MessageSquare } from "lucide-react";

const EmptyChat = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center justify-center max-w-lg text-center">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="h-10 w-10 text-gray-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Welcome to Chatting App</h1>
        <p className="text-gray-600">Ask me anything</p>
      </div>
    </div>
  );
};

export default EmptyChat;