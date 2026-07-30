import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProductGrid from '@/components/ProductGrid';
import CartDrawer from '@/components/CartDrawer';
import NotificationToast from '@/components/NotificationToast';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-between bg-[var(--bg-main)] text-[var(--text-body)] transition-colors duration-300">
      <div>
        <Header />
        <HeroSection />
        <ProductGrid />
      </div>

      <CartDrawer />
      <NotificationToast />
      <Footer />
    </main>
  );
}
