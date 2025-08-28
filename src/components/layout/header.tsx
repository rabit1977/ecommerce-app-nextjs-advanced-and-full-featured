'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/lib/context/app-context';
import { useDebounce } from '@/lib/hooks/useDebounce';
import {
  Heart,
  Menu,
  Moon,
  Search,
  ShoppingCart,
  Sun,
  X,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const Header = () => {
  const {
    user,
    cart,
    wishlist,
    logout,
    products,
    setSearchQuery, // We'll now use this to update the global state after debouncing
    theme,
    setTheme,
    setIsMenuOpen,
  } = useApp();

  const router = useRouter();
  const pathname = usePathname();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  // State for the physical input field, responds instantly
  const [inputValue, setInputValue] = useState('');
  // Debounced value, updates only after user stops typing for 300ms
  const debouncedSearchQuery = useDebounce(inputValue, 300);

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // Effect to handle client-side-only rendering
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Effect to update the global search query after debouncing
  useEffect(() => {
    setSearchQuery(debouncedSearchQuery);
  }, [debouncedSearchQuery, setSearchQuery]);

  // Smarter effect to clear search input on navigation
  useEffect(() => {
    // Do not clear the input if we are navigating to the products page to see results
    if (!pathname.startsWith('/products')) {
      setInputValue('');
    }
  }, [pathname]);

  // Memoize cart item count to prevent recalculation on every render
  const cartItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Memoize search results to only filter when the debounced query or products change
  const searchResults = useMemo(() => {
    if (!debouncedSearchQuery) return [];
    const query = debouncedSearchQuery.toLowerCase();
    return products
      .filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      )
      .slice(0, 5);
  }, [debouncedSearchQuery, products]);

  // Navigate to the main search results page
  const navigateToSearchResults = useCallback(() => {
    if (inputValue) {
      router.push(`/products?search=${encodeURIComponent(inputValue)}`);
      setIsSearchFocused(false); // Hide dropdown on navigation
    }
  }, [inputValue, router]);

  const handleProductSelection = () => {
    setIsSearchFocused(false);
    setInputValue(''); // Also clear the input for a better UX
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigateToSearchResults();
    }
    // Add this new condition
    else if (e.key === 'ArrowDown') {
      e.preventDefault(); // Prevent the cursor from moving in the input
      // Find the first link inside the search results and focus it
      const firstResult = searchContainerRef.current?.querySelector('a');
      if (firstResult) {
        firstResult.focus();
      }
    }
  };

  return (
    <header className='sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-slate-950/80 dark:border-slate-800'>
      <div className='container mx-auto flex h-16 items-center justify-between gap-4 px-4'>
        {/* IMPROVEMENT: Using Next.js Link for optimized navigation */}
        <Link href='/' className='flex flex-shrink-0 items-center gap-2'>
          <Zap className='h-6 w-6 text-slate-900 dark:text-white' />
          <span className='hidden text-xl font-bold dark:text-white sm:inline'>
            Electro
          </span>
        </Link>

        {/* --- Search Bar --- */}
        <div
          ref={searchContainerRef}
          onBlur={(e: React.FocusEvent<HTMLDivElement>) => {
            // If the new focused element is NOT inside the container, then close the dropdown
            if (
              !searchContainerRef.current?.contains(e.relatedTarget as Node)
            ) {
              setIsSearchFocused(false);
            }
          }}
          className='relative max-w-md flex-1'
        >
          <div className='relative'>
            <Input
              placeholder='Search products...'
              className='pr-10'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={handleSearchKeyDown}
            />
            {inputValue ? (
              <button
                onClick={() => setInputValue('')}
                aria-label='Clear search' // ACCESSIBILITY
                className='absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 hover:text-slate-600'
              >
                <X className='h-5 w-5' />
              </button>
            ) : (
              <Search className='pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400' />
            )}
          </div>

          {isSearchFocused && inputValue && searchResults.length > 0 && (
            <div className='absolute left-0 right-0 top-full z-20 mt-2 rounded-md border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-900'>
              <ul className='flex flex-col'>
                {searchResults.map((product) => (
                  <li key={product.id}>
                    {/* IMPROVEMENT: Using Link for direct navigation */}
                    <Link
                      href={`/products/${product.id}`}
                      onClick={handleProductSelection}
                      className='flex items-center gap-3 rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800'
                    >
                      <div className='relative h-10 w-10 flex-shrink-0'>
                        <Image
                          src={product.images?.[0] || '/images/placeholder.jpg'}
                          alt={product.title}
                          fill
                          className='rounded-md object-cover'
                          sizes='40px'
                        />
                      </div>
                      <div>
                        <div className='text-sm font-medium dark:text-white'>
                          {product.title}
                        </div>
                        <div className='text-xs text-slate-500 dark:text-slate-400'>
                          {product.brand}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className='border-t p-2 dark:border-slate-800'>
                <Button
                  variant='link'
                  size='sm'
                  onClick={navigateToSearchResults}
                  className='w-full'
                >
                  View all results
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* --- Main Navigation --- */}
        <nav className='hidden items-center gap-4 xl:flex'>
          <Link
            href='/products'
            className='text-sm font-medium hover:text-slate-900 dark:hover:text-white'
          >
            Products
          </Link>
          <Link
            href='/about'
            className='text-sm font-medium hover:text-slate-900 dark:hover:text-white'
          >
            About
          </Link>
          <Link
            href='/contact'
            className='text-sm font-medium hover:text-slate-900 dark:hover:text-white'
          >
            Contact
          </Link>
        </nav>

        {/* --- Actions --- */}
        <div className='flex items-center gap-2 sm:gap-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label='Toggle theme' // ACCESSIBILITY
          >
            <Sun className='h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
            <Moon className='absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          </Button>

          <Link
            href='/wishlist'
            className='relative'
            aria-label='View wishlist'
          >
            {' '}
            {/* ACCESSIBILITY */}
            <Heart className='h-4 w-4 text-slate-600 dark:text-slate-300' />
            {wishlist.size > 0 && (
              <span className='absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-xs text-white dark:bg-slate-50 dark:text-slate-900'>
                {wishlist.size}
              </span>
            )}
          </Link>

          <Link
            href='/cart'
            className='relative'
            aria-label='View shopping cart'
          >
            {' '}
            {/* ACCESSIBILITY */}
            <ShoppingCart className='h-4 w-4 text-slate-600 dark:text-slate-300' />
            {cartItemCount > 0 && (
              <span className='absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-xs text-white dark:bg-slate-50 dark:text-slate-900'>
                {cartItemCount}
              </span>
            )}
          </Link>

          {hasMounted && (
            <div className='hidden items-center gap-2 md:flex'>
              {user ? (
                <>
                  <span className='text-sm font-medium dark:text-white'>
                    Hi, {user.name.split(' ')[0]}
                  </span>
                  <Button variant='outline' size='sm' onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <Link href='/auth'>
                  <Button size='sm'>Login</Button>
                </Link>
              )}
            </div>
          )}

          <div className='md:hidden'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsMenuOpen(true)}
              aria-label='Open menu' // ACCESSIBILITY
            >
              <Menu className='h-6 w-6' />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header };
