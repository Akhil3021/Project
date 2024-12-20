import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserContextProvider } from "../src/Context/UserContext.jsx";
import { StoreContextProvider } from "../src/Context/StoreContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserContextProvider>
      <StoreContextProvider>
        <App />
      </StoreContextProvider>
    </UserContextProvider>
  </StrictMode>
);
