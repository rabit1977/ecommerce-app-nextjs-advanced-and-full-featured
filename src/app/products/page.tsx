'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/product/product-grid';
import { useApp } from '@/lib/context/app-context';

const ProductsPage = () => {
  const { setSearchQuery } = useApp();
  const searchParams = useSearchParams();

  // Get search query from URL on component mount
  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, []); // Empty dependency array since searchParams and setSearchQuery are stable

  return <ProductGrid title="All Products" subtitle="Browse our complete collection" />;
};

export default ProductsPage;