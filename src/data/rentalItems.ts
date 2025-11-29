import { RentalItem } from "@/types/rental";
import chairsImg from "@/assets/chairs.jpg";
import tablesImg from "@/assets/tables.jpg";
import canopyImg from "@/assets/canopy.jpg";
import matImg from "@/assets/mat.jpg";

export const rentalItems: RentalItem[] = [
  {
    id: "chair-001",
    name: "Premium Plastic Chair",
    category: "chair",
    description: "Comfortable white plastic chairs, perfect for any event. Stackable and easy to arrange.",
    dailyPrice: 3,
    image: chairsImg,
    availableQuantity: 500,
  },
  {
    id: "table-001",
    name: "Round Folding Table",
    category: "table",
    description: "Sturdy round tables suitable for 6-8 people. Easy to set up and clean.",
    dailyPrice: 15,
    image: tablesImg,
    availableQuantity: 100,
  },
  {
    id: "table-002",
    name: "Rectangular Banquet Table",
    category: "table",
    description: "Long rectangular tables ideal for buffets and large gatherings. Seats up to 10 people.",
    dailyPrice: 20,
    image: tablesImg,
    availableQuantity: 80,
  },
  {
    id: "canopy-001",
    name: "Large Event Canopy",
    category: "canopy",
    description: "Spacious white canopy tent providing shelter for outdoor events. Professional grade.",
    dailyPrice: 100,
    image: canopyImg,
    availableQuantity: 30,
  },
  {
    id: "canopy-002",
    name: "Medium Party Canopy",
    category: "canopy",
    description: "Mid-size canopy perfect for intimate gatherings and small parties.",
    dailyPrice: 70,
    image: canopyImg,
    availableQuantity: 50,
  },
  {
    id: "mat-001",
    name: "Woven Canopy Mat",
    category: "mat",
    description: "Natural fiber mats for canopy flooring. Comfortable and elegant.",
    dailyPrice: 5,
    image: matImg,
    availableQuantity: 200,
  },
];
