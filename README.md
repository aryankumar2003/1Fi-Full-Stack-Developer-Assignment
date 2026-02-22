# 1Fi Full Stack Developer Assignment

A full-stack web application that displays smartphones with multiple **EMI (Equated Monthly Installment) plans** backed by mutual funds. Users can browse products, select variants, compare EMI options, and proceed to checkout.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB (Mongoose ODM) |
| HTTP Client | Axios |
| Routing | React Router v6 |

---

## Project Structure

```
1Fi Full Stack Developer Assignment/
├── .gitignore
├── README.md
│
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts                    # Express app entry point
│       ├── seed.ts                     # Database seeder script
│       ├── config/
│       │   └── db.ts                   # MongoDB connection
│       ├── models/
│       │   ├── Product.ts              # Product schema & model
│       │   ├── Variant.ts              # Variant schema & model
│       │   └── EmiPlan.ts             # EMI Plan schema & model
│       ├── controllers/
│       │   └── productController.ts    # Route handler logic
│       └── routes/
│           └── productRoutes.ts        # API route definitions
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.tsx                    # React app entry point
        ├── App.tsx                     # Root component & router setup
        ├── index.css                   # Global styles + Tailwind base
        ├── types/
        │   └── index.ts               # Shared TypeScript interfaces
        ├── services/
        │   └── api.ts                 # Axios API client & functions
        ├── pages/
        │   ├── HomePage.tsx           # Product listing page (/)
        │   └── ProductPage.tsx        # Product detail page (/:slug)
        └── components/
            ├── Navbar.tsx             # Top navigation bar
            ├── ProductCard.tsx        # Card for product listing
            ├── VariantSelector.tsx    # Storage/color variant picker
            └── EmiPlanCard.tsx        # Individual EMI plan display card
```

---

## Database Schema

The database uses **three MongoDB collections** with references between them via `productId`.

### `products` Collection

Stores top-level product information.

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | auto | MongoDB document ID |
| `name` | String | ✅ | Display name (e.g. "Apple iPhone 17 Pro") |
| `slug` | String | ✅ | URL-friendly unique identifier (e.g. `iphone-17-pro`) |
| `description` | String | ✅ | Product description |
| `category` | String | ✅ | Category (e.g. "Smartphones") |
| `brand` | String | ✅ | Brand name (e.g. "Apple") |
| `imageUrl` | String | ✅ | Primary product image URL |
| `createdAt` | Date | auto | Mongoose timestamp |
| `updatedAt` | Date | auto | Mongoose timestamp |

> `slug` has a unique index for fast lookups by URL.

---

### `variants` Collection

Stores storage/color variants for a product. Multiple variants belong to one product.

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | auto | MongoDB document ID |
| `productId` | ObjectId | ✅ | Reference to `products._id` |
| `label` | String | ✅ | Display label (e.g. "256 GB – Natural Titanium") |
| `storage` | String | ✅ | Storage size (e.g. "256 GB") |
| `color` | String | ✅ | Color name (e.g. "Natural Titanium") |
| `mrp` | Number | ✅ | Maximum Retail Price (in ₹) |
| `price` | Number | ✅ | Selling price (in ₹) |
| `images` | String[] | — | Array of image URLs for this variant |
| `createdAt` | Date | auto | Mongoose timestamp |
| `updatedAt` | Date | auto | Mongoose timestamp |

> `productId` is indexed for efficient variant lookups per product.

---

### `emiplans` Collection

Stores EMI financing options for a product. Multiple plans belong to one product.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | MongoDB document ID |
| `productId` | ObjectId | ✅ | — | Reference to `products._id` |
| `label` | String | ✅ | — | Plan name (e.g. "6-Month EMI") |
| `tenure` | Number | ✅ | — | Number of months |
| `interestRate` | Number | ✅ | `0` | Annual interest rate (% p.a.) |
| `cashback` | Number | — | `0` | Cashback offered (in ₹) |
| `cashbackDescription` | String | — | `""` | Cashback offer details |
| `isPopular` | Boolean | — | `false` | Highlights the recommended plan |
| `createdAt` | Date | auto | — | Mongoose timestamp |
| `updatedAt` | Date | auto | — | Mongoose timestamp |

> `monthlyAmount` is **not stored** in the database. It is computed dynamically by the backend using the standard reducing-balance EMI formula:
> - **0% interest:** `monthlyAmount = price / tenure`
> - **Non-zero interest:** `monthlyAmount = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1)` where `r = interestRate / 1200`, `n = tenure`
>
> The frontend applies the same formula when the user switches variants, ensuring the displayed EMI always reflects the selected variant's price.
>
> `productId` is indexed for efficient EMI plan lookups per product.

---

### Entity Relationship

```
Product (1) ──────< Variant (many)
Product (1) ──────< EmiPlan (many)
```

---

## API Reference

Base URL: `http://localhost:5000`

### `GET /health`

Health check endpoint.

**Response:**
```json
{ "status": "OK", "message": "EMI Products API is running" }
```

---

### `GET /api/products`

Returns all products with computed variant summary data.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Apple iPhone 17 Pro",
      "slug": "iphone-17-pro",
      "brand": "Apple",
      "category": "Smartphones",
      "imageUrl": "https://...",
      "variantCount": 3,
      "minPrice": 129900,
      "maxPrice": 169900
    }
  ]
}
```

| Computed Field | Description |
|---|---|
| `variantCount` | Total number of variants for the product |
| `minPrice` | Lowest variant selling price |
| `maxPrice` | Highest variant selling price |

---

### `GET /api/products/:slug`

Returns full details for a single product including all variants and EMI plans.

**URL Parameter:** `slug` — the product's URL slug (e.g. `iphone-17-pro`)

**Response:**
```json
{
  "success": true,
  "data": {
    "product": { "_id": "...", "name": "Apple iPhone 17 Pro", "slug": "iphone-17-pro", "..." : "..." },
    "variants": [
      { "_id": "...", "label": "256 GB – Natural Titanium", "storage": "256 GB", "price": 129900, "..." : "..." }
    ],
    "emiPlans": [
      { "_id": "...", "label": "6-Month EMI", "monthlyAmount": 22539, "tenure": 6, "interestRate": 6.5, "isPopular": true, "..." : "..." }
    ]
  }
}
```

**Error (404):**
```json
{ "success": false, "message": "Product not found" }
```

---

## Seeded Data

The seed script (`src/seed.ts`) populates the database with **3 products**, each with variants and EMI plans:

| Product | Variants | EMI Plans | Price Range |
|---|---|---|---|
| Apple iPhone 17 Pro | 3 (256GB, 512GB, 1TB) | 4 (3/6/9/12 months) | ₹1,29,900 – ₹1,69,900 |
| Samsung Galaxy S25 Ultra | 3 (256GB, 512GB, 1TB) | 4 (3/6/9/12 months) | ₹1,24,999 – ₹1,59,999 |
| OnePlus 13 | 2 (256GB, 512GB) | 4 (3/6/9/12 months) | ₹69,999 – ₹79,999 |

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local instance or MongoDB Atlas URI)

### 1. Clone the Repository

```bash
git clone https://github.com/aryankumar2003/1Fi-Full-Stack-Developer-Assignment.git
cd "1Fi Full Stack Developer Assignment"
```

### 2. Configure Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
MONGODB_URI=mongodb://localhost:27017/emi-products
PORT=5000
```

### 3. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Seed the Database

```bash
cd backend
npm run seed
```

### 5. Start the Backend

```bash
cd backend
npm run dev
```

The API will be available at: `http://localhost:5000`

### 6. Start the Frontend

```bash
cd frontend
npm run dev
```

The app will be available at: `http://localhost:5173`

---

## Frontend Pages

| Route | Component | Description |
|---|---|---|
| `/` | `HomePage.tsx` | Lists all products with variant count and price range |
| `/products/:slug` | `ProductPage.tsx` | Product detail with variant selector and EMI plan cards |

## Frontend Components

| Component | Description |
|---|---|
| `Navbar` | Top navigation — Products link only |
| `ProductCard` | Displays a product summary on the home page |
| `VariantSelector` | Allows the user to switch between storage/color variants; EMI plans update in real time |
| `EmiPlanCard` | Displays a single EMI plan with computed monthly amount, tenure, rate, and cashback info |

## UI Theme

The interface follows a **Snapmint-inspired light design system:**

| Token | Value | Usage |
|---|---|---|
| Primary | `violet-600` | Selected states, brand labels, links |
| CTA | `orange-500` | Proceed/checkout button |
| Trust | `green-600/50` | 0% EMI badge, discount label |
| Background | `gray-50` / `white` | Page background / card background |
| Text | `gray-900` / `gray-500` | Headings / body copy |

---

## Scripts Reference

### Backend

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start dev server with hot-reload (ts-node-dev) |
| `build` | `npm run build` | Compile TypeScript to `dist/` |
| `start` | `npm start` | Run compiled production build |
| `seed` | `npm run seed` | Seed the MongoDB database |

### Frontend

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start Vite dev server |
| `build` | `npm run build` | Type-check + build for production |
| `preview` | `npm run preview` | Preview the production build locally |
