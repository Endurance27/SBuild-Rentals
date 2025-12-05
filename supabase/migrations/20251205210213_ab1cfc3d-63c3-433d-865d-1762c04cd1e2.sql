-- Drop existing restrictive policies and create permissive ones for public booking creation
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can create booking items" ON public.booking_items;

-- Create permissive policies for anonymous booking creation
CREATE POLICY "Anyone can create bookings" 
ON public.bookings 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can create booking items" 
ON public.booking_items 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);