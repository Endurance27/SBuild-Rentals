import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Loader2 } from "lucide-react";
import { RentalItem } from "@/types/rental";
import BookingDialog from "./BookingDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import chairsImg from "@/assets/chairs.jpg";
import tablesImg from "@/assets/tables.jpg";
import canopyImg from "@/assets/canopy.jpg";
import matImg from "@/assets/mat.jpg";

interface CatalogGridProps {
  category?: string;
}

// Map category to default image
const getCategoryImage = (category: string): string => {
  switch (category) {
    case "chair":
      return chairsImg;
    case "table":
      return tablesImg;
    case "canopy":
      return canopyImg;
    case "mat":
      return matImg;
    default:
      return chairsImg;
  }
};

const CatalogGrid = ({ category }: CatalogGridProps) => {
  const [selectedItem, setSelectedItem] = useState<RentalItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["rental-items", category],
    queryFn: async () => {
      let query = supabase
        .from("rental_items")
        .select("*")
        .eq("is_active", true);
      
      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query.order("name");
      
      if (error) throw error;
      
      // Transform database items to RentalItem format
      return data.map((item): RentalItem => ({
        id: item.id,
        name: item.name,
        category: item.category as "chair" | "table" | "canopy" | "mat",
        description: item.description || "",
        dailyPrice: Number(item.daily_price),
        image: item.image_url || getCategoryImage(item.category),
        availableQuantity: item.available_quantity,
      }));
    },
  });

  const handleSelectItem = (item: RentalItem) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No items available in this category.
      </div>
    );
  }

  return (
    <>
      <BookingDialog
        item={selectedItem}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card
          key={item.id}
          className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-gradient-card border-border group"
        >
          <div className="relative overflow-hidden h-64">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <Badge className="absolute top-4 right-4 bg-gradient-warm border-0">
              {item.availableQuantity} Available
            </Badge>
          </div>
          <CardHeader>
            <CardTitle className="text-foreground">{item.name}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {item.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">₵{item.dailyPrice}</span>
              <span className="text-muted-foreground">per day</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-gradient-warm hover:opacity-90 transition-opacity"
              onClick={() => handleSelectItem(item)}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Select Item
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
    </>
  );
};

export default CatalogGrid;
