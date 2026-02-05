import { v } from "convex/values";
import { query } from "./_generated/server";

export const listMyInvoices = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        return await ctx.db
            .query("invoices")
            .withIndex("byCustomerId", (q) => q.eq("customerId", identity.subject as any))
            .order("desc")
            .collect();
    },
});

export const getInvoice = query({
    args: { invoiceId: v.id("invoices") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        const invoice = await ctx.db.get(args.invoiceId);
        if (!invoice || invoice.customerId !== identity.subject) return null;

        return invoice;
    },
});
