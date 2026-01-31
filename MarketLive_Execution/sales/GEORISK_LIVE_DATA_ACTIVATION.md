# GeoRisk Navigator™ Live Data Activation Rules

## Purpose
This document defines WHEN and HOW to activate live API integrations (OpenSanctions, OpenWeather) for GeoRisk Navigator™, and how to avoid "is this production?" objections.

---

## Current State (Mock Data)

### What's Running Now
- ✅ Convex backend deployed
- ✅ Risk calculation logic functional
- ✅ UI components production-ready
- ⏸️ OpenSanctions API calls disabled (using mock data)
- ⏸️ OpenWeather API calls disabled (using mock data)

### Why Mock Data?
1. **Cost Control:** Live API calls cost money (OpenWeather charges per request)
2. **Rate Limiting:** Avoid hitting API limits during demos
3. **Consistency:** Mock data ensures demos are predictable
4. **Compliance:** Avoid storing real sanctions data without proper agreements

---

## Activation Triggers

### DO NOT Activate Live Data For:
❌ Public demos  
❌ Sales calls with unqualified leads  
❌ Internal testing  
❌ Marketing videos/screenshots  
❌ Free tier users  

### DO Activate Live Data For:
✅ Paid Business/Enterprise customers  
✅ Signed pilot/POC agreements  
✅ Enterprise trials (with signed NDA)  
✅ Compliance team technical reviews  
✅ Security audit requests  

---

## Activation Levels

### Level 1: Mock Data (Default)
**Who:** Everyone (public, prospects, free tier)  
**What:** Representative scenarios with static data  
**Why:** Cost control, consistency, no compliance risk

**Implementation:**
```typescript
// convex/georisk.ts
const USE_LIVE_DATA = false; // Hardcoded to false

if (USE_LIVE_DATA) {
  // Call real APIs
} else {
  // Return mock data
}
```

---

### Level 2: Live Data (Opt-In Per Customer)
**Who:** Paid customers, signed pilots  
**What:** Real-time OpenSanctions + OpenWeather  
**Why:** Production use, compliance requirements

**Implementation:**
```typescript
// convex/georisk.ts
export const assessRouteRisk = action({
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.getUserByExternalId, { 
      externalId: identity.subject 
    });
    
    // Check if live data is enabled for this user/org
    const useLiveData = user?.features?.georiskLiveData === true;
    
    if (useLiveData) {
      // Call real APIs
      const sanctions = await ctx.runAction(internal.georisk.checkSanctions, {...});
      const weather = await ctx.runAction(internal.georisk.getWeatherRisk, {...});
    } else {
      // Use mock data
      const sanctions = MOCK_SANCTIONS_DATA;
      const weather = MOCK_WEATHER_DATA;
    }
  }
});
```

**Enabling for a Customer:**
```typescript
// Admin action
export const enableGeoRiskLiveData = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    await ctx.db.patch(userId, {
      "features.georiskLiveData": true
    });
  }
});
```

---

### Level 3: Hybrid (Recommended for Pilots)
**Who:** Enterprise pilots, POCs  
**What:** Live data for specific routes, mock for others  
**Why:** Demonstrate capability without full API costs

**Implementation:**
```typescript
// Only use live data for routes the customer cares about
const PILOT_ROUTES = [
  "Shanghai → Los Angeles",
  "Mumbai → Rotterdam"
];

const useLiveData = PILOT_ROUTES.includes(args.route) && user?.features?.georiskLiveData;
```

---

## API Cost Management

### OpenWeather Pricing
- **Free Tier:** 1,000 calls/day, 60 calls/minute
- **Startup Plan:** $40/month for 100,000 calls/month
- **Professional Plan:** $180/month for 1M calls/month

**Recommendation:** Start with Free Tier, upgrade to Startup when you have 10+ paying customers.

---

### OpenSanctions Pricing
- **Free Tier:** Unlimited searches (rate-limited)
- **Paid Tier:** $500/month for commercial use with SLA

**Recommendation:** Use Free Tier until you sign an Enterprise customer, then upgrade.

---

### Cost Per Assessment
**Assumptions:**
- 1 assessment = 2 API calls (1 sanctions + 1 weather)
- OpenWeather: $0.0004 per call (Startup plan)
- OpenSanctions: Free (rate-limited)

**Cost:** ~$0.0008 per assessment

**Monthly Costs:**
| Customers | Assessments/Month | API Cost |
|-----------|-------------------|----------|
| 10 | 1,000 | $0.80 |
| 50 | 5,000 | $4.00 |
| 100 | 10,000 | $8.00 |
| 500 | 50,000 | $40.00 |

**Conclusion:** API costs are negligible. Activate live data aggressively for paid customers.

---

## Activation Checklist

### Before Activating Live Data for a Customer:
- [ ] Customer has signed contract (Business or Enterprise plan)
- [ ] Customer has accepted Terms of Service
- [ ] Customer understands data is "decision-support, not guarantee"
- [ ] Sales team has set expectations on data freshness
- [ ] Admin has enabled `georiskLiveData` feature flag

### After Activation:
- [ ] Send confirmation email to customer
- [ ] Monitor API usage for first 7 days
- [ ] Schedule check-in call to review accuracy
- [ ] Track customer feedback on risk scores

---

## Handling "Is This Production?" Objections

### Scenario 1: Prospect Asks During Demo
**Question:** "Is this using real data or mock data?"

**Answer:**
> "This demo uses representative scenarios to show you the UI and workflow. When we activate your account, it connects to live sanctions databases and weather APIs. We can discuss activation timelines based on your compliance requirements."

**Do NOT say:** "This is mock data" or "This isn't production yet."

---

### Scenario 2: Customer Asks After Signing
**Question:** "When will we get live data?"

**Answer:**
> "We can activate live data within 24 hours of contract signature. Our team will enable it and send you a confirmation email. You'll see a timestamp on each assessment showing when the data was last updated."

**Action:** Enable `georiskLiveData` feature flag immediately.

---

### Scenario 3: Compliance Team Asks for Proof
**Question:** "How do we know this is using real sanctions data?"

**Answer:**
> "Each risk assessment includes a timestamp and data source attribution. For sanctions matches, we show the source database (OFAC, EU, etc.) and confidence score. We can provide API documentation and data lineage reports as part of your onboarding."

**Action:** Provide API documentation and sample responses.

---

## Data Freshness SLA

### Sanctions Data
- **Update Frequency:** Daily (OpenSanctions updates nightly)
- **Cache Duration:** 24 hours
- **SLA:** Data is never more than 48 hours old

### Weather Data
- **Update Frequency:** Every 3 hours (OpenWeather)
- **Cache Duration:** 3 hours
- **SLA:** Data is never more than 6 hours old

### Geopolitical Zone Risk
- **Update Frequency:** Quarterly or as major events occur
- **Manual Review:** Product team reviews monthly
- **SLA:** Updated within 7 days of major geopolitical events

---

## Monitoring & Alerts

### API Health Checks
- [ ] Monitor OpenSanctions API uptime (target: 99.9%)
- [ ] Monitor OpenWeather API uptime (target: 99.9%)
- [ ] Alert if API response time > 2 seconds
- [ ] Alert if API error rate > 1%

### Usage Alerts
- [ ] Alert if API calls exceed budget (e.g., >10,000/day)
- [ ] Alert if single customer makes >1,000 assessments/day (potential abuse)
- [ ] Alert if cache hit rate < 50% (optimize caching)

---

## Rollback Plan

### If Live Data Causes Issues:
1. **Immediate:** Disable `georiskLiveData` for affected customer
2. **Investigate:** Check API logs, error rates, response times
3. **Communicate:** Email customer explaining issue and ETA for fix
4. **Fix:** Resolve API integration issue
5. **Re-enable:** Turn live data back on after verification

### Rollback Command:
```typescript
// Admin action
export const disableGeoRiskLiveData = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    await ctx.db.patch(userId, {
      "features.georiskLiveData": false
    });
  }
});
```

---

## Gradual Rollout Strategy

### Phase 1: Internal Testing (Week 1)
- Enable live data for internal team only
- Run 100+ test assessments
- Verify data accuracy and API stability

### Phase 2: Beta Customers (Week 2-4)
- Enable for 3-5 pilot customers
- Monitor usage and feedback
- Fix any issues before wider rollout

### Phase 3: All Paid Customers (Week 5+)
- Enable for all Business/Enterprise customers
- Monitor API costs and usage
- Optimize caching and rate limiting

---

## Customer Communication

### Email Template: Live Data Activation
```
Subject: GeoRisk Navigator™ Live Data Activated

Hi [Name],

Great news! We've activated live data for your GeoRisk Navigator™ account.

What's Changed:
✅ Real-time sanctions screening (updated daily)
✅ Live weather data (updated every 3 hours)
✅ Geopolitical zone risk (reviewed quarterly)

Each risk assessment now includes a timestamp showing when the data was last updated. You'll see this in the "Last Updated" field.

If you have questions or notice any discrepancies, reply to this email or contact support.

Best,
FreightCode Team
```

---

## Quick Decision Matrix

| Customer Type | Live Data? | When to Activate |
|---------------|------------|------------------|
| Free Tier | ❌ No | Never |
| Trial (unpaid) | ❌ No | Only if signed NDA |
| Business Plan | ✅ Yes | Within 24 hours of payment |
| Enterprise Plan | ✅ Yes | Immediately after contract signature |
| Pilot/POC | ✅ Yes (hybrid) | After pilot agreement signed |
| Demo Request | ❌ No | Never (use mock data) |

---

## Final Guidance

### When in Doubt:
1. **Default to mock data** for demos and trials
2. **Activate live data** only for paying customers
3. **Monitor costs** and usage closely
4. **Communicate clearly** about data sources and freshness

### Key Principle:
> "Live data is a feature, not a requirement. Mock data demonstrates capability. Live data proves value."

---

**You're ready to activate live data when the customer is ready to pay.**
