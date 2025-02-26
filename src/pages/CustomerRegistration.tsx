
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Product {
  name: string;
}

const E2E_PRODUCTS = [
  "Pre-employment testing - Digitally",
  "Pre-employment testing - In person",
  "Pre-employment testing - At ABC in Stockholm",
  "Randomized testing - Digitally",
  "Randomized testing - In person",
  "Incident (suspicion) testing - Digitally",
  "Incident (suspicion) testing - In person",
  "MRO services",
  "Policy guidance",
  "Internal training for managers",
  "EU Union discussion assistance",
];

const CustomerRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    customerType: "",
    selectedProduct: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // First insert the customer
      const { data: customerData, error: customerError } = await supabase
        .from("customers")
        .insert([
          {
            company_name: formData.companyName,
            contact_name: formData.contactName,
            email: formData.email,
            phone: formData.phone,
            customer_type: formData.customerType,
          },
        ])
        .select();

      if (customerError) throw customerError;
      if (!customerData || customerData.length === 0) throw new Error("No customer data returned");

      // Then insert the selected product for this customer
      const { error: productsError } = await supabase.from("products").insert([
        {
          customer_id: customerData[0].id,
          name: formData.selectedProduct,
        },
      ]);

      if (productsError) throw productsError;

      toast({
        title: "Success",
        description: "Customer and product registered successfully",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error registering customer:", error);
      toast({
        title: "Error",
        description: "Failed to register customer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Register New Customer</h1>
            <p className="text-muted-foreground">
              Enter customer details and select their product
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="contactName">Contact Name</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) =>
                    setFormData({ ...formData, contactName: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="customerType">Customer Type</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, customerType: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="e2e">E2E customers</SelectItem>
                    <SelectItem value="wdt-tc">WDT/TC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="product">Product</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, selectedProduct: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.customerType === "e2e" ? (
                      E2E_PRODUCTS.map((product) => (
                        <SelectItem key={product} value={product}>
                          {product}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="Standard WDT Test">Standard WDT Test</SelectItem>
                        <SelectItem value="TC Certification">TC Certification</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register Customer"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegistration;
