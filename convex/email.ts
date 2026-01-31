"use node";
import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";

// This action safely handles email sending
// If RESEND_API_KEY is present, it calls the API.
// If not, it logs to console (Mock Mode).

export const sendEmail = internalAction({
    args: {
        to: v.string(),
        subject: v.string(),
        html: v.string(),
    },
    handler: async (ctx, args) => {
        const resendKey = process.env.RESEND_API_KEY;

        if (!resendKey) {
            console.log("⚠️ MOCK EMAIL SENT (No API Key):");
            console.log(`To: ${args.to}`);
            console.log(`Subject: ${args.subject}`);
            return { success: true, mode: 'mock' };
        }

        try {
            const Response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${resendKey}`
                },
                body: JSON.stringify({
                    from: 'Acme Logistics <onboarding@resend.dev>', // Default Resend test sender
                    to: [args.to],
                    subject: args.subject,
                    html: args.html,
                })
            });

            if (!Response.ok) {
                const error = await Response.text();
                throw new Error(`Resend API Error: ${error}`);
            }

            const data = await Response.json();
            return { success: true, id: data.id, mode: 'live' };
        } catch (error: any) {
            console.error("Failed to send email:", error);
            throw new Error("Email sending failed");
        }
    },
});
