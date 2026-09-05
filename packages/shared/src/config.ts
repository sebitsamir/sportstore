import type { PromoCode, ShippingMethod } from './types';

/** Defaults shared by web + api. Web may override via NEXT_PUBLIC_* env. */
export const CONFIG = {
  BRAND: 'Sport Store',
  API_BASE_URL: 'http://localhost:3001/api',
  USE_MOCK: true,
  CURRENCY: 'USD',
  LOCALE: 'en-US',
  TAX_RATE: 0.08,
  SHIPPING_COST: 7.99,
  FREE_SHIPPING_THRESHOLD: 75,
  ITEMS_PER_PAGE: 12,
  TOKEN_KEY: 'ss_auth_token',
  USER_KEY: 'ss_user',
  CART_KEY: 'ss_cart',
  WISHLIST_KEY: 'ss_wishlist',
  PROMO_KEY: 'ss_promo',
  SHIPPING_METHOD_KEY: 'ss_shipping_method',
  RECENT_KEY: 'ss_recent',
  ADDRESSES_KEY: 'ss_addresses',
  REVIEWS_KEY: 'ss_reviews',
} as const;

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard',
    eta: '5–7 business days',
    price: 7.99,
    freeOver: 75,
  },
  {
    id: 'express',
    name: 'Express',
    eta: '2–3 business days',
    price: 14.99,
    freeOver: null,
  },
  {
    id: 'overnight',
    name: 'Overnight',
    eta: '1 business day',
    price: 24.99,
    freeOver: null,
  },
];

export const PROMO_CODES: Record<string, PromoCode> = {
  PITCH10: { code: 'PITCH10', type: 'percent', value: 10, label: '10% off' },
  COURT15: { code: 'COURT15', type: 'percent', value: 15, label: '15% off', minSubtotal: 100 },
  FREESHIP: { code: 'FREESHIP', type: 'shipping', value: 0, label: 'Free shipping' },
  WELCOME20: { code: 'WELCOME20', type: 'fixed', value: 20, label: '$20 off', minSubtotal: 80 },
};

export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  PRODUCT_BY_ID: '/products/:id',
  RELATED_PRODUCTS: '/products/:id/related',
  PRODUCT_REVIEWS: '/products/:id/reviews',
  CATEGORIES: '/categories',
  CART: '/cart',
  CART_ADD: '/cart/add',
  CART_UPDATE: '/cart/update/:id',
  CART_REMOVE: '/cart/remove/:id',
  PROMO_VALIDATE: '/promo/validate',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  FORGOT_PASSWORD: '/auth/forgot-password',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_BY_ID: '/orders/:id',
  USER_PROFILE: '/user/profile',
  USER_ORDERS: '/user/orders',
  USER_WISHLIST: '/user/wishlist',
  USER_ADDRESSES: '/user/addresses',
  CONTACT: '/contact',
  NEWSLETTER: '/newsletter',
  HEALTH: '/health',
} as const;

export const SPORTS = {
  football: {
    id: 'football' as const,
    name: 'Football',
    tagline: 'Built for the pitch',
    href: '/football',
  },
  basketball: {
    id: 'basketball' as const,
    name: 'Basketball',
    tagline: 'Court-ready gear',
    href: '/basketball',
  },
};

export const CATEGORIES = [
  { id: 'footwear', name: 'Footwear', sports: ['football', 'basketball'] },
  { id: 'jerseys', name: 'Jerseys', sports: ['football', 'basketball'] },
  { id: 'balls', name: 'Balls', sports: ['football', 'basketball'] },
  { id: 'equipment', name: 'Equipment', sports: ['football', 'basketball'] },
  { id: 'apparel', name: 'Apparel', sports: ['football', 'basketball'] },
  { id: 'accessories', name: 'Accessories', sports: ['football', 'basketball'] },
];
