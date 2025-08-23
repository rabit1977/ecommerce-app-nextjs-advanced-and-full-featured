'use client';

import { RelatedProducts } from '@/components/product/related-products';
import { ReviewsSection } from '@/components/product/reviews-section';
import { Button } from '@/components/ui/button';
import { Stars } from '@/components/ui/stars';
import { useApp } from '@/lib/context/app-context';
import { cn } from '@/lib/utils';
import { priceFmt } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';
import {
  Check,
  ChevronLeft,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShoppingCart,
} from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { products, wishlist, toggleWishlist, addToCart } = useApp();
  const product = products.find((p) => p.id === params.id);

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  const initialSelectedOptions = useMemo(() => {
    return (
      product?.options?.reduce(
        (acc, opt) => ({
          ...acc,
          [opt.name]: opt.variants[0]?.value || '',
        }),
        {}
      ) || {}
    );
  }, [product]);

  const activeImage = useMemo(() => {
    if (product?.options?.[0]?.type === 'color') {
      const optionName = product.options[0].name;
      const selectedVariant = product.options[0].variants.find(
        (v) => v.value === selectedOptions[optionName]
      );
      return selectedVariant?.image || product.images?.[0] || '/images/placeholder.jpg';
    }
    return product?.images?.[0] || '/images/placeholder.jpg';
  }, [product, selectedOptions]);

  useEffect(() => {
    setSelectedOptions(initialSelectedOptions);
  }, [initialSelectedOptions]);

  const navigateToProducts = () => {
    router.push('/products');
  };

  if (!product) {
    return (
      <div className='container mx-auto px-4 py-16 text-center'>
        Product not found.{' '}
        <Button variant='link' onClick={navigateToProducts}>
          Go back
        </Button>
      </div>
    );
  }

  const isWished = wishlist.has(product.id);
  const isOutOfStock = product.stock === 0;

  const handleOptionChange = (optionName: string, optionValue: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: optionValue }));
  };

  const handleAdd = async () => {
    setAdding(true);
    await new Promise((r) => setTimeout(r, 900));
    addToCart({
      id: product.id,
      quantity,
      title: product.title,
      price: product.price,
      options: selectedOptions,
    });
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className='bg-white dark:bg-slate-950'>
      <div className='container mx-auto px-4 py-12'>
        <Button
          variant='ghost'
          onClick={navigateToProducts}
          className='mb-6'
        >
          <ChevronLeft className='h-4 w-4 mr-2' />
          Back to Products
        </Button>

        <div className='grid md:grid-cols-2 gap-8 md:gap-12'>
          <motion.div layoutId={`product-card-${product.id}`}>
            <div className='w-full h-80 sm:h-[400px] overflow-hidden rounded-xl border dark:border-slate-800'>
              <Image
                src={activeImage}
                alt={product.title}
                width={500}
                height={400}
                className='h-full w-full object-cover'
              />
            </div>

            {product.options && product.options.length > 0 && product.options[0]?.type === 'color' && (
                <div className='mt-4 grid grid-cols-4 gap-4'>
                  {product.options[0].variants.map((variant) => (
                    <button
                      key={variant.value}
                      onClick={() =>
                        handleOptionChange(
                          product.options![0].name, // Use non-null assertion since we checked it exists
                          variant.value
                        )
                      }
                      className={cn(
                        'overflow-hidden rounded-lg border transition-all duration-200 dark:border-slate-800',
                        selectedOptions[product.options![0].name] === variant.value
                          ? 'ring-2 ring-slate-900 ring-offset-2 dark:ring-slate-50'
                          : 'opacity-70 hover:opacity-100'
                      )}
                    >
                      <Image
                        src={variant.image || product.images?.[0] || '/images/placeholder.jpg'}
                        alt={variant.name}
                        width={96}
                        height={96}
                        className='h-20 sm:h-24 w-full object-cover'
                      />
                    </button>
                  ))}
                </div>
              )}
          </motion.div>

          <div>
            <div className='text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400'>
              {product.brand}
            </div>
            <h1 className='text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mt-1 dark:text-white'>
              {product.title}
            </h1>

            <div className='mt-4 flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <Stars value={product.rating} />
                <span className='text-sm text-slate-600 dark:text-slate-400'>
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className='mt-6 flex items-baseline gap-3'>
              <span className='text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white'>
                {priceFmt(product.price)}
              </span>
            </div>

            <div className='mt-4'>
              {isOutOfStock ? (
                <p className='font-semibold text-red-500'>Out of Stock</p>
              ) : (
                <p className='text-sm text-slate-600 dark:text-slate-400'>
                  In stock: {product.stock} items
                </p>
              )}
            </div>

            <p className='mt-6 text-slate-600 leading-relaxed dark:text-slate-300'>
              {product.description}
            </p>

            {product.options && product.options.length > 0 && (
              <div className='mt-6 space-y-4'>
                {product.options.map((option) => (
                  <div key={option.name}>
                    <h3 className='text-sm font-medium dark:text-white'>
                      {option.name}
                    </h3>
                    <div className='mt-2 flex flex-wrap gap-2'>
                      {option.variants.map((variant) => (
                        <button
                          key={variant.value}
                          type='button'
                          onClick={() =>
                            handleOptionChange(option.name, variant.value)
                          }
                          className={cn(
                            'relative flex items-center justify-center rounded-md p-0.5',
                            'focus:outline-none focus:ring-2 focus:ring-offset-2',
                            selectedOptions[option.name] === variant.value
                              ? 'ring-slate-900 dark:ring-slate-50'
                              : 'ring-transparent',
                            option.type === 'color'
                              ? 'h-8 w-8'
                              : 'h-10 px-4 text-sm font-medium border border-slate-200 dark:border-slate-700'
                          )}
                        >
                          {option.type === 'color' && (
                            <span
                              className='h-full w-full rounded-md border border-gray-200 block'
                              style={{ backgroundColor: variant.value }}
                            />
                          )}
                          {option.type === 'size' && (
                            <span className='text-slate-900 dark:text-white'>
                              {variant.name}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className='mt-8 flex flex-col sm:flex-row items-center gap-4'>
              <div className='flex items-center border rounded-md dark:border-slate-700'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus className='h-4 w-4' />
                </Button>
                <span className='w-8 text-center dark:text-white'>
                  {quantity}
                </span>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus className='h-4 w-4' />
                </Button>
              </div>

              <Button
                className='w-full sm:w-auto sm:flex-1'
                onClick={handleAdd}
                disabled={isOutOfStock || adding}
              >
                <motion.span
                  key={added ? 'added' : adding ? 'adding' : 'add'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className='flex items-center justify-center gap-2'
                >
                  {added ? (
                    <>
                      <Check className='h-5 w-5 text-green-400' />
                      Added!
                    </>
                  ) : adding ? (
                    <>
                      <RotateCcw className='h-5 w-5 animate-spin' />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className='h-5 w-5' />
                      {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </>
                  )}
                </motion.span>
              </Button>

              <Button
                variant={isWished ? 'secondary' : 'outline'}
                size='lg'
                onClick={() => toggleWishlist(product.id)}
                aria-label='Wishlist'
                className='w-full sm:w-auto'
              >
                <Heart
                  className={cn(
                    'h-6 w-6 transition-colors',
                    isWished ? 'fill-red-500 text-red-500' : ''
                  )}
                />
              </Button>
            </div>
          </div>
        </div>

        <ReviewsSection
          productId={product.id}
          reviews={product.reviews || []}
        />

        <RelatedProducts currentProduct={product} />
      </div>
    </div>
  );
};

export default ProductDetailPage;