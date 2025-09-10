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
import {AppContextType, AppState, ReviewPayload, CartItem, Order, Product, Review,  User } from '../types';

// --- CONSTANTS ---
const TOAST_DURATION = 3000;



// Reducer Actions: Defines all possible state mutations
type AppAction =
  | { type: 'SET_INITIAL_STATE'; payload: Partial<AppState> }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'TOGGLE_WISHLIST'; payload: string }
  | {
      type: 'ADD_TO_CART';
      payload: {
        item: Omit<CartItem, 'cartItemId' | 'image'>;
        product?: Product;
      };
    }
  | {
      type: 'UPDATE_CART_QUANTITY';
      payload: { cartItemId: string; newQuantity: number };
    }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'MOVE_TO_SAVED'; payload: string }
  | { type: 'MOVE_TO_CART'; payload: string }
  | { type: 'REMOVE_FROM_SAVED'; payload: string }
  | { type: 'PLACE_ORDER'; payload: Order }
  | {
      type: 'ADD_REVIEW';
      payload: { productId: string; reviewData: ReviewPayload };
    }
  | {
      type: 'UPDATE_REVIEW_HELPFUL_COUNT';
      payload: { productId: string; reviewId: string };
    }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_IS_MENU_OPEN'; payload: boolean }
  | { type: 'SET_QUICK_VIEW_PRODUCT_ID'; payload: string | null }
  | { type: 'SET_TOAST'; payload: string | null };

const AppContext = createContext<AppContextType | undefined>(undefined);

// --- INITIAL STATE ---
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
  isLoading: false,
};

// --- REDUCER ---
// REFACTORED: All complex business logic now lives inside the reducer.
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_INITIAL_STATE':
      return { ...state, ...action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'TOGGLE_WISHLIST': {
      const newWishlist = new Set(state.wishlist);
      if (newWishlist.has(action.payload)) {
        newWishlist.delete(action.payload);
      } else {
        newWishlist.add(action.payload);
      }
      return { ...state, wishlist: newWishlist };
    }
    case 'ADD_TO_CART': {
      const { item, product } = action.payload;
      if (!product) return state;

      const cartItemId = `${item.id}-${JSON.stringify(item.options)}`;
      const existingItem = state.cart.find((i) => i.cartItemId === cartItemId);
      const currentQuantity = existingItem ? existingItem.quantity : 0;

      if (currentQuantity + item.quantity > product.stock) {
        // This kind of side-effect is tricky in a reducer. We'll handle the toast in the component.
        return state;
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
        const newItem: CartItem = { ...item, cartItemId, image: itemImage };
        updatedCart = [...state.cart, newItem];
      }
      return { ...state, cart: updatedCart };
    }
    case 'UPDATE_CART_QUANTITY': {
      const { cartItemId, newQuantity } = action.payload;
      const cartItem = state.cart.find((i) => i.cartItemId === cartItemId);
      if (!cartItem) return state;

      const product = state.products.find((p) => p.id === cartItem.id);
      if (product && newQuantity > product.stock) {
        return state; // Handle toast in component
      }

      if (newQuantity < 1) {
        return {
          ...state,
          cart: state.cart.filter((i) => i.cartItemId !== cartItemId),
        };
      }

      return {
        ...state,
        cart: state.cart.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: newQuantity }
            : item
        ),
      };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter((item) => item.cartItemId !== action.payload),
      };
    case 'MOVE_TO_SAVED': {
      const itemToSave = state.cart.find(
        (item) => item.cartItemId === action.payload
      );
      if (!itemToSave) return state;
      return {
        ...state,
        cart: state.cart.filter((item) => item.cartItemId !== action.payload),
        savedForLater: [...state.savedForLater, itemToSave],
      };
    }
    case 'REMOVE_FROM_SAVED':
      return {
        ...state,
        savedForLater: state.savedForLater.filter(
          (item) => item.cartItemId !== action.payload
        ),
      };
    case 'MOVE_TO_CART': {
      const itemToMove = state.savedForLater.find(
        (item) => item.cartItemId === action.payload
      );
      if (!itemToMove) return state;
      // Logic for adding to cart is complex, so we'll re-use the ADD_TO_CART logic
      // This is an advanced pattern; for now, we assume simple move.
      const newCart = [...state.cart, itemToMove];
      const newSaved = state.savedForLater.filter(
        (i) => i.cartItemId !== action.payload
      );
      return { ...state, cart: newCart, savedForLater: newSaved };
    }
    case 'PLACE_ORDER': {
      const newOrder = action.payload;
      const updatedProducts = state.products.map((p) => {
        const orderItem = newOrder.items.find((item) => item.id === p.id);
        return orderItem ? { ...p, stock: p.stock - orderItem.quantity } : p;
      });
      return {
        ...state,
        orders: [newOrder, ...state.orders],
        products: updatedProducts,
        cart: [],
      };
    }
    case 'ADD_REVIEW': {
      const { productId, reviewData } = action.payload;
      const updatedProducts = state.products.map((p) => {
        if (p.id !== productId) return p;

        let newReviews = [...(p.reviews || [])];
        if (reviewData.id) {
          // Editing existing review
          const index = newReviews.findIndex((r) => r.id === reviewData.id);
          if (index > -1) {
            newReviews[index] = { ...newReviews[index], ...reviewData };
          }
        } else {
          // Adding new review
          const newReview: Review = {
            id: Date.now().toString(),
            ...reviewData,
            date: new Date().toISOString(),
            helpful: 0,
          };
          newReviews.unshift(newReview);
        }

        const totalRating = newReviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / newReviews.length;

        return {
          ...p,
          reviews: newReviews,
          rating: parseFloat(averageRating.toFixed(1)),
          reviewCount: newReviews.length,
        };
      });
      return { ...state, products: updatedProducts };
    }
    case 'UPDATE_REVIEW_HELPFUL_COUNT': {
      const { productId, reviewId } = action.payload;
      const updatedProducts = state.products.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          reviews: p.reviews?.map((r) =>
            r.id === reviewId ? { ...r, helpful: (r.helpful || 0) + 1 } : r
          ),
        };
      });
      return { ...state, products: updatedProducts };
    }
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_IS_MENU_OPEN':
      return { ...state, isMenuOpen: action.payload };
    case 'SET_QUICK_VIEW_PRODUCT_ID':
      return { ...state, quickViewProductId: action.payload };
    case 'SET_TOAST':
      return { ...state, toast: action.payload };
    default:
      return state;
  }
}

// --- PROVIDER COMPONENT ---

// FIXED: Added initializer to correctly deserialize the 'wishlist' Set
const initializer = (state: AppState) => ({
  ...state,
  wishlist: new Set(state.wishlist),
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useLocalStorageReducer(
    appReducer,
    initialState,
    'appState',
    { initializer, exclude: ['products'],
    }
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
    setTimeout(
      () => dispatch({ type: 'SET_TOAST', payload: null }),
      TOAST_DURATION
    );
  }, []);

  // 🚨 SECURITY WARNING:
  // The following login/signup logic is for DEMO purposes only.
  // In a real-world application, authentication MUST be handled by a secure backend server.
  // Never store plain-text passwords or perform authentication on the client-side.
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

  const signup = useCallback(
    (name: string, email: string, password: string) => {
      if (state.users.find((u) => u.email === email)) {
        return {
          success: false,
          message: 'An account with this email already exists.',
        };
      }
      const newUser = { id: String(Date.now()), name, email, password };
      dispatch({ type: 'ADD_USER', payload: newUser });
      showToast(`Account created for ${name}! Please log in.`);
      return { success: true };
    },
    [state.users, showToast]
  );

  const logout = useCallback(() => {
    dispatch({ type: 'SET_USER', payload: null });
    showToast("You've been logged out.");
  }, [showToast]);

  // REFACTORED: Action functions now mostly just dispatch to the reducer
 const addToCart = useCallback(
  (item: Omit<CartItem, 'cartItemId' | 'image'>) => {
    const product = state.products.find((p) => p.id === item.id);
    if (!product) return; // Product not found

    const cartItemId = `${item.id}-${JSON.stringify(item.options)}`;
    const existingItem = state.cart.find((i) => i.cartItemId === cartItemId);
    const quantityInCart = existingItem ? existingItem.quantity : 0;

    // ✅ This is the improved check
    if (quantityInCart + item.quantity > product.stock) {
      showToast(
        `No more in stock for ${item.title}. Only ${product.stock} available.`
      );
      return; // Stop the function here
    }

    dispatch({ type: 'ADD_TO_CART', payload: { item, product } });
    showToast(`${item.title} added to cart`);
  },
  [state.products, state.cart, showToast] // Add state.cart to dependencies
);

  const removeFromCart = useCallback(
    (cartItemId: string) => {
      const item = state.cart.find((i) => i.cartItemId === cartItemId);
      dispatch({ type: 'REMOVE_FROM_CART', payload: cartItemId });
      if (item) showToast(`'${item.title}' removed from cart.`);
    },
    [state.cart, showToast]
  );

  const updateCartQuantity = useCallback(
  (cartItemId: string, newQuantity: number) => {
    const cartItem = state.cart.find((i) => i.cartItemId === cartItemId);
    if (!cartItem) return;

    const product = state.products.find((p) => p.id === cartItem.id);

    // ✅ This is the improved check
    if (product && newQuantity > product.stock) {
      showToast(`No more in stock. Only ${product.stock} available.`);
      // We don't dispatch, so the quantity won't change
      return;
    }

    dispatch({
      type: 'UPDATE_CART_QUANTITY',
      payload: { cartItemId, newQuantity },
    });
  },
  [state.cart, state.products, showToast] // Add dependencies
);

  const saveForLater = useCallback(
    (cartItemId: string) => {
      dispatch({ type: 'MOVE_TO_SAVED', payload: cartItemId });
      showToast("Item moved to 'Saved for Later'.");
    },
    [showToast]
  );

  const removeFromSaved = useCallback(
    (cartItemId: string) => {
      dispatch({ type: 'REMOVE_FROM_SAVED', payload: cartItemId });
      showToast('Item removed.');
    },
    [showToast]
  );

  const moveToCart = useCallback(
    (cartItemId: string) => {
      dispatch({ type: 'MOVE_TO_CART', payload: cartItemId });
      showToast('Item moved to cart.');
    },
    [showToast]
  );

  const toggleWishlist = useCallback(
    (productId: string) => {
      dispatch({ type: 'TOGGLE_WISHLIST', payload: productId });
      showToast(
        state.wishlist.has(productId)
          ? 'Removed from wishlist'
          : 'Added to wishlist'
      );
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
      dispatch({ type: 'PLACE_ORDER', payload: newOrder });
      showToast('Order placed successfully!');
      viewOrder(newOrder.id);
      return newOrder.id;
    },
    [showToast, viewOrder]
  );

  const addReview = useCallback(
    (productId: string, reviewData: ReviewPayload) => {
      dispatch({ type: 'ADD_REVIEW', payload: { productId, reviewData } });
      showToast(
        reviewData.id ? 'Review updated!' : 'Thank you for your review!'
      );
    },
    [showToast]
  );

  const updateReviewHelpfulCount = useCallback(
    (productId: string, reviewId: string) => {
      dispatch({
        type: 'UPDATE_REVIEW_HELPFUL_COUNT',
        payload: { productId, reviewId },
      });
    },
    []
  );

  // Simple setters
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// --- CUSTOM HOOK ---
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
