'use client';

import { useAppContext } from '@/lib/context/app-context';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function ToastProvider() {
  const { toast: appToast } = useAppContext();

  useEffect(() => {
    if (appToast) {
      toast(appToast);
    }
  }, [appToast]);

  return null;
}
