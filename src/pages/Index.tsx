
import { LoginForm } from "@/components/auth/LoginForm";

const Index = () => {
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
