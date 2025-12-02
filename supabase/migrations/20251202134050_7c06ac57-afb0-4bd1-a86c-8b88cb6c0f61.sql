-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create enum for booking status
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- Create enum for pickup method
CREATE TYPE public.pickup_method AS ENUM ('self-pickup', 'delivery');

-- Create rental_items table (admin managed)
CREATE TABLE public.rental_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  daily_price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  available_quantity INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  pickup_method pickup_method NOT NULL DEFAULT 'self-pickup',
  delivery_address TEXT,
  pickup_date DATE NOT NULL,
  return_date DATE NOT NULL,
  total_cost DECIMAL(10,2) NOT NULL,
  status booking_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create booking_items table (items in each booking)
CREATE TABLE public.booking_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES public.rental_items(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  daily_price DECIMAL(10,2) NOT NULL,
  rental_days INTEGER NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);

-- Create user_roles table for admin access
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.rental_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create has_role function for checking user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for rental_items (public read, admin write)
CREATE POLICY "Anyone can view active rental items"
  ON public.rental_items FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all rental items"
  ON public.rental_items FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert rental items"
  ON public.rental_items FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update rental items"
  ON public.rental_items FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete rental items"
  ON public.rental_items FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for bookings (anyone can insert, admin can view all)
CREATE POLICY "Anyone can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for booking_items
CREATE POLICY "Anyone can create booking items"
  ON public.booking_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all booking items"
  ON public.booking_items FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles (only admins can manage)
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_rental_items_updated_at
  BEFORE UPDATE ON public.rental_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default rental items
INSERT INTO public.rental_items (name, category, description, daily_price, available_quantity) VALUES
  ('Premium Plastic Chair', 'chair', 'Comfortable white plastic chairs, perfect for any event. Stackable and easy to arrange.', 3.00, 500),
  ('Round Folding Table', 'table', 'Sturdy round tables suitable for 6-8 people. Easy to set up and clean.', 15.00, 100),
  ('Rectangular Banquet Table', 'table', 'Long rectangular tables ideal for buffets and large gatherings. Seats up to 10 people.', 20.00, 80),
  ('Large Event Canopy', 'canopy', 'Spacious white canopy tent providing shelter for outdoor events. Professional grade.', 100.00, 30),
  ('Medium Party Canopy', 'canopy', 'Mid-size canopy perfect for intimate gatherings and small parties.', 70.00, 50),
  ('Woven Canopy Mat', 'mat', 'Natural fiber mats for canopy flooring. Comfortable and elegant.', 5.00, 200);