import type { QueryCtx, MutationCtx } from "./_generated/server";

/**
 * Get the current user's organization ID from their JWT token
 * Returns undefined if user is not in an organization (personal account)
 */
export async function getCurrentOrgId(ctx: QueryCtx | MutationCtx): Promise<string | undefined> {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return undefined;

    // Clerk includes orgId in the JWT when user has an active organization
    // It's available as a custom claim
    const orgId = (identity as any).org_id;
    return orgId;
}

/**
 * Get current user with their organization context
 */
export async function getCurrentUserWithOrg(ctx: QueryCtx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
        .query("users")
        .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
        .unique();

    const orgId = (identity as any).org_id;

    return {
        user,
        orgId,
        isAuthenticated: true,
    };
}

/**
 * Check if current user is a platform admin (superadmin)
 */
export async function isPlatformAdmin(ctx: QueryCtx): Promise<boolean> {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const user = await ctx.db
        .query("users")
        .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
        .unique();

    return user?.role === "platform:superadmin";
}

/**
 * Require authentication - throws if not logged in
 */
export async function requireAuth(ctx: QueryCtx | MutationCtx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        throw new Error("Not authenticated");
    }
    return identity;
}

/**
 * Require organization membership - throws if not in an org
 */
export async function requireOrgMembership(ctx: QueryCtx | MutationCtx) {
    const identity = await requireAuth(ctx);
    const orgId = (identity as any).org_id;

    if (!orgId) {
        throw new Error("No active organization. Please select or create an organization.");
    }

    return { identity, orgId };
}
