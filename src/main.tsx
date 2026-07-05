import "@fontsource-variable/geist/index.css";
import "@fontsource/inter-tight/400.css";
import "@fontsource/inter-tight/500.css";
import "@fontsource/inter-tight/600.css";
import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./lib/auth";
import App from "./App";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter basename={basename}>
            <App />
            <Toaster position="bottom-right" richColors closeButton />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>,
);
