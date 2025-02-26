
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
import { ArrowLeft, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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

const WDT_TC_PRODUCTS = ["Standard WDT Test", "TC Certification"];

const CustomerRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    customerType: "",
  });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  // Define available products based on customer type
  const availableProducts = formData.customerType === "e2e" ? E2E_PRODUCTS : WDT_TC_PRODUCTS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
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

      const productsToInsert = selectedProducts.map(product => ({
        customer_id: customerData[0].id,
        name: product,
      }));

      const { error: productsError } = await supabase
        .from("products")
        .insert(productsToInsert);

      if (productsError) throw productsError;

      toast({
        title: "Success",
        description: "Customer and products registered successfully",
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
              Enter customer details and select their products
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
                  onValueChange={(value) => {
                    setFormData({ ...formData, customerType: value });
                    setSelectedProducts([]); // Reset selected products when changing customer type
                  }}
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

              {formData.customerType && (
                <div>
                  <Label>Products</Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                        disabled={!formData.customerType}
                      >
                        {selectedProducts.length === 0
                          ? "Select products..."
                          : `${selectedProducts.length} product${
                              selectedProducts.length === 1 ? "" : "s"
                            } selected`}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command className="bg-popover">
                        <CommandInput placeholder="Search products..." />
                        <CommandEmpty>No products found.</CommandEmpty>
                        <CommandGroup>
                          {availableProducts.map((product) => (
                            <CommandItem
                              key={product}
                              onSelect={() => {
                                setSelectedProducts((prev) =>
                                  prev.includes(product)
                                    ? prev.filter((p) => p !== product)
                                    : [...prev, product]
                                );
                              }}
                              className="cursor-pointer"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedProducts.includes(product)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {product}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {selectedProducts.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {selectedProducts.map((product) => (
                        <div
                          key={product}
                          className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                        >
                          {product}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || selectedProducts.length === 0}
            >
              {isSubmitting ? "Registering..." : "Register Customer"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegistration;
