'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Filter, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '../../components/product/ProductCard';
import { fetchApi } from '../../lib/api';

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const collectionParam = searchParams.get('collection') || '';
  const searchParam = searchParams.get('search') || '';
  const filterParam = searchParams.get('filter') || '';

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedCollection, setSelectedCollection] = useState(collectionParam);
  const [selectedSort, setSelectedSort] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    setSelectedCategory(categoryParam);
    setSelectedCollection(collectionParam);
  }, [categoryParam, collectionParam]);

  useEffect(() => {
    fetchApi<any[]>('/categories').then((res) => {
      if (res.success && res.data) setCategories(res.data);
    });
    fetchApi<any[]>('/collections').then((res) => {
      if (res.success && res.data) setCollections(res.data);
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const query = new URLSearchParams();
    if (selectedCategory) query.set('category', selectedCategory);
    if (selectedCollection) query.set('collection', selectedCollection);
    if (searchParam) query.set('search', searchParam);
    if (selectedSort) query.set('sort', selectedSort);
    if (selectedSize) query.set('size', selectedSize);
    if (inStockOnly) query.set('inStock', 'true');
    query.set('page', page.toString());
    query.set('limit', '12');

    fetchApi<any[]>(`/products?${query.toString()}`).then((res) => {
      if (res.success && res.data) {
        setProducts(res.data);
        if (res.meta) {
          setTotalPages(res.meta.totalPages || 1);
          setTotalProducts(res.meta.total || res.data.length);
        }
      } else {
        setProducts([]);
      }
      setIsLoading(false);
    });
  }, [selectedCategory, selectedCollection, searchParam, selectedSort, selectedSize, inStockOnly, page]);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const pageTitle = selectedCategory
    ? categories.find((c) => c.slug === selectedCategory)?.name || 'Collection'
    : selectedCollection
    ? collections.find((c) => c.slug === selectedCollection)?.name || 'Collection'
    : searchParam
    ? `Search results for "${searchParam}"`
    : filterParam === 'new_arrivals'
    ? 'New Arrivals'
    : 'All Collections';

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-[#746D62] mb-6">
          <Link href="/" className="hover:text-[#003D2D]">Home</Link>
          <span>/</span>
          <span className="text-[#191714] font-medium">{pageTitle}</span>
        </nav>

        {/* Heading & Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="font-serif text-3xl sm:text-4xl text-[#191714] font-medium tracking-tight">
            {pageTitle}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#746D62]">
            Elegant co-ord and kurti sets designed with rich artisanal fabrics for a refined look.
          </p>
        </div>

        {/* Controls Bar */}
        <div className="bg-white border border-[#E8DFD0] rounded-lg p-3 sm:p-4 mb-8 flex items-center justify-between shadow-xs">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex items-center space-x-2 px-3.5 py-2 bg-[#FAF6F0] border border-[#E8DFD0] rounded-md text-xs font-medium text-[#191714] hover:bg-[#E8DFD0] transition-colors"
          >
            <SlidersHorizontal size={14} className="text-[#003D2D]" />
            <span>Filters</span>
          </button>

          <p className="text-xs text-[#746D62] hidden sm:block">
            Showing <span className="font-semibold text-[#191714]">{products.length}</span> of {totalProducts} styles
          </p>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#746D62] hidden sm:inline">Sort by:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as any)}
              className="bg-[#FAF6F0] border border-[#E8DFD0] rounded-md px-3 py-2 text-xs font-medium text-[#191714] focus:outline-none focus:border-[#003D2D]"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white border border-[#E8DFD0] rounded-lg p-5 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD0]">
                <h3 className="font-serif text-base font-semibold text-[#191714]">Filters</h3>
                {(selectedCategory || selectedCollection || selectedSize || inStockOnly) && (
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setSelectedCollection('');
                      setSelectedSize('');
                      setInStockOnly(false);
                    }}
                    className="text-xs text-[#8B1E1E] hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#191714] mb-3">Categories</h4>
                <div className="space-y-2 text-xs">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`block w-full text-left py-1 ${!selectedCategory ? 'font-bold text-[#003D2D]' : 'text-[#746D62] hover:text-[#191714]'}`}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`block w-full text-left py-1 ${selectedCategory === c.slug ? 'font-bold text-[#003D2D]' : 'text-[#746D62] hover:text-[#191714]'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="pt-4 border-t border-[#E8DFD0]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#191714] mb-3">Size</h4>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(selectedSize === s ? '' : s)}
                      className={`w-9 h-9 rounded-md border text-xs font-medium flex items-center justify-center transition-colors ${
                        selectedSize === s
                          ? 'bg-[#003D2D] text-white border-[#003D2D]'
                          : 'border-[#E8DFD0] text-[#191714] hover:border-[#003D2D]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="pt-4 border-t border-[#E8DFD0]">
                <label className="flex items-center space-x-2 text-xs text-[#191714] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded text-[#003D2D] focus:ring-[#003D2D]"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="aspect-[3/4] bg-white border border-[#E8DFD0] rounded-md animate-pulse" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    slug={p.slug}
                    regularPrice={p.regularPrice}
                    salePrice={p.salePrice}
                    discountPercentage={p.discountPercentage}
                    images={p.images}
                    averageRating={p.averageRating}
                    reviewCount={p.reviewCount}
                    isNewArrival={p.isNewArrival}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#E8DFD0] rounded-xl p-12 text-center max-w-md mx-auto my-8">
                <p className="font-serif text-lg font-medium text-[#191714]">No products found</p>
                <p className="text-xs text-[#746D62] mt-1.5">
                  Try adjusting your filters or search keywords to explore more options.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedCollection('');
                    setSelectedSize('');
                    setInStockOnly(false);
                  }}
                  className="mt-5 px-6 py-2 bg-[#003D2D] text-[#FFF8ED] rounded-full text-xs font-semibold uppercase tracking-wider"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center space-x-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 border border-[#E8DFD0] rounded text-xs disabled:opacity-40 bg-white"
                >
                  Previous
                </button>
                <span className="text-xs text-[#746D62]">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 border border-[#E8DFD0] rounded text-xs disabled:opacity-40 bg-white"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsFilterDrawerOpen(false)} />
          <div className="relative bg-white w-4/5 max-w-xs h-full p-6 shadow-xl z-10 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD0]">
                <h3 className="font-serif text-lg font-semibold text-[#191714]">Filters</h3>
                <button onClick={() => setIsFilterDrawerOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="py-4 space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#191714] mb-2">Categories</h4>
                  <div className="space-y-1.5 text-xs">
                    <button
                      onClick={() => {
                        setSelectedCategory('');
                        setIsFilterDrawerOpen(false);
                      }}
                      className={`block w-full text-left py-1 ${!selectedCategory ? 'font-bold text-[#003D2D]' : 'text-[#746D62]'}`}
                    >
                      All Categories
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedCategory(c.slug);
                          setIsFilterDrawerOpen(false);
                        }}
                        className={`block w-full text-left py-1 ${selectedCategory === c.slug ? 'font-bold text-[#003D2D]' : 'text-[#746D62]'}`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E8DFD0]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#191714] mb-2">Size</h4>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(selectedSize === s ? '' : s)}
                        className={`w-8 h-8 rounded border text-xs font-medium ${
                          selectedSize === s ? 'bg-[#003D2D] text-white' : 'border-[#E8DFD0]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsFilterDrawerOpen(false)}
              className="w-full py-3 bg-[#003D2D] text-white text-xs font-semibold uppercase tracking-wider rounded-md"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF6F0] p-12 text-center">Loading catalogue...</div>}>
      <ShopContent />
    </Suspense>
  );
}

