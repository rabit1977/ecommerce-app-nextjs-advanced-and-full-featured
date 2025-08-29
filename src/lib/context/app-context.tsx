'use client';

import { useRouter } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { initialProducts } from '../constants/products';
import { useLocalStorageReducer } from '../hooks/useLocalStorage';
import { AppState, CartItem, Order, Product, Review, User } from '../types'; // Ensure all types are imported

// Define a payload for adding/updating reviews
interface ReviewPayload {
  id?: number;
  name: string;
  rating: number;
  comment: string;
}

interface AppContextType extends AppState {
  // Navigation functions
  setPage: (page: string) => void;
  viewProduct: (productId: string) => void;
  viewOrder: (orderId: string) => void;

  // User actions
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

  // Cart actions
  addToCart: (item: Omit<CartItem, 'cartItemId' | 'image'>) => void;
  updateCartQuantity: (cartItemId: string, newQuantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  saveForLater: (cartItemId: string) => void;
  moveToCart: (cartItemId: string) => void;
  removeFromSaved: (cartItemId: string) => void;

  // Wishlist actions
  toggleWishlist: (productId: string) => void;

  // Order actions
  placeOrder: (orderDetails: Omit<Order, 'id' | 'date'>) => string;

  // Review actions
  addReview: (productId: string, review: ReviewPayload) => void; // Corrected signature
  updateReviewHelpfulCount: (productId: string, reviewId: number) => void;

  // UI actions
  showToast: (message: string) => void;
  setSearchQuery: (query: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setIsMenuOpen: (isOpen: boolean) => void;
  setQuickViewProductId: (productId: string | null) => void;
  setSelectedOrder: (orderId: string | null) => void;
  setSelectedProductId: (productId: string | null) => void;
}

// 1. FIXED: Define a strict type for all reducer actions
type AppAction =
  | { type: 'SET_INITIAL_STATE'; payload: Partial<AppState> }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'SET_WISHLIST'; payload: Set<string> }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_SAVED_FOR_LATER'; payload: CartItem[] }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_IS_MENU_OPEN'; payload: boolean }
  | { type: 'SET_SELECTED_PRODUCT_ID'; payload: string | null }
  | { type: 'SET_QUICK_VIEW_PRODUCT_ID'; payload: string | null }
  | { type: 'SET_SELECTED_ORDER'; payload: string | null }
  | { type: 'SET_TOAST'; payload: string | null };

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialState: AppState = {
  user: null,
  users: [],
  cart: [],
  wishlist: new Set(),
  orders: [],
  products: initialProducts,
  savedForLater: [],
  theme: 'light',
  searchQuery: '',
  isMenuOpen: false,
  selectedProductId: null,
  quickViewProductId: null,
  selectedOrder: null,
  toast: null,
};

// 2. FIXED: Use the AppAction type and clean up the reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_INITIAL_STATE':
      return { ...state, ...action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'SET_CART':
      return { ...state, cart: action.payload };
    case 'SET_WISHLIST':
      return { ...state, wishlist: action.payload };
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_SAVED_FOR_LATER':
      return { ...state, savedForLater: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_IS_MENU_OPEN':
      return { ...state, isMenuOpen: action.payload };
    case 'SET_SELECTED_PRODUCT_ID':
      return { ...state, selectedProductId: action.payload };
    case 'SET_QUICK_VIEW_PRODUCT_ID':
      return { ...state, quickViewProductId: action.payload };
    case 'SET_SELECTED_ORDER':
      return { ...state, selectedOrder: action.payload };
    case 'SET_TOAST':
      return { ...state, toast: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useLocalStorageReducer(
    appReducer,
    initialState,
    'appState'
  );
  const router = useRouter();

  const navigateTo = useCallback(
    (path: string) => {
      router.push(`/${path === 'home' ? '' : path}`);
    },
    [router]
  );

  const setPage = useCallback((page: string) => navigateTo(page), [navigateTo]);
  const viewProduct = useCallback(
    (productId: string) => navigateTo(`products/${productId}`),
    [navigateTo]
  );
  const viewOrder = useCallback(
    (orderId: string) => navigateTo(`account/orders/${orderId}`),
    [navigateTo]
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  const showToast = useCallback((message: string) => {
    dispatch({ type: 'SET_TOAST', payload: message });
    setTimeout(() => dispatch({ type: 'SET_TOAST', payload: null }), 3000);
  }, []);

  const login = useCallback(
    (email: string, password: string) => {
      const user = state.users.find(
        (u) => u.email === email && u.password === password
      );
      if (user) {
        dispatch({ type: 'SET_USER', payload: user });
        showToast(`Welcome back, ${user.name}!`);
        setPage('home');
        return { success: true };
      }
      return { success: false, message: 'Invalid email or password.' };
    },
    [state.users, showToast, setPage]
  );

  const logout = useCallback(() => {
    dispatch({ type: 'SET_USER', payload: null });
    showToast("You've been logged out.");
  }, [showToast]);

  const signup = useCallback(
    (name: string, email: string, password: string) => {
      if (state.users.find((u) => u.email === email)) {
        return {
          success: false,
          message: 'An account with this email already exists.',
        };
      }
      const newUser = { id: String(Date.now()), name, email, password };
      dispatch({ type: 'SET_USERS', payload: [...state.users, newUser] });
      showToast(`Account created for ${name}! Please log in.`);
      return { success: true };
    },
    [state.users, showToast]
  );

  const addToCart = useCallback(
    (item: Omit<CartItem, 'cartItemId' | 'image'>) => {
      const product = state.products.find((p) => p.id === item.id);
      if (!product) return;

      const cartItemId = `${item.id}-${JSON.stringify(item.options)}`;
      const existingItem = state.cart.find((i) => i.cartItemId === cartItemId);
      const currentQuantity = existingItem ? existingItem.quantity : 0;

      if (currentQuantity + item.quantity > product.stock) {
        showToast(
          `Not enough stock for ${item.title}. Only ${product.stock} available.`
        );
        return;
      }

      let updatedCart: CartItem[];
      if (existingItem) {
        updatedCart = state.cart.map((cartItem) =>
          cartItem.cartItemId === cartItemId
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      } else {
        const colorOption = product.options?.find((o) => o.name === 'Color');
        const selectedVariant = colorOption?.variants.find(
          (v) => v.value === item.options?.Color
        );
        const itemImage =
          selectedVariant?.image ||
          product.images?.[0] ||
          '/images/placeholder.jpg';

        const newItem: CartItem = {
          ...item,
          cartItemId,
          image: itemImage,
        };
        updatedCart = [...state.cart, newItem];
      }

      dispatch({ type: 'SET_CART', payload: updatedCart });
      showToast(`${item.title} added to cart`);
    },
    [state.products, state.cart, showToast]
  );

  const removeFromCart = useCallback(
    (cartItemId: string) => {
      const itemToRemove = state.cart.find(
        (item) => item.cartItemId === cartItemId
      );
      const updatedCart = state.cart.filter(
        (item) => item.cartItemId !== cartItemId
      );
      dispatch({ type: 'SET_CART', payload: updatedCart });

      // FIXED: Added the toast notification
      if (itemToRemove) {
        showToast(`'${itemToRemove.title}' removed from cart.`);
      }
    },
    // FIXED: Added showToast to the dependency array
    [state.cart, showToast]
  );

  const updateCartQuantity = useCallback(
    (cartItemId: string, newQuantity: number) => {
      const cartItem = state.cart.find((i) => i.cartItemId === cartItemId);
      if (!cartItem) return;

      if (newQuantity < 1) {
        removeFromCart(cartItemId);
        return;
      }

      const product = state.products.find((p) => p.id === cartItem.id);
      if (product && newQuantity > product.stock) {
        showToast(`Not enough stock. Only ${product.stock} available.`);
        return;
      }

      const updatedCart = state.cart.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: newQuantity }
          : item
      );
      dispatch({ type: 'SET_CART', payload: updatedCart });
    },
    [state.cart, state.products, removeFromCart, showToast]
  );

  const saveForLater = useCallback(
    (cartItemId: string) => {
      const itemToSave = state.cart.find(
        (item) => item.cartItemId === cartItemId
      );
      if (itemToSave) {
        removeFromCart(cartItemId);
        dispatch({
          type: 'SET_SAVED_FOR_LATER',
          payload: [...state.savedForLater, itemToSave],
        });
        showToast("Item moved to 'Saved for Later'.");
      }
    },
    [state.cart, state.savedForLater, removeFromCart, showToast]
  );

  const removeFromSaved = useCallback(
    (cartItemId: string) => {
      const updatedSaved = state.savedForLater.filter(
        (item) => item.cartItemId !== cartItemId
      );
      dispatch({ type: 'SET_SAVED_FOR_LATER', payload: updatedSaved });
      showToast('Item removed.');
    },
    [state.savedForLater, showToast]
  );

  const moveToCart = useCallback(
    (cartItemId: string) => {
      const itemToMove = state.savedForLater.find(
        (item) => item.cartItemId === cartItemId
      );
      if (!itemToMove) return;

      // Remove from saved list first
      removeFromSaved(cartItemId);
      // Add to cart (this will handle stock checks and merging quantities)
      addToCart(itemToMove);
      showToast('Item moved to cart.');
    },
    [state.savedForLater, addToCart, removeFromSaved, showToast]
  );

  const toggleWishlist = useCallback(
    (productId: string) => {
      const newWishlist = new Set(state.wishlist);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
        showToast('Removed from wishlist');
      } else {
        newWishlist.add(productId);
        showToast('Added to wishlist');
      }
      dispatch({ type: 'SET_WISHLIST', payload: newWishlist });
    },
    [state.wishlist, showToast]
  );

  const placeOrder = useCallback(
    (orderDetails: Omit<Order, 'id' | 'date'>) => {
      const newOrder: Order = {
        id: `ORD-${Date.now()}`,
        date: new Date().toISOString(),
        ...orderDetails,
      };

      dispatch({ type: 'SET_ORDERS', payload: [newOrder, ...state.orders] });

      const updatedProducts = state.products.map((p) => {
        const orderItem = newOrder.items.find((item) => item.id === p.id);
        return orderItem ? { ...p, stock: p.stock - orderItem.quantity } : p;
      });

      dispatch({ type: 'SET_PRODUCTS', payload: updatedProducts });
      dispatch({ type: 'SET_CART', payload: [] });

      showToast('Order placed successfully!');
      viewOrder(newOrder.id);

      return newOrder.id;
    },
    [state.orders, state.products, showToast, viewOrder]
  );

  // 3. FIXED: Rewritten `addReview` to handle both adding and editing
  const addReview = useCallback(
    (productId: string, reviewData: ReviewPayload) => {
      const updatedProducts = state.products.map((p) => {
        if (p.id === productId) {
          let newReviews = [...(p.reviews || [])];

          // Check if we are editing by seeing if an ID was passed
          if (reviewData.id) {
            const index = newReviews.findIndex((r) => r.id === reviewData.id);
            if (index > -1) {
              // Update existing review in place
              newReviews[index] = {
                ...newReviews[index], // Preserve date and helpful count
                rating: reviewData.rating,
                comment: reviewData.comment,
              };
              showToast('Review updated successfully!');
            }
          } else {
            // Add a new review
            const newReview: Review = {
              id: Date.now(),
              name: reviewData.name,
              rating: reviewData.rating,
              comment: reviewData.comment,
              date: new Date().toISOString(),
              helpful: 0,
            };
            newReviews.unshift(newReview); // Add to the top
            showToast('Thank you for your review!');
          }

          // Recalculate average rating
          const totalRating = newReviews.reduce((sum, r) => sum + r.rating, 0);
          const averageRating = totalRating / newReviews.length;

          return {
            ...p,
            reviews: newReviews,
            rating: parseFloat(averageRating.toFixed(1)),
            reviewCount: newReviews.length,
          };
        }
        return p;
      });

      dispatch({ type: 'SET_PRODUCTS', payload: updatedProducts });
    },
    [state.products, showToast]
  );

  const updateReviewHelpfulCount = useCallback(
    (productId: string, reviewId: number) => {
      const updatedProducts = state.products.map((p) => {
        if (p.id === productId) {
          const updatedReviews = p.reviews?.map((r) =>
            r.id === reviewId ? { ...r, helpful: (r.helpful || 0) + 1 } : r
          );
          return { ...p, reviews: updatedReviews };
        }
        return p;
      });
      dispatch({ type: 'SET_PRODUCTS', payload: updatedProducts });
    },
    [state.products]
  );

  const setSearchQuery = useCallback(
    (query: string) => dispatch({ type: 'SET_SEARCH_QUERY', payload: query }),
    []
  );
  const setTheme = useCallback(
    (theme: 'light' | 'dark') =>
      dispatch({ type: 'SET_THEME', payload: theme }),
    []
  );
  const setIsMenuOpen = useCallback(
    (isOpen: boolean) =>
      dispatch({ type: 'SET_IS_MENU_OPEN', payload: isOpen }),
    []
  );
  const setQuickViewProductId = useCallback(
    (id: string | null) =>
      dispatch({ type: 'SET_QUICK_VIEW_PRODUCT_ID', payload: id }),
    []
  );
  const setSelectedOrder = useCallback(
    (id: string | null) =>
      dispatch({ type: 'SET_SELECTED_ORDER', payload: id }),
    []
  );
  const setSelectedProductId = useCallback(
    (id: string | null) =>
      dispatch({ type: 'SET_SELECTED_PRODUCT_ID', payload: id }),
    []
  );

  const value: AppContextType = {
    ...state,
    setPage,
    viewProduct,
    viewOrder,
    login,
    logout,
    signup,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    saveForLater,
    moveToCart,
    removeFromSaved,
    toggleWishlist,
    placeOrder,
    addReview,
    updateReviewHelpfulCount,
    showToast,
    setSearchQuery,
    setTheme,
    setIsMenuOpen,
    setQuickViewProductId,
    setSelectedOrder,
    setSelectedProductId,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
