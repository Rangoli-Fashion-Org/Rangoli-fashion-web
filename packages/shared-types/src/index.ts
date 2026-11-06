// Domain Enums
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  CUSTOMER = 'CUSTOMER',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  RAZORPAY = 'RAZORPAY',
  COD = 'COD',
}

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export enum InventoryMovementType {
  RESTOCK = 'RESTOCK',
  SALE = 'SALE',
  RETURN = 'RETURN',
  ADJUSTMENT = 'ADJUSTMENT',
  DAMAGE = 'DAMAGE',
}

// User & Auth
export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  user: UserProfile;
}

// Addresses
export interface Address {
  id: string;
  userId?: string | null;
  fullName: string;
  phoneNumber: string;
  street: string;
  apartment?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

// Catalog Models
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
  isActive: boolean;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  publicId: string;
  altText?: string | null;
  displayOrder: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  size: string; // e.g. "XS", "S", "M", "L", "XL", "XXL"
  color: string; // e.g. "Emerald Green", "Blush Pink"
  colorHex?: string | null;
  priceOverride?: number | null;
  stockQuantity: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string | null;
  regularPrice: number;
  salePrice?: number | null;
  discountPercentage?: number | null;
  stockQuantity: number;
  material?: string | null;
  careInstructions?: string | null;
  isNewArrival: boolean;
  isFeatured: boolean;
  isActive: boolean;
  categoryId?: string | null;
  collectionId?: string | null;
  brandId?: string | null;
  category?: Category | null;
  collection?: Collection | null;
  brand?: Brand | null;
  images: ProductImage[];
  variants: ProductVariant[];
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

// Cart
export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  unitPrice: number;
  product: Product;
  variant?: ProductVariant | null;
}

export interface Cart {
  id: string;
  userId?: string | null;
  sessionId?: string | null;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  total: number;
  couponCode?: string | null;
}

// Order
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string | null;
  productName: string;
  sku: string;
  variantDescription?: string | null;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  imageUrl?: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  userEmail: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: Address;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  trackingNumber?: string | null;
  trackingCourier?: string | null;
  notes?: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// CMS Models
export interface HeroBanner {
  id: string;
  title: string;
  subtitle?: string | null;
  desktopImageUrl: string;
  mobileImageUrl?: string | null;
  ctaText: string;
  ctaUrl: string;
  displayOrder: number;
  isActive: boolean;
}

export interface HomepageSection {
  id: string;
  sectionKey: string;
  title: string;
  subtitle?: string | null;
  displayOrder: number;
  isVisible: boolean;
  customData?: Record<string, any> | null;
}

export interface StoreSetting {
  id: string;
  key: string;
  value: string;
  group: 'GENERAL' | 'SHIPPING' | 'PAYMENT' | 'POLICY' | 'SOCIAL' | 'CONTACT';
}

export interface Review {
  id: string;
  productId: string;
  userId?: string | null;
  authorName: string;
  rating: number; // 1 to 5
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description?: string | null;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue?: number | null;
  maxDiscount?: number | null;
  expiryDate?: string | null;
  usageLimit?: number | null;
  usageCount: number;
  isActive: boolean;
}

// Standard API Response Envelope
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

