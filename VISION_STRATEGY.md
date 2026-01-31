# VISION: The FreightCode Digital Freight Platform

This document defines the strategic vision, core philosophy, and technical requirements for the FreightCode platform.

---

## 1. Project Objective

To build a **Top-Tier Digital Freight Forwarding corporate professional Platform** that combines modern technology (Real-time data, Instant Pricing, Risk Intelligence) with trusted usability (Simple, Intuitive UI).

**Primary Goal:** Create a platform that competes with industry leaders (Flexport, Forto) while maintaining operational simplicity for logistics teams.

---

## 2. Core Philosophy

**"Complexity in the Back, Simplicity in the Front."**

- **The Backend** must be powerful: Real-time APIs, geospatial queries, risk assessment, pricing algorithms.
- **The Frontend** must be familiar: Clean, intuitive UI that logistics operators understand immediately.

---

## 3. Required Capabilities (The "Top Tier" Standard)

To compete with market leaders, the application must deliver these four pillars:

### Pillar A: Visibility (The "Control Tower")
**Requirement:** Users must see their entire supply chain at a glance.

**Implementation:**
- Global **Dashboard** summarizing shipment states (In Transit, Delivered)
- **Real-Time Interactive Map** showing precise cargo location
- **Live Metrics** that update without page reloads

### Pillar B: Automation (The "Instant" Experience)
**Requirement:** Eliminate the "Email & Wait" cycle for pricing.

**Implementation:**
- **Instant Quoting Engine**: Origin/Dest/Weight → Binding price in <2 seconds
- **One-Click Booking**: Convert Quote to Booking seamlessly
- **Auto-Documentation**: Pre-fill customs forms from shipment data

### Pillar C: Risk Intelligence (The "GeoRisk Navigator™")
**Requirement:** Proactive risk assessment for every route.

**Implementation:**
- **Multi-Factor Risk Scoring**: Geopolitical zones, sanctions, weather
- **Real-Time Data**: OpenSanctions, OpenWeather, GDELT integration
- **Tiered Access**: Free (basic zone risk), Pro (full assessment)
- **Advisory System**: Actionable recommendations based on risk level

### Pillar D: Compliance (The "Digital Filing Cabinet")
**Requirement:** Centralize all trade documentation to prevent customs delays.

**Implementation:**
- Context-aware **Tasks List** (e.g., "Upload Invoice for Shipment A")
- Secure **File Uploads** connected directly to shipment records
- **KYC Verification**: Identity document collection and storage

### Pillar E: Security & Role Management
**Requirement:** Strict separation between Client data and Admin control.

**Implementation:**
- **Clerk Authentication** for secure identity management
- **Role-Based Access**: Admins see all; Clients see only their data
- **Organization Multi-Tenancy**: Isolated data per organization

---

## 4. Technical Architecture

### Frontend Stack
- **App**: React 19 + TypeScript + Vite
- **Marketing**: Next.js 16 + React 19
- **Styling**: TailwindCSS 4 + Shadcn UI
- **Maps**: Mapbox GL JS

### Backend Stack
- **Database**: Convex (Real-time serverless)
- **Auth**: Clerk (Multi-tenant)
- **Payments**: Stripe (Subscriptions)
- **Email**: Resend API

### External APIs
- **Risk Assessment**: OpenSanctions, OpenWeather
- **Geocoding**: Mapbox Geocoding API
- **Maps**: Mapbox GL JS
- **Routing**: OpenRouteService

### Architecture Principles
1. **Real-Time First**: Use Convex subscriptions for live updates
2. **Serverless**: No server management, scale automatically
3. **API-Driven**: External data sources for accuracy
4. **Type-Safe**: TypeScript everywhere

---

## 5. Definition of Success

The project is complete when a user can perform the following **"Golden Path"** without error:

1. **Log In** via Clerk
2. **Request a Quote** for 500kg from Shanghai to LA and get a price
3. **Assess Risk** using GeoRisk Navigator™ for the route
4. **Book** that quote instantly
5. **Track** the resulting shipment on a Map
6. **Upload** a Commercial Invoice to clear customs
7. **Receive** email notifications on status changes
8. **Log Out** knowing their supply chain is under control

---

## 6. Competitive Differentiation

### vs. Flexport
- **Advantage**: Lower cost, faster implementation, modern tech stack
- **Feature Parity**: Real-time tracking, instant quotes, compliance tools
- **Unique**: GeoRisk Navigator™ for proactive risk management

### vs. Forto
- **Advantage**: Better UX, more transparent pricing
- **Feature Parity**: Digital freight forwarding, booking automation
- **Unique**: Freemium model with generous free tier

### vs. Traditional Forwarders
- **Advantage**: 10x faster quotes, real-time visibility, self-service
- **Disruption**: Eliminate phone calls and email chains
- **Unique**: AI-powered risk assessment and route optimization

---

## 7. Monetization Strategy

### Free Tier
- Up to 5 shipments/month
- Basic zone-based risk assessment
- Standard tracking and quotes
- Email support

### Pro Tier ($99/month)
- Unlimited shipments
- Full GeoRisk Navigator™ (sanctions + weather)
- Priority support
- Advanced analytics
- API access

### Enterprise Tier (Custom)
- Dedicated account manager
- Custom integrations
- SLA guarantees
- White-label options

---

## 8. Admin Portal Strategy (The "God Mode")

A full **Admin Side** (`/admin`) is required, distinct from the User Client.

### Requirements:
- **User Management**: View/Edit/Ban users
- **Shipment Override**: Edit any shipment for any client
- **System Config**: Manage API keys and global settings
- **Analytics**: Global revenue and volume tracking
- **Approvals**: KYC verification, payment disputes

### Architecture:
- Protected by `role: admin` check
- Distinct layout (Dark sidebar) to prevent confusion with Client App
- Separate routing (`/admin/*`)

---

## 9. Current Status (v1.0.0)

### ✅ Completed
- Core logistics features (Quotes, Bookings, Shipments)
- Stripe subscriptions with feature gating
- GeoRisk Navigator™ backend + demo
- Next.js marketing site
- Admin portal foundation
- KYC compliance system

### 🚧 In Progress
- GeoRisk Navigator™ marketing video (MP4 conversion)
- Advanced analytics dashboard
- Client portal enhancements

### 📋 Planned
- Mobile PWA
- Public API
- AI Assistant
- ERP integrations

---

## 10. Success Metrics

### Product Metrics
- **Time to Quote**: <2 seconds (target)
- **Booking Conversion**: >30% (quotes → bookings)
- **User Retention**: >70% monthly active users
- **NPS Score**: >50

### Business Metrics
- **Free → Pro Conversion**: >10%
- **Monthly Recurring Revenue**: $10k+ by Q2 2026
- **Customer Acquisition Cost**: <$200
- **Lifetime Value**: >$2,000

### Technical Metrics
- **Uptime**: >99.9%
- **API Response Time**: <200ms (p95)
- **Build Time**: <30 seconds
- **Test Coverage**: >80%
