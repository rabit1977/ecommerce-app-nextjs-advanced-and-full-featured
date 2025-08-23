'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation'; // Add this import

const Hero = () => {
  const router = useRouter(); // Add router for direct navigation
  const testimonials = useMemo(() => [
    { quote: "The Quantum TV has the best picture I've ever seen.", name: "Sarah J." },
    { quote: "My new AeroBook is unbelievably fast and light.", name: "Mike R." },
    { quote: "Fast shipping and excellent customer service!", name: "Emily W." },
  ], []);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  // Use router.push for direct navigation instead of setPage
  const navigateToProducts = () => {
    router.push('/products');
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-16 sm:py-20 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-white"
        >
          The Future of Tech, Today.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }} 
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300"
        >
          Discover cutting-edge electronics and gadgets designed to elevate your everyday life. Unbeatable prices, unmatched quality.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.4 }} 
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button size="lg" onClick={navigateToProducts}>Shop Now</Button>
          <Button size="lg" variant="outline">Learn More</Button>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.6 }} 
          className="mt-12 h-10"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-slate-600 italic dark:text-slate-400">{testimonials[currentTestimonial].quote}</p>
              <p className="text-sm font-semibold text-slate-500 mt-1 dark:text-slate-500">- {testimonials[currentTestimonial].name}</p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export { Hero };