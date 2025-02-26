
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { createTestUser } from "@/lib/setupTestUser";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("testuser@gmail.com");
  const [password, setPassword] = useState("password123");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          // Try to create test user if login fails
          const { error: signUpError } = await createTestUser();
          
          if (signUpError) {
            toast({
              title: "Error",
              description: signUpError.message,
              variant: "destructive",
            });
            return;
          }

          // Try logging in again
          const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (retryError) throw retryError;
          if (retryData.user) {
            toast({
              title: "Success",
              description: "Welcome! Test user created and logged in.",
            });
            navigate("/dashboard");
            return;
          }
        }
        throw error;
      }

      if (data.user) {
        toast({
          title: "Success",
          description: "Welcome back!",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "There was a problem logging in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="transition-all duration-200 focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="transition-all duration-200 focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember" className="text-sm cursor-pointer">
            Remember me
          </Label>
        </div>
        <Button variant="link" className="px-0 font-normal">
          Forgot password?
        </Button>
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}
