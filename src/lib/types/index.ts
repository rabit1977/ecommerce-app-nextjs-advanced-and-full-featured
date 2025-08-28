export interface Product {
  id: string;
  title: string;
  brand: string;
  price: number;
  rating: number;
  reviewCount: number;
  category: string;
  stock: number;
  description: string;
  images?: string[];
  options?: ProductOption[];
  reviews?: Review[];
}


export interface ProductOption {
  name: string;
  type: 'color' | 'size';
  variants: ProductVariant[];
}

export interface ProductVariant {
  name: string;
  value: string;
  image?: string;
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  helpful: number;
}

export interface User {
  name: string;
  email: string;
  password: string;
}

export interface CartItem {
  id: string;
  cartItemId: string;
  title: string;
  price: number;
  quantity: number;
  options: Record<string, string>;
  image: string;  
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  taxes: number;
  discountAmount: number;
  total: number;
  shippingInfo: ShippingInfo;
  shippingMethod: string;
  paymentInfo: PaymentInfo;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface PaymentInfo {
  cardNumber: string;
  nameOnCard: string;
  expiry: string;
  cvc: string;
}

export interface AppState {
  user: User | null;
  users: User[]; // Add this line
  cart: CartItem[];
  wishlist: Set<string>;
  orders: Order[];
  products: Product[];
  savedForLater: CartItem[];
  theme: 'light' | 'dark';
  searchQuery: string;
  isMenuOpen: boolean;
  selectedProductId: string | null;
  quickViewProductId: string | null;
  selectedOrder: string | null;
  toast: string | null;
}
export interface AppContextType extends AppState {
  // Navigation functions
  setPage: (page: string) => void;
  viewProduct: (productId: string) => void;
  viewOrder: (orderId: string) => void;
  
  // ... (rest of the existing functions)
}

// Add a helper function to get safe images
export const getProductImages = (product: Product): string[] => {
  if (!product.images || product.images.length === 0) {
    return ['/images/placeholder.jpg'];
  }
  return product.images.filter(img => img && img !== '');
};