import { Calendar, DollarSign, Truck, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Calendar,
    title: "Easy Booking",
    description: "Select your items, choose dates, and book in minutes with our simple online system.",
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description: "Clear daily rates with automatic calculation. No hidden fees, just honest pricing.",
  },
  {
    icon: Truck,
    title: "Delivery Available",
    description: "Choose self-pickup or delivery. We bring quality rentals right to your event location.",
  },
  {
    icon: Clock,
    title: "Flexible Duration",
    description: "Rent for as many days as you need. Pricing calculated automatically based on rental period.",
  },
];

const Features = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Why Choose SBuild Rentals?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We make event planning stress-free with quality equipment and exceptional service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-gradient-warm flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
