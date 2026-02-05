"use node";

import { v } from "convex/values";
import { action, internalMutation, mutation } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { stripe } from "./stripe";

const PRO_PRICE_ID = "price_1Qj000HElmOA4YPw00000000"; // Mock Price ID, replaced dynamically or via env in prod
const SUBSCRIPTION_PRICE_AMOUNT = 1000; // $10.00

// Action to create a Stripe Checkout Session
export const createCheckoutSession = action({
    args: {
        type: v.string(), // "subscription" or "invoice"
        invoiceId: v.optional(v.string()), // Required if type is invoice
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) {
            throw new Error("Unauthenticated call to createCheckoutSession");
        }

        const domain = process.env.VITE_CONVEX_URL?.replace('.convex.cloud', '.vercel.app') || "http://localhost:5173";

        // For Subscription
        if (args.type === "subscription") {
            const session = await stripe.checkout.sessions.create({
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: 'Pro Subscription',
                                description: 'Advanced features for $10/mo',
                            },
                            unit_amount: SUBSCRIPTION_PRICE_AMOUNT,
                            recurring: {
                                interval: 'month',
                            },
                        },
                        quantity: 1,
                    },
                ],
                mode: 'subscription',
                success_url: `${domain}/payments?success=true&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${domain}/payments?canceled=true`,
                metadata: {
                    userId: user.subject,
                    type: 'subscription'
                }
            });

            return { url: session.url };
        }

        // For Invoice
        if (args.type === "invoice" && args.invoiceId) {
            // Extract bookingId from INV-xxx
            const bookingId = args.invoiceId.startsWith('INV-') ? args.invoiceId.substring(4) : args.invoiceId;

            // Fetch booking details for metadata
            const booking: any = await ctx.runQuery(api.bookings.getBooking, { bookingId });
            const quoteData = booking?.quoteId ? await ctx.runQuery(api.quotes.getQuoteByQuoteId, { quoteId: booking.quoteId }) : null;
            const quote = quoteData as any;

            const session = await (stripe.checkout.sessions.create as any)({
                line_items: [
                    {
                        price_data: {
                            currency: 'usd', // Default to USD for mock
                            product_data: {
                                name: `Freight Invoice #${args.invoiceId}`,
                                description: quote ? `Freight: ${quote.origin} -> ${quote.destination}` : 'Logistics Services',
                            },
                            unit_amount: booking?.price?.amount ? Math.round(booking.price.amount * 100) : 245000,
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${domain}/payments?success=true&invoice_id=${args.invoiceId}`,
                cancel_url: `${domain}/payments?canceled=true`,
                metadata: {
                    userId: user.subject,
                    type: 'invoice',
                    invoiceId: args.invoiceId as string,
                    route: (quote ? `${quote.origin} -> ${quote.destination}` : 'Standard Route') as string,
                    origin: (quote?.origin || 'Unknown') as string,
                    destination: (quote?.destination || 'Unknown') as string,
                }
            });

            return { url: session.url };
        }

        throw new Error("Invalid payment type");
    },
});


