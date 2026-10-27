import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Feedstock type lookup helper (kept separate for reuse).
export const feedstockType = query({
  args: { id: v.id("feedstock_types") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.id);
  },
});

// Get a single listing with feedstock info.
export const getListing = query({
  args: { id: v.id("listings") },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.id);
    if (!listing) {
      return null;
    }
    const feedstock = await ctx.db.get(listing.feedstockTypeId);
    return { ...listing, feedstock };
  },
});

// Public marketplace browsing: published + active listings.
export const listMarketplaceListings = query({
  args: {
    limit: v.number(),
    status: v.optional(v.string()),
    region: v.optional(v.string()),
    category: v.optional(v.string()),
    feedstockTypeId: v.optional(v.id("feedstock_types")),
  },
  handler: async (ctx, args) => {
    // Start from active listings, then filter in JS for the other criteria.
    const builder = ctx.db
      .query("listings")
      .withIndex("by_is_active", (q) => q.eq("isActive", true));

    const items = await builder.take(args.limit * 2);

    const expectedStatus = args.status ?? "published";

    return (items ?? [])
      .filter((item) => item.status === expectedStatus)
      .filter((item) => {
        if (args.region && item.region !== args.region) {
          return false;
        }
        if (args.category && item.category !== args.category) {
          return false;
        }
        if (args.feedstockTypeId && item.feedstockTypeId !== args.feedstockTypeId) {
          return false;
        }
        return true;
      })
      .slice(0, args.limit)
      .map((item) => ({
        _id: item._id,
        organisationId: item.organisationId,
        createdBy: item.createdBy,
        feedstockTypeId: item.feedstockTypeId,
        title: item.title,
        description: item.description,
        category: item.category,
        region: item.region,
        pickupLocation: item.pickupLocation,
        pickupPostcode: item.pickupPostcode,
        availableQuantity: item.availableQuantity,
        unit: item.unit,
        pricePerUnit: item.pricePerUnit,
        currency: item.currency,
        pricing: item.pricing,
        moisturePercent: item.moisturePercent,
        contaminationNote: item.contaminationNote,
        formOrParticleSize: item.formOrParticleSize,
        storageConditions: item.storageConditions,
        collectionWindow: item.collectionWindow,
        minimumOrderQuantity: item.minimumOrderQuantity,
        deliveryOptions: item.deliveryOptions,
        deliveryTerms: item.deliveryTerms,
        isActive: item.isActive,
        status: item.status,
        isDemo: item.isDemo,
        declinedReviewCount: item.declinedReviewCount,
      }));
  },
});

// A supplier's own listings (for "my listings").
export const listMyListings = query({
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

    // Use the organisation index only; filter by createdBy + status in JS.
    const builder = ctx.db
      .query("listings")
      .withIndex("by_organisation", (q) => q.eq("organisationId", membership.organisationId));

    const items = await builder.take(args.limit * 2);

    const expectedStatus = args.status ?? "draft";

    return (items ?? [])
      .filter((item) => item.createdBy === userId)
      .filter((item) => item.status === expectedStatus)
      .slice(0, args.limit)
      .map((item) => ({
        _id: item._id,
        organisationId: item.organisationId,
        createdBy: item.createdBy,
        feedstockTypeId: item.feedstockTypeId,
        title: item.title,
        description: item.description,
        category: item.category,
        region: item.region,
        pickupLocation: item.pickupLocation,
        pickupPostcode: item.pickupPostcode,
        availableQuantity: item.availableQuantity,
        unit: item.unit,
        pricePerUnit: item.pricePerUnit,
        currency: item.currency,
        pricing: item.pricing,
        moisturePercent: item.moisturePercent,
        contaminationNote: item.contaminationNote,
        formOrParticleSize: item.formOrParticleSize,
        storageConditions: item.storageConditions,
        collectionWindow: item.collectionWindow,
        minimumOrderQuantity: item.minimumOrderQuantity,
        deliveryOptions: item.deliveryOptions,
        deliveryTerms: item.deliveryTerms,
        isActive: item.isActive,
        status: item.status,
        isDemo: item.isDemo,
        declinedReviewCount: item.declinedReviewCount,
      }));
  },
});

// Create a draft listing for the authenticated supplier organisation.
export const createListing = mutation({
  args: {
    feedstockTypeId: v.id("feedstock_types"),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    region: v.string(),
    pickupLocation: v.string(),
    pickupPostcode: v.optional(v.string()),
    availableQuantity: v.number(),
    unit: v.string(),
    pricePerUnit: v.optional(v.number()),
    currency: v.string(),
    pricing: v.string(),
    moisturePercent: v.optional(v.number()),
    contaminationNote: v.optional(v.string()),
    formOrParticleSize: v.optional(v.string()),
    storageConditions: v.optional(v.string()),
    collectionWindow: v.optional(v.string()),
    minimumOrderQuantity: v.optional(v.number()),
    deliveryOptions: v.array(v.string()),
    deliveryTerms: v.optional(v.string()),
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

    const feedstock = await ctx.db.get(args.feedstockTypeId);
    if (!feedstock) {
      throw new Error("Feedstock type not found");
    }

    if (args.title.trim().length === 0 || args.description.trim().length === 0) {
      throw new Error("Title and description are required");
    }

    if (args.availableQuantity <= 0) {
      throw new Error("Available quantity must be greater than zero");
    }

    return await ctx.db.insert("listings", {
      organisationId: membership.organisationId,
      createdBy: userId,
      feedstockTypeId: args.feedstockTypeId,
      title: args.title,
      description: args.description,
      category: args.category,
      region: args.region,
      pickupLocation: args.pickupLocation,
      pickupPostcode: args.pickupPostcode ?? undefined,
      availableQuantity: args.availableQuantity,
      unit: args.unit,
      pricePerUnit: args.pricePerUnit ?? undefined,
      currency: args.currency,
      pricing: args.pricing,
      moisturePercent: args.moisturePercent ?? undefined,
      contaminationNote: args.contaminationNote ?? undefined,
      formOrParticleSize: args.formOrParticleSize ?? undefined,
      storageConditions: args.storageConditions ?? undefined,
      collectionWindow: args.collectionWindow ?? undefined,
      minimumOrderQuantity: args.minimumOrderQuantity ?? undefined,
      deliveryOptions: args.deliveryOptions,
      deliveryTerms: args.deliveryTerms ?? undefined,
      isActive: true,
      status: "draft",
      isDemo: false,
      declinedReviewCount: 0,
    });
  },
});

// Update a draft listing (owner organisation, draft only).
export const updateListing = mutation({
  args: {
    id: v.id("listings"),
    patch: v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      region: v.optional(v.string()),
      pickupLocation: v.optional(v.string()),
      pickupPostcode: v.optional(v.string()),
      availableQuantity: v.optional(v.number()),
      unit: v.optional(v.string()),
      pricePerUnit: v.optional(v.number()),
      currency: v.optional(v.string()),
      pricing: v.optional(v.string()),
      moisturePercent: v.optional(v.number()),
      contaminationNote: v.optional(v.string()),
      formOrParticleSize: v.optional(v.string()),
      storageConditions: v.optional(v.string()),
      collectionWindow: v.optional(v.string()),
      minimumOrderQuantity: v.optional(v.number()),
      deliveryOptions: v.optional(v.array(v.string())),
      deliveryTerms: v.optional(v.string()),
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

    const listing = await ctx.db.get(args.id);
    if (!listing) {
      throw new Error("Listing not found");
    }

    if (listing.organisationId !== membership.organisationId) {
      throw new Error("Forbidden: not your organisation's listing");
    }

    if (listing.status !== "draft") {
      throw new Error("Only draft listings can be edited");
    }

    await ctx.db.patch(args.id, args.patch);
    return args.id;
  },
});

// Publish a listing (owner organisation, draft only, validation applied).
export const publishListing = mutation({
  args: { id: v.id("listings") },
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

    const listing = await ctx.db.get(args.id);
    if (!listing) {
      throw new Error("Listing not found");
    }

    if (listing.organisationId !== membership.organisationId) {
      throw new Error("Forbidden: not your organisation's listing");
    }

    if (listing.status !== "draft") {
      throw new Error("Only draft listings can be published");
    }

    if (listing.title.trim().length === 0 || listing.description.trim().length === 0) {
      throw new Error("Title and description are required");
    }

    if (listing.availableQuantity <= 0) {
      throw new Error("Available quantity must be greater than zero");
    }

    await ctx.db.patch(args.id, {
      status: "published",
      isActive: true,
    });

    return args.id;
  },
});

// Archive a listing (owner organisation).
export const archiveListing = mutation({
  args: { id: v.id("listings") },
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

    const listing = await ctx.db.get(args.id);
    if (!listing) {
      throw new Error("Listing not found");
    }

    if (listing.organisationId !== membership.organisationId) {
      throw new Error("Forbidden: not your organisation's listing");
    }

    await ctx.db.patch(args.id, {
      isActive: false,
      status: "archived",
    });

    return args.id;
  },
});

// Reserve quantity from a listing into an order item.
export const reserveInventory = mutation({
  args: {
    listingId: v.id("listings"),
    quantity: v.number(),
    unit: v.string(),
    reservedForOrderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.listingId);
    if (!listing) {
      throw new Error("Listing not found");
    }

    if (listing.unit !== args.unit) {
      throw new Error("Unit mismatch");
    }

    if (listing.availableQuantity < args.quantity) {
      throw new Error("Not enough available inventory");
    }

    await ctx.db.patch(args.listingId, {
      availableQuantity: listing.availableQuantity - args.quantity,
    });

    await ctx.db.insert("inventory_snapshots", {
      listingId: args.listingId,
      quantity: args.quantity,
      unit: args.unit,
      reservedForOrderId: args.reservedForOrderId,
      createdAt: Date.now(),
      isDemo: false,
    });

    return { remaining: listing.availableQuantity - args.quantity };
  },
});

// Release reserved inventory back to a listing.
export const releaseInventory = mutation({
  args: {
    listingId: v.id("listings"),
    quantity: v.number(),
    unit: v.string(),
    releasedFromOrderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.listingId);
    if (!listing) {
      throw new Error("Listing not found");
    }

    if (listing.unit !== args.unit) {
      throw new Error("Unit mismatch");
    }

    const snapshots = await ctx.db
      .query("inventory_snapshots")
      .withIndex("by_reserved_for", (q) =>
        q.eq("reservedForOrderId", args.releasedFromOrderId)
      )
      .take(100);

    const reservedForThisOrder = (snapshots ?? [])
      .filter((s) => s.listingId === args.listingId)
      .reduce((sum, s) => sum + s.quantity, 0);

    const toRelease = Math.min(args.quantity, reservedForThisOrder);
    if (toRelease <= 0) {
      return { released: 0 };
    }

    await ctx.db.patch(args.listingId, {
      availableQuantity: listing.availableQuantity + toRelease,
    });

    for (const snapshot of (snapshots ?? []).filter(
      (s) => s.listingId === args.listingId
    )) {
      await ctx.db.patch(snapshot._id, {
        reservedForOrderId: undefined,
      });
    }

    return { released: toRelease };
  },
});
