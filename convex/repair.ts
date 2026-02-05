import { mutation } from "./_generated/server";
import { v } from "convex/values";

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
                // Create it (simplified, similar to confirmBookingPayment)
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
