import { Hero } from '@/components/home/hero';
import { ProductGrid } from '@/components/product/product-grid';
import ContactPage from '../contact/page';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductGrid
        title='Featured Products'
        subtitle='Check out our latest and greatest'
      />
      <ContactPage />
    </>
  );
}
