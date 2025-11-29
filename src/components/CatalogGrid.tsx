import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { RentalItem } from "@/types/rental";
import { rentalItems } from "@/data/rentalItems";
import BookingDialog from "./BookingDialog";

interface CatalogGridProps {
  category?: string;
}

const CatalogGrid = ({ category }: CatalogGridProps) => {
  const [selectedItem, setSelectedItem] = useState<RentalItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredItems = category
    ? rentalItems.filter((item) => item.category === category)
    : rentalItems;

  const handleSelectItem = (item: RentalItem) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  return (
    <>
      <BookingDialog
        item={selectedItem}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredItems.map((item) => (
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
