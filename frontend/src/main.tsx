import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AdminPage from "./AdminPage";
import App from "./App";
import "./styles.css";

const isAdmin = window.location.pathname.replace(/\/+$/, "") === "/admin";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isAdmin ? <AdminPage /> : <App />}
  </StrictMode>
);
