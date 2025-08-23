'use client';

import { useEffect } from 'react';
import { useApp } from '@/lib/context/app-context';
import { initialProducts } from '@/lib/constants/products';

const ProductsLoader = () => {
  const { products } = useApp();

  useEffect(() => {
    // Debug: Check if products are loaded
    console.log('Products loaded:', products.length);
    
    // If no products are loaded, initialize with default products
    if (products.length === 0) {
      console.log('Initializing with default products');
      localStorage.setItem('products', JSON.stringify(initialProducts));
      window.location.reload();
    }
  }, [products]);

  return null; // This component doesn't render anything
};

export { ProductsLoader };