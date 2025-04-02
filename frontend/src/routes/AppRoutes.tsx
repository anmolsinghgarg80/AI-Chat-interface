import ChatPage from "@/pages/ChatPage";
import SignInPage from "@/pages/SignInPage";
import { Route, Routes } from "react-router-dom";
import SignUpPage from "@/pages/SignUpPage";
import ProtectedRoute from "./ProtectedRoutes";

const routes = () => {
  return (
    <Routes>
      <Route path="/" element={<SignInPage />} />
      <Route path="/signUp" element={<SignUpPage />} />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat/:conversationId"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default routes;
