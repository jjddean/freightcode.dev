# Development Diary & Project History

This log documents the major stages of development for the FreightCode / MarketLive application.

## Phase 1: Foundation & Infrastructure ✅
**Goal:** Establish the core application shell, database connection, and authentication.
- [x] **Project Setup**: Initialized Vite + React + TypeScript environment.
- [x] **Database**: Connected to Convex backend.
- [x] **Authentication**: Integrated Clerk for user and organization management (Multi-tenancy).
- [x] **Basic UI**: Implemented TailwindCSS and Shadcn UI components.
- [x] **Navigation**: Built responsive App Sidebar and Drawer navigation.

## Phase 2: Core Logistics Features ✅
**Goal:** Implement the primary business logic for shipping and freight.
- [x] **Quotes System**: Built QuotesPage with PDF generation.
- [x] **Bookings Flow**: End-to-end booking wizard (Origin → Destination → Cargo).
- [x] **Shipments Tracking**: ShipmentsPage with Mapbox LiveVesselMap visualization.
- [x] **Email Notifications**: Integrated Resend API for shipment updates.

## Phase 3: Compliance & Security ✅
**Goal:** Ensure regulatory compliance and application security.
- [x] **KYC Verification**: CompliancePage with document upload.
- [x] **Security Patching**: Upgraded dependencies, resolved XSS vulnerabilities.

## Phase 4: Admin Portal ✅
**Goal:** Provide internal tools for managing the platform.
- [x] **Admin Dashboard**: Dedicated pages for Approvals, Finance, Audit.
- [x] **SOP Implementation**: Suspend Organization, Flag Shipment Risk actions.

## Phase 5: Monetization & Subscriptions ✅
**Goal:** Implement recurring billing and feature gating.
- [x] **Stripe Integration**: Hosted Checkout with webhook sync.
- [x] **Subscription UI**: Pricing cards, upgrade flow.
- [x] **Feature Gating**: `useFeature` hook for Pro-only features.
- [x] **Usage Limits**: Free tier capped at 5 shipments/month.
- [x] **Personal Subscriptions**: Individual user upgrades supported.

## Phase 6: GeoRisk Navigator™ ✅ (Current - v1.0.0)
**Goal:** Real-time geopolitical and compliance risk assessment.
- [x] **Backend Implementation** (`convex/georisk.ts`):
  - Zone-based risk calculation (conflict zones, maritime risks)
  - OpenSanctions API integration for sanctions screening
  - OpenWeather API integration for weather disruption risk
  - Weighted scoring system (Zone: 40%, Sanctions: 40%, Weather: 20%)
  - Tiered access (Free: basic zone risk, Pro: full assessment)
- [x] **Risk Assessment Action** (`assessRouteRisk`):
  - Multi-factor risk analysis
  - Real-time API calls to external data sources
  - Advisory generation based on risk level
- [x] **Demo Implementation** (`/georisk-demo`):
  - Interactive demo with 4 scenarios (Low/Medium/High/Free Tier)
  - Expandable risk breakdowns
  - Visual risk indicators
- [x] **Marketing Site Integration**:
  - Next.js 16 landing page at `localhost:3000`
  - GeoRiskSection component with video player
  - LocalVideoPlayer component for demo video

### [2026-01-30] - GeoRisk Navigator Launch
- **Feature**: Launched GeoRisk Navigator™ as a premium feature
- **APIs Integrated**:
  - OpenSanctions (free tier) for sanctions screening
  - OpenWeather for weather risk assessment
- **Demo Video**: Created browser recording showcasing all risk scenarios
- **Marketing**: Integrated demo into Next.js landing page

## Upcoming Features

### Phase 7: Advanced Analytics (Planned)
- [ ] **Reporting Dashboard**: Pro-tier analytics and insights
- [ ] **Custom Reports**: Exportable shipment and revenue reports
- [ ] **Predictive Insights**: AI-powered route optimization

### Phase 8: Client Portal Enhancement (Planned)
- [ ] **Quote-to-Booking Flow**: External client self-service
- [ ] **Status Updates**: Automated email notifications
- [ ] **Document Portal**: Client-facing document uploads

### Phase 9: Mobile Experience (Future)
- [ ] **PWA**: Progressive Web App for mobile access
- [ ] **React Native**: Native mobile app (iOS/Android)

## Technical Stack

**Frontend:**
- React 19 + TypeScript
- Vite (App) + Next.js 16 (Marketing)
- TailwindCSS 4 + Shadcn UI
- Mapbox GL for maps

**Backend:**
- Convex (Real-time database + serverless functions)
- Clerk (Authentication)
- Stripe (Payments)

**APIs:**
- OpenSanctions (Compliance)
- OpenWeather (Weather data)
- Resend (Email)
- Mapbox (Geocoding/Maps)

## Deployment

- **App**: Vercel (Production)
- **Marketing**: Vercel (Production)
- **Database**: Convex Cloud

## Phase 7: Digital Freight Forwarder MVP ✅ (Current)
**Goal**: Transform marketplace into a functional Digital Freight Forwarder (DFF).
- [x] **Guest Quoting (Backend)**: Added `createPublicQuote` mutation for non-authenticated pricing.
- [x] **Contracts Engine**: Implemented `contracts` table and logic to prioritize negotiated rates.
- [x] **Checkout Integrations**: Added Customs Brokerage & Insurance upsells to booking flow.
- [x] **Seeding**: Created `seedContracts` script for testing Maersk/MSC rates.
- [ ] **Guest Quoting (Frontend)**: ~Widget implemented~ (Reverted due to layout issues, pending redesign).

### [2026-02-01] - DFF Core Implementation
- **Backend**: Public API endpoints for quoting live.
- **Frontend**: "Add-on Services" modal live in Client Portal.
- **Note**: Guest Quote Widget was deployed to `marketing-site` but reverted to maintain design integrity.

### [2026-02-01] - Security Remediation & Revert
- **Action**: Removed exposed private key files (`scripts/encode-key.js`, `key_b64_retry.txt`) for security.
- **Attempted**: Replaced `Math.random` with `crypto.getRandomValues` in `developer.ts` and `documents.ts`.
- **Result**: Caused backend crash compatible with Convex runtime.
- **Remediation**: Emergency revert applied. Code returned to `Math.random` (stable).
- **Status**: Private keys deleted (Secure). App Logic (Reverted/Stable). Marketing Site (Reverted/Stable).
