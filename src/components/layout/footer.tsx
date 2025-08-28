'use client';

export function Footer() {
  return (
    <footer className=''>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid gap-8 md:grid-cols-4'>
          <div>
            <h3 className='text-lg font-semibold'>Electro</h3>
            <p className='mt-2 text-sm text-muted-foreground'>
              Your one-stop shop for the best electronics.
            </p>
          </div>
          <div>
            <h4 className='font-semibold'>Shop</h4>
            <ul className='mt-4 space-y-2 text-sm'>
              <li>
                <a href='#' className='hover:text-foreground'>
                  TVs & Displays
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground'>
                  Laptops & Computers
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground'>
                  Phones & Tablets
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground'>
                  Audio
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className='font-semibold'>Support</h4>
            <ul className='mt-4 space-y-2 text-sm'>
              <li>
                <a href='#' className='hover:text-foreground'>
                  Contact Us
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground'>
                  FAQ
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground'>
                  Shipping & Returns
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className='font-semibold'>Stay Connected</h4>
          </div>
        </div>
        <div className='mt-8 border-t pt-8 text-center text-sm text-muted-foreground'>
          &copy; {new Date().getFullYear()} Electro Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
