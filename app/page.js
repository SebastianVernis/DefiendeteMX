import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/features/Hero';
import FeaturesSection from './components/features/FeaturesSection';
import ScenariosSection from './components/features/ScenariosSection';

/**
 * Home Page
 * Main landing page with hero and scenarios
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturesSection />
        <ScenariosSection />
      </main>
      <Footer />
    </>
  );
}
