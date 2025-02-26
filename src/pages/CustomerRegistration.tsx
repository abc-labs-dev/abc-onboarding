
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
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Product {
  name: string;
  price: string;
}

const E2E_PRODUCTS = [
  { name: "Pre-employment testing - Digitally", price: "" },
  { name: "Pre-employment testing - In person", price: "" },
  { name: "Pre-employment testing - At ABC in Stockholm", price: "" },
  { name: "Randomized testing - Digitally", price: "" },
  { name: "Randomized testing - In person", price: "" },
  { name: "Incident (suspicion) testing - Digitally", price: "" },
  { name: "Incident (suspicion) testing - In person", price: "" },
  { name: "MRO services", price: "" },
  { name: "Policy guidance", price: "" },
  { name: "Internal training for managers", price: "" },
  { name: "EU Union discussion assistance", price: "" },
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
  });
  const [products, setProducts] = useState<Product[]>([{ name: "", price: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (formData.customerType === "e2e") {
      setProducts(E2E_PRODUCTS);
    } else if (formData.customerType === "wdt-tc") {
      setProducts([{ name: "", price: "" }]);
    }
  }, [formData.customerType]);

  const handleAddProduct = () => {
    setProducts([...products, { name: "", price: "" }]);
  };

  const handleRemoveProduct = (index: number) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts.length ? updatedProducts : [{ name: "", price: "" }]);
  };

  const handleProductChange = (index: number, field: keyof Product, value: string) => {
    const updatedProducts = products.map((product, i) => {
      if (i === index) {
        return { ...product, [field]: value };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

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

      // Then insert all products for this customer
      const { error: productsError } = await supabase.from("products").insert(
        products.map((product) => ({
          customer_id: customerData[0].id,
          name: product.name,
          price: parseFloat(product.price) || 0,
        }))
      );

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
              Enter customer details and their products
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

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Products</Label>
                  {formData.customerType !== "e2e" && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddProduct}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Product
                    </Button>
                  )}
                </div>

                {products.map((product, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-1">
                      <Label htmlFor={`product-name-${index}`}>Product Name</Label>
                      <Input
                        id={`product-name-${index}`}
                        value={product.name}
                        onChange={(e) =>
                          handleProductChange(index, "name", e.target.value)
                        }
                        required
                        readOnly={formData.customerType === "e2e"}
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`product-price-${index}`}>Price</Label>
                      <Input
                        id={`product-price-${index}`}
                        type="number"
                        step="0.01"
                        min="0"
                        value={product.price}
                        onChange={(e) =>
                          handleProductChange(index, "price", e.target.value)
                        }
                        required
                      />
                    </div>
                    {formData.customerType !== "e2e" && products.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-6"
                        onClick={() => handleRemoveProduct(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
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
