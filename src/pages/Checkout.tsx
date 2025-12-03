import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format, addDays } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookingItem } from "@/types/rental";

interface CheckoutState {
  item: BookingItem;
}

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const bookingData = (location.state as CheckoutState)?.item;

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    pickupMethod: "self-pickup" as "self-pickup" | "delivery",
    pickupLocation: "",
  });

  useEffect(() => {
    if (!bookingData) {
      navigate("/catalog");
    }
  }, [bookingData, navigate]);

  if (!bookingData) {
    return null;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

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
          pickup_date: format(bookingData.pickupDate, "yyyy-MM-dd"),
          return_date: format(bookingData.returnDate, "yyyy-MM-dd"),
          total_cost: bookingData.totalPrice,
          status: "pending",
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Insert booking item
      const { error: itemError } = await supabase
        .from("booking_items")
        .insert({
          booking_id: booking.id,
          item_id: bookingData.id,
          item_name: bookingData.name,
          quantity: bookingData.quantity,
          daily_price: bookingData.dailyPrice,
          rental_days: bookingData.rentalDays,
          subtotal: bookingData.totalPrice,
        });

      if (itemError) throw itemError;

      toast({
        title: "Booking submitted!",
        description: "You will receive an invoice via email shortly.",
      });

      // Navigate back to home after submission
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
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="space-y-4">
                  {/* Item Details */}
                  <div className="border-b border-border pb-4">
                    <div className="flex gap-4">
                      <img
                        src={bookingData.image}
                        alt={bookingData.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{bookingData.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {bookingData.quantity}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Rental Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Daily Rate:</span>
                      <span className="font-medium">₵{bookingData.dailyPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="font-medium">{bookingData.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rental Days:</span>
                      <span className="font-medium">{bookingData.rentalDays} days</span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="border-t border-b border-border py-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pickup Date:</span>
                      <span className="font-medium">
                        {format(new Date(bookingData.pickupDate), "PPP")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Return Date:</span>
                      <span className="font-medium">
                        {format(new Date(bookingData.returnDate), "PPP")}
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Cost:</span>
                      <span className="text-2xl font-bold text-primary">
                        ₵{bookingData.totalPrice.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      (₵{bookingData.dailyPrice} × {bookingData.quantity} × {bookingData.rentalDays} days)
                    </p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
