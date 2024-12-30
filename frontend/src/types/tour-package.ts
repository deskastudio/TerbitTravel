export interface TourPackage {
  id: string;
  name: string;
  destination: string;
  duration: string;
  price: number;
  description: string;
  availability: "Tersedia" | "Terbatas" | "Habis";
  category: "Populer" | "Promo" | "Flash Sale" | "Budaya" | "Sejarah" | "Petualangan";
  image: string;
  continent: "Asia" | "Eropa" | "Amerika Utara" | "Amerika Selatan" | "Afrika" | "Oseania";
  type: string[];
  itinerary: string[];
  included: string[];
  notIncluded: string[];
}