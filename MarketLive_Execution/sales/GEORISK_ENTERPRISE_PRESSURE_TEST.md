# GeoRisk Navigator™ Enterprise Pressure Test

## Purpose
This document prepares you for the hardest questions enterprise procurement teams will ask about GeoRisk Navigator™. These are real objections you will face.

---

## Security & Compliance Questions

### Q1: "What certifications do you have? SOC 2? ISO 27001?"
**Answer:**
> "Our infrastructure partners (Convex for database, Clerk for auth, Stripe for payments) are SOC 2 Type II certified. We inherit their compliance posture. For ISO 27001 or custom security audits, that's available on Enterprise plans as part of our onboarding process."

**Follow-up if pressed:**
> "We can provide a detailed security questionnaire response and schedule a call with our infrastructure team."

**Do NOT say:** "We don't have certifications" or "We're too small for that."

---

### Q2: "Where is our data stored? What regions?"
**Answer:**
> "Data is stored in US-based cloud infrastructure with automatic replication for redundancy. For GDPR or data residency requirements, we can discuss regional deployment options on Enterprise plans."

**Technical detail (if asked):**
> "Our database provider (Convex) uses AWS infrastructure. We can provide specific region details during onboarding."

---

### Q3: "How do you handle GDPR / data privacy?"
**Answer:**
> "We're GDPR-compliant by design. User data is encrypted at rest and in transit. We have data processing agreements available, and users can request data export or deletion at any time. For EU customers, we can enable EU-specific data residency."

**Do NOT say:** "We're working on GDPR compliance."

---

### Q4: "What happens if you get breached?"
**Answer:**
> "We have incident response protocols in place. In the unlikely event of a breach, we notify affected customers within 72 hours and work with our infrastructure partners to remediate. We also carry cyber liability insurance."

**Confidence is key here.** Don't sound defensive.

---

## Data Accuracy & Liability Questions

### Q5: "What if your risk score is wrong and we lose money?"
**Critical answer:**
> "GeoRisk Navigator™ is a decision-support tool, not a guarantee. The risk score is directional guidance based on available data. Your team retains full decision-making authority. We don't provide insurance or indemnification for routing decisions — that's why we recommend using this alongside your existing compliance processes, not as a replacement."

**Legal safety:**
> "Our Terms of Service clarify that risk scores are informational only. We're happy to have your legal team review them."

**Do NOT say:** "We're not liable" (sounds defensive). Say: "This is a decision-support tool."

---

### Q6: "How often is the data updated?"
**Answer:**
> "Sanctions data is updated daily. Weather data is real-time (refreshed every 3 hours). Geopolitical zone risk is reviewed quarterly or as major events occur. We can provide a detailed data freshness SLA on Enterprise plans."

**If they push back:**
> "For time-sensitive routes, we recommend combining GeoRisk Navigator™ with your internal intelligence. This is a baseline, not a replacement for human judgment."

---

### Q7: "What if we disagree with the risk score?"
**Answer:**
> "On Enterprise plans, you can customize the risk weighting or add your own risk factors. The system is designed to be configurable, not prescriptive. If you have internal intelligence that contradicts our score, your team's judgment takes precedence."

**Upsell opportunity.**

---

## Vendor & Integration Questions

### Q8: "What happens if Convex / Clerk / Stripe goes down?"
**Answer:**
> "We use enterprise-grade infrastructure with 99.9%+ uptime SLAs. If a provider has an outage, we have monitoring and fallback protocols. For mission-critical operations, we recommend Enterprise plans with dedicated support and priority incident response."

**Do NOT name vendors unless they specifically ask.** Say "our infrastructure partners."

---

### Q9: "Can we self-host this?"
**Answer:**
> "Not currently. GeoRisk Navigator™ is a cloud-native SaaS product. For customers with strict on-premise requirements, we can discuss hybrid deployment options on Enterprise plans, but that's a custom engagement."

**Be honest.** Don't promise something you can't deliver.

---

### Q10: "What APIs do you integrate with? Can we see the list?"
**Answer:**
> "We integrate with industry-standard sanctions databases and weather APIs. The specific vendors depend on your geographic coverage and compliance requirements. We provide a detailed integration audit during onboarding."

**If they insist on names:**
> "We use OpenSanctions for sanctions screening and OpenWeather for weather data. Both are widely used in the industry. We can add custom sources on Enterprise plans."

**Only name vendors if pressed.**

---

## Pricing & ROI Questions

### Q11: "Why should we pay for this when we can check sanctions manually?"
**Answer:**
> "Manual sanctions screening takes 15-30 minutes per shipment and is prone to human error. GeoRisk Navigator™ does it in under 2 seconds with consistent accuracy. For a team processing 100+ shipments per month, that's 25-50 hours saved. At an average logistics manager salary of $75/hour, that's $1,875-$3,750 in monthly labor savings — far exceeding the $99/month Business plan cost."

**ROI math wins this argument.**

---

### Q12: "What's the difference between Business and Enterprise?"
**Answer:**
| Feature | Business ($99/mo) | Enterprise (Custom) |
|---------|-------------------|---------------------|
| Risk Assessments | Unlimited | Unlimited |
| Sanctions Screening | ✅ | ✅ |
| Weather Impact | ✅ | ✅ |
| Custom Risk Factors | ❌ | ✅ |
| API Access | ❌ | ✅ |
| Dedicated Support | ❌ | ✅ |
| SLA Guarantees | ❌ | ✅ |
| Custom Integrations | ❌ | ✅ |

**Most teams start with Business and upgrade as they scale.**

---

### Q13: "Can we get a discount for annual prepay?"
**Answer:**
> "Yes. We offer 15% off for annual Business plans ($1,009/year vs $1,188). For Enterprise, pricing is custom based on volume and requirements."

**Always have a discount ready for annual commits.**

---

## Competitive Questions

### Q14: "How is this different from Flexport's risk tools?"
**Answer:**
> "Flexport's risk tools are integrated into their freight forwarding service — you have to use Flexport to access them. GeoRisk Navigator™ is standalone. You can use it with any carrier or forwarder. That's the key difference: we're carrier-agnostic."

**Positioning:** We're a tool, not a forwarder.

---

### Q15: "Why not just use free sanctions databases ourselves?"
**Answer:**
> "You can. But GeoRisk Navigator™ combines sanctions, weather, and geopolitical zone risk into a single weighted score. Free databases give you raw data — we give you actionable intelligence. Plus, we handle the API integrations, data normalization, and updates. Your team focuses on decisions, not data wrangling."

**Value prop:** We save time and reduce complexity.

---

## Technical Questions

### Q16: "What's your API rate limit?"
**Answer:**
> "Business plans have a rate limit of 100 requests/minute. Enterprise plans have custom limits based on your volume. We can discuss your specific needs during onboarding."

---

### Q17: "Can we export the data?"
**Answer:**
> "Yes. Business plans can export risk assessments as CSV or JSON. Enterprise plans get full API access for programmatic integration with your ERP or TMS."

---

### Q18: "What's your uptime SLA?"
**Answer:**
> "We target 99.9% uptime. Enterprise plans include a formal SLA with credits for downtime. Business plans have best-effort support."

---

## Objection Handling Framework

### When they say: "This seems expensive."
**Response:**
> "Compared to what? Manual sanctions screening costs $75-$150 per shipment in labor. One missed sanctions violation can cost $50,000-$500,000 in fines. GeoRisk Navigator™ is $99/month. The ROI is clear."

---

### When they say: "We need to think about it."
**Response:**
> "Of course. What specific concerns can I address to help your decision? Is it pricing, data accuracy, integration complexity, or something else?"

**Uncover the real objection.**

---

### When they say: "We'll build this internally."
**Response:**
> "You absolutely could. Most teams estimate 6-12 months and $200k-$500k in engineering costs to build something similar. Plus ongoing maintenance. If you have that budget and timeline, building internally makes sense. If you need this operational in 30 days, we're the faster path."

**Respect their decision, but frame the trade-off.**

---

## Red Flags (When to Walk Away)

❌ They ask for free custom development  
❌ They want unlimited free trial  
❌ They refuse to sign a contract  
❌ They ask you to guarantee risk scores  
❌ They want you to indemnify their routing decisions  

**These are not good-fit customers.**

---

## Green Flags (When to Accelerate)

✅ They ask about Enterprise pricing  
✅ They introduce you to their compliance team  
✅ They ask for a pilot with 2-3 trade lanes  
✅ They ask about API access  
✅ They ask about data residency  

**These are serious buyers.**

---

## Final Guidance

### Positioning Against Incumbents

**vs. Flexport:**
- **Advantage:** Carrier-agnostic, standalone tool
- **Weakness:** They have more brand recognition

**vs. Traditional Forwarders:**
- **Advantage:** 10x faster, real-time data
- **Weakness:** They have established relationships

**vs. Free Tools:**
- **Advantage:** Integrated, actionable, time-saving
- **Weakness:** Price-sensitive buyers

---

### When to Mention Tech Stack

**DO mention:**
- "Enterprise-grade infrastructure"
- "SOC 2 certified partners"
- "99.9% uptime"

**DO NOT mention:**
- "Built on Convex"
- "Uses Clerk for auth"
- "Powered by OpenSanctions"

**Why?** Buyers care about outcomes, not tools.

---

### Closing Advice

1. **Confidence wins.** If you sound uncertain, they'll pass.
2. **ROI math wins.** Always quantify the value.
3. **Objections are buying signals.** If they're asking hard questions, they're interested.
4. **Know when to walk away.** Not every prospect is a good fit.

---

## Quick Reference: Objection → Response

| Objection | Response |
|-----------|----------|
| "Too expensive" | ROI math: labor savings + compliance risk reduction |
| "Not production-ready" | "Backend is deployed. We use representative scenarios for demo." |
| "We'll build it ourselves" | "6-12 months, $200k-$500k. We're operational in 30 days." |
| "What if the score is wrong?" | "It's decision-support, not a guarantee. Your team retains authority." |
| "How is this different from Flexport?" | "Carrier-agnostic. Use with any forwarder." |
| "We need SOC 2" | "Our infrastructure partners are SOC 2 Type II certified." |
| "Can we self-host?" | "Not currently. Hybrid deployment available on Enterprise." |
| "What if you get breached?" | "Incident response protocols + cyber liability insurance." |

---

**You're ready.**
