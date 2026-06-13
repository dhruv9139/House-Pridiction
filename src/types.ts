export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isBlocked: boolean;
  createdAt: string;
}

export interface Prediction {
  id: string;
  userId: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  parking: number;
  age: number;
  location: string;
  furnishing: "unfurnished" | "semi-furnished" | "fully-furnished";
  propertyType: "apartment" | "villa" | "house" | "penthouse";
  latitude: number;
  longitude: number;
  predictedPrice: number;
  confidenceScore: number;
  priceRange: { min: number; max: number };
  futureValue1Year: number;
  futureValue3Years: number;
  futureValue5Years: number;
  marketTrend: "bullish" | "stable" | "bearish";
  timestamp: string;
  imageUrl?: string;
  imageScore?: number;
}

export interface Favorite {
  id: string;
  userId: string;
  title: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  parking: number;
  age: number;
  location: string;
  furnishing: string;
  propertyType: string;
  price: number;
  roi: number; // calculated annual ROI
  appreciation: number; // 5-year appreciation factor
}

export interface DatasetRecord {
  id: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  parking: number;
  age: number;
  location: string;
  furnishing: "unfurnished" | "semi-furnished" | "fully-furnished";
  propertyType: "apartment" | "villa" | "house" | "penthouse";
  price: number;
}

export interface ModelPerformance {
  name: string;
  accuracy: number;
  r2: number;
  mae: number;
  rmse: number;
  isBest: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface EMIResult {
  monthlyEMI: number;
  totalInterest: number;
  totalAmount: number;
}

export interface NearbyFacility {
  name: string;
  type: string;
  distance: string; // e.g. "0.5 km"
  duration: string; // e.g. "3 mins walk"
  rating: number;
  lat: number;
  lng: number;
}
