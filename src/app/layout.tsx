import type { Metadata } from "next";
import { CartDebug } from '@/components/debug/cart-debug';
import ErrorBoundary from '@/components/error-boundary';
import { Inter } from "next/font/google";
import { AppProvider } from '@/lib/context/app-context';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileSidebar } from '@/components/layout/mobile-sidebar';
import { QuickViewModal } from '@/components/product/quick-view-modal';
import { Toast } from '@/components/toast';
import "./globals.css";
import { DataRecovery } from "@/components/data-recovery";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Electro E-commerce",
  description: "A modern e-commerce application built with Next.js and TypeScript.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>

        <AppProvider>
          <div className="min-h-screen bg-white font-sans text-slate-800 dark:bg-slate-950 dark:text-slate-200">
            <Header />
            <MobileSidebar />
            <main className="min-h-[calc(100vh-4rem)]">
              {children}
              {process.env.NODE_ENV === 'development' && <CartDebug />}
            </main>
            <Footer />
            <QuickViewModal />
            <Toast />
          </div>
          {/* <DataRecovery /> */}
        </AppProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}