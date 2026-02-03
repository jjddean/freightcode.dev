# Pivot Plan for FreightCode.dev: From Forwarder Tool to Shipper‑Focused Digital Freight Platform

## 1. Analysis of the Current Application vs. Required MVP

### Existing Capabilities (based on code & DEV_DIARY.md)

*   **Core logistics flows:**
    The app already supports a full quote‑to‑booking workflow for freight. Phase 2 of the development diary confirms that a Quotes system (with PDF generation) and an end‑to‑end booking wizard have been implemented. Shipments are tracked via a ShipmentsPage with a live Mapbox vessel map and the system sends email notifications for shipment updates.

*   **Compliance and security:**
    A KYC/Compliance page allows document uploads for regulatory checks. Phase 6 introduced GeoRisk Navigator™, which integrates OpenSanctions for sanctions screening and OpenWeather for weather disruption risk; it calculates a risk score and provides a risk advisory. These are advanced compliance capabilities already aligned with the report’s emphasis on sanctions screening and risk alerts.

*   **Administration and monetization:**
    The platform has a dedicated Admin portal for approvals, finance and audit. Stripe integration supports recurring billing and subscription tiers, including usage limits for free vs. Pro plans and add‑on services (e.g., customs brokerage and insurance). There is a Contracts engine that prioritises negotiated carrier rates.

*   **Infrastructure:**
    The app uses React 19 (Vite) for the portal and Next.js for the marketing site, with TailwindCSS and Shadcn UI. Convex provides a real‑time database/back‑end, Clerk handles authentication, and Stripe handles payments. Deployment runs on Vercel and Convex Cloud.

*   **Recent additions:**
    A public quoting API (`createPublicQuote`) has been added but the guest quote widget for the marketing site was reverted pending a redesign. A GeoRisk demo and marketing video were launched on 30 Jan 2026. Upcoming phases list plans for Advanced Analytics, a client‑portal enhancement (self‑service quote‑to‑booking flow, automated status emails, client‑facing document uploads), and a mobile PWA.

### Gaps Compared with the Report’s MVP Requirements

According to the report on 2025–2026 best practices for SMB digital freight platforms, the MVP should provide the following for shippers/businesses:

*   **Self‑serve quote and booking across modes (ocean & air) with instant pricing and margin rules**, plus the ability to book and pay online. Current app lacks a finished guest‑facing quote widget on the marketing site and doesn’t expose air‑freight or multi‑modal quotes (only seeded ocean contracts).

*   **Real‑time tracking with proactive alerts and a “control‑tower” dashboard.** Tracking exists for shipments booked through the system, but needs adaptation for shipper‑facing UI (e.g., simplified dashboard and live ETA/predictive delay alerts).

*   **Automated document management and compliance:** Sanctions screening and risk scoring exist, but there is no HS‑code lookup, duty/VAT calculation or AI document extraction (suggested in the report and hinted in app_features.md). A shippers’ platform should help classify goods and calculate landed costs.

*   **Payments & billing:** Stripe is integrated, but the shipper flow should support paying per shipment (transaction fee) in addition to subscriptions (free/basic/pro).

*   **Onboarding & first‑value moments:** The platform needs onboarding flows for new shippers – dummy shipments, interactive tutorials, and a quick first quote – to meet the report’s guidance on user adoption.

*   **Human‑in‑the‑loop support:** While there is an admin portal and notifications, there is no explicit chat/support channel in the client UI. A contact button or integrated help (e.g., Intercom) is needed to balance automation with human assistance, as the report recommends.

---

## 2. Minimal Implementation Plan (MVP for Shippers)

The goal is to repurpose the current forwarder‑oriented platform into a shipper/business‑facing digital freight forwarder while reusing as much of the existing codebase as possible. The following tasks should be prioritised to deliver a Minimal Viable Product that aligns with the report’s core features.

### 2.1 Self‑Serve Quoting & Booking

*   **Finish the guest quote widget**
    *   Redesign and deploy the previously reverted front‑end widget on the marketing site.
    *   Allow unregistered users to enter origin/destination, cargo details (weight, volume, Incoterms) and select mode (FCL, LCL, air).
    *   Call the existing `createPublicQuote` mutation to fetch live rates from the contracts engine; display multiple options sorted by price/speed (e.g., economy vs. priority).
    *   Include optional customs brokerage and insurance upsells in the quote, using the current add‑on modal.

*   **Implement multi‑modal air quotes**
    *   Extend the contracts data model to store air freight rates (seed with major lanes).
    *   Update the quote engine to handle different modes and charge appropriate surcharges (fuel, security).

*   **Allow booking and payment as a guest or new account**
    *   After showing quote results, prompt the shipper to sign up or proceed as a guest; create a provisional booking record.
    *   Use the existing Stripe checkout component to collect payment (per‑shipment fee plus optional services).
    *   On payment success, create a shipment record linked to the user and send confirmation emails. Include a summary page with booking reference and track‑&‑trace link.

*   **Simplify UI for shippers**
    *   Create a Shipper Dashboard page with a clear overview of active shipments, quotes, invoices and support tickets. This can reuse the existing `DashboardPage` but hide forwarder‑specific details.
    *   Add a “New Shipment” button that opens the multi‑step booking wizard; this wizard can reuse the existing booking flow but with simplified language (e.g., “Pickup from supplier” instead of internal jargon).

### 2.2 Real‑Time Tracking & Alerts

*   **Port & flight milestone tracking:**
    Ensure that tracking can ingest events from carriers or third‑party APIs (e.g., vessel AIS data and airline schedules). Use the existing Mapbox LiveVesselMap for sea; for air, integrate an aviation API for flight status.

*   **Proactive notifications:**
    Leverage the existing notification system (Resend email integration) to send status updates to shippers (“Departed Shanghai”, “Arrived at Port LA”) and exception alerts (delays, customs holds).

*   **Predictive delay risk:**
    Use the GeoRisk engine to show a risk score on each shipment and warn the shipper if a high‑risk route is selected. Provide suggestions for alternative routes or carriers if risk is high. Display this in the tracking dashboard and in the quote results.

### 2.3 Document Management & Compliance

*   **Landed cost calculator:**
    Integrate a duty & tax API (e.g., Avalara or Descartes) to compute duties, VAT and insurance costs for each commodity. Expose this in the quote summary so shippers know the total landed cost, aligning with the hidden gem described in app_features.md.

*   **HS‑code lookup & auto‑classification:**
    Provide a searchable HS code library and suggest codes based on commodity description. Use AI/ML or a third‑party classification API for auto‑suggest.

*   **Document upload & e‑signatures:**
    Simplify the existing document portal for shippers to upload commercial invoices, packing lists and certificates. Use the DocuSign integration from the current codebase to handle e‑signatures. Provide a checklist of required documents by lane (e.g., invoice, certificate of origin).

*   **Automated compliance checks:**
    Build workflows that call OpenSanctions and other denied‑party lists for each new customer or supplier, flagging high‑risk parties automatically. Provide clear warnings and require manual override by an admin for high‑risk bookings.

### 2.4 Payments & Subscriptions

*   **Pay‑per‑shipment pricing:**
    Support one‑off payments for each booking with a transparent breakdown of freight, duties, insurance and platform fee. This aligns with common commission models (5–15 % margin) noted in the report.

*   **Subscription tiers for shippers:**
    Retain the existing subscription system but tailor tiers to shippers (e.g., Free up to 5 shipments/month, Pro with unlimited shipments and API access). Add an Organization plan for teams.

*   **Invoicing & receipts:**
    Generate downloadable receipts and invoices for each shipment in PDF. Provide a billing history page in the dashboard.

### 2.5 Onboarding & Support

*   **Guided onboarding:**
    Upon sign‑up, display a multi‑step tutorial (e.g., a modal with 3–4 slides) explaining how to get a quote, book a shipment and track it. Offer a sample shipment in the dashboard to illustrate what tracking looks like.

*   **Dummy data:**
    Provide a “try it now” demo with pre‑populated origin/destination and cargo to show an instant quote. Delete demo data after the user signs up.

*   **Integrated support:**
    Add a chat widget (e.g., Intercom or a simple contact form) to let shippers ask questions or request human assistance. This ensures a human‑in‑the‑loop, complying with the report’s recommendation.

### 2.6 Minimal Technical Adjustments

*   **Refactor role‑based access:** Create a dedicated shipper role with access to the simplified dashboard and quoting features, separate from forwarder/admin roles.
*   **Enhance API security:** Review and harden the public quoting API to prevent misuse (rate limiting, API keys).
*   **Testing & launch:** Perform end‑to‑end testing for the new shipper flow (quote → sign‑up → booking → payment → tracking). Launch to a small group of pilot customers before wider release.

---

## 3. Future Upgrades (Phase 2 & Beyond)

*   **Advanced analytics & dashboards:** Provide a reporting suite with dashboards showing shipment history, cost breakdowns, delays, carrier performance and carbon emissions (use carbon calculators). Offer exportable CSV/PDF reports and weekly summaries. Add predictive analytics for demand forecasting and lane optimization.

*   **AI assistant & chatbots:** Integrate an AI‑powered chat assistant to answer common freight questions, suggest optimal routes, and help fill forms. This aligns with the report’s trend of AI copilots for logistics. Use large‑language‑model APIs with safeguards.

*   **Integrated trade finance:** Offer embedded financing (net‑30 or net‑60 terms) and invoice factoring through partnerships, as described in the report’s discussion of embedded finance. Provide cargo insurance quotes via API and allow customers to buy coverage with one click.

*   **ESG and carbon tracking:** Implement CO₂ emission calculators per shipment (using the Global Logistics Emissions Council methodology). Display emissions to customers and offer offset options (partner with carbon offset providers). Show green route suggestions where possible.

*   **Marketplace & network effects:** Develop a marketplace module to match shippers with multiple forwarders, enabling rate shopping and network effects. Build referral programs and user invitations to stimulate growth, following the report’s growth loops and viral sharing suggestions.

*   **Multimodal expansion & carrier integration:** Expand to trucking and rail quotes (via APIs like SMC³ or truckload digital brokers). Integrate directly with major carriers for automated booking confirmations and status updates. Add EDI/API translation layers to support carriers lacking modern APIs.

*   **PWA & mobile apps:** Build a Progressive Web App and eventually native mobile apps to give users real‑time control on the go, as indicated in the dev diary’s Phase 9 plan.

*   **Customs & HS code intelligence:** Develop AI models for automatic HS code assignment using machine learning on product descriptions. Integrate with government data to pre‑fill customs forms and check for restricted goods.

*   **IoT & sensor integration:** Provide optional smart tags or integrate with IoT trackers for high‑value shipments. Display temperature, humidity, or shock alerts in the tracking dashboard.

*   **Blockchain & eB/L:** Explore integration with electronic bills of lading (eB/L) platforms to digitize handover documents and reduce fraud, aligning with emerging RegTech trends noted in the report.

---

## 4. Running & Launching Costs (High‑Level Estimate)

| Component | Pricing Model / Estimated Cost | Notes |
| :--- | :--- | :--- |
| **Vercel (App & Marketing)** | Free for small projects; Pro plans start around USD 20/month per seat. The current deployment fits within Vercel Hobby/Pro; cost remains the same after pivot. | Hosting for Next.js and Vite app; dynamic SSR may require Pro plan. |
| **Convex Cloud** | Free tier includes 1 GB data and ~50k writes/month; paid plans scale with usage (~USD 10–50 per additional GB). Existing use likely stays within lower tiers; pivoting to shippers adds read traffic but not huge writes. | |
| **Clerk Authentication** | Free for <10k monthly active users; Pro plans start at ~USD 25/month. Pivot doesn’t materially change cost unless user count grows significantly. | |
| **Stripe** | 2.9 % + USD 0.30 per card transaction (standard). Additional 1 % for international cards and currency conversion. Subscription management features are free; transaction fees apply to per‑shipment payments. | |
| **Mapbox** | Free up to 50k map loads/month; USD 0.50 per additional 1k loads. Live vessel map usage could incur small charges. | |
| **Resend (Email API)** | First 3k emails/month free; $0.001 per email afterwards. Shipment notifications and onboarding emails should fit within free tier initially. | |
| **OpenSanctions** | Free tier covers basic denied‑party lists; premium plans (if used) start around USD 99/month. | |
| **OpenWeather API** | Free up to 1k calls/day; premium from USD 10/month. GeoRisk engine uses minimal calls; cost remains negligible. | |
| **Duty & HS code APIs** | New services (e.g., Avalara, Descartes) typically start around USD 100–300/month, depending on usage. These costs apply in Phase 2 when implementing landed‑cost calculation. | |
| **Chat/Support Widget** | Intercom or equivalent starts ~USD 50–99/month; optional for MVP. | |
| **Development & Maintenance** | Developer time is the primary cost. The pivot leverages existing code, so incremental engineering is moderate. | |

### Conclusion

The current FreightCode.dev application already contains many of the building blocks needed for a shipper‑facing digital freight platform, including quoting, booking, tracking, compliance checks and subscription monetization. However, to fully pivot, the product must finish and polish the guest‑facing quote and booking flow, simplify the UI for shippers, and add tools for landed cost calculation, HS code lookups, and human‑accessible support. Once those minimal requirements are met, the platform can progressively introduce advanced features—analytics, AI assistance, embedded finance and sustainability metrics—that align with industry trends and the 2025–2026 best‑practice report.
