import { FormEvent, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

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
    <div className=" flex flex-row items-center gap-5">
      <Textarea
        placeholder="Type your Message here"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button type="submit" onClick={handlesubmit} className="h-[50px]">
        {" "}
        Send{" "}
      </Button>
    </div>
  );
};

export default ChatInput;
