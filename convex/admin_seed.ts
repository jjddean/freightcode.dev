import { internalMutation } from "./_generated/server";

export const seedContracts = internalMutation({
    args: {},
    handler: async (ctx) => {
        // 1. Clear existing
        const existing = await ctx.db.query("contracts").collect();
        for (const c of existing) await ctx.db.delete(c._id);

        // 2. Insert Standard Contracts (NACs)
        // CNSHA (Shanghai) -> USLAX (Los Angeles)
        await ctx.db.insert("contracts", {
            carrier: "Maersk",
            origin: "CNSHA",
            destination: "USLAX",
            containerType: "40HC",
            price: 2200, // Spot is ~$3200
            // currency, dates
            currency: "USD",
            effectiveDate: "2026-01-01",
            expirationDate: "2026-12-31"
        });

        // CNSHA -> NLRTM (Rotterdam)
        await ctx.db.insert("contracts", {
            carrier: "MSC",
            origin: "CNSHA",
            destination: "NLRTM",
            containerType: "40HC",
            price: 1800,
            currency: "USD",
            effectiveDate: "2026-01-01",
            expirationDate: "2026-12-31"
        });

        return "Seeded 2 Contracts (Maersk & MSC)";
    }
});
