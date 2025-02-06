import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthContextProvider } from "./Context/AuthContext.jsx";
import { BookmarkContextProvider } from "./Context/BookmarkContext.jsx";
import StripeContextProvider from "./Context/StripeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <BookmarkContextProvider>
          <StripeContextProvider>
        <App />
          </StripeContextProvider>
      </BookmarkContextProvider>
    </AuthContextProvider>
  </StrictMode>
);
