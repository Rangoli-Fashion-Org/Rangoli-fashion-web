import React from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
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

      {/* 2. Four Shopping Feature Blocks */}
      <ShoppingBenefits />

      {/* 3. Shop by Collection */}
      <CollectionsGrid />

      {/* 4. New Arrivals Product Showcase */}
      <NewArrivals />

      {/* 5. Festive Edit Section */}
      <FestiveBanner />

      {/* 6. Four Brand Quality Blocks */}
      <BrandBenefits />

      {/* 7. Newsletter Subscription Box */}
      <Newsletter />
    </div>
  );
}
