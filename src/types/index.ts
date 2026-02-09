// ============ Auth ============
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImg?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone?: string;
}

// ============ API Generic ============
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  errors?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============ Product ============
export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  sold: number;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  images: string[];
  category: Category;
  brand: Brand;
  ratingsAverage: number;
  ratingsQuantity: number;
}

export interface ProductListItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  sold: number;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  images?: string[];
  category: Category;
  brand: Brand;
  ratingsAverage: number;
  ratingsQuantity: number;
}

// ============ Category ============
export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

// ============ Brand ============
export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

// ============ Cart ============
export interface CartItem {
  id: string;
  _id?: string; // API may return _id for cart line item
  product: ProductListItem;
  price: number;
  count: number;
}

export interface CartResponse {
  status: string;
  numOfCartItems: number;
  data: {
    _id: string;
    cartOwner: string;
    products: CartItem[];
    totalCartPrice: number;
    createdAt: string;
    updatedAt: string;
  };
}

// ============ Wishlist ============
export interface WishlistResponse {
  status: string;
  count: number;
  data: ProductListItem[];
}

// ============ Order ============
export interface OrderProduct {
  product: string;
  count: number;
  price: number;
}

export interface Order {
  _id: string;
  user: string;
  cartItems: OrderProduct[];
  totalOrderPrice: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

export interface CreateOrderPayload {
  shippingAddress: ShippingAddress;
}

export interface OrdersResponse {
  data: Order[];
}

// ============ Products Query ============
export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  category?: string;
  brand?: string;
  keyword?: string;
}
