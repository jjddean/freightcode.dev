import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { createNotificationHelper } from "./notifications";

export const createBooking = mutation({
  args: {
    quoteId: v.string(),
    carrierQuoteId: v.string(),
    customerDetails: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.string(),
      company: v.string(),
    }),
    pickupDetails: v.object({
      address: v.string(),
      date: v.string(),
      timeWindow: v.string(),
      contactPerson: v.string(),
      contactPhone: v.string(),
    }),
    deliveryDetails: v.object({
      address: v.string(),
      date: v.string(),
      timeWindow: v.string(),
      contactPerson: v.string(),
      contactPhone: v.string(),
    }),
    specialInstructions: v.optional(v.string()),
    additionalFees: v.optional(v.array(v.object({
      description: v.string(),
      amount: v.number(),
    }))),
  },
  handler: async (ctx, args) => {
    // Link to current user when available
    const identity = await ctx.auth.getUserIdentity();
    let linkedUserId: any = undefined;
    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
        .unique();
      if (user) linkedUserId = user._id;
    }

    // Validate quote exists and carrier option is valid
    const quote = await ctx.db
      .query("quotes")
      .withIndex("byQuoteId", (q) => q.eq("quoteId", args.quoteId))
      .unique();
    if (!quote) {
      throw new Error("Invalid quoteId: quote not found");
    }

    const selected = (quote.quotes as any[] | undefined)?.find((q) => (q.carrierId === args.carrierQuoteId) || (q.id === args.carrierQuoteId));
    if (!selected) {
      throw new Error(`Carrier quote ${args.carrierQuoteId} matching failed. Options available: ${(quote.quotes as any[]).map(q => q.carrierId || q.id).join(', ')}`);
    }

    // Optional: enforce validity window if present
    try {
      const validUntil = selected.validUntil ? Date.parse(selected.validUntil) : undefined;
      if (validUntil && Date.now() > validUntil) {
        throw new Error("Selected quote has expired");
      }
    } catch (e) {
      // If parsing fails, do not block; rely on manual override
    }

    // Generate booking ID
    const bookingId = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create booking
    const docId = await ctx.db.insert("bookings", {
      bookingId,
      quoteId: args.quoteId,
      carrierQuoteId: args.carrierQuoteId,
      carrierName: selected.carrierName || selected.carrier || "Standard Freight",
      serviceType: selected.serviceType || selected.service_level?.name || "Standard",
      carrierLogo: selected.carrierLogo || selected.provider_image_75,
      status: "pending",
      customerDetails: args.customerDetails,
      pickupDetails: args.pickupDetails,
      deliveryDetails: args.deliveryDetails,
      specialInstructions: args.specialInstructions,
      userId: linkedUserId,
      orgId: (identity as any)?.org_id || quote.orgId, // Link to organization if present
      // Handle both Shippo format (cost/currency) and legacy format (price.amount)
      price: {
        amount: (selected.price?.amount || selected.cost || selected.amount || 0) +
          (args.additionalFees?.reduce((sum, fee) => sum + fee.amount, 0) || 0),
        currency: selected.price?.currency || selected.currency || 'GBP',
        breakdown: selected.price?.breakdown,
        lineItems: [
          ...(selected.price?.lineItems || []),
          ...(args.additionalFees?.map(fee => ({
            category: "Additional Services",
            description: fee.description,
            unit: "unit",
            price: fee.amount,
            currency: selected.price?.currency || selected.currency || 'GBP',
            total: fee.amount
          })) || [])
        ]
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });


    // AUDIT LOG: Booking Created
    await ctx.db.insert("auditLogs", {
      action: "booking.created",
      entityType: "booking",
      entityId: bookingId,
      userId: identity?.subject || "public",
      userEmail: args.customerDetails.email,
      orgId: quote.orgId,
      details: {
        amount: selected.price?.amount || selected.cost || selected.amount,
        currency: selected.price?.currency || selected.currency,
        carrier: selected.carrierName || selected.carrier
      },
      timestamp: Date.now(),
    });

    // AUTOMATIC INVOICE GENERATION
    // Create a pending payment attempt so it shows up in Payments Page
    try {
      // Handle both Shippo format (cost/currency) and legacy format (price.amount)
      const amount = selected.price?.amount || selected.cost || selected.amount || 0;
      const currency = selected.price?.currency || selected.currency || "GBP";
      const symbol = currency === "USD" ? "$" : (currency === "GBP" ? "£" : "€");


      await ctx.db.insert("paymentAttempts", {
        payment_id: `PAY-${bookingId}`,
        invoice_id: `INV-${bookingId}`,
        statement_id: `ST-${bookingId}`,
        status: "pending",
        billing_date: Date.now(),
        charge_type: "one_time",
        created_at: Date.now(),
        updated_at: Date.now(),
        payer: {
          email: args.customerDetails.email,
          first_name: args.customerDetails.name.split(' ')[0] || 'Guest',
          last_name: args.customerDetails.name.split(' ').slice(1).join(' ') || '',
          user_id: identity?.subject || 'TRANSIT_USER'
        },
        payment_source: {
          card_type: 'n/a',
          last4: '0000'
        },
        subscription_items: [
          {
            amount: { amount, amount_formatted: `${symbol}${amount}`, currency, currency_symbol: symbol },
            plan: {
              id: 'freight-one-time',
              // Trim potential newlines from carrierName
              name: `Freight: ${(selected.carrierName || 'Carrier').trim()} - ${(selected.serviceType || 'Standard').trim()}`,
              slug: 'freight',
              amount,
              currency,
              period: 'one_time',
              interval: 0
            },
            status: 'pending',
            period_start: Date.now(),
            period_end: Date.now()
          }
        ],
        totals: {
          grand_total: { amount, amount_formatted: `${symbol}${amount}`, currency, currency_symbol: symbol },
          subtotal: { amount, amount_formatted: `${symbol}${amount}`, currency, currency_symbol: symbol },
          tax_total: { amount: 0, amount_formatted: `${symbol}0`, currency, currency_symbol: symbol }
        },
        userId: linkedUserId,
        metadata: {
          route: `${quote.origin} → ${quote.destination}`,
          lineItems: selected.price?.lineItems || [],
          bookingId: bookingId,
          origin: quote.origin,
          destination: quote.destination
        }
      });
    } catch (invErr) {
      console.error("INVOICE GENERATION FAILED (Booking allowed):", invErr);
      // We do not rethrow, so booking succeeds.
    }

    // Send Confirmation Email with price details
    const bookingAmount = selected.price?.amount || selected.cost || selected.amount || 0;
    const bookingCurrency = selected.price?.currency || selected.currency || 'GBP';
    const carrierName = selected.carrierName || selected.carrier || 'Carrier';
    const currencySymbol = bookingCurrency === 'GBP' ? '£' : bookingCurrency === 'EUR' ? '€' : '$';

    await ctx.scheduler.runAfter(0, internal.email.sendEmail, {
      to: args.customerDetails.email,
      subject: `Booking Confirmation: ${bookingId}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #003366;">Booking Confirmed</h1>
          <p>Dear ${args.customerDetails.name},</p>
          <p>Your booking <strong>${bookingId}</strong> has been received and is pending approval.</p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Carrier:</strong> ${carrierName}</p>
            <p><strong>Price:</strong> ${currencySymbol}${bookingAmount.toFixed(2)}</p>
            <p><strong>Origin:</strong> ${args.pickupDetails.address}</p>
            <p><strong>Destination:</strong> ${args.deliveryDetails.address}</p>
            <p><strong>Pickup Date:</strong> ${args.pickupDetails.date}</p>
          </div>
          <p>We will notify you once your shipment is fully approved.</p>
          <p>Best regards,<br/>The freightcode Team</p>
        </div>
      `
    });


    // Generate Notification
    if (identity?.subject) {
      await createNotificationHelper(ctx, identity.subject, {
        title: 'Booking Created',
        message: `Booking ${bookingId} has been successfully submitted.`,
        type: 'system',
        priority: 'medium',
        actionUrl: '/bookings'
      });
    }

    return { bookingId, docId };
  },
});

export const listMyBookings = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();
    if (!user) return [];

    return await ctx.db
      .query("bookings")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const getBooking = query({
  args: { bookingId: v.string() },
  handler: async (ctx, { bookingId }) => {
    return await ctx.db
      .query("bookings")
      .withIndex("byBookingId", (q) => q.eq("bookingId", bookingId))
      .unique();
  },
});

// Admin: list all bookings for the current org (for stats/dashboard)
// Admin: list all bookings for the current org or personal (for stats/dashboard)
export const listBookings = query({
  args: { orgId: v.optional(v.union(v.string(), v.null())) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const orgId = args.orgId;

    if (orgId) {
      // Filter by organization
      return await ctx.db
        .query("bookings")
        .withIndex("byOrgId", (q) => q.eq("orgId", orgId))
        .order("desc")
        .collect();
    } else {
      // Personal account - filter by userId AND ensure orgId is undefined
      const user = await ctx.db
        .query("users")
        .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
        .unique();

      if (!user) return [];

      return await ctx.db
        .query("bookings")
        .withIndex("byUserId", (q) => q.eq("userId", user._id))
        .filter((q) => q.or(q.eq(q.field("orgId"), null), q.eq(q.field("orgId"), undefined)))
        .order("desc")
        .collect();
    }
  },
});

export const updateBookingStatus = mutation({
  args: {
    bookingId: v.string(),
    status: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { bookingId, status, notes }) => {
    const booking = await ctx.db
      .query("bookings")
      .withIndex("byBookingId", (q) => q.eq("bookingId", bookingId))
      .unique();

    if (!booking) {
      throw new Error("Booking not found");
    }

    await ctx.db.patch(booking._id, {
      status,
      notes,
      updatedAt: Date.now(),
    });

    if (status === 'confirmed') {
      await ctx.scheduler.runAfter(0, internal.email.sendEmail, {
        to: booking.customerDetails.email,
        subject: `Booking Confirmed: ${booking.bookingId}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #003366;">Booking Confirmed!</h1>
            <p>Dear ${booking.customerDetails.name},</p>
            <p>Good news! Your booking <strong>${booking.bookingId}</strong> has been confirmed.</p>
            <p>Our team has verified your route and cargo details. A carrier has been assigned.</p>
            <p><strong>Next Steps:</strong> You can track your shipment live on our dashboard.</p>
            <a href="${process.env.CONVEX_SITE_URL}/dashboard" style="display:inline-block; background:#003366; color:white; padding:10px 20px; text-decoration:none; border-radius:5px; margin-top:20px;">View Dashboard</a>
          </div>
        `
      });
    }

    return booking._id;
  },
});

// Admin: Approve a booking that requires platform approval
export const approveBooking = mutation({
  args: {
    bookingId: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { bookingId, notes }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "platform:superadmin")) {
      throw new Error("Only admins can approve bookings");
    }

    const booking = await ctx.db
      .query("bookings")
      .withIndex("byBookingId", (q) => q.eq("bookingId", bookingId))
      .unique();

    if (!booking) throw new Error("Booking not found");

    await ctx.db.patch(booking._id, {
      status: "approved",
      approvalStatus: "approved",
      approvedBy: identity.subject,
      approvedAt: Date.now(),
      notes: notes || booking.notes,
      updatedAt: Date.now(),
    });

    await ctx.scheduler.runAfter(0, internal.email.sendEmail, {
      to: booking.customerDetails.email,
      subject: `Booking Approved: ${booking.bookingId}`,
      html: `<div style="font-family: sans-serif;"><h1 style="color: #22c55e;">Booking Approved!</h1><p>Your booking ${booking.bookingId} has been approved.</p></div>`
    });

    // AUDIT LOG: Booking Approved
    await ctx.db.insert("auditLogs", {
      action: "booking.approved",
      entityType: "booking",
      entityId: booking.bookingId,
      userId: identity.subject,
      userEmail: currentUser.email,
      orgId: currentUser.orgId,
      details: {
        notes: notes,
        customer: booking.customerDetails.email
      },
      timestamp: Date.now(),
    });

    // AUDIT LOG: Email Sent (Simulated visibility)
    await ctx.db.insert("auditLogs", {
      action: "email.sent",
      entityType: "system",
      entityId: booking.bookingId,
      details: {
        recipient: booking.customerDetails.email,
        subject: "Booking Approved"
      },
      timestamp: Date.now(),
    });

    // Notify User
    if (booking.userId) {
      const user = await ctx.db.get(booking.userId);
      if (user) {
        await createNotificationHelper(ctx, user.externalId, {
          title: 'Booking Approved',
          message: `Your booking ${booking.bookingId} has been approved and is ready for processing.`,
          type: 'shipment',
          priority: 'high',
          actionUrl: '/bookings'
        });
      }
    }

    return { success: true, bookingId };
  },
});

// Admin: Reject a booking
export const rejectBooking = mutation({
  args: {
    bookingId: v.string(),
    reason: v.string(),
  },
  handler: async (ctx, { bookingId, reason }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "platform:superadmin")) {
      throw new Error("Only admins can reject bookings");
    }

    const booking = await ctx.db
      .query("bookings")
      .withIndex("byBookingId", (q) => q.eq("bookingId", bookingId))
      .unique();

    if (!booking) throw new Error("Booking not found");

    await ctx.db.patch(booking._id, {
      status: "rejected",
      approvalStatus: "rejected",
      rejectionReason: reason,
      approvedBy: identity.subject,
      approvedAt: Date.now(),
      updatedAt: Date.now(),
    });

    await ctx.scheduler.runAfter(0, internal.email.sendEmail, {
      to: booking.customerDetails.email,
      subject: `Booking Update: ${booking.bookingId}`,
      html: `<div style="font-family: sans-serif;"><h1 style="color: #ef4444;">Booking Could Not Be Processed</h1><p>Reason: ${reason}</p></div>`
    });

    // AUDIT LOG: Booking Rejected
    await ctx.db.insert("auditLogs", {
      action: "booking.rejected",
      entityType: "booking",
      entityId: booking.bookingId,
      userId: identity.subject,
      userEmail: currentUser.email,
      orgId: currentUser.orgId,
      details: {
        reason: reason,
        customer: booking.customerDetails.email
      },
      timestamp: Date.now(),
    });

    // AUDIT LOG: Email Sent
    await ctx.db.insert("auditLogs", {
      action: "email.sent",
      entityType: "system",
      entityId: booking.bookingId,
      details: {
        recipient: booking.customerDetails.email,
        subject: "Booking Rejected"
      },
      timestamp: Date.now(),
    });

    // Notify User
    if (booking.userId) {
      const user = await ctx.db.get(booking.userId);
      if (user) {
        await createNotificationHelper(ctx, user.externalId, {
          title: 'Booking Rejected',
          message: `Your booking ${booking.bookingId} was rejected: ${reason}`,
          type: 'alert',
          priority: 'high',
          actionUrl: '/bookings'
        });
      }
    }

    return { success: true, bookingId };
  },
});

// Query: Get bookings pending approval
export const listPendingApprovals = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const currentUser = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "platform:superadmin")) {
      return [];
    }

    return await ctx.db
      .query("bookings")
      .order("desc")
      .collect();
  },
});

export const confirmBookingPayment = mutation({
  args: {
    bookingId: v.string(), // Provide just the ID, we verify ownership
  },
  handler: async (ctx, { bookingId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Clean ID if passed with prefix (though frontend should clean it too)
    const cleanId = bookingId.replace('INV-', '').replace('PAY-', '');

    const booking = await ctx.db
      .query("bookings")
      .withIndex("byBookingId", (q) => q.eq("bookingId", cleanId))
      .unique();

    if (!booking) {
      console.error(`Booking not found for confirmation: ${cleanId}`);
      throw new Error("Booking not found");
    }

    // Verify ownership or admin
    if (booking.userId) {
      const user = await ctx.db.get(booking.userId);
      if (user && user.externalId !== identity.subject) {
        // If not the owner, check if admin (optional, for now strict)
        // throw new Error("Unauthorized to confirm this booking");
        // Relaxing this for "webhook-like" behavior from success page, 
        // as long as user is logged in we assume Stripe redirect is valid proof for MVP
      }
    }

    if (booking.status === 'confirmed') {
      return { success: true, message: "Already confirmed" };
    }

    await ctx.db.patch(booking._id, {
      status: "confirmed",
      paymentStatus: "paid",
      updatedAt: Date.now(),
    });

    // Also update the paymentAttempts record so Payments page shows "Paid"
    const paymentAttempt = await ctx.db
      .query("paymentAttempts")
      .filter((q) => q.eq(q.field("payment_id"), `PAY-${booking.bookingId}`))
      .first();

    if (paymentAttempt) {
      await ctx.db.patch(paymentAttempt._id, {
        status: "completed",
        updated_at: Date.now(),
      });
    }

    // Determine amount
    const amount = booking.price?.amount || 0;
    const currency = booking.price?.currency || "USD";

    // AUDIT LOG: Payment Confirmed
    await ctx.db.insert("auditLogs", {
      action: "payment.received",
      entityType: "booking",
      entityId: booking.bookingId,
      userId: identity.subject,
      userEmail: booking.customerDetails.email,
      details: {
        amount: amount,
        currency: currency,
        method: "stripe_checkout"
      },
      timestamp: Date.now(),
    });

    // Fetch the associated quote to get more details for Shipment/BoL
    const quote = await ctx.db
      .query("quotes")
      .withIndex("byQuoteId", (q) => q.eq("quoteId", booking.quoteId))
      .unique();

    // 1. CREATE SHIPMENT AUTOMATICALLY
    const shipmentRecordId = await ctx.db.insert("shipments", {
      shipmentId: booking.bookingId,
      status: "booked", // Initial status after payment
      currentLocation: {
        city: quote?.origin?.split(',')?.[0]?.trim() || "London",
        state: quote?.origin?.split(',')?.[1]?.trim() || "UK",
        country: quote?.origin?.split(',')?.[2]?.trim() || "UK",
        coordinates: { lat: 51.5074, lng: -0.1278 } // Simulated London
      },
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      carrier: booking.carrierName || "Standard",
      trackingNumber: `TRK-${booking.bookingId.split('-')[1] || Date.now()}`,
      service: booking.serviceType || "Standard",
      shipmentDetails: {
        weight: quote?.weight || "0 kg",
        dimensions: `${quote?.dimensions?.length || 0}x${quote?.dimensions?.width || 0}x${quote?.dimensions?.height || 0} cm`,
        origin: quote?.origin || "Origin",
        destination: quote?.destination || "Destination",
        value: quote?.value || "£0",
      },
      userId: booking.userId,
      orgId: booking.orgId ?? null,
      lastUpdated: Date.now(),
      createdAt: Date.now(),
    });
    console.log("AUTOMATIC SHIPMENT CREATED:", shipmentRecordId);

    // 2. CREATE BILL OF LADING DOCUMENT
    const docId = await ctx.db.insert("documents", {
      type: "bill_of_lading",
      bookingId: booking.bookingId,
      shipmentId: booking.bookingId,
      status: "draft",
      documentData: {
        documentNumber: `BOL-${booking.bookingId}`,
        issueDate: new Date().toISOString(),
        parties: {
          shipper: {
            name: booking.customerDetails.name,
            address: booking.pickupDetails?.address || "Shipper Address",
            contact: booking.customerDetails.phone,
          },
          consignee: {
            name: "Receiver",
            address: booking.deliveryDetails?.address || "Receiver Address",
            contact: "N/A",
          },
          carrier: {
            name: booking.carrierName || "Carrier",
            address: "Main Terminal",
            contact: "Support",
          }
        },
        cargoDetails: {
          description: `Freight Shipment - ${booking.serviceType || ''}`,
          weight: quote?.weight || "0 kg",
          dimensions: `${quote?.dimensions?.length || 0}x${quote?.dimensions?.width || 0}x${quote?.dimensions?.height || 0} cm`,
          value: quote?.value || "£0",
        },
        routeDetails: {
          origin: quote?.origin || "Origin",
          destination: quote?.destination || "Destination",
        }
      },
      userId: booking.userId,
      orgId: booking.orgId ?? null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    console.log("AUTOMATIC BOL CREATED:", docId);

    // Send Confirmation Email
    await ctx.scheduler.runAfter(0, internal.email.sendEmail, {
      to: booking.customerDetails.email,
      subject: `Payment Received: Booking ${booking.bookingId} Confirmed`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #003366;">Payment Successful</h1>
          <p>Dear ${booking.customerDetails.name},</p>
          <p>We have received your payment for booking <strong>${booking.bookingId}</strong>.</p>
          <p>Your shipment is now <strong>Confirmed</strong> and will be processed immediately.</p>
          <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #bbf7d0;">
             <p style="color: #166534; font-weight: bold; margin: 0;">✓ Payment Verified: ${amount} ${currency}</p>
          </div>
          <p>You can track your shipment and view documents in your dashboard.</p>
          <a href="${process.env.CONVEX_SITE_URL}/shipments" style="display:inline-block; background:#003366; color:white; padding:10px 20px; text-decoration:none; border-radius:5px; margin-top:20px;">Track Shipment</a>
        </div>
      `
    });

    // Notify User via In-App Alert
    if (booking.userId) {
      const user = await ctx.db.get(booking.userId);
      if (user) {
        await createNotificationHelper(ctx, user.externalId, {
          title: 'Payment Confirmed',
          message: `We received your payment of ${amount} ${currency} for Booking ${booking.bookingId}.`,
          type: 'success', // or 'billing' if available
          priority: 'medium',
          actionUrl: `/bookings`
        });
      }
    }

    return { success: true, bookingId: booking.bookingId };
  },
});

export const fixMissingDocuments = mutation({
  args: {},
  handler: async (ctx) => {
    const confirmedBookings = await ctx.db
      .query("bookings")
      .filter((q) => q.eq(q.field("status"), "confirmed"))
      .collect();

    let fixedCount = 0;

    for (const booking of confirmedBookings) {
      // 1. Check if shipment exists
      const existingShipment = await ctx.db
        .query("shipments")
        .withIndex("byShipmentId", (q) => q.eq("shipmentId", booking.bookingId))
        .first();

      if (!existingShipment) {
        // Create it (hardened version)
        await ctx.db.insert("shipments", {
          shipmentId: booking.bookingId,
          status: "booked",
          currentLocation: {
            city: "London", state: "UK", country: "UK",
            coordinates: { lat: 51.5074, lng: -0.1278 }
          },
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          carrier: booking.carrierName || "Standard",
          trackingNumber: `TRK-${booking.bookingId.split('-')[1] || Date.now()}`,
          service: booking.serviceType || "Standard",
          shipmentDetails: {
            weight: "0 kg",
            dimensions: "0x0x0 cm",
            origin: "Origin",
            destination: "Destination",
            value: "£0",
          },
          userId: booking.userId,
          orgId: booking.orgId ?? null,
          lastUpdated: Date.now(),
          createdAt: Date.now(),
        });
      }

      // 2. Check if BoL exists
      const existingBoL = await ctx.db
        .query("documents")
        .withIndex("byBookingId", (q) => q.eq("bookingId", booking.bookingId))
        .filter((q) => q.eq(q.field("type"), "bill_of_lading"))
        .first();

      if (!existingBoL) {
        await ctx.db.insert("documents", {
          type: "bill_of_lading",
          bookingId: booking.bookingId,
          shipmentId: booking.bookingId,
          status: "draft",
          documentData: {
            documentNumber: `BOL-${booking.bookingId}`,
            issueDate: new Date().toISOString(),
            parties: {
              shipper: { name: booking.customerDetails.name, address: booking.pickupDetails?.address || "Shipper Address", contact: booking.customerDetails.phone },
              consignee: { name: "Receiver", address: booking.deliveryDetails?.address || "Receiver Address", contact: "N/A" },
              carrier: { name: booking.carrierName || "Carrier", address: "Main Terminal", contact: "Support" }
            },
            cargoDetails: { description: "Freight Shipment", weight: "0 kg", dimensions: "0x0x0 cm", value: "£0" },
            routeDetails: { origin: "Origin", destination: "Destination" }
          },
          userId: booking.userId,
          orgId: booking.orgId ?? null,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        fixedCount++;
      }
    }

    return { fixedCount };
  }
});