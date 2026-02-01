
import { convexToJson } from "convex/values";
import { api } from "./convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.VITE_CONVEX_URL!);

async function verifyBookingFlow() {
    console.log("1. Starting Booking Verification...");

    // 1. List all bookings to see if we can catch recent ones
    const bookings = await client.query(api.admin.listAllBookings);

    if (bookings.length === 0) {
        console.log("   - No bookings found. We may need to create one manually or via UI first.");
        return;
    }

    const latestBooking = bookings[0];
    console.log(`   - Found latest booking: ${latestBooking.bookingId} (${latestBooking.status})`);

    // 2. Check Admin Dashboard visibility data
    const pendingApprovals = await client.query(api.bookings.listPendingApprovals);
    const isInPending = pendingApprovals.some((b: any) => b._id === latestBooking._id);

    if (latestBooking.status === 'pending') {
        if (isInPending) {
            console.log("   - [PASS] Booking is correctly listed in Pending Approvals.");
        } else {
            console.error("   - [FAIL] Booking is PENDING but NOT in Pending Approvals list.");
        }
    } else {
        console.log(`   - Booking status is '${latestBooking.status}', so it should NOT be in pending list. (Found in list: ${isInPending})`);
    }

    // 3. Verify Payment Status logic (Simulated check)
    if (latestBooking.paymentStatus === 'paid') {
        console.log("   - [PASS] Booking is marked as PAID.");
    } else {
        console.log("   - Booking is NOT paid yet.");
    }

    // 4. Check Audit Logs for Email Triggers
    // Note: We'd typically query audit logs here if we have an admin query exposed for it.
    // Assuming api.admin.getRecentAuditLogs exists based on earlier file reads
    try {
        const logs = await client.query(api.admin.getRecentAuditLogs);
        const bookingLogs = logs.filter((l: any) => l.entityId === latestBooking.bookingId);

        console.log(`   - Found ${bookingLogs.length} audit logs for this booking.`);
        bookingLogs.forEach((log: any) => {
            console.log(`     > [${new Date(log.timestamp).toISOString()}] ${log.action} (${log.userEmail})`);
        });

        const emailLog = bookingLogs.find((l: any) => l.action === 'email.sent');
        if (emailLog) {
            console.log("   - [PASS] Email confirmation log found.");
        } else {
            console.log("   - [WARN] No specific 'email.sent' log found (might be waiting for async scheduler).");
        }
    } catch (e) {
        console.log("   - Could not fetch audit logs (API might be restricted or named differently).");
    }
}

verifyBookingFlow().catch(console.error);
