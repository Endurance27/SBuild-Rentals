import { Calendar, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-8 w-8 text-primary" />
              <span className="font-display text-2xl font-bold">SBuild Rentals</span>
            </div>
            <p className="text-secondary-foreground/80">
              Premium event rental services for memorable occasions in Ghana.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/catalog" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                Catalog
              </Link>
              <Link to="/about" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                About Us
              </Link>
            <Link to="/contact" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                Contact
              </Link>
              <Link to="/admin/login" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                Admin
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Our Services</h3>
            <div className="flex flex-col gap-2 text-secondary-foreground/80">
              <p>Chair Rentals</p>
              <p>Table Rentals</p>
              <p>Canopy Rentals</p>
              <p>Mat Rentals</p>
              <p>Event Delivery</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <div className="flex flex-col gap-3 text-secondary-foreground/80">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+233 XX XXX XXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@sbuildrentals.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Accra, Ghana</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-8 pt-8 text-center text-secondary-foreground/60">
          <p>&copy; {new Date().getFullYear()} SBuild Rentals. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
