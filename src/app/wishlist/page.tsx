'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useApp } from '@/lib/context/app-context';
import { Button } from '@/components/ui/button';
import { priceFmt } from '@/lib/utils/formatters';

const WishlistPage = () => {
  const { wishlist, setPage, addToCart, toggleWishlist, products } = useApp();
  
  const wishlistedProducts = useMemo(() => 
    products.filter(p => wishlist.has(p.id)), 
    [wishlist, products]
  );

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToCart({ 
        id: product.id, 
        quantity: 1, 
        title: product.title, 
        price: product.price, 
        options: {} 
      });
      toggleWishlist(product.id);
    }
  };

  if (wishlistedProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Heart className="mx-auto h-24 w-24 text-slate-300 dark:text-slate-700" />
        <h2 className="mt-6 text-2xl font-bold dark:text-white">Your wishlist is empty</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Browse products and save your favorites for later.</p>
        <Button size="lg" onClick={() => setPage('products')} className="mt-8">
          Find Products
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-[70vh] dark:bg-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight dark:text-white">Your Wishlist</h1>
          <span className="text-slate-600 dark:text-slate-300">
            {wishlistedProducts.length} item{wishlistedProducts.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistedProducts.map(product => (
            <div key={product.id} className="border rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col dark:bg-slate-950 dark:border-slate-800">
              <div className="h-48 w-full overflow-hidden relative">
                <Image
                  src={product.images?.[0] || '/images/placeholder.jpg'}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-slate-800 dark:text-white">{product.title}</h3>
                <p className="text-slate-500 text-sm dark:text-slate-400">{product.brand}</p>
                <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{priceFmt(product.price)}</p>
                <div className="mt-4 pt-4 border-t flex flex-col gap-2  dark:border-slate-800">
                  <Button 
                    onClick={() => handleAddToCart(product.id)}
                    className="w-full"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => toggleWishlist(product.id)}
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;