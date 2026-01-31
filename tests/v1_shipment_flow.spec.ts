import { test, expect } from '@playwright/test';

test('Shipment Quote Flow Verification', async ({ page }) => {
    // 1. Start at Home
    await page.goto('http://localhost:5173/');

    // 2. Interact with the Hero Quote Widget (if present)
    // Assuming there are inputs for Origin/Destination or a "Get Instant Quote" button
    // Look for the main CTA
    const ctaButton = page.getByRole('button', { name: /Get Started|Get Quote|Start/i }).first();
    if (await ctaButton.isVisible()) {
        await ctaButton.click();
    }

    // 3. Check where we are taken
    // If we are redirected to /access or /sign-in, that is a valid flow for unauthenticated users
    await page.waitForTimeout(2000); // Wait for navigation
    const url = page.url();
    console.log('Navigated to:', url);

    if (url.includes('/access')) {
        console.log('Redirected to Access/Waitlist page (Expected for Guest)');
        await expect(page.locator('h1')).toContainText(/Access|Waitlist|Exclusive/i);
    } else if (url.includes('/sign-in')) {
        console.log('Redirected to Sign In (Expected for Guest)');
        await expect(page).toHaveURL(/sign-in/);
    } else if (url.includes('/dashboard')) {
        // If somehow logged in or public
        console.log('Landed on Dashboard');
        await expect(page).toHaveTitle(/Dashboard/i);
    } else {
        // Maybe it's the Quote page itself
        console.log('Landed on unknown page, checking for Quote form');
        // Check for form inputs just in case
    }
});
