import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const cacheRoute = mutation({
  args: {
    origin: v.string(),
    dest: v.string(),
    profile: v.optional(v.string()),
    points: v.array(v.object({ lat: v.number(), lng: v.number() })),
    distance: v.optional(v.number()),
    duration: v.optional(v.number()),
    ttlMs: v.optional(v.number()),
  },
  handler: async (ctx, { origin, dest, profile, points, distance, duration, ttlMs }) => {
    const key = `${(profile || 'car')}::${origin}=>${dest}`
    const now = Date.now()
    const expiresAt = now + (ttlMs ?? 7 * 24 * 60 * 60 * 1000)
    const existing = await ctx.db.query('geoRoutes').withIndex('byKey', q => q.eq('key', key)).unique()
    if (existing) {
      await ctx.db.patch(existing._id, { points, distance, duration, updatedAt: now, expiresAt })
      return existing._id
    }
    return await ctx.db.insert('geoRoutes', { key, origin, dest, profile: profile || 'car', points, distance, duration, createdAt: now, updatedAt: now, expiresAt })
  },
})

export const getCachedRoute = query({
  args: { origin: v.string(), dest: v.string(), profile: v.optional(v.string()) },
  handler: async (ctx, { origin, dest, profile }) => {
    const key = `${(profile || 'car')}::${origin}=>${dest}`
    const row = await ctx.db.query('geoRoutes').withIndex('byKey', q => q.eq('key', key)).unique()
    if (!row) return null
    if (row.expiresAt && row.expiresAt < Date.now()) return null
    return row
  }
})

export const getRouteRiskAssessment: any = action({
  args: {
    origin: v.string(),
    destination: v.string(),
    waypoints: v.array(v.string()),
    originCountry: v.optional(v.string()),
    destCountry: v.optional(v.string()),
    originCoords: v.optional(v.object({ lat: v.number(), lon: v.number() })),
    destCoords: v.optional(v.object({ lat: v.number(), lon: v.number() })),
    parties: v.optional(v.array(v.object({
      name: v.string(),
      type: v.optional(v.string())
    })))
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Delegate to new georisk module
    const result: any = await ctx.runAction(api.georisk.assessRouteRisk, {
      origin: args.origin,
      destination: args.destination,
      originCountry: args.originCountry || 'GB', // Default
      destCountry: args.destCountry || 'US', // Default
      originCoords: args.originCoords,
      destCoords: args.destCoords,
      transitPoints: args.waypoints,
      parties: args.parties
    });

    return {
      score: result.score,
      level: result.level,
      advisory: result.advisory,
      lastUpdated: result.lastUpdated,
    };
  },
});


