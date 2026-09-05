'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  Address,
  CartItem,
  CartVariant,
  Product,
  PromoCode,
  User,
} from '@sport-store/shared';
import { PROMO_CODES, SHIPPING_METHODS } from '@sport-store/shared';
import { appConfig } from '@/lib/config';
import { api } from '@/lib/api';

export type ToastKind = 'success' | 'error' | 'info';
export type ToastItem = { id: number; message: string; kind: ToastKind };

type CartSnapshot = {
  items: CartItem[];
  count: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  promo: PromoCode | null;
  shippingMethodId: string;
  shippingMethods: Array<(typeof SHIPPING_METHODS)[number] & { price: number }>;
};

type StoreContextValue = {
  ready: boolean;
  cart: CartSnapshot;
  wishlistIds: string[];
  user: User | null;
  drawerOpen: boolean;
  toasts: ToastItem[];
  addresses: Address[];
  openDrawer: () => void;
  closeDrawer: () => void;
  toast: (message: string, kind?: ToastKind) => void;
  dismissToast: (id: number) => void;
  addToCart: (
    product: Product,
    quantity?: number,
    variant?: CartVariant,
    opts?: { silent?: boolean; openDrawer?: boolean }
  ) => void;
  updateCart: (id: string, quantity: number, variant?: CartVariant) => void;
  removeFromCart: (id: string, variant?: CartVariant) => void;
  clearCart: () => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  setShippingMethod: (id: string) => void;
  toggleWishlist: (id: string) => boolean;
  isWishlisted: (id: string) => boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { email: string; password: string; name?: string }) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<User>) => Promise<User>;
  listAddresses: () => Address[];
  addAddress: (address: Omit<Address, 'id' | 'isDefault'>) => Address;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

function variantKey(v: CartVariant = {}) {
  return JSON.stringify(v);
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [promo, setPromo] = useState<PromoCode | null>(null);
  const [shippingMethodId, setShippingMethodId] = useState('standard');
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem(appConfig.CART_KEY) || '[]'));
      setPromo(JSON.parse(localStorage.getItem(appConfig.PROMO_KEY) || 'null'));
      setShippingMethodId(localStorage.getItem(appConfig.SHIPPING_METHOD_KEY) || 'standard');
      setWishlistIds(JSON.parse(localStorage.getItem(appConfig.WISHLIST_KEY) || '[]'));
      setAddresses(JSON.parse(localStorage.getItem(appConfig.ADDRESSES_KEY) || '[]'));
      const rawUser = localStorage.getItem(appConfig.USER_KEY);
      setUser(rawUser ? JSON.parse(rawUser) : null);
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  const toast = useCallback((message: string, kind: ToastKind = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const persistCart = useCallback(
    (nextItems: CartItem[], nextPromo: PromoCode | null, nextShip: string) => {
      localStorage.setItem(appConfig.CART_KEY, JSON.stringify(nextItems));
      if (nextPromo) localStorage.setItem(appConfig.PROMO_KEY, JSON.stringify(nextPromo));
      else localStorage.removeItem(appConfig.PROMO_KEY);
      localStorage.setItem(appConfig.SHIPPING_METHOD_KEY, nextShip);
    },
    []
  );

  const subtotal = useMemo(
    () => items.reduce((n, i) => n + i.price * i.quantity, 0),
    [items]
  );

  const discount = useMemo(() => {
    if (!promo || !items.length) return 0;
    if (promo.minSubtotal && subtotal < promo.minSubtotal) return 0;
    if (promo.type === 'percent') return +(subtotal * (promo.value / 100)).toFixed(2);
    if (promo.type === 'fixed') return Math.min(promo.value, subtotal);
    return 0;
  }, [promo, items.length, subtotal]);

  const shippingMethods = useMemo(
    () =>
      SHIPPING_METHODS.map((m) => {
        let price = m.price;
        if (m.freeOver != null && subtotal >= m.freeOver) price = 0;
        if (promo?.type === 'shipping') price = 0;
        return { ...m, price };
      }),
    [subtotal, promo]
  );

  const shipping = useMemo(() => {
    if (!items.length) return 0;
    const method =
      shippingMethods.find((m) => m.id === shippingMethodId) || shippingMethods[0];
    return method?.price ?? appConfig.SHIPPING_COST;
  }, [items.length, shippingMethods, shippingMethodId]);

  const tax = useMemo(
    () => +(Math.max(0, subtotal - discount) * appConfig.TAX_RATE).toFixed(2),
    [subtotal, discount]
  );

  const total = useMemo(
    () => +(subtotal - discount + shipping + tax).toFixed(2),
    [subtotal, discount, shipping, tax]
  );

  const cart: CartSnapshot = {
    items,
    count: items.reduce((n, i) => n + i.quantity, 0),
    subtotal,
    discount,
    shipping,
    tax,
    total,
    promo,
    shippingMethodId,
    shippingMethods,
  };

  const addToCart: StoreContextValue['addToCart'] = (
    product,
    quantity = 1,
    variant = {},
    opts = {}
  ) => {
    const key = variantKey(variant);
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id && variantKey(i.variant) === key);
      let next: CartItem[];
      if (existing) {
        next = prev.map((i) =>
          i === existing
            ? {
                ...i,
                quantity: Math.min(i.quantity + quantity, product.stock || 99),
              }
            : i
        );
      } else {
        next = [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            sport: product.sport,
            category: product.category,
            quantity,
            variant,
            maxStock: product.stock || 10,
          },
        ];
      }
      persistCart(next, promo, shippingMethodId);
      return next;
    });
    if (!opts.silent) toast('Added to cart', 'success');
    if (opts.openDrawer !== false) setDrawerOpen(true);
  };

  const updateCart = (id: string, quantity: number, variant: CartVariant = {}) => {
    const key = variantKey(variant);
    setItems((prev) => {
      const next = prev.map((i) =>
        i.id === id && variantKey(i.variant) === key
          ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxStock || 99)) }
          : i
      );
      persistCart(next, promo, shippingMethodId);
      return next;
    });
  };

  const removeFromCart = (id: string, variant: CartVariant = {}) => {
    const key = variantKey(variant);
    setItems((prev) => {
      const next = prev.filter((i) => !(i.id === id && variantKey(i.variant) === key));
      persistCart(next, promo, shippingMethodId);
      return next;
    });
    toast('Removed from cart', 'info');
  };

  const clearCart = () => {
    setItems([]);
    setPromo(null);
    persistCart([], null, shippingMethodId);
  };

  const applyPromo = (code: string) => {
    const key = String(code || '').trim().toUpperCase();
    const found = PROMO_CODES[key];
    if (!found) {
      toast('Invalid promo code', 'error');
      return false;
    }
    if (found.minSubtotal && subtotal < found.minSubtotal) {
      toast(`Spend $${found.minSubtotal} to use ${found.code}`, 'error');
      return false;
    }
    setPromo(found);
    persistCart(items, found, shippingMethodId);
    toast(`Promo applied: ${found.label}`, 'success');
    return true;
  };

  const removePromo = () => {
    setPromo(null);
    persistCart(items, null, shippingMethodId);
    toast('Promo removed', 'info');
  };

  const setShippingMethod = (id: string) => {
    if (!SHIPPING_METHODS.some((m) => m.id === id)) return;
    setShippingMethodId(id);
    persistCart(items, promo, id);
  };

  const toggleWishlist = (id: string) => {
    const added = !wishlistIds.includes(id);
    const next = added ? [...wishlistIds, id] : wishlistIds.filter((x) => x !== id);
    setWishlistIds(next);
    localStorage.setItem(appConfig.WISHLIST_KEY, JSON.stringify(next));
    toast(added ? 'Saved to wishlist' : 'Removed from wishlist', added ? 'success' : 'info');
    return added;
  };

  const isWishlisted = (id: string) => wishlistIds.includes(id);

  const persistUser = (u: User | null, token?: string | null) => {
    setUser(u);
    if (u && token) {
      localStorage.setItem(appConfig.USER_KEY, JSON.stringify(u));
      localStorage.setItem(appConfig.TOKEN_KEY, token);
    } else if (!u) {
      localStorage.removeItem(appConfig.USER_KEY);
      localStorage.removeItem(appConfig.TOKEN_KEY);
    } else {
      localStorage.setItem(appConfig.USER_KEY, JSON.stringify(u));
    }
  };

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    persistUser(res.data.user, res.data.token);
    toast('Welcome back!', 'success');
    return res.data.user;
  };

  const register = async (data: { email: string; password: string; name?: string }) => {
    const res = await api.register(data);
    persistUser(res.data.user, res.data.token);
    toast('Account created', 'success');
    return res.data.user;
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      /* ignore */
    }
    persistUser(null);
    toast('Signed out', 'info');
  };

  const updateProfile = async (profile: Partial<User>) => {
    const res = await api.updateProfile(profile);
    const token = localStorage.getItem(appConfig.TOKEN_KEY);
    persistUser(res.data, token);
    toast('Profile updated', 'success');
    return res.data;
  };

  const saveAddresses = (list: Address[]) => {
    setAddresses(list);
    localStorage.setItem(appConfig.ADDRESSES_KEY, JSON.stringify(list));
  };

  const addAddress = (address: Omit<Address, 'id' | 'isDefault'>) => {
    const entry: Address = {
      id: 'a' + Date.now(),
      ...address,
      isDefault: addresses.length === 0,
    };
    saveAddresses([...addresses, entry]);
    return entry;
  };

  const removeAddress = (id: string) => {
    saveAddresses(addresses.filter((a) => a.id !== id));
  };

  const setDefaultAddress = (id: string) => {
    saveAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const value: StoreContextValue = {
    ready,
    cart,
    wishlistIds,
    user,
    drawerOpen,
    toasts,
    addresses,
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
    toast,
    dismissToast,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart,
    applyPromo,
    removePromo,
    setShippingMethod,
    toggleWishlist,
    isWishlisted,
    login,
    register,
    logout,
    updateProfile,
    listAddresses: () => addresses,
    addAddress,
    removeAddress,
    setDefaultAddress,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export function trackRecent(productId: string) {
  if (typeof window === 'undefined') return;
  let list: string[] = [];
  try {
    list = JSON.parse(localStorage.getItem(appConfig.RECENT_KEY) || '[]');
  } catch {
    list = [];
  }
  list = [productId, ...list.filter((id) => id !== productId)].slice(0, 12);
  localStorage.setItem(appConfig.RECENT_KEY, JSON.stringify(list));
}

export function getRecentIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(appConfig.RECENT_KEY) || '[]');
  } catch {
    return [];
  }
}
