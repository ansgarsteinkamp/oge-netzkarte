import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "@/App";
import AppErrorBoundary from "@/components/layout/AppErrorBoundary";
import { TooltipProvider } from "@/components/ui/tooltip";
import "leaflet/dist/leaflet.css";
import "@/index.css";

createRoot(document.getElementById("root")).render(
   <StrictMode>
      <TooltipProvider>
         <AppErrorBoundary>
            <App />
         </AppErrorBoundary>
      </TooltipProvider>
   </StrictMode>
);
