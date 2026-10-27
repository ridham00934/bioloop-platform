import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get a single RFQ with feedstock info.
export const getRFQ = query({
  args: { id: v.id("rfqs") },
  handler: async (ctx, args) => {
    const rfq = await ctx.db.get(args.id);
    if (!rfq) {
      return null;
    }
    const feedstock = await ctx.db.get(rfq.feedstockTypeId);
    return { ...rfq, feedstock };
  },
});

// Buyers: their own RFQs.
export const listMyRFQs = query({
  args: {
    limit: v.number(),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return [];
    }

    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_current_user", (q) => q.eq("userId", userId))
      .first();

    if (!membership) {
      return [];
    }

    const builder = ctx.db
      .query("rfqs")
      .withIndex("by_organisation", (q) =>
        q.eq("organisationId", membership.organisationId)
      );

    const items = await builder.take(args.limit * 2);

    const expectedStatus = args.status ?? "open";

    return (items ?? [])
      .filter((rfq) => rfq.status === expectedStatus)
      .slice(0, args.limit)
      .map((rfq) => ({
        _id: rfq._id,
        organisationId: rfq.organisationId,
        createdBy: rfq.createdBy,
        feedstockTypeId: rfq.feedstockTypeId,
        title: rfq.title,
        description: rfq.description,
      requiredQuantity: rfq.requiredQuantity,
      unit: rfq.unit,
      deliveryRegion: rfq.deliveryRegion,
      maxDeliveryDistanceKm: rfq.maxDeliveryDistanceKm,
      requiredByDate: rfq.requiredByDate,
      budgetCeiling: rfq.budgetCeiling,
      currency: rfq.currency,
      moistureRequirement: rfq.moistureRequirement,
      qualityRequirement: rfq.qualityRequirement,
      visibility: rfq.visibility,
      status: rfq.status,
      allowSplitOrders: rfq.allowSplitOrders,
      isDemo: rfq.isDemo,
    }));
  },
});

// Public marketplace RFQs (suppliers/admins can browse).
export const listPublicRFQs = query({
  args: {
    limit: v.number(),
    status: v.optional(v.string()),
    deliveryRegion: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const builder = ctx.db
      .query("rfqs")
      .withIndex("by_visibility", (q) => q.eq("visibility", "public"));

    const items = await builder.take(args.limit * 2);

    const expectedStatus = args.status ?? "open";

    return (items ?? [])
      .filter((rfq) => rfq.status === expectedStatus)
      .filter((rfq) => {
        if (args.deliveryRegion && rfq.deliveryRegion !== args.deliveryRegion) {
          return false;
        }
        return true;
      })
      .slice(0, args.limit)
      .map((rfq) => ({
        _id: rfq._id,
        organisationId: rfq.organisationId,
        createdBy: rfq.createdBy,
        feedstockTypeId: rfq.feedstockTypeId,
        title: rfq.title,
        description: rfq.description,
      requiredQuantity: rfq.requiredQuantity,
      unit: rfq.unit,
      deliveryRegion: rfq.deliveryRegion,
      maxDeliveryDistanceKm: rfq.maxDeliveryDistanceKm,
      requiredByDate: rfq.requiredByDate,
      budgetCeiling: rfq.budgetCeiling,
      currency: rfq.currency,
      moistureRequirement: rfq.moistureRequirement,
      qualityRequirement: rfq.qualityRequirement,
      visibility: rfq.visibility,
      status: rfq.status,
      allowSplitOrders: rfq.allowSplitOrders,
      isDemo: rfq.isDemo,
    }));
  },
});

// Create an RFQ (buyer organisation or admin).
export const createRFQ = mutation({
  args: {
    feedstockTypeId: v.id("feedstock_types"),
    title: v.string(),
    description: v.string(),
    requiredQuantity: v.number(),
    unit: v.string(),
    deliveryRegion: v.string(),
    maxDeliveryDistanceKm: v.optional(v.number()),
    requiredByDate: v.optional(v.number()),
    budgetCeiling: v.optional(v.number()),
    currency: v.optional(v.string()),
    moistureRequirement: v.optional(v.string()),
    qualityRequirement: v.optional(v.string()),
    visibility: v.string(),
    allowSplitOrders: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_current_user", (q) => q.eq("userId", userId))
      .first();

    if (!membership) {
      throw new Error("No organisation membership found");
    }

    if (membership.role !== "buyer" && membership.role !== "admin") {
      throw new Error("Only buyers and administrators can create RFQs");
    }

    const feedstock = await ctx.db.get(args.feedstockTypeId);
    if (!feedstock) {
      throw new Error("Feedstock type not found");
    }

    if (args.requiredQuantity <= 0) {
      throw new Error("Required quantity must be greater than zero");
    }

    if (args.title.trim().length === 0 || args.description.trim().length === 0) {
      throw new Error("Title and description are required");
    }

    return await ctx.db.insert("rfqs", {
      organisationId: membership.organisationId,
      createdBy: userId,
      feedstockTypeId: args.feedstockTypeId,
      title: args.title,
      description: args.description,
      requiredQuantity: args.requiredQuantity,
      unit: args.unit,
      deliveryRegion: args.deliveryRegion,
      maxDeliveryDistanceKm: args.maxDeliveryDistanceKm ?? undefined,
      requiredByDate: args.requiredByDate ?? undefined,
      budgetCeiling: args.budgetCeiling ?? undefined,
      currency: args.currency ?? "USD",
      moistureRequirement: args.moistureRequirement ?? undefined,
      qualityRequirement: args.qualityRequirement ?? undefined,
      visibility: args.visibility,
      status: "open",
      allowSplitOrders: args.allowSplitOrders,
      isDemo: false,
    });
  },
});

// Update an RFQ (buyer org, open only).
export const updateRFQ = mutation({
  args: {
    id: v.id("rfqs"),
    patch: v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      requiredQuantity: v.optional(v.number()),
      unit: v.optional(v.string()),
      deliveryRegion: v.optional(v.string()),
      maxDeliveryDistanceKm: v.optional(v.number()),
      requiredByDate: v.optional(v.number()),
      budgetCeiling: v.optional(v.number()),
      currency: v.optional(v.string()),
      moistureRequirement: v.optional(v.string()),
      qualityRequirement: v.optional(v.string()),
      visibility: v.optional(v.string()),
      allowSplitOrders: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_current_user", (q) => q.eq("userId", userId))
      .first();

    if (!membership) {
      throw new Error("No organisation membership found");
    }

    const rfq = await ctx.db.get(args.id);
    if (!rfq) {
      throw new Error("RFQ not found");
    }

    if (rfq.organisationId !== membership.organisationId) {
      throw new Error("Forbidden: not your organisation's RFQ");
    }

    if (rfq.status !== "open") {
      throw new Error("Only open RFQs can be edited");
    }

    await ctx.db.patch(args.id, args.patch);
    return args.id;
  },
});

// Close an RFQ (buyer org, open only).
export const closeRFQ = mutation({
  args: { id: v.id("rfqs") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_current_user", (q) => q.eq("userId", userId))
      .first();

    if (!membership) {
      throw new Error("No organisation membership found");
    }

    const rfq = await ctx.db.get(args.id);
    if (!rfq) {
      throw new Error("RFQ not found");
    }

    if (rfq.organisationId !== membership.organisationId) {
      throw new Error("Forbidden: not your organisation's RFQ");
    }

    if (rfq.status !== "open") {
      throw new Error("Only open RFQs can be closed");
    }

    await ctx.db.patch(args.id, { status: "closed" });
    return args.id;
  },
});
