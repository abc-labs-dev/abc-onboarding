
import { LoginForm } from "@/components/auth/LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };

    checkSession();

    // Also listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/10">
      <div className="w-full max-w-md px-8 py-12 animate-fadeIn">
        <div className="text-center mb-8 animate-slideUp">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            Welcome back
          </h1>
          <p className="text-muted-foreground">
            Sign in to manage your customer onboarding
          </p>
        </div>
        <div className="backdrop-blur-sm bg-white/50 p-8 rounded-lg shadow-lg border border-border/50">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Index;
