'use client';

import { Button } from '@/components/ui/button';
import { useApp } from '@/lib/context/app-context';
import { CartItem as CartItemType } from '@/lib/types';
import { priceFmt } from '@/lib/utils/formatters';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback } from 'react';

// --- Sub-component for intelligently displaying product options ---
const OptionDisplay = React.memo(({ name, value }: { name: string; value: string }) => {
  // If the option is a color, render a color swatch.
  if (name.toLowerCase() === 'color' && /^#([0-9A-F]{3}){1,2}$/i.test(value)) {
    return (
      <div className="flex items-center gap-1.5">
        <span>{name}:</span>
        <span
          className="h-4 w-4 rounded-full border dark:border-slate-700"
          style={{ backgroundColor: value }}
          title={value} // Show hex on hover for accessibility
        />
      </div>
    );
  }

  // Otherwise, render the text value.
  return (
    <span>
      {name}: {value}
    </span>
  );
});
OptionDisplay.displayName = 'OptionDisplay';

interface CartItemProps {
  item: CartItemType;
}

// --- Main CartItem Component wrapped in React.memo ---
const CartItem = React.memo(({ item }: CartItemProps) => {
  const { updateCartQuantity, removeFromCart, saveForLater } = useApp();

  // --- Stabilized Event Handlers with useCallback ---
  const handleQuantityDecrease = useCallback(() => {
    updateCartQuantity(item.cartItemId, item.quantity - 1);
  }, [item.cartItemId, item.quantity, updateCartQuantity]);

  const handleQuantityIncrease = useCallback(() => {
    updateCartQuantity(item.cartItemId, item.quantity + 1);
  }, [item.cartItemId, item.quantity, updateCartQuantity]);

  const handleSaveForLater = useCallback(() => {
    saveForLater(item.cartItemId);
  }, [item.cartItemId, saveForLater]);

  const handleRemove = useCallback(() => {
    removeFromCart(item.cartItemId);
  }, [item.cartItemId, removeFromCart]);

  return (
    <li className="flex flex-col py-6 sm:flex-row">
      <div className="h-48 w-full flex-shrink-0 overflow-hidden rounded-md border dark:border-slate-800 sm:h-24 sm:w-24">
        <Image
          src={item.image || '/images/placeholder.jpg'}
          alt={item.title}
          width={96}
          height={96}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="mt-4 flex flex-1 flex-col sm:ml-4 sm:mt-0">
        <div>
          <div className="flex flex-col justify-between text-base font-medium text-slate-900 dark:text-white sm:flex-row">
            {/* --- IMPROVEMENT: Using proper Next.js Link --- */}
            <h3>
              <Link href={`/products/${item.id}`} className="hover:underline">
                {item.title}
              </Link>
            </h3>
            <p className="mt-1 flex-shrink-0 sm:ml-4 sm:mt-0">
              {priceFmt(item.price * item.quantity)}
            </p>
          </div>
          {/* --- IMPROVEMENT: Using the new OptionDisplay component --- */}
          {item.options && Object.keys(item.options).length > 0 && (
            <div className="mt-1 flex flex-wrap gap-x-3 text-sm text-slate-500 dark:text-slate-400">
              {Object.entries(item.options).map(([name, value]) => (
                <OptionDisplay key={name} name={name} value={value} />
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center rounded-md border dark:border-slate-700">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleQuantityDecrease} aria-label="Decrease quantity">
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center dark:text-white" aria-live="polite">
              {item.quantity}
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleQuantityIncrease} aria-label="Increase quantity">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="link" size="sm" onClick={handleSaveForLater}>
              Save for Later
            </Button>
            <Button variant="link" size="sm" className="font-medium text-red-600 hover:text-red-500" onClick={handleRemove}>
              <Trash2 className="mr-1 h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
});

CartItem.displayName = 'CartItem'; // Good practice for debugging with React.memo

export { CartItem };