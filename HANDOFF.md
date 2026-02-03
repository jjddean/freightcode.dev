# Handoff Instructions for Development Team

**Objective:** Implement the pivot from a freight forwarder platform to a digital freight platform for SMB shippers. Base this on the [BEST_PRACTICES_SAAS_FREIGHT_2025_2026.md](./BEST_PRACTICES_SAAS_FREIGHT_2025_2026.md).

> [!IMPORTANT]
> **Important Design Note:**
> 🛑 **Preserve the current app UI structure and design principles.**
> All new pages, components, and admin tools must visually and structurally match the existing design language (layouts, color system, form flows, modals). The UI is considered sacred—no major visual rewrites or redesigns. Seamless integration over reinvention.

## Core Tasks

### 1. Refactor UX and Flows for Shippers
*   **Public Quote Request & Booking:** Implement the self-serve flow for guest/shipper quotes and seamless booking.
*   **Self-Serve Tools:** Enable document upload, quote history tracking, and trigger-based payments.
*   **User Onboarding:** Implement the "first value moment" with dummy data and guided steps.

### 2. Admin Console Upgrade
*   **Organization & Teams:** Add membership controls and role-based permissions (Org/Team levels).
*   **Escalation Inbox:** A dedicated view for handling stuck quotes or booking exceptions.
*   **Risk & Compliance Panel:** UI for HS code verification, sanctions screening, and geo-risk logs.
*   **Audit Trails:** Quote override logs and full audit trail UI.

### 3. Cost-Saving Integrations
*   **Mock API Option:** Add a mock rate quote option to test flows without incurring API costs.
*   **AI Integration:** Plug in AI tools (e.g., GPT-4 mini) where specified for risk scoring or assistance.

### 4. Infrastructure (Unchanged)
*   **Stack:** Keep Vercel, Convex, Clerk, and Stripe.
*   **SaaS-Only Model:** The platform provides the *digital tools* (quoting, booking, tracking) but does **not** manage physical logistics execution. We do not act as the forwarder/carrier.

## Reference
See [BEST_PRACTICES_SAAS_FREIGHT_2025_2026.md](./BEST_PRACTICES_SAAS_FREIGHT_2025_2026.md) for the detailed gap analysis, implementation phases, admin role mapping, and cost breakdown.
