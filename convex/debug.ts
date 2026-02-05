import { query } from "./_generated/server";

export const getRecentActivity = query({
    args: {},
    handler: async (ctx) => {
        const shipments = await ctx.db.query("shipments").order("desc").take(5);
        const documents = await ctx.db.query("documents").order("desc").take(5);
        const bookings = await ctx.db.query("bookings").order("desc").take(5);
        const payments = await ctx.db.query("paymentAttempts").order("desc").take(5);

        return {
            shipments: shipments.map(s => ({ id: s._id, shipmentId: s.shipmentId, userId: s.userId, orgId: s.orgId, createdAt: s.createdAt })),
            documents: documents.map(d => ({ id: d._id, type: d.type, userId: d.userId, orgId: d.orgId, createdAt: d.createdAt })),
            bookings: bookings.map(b => ({ id: b._id, bookingId: b.bookingId, status: b.status })),
            payments: payments.map(p => ({ id: p._id, payment_id: p.payment_id, status: p.status }))
        };
    }
});
