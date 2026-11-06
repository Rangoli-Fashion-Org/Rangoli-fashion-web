# Rangoli Fashions – Production Full-Stack E-Commerce Platform

A complete, production-ready Indian ethnic fashion e-commerce application featuring a customer storefront, comprehensive admin management console, NestJS REST API, PostgreSQL database with Prisma ORM, Cloudinary media storage, and Razorpay payment gateway integration.

---

## 🎨 Visual Design Reference
Faithfully recreated from the Rangoli Fashions design system:
- **Primary Emerald Green:** `#003D2D`
- **Dark Emerald:** `#002D21`
- **Secondary Green:** `#0B5940`
- **Gold Accent:** `#C9A34A`
- **Warm Ivory:** `#FFF8ED`
- **Cream:** `#F5EBDD`
- **Headings:** Playfair Display
- **Body & Controls:** Inter

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Storefront** | Next.js 14 (App Router), React 18, Tailwind CSS, TypeScript |
| **Admin Console** | Next.js 14 (App Router), React 18, Tailwind CSS, TypeScript |
| **Backend API** | NestJS 10, TypeScript, REST API, Swagger/OpenAPI |
| **Database** | PostgreSQL (Neon in Development / Railway in Production) |
| **ORM** | Prisma ORM |
| **Image Storage** | Cloudinary |
| **Payments** | Razorpay (Cards, UPI, Netbanking, Wallets) |
| **Workspaces** | npm workspaces |

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy the template files:
```bash
# Backend
cp apps/api/.env.example apps/api/.env

# Storefront
cp apps/storefront/.env.example apps/storefront/.env.local

# Admin Console
cp apps/admin/.env.example apps/admin/.env.local
```

### 3. Generate Database Client & Seed Initial Bootstrap
```bash
# Generate Prisma Client
npm run prisma:generate

# Apply migrations
npm run prisma:migrate

# Seed initial system configuration and admin account
npm run prisma:seed
```

### 4. Run Development Servers
In separate terminals (or concurrently):
```bash
# API Server (Port 4000)
npm run dev:api

# Storefront (Port 3000)
npm run dev:storefront

# Admin Console (Port 3001)
npm run dev:admin
```

- **Customer Storefront:** [http://localhost:3000](http://localhost:3000)
- **Admin Console:** [http://localhost:3001](http://localhost:3001) (Default login: `admin@rangolifashions.com` / `AdminChangeMe123!`)
- **API Swagger Documentation:** [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

---

## 📦 Monorepo Packages & Applications

- `apps/storefront`: Customer e-commerce website with responsive announcement bar, hero carousel, shop by collection, new arrivals, promotional banners, product catalog with multi-faceted filtering, product detail gallery with variants, cart drawer, checkout, and customer order history.
- `apps/admin`: 20-section management console including Dashboard KPIs, Products CRUD, Categories CRUD, Collections CRUD, Inventory Movements, Orders Fulfillment, Customer Accounts, Coupons, Reviews Moderation, Hero Banners CMS, Homepage Layout CMS, About Us CMS, Social Links, and Store Configuration.
- `apps/api`: Modular NestJS application providing complete authentication, role-based authorization, inventory atomic updates, Razorpay signature verification, and Cloudinary uploads.
- `packages/shared-types`: Unified TypeScript interfaces and domain enums.
- `packages/validation`: Reusable validation algorithms (email, Indian phone numbers, postal codes, INR currency formatting).

---

## 🔒 Security Architecture
- Password hashing using **bcrypt** with 10 salt rounds.
- HTTP-only, secure, SameSite cookies for session management.
- Dual-layer Role-Based Access Control (`SUPER_ADMIN`, `ADMIN`, `MANAGER`, `CUSTOMER`).
- HMAC-SHA256 signature verification for Razorpay payments and webhooks.
- Idempotent webhook event processor preventing duplicate order captures.
- Prisma atomic transactions (`$transaction`) guaranteeing stock integrity and preventing negative inventory.

---

## 🌐 Staging & Production Deployment

### Staging (Render)
Blueprint configuration provided in `render.yaml`. Auto-deploys from the `development` branch.
- API service: `node apps/api/dist/main`
- Storefront service: `npm run start --workspace=@rangoli/storefront`
- Admin service: `npm run start --workspace=@rangoli/admin`

### Production (Railway)
Configuration provided in `railway.json`. Deploys from the `main` branch to production PostgreSQL.
- Controlled Prisma migrations executed during deployment: `npm run prisma:deploy`
