'use client';

import React from 'react';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/lib/types';
import { useApp } from '@/lib/context/app-context';
import { Button } from '@/components/ui/button';
import { priceFmt } from '@/lib/utils/formatters';
import { useRouter } from 'next/navigation';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateCartQuantity, removeFromCart, saveForLater } = useApp();
  const router = useRouter();

  const viewProduct = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  return (
    <li className="flex flex-col sm:flex-row py-6">
      <div className="h-48 w-full sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-md border dark:border-slate-800">
        <Image
          src={item.image || '/images/placeholder.jpg'}
          alt={item.title}
          width={96}
          height={96}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex flex-col sm:flex-row justify-between text-base font-medium text-slate-900 dark:text-white">
            <h3>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); viewProduct(item.id); }}
                className="hover:underline cursor-pointer"
              >
                {item.title}
              </a>
            </h3>
            <p className="mt-1 sm:mt-0 sm:ml-4 flex-shrink-0">
              {priceFmt(item.price * item.quantity)}
            </p>
          </div>
          {item.options && Object.keys(item.options).length > 0 && (
            <div className="mt-1 flex flex-wrap gap-x-3 text-sm text-slate-500 dark:text-slate-400">
              {Object.entries(item.options).map(([name, value]) => (
                <span key={name}>{name}: {value}</span>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center border rounded-md dark:border-slate-700">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center dark:text-white">{item.quantity}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="link" 
              size="sm" 
              onClick={() => saveForLater(item.cartItemId)}
            >
              Save for Later
            </Button>
            <Button 
              variant="link" 
              size="sm" 
              className="font-medium text-red-600 hover:text-red-500" 
              onClick={() => removeFromCart(item.cartItemId)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
};

export { CartItem };