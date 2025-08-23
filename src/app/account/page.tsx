'use client';

import { Button } from '@/components/ui/button';
import { useApp } from '@/lib/context/app-context';
import { priceFmt } from '@/lib/utils/formatters';
import { Heart, Package, ShoppingCart, User } from 'lucide-react';

const AccountPage = () => {
  const { user, orders, setPage, viewOrder } = useApp();

  if (!user) {
    return (
      <div className='container mx-auto px-4 py-16 text-center'>
        <User className='mx-auto h-24 w-24 text-slate-300 dark:text-slate-700' />
        <h2 className='mt-6 text-2xl font-bold dark:text-white'>
          Please log in to view your account
        </h2>
        <Button size='lg' onClick={() => setPage('auth')} className='mt-8'>
          Login
        </Button>
      </div>
    );
  }

  return (
    <div className='bg-slate-50 min-h-[70vh] dark:bg-slate-900'>
      <div className='container mx-auto px-4 py-12'>
        <div className='flex items-center gap-4 mb-8'>
          <div className='w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-200'>
            <User className='h-8 w-8' />
          </div>
          <div>
            <h1 className='text-3xl font-bold tracking-tight dark:text-white'>
              My Account
            </h1>
            <p className='text-slate-600 dark:text-slate-300'>{user.email}</p>
          </div>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          <div className='md:col-span-2'>
            <h2 className='text-xl font-semibold dark:text-white mb-4'>
              Order History
            </h2>

            {orders.length === 0 ? (
              <div className='bg-white rounded-lg p-6 text-center dark:bg-slate-800'>
                <Package className='mx-auto h-12 w-12 text-slate-400' />
                <p className='mt-4 text-slate-500 dark:text-slate-400'>
                  You haven&apos;t placed any orders yet.
                </p>
                <Button onClick={() => setPage('products')} className='mt-4'>
                  Start Shopping
                </Button>
              </div>
            ) : (
              <div className='bg-white rounded-lg overflow-hidden shadow-sm dark:bg-slate-800'>
                <div className='border-b dark:border-slate-700'>
                  <div className='grid grid-cols-12 px-6 py-3 text-sm font-medium text-slate-500 dark:text-slate-400'>
                    <div className='col-span-4'>Order</div>
                    <div className='col-span-4'>Date</div>
                    <div className='col-span-2'>Items</div>
                    <div className='col-span-2 text-right'>Total</div>
                  </div>
                </div>

                <div className='divide-y dark:divide-slate-700'>
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className='grid grid-cols-12 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-750 cursor-pointer transition-colors'
                      onClick={() => viewOrder(order.id)}
                    >
                      <div className='col-span-4 font-medium dark:text-white'>
                        #{order.id}
                      </div>
                      <div className='col-span-4 text-slate-600 dark:text-slate-300'>
                        {order.date}
                      </div>
                      <div className='col-span-2 text-slate-600 dark:text-slate-300'>
                        {order.items.length} item(s)
                      </div>
                      <div className='col-span-2 text-right font-medium dark:text-white'>
                        {priceFmt(order.total)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className='space-y-6'>
            <div className='bg-white rounded-lg p-6 shadow-sm dark:bg-slate-800'>
              <h3 className='text-lg font-semibold dark:text-white mb-4'>
                Account Details
              </h3>
              <div className='space-y-2'>
                <div>
                  <p className='text-sm text-slate-500 dark:text-slate-400'>
                    Name
                  </p>
                  <p className='font-medium dark:text-white'>{user.name}</p>
                </div>
                <div>
                  <p className='text-sm text-slate-500 dark:text-slate-400'>
                    Email
                  </p>
                  <p className='font-medium dark:text-white'>{user.email}</p>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-lg p-6 shadow-sm dark:bg-slate-800'>
              <h3 className='text-lg font-semibold dark:text-white mb-4'>
                Quick Actions
              </h3>
              <div className='space-y-3'>
                <Button
                  variant='outline'
                  className='w-full justify-start'
                  onClick={() => setPage('wishlist')}
                >
                  <Heart className='h-4 w-4 mr-2' />
                  View Wishlist
                </Button>
                <Button
                  variant='outline'
                  className='w-full justify-start'
                  onClick={() => setPage('cart')}
                >
                  <ShoppingCart className='h-4 w-4 mr-2' />
                  View Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
