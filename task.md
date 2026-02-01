# Tasks

> [!NOTE]
> **User Preference**: For analysis/reports, always provide **Inline Visual Summaries** (Tables/Charts directly in chat) instead of creating .md files. "Normal Font + Tables".

- [x] Verify AI Browser functionality
    - [x] Run a simple browser subagent test
    - [x] Analyze failure or success
- [x] Verify Localhost Connectivity
    - [x] Attempt to access default Vite port (5173)
    - [x] Diagnose connection issues
- [x] Refine Payment UX (Sidebar/Drawer)
    - [x] Fix "Pay Now" button jumps (PaymentsPage)
    - [x] Standardize payment logic (useStripeCheckout)
    - [x] Align Booking Drawer UI with Quotes style
    - [x] Fix "Calculated at Checkout" text wrapping
    - [x] Update button color to App Blue (Primary)
- [/] Debugging Multi-Tenancy Crash
    - [x] Fix reactivity logic (useAuth + orgId)
    - [x] Fix missing imports (DocumentsPage)
    - [x] Force Backend Schema Update (ArgumentValidationError)
        - [x] Made orgId optional in `convex/schema.ts`
    - [x] Verify Admin pages compatibility
- [-] User Synchronization (Investigation)
    - [x] Create Manual Sync Action (`syncAllUsers`)
    - [x] Create Manual Sync Button (AdminCustomersPage)
    - [x] Revert Manual Sync (Returned to standard Webhook flow per user request)
- [x] Implement Payment Confirmation Logic
    - [x] Create confirmBookingPayment mutation
    - [x] Handle invoice_id redirect in PaymentsPage
    - [x] Handle invoice_id redirect in PaymentsPage
    - [x] Rename button to "Secure Booking"
- [x] UI Refinements
    - [x] Fix "Recent Quotes" font to match Dashboard
    - [x] Standardize "New Quote" button color
    - [x] Rearrange Compliance Page (Urgent top, Templates bottom)
    - [x] Customize KYC Validation Toasts
    - [x] Wire Real Templates & Quick Links
    - [x] Separate View & Track Actions (Shipments)
    - [x] Wire Shipment Analysis Email (Reporting API)
    - [x] Revert Email Confirmation Toast (Simple)
    - [x] Refine Shipment Email UX (Theme Color + Error Feedback)
    - [x] Fix Sidebar User Alignment & Update Quick Actions
    - [x] Document Design System (`design_system.md`)
    - [x] Fix Header Images & Branding
        - [x] Replace "Freightcode.io" with "freightcode.io" (lowercase)
        - [x] Fix Dashboard/Shipments header images (downloaded locally)

# System Architect Inspection: End-to-End Booking Flow
- [x] Analyze Codebase for Flow Logic
    - [x] Identify Payment/Stripe implementation details
    - [x] Identify Email/Notification triggers (Alerts, Emails)
    - [x] Determine "Success" states in DB (Convex)
- [ ] Execute End-to-End Browser Test
    - [x] Generate Quote
    - [x] Select Rate
    - [x] Complete Booking Form
    - [x] Process Payment (Verified Manually by User)
    - [x] Verify UI Success Alert
- [/] Verify System State
    - [ ] Check Admin Dashboard for new booking
    - [ ] Verify "Paid" status
    - [ ] Check Email Confirmation (Audit Logs)

- [/] **Execute MASTER_TEST_PLAN.md**
    - [x] 1. Core User Flows (Guest -> Shipper -> Payment) (Verified via Playwright)
    - [ ] 2. Technical Verification (Mapbox, Email, Admin)
    - [ ] 3. Manual Test Script (User Led)

# KYC Verification Implementation
- [x] Implement KYC Verification Modal
    - [x] Create `kycVerifications` table in [convex/schema.ts](file:///c:/Users/jason/Desktop/marketlive-clone/convex/schema.ts)
    - [x] Create backend logic ([compliance.ts](file:///c:/Users/jason/Desktop/marketlive-clone/convex/compliance.ts), [upload.ts](file:///c:/Users/jason/Desktop/marketlive-clone/convex/upload.ts))
    - [x] Create frontend [ComplianceKycModal](file:///c:/Users/jason/Desktop/marketlive-clone/src/components/compliance/ComplianceKycModal.tsx#17-279) component
    - [x] Integrate into [CompliancePage.tsx](file:///c:/Users/jason/Desktop/marketlive-clone/src/pages/CompliancePage.tsx)
    - [x] Verify Modal functionality (Logic Verified)

# Marketing System (Phase 1: Trust Landing Page)
- [x] Backend: `waitlist` schema table
- [x] Backend: `joinWaitlist` mutation
- [x] Frontend: Corporate Landing Page Design (/access)
- [x] Integration: `/access` route
- [x] Deployment: Push Basic Version to Vercel
- [x] **Hero**: Interactive Visual Quote Map (Mapbox)
    - [x] Create `InteractiveHero` component (Refactored `VisualQuoteInput` to Mapbox)
    - [x] Wire up "Mock" quotes on route selection
- [x] **Trust**: Value Prop Cards & "Wall of Love" placeholder
- [x] **Data**: Capture extra fields (Company Name)
- [-] **Marketing**: Video Diary Features (Skipped by user)
- [x] **Refinement**: Professional Terminology Update (Kept Emojis)
- [x] **Email**: Resend Integration (Welcome Drip)
    - [x] Install `resend` package in Convex
    - [x] Create [convex/emails.ts](file:///c:/Users/jason/Desktop/marketlive-clone/convex/emails.ts) action (sendWelcomeEmail)
    - [x] Create Email Template (HTML)
    - [x] Wire `scheduler.runAfter` in `joinWaitlist`
- [ ] **Product Demos (Live Recordings)**
    - [-] Record `demo_quote_flow_v3` (Home -> Quote -> Invoice) - *Skipped by user request*
    - [ ] Record `demo_tracking_flow` (Shipments Page)
    - [ ] Record `demo_finance_flow` (Payments/Finance Dashboard)
    - [ ] Embed videos in `WaitlistPage.tsx`
- [x] **Documentation**:
    - [x] Create `marketing_plan.md` (Value Prop & "Why Us")
    - [x] Create `app_features.md` (Hidden Gems & Screenshots)

# Internal API System (Client Access)
- [x] Implement API Key System
    - [x] Create `apiKeys` schema table
    - [x] Create [convex/developer.ts](file:///c:/Users/jason/Desktop/marketlive-clone/convex/developer.ts) (generate, list, revoke)
    - [x] Update `ApiDocsPage.tsx` with Management UI

# Admin Portal Expansion (Restructure)
- [x] **Admin Portal Expansion (Restructure)**
    - [x] **Align MediaCardHeader on All Pages**
    - [x] **Create Reference Dashboard Page (TestDashboardPage)**
    - [x] `ShipmentsPage.tsx`
    - [x] `ClientBookingsPage.tsx`
    - [x] `ClientQuotesPage.tsx`
    - [x] `PaymentsPage.tsx`
    - [x] `DocumentsPage.tsx`
    - [x] `ReportsPage.tsx`
    - [x] `CompliancePage.tsx`
    - [x] `AdminCarriersPage.tsx`
    - [x] **Admin Sidebar Refactor**
        - [x] Implement collapsible groups (Overview, Pending, Shipments, Users, Docs, Payments, Waitlist, Audit, Keys, Settings)
        - [x] Update `AdminSidebar.tsx` navigation items
    - [x] **Page Implementation**
        - [x] **Overview**: Dashboard with KPI cards & Quick Actions (`AdminOverviewPage.tsx`) (Implemented as Dashboard)
        - [x] **Approvals**: Table for Quote/Booking high-priority sorting (`AdminApprovalsPage.tsx`)
        - [x] **Payments**: Invoice & Payment tables (Tabs) (`AdminFinancePage.tsx`)
        - [x] **Waitlist**: Table of signups + Invite/Reject actions (`AdminWaitlistPage.tsx`)
        - [x] **Audit**: Logs viewer with filters for suspicious activity (`AdminAuditPage.tsx`)
        - [x] **CRM**: Users/Orgs management + API Key control (`AdminCustomersPage.tsx`)
- [ ] **Routing**
    - [ ] Update `App.tsx` with new Admin sub-routes
- [ ] **Backend**
    - [ ] Verify `admin` queries for new KPI cards
    - [ ] Create `audit` query for logs viewer

# Admin Logic Wiring (SOP Implementation)
## Schema Updates [convex/schema.ts]
- [x] **Organizations**: Add `status` (string: "active" | "suspended" | "terminated") field.
- [x] **Shipments**: Add `riskLevel` (string: "low" | "medium" | "high") and `flaggedBy` (optional string) fields.

## Backend Mutation Implementation
- [x] **Organizations**: `suspendOrganization`, `activateOrganization` (in `convex/organizations.ts`).
- [x] **Shipments**: `flagShipment`, `clearShipmentFlag` (in `convex/shipments.ts`).
- [x] **Bookings**: Ensure `approveBooking`, `rejectBooking` exist and log to `auditLogs` (in `convex/bookings.ts`).

## Frontend Wiring
- [x] **AdminCustomersPage**: Wire "Suspend" button to `suspendOrganization` mutation.
- [x] **AdminShipmentsPage**: Wire "Flag Risk" button to `flagShipment` mutation.
- [x] **AdminApprovalsPage**: Wire "Approve/Reject" buttons to respective mutations for Bookings and Quotes.

# Security Updates
- [x] **Patch React Router XSS Vulnerability**
    - [x] Upgrade `react-router-dom` and `react-router` to 6.30.3
    - [x] Verify vulnerability is resolved with `npm audit`
    - [x] Deploy patch to production

# UX Checklists Implementation
- [x] **Booking Page**: Cargo Readiness Check
- [x] **Shipments Page**: Pre-Pickup Protocol
- [x] **Billing/Finance**: Invoice Approval Checklist

# Subscriptions System (Monetization)
- [/] **Database Schema**: `subscriptions` and `invoices` tables
- [x] **Backend Logic**:
    - [x] `createCheckoutSession` (Stripe) in `billing.ts` (Partial)
- [x] `createCheckoutSession` (Stripe) in `subscriptions.ts` (Refactored to Action)
    - [x] Sync `subscriptionTier` to Clerk Metadata (Organization)
    - [x] Support Personal Account Subscriptions (User Metadata)
    - [x] `handleWebhook` (Stripe)
    - [ ] `getSubscriptionStatus` (Query)
- [x] **Frontend**:
    - [x] Implement `MySubscription` tab in `PaymentsPage.tsx`
    - [x] Wire up `createCheckoutSession`
    - [x] Refine Toast Logic for Subscription Upgrade
    - [x] Feature Gating (HOC/Hooks)
        - [x] Create `useFeature` hook
        - [x] Gate `ShipmentsPage` "New Shipment" (Pro+)
        - [x] Gate `ApiDocsPage` (API Access - Pro+)
        - [x] Gate `CompliancePage` (AI Auto-Flagging - Pro+)
        - [x] Implement High-Density 'SubscriptionCards' UI
    - [x] Gate "Compliance AI" on Compliance Page
    - [x] Gate "Predictive Delay Insights" on Shipments Page
    - [x] Gate "Predictive Delay Insights" on Shipments Page
    - [x] Gate "Custom Reports Builder" on Reports Page

# Usage Limits & Enforcement
- [x] **Schema**: Add `subscriptionTier` to `organizations` table.
- [x] **Backend**: Update `handleSubscriptionChange` to sync to local DB.
- [x] **Enforcement**: Update `upsertShipment` to block >5 shipments/mo for Free tier.
- [x] **UI**: Show usage indicator on Shipments Page.

# Performance & Stability (Optimization)
- [x] **Route-Level Code Splitting**
    - [x] Implement `React.lazy` and `Suspense` for all pages.
    - [x] Create `LoadingSpinner` fallback.
- [x] **Global Side-Effects Cleanup**
    - [x] Move Service Worker registration to `main.tsx`.
    - [x] Disable Service Worker in Dev Mode (Fixes "Failed to fetch")
    - [x] Disable Service Worker in Dev Mode (Fixes "Failed to fetch")
- [x] **Hook Optimization**
    - [x] Memoize `useFeature` hook.

# V1.0 Release
- [/] **Deployment**
    - [x] Fix Build Errors (Convex/Stripe)
    - [x] Secure API Keys (Env Vars)
    - [-] Manual Deploy via Vercel CLI (Blocked/User Skip)
- [ ] **Verification**
    - [ ] Run clearAllData (resetSubscriptions: true)
    - [/] Verify Shipment Creation (No Mock Data)
        - [x] Fixed OrgId Schema Validation (Schema + Mutation)
        - [x] Aligned Quote Object Structure (Deep nesting match)
        - [x] Frontend Quote Mapping Updated
        - [ ] Verify Valid Freightos API Key response
    - [x] Verify KYC Flow (Logic + Playwright Script)
    - [x] Verify DocuSign Return (Overlay Added)
    - [x] **[NEW]** Address Book Feature (Schema + UI)
    - [x] Verify Subscription Upgrades
    - [x] Check Admin Dashboard Data (Verified via CLI `admin:getDashboardStats`)
- [x] **Run Application**

# Marketing & PR Execution (Zero Budget)
- [x] **Phase 0: Setup & Strategy**
    - [x] **Competitor Analysis: Mydello** (Analysis in `mydello_analysis.rtf`)
    - [x] Messaging Pack (Positioning, Headlines)
    - [x] Topic Clusters (Compliance, Risk, Ops)
    - [x] Content Calendar (30 Days)
    - [x] Master Tracker Setup
- [x] **Phase 1: Content Production (Week 1)**
    - [x] Blog: "Hidden Cost of Volatility" (SEO)
    - [x] Lead Magnet: Compliance Audit PDF Guide
    - [x] Social: LinkedIn (10 posts) & X (15 posts) Packs
    - [x] Video script: "Risk Audit" Demo
    - [x] Newsletter: Week 1 Draft
- [x] **Phase 2: Outreach & PR**
    - [x] Media List (40 Targeted Editors/Podcasts)
    - [x] Pitch Templates (Journalist, Podcast, Partner)
    - [x] Press Release (Beta Launch)
- [x] **Phase 3: Community Launch**
    - [x] Community Structure (rules, channels)
    - [x] SMB FAQ Asset
- [ ] **Execution & Monitoring**
    - [ ] Send First Pitch Batch
    - [ ] Publish First Blog
    - [ ] Launch Community

# Phase 1: Freightcode Execution - UI Refinements
- [x] **Global Rebrand (MarketLive -> freightcode)**
    - [x] Create backup of Vite landing page
    - [x] Rename "MarketLive" string in documentation
    - [x] Verify `AppSidebar` and `Navbar` branding
    - [x] **External Services Updated**: Clerk, Convex, Stripe app names changed to "freightcode"
    - [x] **Official Domain**: `freightcode.co.uk` | Email: `info@freightcode.co.uk`
    - [x] Initialize Next.js Marketing Site (`/marketing-site`)
    - [ ] Deploy landing page + waitlist to live domain (freightcode.co.uk)

- [x] **Video Demo Implementation**
    - [x] Update `landing_page_wireframe.md` with video sections
    - [x] Create `video_production_spec.md` with recording guidelines
    - [x] Create `VideoEmbed.tsx` component (click-to-play)
    - [x] Build landing page with video placeholders
    - [ ] Record Primary Product Walkthrough (60-90s) — USER
    - [ ] Record GeoRisk Navigator™ Deep Dive (2-3 min) — USER
    - [ ] Upload to YouTube and add video IDs
    - [x] Refine GeoRisk UI: Implement Locked State for Basic View

- [-] **SidebarRefactor (Emoji + High Density)**
    - [-] Update `AppSidebar.tsx` to use Emoji icon strings
    - [-] Modify `nav-main.tsx` type and render logic
    - [-] Modify `nav-documents.tsx` type and render logic
    - [-] Modify `nav-secondary.tsx` type and render logic
    - [-] Apply `text-sm` / `text-xs` sizing rules
    - [-] Update sidebar theme to `bg-slate-950` and `border-slate-800`

# New Dashboard Test Page
- [x] Create `src/pages/DashboardTestPage.tsx`
    - [x] Incorporate GeoRisk styling (Dark mode)
    - [x] Incorporate Dashboard content (Widgets, Table)
- [x] Register Route in `App.tsx`
