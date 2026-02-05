import { internalMutation, query } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { paymentAttemptDataValidator } from "./paymentAttemptTypes";
import { createNotificationHelper } from "./notifications";

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query("users")
    .withIndex("byExternalId", (q) => q.eq("externalId", externalId))
    .unique();
}

export const savePaymentAttempt = internalMutation({
  args: {
    paymentAttemptData: paymentAttemptDataValidator
  },
  returns: v.null(),
  handler: async (ctx, { paymentAttemptData }) => {
    // Find the user by the payer.user_id (which maps to externalId in our users table)
    const user = await userByExternalId(ctx, paymentAttemptData.payer.user_id);

    // Check if payment attempt already exists to avoid duplicates
    const existingPaymentAttempt = await ctx.db
      .query("paymentAttempts")
      .withIndex("byPaymentId", (q) => q.eq("payment_id", paymentAttemptData.payment_id))
      .unique();

    const paymentAttemptRecord = {
      ...paymentAttemptData,
      userId: user?._id, // Link to our users table if user exists
    };

    if (existingPaymentAttempt) {
      // Update existing payment attempt
      await ctx.db.patch(existingPaymentAttempt._id, paymentAttemptRecord);
    } else {
      // Create new payment attempt
      await ctx.db.insert("paymentAttempts", paymentAttemptRecord);
    }

    // Notify if Paid
    if ((paymentAttemptData.status === 'succeeded' || paymentAttemptData.status === 'paid') && user) {
      await createNotificationHelper(ctx, user.externalId, {
        title: 'Payment Received',
        message: `Payment of ${paymentAttemptData.totals.grand_total.amount_formatted} received.`,
        type: 'payment',
        priority: 'medium',
        actionUrl: '/payments'
      });
    }

    return null;
  },
});

export const listMyPayments = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await userByExternalId(ctx, identity.subject);
    if (!user) return [];
    const payments = await ctx.db
      .query("paymentAttempts")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .collect();
    // newest first
    return payments.sort((a, b) => b.created_at - a.created_at);
  }
});

import { mutation } from "./_generated/server";

// Backfill mutation to add route metadata to existing payment attempts
export const backfillPaymentsWithRoute = mutation({
  args: {},
  handler: async (ctx) => {
    const allPayments = await ctx.db.query("paymentAttempts").collect();
    let updated = 0;

    for (const payment of allPayments) {
      // Skip if already has metadata with route
      if (payment.metadata?.route) continue;

      // Try to find associated booking to get origin/destination
      // payment_id format: "PAY-BK-1770268078591-js1dg9vxd"
      // bookingId format:  "BK-1770268078591-js1dg9vxd"
      let bookingId = null;

      if (payment.payment_id?.startsWith('PAY-')) {
        bookingId = payment.payment_id.replace('PAY-', '');
      } else if (payment.invoice_id?.startsWith('INV-')) {
        bookingId = payment.invoice_id.replace('INV-', '');
      }

      if (bookingId) {
        const booking = await ctx.db
          .query("bookings")
          .withIndex("byBookingId", (q) => q.eq("bookingId", bookingId))
          .first();

        if (booking) {
          // Get the quote to find origin/destination
          const quote = booking.quoteId ?
            await ctx.db.query("quotes")
              .withIndex("byQuoteId", (q) => q.eq("quoteId", booking.quoteId))
              .first() : null;

          if (quote) {
            await ctx.db.patch(payment._id, {
              metadata: {
                route: `${quote.origin} → ${quote.destination}`,
                lineItems: booking.price?.lineItems || [],
                bookingId: bookingId,
                origin: quote.origin,
                destination: quote.destination
              }
            });
            updated++;
          }
        }
      }
    }

    return { total: allPayments.length, updated };
  },
});