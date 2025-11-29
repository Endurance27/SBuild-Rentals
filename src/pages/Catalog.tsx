import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CatalogGrid from "@/components/CatalogGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Catalog = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                Our Rental Catalog
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Browse our complete selection of quality event rental items. All prices shown are per day.
              </p>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-5 mb-8">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="chair">Chairs</TabsTrigger>
                <TabsTrigger value="table">Tables</TabsTrigger>
                <TabsTrigger value="canopy">Canopies</TabsTrigger>
                <TabsTrigger value="mat">Mats</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="animate-fade-in">
                <CatalogGrid />
              </TabsContent>

              <TabsContent value="chair" className="animate-fade-in">
                <CatalogGrid category="chair" />
              </TabsContent>

              <TabsContent value="table" className="animate-fade-in">
                <CatalogGrid category="table" />
              </TabsContent>

              <TabsContent value="canopy" className="animate-fade-in">
                <CatalogGrid category="canopy" />
              </TabsContent>

              <TabsContent value="mat" className="animate-fade-in">
                <CatalogGrid category="mat" />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Catalog;
