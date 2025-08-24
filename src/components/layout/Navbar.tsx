'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/lib/context/app-context';
import { getProductImage } from '@/lib/utils/product-images';
import { Heart, Menu, Moon, Search, ShoppingCart, Sun, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

export function Navbar() {
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
  } = useApp();

  const router = useRouter();
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
          p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5);
  }, [searchQuery, products]);

  const handleSearchClick = (productId: string) => {
    setSearchQuery('');
    router.push(`/product/${productId}`);
  };

  return (
    <header className='sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-sm'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4 gap-4'>
        <Link href='/' className='flex items-center gap-2 flex-shrink-0'>
          <div className='h-6 w-6 bg-primary rounded-sm' />
          <span className='text-xl font-bold hidden sm:inline'>Electro</span>
        </Link>

        <div className='flex-1 max-w-md relative'>
          <div className='relative'>
            <Input
              placeholder='Search products...'
              className='pr-10'
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery ? (
              <button
                onClick={handleClearSearch}
                className='absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground hover:text-foreground'
              >
                <X className='h-5 w-5' />
              </button>
            ) : (
              <Search className='absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none' />
            )}
          </div>

          {searchQuery && searchResults.length > 0 && (
            <div className='absolute top-full mt-2 left-0 right-0 bg-background rounded-md shadow-lg z-20 border p-2'>
              {searchResults.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSearchClick(product.id)}
                  className='flex items-center gap-3 p-2 rounded-md hover:bg-accent w-full text-left'
                >
                  <div className='relative h-10 w-10 flex-shrink-0'>
                    <Image
                      src={getProductImage(product)}
                      alt={product.title}
                      fill
                      className='object-cover rounded-md'
                      sizes='40px'
                    />
                  </div>
                  <div>
                    <div className='font-medium text-sm'>{product.title}</div>
                    <div className='text-xs text-muted-foreground'>
                      {product.brand}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <nav className='hidden md:flex items-center gap-4'>
          <Link
            href='/products'
            className='text-sm font-medium hover:text-primary'
          >
            Products
          </Link>
          <Link
            href='/about'
            className='text-sm font-medium hover:text-primary'
          >
            About
          </Link>
          <Link
            href='/contact'
            className='text-sm font-medium hover:text-primary'
          >
            Contact
          </Link>
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

          <Button
            variant='ghost'
            size='icon'
            onClick={() => router.push('/wishlist')}
            className='relative'
          >
            <Heart className='h-6 w-6 text-muted-foreground hover:text-foreground' />
            {wishlist.size > 0 && (
              <span className='absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground'>
                {wishlist.size}
              </span>
            )}
          </Button>

          <Button
            variant='ghost'
            size='icon'
            onClick={() => router.push('/cart')}
            className='relative'
          >
            <ShoppingCart className='h-6 w-6 text-muted-foreground hover:text-foreground' />
            {cartItemCount > 0 && (
              <span className='absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground'>
                {cartItemCount}
              </span>
            )}
          </Button>

          <div className='hidden md:flex items-center gap-2'>
            {user ? (
              <>
                <span className='text-sm font-medium'>Hi, {user.name}</span>
                <Button variant='outline' size='sm' onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button size='sm' onClick={() => router.push('/auth')}>
                Login
              </Button>
            )}
          </div>

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
}
