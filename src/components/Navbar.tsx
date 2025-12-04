import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import CartSheet from "@/components/CartSheet";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary" />
            <span className="font-display text-2xl font-bold text-foreground">
              SBuild Rentals
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/catalog" className="text-foreground hover:text-primary transition-colors">
              Catalog
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
            <CartSheet />
            <Link to="/catalog">
              <Button className="bg-gradient-warm hover:opacity-90 transition-opacity">
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <CartSheet />
            <button
              className="p-2 text-foreground"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/catalog"
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Catalog
              </Link>
              <Link
                to="/about"
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <Link to="/catalog" onClick={() => setIsOpen(false)}>
                <Button className="bg-gradient-warm hover:opacity-90 transition-opacity w-full">
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
