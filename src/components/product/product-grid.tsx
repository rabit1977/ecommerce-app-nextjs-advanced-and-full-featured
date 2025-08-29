'use client';

import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/lib/context/app-context';
import { usePagination, DOTS } from '@/lib/hooks/usePagination';

import { Product } from '@/lib/types';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

// --- Configuration ---
const PRODUCTS_PER_PAGE = 8;

// --- Sorting Logic Map (Declarative and Extensible) ---
const sortOptions = {
  featured: (a: Product, b: Product) => 0, // Default order
  'price-asc': (a: Product, b: Product) => a.price - b.price,
  'price-desc': (a: Product, b: Product) => b.price - a.price,
  rating: (a: Product, b: Product) => (b.rating || 0) - (a.rating || 0),
  newest: (a: Product, b: Product) => b.id.localeCompare(a.id),
};

type SortKey = keyof typeof sortOptions;

interface ProductGridProps {
  title?: string;
  subtitle?: string;
  products?: Product[];
}

const ProductGrid = ({
  title = 'All Products',
  subtitle = 'Find the perfect tech for you',
  products: customProducts,
}: ProductGridProps) => {
  const { products: contextProducts } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- State Derived from URL (Single Source of Truth) ---
  const products = customProducts || contextProducts;
  const searchQuery = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || 'all';
  const currentSort = (searchParams.get('sort') as SortKey) || 'featured';
  const currentPage = Number(searchParams.get('page')) || 1;

  // --- Memoized Derived Data ---
  const categories = useMemo(() => {
    return ['all', ...new Set(products.map((p) => p.category))];
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // 1. Filter by search query
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(lowercasedQuery) ||
          p.brand.toLowerCase().includes(lowercasedQuery) ||
          p.category.toLowerCase().includes(lowercasedQuery)
      );
    }

    // 2. Filter by category
    if (currentCategory !== 'all') {
      result = result.filter((p) => p.category === currentCategory);
    }

    // 3. Sort the results
    result.sort(sortOptions[currentSort]);

    return result;
  }, [products, searchQuery, currentCategory, currentSort]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredAndSortedProducts.slice(
      startIndex,
      startIndex + PRODUCTS_PER_PAGE
    );
  }, [filteredAndSortedProducts, currentPage]);

  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / PRODUCTS_PER_PAGE
  );

  const paginationRange = usePagination({
    currentPage,
    totalCount: filteredAndSortedProducts.length,
    pageSize: PRODUCTS_PER_PAGE,
  });

  // --- Stable Event Handlers ---
  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }
      return newSearchParams.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (newCategory: string) => {
    router.push(
      `${pathname}?${createQueryString({ category: newCategory, page: 1 })}`,
      { scroll: false }
    );
  };

  const handleSortChange = (newSort: string) => {
    router.push(
      `${pathname}?${createQueryString({ sort: newSort, page: 1 })}`,
      { scroll: false }
    );
  };

  const handlePageChange = (newPage: number | string) => {
    if (typeof newPage === 'number' && newPage >= 1 && newPage <= totalPages) {
      router.push(`${pathname}?${createQueryString({ page: newPage })}`, {
        scroll: true, // Scroll to top on page change
      });
    }
  };

  // --- Dynamic UI Text ---
  const currentTitle = searchQuery ? `Results for "${searchQuery}"` : title;
  const currentSubtitle = searchQuery
    ? `${filteredAndSortedProducts.length} product(s) found`
    : subtitle;

  return (
    <div className='bg-slate-50 dark:bg-slate-900'>
      <div className='container mx-auto px-4 py-16'>
        {/* Header and Filters */}
        <div className='md:flex md:items-center md:justify-between'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight text-slate-900 dark:text-white'>
              {currentTitle}
            </h2>
            <p className='mt-2 text-lg text-slate-600 dark:text-slate-300'>
              {currentSubtitle}
            </p>
          </div>
          <div className='mt-4 flex flex-col gap-4 sm:flex-row md:mt-0'>
            {/* Category Filter */}
            <div className='relative'>
              <select
                value={currentCategory}
                onChange={(e) => handleFilterChange(e.target.value)}
                className='w-full cursor-pointer appearance-none rounded-md border border-slate-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-slate-500 focus:outline-none focus:ring-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white sm:w-auto'
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'all' ? 'All Categories' : c}
                  </option>
                ))}
              </select>
              <ChevronDown className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
            </div>
            {/* Sort Dropdown */}
            <div className='relative'>
              <select
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className='w-full cursor-pointer appearance-none rounded-md border border-slate-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-slate-500 focus:outline-none focus:ring-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white sm:w-auto'
              >
                <option value='featured'>Sort: Featured</option>
                <option value='price-asc'>Sort: Price Low to High</option>
                <option value='price-desc'>Sort: Price High to Low</option>
                <option value='rating'>Sort: Highest Rated</option>
                <option value='newest'>Sort: Newest</option>
              </select>
              <ChevronDown className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className='mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className='col-span-full py-16 text-center'>
              <p className='text-lg text-slate-500 dark:text-slate-400'>
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
                size='icon'
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label='Go to previous page'
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>
              {paginationRange.map((page, index) =>
                page === DOTS ? (
                  <span
                    key={`dots-${index}`}
                    className='flex h-9 w-9 items-center justify-center'
                  >
                    &#8230;
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size='icon'
                    onClick={() => handlePageChange(page)}
                    aria-current={currentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant='outline'
                size='icon'
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label='Go to next page'
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export { ProductGrid };
