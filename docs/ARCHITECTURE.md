# Rangoli Fashions – Architecture & Technical Blueprint

## 1. Overview
Rangoli Fashions is an enterprise-grade, production-ready Indian ethnic fashion e-commerce platform built as a clean monorepo.

### Visual Identity
- **Primary Emerald Green:** `#003D2D`
- **Dark Emerald:** `#002D21`
- **Secondary Green:** `#0B5940`
- **Gold Accent:** `#C9A34A`
- **Warm Ivory:** `#FFF8ED`
- **Cream:** `#F5EBDD`
- **Typography:** Playfair Display (Serif Headings), Inter (Modern Body & Nav)

---

## 2. Monorepo Structure

```text
rangoli-fashions/
├── apps/
│   ├── storefront/         # Next.js 14 App Router (Customer Website - Port 3000)
│   ├── admin/              # Next.js 14 App Router (Admin Console - Port 3001)
│   └── api/                # NestJS 10 REST API (Backend - Port 4000)
├── packages/
│   ├── shared-types/       # TypeScript domain types & interfaces
│   ├── validation/         # Validation utilities (email, phone, currency, slug)
│   └── eslint-config/      # Shared ESLint configuration
├── render.yaml             # Render Staging Blueprints
├── railway.json            # Railway Production Config
├── tsconfig.base.json      # Shared TS Compiler Configuration
└── package.json            # npm Workspaces Orchestration
```

---

## 3. Strict Single Source of Truth
**PostgreSQL is the single source of truth for all dynamic business data.**
All dynamic content loads from the database through NestJS APIs (`/api/v1/*`):
- Products, Variants, Stock, Prices, Discounts
- Categories & Collections
- Hero Carousel & Festive Edit Banners
- Store Policies, Shipping Thresholds, Announcement Bar
- Customer Reviews & Ratings
- Promotional Coupons & Deduplications
- Newsletter Subscribers

---

## 4. Payment & Checkout Architecture
- **Payment Gateway:** Razorpay
- **Transactions:** Orders and inventory movements are protected with atomic Prisma transactions (`prisma.$transaction`).
- **Idempotency:** Payment webhooks verify HMAC-SHA256 signatures and register event IDs in `PaymentWebhookEvent` to prevent double processing.
- **Security:** Secrets are strictly guarded in backend environment variables and never leaked to frontend code.

---

## 5. Media Pipeline
- **Media Engine:** Cloudinary
- Images are processed and uploaded via the `/api/v1/upload` endpoint with validation for file types (JPEG, PNG, WEBP, SVG) and 5MB size limits.
- Secure URLs and Public IDs are saved in PostgreSQL.

