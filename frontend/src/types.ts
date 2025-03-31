export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
}
export type Conversation = {
  id: string;
  title: string;
  createdAt: string;
};