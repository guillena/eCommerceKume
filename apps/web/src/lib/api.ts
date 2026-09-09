/**
 * API client — all fetch calls to the Express backend.
 * Next.js rewrites /api/* → http://localhost:3001/api/* in dev.
 */
import type {
  Product,
  Category,
  Review,
  Order,
  OrdersResponse,
  ExchangeRate,
  AdminStats,
  CheckoutBody,
  CheckoutResponse,
} from '@/types';

const BASE = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/api`;


async function request<T>(
  path: string,
  options?: RequestInit,
  token?: string,
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers ?? {}),
  };

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ─── Public APIs ────────────────────────────────────────────────────────────

export async function fetchProducts(params?: {
  category?: string;
  featured?: boolean;
  search?: string;
  limit?: number;
  page?: number;
}): Promise<Product[]> {
  const qs = new URLSearchParams();
  if (params?.category) qs.set('category', params.category);
  if (params?.featured) qs.set('featured', 'true');
  if (params?.search) qs.set('search', params.search);
  if (params?.limit) qs.set('limit', String(params.limit));
  if (params?.page) qs.set('page', String(params.page));
  return request<Product[]>(`/products?${qs.toString()}`);
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  return request<Product>(`/products/${slug}`);
}

export async function fetchCategories(): Promise<Category[]> {
  return request<Category[]>('/categories');
}

export async function fetchProductReviews(productId: string): Promise<Review[]> {
  return request<Review[]>(`/reviews/${productId}`);
}

export async function submitReview(data: {
  productId: string;
  stars: number;
  comment?: string;
  authorName: string;
}): Promise<Review> {
  return request<Review>('/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchExchangeRate(): Promise<ExchangeRate> {
  return request<ExchangeRate>('/exchange-rate');
}

export async function createCheckout(body: CheckoutBody): Promise<CheckoutResponse> {
  return request<CheckoutResponse>('/checkout', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function verifyDownloadToken(token: string): Promise<{
  valid: boolean;
  orderId?: string;
  items?: { title: string; downloadUrl: string }[];
}> {
  return request(`/download/verify?token=${encodeURIComponent(token)}`);
}

// ─── Admin APIs ──────────────────────────────────────────────────────────────

function adminToken(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('admin_token') ?? '';
}

export async function adminLogin(email: string, password: string): Promise<{ token: string }> {
  return request<{ token: string }>('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function adminFetchStats(): Promise<AdminStats> {
  return request<AdminStats>('/admin/stats', {}, adminToken());
}

export async function adminFetchProducts(): Promise<Product[]> {
  return request<Product[]>('/admin/products', {}, adminToken());
}

export async function adminCreateProduct(formData: FormData): Promise<Product> {
  const token = adminToken();
  const res = await fetch(`${BASE}/admin/products`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<Product>;
}

export async function adminUpdateProduct(id: string, formData: FormData): Promise<Product> {
  const token = adminToken();
  const res = await fetch(`${BASE}/admin/products/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<Product>;
}

export async function adminDeleteProduct(id: string, hard = false): Promise<void> {
  await request(`/admin/products/${id}?hard=${hard}`, { method: 'DELETE' }, adminToken());
}

export async function adminFetchOrders(params?: {
  status?: string;
  email?: string;
  page?: number;
  limit?: number;
}): Promise<OrdersResponse> {
  const qs = new URLSearchParams();
  if (params?.status) qs.set('status', params.status);
  if (params?.email) qs.set('email', params.email);
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  return request<OrdersResponse>(`/admin/orders?${qs.toString()}`, {}, adminToken());
}

export async function adminFetchOrder(id: string): Promise<Order> {
  return request<Order>(`/admin/orders/${id}`, {}, adminToken());
}

export async function adminResendEmail(orderId: string): Promise<{ success: boolean }> {
  return request(`/admin/orders/${orderId}/resend-email`, { method: 'POST' }, adminToken());
}

export async function adminFetchReviews(): Promise<Review[]> {
  return request<Review[]>('/admin/reviews', {}, adminToken());
}

export async function adminApproveReview(id: string, _approved: boolean): Promise<Review> {
  // The backend uses PUT to toggle the approved flag
  return request<Review>(`/admin/reviews/${id}`, {
    method: 'PUT',
  }, adminToken());
}

export async function adminDeleteReview(id: string): Promise<void> {
  await request(`/admin/reviews/${id}`, { method: 'DELETE' }, adminToken());
}

export async function adminFetchCategories(): Promise<Category[]> {
  return request<Category[]>('/categories', {}, adminToken());
}
