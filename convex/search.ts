import { query } from "./_generated/server";
import { v } from "convex/values";

export const globalSearch = query({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        const q = args.query.toLowerCase().trim();
        if (!q) return { shipments: [], bookings: [], documents: [] };

        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return { shipments: [], bookings: [], documents: [] };

        // Resolve user ID
        const user = await ctx.db
            .query("users")
            .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
            .first();

        if (!user) return { shipments: [], bookings: [], documents: [] };

        // Search Shipments
        const shipments = await ctx.db
            .query("shipments")
            .withIndex("byUserId", (q) => q.eq("userId", user._id))
            .collect();

        // Search Bookings
        const bookings = await ctx.db
            .query("bookings")
            .withIndex("byUserId", (q) => q.eq("userId", user._id))
            .collect();

        // Search Documents
        const documents = await ctx.db
            .query("documents")
            .withIndex("byUserId", (q) => q.eq("userId", user._id))
            .collect();

        // Filter in-memory (fast enough for <1000 records per user)
        const filteredShipments = shipments.filter(s =>
            s.shipmentId.toLowerCase().includes(q) ||
            s.trackingNumber?.toLowerCase().includes(q) ||
            s.carrier.toLowerCase().includes(q) ||
            s?.currentLocation?.city.toLowerCase().includes(q)
        ).slice(0, 5);

        const filteredBookings = bookings.filter(b =>
            b.bookingId.toLowerCase().includes(q) ||
            b.deliveryDetails.address.toLowerCase().includes(q)
        ).slice(0, 5);

        const filteredDocuments = documents.filter(d =>
            d.documentData.documentNumber.toLowerCase().includes(q) ||
            d.type.toLowerCase().includes(q)
        ).slice(0, 5);

        return {
            shipments: filteredShipments.map(s => ({
                id: s._id,
                title: `${s.shipmentId} (${s.carrier})`,
                subtitle: `${s.currentLocation?.city} -> ${s.estimatedDelivery}`,
                type: 'shipment',
                url: '/shipments' // In real app, /shipments/:id
            })),
            bookings: filteredBookings.map(b => ({
                id: b._id,
                title: b.bookingId,
                subtitle: b.deliveryDetails.address,
                type: 'booking',
                url: '/bookings'
            })),
            documents: filteredDocuments.map(d => ({
                id: d._id,
                title: d.documentData.documentNumber,
                subtitle: d.type.replace(/_/g, ' '),
                type: 'document',
                url: '/documents'
            }))
        };
    },
});
