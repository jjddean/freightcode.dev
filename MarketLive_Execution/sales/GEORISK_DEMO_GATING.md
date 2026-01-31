# GeoRisk Navigator™ Demo Gating & Access Control

## Overview
This document defines the access control strategy for GeoRisk Navigator™ demo, ensuring prospects see a professional, sales-ready experience while internal teams have full debugging capabilities.

---

## Access Tiers

### Tier 1: Public (Marketing Site)
**URL:** `https://freightcode.com` (landing page)  
**Audience:** Anonymous visitors, prospects researching

**What They See:**
- GeoRisk Navigator™ section with description
- 1 static screenshot showing the UI
- 60-90 second silent video (screen capture walkthrough)
- CTA button: "Request Access to Interactive Demo"

**What They DON'T See:**
- Live interactive demo
- Backend status
- API integration details
- Mock data disclaimers

**Implementation:**
```tsx
// marketing-site/src/components/GeoRiskSection.tsx
<section id="georisk">
  <h2>GeoRisk Navigator™</h2>
  <p>Route-level geopolitical and compliance risk indicators</p>
  
  {/* Static screenshot */}
  <img src="/images/georisk-screenshot.png" alt="GeoRisk Navigator" />
  
  {/* Video walkthrough */}
  <video src="/videos/georisk-walkthrough.mp4" controls />
  
  {/* CTA */}
  <Button href="/request-access?feature=georisk">
    Request Access to Interactive Demo
  </Button>
</section>
```

---

### Tier 2: Gated Demo (Prospect Access)
**URL:** `https://app.freightcode.com/georisk-demo` (access-controlled)  
**Audience:** Qualified prospects, sales leads, trial users

**Access Method:**
1. Prospect fills out "Request Access" form
2. Sales team manually enables access (adds email to allowlist)
3. Prospect receives email with demo link + 7-day expiration

**What They See:**
- Full interactive demo with 4 scenarios
- Clean, professional UI (no dev info)
- Subtle banner: "Preview scenario based on representative trade lane conditions"
- Footer note: "Risk indicators shown are illustrative and updated periodically"

**What They DON'T See:**
- Backend status panel
- "Mock data" language
- API vendor names
- Dev mode toggles

**Implementation:**
```tsx
// src/pages/GeoRiskDemoPage.tsx
const IS_DEV_MODE = import.meta.env.DEV; // false in production

// Only show dev panel if IS_DEV_MODE === true
{IS_DEV_MODE && (
  <div className="dev-panel">
    {/* Internal debug info */}
  </div>
)}
```

**Access Control:**
```typescript
// convex/georisk.ts
export const checkDemoAccess = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    // Check if email is in allowlist
    const access = await ctx.db
      .query("demoAccess")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    
    if (!access) return { allowed: false };
    if (access.expiresAt < Date.now()) return { allowed: false, expired: true };
    
    return { allowed: true };
  }
});
```

---

### Tier 3: Internal/Dev Demo
**URL:** `http://localhost:5173/georisk-demo` (dev environment)  
**Audience:** Engineering team, product team, QA

**What They See:**
- Everything from Tier 2
- **PLUS:** Dev mode panel with:
  - Backend deployment status
  - API integration status
  - Mock vs live data toggle
  - Debug logs

**Implementation:**
```tsx
// Automatically enabled in dev environment
const IS_DEV_MODE = import.meta.env.DEV; // true in localhost

{IS_DEV_MODE && (
  <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
    <h3>🔧 DEV MODE ONLY</h3>
    <ul>
      <li>✅ Convex actions deployed</li>
      <li>✅ OpenSanctions integration ready</li>
      <li>✅ OpenWeather integration ready</li>
      <li>⏸️ Real API calls paused (using mock data)</li>
    </ul>
  </div>
)}
```

---

## Request Access Flow

### Step 1: Landing Page CTA
**Location:** `https://freightcode.com#georisk`  
**Button:** "Request Access to Interactive Demo"  
**Action:** Redirects to `/request-access?feature=georisk`

---

### Step 2: Request Access Form
**URL:** `https://freightcode.com/request-access`  
**Fields:**
- Full Name (required)
- Work Email (required)
- Company (required)
- Job Title (optional)
- Primary Trade Lanes (optional, textarea)
- How did you hear about us? (optional, dropdown)

**Submit Action:**
1. Save to `demoRequests` table in Convex
2. Send notification to sales team (Slack/Email)
3. Show confirmation: "Thank you! Our team will review your request and send access within 24 hours."

**Implementation:**
```typescript
// convex/demo.ts
export const requestDemoAccess = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    company: v.string(),
    jobTitle: v.optional(v.string()),
    tradeLanes: v.optional(v.string()),
    source: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Save request
    await ctx.db.insert("demoRequests", {
      ...args,
      feature: "georisk",
      status: "pending",
      createdAt: Date.now()
    });
    
    // Notify sales team (via Slack webhook or email)
    await ctx.scheduler.runAfter(0, internal.notifications.notifySales, {
      type: "demo_request",
      email: args.email,
      company: args.company
    });
  }
});
```

---

### Step 3: Sales Team Review
**Location:** Admin panel (`/admin/demo-requests`)  
**Actions:**
- View all pending requests
- Approve/Reject with notes
- Set expiration (default: 7 days)

**Approval Flow:**
```typescript
// convex/admin.ts
export const approveDemoAccess = mutation({
  args: {
    requestId: v.id("demoRequests"),
    expirationDays: v.number() // default: 7
  },
  handler: async (ctx, { requestId, expirationDays }) => {
    const request = await ctx.db.get(requestId);
    if (!request) throw new Error("Request not found");
    
    // Create access record
    await ctx.db.insert("demoAccess", {
      email: request.email,
      feature: "georisk",
      grantedAt: Date.now(),
      expiresAt: Date.now() + (expirationDays * 24 * 60 * 60 * 1000)
    });
    
    // Update request status
    await ctx.db.patch(requestId, { status: "approved" });
    
    // Send email with demo link
    await ctx.scheduler.runAfter(0, internal.notifications.sendDemoAccess, {
      email: request.email,
      name: request.name,
      demoUrl: `https://app.freightcode.com/georisk-demo?email=${request.email}`
    });
  }
});
```

---

### Step 4: Prospect Receives Access
**Email Template:**
```
Subject: Your GeoRisk Navigator™ Demo Access

Hi [Name],

Thanks for your interest in GeoRisk Navigator™!

Your interactive demo access is now active. Click the link below to explore:

[Access Demo] (https://app.freightcode.com/georisk-demo?email=[email])

This link is valid for 7 days. If you have questions or want to schedule a walkthrough with our team, reply to this email.

Best,
FreightCode Team
```

---

## URL Structure

### Public URLs (No Auth Required)
- `https://freightcode.com` → Landing page
- `https://freightcode.com#georisk` → GeoRisk section
- `https://freightcode.com/request-access` → Request form

### Gated URLs (Auth Required)
- `https://app.freightcode.com/georisk-demo` → Interactive demo (email verification)

### Internal URLs (Dev Only)
- `http://localhost:5173/georisk-demo` → Dev demo with debug panel

---

## Access Control Implementation

### Frontend Protection
```tsx
// src/pages/GeoRiskDemoPage.tsx
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function GeoRiskDemoPage() {
  const email = new URLSearchParams(window.location.search).get("email");
  const access = useQuery(api.georisk.checkDemoAccess, { email: email || "" });
  
  if (!access?.allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1>Access Required</h1>
          <p>Request access to view this demo.</p>
          <Button href="/request-access?feature=georisk">
            Request Access
          </Button>
        </div>
      </div>
    );
  }
  
  // Show demo
  return <GeoRiskDemo />;
}
```

---

## Sales Team Workflow

### When Prospect Requests Access
1. **Review Request** (within 24 hours)
   - Check company legitimacy (LinkedIn, website)
   - Assess fit (industry, company size, trade lanes)
   
2. **Approve or Reject**
   - **Approve:** Send demo link + schedule follow-up call
   - **Reject:** Send polite decline + offer to stay in touch

3. **Follow-Up Schedule**
   - Day 1: Send demo access email
   - Day 3: Check-in email ("Have you had a chance to explore?")
   - Day 7: Final reminder before expiration
   - Day 8: Access expires (can extend if needed)

---

## Metrics to Track

### Demo Request Metrics
- Requests per week
- Approval rate
- Time to approval (target: <24 hours)
- Source attribution (how they heard about us)

### Demo Usage Metrics
- Demo access rate (approved → actually used)
- Time spent in demo
- Scenarios viewed
- Conversion to trial/paid (demo → signup)

---

## When to Extend Access

**Extend to 14 days if:**
- Prospect is from a Fortune 500 company
- Prospect requests technical deep-dive
- Prospect introduces compliance team

**Extend to 30 days if:**
- Active enterprise deal in progress
- Pilot/POC agreement signed

---

## Security Considerations

### Email Verification
- Use email as access token (simple, no password required)
- Validate email format
- Check for disposable email domains (block)

### Rate Limiting
- Max 3 demo requests per email per month
- Max 100 demo requests per IP per day (prevent scraping)

### Expiration
- Default: 7 days
- Auto-revoke after expiration
- Prospect can request extension via sales team

---

## Next Steps

1. **Implement Access Control**
   - Add `demoAccess` and `demoRequests` tables to Convex schema
   - Build request form on marketing site
   - Add access check to demo page

2. **Build Admin Panel**
   - Create `/admin/demo-requests` page
   - Add approve/reject actions
   - Add usage analytics

3. **Set Up Notifications**
   - Slack webhook for new requests
   - Email template for access grants
   - Reminder emails for expiring access

4. **Track Metrics**
   - Add analytics to demo page
   - Track scenario views
   - Measure time spent

---

## Quick Reference

| Audience | URL | Access Method | What They See |
|----------|-----|---------------|---------------|
| Public | `freightcode.com#georisk` | None | Static screenshot + video |
| Prospects | `app.freightcode.com/georisk-demo` | Email verification | Interactive demo (clean) |
| Internal | `localhost:5173/georisk-demo` | Dev environment | Interactive demo + debug panel |

---

**This is your gating strategy. Implement it before going live.**
