import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "leaflet/dist/leaflet.css";
import "@/index.css";

import AppErrorBoundary from "@/components/layout/AppErrorBoundary";
import { TooltipProvider } from "@/components/ui/tooltip";

import App from "@/App";

createRoot(document.getElementById("root")).render(
   <StrictMode>
      <TooltipProvider>
         <AppErrorBoundary>
            <App />
         </AppErrorBoundary>
      </TooltipProvider>
   </StrictMode>
);
