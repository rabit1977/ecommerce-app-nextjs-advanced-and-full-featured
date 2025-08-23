'use client';

import { useState, useEffect } from 'react';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const item = window.localStorage.getItem('wishlist');
      if (item) {
        try {
          const parsed = JSON.parse(item);
          setWishlist(new Set(parsed));
        } catch {
          setWishlist(new Set());
        }
      }
    } catch (error) {
      console.error('Error reading wishlist from localStorage:', error);
    }
  }, []);

  const addToWishlist = (productId: string) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      newWishlist.add(productId);
      window.localStorage.setItem('wishlist', JSON.stringify(Array.from(newWishlist)));
      return newWishlist;
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      newWishlist.delete(productId);
      window.localStorage.setItem('wishlist', JSON.stringify(Array.from(newWishlist)));
      return newWishlist;
    });
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      window.localStorage.setItem('wishlist', JSON.stringify(Array.from(newWishlist)));
      return newWishlist;
    });
  };

  const hasInWishlist = (productId: string) => {
    return wishlist.has(productId);
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    hasInWishlist
  };
}