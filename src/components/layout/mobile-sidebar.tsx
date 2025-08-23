'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, X } from 'lucide-react';
import { useApp } from '@/lib/context/app-context';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation'; // Add this import

const MobileSidebar = () => {
  const { user, logout, isMenuOpen, setIsMenuOpen } = useApp();
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); // Add router for navigation

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, setIsMenuOpen]);

  // Navigation function using router
  const navigateTo = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  const navLink = (path: string, text: string) => (
    <a 
      href={path} 
      onClick={(e) => { e.preventDefault(); navigateTo(path); }} 
      className="text-lg font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
    >
      {text}
    </a>
  );

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          <motion.div
            ref={menuRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white dark:bg-slate-950"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full p-6 overflow-y-auto">
              <button 
                onClick={() => setIsMenuOpen(false)} 
                className="self-end p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>

              {user ? (
                <div className="flex items-center gap-3 border-b pb-4 dark:border-slate-800 flex-shrink-0">
                  <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                    <User className="h-6 w-6"/>
                  </div>
                  <div>
                    <p className="font-semibold dark:text-white">{user.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                </div>
              ) : (
                <div className="flex-shrink-0">
                  <Button size="lg" className="w-full" onClick={() => navigateTo('/auth')}>
                    Login / Sign Up
                  </Button>
                </div>
              )}

              <nav className="mt-8 flex flex-col gap-6 flex-grow">
                {navLink('/', 'Home')}
                {navLink('/products', 'All Products')}
                {navLink('/about', 'About Us')}
                {navLink('/contact', 'Contact Us')}
                {user && navLink('/account', 'My Account')}
              </nav>

              {user && (
                <div className="mt-auto border-t pt-4 flex-shrink-0 dark:border-slate-800">
                  <Button variant="outline" className="w-full" onClick={() => { logout(); setIsMenuOpen(false); }}>
                    <LogOut className="h-4 w-4 mr-2"/>
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { MobileSidebar };