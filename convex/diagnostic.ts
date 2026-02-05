import { query } from "./_generated/server";

export const allDocuments = query({
    args: {},
    handler: async (ctx) => {
        const documents = await ctx.db.query("documents").order("desc").collect();
        return documents.map(d => ({
            id: d._id,
            type: d.type,
            bookingId: d.bookingId,
            userId: d.userId,
            orgId: d.orgId,
            status: d.status,
            number: d.documentData?.documentNumber,
            creationTime: new Date(d._creationTime).toISOString()
        }));
    }
});
