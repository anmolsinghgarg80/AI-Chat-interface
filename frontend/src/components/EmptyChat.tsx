import { MessageSquare } from "lucide-react";

const EmptyChat = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center justify-center max-w-lg text-center">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-5 shadow-inner">
          <MessageSquare className="h-12 w-12 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-bold mb-3 text-slate-800">Welcome to Chatting App</h1>
        <p className="text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full shadow-sm">Ask me anything</p>
      </div>
    </div>
  );
};

export default EmptyChat;