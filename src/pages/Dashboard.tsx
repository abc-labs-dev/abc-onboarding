
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Users, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Button
            onClick={() => navigate("/customer/new")}
            className="h-32 text-lg"
            variant="outline"
          >
            <PlusCircle className="mr-2 h-6 w-6" />
            Register New Customer
          </Button>
          
          <Button 
            onClick={() => navigate("/customers")}
            className="h-32 text-lg" 
            variant="outline"
          >
            <Users className="mr-2 h-6 w-6" />
            View All Customers
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
