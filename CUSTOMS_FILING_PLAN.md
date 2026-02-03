# Customs Filing Workflow (Admin Side – Step by Step)

## Workflow Overview

1.  **Client uploads docs**
    *   In client dashboard → Documents page → upload Commercial Invoice, Packing List, CoO, etc.
    *   Status: "Pending Review" (visible to admin).

2.  **Admin sees new filing request**
    *   Admin panel → **Customs Filing Queue** (filtered table on Shipments or new sidebar item).
    *   Shows: Shipment ID, Client/Org, Status, Risk, Docs uploaded, Filing deadline.

3.  **Admin reviews & prepares**
    *   Click shipment → open detail view.
    *   See all uploaded docs (AI autofilled fields highlighted).
    *   Check compliance (sanctions, HS codes from GeoRisk).
    *   Add notes or request missing docs from client (notification/email).

4.  **Admin files in HMRC portal**
    *   Click "File Customs" button → opens HMRC login page in new tab (or iframe if possible).
    *   Admin logs in to GOV.UK One Login / IPAFFS / CDS.
    *   Copies data from your app (shipment details, autofilled docs).
    *   Submits notification/declaration.
    *   Copies reference number back into your app.

5.  **Admin updates status in app**
    *   In shipment detail: Enter HMRC reference, upload confirmation PDF.
    *   Change status to "Customs Filed" or "Cleared".
    *   Client sees update in their dashboard + gets email.

6.  **Client sees result**
    *   Shipment status updates automatically.
    *   Notification: "Customs filed – reference XXXX. Awaiting clearance."

---

## Code Implementation Plan

### 1. New Convex Table Field (in `schema.ts`)
Add to `shipments` table:
```typescript
customsStatus: v.union(
  v.literal("pending"), 
  v.literal("review"), 
  v.literal("filed"), 
  v.literal("cleared"), 
  v.literal("rejected")
),
customsReference: v.optional(v.string()), // HMRC ref number
customsFiledAt: v.optional(v.number()),   // timestamp
customsDocs: v.optional(v.array(v.id("documents"))), // linked doc IDs
```

### 2. New Convex Mutation (`fileCustoms.ts` or similar)
```typescript
export const submitCustomsFiling = mutation({
  args: {
    shipmentId: v.id("shipments"),
    reference: v.string(),
    filedAt: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.publicMetadata.role !== "superadmin") {
      throw new Error("Admin only");
    }

    await ctx.db.patch(args.shipmentId, {
      customsStatus: "filed",
      customsReference: args.reference,
      customsFiledAt: args.filedAt,
      // customsNotes field needs to be added to schema if used, or handle separately
      updatedAt: Date.now(),
    });

    // Optional: send notification to client
    /*
    await ctx.db.insert("notifications", {
      userId: shipment.ownerId, // or org users
      type: "customs_filed",
      message: `Customs filed for shipment ${shipmentId} - Ref: ${args.reference}`,
      createdAt: Date.now(),
    });
    */
  },
});
```

### 3. Admin Customs Filing Queue (Frontend)
Create `admin/CustomsQueue.tsx`:
```tsx
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CustomsQueue() {
  const shipments = useQuery(api.shipments.getPendingCustoms) || [];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Customs Filing Queue</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th>Shipment ID</th>
            <th>Client/Org</th>
            <th>Status</th>
            <th>Risk</th>
            <th>File in HMRC</th> {/* Renamed Action to File in HMRC */}
          </tr>
        </thead>
        <tbody>
          {shipments.map((s) => (
            <tr key={s._id}>
              <td>{s.trackingNumber}</td>
              <td>{s.orgName || s.clientEmail}</td>
              <td>
                <Badge variant={s.customsStatus === "pending" ? "destructive" : "default"}>
                  {s.customsStatus}
                </Badge>
              </td>
              <td>{s.riskScore}%</td>
              <td>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.open("https://import-notifications.service.gov.uk", "_blank")}
                >
                  Login to HMRC
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 4. Shipment Detail – Customs Section
Add to `admin/ShipmentDetail.tsx`:
```tsx
const isPendingOrReview = ["pending", "review"].includes(shipment.customsStatus);

{/* Links Section - visible when filing is needed */}
{isPendingOrReview && (
  <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-md">
    <h4 className="font-medium mb-2 text-blue-900">Official Filing Portals</h4>
    <div className="flex gap-4">
      <a 
        href="https://import-notifications.service.gov.uk" 
        target="_blank" 
        className="text-blue-700 hover:underline flex items-center gap-1"
      >
        Import Notifications (GOV.UK) ↗
      </a>
      <a 
        href="https://www.tax.service.gov.uk/business-tax/home" 
        target="_blank" 
        className="text-blue-700 hover:underline flex items-center gap-1"
      >
        Business Tax Account (GOV.UK) ↗
      </a>
    </div>
  </div>
)}

<div className="mt-6 border-t pt-4">
  <h3 className="text-lg font-semibold">Customs Filing</h3>
  <p className="mb-2">Status: <Badge>{shipment.customsStatus}</Badge></p>
  
  {shipment.customsReference ? (
    <p>HMRC Ref: <span className="font-mono">{shipment.customsReference}</span></p>
  ) : (
    /* After Filing: Input + Button */
    <div className="flex gap-3 max-w-md items-end mt-4">
      <div className="grid w-full items-center gap-1.5">
        <label htmlFor="hmrc-ref" className="text-sm font-medium">HMRC Reference Number</label>
        <Input 
          id="hmrc-ref" 
          placeholder="e.g. 1234567890" 
          onChange={(e) => setRefInput(e.target.value)}
        />
      </div>
      <Button 
        onClick={() => {
          if (refInput) {
            submitCustomsFiling({ 
              shipmentId: shipment._id, 
              reference: refInput, 
              filedAt: Date.now() 
            });
          }
        }}
      >
        Mark as Filed
      </Button>
    </div>
  )}
</div>
```

---

## Where to Add in Admin Panel
1.  **Sidebar**: Add "Customs Queue" (new link to `CustomsQueue` page).
2.  **Shipments page**: Add "Customs Status" column. Include a "File in HMRC" column with a button that opens the HMRC login page.
3.  **Shipment detail view**: 
    *   Add the **HMRC Links Section** at the top (visible when status is pending/review).
    *   Add the **Customs Filing** section at the bottom (Status display + "Reference Number" input + "Mark as Filed" button).
