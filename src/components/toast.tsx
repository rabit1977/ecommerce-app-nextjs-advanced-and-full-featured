'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useApp } from '@/lib/context/app-context';

const Toast = () => {
  const { toast } = useApp();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }} 
          animate={{ opacity: 1, y: 0, scale: 1 }} 
          exit={{ opacity: 0, y: 20, scale: 0.9 }} 
          className="fixed bottom-16 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-full bg-slate-900 text-white py-2 px-5 shadow-lg z-50 dark:bg-slate-50 dark:text-slate-900"
        >
          <Check className="h-5 w-5 text-green-400" />
          <p className="text-sm font-medium">{toast}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { Toast };