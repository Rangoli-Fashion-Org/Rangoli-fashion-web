import React from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { ShoppingBenefits } from '../components/home/ShoppingBenefits';
import { CategoriesSection } from '../components/home/CategoriesSection';
import { FestiveBanner } from '../components/home/FestiveBanner';
import { NewArrivals } from '../components/home/NewArrivals';
import { WhyChooseRangoli, RangoliHallmark } from '../components/home/BrandBenefits';
import { BestSellers } from '../components/home/BestSellers';
import { Newsletter } from '../components/home/Newsletter';

export default function HomePage() {
  return (
    <div className="relative flex flex-col w-full bg-[#FDF8F0] overflow-hidden">
      {/* Subtle Luxury Silk Weave & Warm Champagne Ambient Glow across the page */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 25%, rgba(201, 163, 74, 0.10) 0%, transparent 45%),
            radial-gradient(circle at 85% 60%, rgba(201, 163, 74, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 50% 90%, rgba(0, 61, 45, 0.04) 0%, transparent 45%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col w-full">
        {/* 1. Large Editorial Fashion Hero Banner */}
        <HeroBanner />

        {/* 2. Four Horizontal Shopping Benefits Bar */}
        <ShoppingBenefits />

        {/* 3. Shop by Category (Royal Jharokha Arched Cards) */}
        <CategoriesSection />

        {/* 4. Festive Elegance Promotional Banner */}
        <FestiveBanner />

        {/* 5. New Arrivals Product Showcase */}
        <NewArrivals />

        {/* 6. Why Choose Rangoli */}
        <WhyChooseRangoli />

        {/* 7. Best Sellers Product Showcase (In between Why Choose Rangoli and The Rangoli Hallmark) */}
        <BestSellers />

        {/* 8. The Rangoli Hallmark */}
        <RangoliHallmark />

        {/* 9. The Rangoli Prime Circle Newsletter */}
        <Newsletter />
      </div>
    </div>
  );
}
