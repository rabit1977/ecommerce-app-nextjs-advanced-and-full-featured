'use client';

import React, { useMemo } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useApp } from '@/lib/context/app-context';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/components/cart/cart-item';
import { CartSummary } from '@/components/cart/cart-summary';
import { useRouter } from 'next/navigation';

const CartPage = () => {
  const { cart } = useApp();
  console.log('Cart items:', cart);
  const router = useRouter();
  
  const subtotal = useMemo(() => 
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0), 
    [cart]
  );
  
  const shipping = 5.00;
  const total = subtotal + shipping;

  const navigateToProducts = () => {
    router.push('/products');
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingCart className="mx-auto h-24 w-24 text-slate-300 dark:text-slate-700" />
        <h2 className="mt-6 text-2xl font-bold dark:text-white">Your cart is empty</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Button size="lg" onClick={navigateToProducts} className="mt-8">
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-[70vh] dark:bg-slate-900">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight dark:text-white">Your Cart</h1>
        
        <div className="mt-8 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          <div className="w-full lg:w-2/3">
            <ul role="list" className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {cart.map((item) => (
                <CartItem key={item.cartItemId} item={item} />
              ))}
            </ul>
          </div>
          
          <div className="w-full lg:w-1/3">
            <CartSummary 
              subtotal={subtotal}
              shipping={shipping}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;