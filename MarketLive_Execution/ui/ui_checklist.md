# MarketLive UI Execution Checklist (Mandatory)

## 🎨 Global Aesthetic
- [ ] **Background**: Slate-950 (`bg-slate-950`) for all pages.
- [ ] **Text**: Slate-200 (`text-slate-200`) default.
- [ ] **Density**: `text-sm` for body, `text-xs` for metadata. NO `text-lg` unless H1.
- [ ] **Accent**: Blue-500 or Teal-500 ONLY.

## 🚫 Iconography (Strict)
- [ ] **NO** Lucide Icons.
- [ ] **NO** Heroicons.
- [ ] **NO** FontAwesome.
- [ ] **YES** Emojis (Standard iOS/Win set).

## 🧩 Components
### Cards
- [ ] Dark background (`bg-slate-900/50`).
- [ ] Border (`border-slate-800`).
- [ ] Backdrop blur (`backdrop-blur-sm`).
- [ ] Text Overlay style for primary navigation items.

### Navigation (Sidebar)
- [ ] Fixed width (64px collapsed / 240px expanded).
- [ ] Emoji icons for all links.
- [ ] "Active" state: Blue-600 bg + White text.

### GeoRisk Navigator™ (Premium)
- [ ] Must use 📍 or ⚠️ emoji.
- [ ] Must show Risk Score (0-100).
- [ ] Must have "Business/Enterprise" label if gated.
- [ ] **Exception**: Marketing/demo version may use light theme + icons for video content.

## 📱 Responsiveness
- [ ] Mobile Sidebar = Drawer (Slide-out).
- [ ] Tables = Horizontal Scroll or Card View on Mobile.
- [ ] Touch targets > 44px.

