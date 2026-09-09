// =========================================================
// Shared TypeScript types for eCommerceKume frontend
// =========================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  _count?: { products: number };
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  benefits: string[];
  objectives: string[];
  price: number;
  currency: string;
  fileUrl: string;
  previewUrl: string | null;
  coverImage: string;
  images: string[];
  fileType: string;
  fileSizeBytes: number;
  pageCount: number | null;
  previewPages: number;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
  // Optional event-like fields
  duration?: string | null;
  targetAudience?: string | null;
  attendeeCount?: string | null;
  // Enriched fields
  avgStars?: number | null;
  totalSales?: number;
  _count?: { orderItems: number; reviews: number };
}

export interface Review {
  id: string;
  productId: string;
  stars: number;
  comment: string | null;
  authorName: string;
  verified: boolean;
  approved: boolean;
  createdAt: string;
  product?: Pick<Product, 'id' | 'title' | 'coverImage' | 'slug'>;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  price: number;
  product: Pick<Product, 'id' | 'title' | 'coverImage' | 'slug'>;
}

export interface Order {
  id: string;
  buyerEmail: string;
  buyerName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'DELIVERED';
  mpPaymentId: string | null;
  mpPreferenceId: string | null;
  total: number;
  currency: string;
  items: OrderItem[];
  downloadToken: string | null;
  tokenExpiresAt: string | null;
  emailSentAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: Pagination;
}

export interface ExchangeRate {
  usdToArs: number;
  updatedAt: string;
}

export interface AdminStats {
  todaySales: number;
  monthSales: number;
  approvedOrdersCount: number;
  topProducts: {
    productId: string;
    productTitle: string;
    coverImage: string;
    totalSales: number;
    totalRevenue: number;
  }[];
  recentOrders: Order[];
}

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
}

// Checkout
export interface CheckoutBody {
  items: { productId: string; quantity: number }[];
  buyerName: string;
  buyerEmail: string;
}

export interface CheckoutResponse {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint: string;
}
