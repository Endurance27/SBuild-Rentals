import { format } from "date-fns";
import { X, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface BookingItem {
  name: string;
  quantity: number;
  dailyPrice: number;
  rentalDays: number;
  totalPrice: number;
}

interface InvoicePreviewProps {
  open: boolean;
  onClose: () => void;
  booking: {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    pickupDate: Date;
    returnDate: Date;
    pickupMethod: string;
    deliveryAddress?: string;
    totalCost: number;
  };
  items: BookingItem[];
  onSendEmail?: () => void;
  isSending?: boolean;
}

const InvoicePreview = ({ open, onClose, booking, items, onSendEmail, isSending }: InvoicePreviewProps) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Invoice Preview</span>
            <div className="flex gap-2">
              {onSendEmail && (
                <Button size="sm" onClick={onSendEmail} disabled={isSending}>
                  <Mail className="h-4 w-4 mr-2" />
                  {isSending ? "Sending..." : "Send Email"}
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={handlePrint}>
                <Download className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="bg-background border border-border rounded-lg overflow-hidden print:border-none" id="invoice-content">
          {/* Header */}
          <div className="bg-foreground text-background p-6 text-center">
            <h1 className="text-2xl font-bold">SBuild Rentals - Invoice</h1>
            <p className="text-background/80 mt-1">
              Booking #{booking.id.slice(0, 8).toUpperCase()}
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Dear {booking.customerName},</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for your booking request. Please find the invoice details below. 
              Payment is required to confirm your booking.
            </p>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Pickup Date</p>
                <p className="font-medium">{format(booking.pickupDate, "d MMMM yyyy")}</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Return Date</p>
                <p className="font-medium">{format(booking.returnDate, "d MMMM yyyy")}</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Pickup Method</p>
                <p className="font-medium">
                  {booking.pickupMethod === "delivery" ? "Delivery" : "Self Pickup"}
                </p>
              </div>
              {booking.deliveryAddress && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Delivery Address</p>
                  <p className="font-medium">{booking.deliveryAddress}</p>
                </div>
              )}
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{booking.customerEmail}</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="font-medium">{booking.customerPhone}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-border rounded-lg overflow-hidden mb-6">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium">Item</th>
                    <th className="text-center p-3 text-sm font-medium">Qty</th>
                    <th className="text-center p-3 text-sm font-medium">Days</th>
                    <th className="text-right p-3 text-sm font-medium">Price/Day</th>
                    <th className="text-right p-3 text-sm font-medium">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="border-t border-border">
                      <td className="p-3">{item.name}</td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-center">{item.rentalDays}</td>
                      <td className="p-3 text-right">₵{item.dailyPrice.toFixed(2)}</td>
                      <td className="p-3 text-right font-medium">₵{item.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="flex justify-end">
              <div className="bg-primary/10 px-6 py-3 rounded-lg">
                <span className="text-lg font-bold">
                  Total Amount Due: <span className="text-primary">₵{booking.totalCost.toFixed(2)}</span>
                </span>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <p className="font-semibold mb-2">Payment Instructions:</p>
              <p className="text-sm text-muted-foreground">
                Please make payment via Mobile Money or Bank Transfer and reply to the invoice email with proof of payment.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border p-4 text-center text-sm text-muted-foreground">
            <p>If you have any questions, please contact us.</p>
            <p className="font-medium mt-1">SBuild Rentals</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoicePreview;
