import ChatPage from "@/pages/ChatPage";
import SignInPage from "@/pages/SignInPage";
import { Route, Routes } from "react-router-dom";
import SignUpPage from "@/pages/SignUpPage";

const routes = () => {
  return (
    <Routes>
      <Route path="/" element={<SignInPage />} />
      <Route path="/signUp" element={<SignUpPage />} />

      <Route path="/chat" element={<ChatPage />} />
      <Route path="/chat/:conversationId" element={<ChatPage />} />
    </Routes>
  );
};

export default routes;
