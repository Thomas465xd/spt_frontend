# Portal SPT - B2B Partner Platform Frontend 🚀

<div align="center">

![Spare Parts Trade Logo](./public/logo.svg)

**Providing quality spare parts and exceptional service since 2020.**

[![React](https://img.shields.io/badge/React-19.1-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Private-red.svg)](#-license)

[Website](https://www.morangojoyas.cl) • [Report Bug](https://github.com/Thomas465xd/JUP-RealEstate_Frontend/issues) • [Request Feature](https://github.com/Thomas465xd/JUP-RealEstate_Frontend/issues)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
  - [Bsale Integration](#-bsale-integration---the-core-of-product-management)
  - [Backend Architecture](#-backend-architecture---custom-business-logic)
- [System Architecture](#️-system-architecture)
- [Features](#-features)
- [Technologies](#️-technologies)
- [Project Structure](#-project-structure)
- [Usage](#-usage)
- [License](#-license)

**See also:** [Backend Repository](https://github.com/Thomas465xd/spt_backend)

---

## 🏢 About the Project

**Portal SPT** is a modern B2B partner platform designed to streamline order management, product browsing, and secure payment transactions for business partners. The project provides a professional and intuitive user experience for both clients managing their orders and administrators controlling the platform.

### Purpose

This frontend project provides:

- **For Business Partners**: A modern interface to browse products, manage shopping carts, place orders, and track order history
- **For Administrators**: Complete control panel to manage users, orders, and platform content
- **For the Business**: Professional digital presence with optimized performance, integrated analytics, and secure payment processing

### 🔗 Bsale Integration - The Core of Product Management

One of the most remarkable features of Portal SPT is its **deep integration with Bsale**, a cloud-based point-of-sale (POS) and inventory management system. Bsale powers the entire product catalog, shopping cart, and inventory management functionalities:

#### What Bsale Provides:
- **Product Catalog**: All products, variants, prices, and inventory are synced in real-time from Bsale
- **Shopping Cart Management**: Cart operations (add, update, delete) are handled through Bsale's API
- **Inventory Control**: Stock levels and product availability are managed centrally through Bsale
- **Checkout Processing**: Order creation and initial checkout flow leverage Bsale's marketplace APIs
- **Product Search & Discovery**: Product filtering, search, and display utilize Bsale's product database

The frontend communicates with Bsale through dedicated API endpoints (`/src/api/BsaleOrderAPI.ts`, `/src/api/ProductAPI.ts`) that handle authentication and data transformation between Bsale's format and the application's needs.

### 🔧 Backend Architecture - Custom Business Logic

While Bsale handles product and inventory management, **Portal SPT has its own backend (`spt_backend`)** that manages business-specific features:

#### Backend Responsibilities:
- **User Management**: Registration, confirmation, and user profile management
- **Authentication**: Secure login, password management, and session handling
- **Order Administration**: Custom order tracking and management system separate from Bsale
- **Custom Discount System**: Loyalty program where administrators can assign personalized discounts (1-100%) to specific businesses
- **Order Records**: Persistent order history and business intelligence separate from Bsale's checkout system

#### Custom Discount & Loyalty System:
Administrators can assign **custom discount percentages** to affiliated businesses through the backend API. These discounts are automatically applied during checkout and serve as a loyalty program to reward long-term partnerships with Portal SPT. This feature is entirely managed by the `spt_backend`, allowing flexible business rules independent of Bsale's discount system.

This hybrid architecture combines the powerful inventory management of Bsale with custom business logic tailored to Portal SPT's specific needs.

---

## 🏗️ System Architecture

Portal SPT uses a **hybrid architecture** that combines external services with custom business logic:

```
┌─────────────────────────────────────────────────────────────┐
│                     Portal SPT Frontend                      │
│                    (React + TypeScript)                      │
└───────────┬─────────────────────────────────┬───────────────┘
            │                                 │
            │                                 │
    ┌───────▼────────┐              ┌────────▼────────┐
    │  Bsale API     │              │  SPT Backend    │
    │  Integration   │              │  (Custom API)   │
    └───────┬────────┘              └────────┬────────┘
            │                                 │
            │                                 │
    ┌───────▼────────────────┐      ┌────────▼────────────────┐
    │  • Product Catalog     │      │  • User Management      │
    │  • Shopping Cart       │      │  • Authentication       │
    │  • Inventory System    │      │  • Order Records        │
    │  • Checkout Flow       │      │  • Custom Discounts     │
    │  • Stock Management    │      │  • Admin Functions      │
    └────────────────────────┘      └─────────────────────────┘
```

### Integration Points:

**Bsale Integration** (`/src/api/BsaleOrderAPI.ts`, `/src/api/ProductAPI.ts`):
- Handles all product-related operations through Bsale's marketplace API
- Manages shopping cart state and checkout processes
- Real-time inventory synchronization
- Uses Bsale's access token authentication

**Backend Integration** (`/src/api/OrderAPI.ts`, `/src/api/AuthAPI.ts`, `/src/api/AdminAPI.ts`):
- Manages user accounts and authentication tokens
- Stores order history independently from Bsale
- Applies custom business rules and discounts
- Provides admin panel functionality

---

## ✨ Features

### 🛒 For Business Partners

- **Product Catalog** (Bsale): Browse and search through available products with real-time inventory from Bsale
- **Shopping Cart** (Bsale): Add products to cart with quantity management powered by Bsale's cart API
- **Custom Discounts**: Benefit from personalized loyalty discounts assigned by administrators
- **Order Management** (Backend): View order history and track current orders through the custom backend
- **Profile Management**: Update personal information and shipping details
- **Secure Authentication** (Backend): Login and registration with password recovery
- **Responsive Design**: Optimized experience across all devices

### 🔐 For Administrators

- **Admin Dashboard**: Comprehensive overview of platform metrics
- **User Management** (Backend): Manage user accounts, confirmations, and permissions
- **Custom Discount Assignment** (Backend): Set personalized discount rates (1-100%) for businesses as a loyalty program
- **Order CRUD** (Backend): Create, view, update, and manage orders through the custom backend system
- **Product Management** (Bsale): Control product listings and availability through Bsale integration
- **User Search**: Quick lookup and management of business partners
- **Secure Access**: Role-based authentication and authorization

### 🚀 Technical Features

- **Bsale Integration**: Cloud-based POS and inventory management system powering all product operations
- **Hybrid Architecture**: Combines Bsale's inventory management with custom business logic
- **Fast Development**: Hot Module Replacement (HMR) with Vite
- **Type Safety**: TypeScript for robust and maintainable code
- **Optimized Performance**: Code splitting and lazy loading
- **Modern UI**: Responsive design with Tailwind CSS
- **State Management**: Efficient data fetching and caching with React Query
- **Analytics**: Vercel Analytics and Speed Insights integration
- **SEO Optimized**: Comprehensive meta tags and structured data

---

## 🛠️ Technologies

### Core Framework

- **[React 18.3](https://react.dev/)** - Modern UI library with hooks
- **[TypeScript 5.6](https://www.typescriptlang.org/)** - Type safety and improved developer experience
- **[Vite 6.0](https://vitejs.dev/)** - Next-generation frontend build tool with lightning-fast HMR

### Routing

- **[React Router 7.1](https://reactrouter.com/)** - Declarative routing for React applications

### Styling

- **[Tailwind CSS 4.0](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Headless UI 2.2](https://headlessui.com/)** - Unstyled, accessible UI components
- **[Heroicons 2.2](https://heroicons.com/)** - Beautiful hand-crafted SVG icons
- **[Lucide React](https://lucide.dev/)** - Icon library with tree-shaking support
- **[Tailwind Scrollbar](https://github.com/adoxography/tailwind-scrollbar)** - Custom scrollbar styling

### State Management & Data Fetching

- **[TanStack Query (React Query) 5.66](https://tanstack.com/query)** - Powerful async state management
- **[Axios 1.7](https://axios-http.com/)** - Promise-based HTTP client
- **[React Hook Form 7.54](https://react-hook-form.com/)** - Performant form management
- **[Zod 3.24](https://zod.dev/)** - TypeScript-first schema validation

### UI/UX Enhancements

- **[SweetAlert2 11.15](https://sweetalert2.github.io/)** - Beautiful, customizable alerts
- **[React Toastify 11.0](https://fkhadra.github.io/react-toastify/)** - Toast notifications

### Analytics & Monitoring

- **[Vercel Analytics](https://vercel.com/analytics)** - Traffic and performance analytics
- **[Vercel Speed Insights](https://vercel.com/docs/speed-insights)** - Real-time performance monitoring

### Development Tools

- **[ESLint 9.17](https://eslint.org/)** - Code linting and quality assurance
- **[PostCSS](https://postcss.org/)** - CSS transformation tool
- **[SWC](https://swc.rs/)** - Super-fast TypeScript/JavaScript compiler

---

## 📁 Project Structure

```
spt_frontend/
├── src/
│   ├── api/                      # API service layer
│   │   ├── AdminAPI.ts          # Admin operations
│   │   ├── AuthAPI.ts           # Authentication
│   │   ├── OrderAPI.ts          # Order management
│   │   ├── ProductAPI.ts        # Product operations
│   │   ├── ProfileAPI.ts        # User profile
│   │   └── BsaleOrderAPI.ts     # Bsale integration
│   │
│   ├── components/               # Reusable React components
│   │   ├── admin/               # Admin panel components
│   │   ├── auth/                # Authentication components
│   │   ├── cart/                # Shopping cart components
│   │   ├── orders/              # Order components
│   │   ├── products/            # Product components
│   │   ├── profile/             # User profile components
│   │   └── ui/                  # UI utility components
│   │
│   ├── views/                    # Page-level components
│   │   ├── admin/               # Admin pages
│   │   ├── auth/                # Authentication pages
│   │   ├── cart/                # Shopping cart pages
│   │   ├── home/                # Home page
│   │   ├── orders/              # Order pages
│   │   ├── products/            # Product pages
│   │   ├── profile/             # Profile pages
│   │   └── 404/                 # Error pages
│   │
│   ├── layouts/                  # Layout components
│   │   ├── AppLayout.tsx        # Main app layout
│   │   ├── AuthLayout.tsx       # Authentication layout
│   │   ├── AdminLayout.tsx      # Admin panel layout
│   │   └── ProfileLayout.tsx    # Profile layout
│   │
│   ├── hooks/                    # Custom React hooks
│   ├── types/                    # TypeScript type definitions
│   ├── utilities/                # Utility functions
│   ├── lib/                      # Library configurations
│   ├── router.tsx                # Application routing
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Global styles
│
├── public/                       # Static assets
│   ├── favicon.ico              # Favicon
│   └── ...                      # Other static files
│
├── index.html                    # HTML entry point with SEO meta tags
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
├── eslint.config.js             # ESLint configuration
├── vercel.json                  # Vercel deployment config
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

---

## 💻 Usage

### Prerequisites

- Node.js 16+ and npm installed
- Access to the Portal SPT backend API

### Installation

```bash
# Clone the repository
git clone https://github.com/Thomas465xd/spt_frontend.git

# Navigate to the project directory
cd spt_frontend

# Install dependencies
npm install
```

### Development

```bash
# Start development server with hot reload
npm run dev

# Server will be available at http://localhost:5173
```

### Production

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Linting

```bash
# Run ESLint
npm run lint
```

---

## 📄 License

This project is **private** and belongs to **Portal SPT**. All rights reserved.

For use, distribution, or modification of this code, please contact the owner directly.

---

**Made with ❤️ for Spare Parts Trade**

_Your trusted B2B partner platform - Streamlining business transactions_
