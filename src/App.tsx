import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ContractsProvider } from "@/contexts/ContractsContext";
import Index from "./pages/Index";
import ContractResults from "./pages/ContractResults";
import Analyses from "./pages/Analyses";
import Historique from "./pages/Historique";
import Parametres from "./pages/Parametres";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ContractsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/analyses" element={<Analyses />} />
            <Route path="/historique" element={<Historique />} />
            <Route path="/parametres" element={<Parametres />} />
            <Route path="/contrat/:id" element={<ContractResults />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ContractsProvider>
  </QueryClientProvider>
);

export default App;
