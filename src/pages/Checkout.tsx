import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, removeItem, totalCost, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    pickupMethod: "self-pickup" as "self-pickup" | "delivery",
    pickupLocation: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      navigate("/catalog");
    }
  }, [items.length, navigate]);

  if (items.length === 0) {
    return null;
  }

  // Get the earliest pickup date and latest return date from all items
  const pickupDate = items.reduce((earliest, item) => 
    !earliest || item.pickupDate < earliest ? item.pickupDate : earliest, 
    items[0]?.pickupDate
  );
  
  const returnDate = items.reduce((latest, item) => 
    !latest || item.returnDate > latest ? item.returnDate : latest, 
    items[0]?.returnDate
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.customerName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your full name",
        variant: "destructive",
      });
      return;
    }

    if (!formData.customerEmail.trim() || !formData.customerEmail.includes("@")) {
      toast({
        title: "Valid email required",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (!formData.customerPhone.trim()) {
      toast({
        title: "Phone required",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    if (formData.pickupMethod === "delivery" && !formData.pickupLocation.trim()) {
      toast({
        title: "Delivery location required",
        description: "Please enter your delivery address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert booking into database
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          customer_name: formData.customerName,
          customer_email: formData.customerEmail,
          customer_phone: formData.customerPhone,
          pickup_method: formData.pickupMethod,
          delivery_address: formData.pickupMethod === "delivery" ? formData.pickupLocation : null,
          pickup_date: format(pickupDate, "yyyy-MM-dd"),
          return_date: format(returnDate, "yyyy-MM-dd"),
          total_cost: totalCost,
          status: "pending",
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Insert all booking items
      const bookingItems = items.map((item) => ({
        booking_id: booking.id,
        item_id: item.id,
        item_name: item.name,
        quantity: item.quantity,
        daily_price: item.dailyPrice,
        rental_days: item.rentalDays,
        subtotal: item.totalPrice,
      }));

      const { error: itemsError } = await supabase
        .from("booking_items")
        .insert(bookingItems);

      if (itemsError) throw itemsError;

      toast({
        title: "Booking submitted!",
        description: "You will receive an invoice via email shortly.",
      });

      // Clear cart and navigate
      clearCart();
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast({
        title: "Error",
        description: "Failed to submit booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-subtle">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container-custom">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Customer Information Form */}
            <div>
              <h1 className="text-3xl font-display font-bold mb-6">
                Checkout
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Your Information</h2>

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => handleInputChange("customerName", e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                      placeholder="+233 XX XXX XXXX"
                      required
                    />
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Pickup Details</h2>

                  <div className="space-y-3">
                    <Label>Pickup Method *</Label>
                    <RadioGroup
                      value={formData.pickupMethod}
                      onValueChange={(value) =>
                        handleInputChange("pickupMethod", value)
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="self-pickup" id="self-pickup" />
                        <Label htmlFor="self-pickup" className="cursor-pointer">
                          Self Pickup (Free)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="delivery" id="delivery" />
                        <Label htmlFor="delivery" className="cursor-pointer">
                          Delivery (Additional fees may apply)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.pickupMethod === "delivery" && (
                    <div className="space-y-2">
                      <Label htmlFor="location">Delivery Address *</Label>
                      <Input
                        id="location"
                        type="text"
                        value={formData.pickupLocation}
                        onChange={(e) =>
                          handleInputChange("pickupLocation", e.target.value)
                        }
                        placeholder="Enter your delivery address"
                        required
                      />
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-warm hover:opacity-90 transition-opacity"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Booking & Get Invoice"}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary ({items.length} items)</h2>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {items.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="border-b border-border pb-4">
                      <div className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × {item.rentalDays} days
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(item.pickupDate, "MMM d")} - {format(item.returnDate, "MMM d")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">₵{item.totalPrice.toFixed(2)}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dates */}
                <div className="border-t border-b border-border py-4 mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pickup Date:</span>
                    <span className="font-medium">
                      {format(pickupDate, "PPP")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Return Date:</span>
                    <span className="font-medium">
                      {format(returnDate, "PPP")}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Cost:</span>
                    <span className="text-2xl font-bold text-primary">
                      ₵{totalCost.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground mt-4">
                  <p className="font-medium mb-1">Next Steps:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>You'll receive an invoice via email and SMS</li>
                    <li>Make payment using the provided methods</li>
                    <li>Receive a receipt after successful payment</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
