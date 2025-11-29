import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle } from "lucide-react";

const About = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                About SBuild Rentals
              </h1>
              <p className="text-lg text-muted-foreground">
                Your trusted partner for quality event rentals in Ghana
              </p>
            </div>

            <div className="prose prose-lg max-w-none animate-fade-in" style={{ animationDelay: "100ms" }}>
              <div className="bg-card rounded-lg p-8 shadow-lg border border-border mb-8">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Who We Are
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  SBuild Rentals is Ghana's premier event rental service, providing high-quality chairs, tables, 
                  canopies, and mats for all types of occasions. From intimate family gatherings to large corporate 
                  events, we ensure your celebration has everything it needs to succeed.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Founded with a commitment to excellence and customer satisfaction, we've become the go-to choice 
                  for event planners, individuals, and businesses across the region.
                </p>
              </div>

              <div className="bg-card rounded-lg p-8 shadow-lg border border-border mb-8">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
                  Why Choose Us
                </h2>
                <div className="space-y-4">
                  {[
                    "Premium quality equipment maintained to the highest standards",
                    "Transparent daily pricing with no hidden fees",
                    "Easy online booking system with instant confirmations",
                    "Flexible rental periods to suit your needs",
                    "Reliable delivery and pickup services",
                    "Responsive customer support before, during, and after your event",
                    "Large inventory ensuring availability for events of any size",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <p className="text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-warm rounded-lg p-8 shadow-lg text-center">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                  Our Mission
                </h2>
                <p className="text-primary-foreground/90 text-lg leading-relaxed">
                  To make every event memorable by providing exceptional rental services that combine quality, 
                  affordability, and reliability. We're not just renting equipment—we're helping create experiences 
                  that last a lifetime.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default About;
