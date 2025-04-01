import { FormEvent, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

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
    <div className="flex flex-row items-center gap-5">
      <Input
        placeholder="Type your Message here"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="bg-gray-50 border-gray-300 text-gray-800 focus:border-gray-400 focus:ring-gray-400"
      />
      <Button
        type="submit"
        onClick={handlesubmit}
        className=" bg-gray-800 hover:bg-gray-700 text-white"
      >
        Send
      </Button>
    </div>
  );
};

export default ChatInput;
