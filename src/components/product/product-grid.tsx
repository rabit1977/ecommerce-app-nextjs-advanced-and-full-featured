'use client';

import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/lib/context/app-context';
import { Product } from '@/lib/types';
import { ChevronDown } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface ProductGridProps {
  title?: string;
  subtitle?: string;
  products?: Product[];
}

const ProductGrid = ({
  title = 'Featured Products',
  subtitle = 'Check out our latest and greatest',
  products: customProducts,
}: ProductGridProps) => {
  const { products: contextProducts, searchQuery, setSearchQuery } = useApp();
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);

  const products = customProducts || contextProducts;
  const productsPerPage = 8;

  // Handle URL search parameter on component mount
  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, []); // Empty dependency array

  // Get all categories from products
  const categories = useMemo(() => {
    const allCategories = ['all', ...new Set(products.map((p) => p.category))];
    return allCategories.filter(
      (category) => category !== undefined
    ) as string[];
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (filter !== 'all') {
      result = result.filter((p) => p.category === filter);
    }

    // Sort products
    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      // For newest, we'll use the ID as a proxy for date added
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [products, filter, sort, searchQuery]);

  // Rest of the component remains the same...
  // Pagination logic
  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / productsPerPage
  );
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredAndSortedProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const currentTitle = searchQuery
    ? `Search Results for "${searchQuery}"`
    : title;
  const currentSubtitle = searchQuery
    ? `${filteredAndSortedProducts.length} product(s) found`
    : subtitle;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='bg-white dark:bg-slate-950'>
      <div className='container mx-auto px-4 py-16'>
        <div className='md:flex md:items-center md:justify-between'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight text-slate-900 dark:text-white'>
              {currentTitle}
            </h2>
            <p className='mt-2 text-lg text-slate-600 dark:text-slate-300'>
              {currentSubtitle}
            </p>
          </div>
          {!searchQuery && (
            <div className='mt-4 md:mt-0 flex flex-col sm:flex-row gap-4'>
              <div className='relative'>
                <select
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className='appearance-none w-full sm:w-auto rounded-md border border-slate-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-slate-500 focus:outline-none focus:ring-slate-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white'
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c === 'all'
                        ? 'All Categories'
                        : c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
              </div>
              <div className='relative'>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setCurrentPage(1);
                  }}
                  className='appearance-none w-full sm:w-auto rounded-md border border-slate-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-slate-500 focus:outline-none focus:ring-slate-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white'
                >
                  <option value='featured'>Sort: Featured</option>
                  <option value='price-asc'>Sort: Price Low to High</option>
                  <option value='price-desc'>Sort: Price High to Low</option>
                  <option value='rating'>Sort: Highest Rated</option>
                  <option value='newest'>Sort: Newest</option>
                </select>
                <ChevronDown className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
              </div>
            </div>
          )}
        </div>

        <div className='mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className='col-span-full text-center py-16'>
              <p className='text-slate-500 text-lg dark:text-slate-400'>
                No products found.
              </p>
              <p className='text-slate-400 dark:text-slate-500'>
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className='mt-12 flex justify-center'>
            <nav className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronDown className='h-4 w-4 rotate-90' />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                )
              )}

              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronDown className='h-4 w-4 -rotate-90' />
              </Button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export { ProductGrid };
