import { FormEvent, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send } from "lucide-react";

interface chatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput = ({ onSendMessage }: chatInputProps) => {
  const [message, setMessage] = useState<string>("");

  const handlesubmit = (e: FormEvent) => {
    e.preventDefault();
    onSendMessage(message);
    setMessage("");
  };

  return (
    <div className="flex flex-row items-center gap-3">
      <Input
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="bg-indigo-50 border-indigo-100 text-slate-800 focus:border-indigo-300 focus:ring-indigo-200 placeholder-slate-400 rounded-xl shadow-sm transition-all"
      />
      <Button
        type="submit"
        onClick={handlesubmit}
        className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 rounded-xl shadow-sm transition-all"
      >
        <span>Send</span>
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ChatInput;