-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  type TEXT NOT NULL DEFAULT 'particular' CHECK (type IN ('particular', 'stand')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Businesses table (for stands/dealers)
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  nif TEXT NOT NULL,
  address TEXT,
  city TEXT,
  district TEXT,
  logo_url TEXT,
  description TEXT,
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'pro')),
  subscription_active BOOLEAN NOT NULL DEFAULT false,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(profile_id),
  UNIQUE(nif)
);

-- Cars table
CREATE TABLE cars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  version TEXT,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2030),
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  mileage INTEGER NOT NULL DEFAULT 0 CHECK (mileage >= 0),
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('gasolina', 'diesel', 'eletrico', 'hibrido', 'hibrido_plugin', 'gpl', 'gnc')),
  transmission TEXT NOT NULL CHECK (transmission IN ('manual', 'automatica')),
  power_hp INTEGER,
  engine_cc INTEGER,
  color TEXT,
  doors INTEGER CHECK (doors >= 2 AND doors <= 6),
  seats INTEGER CHECK (seats >= 1 AND seats <= 9),
  vin TEXT,
  description TEXT,
  condition TEXT NOT NULL DEFAULT 'usado' CHECK (condition IN ('novo', 'usado')),
  district TEXT NOT NULL,
  city TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'paused', 'expired')),
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Car photos table
CREATE TABLE car_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Favorites table
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(profile_id, car_id)
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'basic', 'pro')),
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  UNIQUE(business_id)
);

-- Indexes for performance
CREATE INDEX idx_cars_seller ON cars(seller_id);
CREATE INDEX idx_cars_business ON cars(business_id);
CREATE INDEX idx_cars_status ON cars(status);
CREATE INDEX idx_cars_make_model ON cars(make, model);
CREATE INDEX idx_cars_price ON cars(price);
CREATE INDEX idx_cars_year ON cars(year);
CREATE INDEX idx_cars_district ON cars(district);
CREATE INDEX idx_cars_fuel_type ON cars(fuel_type);
CREATE INDEX idx_cars_created ON cars(created_at DESC);
CREATE INDEX idx_car_photos_car ON car_photos(car_id);
CREATE INDEX idx_favorites_profile ON favorites(profile_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id, read);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Businesses: public read, owner write
CREATE POLICY "Businesses are viewable by everyone" ON businesses FOR SELECT USING (true);
CREATE POLICY "Users can manage own business" ON businesses FOR ALL USING (auth.uid() = profile_id);

-- Cars: active cars public, owner manages all
CREATE POLICY "Active cars are viewable by everyone" ON cars FOR SELECT USING (status = 'active' OR auth.uid() = seller_id);
CREATE POLICY "Users can insert own cars" ON cars FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Users can update own cars" ON cars FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Users can delete own cars" ON cars FOR DELETE USING (auth.uid() = seller_id);

-- Car photos: public read for active cars, owner manages
CREATE POLICY "Car photos are viewable by everyone" ON car_photos FOR SELECT USING (true);
CREATE POLICY "Users can manage own car photos" ON car_photos FOR ALL USING (
  EXISTS (SELECT 1 FROM cars WHERE cars.id = car_photos.car_id AND cars.seller_id = auth.uid())
);

-- Favorites: own only
CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can manage own favorites" ON favorites FOR ALL USING (auth.uid() = profile_id);

-- Messages: sender and receiver can read
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Receiver can mark as read" ON messages FOR UPDATE USING (auth.uid() = receiver_id);

-- Subscriptions: business owner only
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (
  EXISTS (SELECT 1 FROM businesses WHERE businesses.id = subscriptions.business_id AND businesses.profile_id = auth.uid())
);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'type', 'particular')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_cars_updated_at
  BEFORE UPDATE ON cars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
