# Project Notes — New Concept Web

Living document summarizing the current understanding of the application. Update this as the codebase evolves.

## Overview

- Role-based management portal for New Concept language centers built on Next.js App Router (`src/app`).
- SPA-style behaviour: root layout loads Tailwind theme tokens and wraps the tree with MobX providers (`src/app/layout.tsx`, `src/app/providers.tsx`).
- Initial navigation redirects to `/login`, so all entry points flow through the authentication experience (`src/app/page.tsx`).

## Tech Stack

- **Framework:** Next.js 15 with React 19, Turbopack-enabled dev/build scripts (`package.json`).
- **Styling:** Tailwind CSS v4 via the new `@import "tailwindcss"` + `@theme inline` pattern (`src/styles/globals.css`), Tailwind Merge utility, ShadCN UI layer (Radix primitives under `src/components/ui`).
- **State management:** MobX 6 with a custom root store and per-feature persistent stores (`src/stores`).
- **Persistence:** Browser `localStorage` with namespaced, versioned keys and inter-tab sync via `BroadcastChannel`.
- **Tooling:** TypeScript strict mode, ESLint 9, PostCSS, UUID v7 helper, XLSX export capability.

## Application Structure

### Routing & Layouts

- Root layout applies global styles and renders children inside MobX provider context (`src/app/layout.tsx`, `src/app/providers.tsx`).
- `src/app/(auth)` hosts unauthenticated routes (`/login`, `/register` placeholder) with a lightweight layout wrapper.
- Authenticated areas are organised by role folders: `admin`, `manager`, `staff`, `student`. Each has a dedicated layout that wraps children with `RoleLayout` and sets Metadata titles.
- Route guards rely on `useAuthGuard` to block unauthorised access, enforce role-specific dashboards, and trigger redirects if path/role mismatch occurs (`src/hooks/useAuthGuard.ts`).

### UI Composition

- Common chrome lives in `src/components/templates/RoleLayout.tsx`: navbar + sidebar + optional sheet-based mobile nav + bottom bar.
- Navbar handles theme toggling (persisted in `localStorage`), profile menu, and logout flow (`src/components/organisms/Navbar.tsx`).
- Sidebar menu adapts links based on active user role; mobile bottom bar mirrors key links for smaller screens (`src/components/organisms/Sidebar.tsx`, `src/components/organisms/BottomBar.tsx`).
- Feature views (dashboards, tables, forms) live under `src/components/view/{role}` and are imported by the corresponding page routes in `src/app/{role}/...`.

## State & Data Layer

- `RootStore` instantiates all sub-stores, seeds demo data, loads persisted tables, hydrates the auth session, and wires up `BroadcastManager` for multi-tab synchronisation (`src/stores/RootStore.ts`).
- Base class `PersistentStore<T>` encapsulates common CRUD helpers, soft-delete semantics, and storage persistence (`src/stores/BaseStore.ts`).
- Seed data (`src/utils/seed.ts`) populates branches, users across roles, students, programs, financial accounts, vouchers, and sample transactions. Idempotence is managed via a `seeded` flag in storage.
- Authentication store (`src/stores/AuthStoreImpl.ts`) hashes passwords with WebCrypto (`src/utils/crypto.ts`), persists user id under `session:currentUserId`, and creates audit log entries on login/logout.
- Invoice store coordinates invoice + item persistence, visible number generation, discount handling, and automatic report creation for successful payments (`src/stores/InvoiceStore.ts`, `src/utils/invoice.ts`).
- All stores expose convenience queries (e.g., `branchStore.getActiveBranches`, `studentStore.getByBranch`, `voucherStore.getActive`).

### Persistence & Sync

- `src/utils/storage.ts` manages namespaced keys (`nc:v1:<table>`), JSON payload versioning, and flag helpers for one-off actions (e.g., seeding).
- `BroadcastManager` publishes `storage:update` messages so other tabs call their `load()` routines and refresh MobX state (`src/utils/broadcast.ts`).
- `RootStore.notifyChange` is the central hook that stores call after mutations to propagate changes across tabs.

## Key UI Features

- **Login Flow:** `LoginView` initialises root store if needed, performs async MobX auth, shows toast feedback, and routes to the user’s dashboard (`src/components/view/login/index.tsx`).
- **Admin Dashboard:** Aggregates metrics from multiple stores (branch, student, report, log) and presents them in a glassmorphic gradient dashboard aligned with the refreshed visual language (`src/components/view/admin/dashboard/index.tsx`).
- **Theme Support:** Stored per-user in `localStorage` and toggled via navbar; CSS variables adjust for dark mode.
- **Printing/Export:** ESC/POS builder for invoice receipts (`src/utils/escpos.ts`); XLSX/JSON export utilities for data backup (`src/utils/export.ts`).

## Outstanding Areas / Follow-ups

- Manager, staff, and student feature pages exist but require deeper review to document behaviour (to-do for future updates).
- Registration route is a placeholder static page; real onboarding logic not yet implemented.
- Determine long-term persistence strategy (localStorage vs. API-backed service) and how it affects seeded data + broadcast sync.
- Audit logging currently fires for auth events and user CRUD; confirm coverage for other stores.

## Working Notes

- Update this document as new modules are explored or feature behaviour changes.
- Global UI now follows the new pastel purple glass aesthetic from the reference design—light mode only—with shared shells/dashboards restyled accordingly (`src/styles/globals.css`, `src/components/templates/RoleLayout.tsx`, `src/components/organisms/*`, `src/components/view/*/dashboard/index.tsx`).
- Desktop sidebar is fixed beneath the navbar, and the navbar is pinned as well so navigation stays accessible while scrolling (`src/components/templates/RoleLayout.tsx`, `src/components/organisms/Navbar.tsx`).
- Consider adding diagrams or data flow descriptions once server interactions (if any) or API contracts are introduced.
