import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.tsx";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
);
