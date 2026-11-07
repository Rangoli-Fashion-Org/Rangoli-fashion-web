import React from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategoriesSection } from '../components/home/CategoriesSection';
import { ShoppingBenefits } from '../components/home/ShoppingBenefits';
import { CollectionsGrid } from '../components/home/CollectionsGrid';
import { NewArrivals } from '../components/home/NewArrivals';
import { FestiveBanner } from '../components/home/FestiveBanner';
import { BrandBenefits } from '../components/home/BrandBenefits';
import { Newsletter } from '../components/home/Newsletter';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Large Editorial Fashion Hero Banner */}
      <HeroBanner />

      {/* 2. Shop by Category (Dynamic from Admin Categories) */}
      <CategoriesSection />

      {/* 3. Four Shopping Feature Blocks */}
      <ShoppingBenefits />

      {/* 4. Shop by Collection (Dynamic from Admin Collections) */}
      <CollectionsGrid />

      {/* 5. New Arrivals Product Showcase */}
      <NewArrivals />

      {/* 6. Festive Edit Section */}
      <FestiveBanner />

      {/* 7. Four Brand Quality Blocks */}
      <BrandBenefits />

      {/* 8. Newsletter Subscription Box */}
      <Newsletter />
    </div>
  );
}

