'use client';

import { Button } from '@/components/ui/button';
import { Stars } from '@/components/ui/stars';
import { useApp } from '@/lib/context/app-context';
import { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { priceFmt } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Eye, Heart } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { viewProduct, setQuickViewProductId, wishlist, toggleWishlist } =
    useApp();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const isWished = wishlist.has(product.id);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const imageCount =
      product.images?.length || product.options?.[0]?.variants?.length || 0;
    setActiveImageIndex((prev) => (prev === 0 ? imageCount - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const imageCount =
      product.images?.length || product.options?.[0]?.variants?.length || 0;
    setActiveImageIndex((prev) => (prev === imageCount - 1 ? 0 : prev + 1));
  };

  const isOutOfStock = product.stock === 0;
  const primaryImage =
    product.options?.[0]?.variants?.[0]?.image ||
    product.images?.[0] ||
    '/images/placeholder.jpg';
  const displayImages =
    product.images || product.options?.[0]?.variants?.map((v) => v.image) || [];
  const displayImage = displayImages[activeImageIndex] || primaryImage;

  return (
    <motion.div
      layoutId={`product-card-${product.id}`}
      whileHover={{ y: -5 }}
      className='w-full'
    >
      <div className='group relative w-full overflow-hidden rounded-2xl border bg-white shadow-md transition-shadow hover:shadow-xl dark:bg-slate-900 dark:border-slate-800'>
        <div
          className='h-48 w-full overflow-hidden relative'
          onClick={() => viewProduct(product.id)}
        >
          <Image
            src={displayImage}
            alt={product.title}
            fill
            className='object-cover'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />

          {displayImages.length > 1 && (
            <>
              <div className='absolute inset-0 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <Button
                  size='icon'
                  variant='secondary'
                  className='rounded-full h-8 w-8 ml-2 shadow-md'
                  onClick={handlePrevImage}
                >
                  <ChevronLeft className='h-4 w-4' />
                </Button>
                <Button
                  size='icon'
                  variant='secondary'
                  className='rounded-full h-8 w-8 mr-2 shadow-md'
                  onClick={handleNextImage}
                >
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
              <div className='absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5'>
                {displayImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex(index);
                    }}
                    className={cn(
                      'h-1.5 w-1.5 rounded-full transition-all duration-300',
                      activeImageIndex === index
                        ? 'bg-white ring-1 ring-slate-500 scale-125'
                        : 'bg-white/60'
                    )}
                  />
                ))}
              </div>
            </>
          )}
          {isOutOfStock && (
            <div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
              <span className='text-white font-bold uppercase tracking-widest'>
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className='absolute top-2 right-2 flex flex-col gap-2'>
          <Button
            size='icon'
            variant='secondary'
            className='rounded-full h-8 w-8 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300'
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProductId(product.id);
            }}
          >
            <Eye className='h-4 w-4' />
          </Button>
          <Button
            size='icon'
            variant={isWished ? 'default' : 'secondary'}
            className='rounded-full h-8 w-8 shadow-md'
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
          >
            <Heart className={cn('h-4 w-4', isWished ? 'fill-white' : '')} />
          </Button>
        </div>

        <div className='p-4' onClick={() => viewProduct(product.id)}>
          <div className='text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400'>
            {product.brand}
          </div>
          <h3 className='text-lg font-semibold leading-tight text-slate-900 truncate dark:text-white'>
            {product.title}
          </h3>
          <div className='mt-2 flex items-center justify-between'>
            <span className='text-xl font-bold text-slate-900 dark:text-white'>
              {priceFmt(product.price)}
            </span>
            <div className='flex items-center gap-1'>
              <Stars value={product.rating} />
              <span className='text-xs text-slate-500 dark:text-slate-400'>
                ({product.reviewCount})
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export { ProductCard };
