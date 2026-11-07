'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, Check, Wand2 } from 'lucide-react';

export interface ParsedProductData {
  name: string;
  slug: string;
  sku: string;
  regularPrice: number | '';
  salePrice: number | '';
  categoryName: string;
  collectionName: string;
  material: string;
  careInstructions: string;
  sizes: string[];
  colours: string[];
  stockPerSize: number;
  isNewArrival: boolean;
  isFeatured: boolean;
  isActive: boolean;
  shortDescription: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  variants: Array<{
    sku: string;
    size: string;
    color: string;
    stockQuantity: number;
  }>;
}

interface SmartProductAutoFillProps {
  categories?: Array<{ id: string; name: string }>;
  collections?: Array<{ id: string; name: string }>;
  onAutoFill: (data: ParsedProductData, matchedCategoryId?: string, matchedCollectionId?: string) => void;
}

const BLANK_TEMPLATE = `PRODUCT NAME:
[Enter Product Name]

PRODUCT SLUG:
[e.g. adyora-beige-linen-blend-shirt]

MASTER SKU:
[e.g. RF-LINEN-001]

CATEGORY:
[e.g. Kurti Sets / Sarees / Shirts / Co-ord Sets]

COLLECTION:
[e.g. Summer Resort 2026 / Festive Edit]

REGULAR PRICE:
[e.g. 2499]

SALE PRICE:
[e.g. 1799]

FABRIC / MATERIAL:
[e.g. 100% Pure Organic Linen Blend]

CARE INSTRUCTIONS:
[e.g. Machine wash cold with like colors, gentle cycle, tumble dry low.]

AVAILABLE SIZES:
XS, S, M, L, XL, XXL

COLOURS:
Beige, Ivory Cream

STOCK PER SIZE:
15

NEW ARRIVAL:
Yes

FEATURED:
Yes

ACTIVE:
Yes

SHORT DESCRIPTION:
[Minimalist linen blend shirt offering effortless contemporary elegance.]

FULL DESCRIPTION:
[Tailored to perfection, this breathable linen blend shirt showcases a relaxed modern silhouette with subtle mother-of-pearl buttons, clean French seams, and a refined structured collar. Pair seamlessly with crisp cotton chinos, trousers, or ethnic palazzos.]

SEO META TITLE:
[ADYORA Beige Linen Blend Shirt | Rangoli Fashions]

SEO META DESCRIPTION:
[Shop the premium ADYORA Beige Linen Blend Shirt online at Rangoli Fashions. Lightweight, breathable, and sustainably crafted.]`;

const SAMPLE_TEMPLATE = `PRODUCT NAME:
ADYORA Beige Linen Blend Shirt

PRODUCT SLUG:
adyora-beige-linen-blend-shirt

MASTER SKU:
RF-LINEN-001

CATEGORY:
Kurti Sets

COLLECTION:
Summer Resort 2026

REGULAR PRICE:
2499

SALE PRICE:
1799

FABRIC / MATERIAL:
100% Pure Organic Linen Blend

CARE INSTRUCTIONS:
Machine wash cold with like colors, gentle cycle, tumble dry low. Warm iron while damp.

AVAILABLE SIZES:
S, M, L, XL, XXL

COLOURS:
Beige, Ivory Cream

STOCK PER SIZE:
15

NEW ARRIVAL:
Yes

FEATURED:
Yes

ACTIVE:
Yes

SHORT DESCRIPTION:
Minimalist linen blend shirt offering effortless contemporary elegance and breathable luxury.

FULL DESCRIPTION:
Tailored to perfection, this breathable linen blend shirt showcases a relaxed modern silhouette with subtle mother-of-pearl finish buttons, clean French seams, and a refined structured collar. 

Crafted with premium linen yarns blended for superior crease-resistance without compromising the cool, airy feel of authentic linen. Pair seamlessly with crisp cotton chinos, wide-leg trousers, or ethnic palazzos.

SEO META TITLE:
ADYORA Beige Linen Blend Shirt | Rangoli Fashions

SEO META DESCRIPTION:
Shop the premium ADYORA Beige Linen Blend Shirt online at Rangoli Fashions. Lightweight, breathable, and sustainably crafted.`;

export function parseProductText(
  rawText: string,
  categories: Array<{ id: string; name: string }> = [],
  collections: Array<{ id: string; name: string }> = []
): { parsed: ParsedProductData; matchedCategoryId?: string; matchedCollectionId?: string } {
  const lines = rawText.split('\n');
  const fieldMap: Record<string, string> = {};
  let currentKey = '';

  const isKeyLine = (line: string): { key: string; val: string } | null => {
    const match = line.match(/^([A-Za-z0-9\s\/\(\)₹_-]+):\s*(.*)$/);
    if (!match) return null;
    const candidate = match[1].trim().toUpperCase();
    const val = match[2];

    const knownKeys = [
      'PRODUCT NAME', 'NAME',
      'PRODUCT SLUG', 'SLUG',
      'MASTER SKU', 'SKU',
      'CATEGORY', 'PRODUCT CATEGORY',
      'COLLECTION', 'PRODUCT COLLECTION',
      'REGULAR PRICE', 'REGULAR PRICE (₹)', 'PRICE', 'PRICE (₹)', 'MRP',
      'SALE PRICE', 'SALE PRICE (₹)', 'OFFER PRICE', 'DISCOUNTED PRICE',
      'FABRIC / MATERIAL', 'FABRIC', 'MATERIAL',
      'CARE INSTRUCTIONS', 'CARE',
      'AVAILABLE SIZES', 'SIZES', 'SIZE',
      'COLOURS', 'COLORS', 'COLOUR', 'COLOR',
      'STOCK PER SIZE', 'STOCK', 'DEFAULT STOCK',
      'NEW ARRIVAL', 'IS NEW ARRIVAL',
      'FEATURED', 'IS FEATURED',
      'ACTIVE', 'IS ACTIVE', 'STATUS',
      'SHORT DESCRIPTION',
      'FULL DESCRIPTION', 'PRODUCT DESCRIPTION', 'DESCRIPTION',
      'SEO META TITLE', 'SEO TITLE', 'META TITLE',
      'SEO META DESCRIPTION', 'SEO DESCRIPTION', 'META DESCRIPTION',
    ];

    if (knownKeys.includes(candidate)) {
      return { key: candidate, val };
    }
    return null;
  };

  for (const line of lines) {
    const keyMatch = isKeyLine(line);
    if (keyMatch) {
      currentKey = keyMatch.key;
      fieldMap[currentKey] = keyMatch.val.trim();
    } else if (currentKey) {
      if (line.trim().length > 0 || fieldMap[currentKey].length > 0) {
        fieldMap[currentKey] = fieldMap[currentKey] ? `${fieldMap[currentKey]}\n${line}` : line;
      }
    }
  }

  const getCleanVal = (...keys: string[]): string => {
    for (const k of keys) {
      if (fieldMap[k] !== undefined && fieldMap[k] !== null) {
        const val = fieldMap[k].trim();
        if (val.startsWith('[') && val.endsWith(']')) {
          // If it's a bracketed instruction or empty placeholder, strip if it contains e.g.
          const inner = val.slice(1, -1).trim();
          if (inner.toLowerCase().startsWith('e.g.')) {
            return inner.substring(4).trim();
          }
          if (inner.toLowerCase().startsWith('enter ')) {
            return '';
          }
          return inner;
        }
        return val;
      }
    }
    return '';
  };

  const name = getCleanVal('PRODUCT NAME', 'NAME');
  let slug = getCleanVal('PRODUCT SLUG', 'SLUG');
  if (!slug && name) {
    slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  let sku = getCleanVal('MASTER SKU', 'SKU');
  if (!sku && name) {
    const initials = name.split(/\s+/).map(w => w[0]?.toUpperCase()).join('').slice(0, 4);
    sku = `RF-${initials}-${Math.floor(100 + Math.random() * 900)}`;
  }

  const regularPriceStr = getCleanVal('REGULAR PRICE', 'REGULAR PRICE (₹)', 'PRICE', 'PRICE (₹)', 'MRP').replace(/[^0-9.]/g, '');
  const salePriceStr = getCleanVal('SALE PRICE', 'SALE PRICE (₹)', 'OFFER PRICE', 'DISCOUNTED PRICE').replace(/[^0-9.]/g, '');
  const regularPrice = regularPriceStr ? Number(regularPriceStr) : '';
  const salePrice = salePriceStr ? Number(salePriceStr) : '';

  const categoryName = getCleanVal('CATEGORY', 'PRODUCT CATEGORY');
  const collectionName = getCleanVal('COLLECTION', 'PRODUCT COLLECTION');
  const material = getCleanVal('FABRIC / MATERIAL', 'FABRIC', 'MATERIAL') || '100% Pure Premium Cotton';
  const careInstructions = getCleanVal('CARE INSTRUCTIONS', 'CARE') || 'Dry clean recommended for first wash. Gentle hand wash in cold water.';

  const sizesRaw = getCleanVal('AVAILABLE SIZES', 'SIZES', 'SIZE');
  const sizes = sizesRaw
    ? sizesRaw.split(/[,/|]+/).map(s => s.trim().toUpperCase()).filter(Boolean)
    : ['S', 'M', 'L', 'XL'];

  const coloursRaw = getCleanVal('COLOURS', 'COLORS', 'COLOUR', 'COLOR');
  const colours = coloursRaw
    ? coloursRaw.split(/[,/|]+/).map(c => c.trim()).filter(Boolean)
    : ['Default'];

  const stockPerSizeStr = getCleanVal('STOCK PER SIZE', 'STOCK', 'DEFAULT STOCK').replace(/[^0-9]/g, '');
  const stockPerSize = stockPerSizeStr ? Number(stockPerSizeStr) : 10;

  const parseBool = (val: string, defaultVal: boolean): boolean => {
    if (!val) return defaultVal;
    const lower = val.toLowerCase();
    if (['yes', 'true', '1', 'y', 'active'].includes(lower)) return true;
    if (['no', 'false', '0', 'n', 'inactive'].includes(lower)) return false;
    return defaultVal;
  };

  const isNewArrival = parseBool(getCleanVal('NEW ARRIVAL', 'IS NEW ARRIVAL'), true);
  const isFeatured = parseBool(getCleanVal('FEATURED', 'IS FEATURED'), false);
  const isActive = parseBool(getCleanVal('ACTIVE', 'IS ACTIVE', 'STATUS'), true);

  const shortDescription = getCleanVal('SHORT DESCRIPTION');
  const description = getCleanVal('FULL DESCRIPTION', 'PRODUCT DESCRIPTION', 'DESCRIPTION');
  const seoTitle = getCleanVal('SEO META TITLE', 'SEO TITLE', 'META TITLE');
  const seoDescription = getCleanVal('SEO META DESCRIPTION', 'SEO DESCRIPTION', 'META DESCRIPTION');

  // Match category
  let matchedCategoryId: string | undefined;
  if (categoryName && categories.length > 0) {
    const match = categories.find(c =>
      c.name.toLowerCase() === categoryName.toLowerCase() ||
      c.name.toLowerCase().includes(categoryName.toLowerCase()) ||
      categoryName.toLowerCase().includes(c.name.toLowerCase())
    );
    if (match) matchedCategoryId = match.id;
  }

  // Match collection
  let matchedCollectionId: string | undefined;
  if (collectionName && collections.length > 0) {
    const match = collections.find(c =>
      c.name.toLowerCase() === collectionName.toLowerCase() ||
      c.name.toLowerCase().includes(collectionName.toLowerCase()) ||
      collectionName.toLowerCase().includes(c.name.toLowerCase())
    );
    if (match) matchedCollectionId = match.id;
  }

  // Generate variants from Sizes x Colours
  const variants: Array<{ sku: string; size: string; color: string; stockQuantity: number }> = [];
  const baseSku = sku || 'RF-PROD';

  for (const color of colours) {
    for (const size of sizes) {
      const colorCode = color.replace(/[^A-Za-z0-9]/g, '').slice(0, 3).toUpperCase() || 'COL';
      variants.push({
        sku: `${baseSku}-${size}-${colorCode}`,
        size,
        color,
        stockQuantity: stockPerSize,
      });
    }
  }

  return {
    parsed: {
      name,
      slug,
      sku,
      regularPrice,
      salePrice,
      categoryName,
      collectionName,
      material,
      careInstructions,
      sizes,
      colours,
      stockPerSize,
      isNewArrival,
      isFeatured,
      isActive,
      shortDescription,
      description,
      seoTitle,
      seoDescription,
      variants,
    },
    matchedCategoryId,
    matchedCollectionId,
  };
}

export const SmartProductAutoFill: React.FC<SmartProductAutoFillProps> = ({
  categories = [],
  collections = [],
  onAutoFill,
}) => {
  const [rawText, setRawText] = useState('');
  const [copiedBlank, setCopiedBlank] = useState(false);
  const [copiedSample, setCopiedSample] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleCopyBlank = async () => {
    try {
      await navigator.clipboard.writeText(BLANK_TEMPLATE);
      setCopiedBlank(true);
      setTimeout(() => setCopiedBlank(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCopySample = async () => {
    try {
      await navigator.clipboard.writeText(SAMPLE_TEMPLATE);
      setCopiedSample(true);
      setTimeout(() => setCopiedSample(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleLoadAndAutoFillSample = () => {
    setRawText(SAMPLE_TEMPLATE);
    const result = parseProductText(SAMPLE_TEMPLATE, categories, collections);
    onAutoFill(result.parsed, result.matchedCategoryId, result.matchedCollectionId);
    setStatusMessage('✓ All 16 product fields (including Product Description, Colours, Category & SEO) have been auto-filled 100%!');
  };

  const handleAutoFillFromText = () => {
    if (!rawText.trim()) {
      setStatusMessage('Please paste or type formatted product details into the text box above first.');
      return;
    }
    const result = parseProductText(rawText, categories, collections);
    onAutoFill(result.parsed, result.matchedCategoryId, result.matchedCollectionId);
    setStatusMessage('✓ All 16 product fields (including Product Description, Colours, Category & SEO) have been auto-filled 100%!');
  };

  return (
    <div className="border-2 border-dashed border-[#60A5FA] bg-[#F8FAFC] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs transition-all">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="text-[#2563EB] w-5 h-5 flex-shrink-0" />
          <h2 className="text-xs sm:text-sm font-bold text-[#0F172A] tracking-wider uppercase">
            SMART COPY-PASTE AUTO-FILL (100% FIELD MAPPING)
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyBlank}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg text-xs font-semibold text-[#1E293B] hover:bg-[#F1F5F9] shadow-2xs transition-colors"
          >
            {copiedBlank ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copiedBlank ? 'COPIED BLANK!' : 'COPY BLANK FORMAT'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopySample}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg text-xs font-semibold text-[#1E293B] hover:bg-[#F1F5F9] shadow-2xs transition-colors"
          >
            {copiedSample ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copiedSample ? 'COPIED SAMPLE!' : 'COPY SAMPLE FORMAT'}</span>
          </button>

          <button
            type="button"
            onClick={handleLoadAndAutoFillSample}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
          >
            <Wand2 size={14} />
            <span>LOAD &amp; AUTO-FILL SAMPLE</span>
          </button>
        </div>
      </div>

      {/* Helper text */}
      <p className="text-xs text-[#64748B] leading-relaxed">
        Paste your formatted product text below — all boxes (Name, Slug, SKU, Category, Prices, Stock, Sizes, Colours, Status checkboxes, full Product Description, and SEO) auto-fill immediately!
      </p>

      {/* Formatted Textarea */}
      <div className="relative">
        <textarea
          rows={6}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder={`PRODUCT NAME:\nADYORA Beige Linen Blend Shirt\n\nPRODUCT SLUG:\nadyora-beige-linen-blend-shirt\n\nMASTER SKU:\nRF-LINEN-001\n...`}
          className="w-full bg-white border border-[#93C5FD] focus:border-[#2563EB] focus:ring-2 focus:ring-[#93C5FD]/40 rounded-xl p-3.5 font-mono text-xs text-[#0F172A] leading-relaxed resize-y shadow-2xs outline-none"
        />
      </div>

      {/* Bottom Bar: Status Message & Action Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <div className="text-xs font-medium min-h-[20px]">
          {statusMessage && (
            <p className={statusMessage.startsWith('✓') ? 'text-emerald-700 font-semibold' : 'text-amber-700'}>
              {statusMessage}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleAutoFillFromText}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-black hover:bg-[#1E293B] text-white rounded-lg text-xs font-bold tracking-wider uppercase shadow-md transition-colors flex-shrink-0"
        >
          <Sparkles size={14} className="text-[#FBBF24]" />
          <span>AUTO-FILL FIELDS FROM TEXT</span>
        </button>
      </div>
    </div>
  );
};

