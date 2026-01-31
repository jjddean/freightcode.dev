# Video Production Spec — Freightcode

> Operator-grade video demos. No hype. No animations. Real workflows.

---

## Video 1: Primary Product Walkthrough (REQUIRED)

**Purpose**: Show exactly what a forwarder sees after login.

### Specs
| Attribute | Value |
|-----------|-------|
| Length | 60–90 seconds |
| Format | Screen recording + calm voiceover |
| Audio | No music, no sound effects |
| Style | No talking head, no buzzwords |

### Recording Checklist
- [ ] Dashboard open (dark mode, `bg-slate-950`)
- [ ] Navigate: Shipments → Documents → Compliance → Risk
- [ ] Full flow: Quote → Shipment → Route Risk → Alert

### Script

**Opening** (spoken):
> "This is Freightcode — a self-serve operating system for forwarders managing shipments, documentation, compliance, and route risk."

**Middle** (show, describe):
- Click through sidebar
- Open a shipment
- Show route risk score
- Trigger/view an alert

**Close** (spoken):
> "Freightcode helps teams operate confidently on complex trade lanes."

❌ No spoken CTA. CTA remains on page only.

---

## Video 2: GeoRisk Navigator™ Deep Dive (STRATEGIC)

**Purpose**: Demonstrate differentiation. Justify Business/Enterprise pricing.

### Specs
| Attribute | Value |
|-----------|-------|
| Length | 2–3 minutes |
| Format | Screen recording only |
| Audio | Voiceover only, no music |

### Focus Areas
- Route risk score breakdown
- Alert thresholds configuration
- How an operator acts on the insight

### Language Rules
- ✅ "Designed to surface risk indicators"
- ❌ "Predicts outcomes" or "Guarantees safety"

---

## Video 3: Silent UI Clips (OPTIONAL)

**Purpose**: Visual proof without commitment.

### Specs
| Attribute | Value |
|-----------|-------|
| Length | 15–30 seconds |
| Audio | None |
| Content | Cursor movement + UI transitions |

### Use Cases
- Inline between landing page sections
- Social media clips
- Email GIFs

---

## Tools (Zero Budget)

| Tool | Purpose | Link |
|------|---------|------|
| Loom | Quick recording | loom.com |
| OBS | Advanced recording | obsproject.com |
| OpenShot | Editing (free) | openshot.org |
| CapCut | Editing (desktop) | capcut.com |
| YouTube | Hosting | youtube.com |
| Canva | Thumbnails | canva.com |

---

## Embed Behavior

```html
<!-- YouTube Embed (Click-to-Play) -->
<iframe 
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="Freightcode Product Walkthrough"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
  loading="lazy"
  class="w-full aspect-video rounded-lg"
></iframe>
```

**Rules**:
- No autoplay with sound
- Click-to-play only
- Responsive embed
- `loading="lazy"` for performance

---

## Thumbnail Style

- Dashboard screenshot
- No text overlays
- Play button overlay (centered, 60% opacity)
- Dark theme (`bg-slate-950`)
