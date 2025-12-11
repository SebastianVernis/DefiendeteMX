'use client';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/features/Hero';
import FeaturesSection from './components/features/FeaturesSection';
import ScenariosSection from './components/features/ScenariosSection';
import EmergencyBanner from './components/emergency/EmergencyBanner';

/**
 * Home Page
 * Main landing page with hero and scenarios
 * Theme: Legal advisory and emergency management when authorities are not allies
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <EmergencyBanner variant="warning" />
      <main>
        <Hero />
        <FeaturesSection />
        <ScenariosSection />
      </main>
      <Footer />
    </>
  );
}
