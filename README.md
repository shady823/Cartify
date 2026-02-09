🛒 Cartify — E-Commerce Frontend (React + TypeScript + AI-Ready Architecture)

A production-grade, modern e-commerce frontend built with React 19, TypeScript, and enterprise tooling.
Designed with a premium Apple / Stripe / Shopify-inspired UI, smooth animations, dark mode, and scalable architecture.

This project focuses not only on UI, but also on:

Clean architecture

Performance optimization

Scalable state management

Real backend integration

AI agent integration for modern workflows

Built as a real-world, production-style application — not a tutorial demo.

🚀 Live Capabilities
Core Commerce

✔ Authentication (Login / Register / Protected Routes)
✔ Product listing with infinite scroll
✔ Search + filtering (category, brand)
✔ Product details
✔ Cart with quantity updates
✔ Wishlist
✔ Checkout
✔ Orders history
✔ Profile page

UX & Design

✔ Premium UI system
✔ Skeleton loading states
✔ Smooth page transitions
✔ Drawer animations
✔ Toast notifications
✔ Dark mode
✔ Fully responsive

Engineering

✔ API caching
✔ Optimistic UI updates
✔ Request interceptors
✔ Token-based auth
✔ Modular architecture
✔ Test coverage

🧠 AI Integration (Modern Engineering Skill)

One of the key focuses of this project is working alongside AI tools/agents as a developer, which is increasingly required in today’s market.

Why AI?

Modern teams use AI to:

Speed up development

Generate boilerplate

Refactor code safely

Improve DX

Assist debugging

Accelerate feature delivery

How I Integrated AI

During development, I used AI agents (Cursor / GPT-based coding assistants) as a pair programmer to:

✅ Code Generation

Scaffold pages, hooks, and components

Generate TypeScript types from API responses

Create reusable UI patterns

✅ Refactoring

Convert JS → TypeScript safely

Extract reusable hooks

Optimize React Query logic

Improve component structure

✅ Debugging

Diagnose state bugs

Fix React Query cache issues

Improve performance bottlenecks

✅ Architecture Support

Suggest folder structure

Recommend best practices

Improve separation of concerns

AI acted as a productivity multiplier, not a replacement for engineering decisions.
All architecture, logic, and system design were implemented intentionally.

🛠 Tech Stack
Frontend

React 19

TypeScript

Vite

Routing

React Router v7 (protected routes)

State Management

TanStack React Query → server state + caching

Zustand → auth + theme

Networking

Axios with interceptors

UI / Styling

TailwindCSS v4

Framer Motion

React Icons

React Hot Toast

Testing

Vitest

React Testing Library

🏗 Architecture Philosophy

The app is structured like a real scalable product:

Principles

Feature-based folders

Reusable UI components

Centralized API layer

Typed responses

Minimal prop drilling

Separation of server vs client state

Folder Structure
src/
api/ → API services & Axios config
app/ → global providers
components/ → reusable UI
features/ → feature-specific logic
hooks/ → custom hooks
layouts/ → layout system
pages/ → route pages
routes/ → router + guards
store/ → Zustand stores
types/ → API interfaces
utils/ → helpers

🔐 Auth Flow
Unauthenticated

→ redirected to /login

After Login/Register

→ token saved
→ redirect to /home

Requests

token sent in token header

401 → auto logout

⚡ Performance Optimizations

React Query caching

Infinite scroll

Lazy loading pages

Skeleton placeholders

Optimistic UI updates

Memoization

Minimal re-renders

🎨 Design System

Soft shadows

2xl rounded cards

Glassmorphism navbar

Gradient accents

Micro-animations

Smooth drawer transitions

Dark mode persistence

Inspired by:

Apple

Stripe

Shopify

🌍 Backend API

Base URL:

https://ecommerce.routemisr.com

Endpoints:

Auth

Products

Categories

Brands

Cart

Wishlist

Orders

▶️ Setup
npm install
npm run dev

Open:

http://localhost:5173

📜 Scripts
Command Description
npm run dev start dev
npm run build production build
npm run preview preview build
npm run lint eslint

📈 What This Project Demonstrates

This project shows that I can:

✅ Build production-ready React apps
✅ Architect scalable frontends
✅ Integrate real APIs
✅ Manage complex state
✅ Design polished UI/UX
✅ Work effectively with AI agents to ship faster

📌 Future Improvements

Stripe payments

Admin dashboard

SSR / Next.js migration

AI product recommendations

AI chat shopping assistant

PWA support

👤 Author

Shady Zaki
Frontend Engineer
React • TypeScript • AI-Augmented Development
