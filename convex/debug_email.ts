"use node";
import { action } from "./_generated/server";

export const test = action({
    args: {},
    handler: async (ctx) => {
        const key = process.env.RESEND_API_KEY;
        console.log("Checking Key:", key ? `Exists (${key.slice(0, 5)}...)` : "MISSING");

        if (!key) return "No Key";

        try {
            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${key}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'onboarding@resend.dev',
                    to: 'delivered@resend.dev',
                    subject: 'Debug Test',
                    html: '<p>Test</p>'
                })
            });

            const text = await res.text();
            console.log("Response:", res.status, text);
            return { status: res.status, body: text };
        } catch (e) {
            console.error("Fetch Error:", e);
            return { error: String(e) };
        }
    }
});
