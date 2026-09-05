export type SportId = 'football' | 'basketball';

export interface Product {
  id: string;
  name: string;
  sport: SportId;
  category: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  stock: number;
  badge?: 'sale' | 'new' | 'hot' | string;
  sizes: string[];
  colors: string[];
  image: string;
  images: string[];
  description: string;
  features: string[];
  featured?: boolean;
}

export interface CartVariant {
  size?: string;
  color?: string;
  [key: string]: string | undefined;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  sport: string;
  category: string;
  quantity: number;
  variant: CartVariant;
  maxStock: number;
}

export interface PromoCode {
  code: string;
  type: 'percent' | 'fixed' | 'shipping';
  value: number;
  label: string;
  minSubtotal?: number;
}

export interface ShippingMethod {
  id: string;
  name: string;
  eta: string;
  price: number;
  freeOver: number | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface Address {
  id: string;
  label?: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface TrackingStep {
  key: string;
  label: string;
  at: string;
  done: boolean;
}

export interface Order {
  id: string;
  items?: CartItem[];
  status: string;
  trackingNumber?: string;
  carrier?: string;
  tracking?: TrackingStep[];
  createdAt: string;
  estimatedDelivery?: string;
  subtotal?: number;
  discount?: number;
  shipping?: number;
  tax?: number;
  total?: number;
  shippingMethodId?: string;
  email?: string;
  shippingAddress?: Partial<Address>;
  [key: string]: unknown;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
}

export interface ProductFilters {
  sport?: string;
  category?: string | string[];
  brand?: string | string[];
  minPrice?: number | string;
  maxPrice?: number | string;
  q?: string;
  badge?: string;
  featured?: boolean | string;
  size?: string | string[];
  inStock?: boolean | string;
  onSale?: boolean | string;
  sort?: string;
  page?: number | string;
  limit?: number | string;
}

export interface Paginated<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
