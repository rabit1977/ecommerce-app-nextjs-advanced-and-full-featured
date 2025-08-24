'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/lib/context/app-context';
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
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';

const Header = () => {
  const {
    user,
    cart,
    wishlist,
    logout,
    searchQuery,
    setSearchQuery,
    theme,
    setTheme,
    setIsMenuOpen,
    products,
    setSelectedProductId,
  } = useApp();

  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // NEW: State to track if the component has hydrated
  const [hasMounted, setHasMounted] = useState(false);

  // NEW: Set hasMounted to true after the first render
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    return products
      .filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5);
  }, [searchQuery, products]);

  const handleSearchClick = (productId: string) => {
    setSelectedProductId(productId);
    setSearchQuery('');
    router.push(`/products/${productId}`);
  };

  const navigateToSearchResults = () => {
    if (searchQuery) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  // Navigation functions using router
  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <header className='sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-slate-950/80 dark:border-slate-800'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4 gap-4'>
        <Link
          href='/'
          onClick={(e) => {
            e.preventDefault();
            navigateTo('/');
          }}
          className='flex items-center gap-2 flex-shrink-0'
        >
          <Zap className='h-6 w-6 text-slate-900 dark:text-white' />
          <span className='text-xl font-bold hidden sm:inline dark:text-white'>
            Electro
          </span>
        </Link>

        <div className='flex-1 max-w-md relative'>
          <div className='relative'>
            <Input
              placeholder='Search products...'
              className='pr-10'
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery) {
                  navigateToSearchResults();
                }
              }}
            />
            {searchQuery ? (
              <button
                onClick={handleClearSearch}
                className='absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 hover:text-slate-600'
              >
                <X className='h-5 w-5' />
              </button>
            ) : (
              <Search className='absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none' />
            )}
          </div>

          {searchQuery && searchResults.length > 0 && isSearchFocused && (
            <div className='absolute top-full mt-2 left-0 right-0 bg-white dark:bg-slate-900 rounded-md shadow-lg z-20 border border-slate-200 dark:border-slate-800 p-2'>
              {searchResults.map((product) => (
                <a
                  key={product.id}
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();
                    handleSearchClick(product.id);
                  }}
                  className='flex items-center gap-3 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800'
                >
                  <div className='h-10 w-10 relative flex-shrink-0'>
                    <Image
                      src={product.images?.[0] || '/images/placeholder.jpg'}
                      alt={product.title}
                      fill
                      className='object-cover rounded-md'
                      sizes='40px'
                    />
                  </div>
                  <div>
                    <div className='font-medium text-sm dark:text-white'>
                      {product.title}
                    </div>
                    <div className='text-xs text-slate-500 dark:text-slate-400'>
                      {product.brand}
                    </div>
                  </div>
                </a>
              ))}
              <div className='p-2 border-t dark:border-slate-800'>
                <Button
                  variant='link'
                  size='sm'
                  onClick={navigateToSearchResults}
                  className='w-full'
                >
                  View all results for {searchQuery}
                </Button>
              </div>
            </div>
          )}
        </div>

        <nav className='hidden md:flex items-center gap-4'>
          <a
            href='/products'
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/products');
            }}
            className='text-sm font-medium hover:text-slate-900 dark:hover:text-white'
          >
            Products
          </a>
          <a
            href='/about'
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/about');
            }}
            className='text-sm font-medium hover:text-slate-900 dark:hover:text-white'
          >
            About
          </a>
          <a
            href='/contact'
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/contact');
            }}
            className='text-sm font-medium hover:text-slate-900 dark:hover:text-white'
          >
            Contact
          </a>
        </nav>

        <div className='flex items-center gap-2 sm:gap-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            <Sun className='h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
            <Moon className='absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          </Button>

          <button onClick={() => navigateTo('/wishlist')} className='relative'>
            <Heart className='h-6 w-6 text-slate-600 dark:text-slate-300' />
            {wishlist.size > 0 && (
              <span className='absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-xs text-white dark:bg-slate-50 dark:text-slate-900'>
                {wishlist.size}
              </span>
            )}
          </button>

          <button onClick={() => navigateTo('/cart')} className='relative'>
            <ShoppingCart className='h-6 w-6 text-slate-600 dark:text-slate-300' />
            {cartItemCount > 0 && (
              <span className='absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-xs text-white dark:bg-slate-50 dark:text-slate-900'>
                {cartItemCount}
              </span>
            )}
          </button>
          {hasMounted && (
            <div className='hidden md:flex items-center gap-2'>
              {user ? (
                <>
                  <span className='text-sm font-medium dark:text-white'>
                    Hi, {user.name}
                  </span>
                  <Button variant='outline' size='sm' onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button size='sm' onClick={() => navigateTo('/auth')}>
                  Login
                </Button>
              )}
            </div>
          )}

          <div className='md:hidden'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsMenuOpen(true)}
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
