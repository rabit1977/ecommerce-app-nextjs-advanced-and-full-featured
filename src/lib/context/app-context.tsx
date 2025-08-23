'use client';

import { useRouter } from 'next/navigation';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { initialProducts } from '../constants/products';
import { AppState, CartItem, Order, Review } from '../types';

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
  addReview: (productId: string, review: Omit<Review, 'id'>) => void;
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

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial state
const initialState: AppState = {
  user: null,
  users: [],
  cart: [],
  wishlist: new Set(),
  orders: [],
  products: [],
  savedForLater: [],
  theme: 'light',
  searchQuery: '',
  isMenuOpen: false,
  selectedProductId: null,
  quickViewProductId: null,
  selectedOrder: null,
  toast: null,
};

// Reducer function
function appReducer(state: AppState, action: any): AppState {
  switch (action.type) {
    case 'SET_INITIAL_STATE':
      return { ...state, ...action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
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
    case 'ADD_TO_CART':
      return { ...state, cart: action.payload };
    case 'UPDATE_CART_QUANTITY':
      return { ...state, cart: action.payload };
    case 'REMOVE_FROM_CART':
      return { ...state, cart: action.payload };
    case 'ADD_TO_SAVED':
      return { ...state, savedForLater: action.payload };
    case 'REMOVE_FROM_SAVED':
      return { ...state, savedForLater: action.payload };
    case 'ADD_TO_WISHLIST':
      return { ...state, wishlist: action.payload };
    case 'REMOVE_FROM_WISHLIST':
      return { ...state, wishlist: action.payload };
    case 'ADD_ORDER':
      return { ...state, orders: action.payload };
    case 'UPDATE_PRODUCTS':
      return { ...state, products: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const router = useRouter();

  // Navigation functions
  const navigateTo = useCallback(
    (page: string) => {
      router.push(`/${page === 'home' ? '' : page}`);
    },
    [router]
  );

  const setPage = useCallback(
    (page: string) => {
      navigateTo(page);
    },
    [navigateTo]
  );

  const viewProduct = useCallback(
    (productId: string) => {
      navigateTo(`products/${productId}`);
    },
    [navigateTo]
  );

  const viewOrder = useCallback(
    (orderId: string) => {
      navigateTo(`account/orders/${orderId}`);
    },
    [navigateTo]
  );

  // Load initial state from localStorage
  useEffect(() => {
    const loadState = () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const wishlist = new Set(
          JSON.parse(localStorage.getItem('wishlist') || '[]')
        );
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');

        // Fix products loading - handle both string and object cases
        let products = initialProducts;
       const storedProducts = localStorage.getItem('products');
if (storedProducts) {
  try {
    const parsedProducts = JSON.parse(storedProducts);
    products = validateProductsData(parsedProducts);
  } catch (e) {
    console.error('Error parsing products from localStorage:', e);
    products = initialProducts;
  }
}
        const savedForLater = JSON.parse(
          localStorage.getItem('savedForLater') || '[]'
        );
        const theme =
          (localStorage.getItem('theme') as 'light' | 'dark') || 'light';

        dispatch({
          type: 'SET_INITIAL_STATE',
          payload: {
            user,
            users,
            cart,
            wishlist,
            orders,
            products,
            savedForLater,
            theme,
          },
        });

        // Set theme class on HTML element
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }

        console.log('Loaded from localStorage:', {
          cart: cart.length,
          products: products.length,
          users: users.length,
        });
      } catch (error) {
        console.error('Error loading state from localStorage:', error);
        // Initialize with default products if there's an error
        dispatch({
          type: 'SET_INITIAL_STATE',
          payload: { ...initialState, products: initialProducts },
        });
      }
    };

    loadState();
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(state.user));
  }, [state.user]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(state.users));
  }, [state.users]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.cart));
    console.log('Saved cart to localStorage:', state.cart);
  }, [state.cart]);

  useEffect(() => {
    localStorage.setItem(
      'wishlist',
      JSON.stringify(Array.from(state.wishlist))
    );
  }, [state.wishlist]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(state.orders));
  }, [state.orders]);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(state.products));
  }, [state.products]);

  useEffect(() => {
    localStorage.setItem('savedForLater', JSON.stringify(state.savedForLater));
  }, [state.savedForLater]);

  useEffect(() => {
    localStorage.setItem('theme', state.theme);
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  // Action functions
  const showToast = useCallback((message: string) => {
    dispatch({ type: 'SET_TOAST', payload: message });
    setTimeout(() => dispatch({ type: 'SET_TOAST', payload: null }), 3000);
  }, []);

  const login = useCallback(
    (email: string, password: string) => {
      // Mock login logic
      const user = state.users.find(
        (u) => u.email === email && u.password === password
      );
      if (user) {
        dispatch({ type: 'SET_USER', payload: user });
        showToast(`Welcome back, ${user.name}!`);
        return { success: true };
      }
      return { success: false, message: 'Invalid email or password.' };
    },
    [state.users, showToast]
  );

  const logout = useCallback(() => {
    dispatch({ type: 'SET_USER', payload: null });
    showToast("You've been logged out.");
  }, [showToast]);

  const signup = useCallback(
    (name: string, email: string, password: string) => {
      // Mock signup logic
      const existingUser = state.users.find((u) => u.email === email);
      if (existingUser) {
        return {
          success: false,
          message: 'An account with this email already exists.',
        };
      }

      const newUser = { name, email, password };
      const updatedUsers = [...state.users, newUser];
      dispatch({ type: 'SET_USERS', payload: updatedUsers });
      showToast(`Account created for ${name}! Please log in.`);
      return { success: true };
    },
    [state.users, showToast]
  );

  const addToCart = useCallback(
    (item: Omit<CartItem, 'cartItemId' | 'image'>) => {
      const product = state.products.find((p) => p.id === item.id);
      if (!product) {
        console.error('Product not found:', item.id);
        return;
      }

      // Create a unique cart item ID based on product ID and selected options
      const cartItemId = `${item.id}-${JSON.stringify(item.options)}`;

      const updatedCart = [...state.cart];
      const existingItem = updatedCart.find((i) => i.cartItemId === cartItemId);
      const currentQuantityInCart = existingItem ? existingItem.quantity : 0;

      if (currentQuantityInCart + item.quantity > product.stock) {
        showToast(
          `Not enough stock for ${item.title}. Only ${product.stock} available.`
        );
        return;
      }

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        // Find the correct image based on the selected color, or fallback to the first image
        const colorOption = product.options?.find((o) => o.name === 'Color');
        const selectedVariant = colorOption?.variants.find(
          (v) => v.value === item.options?.Color
        );
        const itemImage =
          selectedVariant?.image ||
          product.images?.[0] ||
          '/images/placeholder.jpg';

        updatedCart.push({
          ...item,
          cartItemId,
          image: itemImage,
        } as CartItem);
      }

      dispatch({ type: 'SET_CART', payload: updatedCart });
      showToast(`${item.title} added to cart`);
      console.log('Added to cart:', item, 'New cart:', updatedCart);
    },
    [state.products, state.cart, showToast]
  );

  const removeFromCart = useCallback(
    (cartItemId: string) => {
      const updatedCart = state.cart.filter(
        (item) => item.cartItemId !== cartItemId
      );
      dispatch({ type: 'SET_CART', payload: updatedCart });
    },
    [state.cart]
  );

  const updateCartQuantity = useCallback(
    (cartItemId: string, newQuantity: number) => {
      const cartItem = state.cart.find((i) => i.cartItemId === cartItemId);
      if (!cartItem) return;

      const product = state.products.find((p) => p.id === cartItem.id);
      if (!product) return;

      if (newQuantity < 1) {
        removeFromCart(cartItemId);
        return;
      }

      if (newQuantity > product.stock) {
        showToast(
          `Not enough stock for ${product.title}. Only ${product.stock} available.`
        );
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
        const updatedSaved = [...state.savedForLater, itemToSave];
        dispatch({ type: 'SET_SAVED_FOR_LATER', payload: updatedSaved });
        showToast("Item moved to 'Saved for Later'.");
      }
    },
    [state.cart, state.savedForLater, removeFromCart, showToast]
  );

  const moveToCart = useCallback(
    (cartItemId: string) => {
      const itemToMove = state.savedForLater.find(
        (item) => item.cartItemId === cartItemId
      );
      if (!itemToMove) return;

      const product = state.products.find((p) => p.id === itemToMove.id);
      if (!product) return;

      if (itemToMove.quantity > product.stock) {
        showToast(
          `Not enough stock for ${itemToMove.title}. Only ${product.stock} available.`
        );
        return;
      }

      const updatedSaved = state.savedForLater.filter(
        (item) => item.cartItemId !== cartItemId
      );
      dispatch({ type: 'SET_SAVED_FOR_LATER', payload: updatedSaved });

      addToCart({
        id: itemToMove.id,
        quantity: itemToMove.quantity,
        title: itemToMove.title,
        price: itemToMove.price,
        options: itemToMove.options,
      });

      showToast('Item moved to cart.');
    },
    [state.savedForLater, state.products, addToCart, showToast]
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
      const newOrder = {
        id: `ORD-${Date.now()}`,
        date: new Date().toLocaleDateString(),
        ...orderDetails,
      };

      const updatedOrders = [newOrder, ...state.orders];
      dispatch({ type: 'SET_ORDERS', payload: updatedOrders });

      // Decrement stock for each item in the order
      const updatedProducts = state.products.map((p) => {
        const orderItem = newOrder.items.find((item) => item.id === p.id);
        if (orderItem) {
          return { ...p, stock: p.stock - orderItem.quantity };
        }
        return p;
      });

      dispatch({ type: 'SET_PRODUCTS', payload: updatedProducts });
      dispatch({ type: 'SET_CART', payload: [] });

      return newOrder.id;
    },
    [state.orders, state.products]
  );

  const addReview = useCallback(
    (productId: string, review: Omit<Review, 'id'>) => {
      const updatedProducts = state.products.map((p) => {
        if (p.id === productId) {
          const newReviews = [
            ...(p.reviews || []),
            { ...review, id: Date.now() },
          ];
          const newTotalRating = newReviews.reduce(
            (sum, r) => sum + r.rating,
            0
          );
          const newAverageRating = newTotalRating / newReviews.length;

          return {
            ...p,
            reviews: newReviews,
            rating: parseFloat(newAverageRating.toFixed(1)),
            reviewCount: newReviews.length,
          };
        }
        return p;
      });

      dispatch({ type: 'SET_PRODUCTS', payload: updatedProducts });
      showToast('Thank you for your review!');
    },
    [state.products, showToast]
  );
// Add this validation function to your app-context.tsx
const validateProductsData = (data: any): Product[] => {
  if (!Array.isArray(data)) {
    console.error('Products data is not an array');
    return initialProducts;
  }
  
  // Basic validation to ensure we have product-like objects
  const validProducts = data.filter(item => 
    item && 
    typeof item === 'object' &&
    item.id && 
    item.title && 
    typeof item.price === 'number'
  );
  
  if (validProducts.length === 0) {
    console.error('No valid products found in stored data');
    return initialProducts;
  }
  
  return validProducts;
};
  const updateReviewHelpfulCount = useCallback(
    (productId: string, reviewId: number) => {
      const updatedProducts = state.products.map((p) => {
        if (p.id === productId) {
          const updatedReviews = p.reviews?.map((r) => {
            if (r.id === reviewId) {
              return { ...r, helpful: (r.helpful || 0) + 1 };
            }
            return r;
          });
          return { ...p, reviews: updatedReviews };
        }
        return p;
      });

      dispatch({ type: 'SET_PRODUCTS', payload: updatedProducts });
    },
    [state.products]
  );

  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  const setTheme = useCallback((theme: 'light' | 'dark') => {
    dispatch({ type: 'SET_THEME', payload: theme });
  }, []);

  const setIsMenuOpen = useCallback((isOpen: boolean) => {
    dispatch({ type: 'SET_IS_MENU_OPEN', payload: isOpen });
  }, []);

  const setQuickViewProductId = useCallback((productId: string | null) => {
    dispatch({ type: 'SET_QUICK_VIEW_PRODUCT_ID', payload: productId });
  }, []);

  const setSelectedOrder = useCallback((orderId: string | null) => {
    dispatch({ type: 'SET_SELECTED_ORDER', payload: orderId });
  }, []);

  const setSelectedProductId = useCallback((productId: string | null) => {
    dispatch({ type: 'SET_SELECTED_PRODUCT_ID', payload: productId });
  }, []);

  const value: AppContextType = {
    ...state,
    // Navigation functions
    setPage,
    viewProduct,
    viewOrder,
    // User actions
    login,
    logout,
    signup,
    // Cart actions
    addToCart,
    updateCartQuantity,
    removeFromCart,
    saveForLater,
    moveToCart,
    removeFromSaved,
    // Wishlist actions
    toggleWishlist,
    // Order actions
    placeOrder,
    // Review actions
    addReview,
    updateReviewHelpfulCount,
    // UI actions
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
