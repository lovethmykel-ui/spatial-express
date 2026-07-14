# Spatial Express

A premium, modern logistics and freight-forwarding application prototype.

## Overview
Spatial Express is a comprehensive frontend prototype featuring:
- **Public Portal:** Landing page, service listings, live shipment tracking, and an interactive cost calculator.
- **Customer Dashboard:** Allows clients to book pickups, view shipment manifests, generate invoices, and open support tickets.
- **Admin Dashboard:** A robust backoffice including a dynamic Zone Manager, a dynamic Pricing Matrix Editor, and Courier Partner management.

## Stack
- React 18
- Vite
- TypeScript
- Tailwind CSS
- Framer Motion (for animations)
- Recharts (for dashboard analytics)
- Lucide React (for icons)

## Setup & Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## Current State
The application is currently driven by a sophisticated mocked state via `LogisticsContext.tsx`. Next steps involve swapping out this mocked context with a live backend (e.g., Supabase, Firebase, or a custom REST API) to persist data, manage authentication, and handle real user sessions.
