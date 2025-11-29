export interface RentalItem {
  id: string;
  name: string;
  category: "chair" | "table" | "canopy" | "mat";
  description: string;
  dailyPrice: number;
  image: string;
  availableQuantity: number;
}

export interface BookingItem extends RentalItem {
  quantity: number;
  rentalDays: number;
  totalPrice: number;
}

export interface Booking {
  id: string;
  items: BookingItem[];
  pickupDate: Date;
  returnDate: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupMethod: "self-pickup" | "delivery";
  pickupLocation?: string;
  totalCost: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: Date;
}
