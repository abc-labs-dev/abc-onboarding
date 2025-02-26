
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface Customer {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  customer_type: string;
  products: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

const CustomerList = () => {
  const navigate = useNavigate();
  const [openCustomers, setOpenCustomers] = useState<string[]>([]);

  const { data: customers, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data: customersData, error: customersError } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (customersError) throw customersError;

      const customersWithProducts = await Promise.all(
        (customersData || []).map(async (customer) => {
          const { data: productsData } = await supabase
            .from("products")
            .select("*")
            .eq("customer_id", customer.id);

          return {
            ...customer,
            products: productsData || [],
          };
        })
      );

      return customersWithProducts as Customer[];
    },
  });

  const toggleCustomer = (customerId: string) => {
    setOpenCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-32" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
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
            <h1 className="text-3xl font-bold">Customers</h1>
            <p className="text-muted-foreground">
              View and manage all registered customers
            </p>
          </div>

          <div className="space-y-4">
            {customers?.map((customer) => (
              <Collapsible
                key={customer.id}
                open={openCustomers.includes(customer.id)}
                onOpenChange={() => toggleCustomer(customer.id)}
                className="border rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {customer.company_name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {customer.contact_name}
                    </p>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      {openCustomers.includes(customer.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent className="mt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <p className="text-sm">{customer.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Phone</label>
                        <p className="text-sm">{customer.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Customer Type</label>
                        <p className="text-sm">{customer.customer_type}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Products</h3>
                      <div className="space-y-2">
                        {customer.products.length > 0 ? (
                          customer.products.map((product) => (
                            <div
                              key={product.id}
                              className="flex justify-between items-center bg-muted p-2 rounded"
                            >
                              <span>{product.name}</span>
                              <span className="font-medium">
                                ${product.price.toFixed(2)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No products registered
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}

            {customers?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No customers found</p>
                <Button
                  variant="outline"
                  onClick={() => navigate("/customer/new")}
                  className="mt-4"
                >
                  Register New Customer
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
