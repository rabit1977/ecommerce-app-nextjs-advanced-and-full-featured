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
  id: string;
  name: string;
  rating: number;
  comment: string;
  helpful: number;
  date: string;
}
export interface ReviewPayload {
  id?: string;
  name: string;
  rating: number;
  comment: string;
}

export interface AddReviewFormProps {
  productId: string;
  reviewToEdit?: Review | null; // New optional prop for editing
  onCancelEdit: () => void;
}

export interface User {
  id: string;
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
  users: User[]; 
  cart: CartItem[];
  wishlist: Set<string>;
  orders: Order[];
  products: Product[];
  savedForLater: CartItem[];
  theme: 'light' | 'dark';
  searchQuery: string;
  isLoading: boolean;
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
  login: (
    email: string,
    password: string
  ) => { success: boolean; message?: string };
  logout: () => void;
  signup: (
    name: string,
    email: string,
    password: string
  ) => { success: boolean; message?: string };
  addToCart: (item: Omit<CartItem, 'cartItemId' | 'image'>) => void;
  updateCartQuantity: (cartItemId: string, newQuantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  saveForLater: (cartItemId: string) => void;
  moveToCart: (cartItemId: string) => void;
  removeFromSaved: (cartItemId: string) => void;
  toggleWishlist: (productId: string) => void;
  placeOrder: (orderDetails: Omit<Order, 'id' | 'date'>) => string;
  addReview: (productId: string, review: ReviewPayload) => void;
  updateReviewHelpfulCount: (productId: string, reviewId: string) => void;
  showToast: (message: string) => void;
  setSearchQuery: (query: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setIsMenuOpen: (isOpen: boolean) => void;
  setQuickViewProductId: (productId: string | null) => void;
  
  // ... (rest of the existing functions)
}

// Add a helper function to get safe images
export const getProductImages = (product: Product): string[] => {
  if (!product.images || product.images.length === 0) {
    return ['/images/placeholder.jpg'];
  }
  return product.images.filter(img => img && img !== '');
};