import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Generate a short unique token for a batch QR page.
// This is a local generation, not an external QR API.
export function generateBatchToken(): string {
  let token = "";
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let i = 0; i < 8; i++) {
    token += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return token;
}

// Get a batch by token (public/privacy-safe summary used by the QR page).
export const getBatchByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const batch = await ctx.db
      .query("batch_records")
      .withIndex("by_qr_token", (q) => q.eq("qrToken", args.token))
      .first();

    if (!batch) {
      return null;
    }

    const feedstock = await ctx.db.get(batch.feedstockTypeId);
    const eventsBuilder = ctx.db
      .query("traceability_events")
      .withIndex("by_batch", (q) => q.eq("batchId", batch._id));

    const events = await eventsBuilder.take(50);

    return {
      batchId: batch._id,
      batchNumber: batch.batchNumber,
      title: batch.title,
      quantity: batch.quantity,
      unit: batch.unit,
      collectionDate: batch.collectionDate,
      storageNote: batch.storageNote,
      status: batch.status,
      isDemo: batch.isDemo,
      feedstock: feedstock
        ? {
            _id: feedstock._id,
            name: feedstock.name,
            commonNames: feedstock.commonNames,
            category: feedstock.category,
          }
        : null,
      events: (events ?? [])
        .filter((event) => event.batchId === batch._id)
        .map((event) => ({
          _id: event._id,
          type: event.type,
          note: event.note,
          location: event.location,
          evidenceLevel: event.evidenceLevel,
          createdAt: event.createdAt,
        })),
    };
  },
});

// Create a batch (organisations only).
export const createBatch = mutation({
  args: {
    feedstockTypeId: v.id("feedstock_types"),
    batchNumber: v.string(),
    title: v.string(),
    quantity: v.number(),
    unit: v.string(),
    collectionDate: v.number(),
    storageNote: v.optional(v.string()),
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

    if (args.quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }

    if (args.collectionDate <= 0) {
      throw new Error("Collection date must be a valid timestamp");
    }

    const token = generateBatchToken();
    let attemptToken = token;
    let attempts = 1;
    // Avoid token collisions by ensuring uniqueness.
    while (
      (await ctx.db
        .query("batch_records")
        .withIndex("by_qr_token", (q) => q.eq("qrToken", attemptToken))
        .first()) !== null
    ) {
      attemptToken = token + "-" + attempts;
      attempts += 1;
    }

    const batchId = await ctx.db.insert("batch_records", {
      organisationId: membership.organisationId,
      listingId: undefined as unknown as undefined,
      feedstockTypeId: args.feedstockTypeId,
      batchNumber: args.batchNumber,
      title: args.title,
      quantity: args.quantity,
      unit: args.unit,
      collectionDate: args.collectionDate,
      storageNote: args.storageNote ?? undefined,
      status: "collected",
      qrToken: attemptToken,
      isDemo: false,
    });

    // Add an initial traceability event.
    await ctx.db.insert("traceability_events", {
      batchId: batchId,
      type: "created",
      actorId: userId,
      actorOrgId: membership.organisationId,
      note: "Batch created",
      createdAt: Date.now(),
    });

    return { batchId, qrToken: attemptToken };
  },
});

// Add a traceability event to a batch (append-only).
export const addTraceabilityEvent = mutation({
  args: {
    batchId: v.id("batch_records"),
    type: v.string(),
    note: v.optional(v.string()),
    location: v.optional(v.string()),
    evidenceLevel: v.optional(v.string()),
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

    const batch = await ctx.db.get(args.batchId);
    if (!batch) {
      throw new Error("Batch not found");
    }

    if (batch.organisationId !== membership.organisationId) {
      throw new Error("Forbidden: not your organisation's batch");
    }

    await ctx.db.insert("traceability_events", {
      batchId: args.batchId,
      type: args.type,
      actorId: userId,
      actorOrgId: membership.organisationId,
      note: args.note ?? undefined,
      location: args.location ?? undefined,
      data: undefined as unknown as undefined,
      evidenceLevel: args.evidenceLevel ?? "supplier_declared",
      createdAt: Date.now(),
    });

    return args.batchId;
  },
});
