import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session === null) {
    return null; // Loading state
  }

  return session ? <>{children}</> : <Navigate to="/auth" />;
};

const App = () => {
  console.log("App component rendered");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={<Index />} 
              data-component="Index"
              data-component-name="Index"
              data-component-file="./pages/Index"
            />
            <Route 
              path="/auth/reset-password" 
              element={<Auth />} 
              data-component="Auth"
              data-component-name="Auth"
              data-component-file="./pages/Auth"
            />
            <Route 
              path="/auth" 
              element={<Auth />} 
              data-component="Auth"
              data-component-name="Auth"
              data-component-file="./pages/Auth"
            />
            <Route 
              path="/admin" 
              element={<PrivateRoute><Admin /></PrivateRoute>} 
              data-component="Admin"
              data-component-name="Admin"
              data-component-file="./pages/Admin"
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;