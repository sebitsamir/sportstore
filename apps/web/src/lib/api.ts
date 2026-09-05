import {
  API_ENDPOINTS,
  type Order,
  type Product,
  type ProductFilters,
  type User,
} from '@sport-store/shared';
import { appConfig } from '@/lib/config';
import {
  PRODUCTS,
  filterProducts,
  getBrands,
  getProductById,
  getRelatedProducts,
} from '@/data/catalog';

type ApiResult<T> = { data: T; meta?: { total: number; page: number; limit: number; pages: number } };

class ApiService {
  private baseURL = appConfig.API_BASE_URL;

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token =
      typeof window !== 'undefined' ? localStorage.getItem(appConfig.TOKEN_KEY) : null;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error((data as { message?: string }).message || 'Request failed');
    return data as T;
  }

  async getProducts(params: ProductFilters = {}): Promise<ApiResult<Product[]>> {
    if (appConfig.USE_MOCK) {
      const items = filterProducts(params);
      const page = Number(params.page) || 1;
      const limit = Number(params.limit) || appConfig.ITEMS_PER_PAGE;
      const start = (page - 1) * limit;
      const slice = items.slice(start, start + limit);
      return {
        data: slice,
        meta: { total: items.length, page, limit, pages: Math.ceil(items.length / limit) || 1 },
      };
    }
    const qs = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v != null && v !== '')
        .flatMap(([k, v]) =>
          Array.isArray(v) ? v.map((item) => [k, String(item)]) : [[k, String(v)]]
        )
    ).toString();
    return this.request(`${API_ENDPOINTS.PRODUCTS}?${qs}`);
  }

  async getProductById(id: string): Promise<ApiResult<Product>> {
    if (appConfig.USE_MOCK) {
      const product = getProductById(id);
      if (!product) throw new Error('Product not found');
      return { data: product };
    }
    return this.request(API_ENDPOINTS.PRODUCT_BY_ID.replace(':id', id));
  }

  async getRelatedProducts(id: string): Promise<ApiResult<Product[]>> {
    if (appConfig.USE_MOCK) {
      const product = getProductById(id);
      return { data: product ? getRelatedProducts(product) : [] };
    }
    return this.request(API_ENDPOINTS.RELATED_PRODUCTS.replace(':id', id));
  }

  async getBrands(sport?: string): Promise<ApiResult<string[]>> {
    if (appConfig.USE_MOCK) return { data: getBrands(sport) };
    return this.request(
      `${API_ENDPOINTS.CATEGORIES}/brands${sport ? `?sport=${sport}` : ''}`
    );
  }

  async searchProducts(q: string) {
    return this.getProducts({ q, limit: 8 });
  }

  async login(email: string, password: string) {
    if (appConfig.USE_MOCK) {
      if (!email || !password) throw new Error('Email and password required');
      const user: User = {
        id: 'u1',
        name: email.split('@')[0],
        email,
        createdAt: new Date().toISOString(),
      };
      const token = 'mock_' + btoa(email);
      return { data: { user, token } };
    }
    return this.request<{ data: { user: User; token: string } }>(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: { email: string; password: string; name?: string }) {
    if (appConfig.USE_MOCK) {
      if (!userData.email || !userData.password) throw new Error('Missing fields');
      const user: User = {
        id: 'u' + Date.now(),
        name: userData.name || userData.email.split('@')[0],
        email: userData.email,
        createdAt: new Date().toISOString(),
      };
      const token = 'mock_' + btoa(userData.email);
      return { data: { user, token } };
    }
    return this.request<{ data: { user: User; token: string } }>(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    if (appConfig.USE_MOCK) return { data: { ok: true } };
    return this.request(API_ENDPOINTS.LOGOUT, { method: 'POST' });
  }

  async getCurrentUser() {
    if (appConfig.USE_MOCK) {
      const raw = localStorage.getItem(appConfig.USER_KEY);
      if (!raw) throw new Error('Not authenticated');
      return { data: JSON.parse(raw) as User };
    }
    return this.request<{ data: User }>(API_ENDPOINTS.ME);
  }

  async checkout(orderData: Record<string, unknown>) {
    if (appConfig.USE_MOCK) {
      const orderId = 'SS' + Date.now().toString(36).toUpperCase();
      const created = new Date();
      const tracking = buildTrackingTimeline(created);
      const order: Order = {
        id: orderId,
        ...orderData,
        status: 'processing',
        trackingNumber: 'TRK' + Date.now().toString().slice(-8),
        carrier:
          orderData.shippingMethodId === 'overnight'
            ? 'Priority Air'
            : 'SportStore Logistics',
        tracking,
        createdAt: created.toISOString(),
        estimatedDelivery: tracking.find((t) => t.key === 'delivered')?.at,
      };
      const orders = JSON.parse(localStorage.getItem('ss_orders') || '[]') as Order[];
      orders.unshift(order);
      localStorage.setItem('ss_orders', JSON.stringify(orders));
      return { data: order };
    }
    return this.request<{ data: Order }>(API_ENDPOINTS.CHECKOUT, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders() {
    if (appConfig.USE_MOCK) {
      return { data: JSON.parse(localStorage.getItem('ss_orders') || '[]') as Order[] };
    }
    return this.request<{ data: Order[] }>(API_ENDPOINTS.USER_ORDERS);
  }

  async getOrderById(id: string) {
    if (appConfig.USE_MOCK) {
      const orders = JSON.parse(localStorage.getItem('ss_orders') || '[]') as Order[];
      const order = orders.find((o) => o.id === id);
      if (!order) throw new Error('Order not found');
      return { data: advanceMockTracking(order) };
    }
    return this.request<{ data: Order }>(API_ENDPOINTS.ORDER_BY_ID.replace(':id', id));
  }

  async forgotPassword(email: string) {
    if (appConfig.USE_MOCK) {
      if (!email) throw new Error('Email required');
      return {
        data: { ok: true, message: 'If that email exists, a reset link was sent (demo).' },
      };
    }
    return this.request<{ data: { ok: boolean; message: string } }>(API_ENDPOINTS.FORGOT_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async newsletter(email: string) {
    if (appConfig.USE_MOCK) {
      const list = JSON.parse(localStorage.getItem('ss_newsletter') || '[]') as string[];
      if (!list.includes(email)) list.push(email);
      localStorage.setItem('ss_newsletter', JSON.stringify(list));
      return { data: { ok: true, message: 'You are on the list — new drops coming.' } };
    }
    return this.request<{ data: { ok: boolean; message: string } }>(API_ENDPOINTS.NEWSLETTER, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async contact(payload: Record<string, string>) {
    if (appConfig.USE_MOCK) {
      return { data: { ok: true, message: 'Thanks — we will reply shortly.' } };
    }
    return this.request<{ data: { ok: boolean; message: string } }>(API_ENDPOINTS.CONTACT, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateProfile(profile: Partial<User>) {
    if (appConfig.USE_MOCK) {
      const raw = localStorage.getItem(appConfig.USER_KEY);
      if (!raw) throw new Error('Not authenticated');
      const user = { ...JSON.parse(raw), ...profile };
      localStorage.setItem(appConfig.USER_KEY, JSON.stringify(user));
      return { data: user as User };
    }
    return this.request<{ data: User }>(API_ENDPOINTS.USER_PROFILE, {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  getCatalogSize() {
    return PRODUCTS.length;
  }
}

function buildTrackingTimeline(created: Date) {
  const addDays = (d: Date, n: number) => {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x.toISOString();
  };
  return [
    { key: 'placed', label: 'Order placed', at: created.toISOString(), done: true },
    { key: 'processing', label: 'Processing in warehouse', at: addDays(created, 0), done: true },
    { key: 'shipped', label: 'Shipped', at: addDays(created, 1), done: false },
    { key: 'out', label: 'Out for delivery', at: addDays(created, 3), done: false },
    { key: 'delivered', label: 'Delivered', at: addDays(created, 5), done: false },
  ];
}

function advanceMockTracking(order: Order): Order {
  if (!order.tracking) return order;
  const ageHrs = (Date.now() - new Date(order.createdAt).getTime()) / 3600000;
  const tracking = order.tracking.map((step, i) => {
    const thresholds = [0, 0.1, 24, 72, 120];
    return { ...step, done: ageHrs >= thresholds[i] };
  });
  let status = 'processing';
  if (tracking.find((t) => t.key === 'delivered')?.done) status = 'delivered';
  else if (tracking.find((t) => t.key === 'out')?.done) status = 'out_for_delivery';
  else if (tracking.find((t) => t.key === 'shipped')?.done) status = 'shipped';
  return { ...order, tracking, status };
}

export const api = new ApiService();
