import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingItem {
  item_name: string;
  quantity: number;
  daily_price: number;
  rental_days: number;
  subtotal: number;
}

interface BookingEmailRequest {
  type: "invoice" | "receipt";
  booking: {
    id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    pickup_date: string;
    return_date: string;
    pickup_method: string;
    delivery_address?: string;
    total_cost: number;
  };
  items: BookingItem[];
}

const generateInvoiceHTML = (booking: BookingEmailRequest["booking"], items: BookingItem[]) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .items-table th, .items-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
    .items-table th { background: #f5f5f5; }
    .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0; }
    .info-item { padding: 10px; background: #f9f9f9; }
    .label { color: #666; font-size: 12px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>SBuild Rentals - Invoice</h1>
    <p>Booking #${booking.id.slice(0, 8).toUpperCase()}</p>
  </div>
  <div class="content">
    <h2>Dear ${booking.customer_name},</h2>
    <p>Thank you for your booking request. Please find the invoice details below. Payment is required to confirm your booking.</p>
    
    <div class="info-grid">
      <div class="info-item">
        <div class="label">Pickup Date</div>
        <div>${new Date(booking.pickup_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
      </div>
      <div class="info-item">
        <div class="label">Return Date</div>
        <div>${new Date(booking.return_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
      </div>
      <div class="info-item">
        <div class="label">Pickup Method</div>
        <div>${booking.pickup_method === 'delivery' ? 'Delivery' : 'Self Pickup'}</div>
      </div>
      ${booking.delivery_address ? `
      <div class="info-item">
        <div class="label">Delivery Address</div>
        <div>${booking.delivery_address}</div>
      </div>
      ` : ''}
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Days</th>
          <th>Price/Day</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => `
        <tr>
          <td>${item.item_name}</td>
          <td>${item.quantity}</td>
          <td>${item.rental_days}</td>
          <td>₵${Number(item.daily_price).toFixed(2)}</td>
          <td>₵${Number(item.subtotal).toFixed(2)}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="total">Total Amount Due: ₵${Number(booking.total_cost).toFixed(2)}</div>

    <p style="margin-top: 30px;"><strong>Payment Instructions:</strong></p>
    <p>Please make payment via Mobile Money or Bank Transfer and reply to this email with proof of payment.</p>
  </div>
  <div class="footer">
    <p>If you have any questions, please contact us.</p>
    <p>SBuild Rentals</p>
  </div>
</body>
</html>
`;

const generateReceiptHTML = (booking: BookingEmailRequest["booking"], items: BookingItem[]) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #16a34a; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .items-table th, .items-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
    .items-table th { background: #f5f5f5; }
    .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0; }
    .info-item { padding: 10px; background: #f9f9f9; }
    .label { color: #666; font-size: 12px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .status { background: #dcfce7; color: #166534; padding: 10px 20px; border-radius: 8px; display: inline-block; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>SBuild Rentals - Receipt</h1>
    <p>Booking #${booking.id.slice(0, 8).toUpperCase()}</p>
  </div>
  <div class="content">
    <h2>Dear ${booking.customer_name},</h2>
    <p class="status">✓ Payment Confirmed - Booking Approved</p>
    <p>Thank you for your payment. Your booking has been confirmed. Please see the details below:</p>
    
    <div class="info-grid">
      <div class="info-item">
        <div class="label">Pickup Date</div>
        <div>${new Date(booking.pickup_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
      </div>
      <div class="info-item">
        <div class="label">Return Date</div>
        <div>${new Date(booking.return_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
      </div>
      <div class="info-item">
        <div class="label">Pickup Method</div>
        <div>${booking.pickup_method === 'delivery' ? 'Delivery' : 'Self Pickup'}</div>
      </div>
      ${booking.delivery_address ? `
      <div class="info-item">
        <div class="label">Delivery Address</div>
        <div>${booking.delivery_address}</div>
      </div>
      ` : ''}
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Days</th>
          <th>Price/Day</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => `
        <tr>
          <td>${item.item_name}</td>
          <td>${item.quantity}</td>
          <td>${item.rental_days}</td>
          <td>₵${Number(item.daily_price).toFixed(2)}</td>
          <td>₵${Number(item.subtotal).toFixed(2)}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="total">Total Paid: ₵${Number(booking.total_cost).toFixed(2)}</div>

    <p style="margin-top: 30px;">Please keep this receipt for your records.</p>
  </div>
  <div class="footer">
    <p>Thank you for choosing SBuild Rentals!</p>
    <p>If you have any questions, please contact us.</p>
  </div>
</body>
</html>
`;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, booking, items }: BookingEmailRequest = await req.json();
    
    console.log(`Sending ${type} email to ${booking.customer_email}`);

    const html = type === "invoice" 
      ? generateInvoiceHTML(booking, items)
      : generateReceiptHTML(booking, items);

    const subject = type === "invoice"
      ? `SBuild Rentals - Invoice for Booking #${booking.id.slice(0, 8).toUpperCase()}`
      : `SBuild Rentals - Receipt for Booking #${booking.id.slice(0, 8).toUpperCase()}`;

    const emailResponse = await resend.emails.send({
      from: "SBuild Rentals <onboarding@resend.dev>",
      to: [booking.customer_email],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
