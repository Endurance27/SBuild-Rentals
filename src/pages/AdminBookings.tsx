import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Eye, Loader2, Check, X, FileText, Receipt } from "lucide-react";
import { format } from "date-fns";

type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  pickup_method: string;
  delivery_address: string | null;
  pickup_date: string;
  return_date: string;
  total_cost: number;
  status: BookingStatus;
  created_at: string;
}

interface BookingItem {
  id: string;
  item_name: string;
  quantity: number;
  daily_price: number;
  rental_days: number;
  subtotal: number;
}

const statusColors: Record<BookingStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingItems, setBookingItems] = useState<BookingItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleViewDetails = async (booking: Booking) => {
    setSelectedBooking(booking);
    const { data } = await supabase
      .from("booking_items")
      .select("*")
      .eq("booking_id", booking.id);
    setBookingItems(data || []);
    setDialogOpen(true);
  };

  const fetchBookingItems = async (bookingId: string) => {
    const { data } = await supabase
      .from("booking_items")
      .select("*")
      .eq("booking_id", bookingId);
    return data || [];
  };

  const sendEmail = async (booking: Booking, type: "invoice" | "receipt") => {
    setSendingEmail(`${booking.id}-${type}`);
    try {
      const items = await fetchBookingItems(booking.id);
      
      const { data, error } = await supabase.functions.invoke("send-booking-email", {
        body: {
          type,
          booking: {
            id: booking.id,
            customer_name: booking.customer_name,
            customer_email: booking.customer_email,
            customer_phone: booking.customer_phone,
            pickup_date: booking.pickup_date,
            return_date: booking.return_date,
            pickup_method: booking.pickup_method,
            delivery_address: booking.delivery_address,
            total_cost: booking.total_cost,
          },
          items,
        },
      });

      if (error) throw error;

      toast({
        title: "Email Sent",
        description: `${type === "invoice" ? "Invoice" : "Receipt"} sent to ${booking.customer_email}`,
      });
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send email",
        variant: "destructive",
      });
    } finally {
      setSendingEmail(null);
    }
  };

  const handleApprove = async (booking: Booking) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: "confirmed" })
      .eq("id", booking.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Booking Approved", description: "Sending receipt to customer..." });
      await sendEmail(booking, "receipt");
      fetchBookings();
    }
  };

  const handleReject = async (booking: Booking) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", booking.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Booking Rejected", description: "Booking has been cancelled" });
      fetchBookings();
    }
  };

  const handleMarkComplete = async (bookingId: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: "completed" })
      .eq("id", bookingId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Booking marked as completed" });
      fetchBookings();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Bookings</h1>
          <p className="text-muted-foreground mt-1">Manage customer bookings - approve, reject, and send invoices</p>
        </div>

        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No bookings yet.
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.customer_name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{booking.customer_email}</div>
                        <div className="text-muted-foreground">{booking.customer_phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Pickup: {format(new Date(booking.pickup_date), "MMM dd, yyyy")}</div>
                        <div>Return: {format(new Date(booking.return_date), "MMM dd, yyyy")}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">₵{Number(booking.total_cost).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[booking.status]}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {booking.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => sendEmail(booking, "invoice")}
                              disabled={sendingEmail === `${booking.id}-invoice`}
                              title="Send Invoice"
                            >
                              {sendingEmail === `${booking.id}-invoice` ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <FileText className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleApprove(booking)}
                              className="bg-green-600 hover:bg-green-700"
                              title="Approve Booking"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleReject(booking)}
                              title="Reject Booking"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {booking.status === "confirmed" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => sendEmail(booking, "receipt")}
                              disabled={sendingEmail === `${booking.id}-receipt`}
                              title="Resend Receipt"
                            >
                              {sendingEmail === `${booking.id}-receipt` ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Receipt className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleMarkComplete(booking.id)}
                              title="Mark Complete"
                            >
                              <Check className="h-4 w-4 mr-1" /> Complete
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(booking)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={statusColors[selectedBooking.status]}>
                    {selectedBooking.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    #{selectedBooking.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Customer:</span>
                    <p className="font-medium">{selectedBooking.customer_name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p className="font-medium">{selectedBooking.customer_email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone:</span>
                    <p className="font-medium">{selectedBooking.customer_phone}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pickup Method:</span>
                    <p className="font-medium capitalize">{selectedBooking.pickup_method}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pickup Date:</span>
                    <p className="font-medium">
                      {format(new Date(selectedBooking.pickup_date), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Return Date:</span>
                    <p className="font-medium">
                      {format(new Date(selectedBooking.return_date), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>

                {selectedBooking.delivery_address && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Delivery Address:</span>
                    <p className="font-medium">{selectedBooking.delivery_address}</p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Items</h4>
                  <div className="space-y-2">
                    {bookingItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.item_name} × {item.quantity} ({item.rental_days} days)
                        </span>
                        <span className="font-medium">₵{Number(item.subtotal).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-bold mt-4 pt-2 border-t">
                    <span>Total</span>
                    <span>₵{Number(selectedBooking.total_cost).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  {selectedBooking.status === "pending" && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => sendEmail(selectedBooking, "invoice")}
                        disabled={sendingEmail === `${selectedBooking.id}-invoice`}
                      >
                        {sendingEmail === `${selectedBooking.id}-invoice` ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <FileText className="h-4 w-4 mr-2" />
                        )}
                        Send Invoice
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          handleApprove(selectedBooking);
                          setDialogOpen(false);
                        }}
                      >
                        <Check className="h-4 w-4 mr-2" /> Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleReject(selectedBooking);
                          setDialogOpen(false);
                        }}
                      >
                        <X className="h-4 w-4 mr-2" /> Reject
                      </Button>
                    </>
                  )}
                  {selectedBooking.status === "confirmed" && (
                    <Button
                      variant="outline"
                      onClick={() => sendEmail(selectedBooking, "receipt")}
                      disabled={sendingEmail === `${selectedBooking.id}-receipt`}
                    >
                      {sendingEmail === `${selectedBooking.id}-receipt` ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Receipt className="h-4 w-4 mr-2" />
                      )}
                      Resend Receipt
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
