export type UserType = "particular" | "stand";
export type CarStatus = "active" | "sold" | "paused" | "expired";
export type FuelType = "gasolina" | "diesel" | "eletrico" | "hibrido" | "hibrido_plugin" | "gpl" | "gnc";
export type TransmissionType = "manual" | "automatica";
export type CarCondition = "novo" | "usado";
export type SubscriptionTier = "free" | "basic" | "pro";

export interface Profile {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  type: UserType;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  profile_id: string;
  name: string;
  nif: string;
  address: string | null;
  city: string | null;
  district: string | null;
  logo_url: string | null;
  description: string | null;
  subscription_tier: SubscriptionTier;
  subscription_active: boolean;
  stripe_customer_id: string | null;
  created_at: string;
}

export interface Car {
  id: string;
  seller_id: string;
  business_id: string | null;
  make: string;
  model: string;
  version: string | null;
  year: number;
  price: number;
  mileage: number;
  fuel_type: FuelType;
  transmission: TransmissionType;
  power_hp: number | null;
  engine_cc: number | null;
  color: string | null;
  doors: number | null;
  seats: number | null;
  vin: string | null;
  description: string | null;
  condition: CarCondition;
  district: string;
  city: string | null;
  status: CarStatus;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface CarPhoto {
  id: string;
  car_id: string;
  url: string;
  position: number;
  is_primary: boolean;
  created_at: string;
}

export interface Favorite {
  id: string;
  profile_id: string;
  car_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  car_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  business_id: string;
  stripe_subscription_id: string | null;
  tier: SubscriptionTier;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
}

// Extended types with relations
export interface CarWithPhotos extends Car {
  car_photos: CarPhoto[];
}

export interface CarWithDetails extends CarWithPhotos {
  profiles: Pick<Profile, "name" | "phone" | "type">;
  businesses?: Pick<Business, "name" | "logo_url"> | null;
}

// Portuguese districts
export const DISTRICTS = [
  "Aveiro", "Beja", "Braga", "Bragança", "Castelo Branco",
  "Coimbra", "Évora", "Faro", "Guarda", "Leiria",
  "Lisboa", "Portalegre", "Porto", "Santarém", "Setúbal",
  "Viana do Castelo", "Vila Real", "Viseu", "Açores", "Madeira",
] as const;

// Common car makes in Portugal
export const CAR_MAKES = [
  "Audi", "BMW", "Citroën", "Dacia", "Fiat", "Ford", "Honda",
  "Hyundai", "Kia", "Land Rover", "Mazda", "Mercedes-Benz",
  "Mini", "Mitsubishi", "Nissan", "Opel", "Peugeot", "Porsche",
  "Renault", "Seat", "Škoda", "Smart", "Suzuki", "Tesla",
  "Toyota", "Volkswagen", "Volvo",
] as const;

export const FUEL_TYPES: FuelType[] = [
  "gasolina", "diesel", "eletrico", "hibrido", "hibrido_plugin", "gpl", "gnc",
];

export const TRANSMISSION_TYPES: TransmissionType[] = ["manual", "automatica"];
