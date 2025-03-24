import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner"
import AppRoutes from "./AppRoutes";
const queryClient = new QueryClient();

function App() {
  return (
  <QueryClientProvider client={queryClient}>    
    <Router>
      <AppRoutes />  
    </Router>
    <Toaster richColors />
  </QueryClientProvider>
  );
}

export default App;
