import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CatalogGrid from "@/components/CatalogGrid";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />

        {/* Featured Items Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Featured Rentals
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore our most popular items. All prices are calculated daily.
              </p>
            </div>

            <CatalogGrid />

            <div className="text-center mt-12 animate-fade-in">
              <Link to="/catalog">
                <Button size="lg" className="bg-gradient-warm hover:opacity-90 transition-opacity group">
                  View Full Catalog
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-warm">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto animate-fade-in">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
                Ready to Plan Your Event?
              </h2>
              <p className="text-lg text-primary-foreground/90 mb-8">
                Get started with our easy booking system. Select your items, choose your dates, 
                and receive instant quotes with transparent pricing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/catalog">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="text-lg px-8"
                  >
                    Browse Catalog
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Index;
