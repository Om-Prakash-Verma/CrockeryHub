# 🚀 CrockeryHub

> A Firebase-backed crockery catalog and admin dashboard built with Next.js for managing products, brands, categories, contact submissions, and basic storefront settings.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-20232a?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore-ffca28?style=for-the-badge&logo=firebase&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06b6d4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Status](https://img.shields.io/badge/Status-Learning%20Project-blue?style=for-the-badge)

---

## 📌 Executive Summary

- This project is a product showcase website for crockery and kitchenware.
- It includes a public storefront and a private admin area.
- Admin users can add products, organize them into categories and brands, manage contact form fields, and update some homepage/settings content.
- A practical use case is a small business that wants a simple catalog site without building a full checkout system.
- Instead of online payment, the product page pushes users toward WhatsApp contact for buying.

---

## 🧠 Learning Note

This project was built with AI assistance while learning development.

- Learning-focused project
- Code is being actively understood and improved
- Not all parts were written manually
- The value of this project is in understanding, iterating, and improving the code over time

---

## ✨ Features

- Public homepage with hero, featured products, about section, and contact form in `src/components/home-client.tsx`
- Product listing page with optional category filtering in `src/components/products-grid.tsx`
- Product details page with carousel, specifications, and WhatsApp CTA in `src/components/product-details-client.tsx`
- Brand browsing and brand-specific product pages in `src/app/brands/page.tsx` and `src/components/brand-details-client.tsx`
- Category browsing with parent/sub-category support in `src/app/categories/page.tsx` and `src/components/header.tsx`
- Admin dashboard with content counts in `src/app/admin/page.tsx`
- Admin CRUD for products in `src/app/admin/products/page.tsx` and `src/components/product-form.tsx`
- Admin CRUD for categories in `src/app/admin/categories/page.tsx` and `src/components/category-form.tsx`
- Admin CRUD for brands in `src/app/admin/brands/page.tsx` and `src/components/brand-form.tsx`
- Admin CRUD for custom contact form fields in `src/app/admin/custom-fields/page.tsx` and `src/components/custom-field-form.tsx`
- Admin settings for WhatsApp number, homepage visibility, and theme colors in `src/app/admin/settings/page.tsx`
- Contact form submission storage using a Next.js Server Action in `src/app/contact/actions.ts`
- Firebase real-time reads using reusable hooks in `src/firebase/firestore/use-collection.tsx` and `src/firebase/firestore/use-doc.tsx`

---

## 🛠️ Tech Stack

| Category | Tools |
|----------|------|
| Language | TypeScript |
| Framework | Next.js 15 (App Router), React 18 |
| Styling | Tailwind CSS, shadcn/ui, Radix UI |
| Backend / BaaS | Firebase Authentication, Firestore |
| Forms | React Hook Form, Zod |
| UI Utilities | Lucide React, date-fns, Embla Carousel, Recharts |
| AI / Experimental | Genkit, Google GenAI plugin |
| Deployment Clue | Firebase App Hosting (`apphosting.yaml`) |

---

## 📁 Project Structure

```bash
CrockeryHub/
├── public/
│   └── logo.png
├── src/
│   ├── ai/
│   ├── app/
│   │   ├── admin/
│   │   ├── brands/
│   │   ├── categories/
│   │   ├── contact/
│   │   ├── guide/
│   │   ├── login/
│   │   └── products/
│   ├── components/
│   │   ├── ui/
│   │   └── ...
│   ├── firebase/
│   │   └── firestore/
│   ├── hooks/
│   └── lib/
├── apphosting.yaml
├── components.json
├── firestore.rules
├── next.config.ts
├── package.json
├── storage.rules
├── tailwind.config.ts
└── tsconfig.json
```

### Folder Guide

- `public/` stores static assets such as the site logo.
- `src/app/` contains Next.js routes for the storefront and admin panel.
- `src/components/` contains reusable UI and feature components.
- `src/components/ui/` contains shadcn-style primitive UI components.
- `src/firebase/` wraps Firebase initialization, auth state, Firestore hooks, and write helpers.
- `src/lib/` contains shared types, utilities, and placeholder image data.
- `src/ai/` contains Genkit setup, but no active AI flows were found.

---

## ⚙️ How It Works

1. The app starts in `src/app/layout.tsx`, where the global layout, fonts, toaster, and Firebase client provider are wired in.
2. `src/firebase/client-provider.tsx` initializes Firebase, loads app settings from Firestore, injects dynamic theme CSS, and applies either the public layout or admin layout.
3. Public pages use Firestore hooks like `useCollection` and `useDoc` to read products, categories, brands, and settings in real time.
4. The homepage in `src/components/home-client.tsx` reads settings and products, then shows the hero, about section, featured products, and contact form.
5. Product and brand detail pages use dynamic routes and Firestore queries based on a product `slug` or brand `slug`.
6. The contact form submits through the Server Action in `src/app/contact/actions.ts`, which validates fields with Zod, loads any custom fields from Firestore, and saves the submission into `contact_form_submissions`.
7. The admin area checks whether a Firebase user is signed in. If not, it redirects to `/login`.
8. Admin forms write directly to Firestore using helper functions like `addDocumentNonBlocking`, `setDocumentNonBlocking`, and `deleteDocumentNonBlocking`.
9. Firestore security rules allow public reads for storefront data and require authentication for admin writes.

---

## 🔑 Key Files You Should Understand

- `src/app/layout.tsx` → root layout, fonts, metadata, global providers
- `src/firebase/client-provider.tsx` → Firebase startup and runtime theme injection
- `src/components/conditional-layout.tsx` → decides whether header/footer should appear
- `src/components/home-client.tsx` → homepage logic and main storefront composition
- `src/components/products-grid.tsx` → product filtering by category from URL params
- `src/components/product-details-client.tsx` → product page logic and WhatsApp CTA
- `src/app/contact/actions.ts` → contact form validation and Firestore write
- `src/app/admin/layout.tsx` → admin route protection and dashboard shell
- `src/components/product-form.tsx` → most detailed admin form, good example of CRUD structure
- `src/firebase/firestore/use-collection.tsx` → reusable real-time collection hook
- `src/firebase/firestore/use-doc.tsx` → reusable real-time document hook
- `src/lib/types.ts` → main app data shapes
- `firestore.rules` → Firestore access rules

---

## 🧩 Important Code Explained

### 1. Firebase Provider and Dynamic Theme

- The app initializes Firebase once in `src/firebase/index.ts`.
- `FirebaseClientProvider` wraps the whole app and loads the settings document from Firestore.
- Theme values like `themePrimary` and `themeAccent` are injected into CSS variables at runtime.
- This means a non-technical admin can update some visual settings without changing code.

### 2. Real-Time Firestore Reads

- `useCollection` subscribes to a collection or query with `onSnapshot`.
- `useDoc` subscribes to a single document.
- These hooks keep UI automatically updated when Firestore data changes.
- They also emit custom permission errors when security rules block access.

### 3. Admin CRUD Pattern

- Admin pages open dialogs for add/edit forms.
- Forms validate with Zod and React Hook Form.
- On submit, data is written to Firestore using non-blocking helper functions.
- This pattern is reused across products, categories, brands, and custom fields.

### 4. Contact Form with Dynamic Fields

- The public contact form reads extra field definitions from `custom_form_fields`.
- The Server Action fetches those field definitions again on submit.
- It builds a dynamic validation schema and stores user answers under `customFields`.
- This is a useful pattern because the form shape can change without redeploying the app.

### 5. Slug-Based Product and Brand URLs

- Products and brands generate slugs from names.
- Product detail pages query Firestore by `slug`, not by raw document ID.
- This makes URLs cleaner, such as `/products/rustic-ceramic-mug`.

---

## ⚙️ Configuration

- `next.config.ts`
  - Ignores TypeScript errors during build
  - Ignores ESLint errors during build
  - Allows remote images from any `http` or `https` host
- `tailwind.config.ts`
  - Configures custom fonts and CSS-variable-based theme colors
- `components.json`
  - Confirms shadcn/ui-style component setup
- `apphosting.yaml`
  - Suggests Firebase App Hosting deployment with `maxInstances: 1`
- `firestore.rules`
  - Allows public reads for storefront collections
  - Restricts writes to authenticated users

### Important Note

- `storage.rules` exists, but based on repository contents it appears to contain TypeScript/React code instead of Firebase Storage rules.
- This is likely accidental or unfinished.
- Treat Firebase Storage setup as **unclear** until that file is corrected.

---

## 🔐 Environment Variables

| Variable | Purpose | Required |
|----------|--------|----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web config | Yes |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Yes |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Yes |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Yes |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID | Yes |
| `NEXT_PUBLIC_SITE_TITLE` | Branding used in metadata and UI | Recommended |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs and metadata | Recommended |
| `NEXT_PUBLIC_SHOP_ADDRESS` | Footer map link | Optional |
| `NEXT_PUBLIC_INSTAGRAM_ID` | Instagram button target | Optional |
| `NEXT_PUBLIC_ABOUT_US_CONTENT` | Homepage about section text | Optional |
| `NEXT_PUBLIC_HERO_HEADLINE` | Hero heading text | Optional |
| `NEXT_PUBLIC_HERO_SUBHEADING` | Hero supporting text | Optional |
| `NEXT_PUBLIC_PRODUCTS_SUBHEADING` | Product section supporting text | Optional |

### Example `.env`

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef

NEXT_PUBLIC_SITE_TITLE=CrockeryHub
NEXT_PUBLIC_SITE_URL=https://example.com
NEXT_PUBLIC_SHOP_ADDRESS=Your shop address here
NEXT_PUBLIC_INSTAGRAM_ID=your_instagram_handle
NEXT_PUBLIC_ABOUT_US_CONTENT=Short business story here
NEXT_PUBLIC_HERO_HEADLINE=Artistry in Every Piece
NEXT_PUBLIC_HERO_SUBHEADING=Discover our exclusive collection
NEXT_PUBLIC_PRODUCTS_SUBHEADING=Quality, innovation, and style
```

---

## 🚀 Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
# Add the Firebase and branding variables shown above

# 3. Start the development server
npm run dev
```

### Firebase Setup You Will Likely Need

- Create a Firebase project
- Enable Firestore
- Enable Authentication with Email/Password
- Create at least one user manually in Firebase Authentication
- Apply `firestore.rules`
- Create the required collections and documents through the admin UI or Firestore console

---

## ▶️ How to Run

```bash
# Development
npm run dev

# Production build
npm run build
npm run start

# Type check
npm run typecheck

# Lint
npm run lint
```

### Local URLs

- Public site: `http://localhost:9002`
- Admin login: `http://localhost:9002/login`
- Admin dashboard: `http://localhost:9002/admin`

---

## 🌐 API / Interfaces

There is no traditional REST API or Express backend in this repository.

### Main Interfaces

- Public web interface
  - `/`
  - `/products`
  - `/products/[id]`
  - `/brands`
  - `/brands/[slug]`
  - `/categories`
  - `/contact`
  - `/guide`
- Admin web interface
  - `/login`
  - `/admin`
  - `/admin/products`
  - `/admin/categories`
  - `/admin/brands`
  - `/admin/custom-fields`
  - `/admin/submissions`
  - `/admin/settings`
- Server-side interface
  - `submitContactForm` in `src/app/contact/actions.ts`

---

## 💾 Data Handling

### Firestore Collections Confirmed in Code

| Collection | Purpose |
|----------|---------|
| `products` | Product catalog items |
| `categories` | Product categories, including optional parent categories |
| `brands` | Brand records with slug and logo |
| `settings` | Global app configuration, especially `app-configuration` |
| `custom_form_fields` | Configurable extra fields for the contact form |
| `contact_form_submissions` | Messages submitted through the contact form |

### Main Data Shapes

- `Product`
  - name, slug, price, category, brand, featured, descriptions, specifications, images
- `Category`
  - name, optional `parentId`
- `Brand`
  - name, slug, description, logo URL
- `AppSettings`
  - WhatsApp number, about image, homepage toggles, theme colors
- `ContactFormSubmission`
  - name, email, phone, subject, message, custom fields, submission date

---

## 🔌 External Integrations

- Firebase Authentication
  - used for admin login
- Firestore
  - used as the main database
- WhatsApp deep link
  - product pages build a `wa.me` purchase/contact link
- Instagram deep link
  - header can link to a configured Instagram account
- Google Maps search link
  - footer can open the shop address in Maps
- Genkit + Google GenAI
  - setup exists in `src/ai/genkit.ts`, but no active flows are connected to the UI

---

## 🧪 Testing

- No automated test files were found in the repository.
- Available quality scripts in `package.json`:
  - `npm run lint`
  - `npm run typecheck`
- Important caveat:
  - `next.config.ts` ignores TypeScript and ESLint errors during production builds.
  - That makes deployment easier during learning, but it also reduces safety.

---

# 🧠 Understanding This Project

## 🎯 What You MUST Understand for Interviews

- How a Next.js App Router app is structured
- How Firebase Auth is used to protect an admin area
- How Firestore collections are read in real time with hooks
- How forms are validated with Zod and React Hook Form
- How CRUD dialogs work for products, categories, and brands
- How dynamic URL slugs are generated and queried
- How configuration-driven UI works through the `settings` document

## 🔄 Core Logic Explained Simply

When a visitor opens the site, the app reads products, categories, brands, and settings from Firestore, then renders the storefront.

When an admin logs in, they can create or update content through forms, and those changes are written back to Firestore.

When a customer submits the contact form, the app validates the input, includes any custom fields configured by the admin, and saves the message as a Firestore document.

## ⚠️ Confusing Parts

- Admin access is based on "any authenticated Firebase user" rather than a true role/claim system.
- `storage.rules` appears incorrect and does not currently look like Firebase Storage rules.
- The homepage expects `/hero.jpg`, but that file was not found in `public/` during analysis.
- The package name is `nextn`, while the app branding in code is `CrockeryHub`.
- Genkit dependencies are installed, but no visible AI feature is actually used.

## 🤖 AI-Generated Patterns

- Non-blocking Firestore wrappers reduce boilerplate, but they can hide write failures because the UI continues immediately.
- Some abstractions are more complex than needed for a beginner project.
- The Firebase permission error system is interesting, but may be more advanced than this project currently needs.
- There are signs of unfinished or leftover generated code, especially around AI setup and the unexpected `storage.rules` contents.

---

## 🎤 How to Explain This Project in Interview

This is a Firebase-backed product catalog web app for a crockery business. It has a public storefront where users can browse products by category or brand, view product details, and send inquiries. It also has an admin dashboard where authenticated users can manage products, brands, categories, contact form fields, and some site settings.

### 🗣️ Example Answer

> I built a learning project called CrockeryHub using Next.js, TypeScript, Tailwind, and Firebase. The public side works like a product showcase for crockery and kitchenware, while the admin side lets a signed-in user manage catalog data in Firestore. One part I think is especially useful is the contact form system, because the extra fields are configurable from the admin panel and validated again on the server before being stored. The project helped me practice App Router structure, Firestore data modeling, authentication, form handling, and turning business requirements into a working UI.

---

# 💼 For Hiring Managers

## 👨‍💻 Candidate Summary

- Built a full-stack-style product catalog using modern frontend tools and Firebase
- Uses AI as a productivity tool while still iterating on understanding
- Shows willingness to ship, review, and improve
- Has worked through real app concerns like auth, CRUD, dynamic routing, forms, and configuration

## 🚀 What This Project Shows

- Practical ability to connect UI to a live backend service
- Understanding of modern React and Next.js project structure
- Comfort with forms, validation, and admin workflows
- Ability to model content in Firestore and build a usable business-facing dashboard

## ⚡ Key Highlights

- Public storefront and admin dashboard in one codebase
- Reusable Firebase hooks for real-time data
- Dynamic contact form fields stored in the database
- Theme customization through admin settings
- Beginner-friendly but still practically useful architecture

## 🧰 Skills Demonstrated

- Next.js App Router
- React component composition
- TypeScript types and interfaces
- Firebase Auth and Firestore
- CRUD UI patterns
- Zod form validation
- Tailwind and shadcn/ui styling
- Route-based data loading
- Slug generation and dynamic pages

## 📊 Complexity Level

- Intermediate learning project

### Why that rating is honest

- It goes beyond a simple CRUD tutorial because it combines public pages, admin tools, Firestore rules, dynamic forms, and runtime settings.
- It is not fully production-hardened yet because there is no test suite, no role-based authorization, and a few inconsistent files.

## ✅ Strengths

- Solves a real business-style use case
- Clear separation between public and admin experiences
- Good use of reusable hooks and typed data models
- Strong amount of functionality for a learning project

## ⚠️ Improvements

- Add role-based admin authorization
- Add automated tests
- Remove or finish unfinished AI-related scaffolding
- Fix `storage.rules`
- Stop ignoring TypeScript and ESLint build errors

## ❓ Interview Questions

- How does the app protect admin features today, and what would you improve?
- Why did you choose Firestore over a traditional SQL database here?
- How does the dynamic contact form field system work?
- What problems can happen with non-blocking Firestore writes?
- How would you make this project production-ready?

## 🧾 Recruiter TL;DR

This is a serious learning project, not just a static UI clone.  
It demonstrates real app-building ability with authentication, CRUD flows, Firestore integration, and configurable UI behavior.  
The candidate clearly used AI assistance, but the project still shows practical implementation skills and good room for structured growth.

---

# 📈 How to Improve This Project

- Add Firebase custom claims or role documents so not every signed-in user becomes an admin
- Add automated tests for forms, page rendering, and Firestore hooks
- Fix or replace `storage.rules` with real Firebase Storage rules
- Add proper image management instead of relying mostly on URLs and missing local assets
- Enforce `npm run typecheck` and `npm run lint` in CI
- Add loading, empty, and error states more consistently across all screens
- Add pagination or query limits if the catalog grows
- Add product search and sorting
- Add seeded demo data for easier setup
- Either remove Genkit for now or build an actual AI feature with it

### Good Next Topics to Learn

- Role-based authorization
- Testing with Vitest or Playwright
- Better Firestore data validation
- CI/CD and deployment checks
- Performance optimization in Next.js

---

# 📦 Appendix

## Confirmed Scripts

```bash
npm run dev
npm run genkit:dev
npm run genkit:watch
npm run build
npm run start
npm run lint
npm run typecheck
```

## Security Summary

- Public users can read:
  - products
  - categories
  - brands
  - settings
  - custom form fields
- Public users can create:
  - contact form submissions
- Authenticated users can write:
  - products
  - categories
  - brands
  - settings
  - custom form fields
- Authenticated users can read/delete:
  - contact form submissions

## Honest Project Notes

- This repository is useful and substantial for a learning project.
- It is not yet production-ready in a strict sense.
- The strongest parts are the admin workflows, Firestore integration, and configurable contact form.
- The biggest risks are authorization depth, missing tests, ignored build errors, and a few inconsistent files/assets.

---

## ✅ Quick Scan Summary

- Built with Next.js, TypeScript, Tailwind, Firebase, and shadcn/ui
- Public storefront + admin dashboard
- Firestore-backed CRUD for products, brands, categories, submissions, and settings
- Dynamic contact form fields stored in the database
- Good interview project with honest improvement opportunities
