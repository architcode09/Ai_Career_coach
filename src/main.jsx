import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import App from "@/src/App";
import { AuthProvider } from "@/src/context/auth-context";
import "@/src/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
        <Toaster richColors />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
