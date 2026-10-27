import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

// Get a single quote with RFQ/listing/batch info.
export const getQuote = query({
  args: { id: v.id("quotes") },
  handler: async (ctx, args) => {
    const quote = await ctx.db.get(args.id);
    if (!quote) {
      return null;
    }
    const rfq = await ctx.db.get(quote.rfqId);
    const listing = quote.listingId ? await ctx.db.get(quote.listingId) : null;
    const batch = quote.batchId ? await ctx.db.get(quote.batchId) : null;
    return { ...quote, rfq, listing, batch };
  },
});

// Buyers: quotes on their RFQs.
export const listMyQuotes = query({
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

    // Buyers see quotes on RFQs they own.
    const myRFQs = await ctx.db
      .query("rfqs")
      .withIndex("by_organisation", (q) =>
        q.eq("organisationId", membership.organisationId)
      )
      .take(500);

    if (!myRFQs) {
      return [];
    }

    const rfqIds = (myRFQs ?? []).map((rfq) => rfq._id);

    const quotes = await ctx.db
      .query("quotes")
      .withIndex("by_organisation", (q) => q.eq("organisationId", membership.organisationId))
      .take(args.limit * 2);

    const filtered =
      (quotes ?? []).filter((q) => rfqIds.includes(q.rfqId));

    if (args.status) {
      return filtered
        .filter((q) => q.status === args.status)
        .slice(0, args.limit)
        .map((q) => ({
          _id: q._id,
          organisationId: q.organisationId,
          createdBy: q.createdBy,
          rfqId: q.rfqId,
          listingId: q.listingId,
          batchId: q.batchId,
          offeredQuantity: q.offeredQuantity,
          unit: q.unit,
          pricePerUnit: q.pricePerUnit,
          currency: q.currency,
          validityUntil: q.validityUntil,
          leadTimeDays: q.leadTimeDays,
          deliveryTerms: q.deliveryTerms,
          deliveryCostEstimate: q.deliveryCostEstimate,
          conditions: q.conditions,
          status: q.status,
          isDemo: q.isDemo,
        }));
    }

    return filtered.slice(0, args.limit).map((q) => ({
      _id: q._id,
      organisationId: q.organisationId,
      createdBy: q.createdBy,
      rfqId: q.rfqId,
      listingId: q.listingId,
      batchId: q.batchId,
      offeredQuantity: q.offeredQuantity,
      unit: q.unit,
      pricePerUnit: q.pricePerUnit,
      currency: q.currency,
      validityUntil: q.validityUntil,
      leadTimeDays: q.leadTimeDays,
      deliveryTerms: q.deliveryTerms,
      deliveryCostEstimate: q.deliveryCostEstimate,
      conditions: q.conditions,
      status: q.status,
      isDemo: q.isDemo,
    }));
  },
});

// Suppliers/admins: their own quotes.
export const listMySubmittedQuotes = query({
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
      .query("quotes")
      .withIndex("by_organisation", (q) =>
        q.eq("organisationId", membership.organisationId)
      );

    const items = await builder.take(args.limit * 2);

    const expectedStatus = args.status ?? "pending";

    return (items ?? [])
      .filter((q) => q.status === expectedStatus)
      .slice(0, args.limit)
      .map((q) => ({
        _id: q._id,
        organisationId: q.organisationId,
        createdBy: q.createdBy,
        rfqId: q.rfqId,
        listingId: q.listingId,
        batchId: q.batchId,
        offeredQuantity: q.offeredQuantity,
        unit: q.unit,
        pricePerUnit: q.pricePerUnit,
        currency: q.currency,
        validityUntil: q.validityUntil,
        leadTimeDays: q.leadTimeDays,
        deliveryTerms: q.deliveryTerms,
        deliveryCostEstimate: q.deliveryCostEstimate,
        conditions: q.conditions,
        status: q.status,
        isDemo: q.isDemo,
      }));
  },
});

// Submit a quote (supplier/processor/admin) against an RFQ.
export const createQuote = mutation({
  args: {
    rfqId: v.id("rfqs"),
    offeredQuantity: v.number(),
    unit: v.string(),
    pricePerUnit: v.number(),
    currency: v.string(),
    validityUntil: v.number(),
    leadTimeDays: v.optional(v.number()),
    deliveryTerms: v.optional(v.string()),
    deliveryCostEstimate: v.optional(v.number()),
    conditions: v.optional(v.string()),
    listingId: v.optional(v.id("listings")),
    batchId: v.optional(v.id("batch_records")),
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

    const rfq = await ctx.db.get(args.rfqId);
    if (!rfq) {
      throw new Error("RFQ not found");
    }

    if (rfq.status !== "open") {
      throw new Error("RFQ is not open for quotes");
    }

    if (
      membership.role !== "supplier" &&
      membership.role !== "processor" &&
      membership.role !== "admin"
    ) {
      throw new Error(
        "Only suppliers, processors, and administrators can submit quotes"
      );
    }

    if (args.offeredQuantity <= 0) {
      throw new Error("Offered quantity must be greater than zero");
    }

    if (args.validityUntil <= Date.now()) {
      throw new Error("Quote validity must be in the future");
    }

    return await ctx.db.insert("quotes", {
      organisationId: membership.organisationId,
      createdBy: userId,
      rfqId: args.rfqId,
      listingId: args.listingId ?? undefined,
      batchId: args.batchId ?? undefined,
      offeredQuantity: args.offeredQuantity,
      unit: args.unit,
      pricePerUnit: args.pricePerUnit,
      currency: args.currency,
      validityUntil: args.validityUntil,
      leadTimeDays: args.leadTimeDays ?? undefined,
      deliveryTerms: args.deliveryTerms ?? undefined,
      deliveryCostEstimate: args.deliveryCostEstimate ?? undefined,
      conditions: args.conditions ?? undefined,
      status: "pending",
      isDemo: false,
    });
  },
});

// Accept a quote and create an order transactionally.
export const acceptQuote = mutation({
  args: {
    quoteId: v.id("quotes"),
    title: v.string(),
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

    const quote = await ctx.db.get(args.quoteId);
    if (!quote) {
      throw new Error("Quote not found");
    }

    const rfq = await ctx.db.get(quote.rfqId);
    if (!rfq) {
      throw new Error("RFQ not found");
    }

    // Only the RFQ owner (buyer org) can accept.
    if (rfq.organisationId !== membership.organisationId) {
      throw new Error("Forbidden: only the RFQ owner can accept this quote");
    }

    if (quote.status !== "pending") {
      throw new Error("Quote is not pending acceptance");
    }

    if (quote.validityUntil < Date.now()) {
      throw new Error("Quote has expired");
    }

    const orderNumber =
      `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random()
        .toString(36)
        .slice(2, 7)
        .toUpperCase()}`;

    const orderId = await ctx.db.insert("orders", {
      orderNumber,
      organisationId: membership.organisationId,
      buyerOrganisationId: membership.organisationId,
      sellerOrganisationId: quote.organisationId,
      createdBy: userId,
      rfqId: rfq._id,
      quoteId: quote._id,
      title: args.title,
      status: "pending_confirmation",
      totalQuantity: quote.offeredQuantity,
      unit: quote.unit,
      unitPrice: quote.pricePerUnit,
      currency: quote.currency,
      totalPrice: quote.offeredQuantity * quote.pricePerUnit,
      isDemo: false,
    });

    // Reserve inventory against the new order if the quote references a listing.
    if (quote.listingId) {
      await ctx.runMutation(api.listings.reserveInventory, {
        listingId: quote.listingId,
        quantity: quote.offeredQuantity,
        unit: quote.unit,
        reservedForOrderId: orderId,
      });
    }

    // Mark the quote accepted.
    await ctx.db.patch(quote._id, { status: "accepted" });

    // Persist the order line item.
    await ctx.db.insert("order_items", {
      orderId,
      listingId: quote.listingId ?? undefined,
      batchId: quote.batchId ?? undefined,
      quantity: quote.offeredQuantity,
      unit: quote.unit,
      unitPrice: quote.pricePerUnit,
      currency: quote.currency,
      lineTotal: quote.offeredQuantity * quote.pricePerUnit,
      reservedQuantity: quote.offeredQuantity,
      isDemo: false,
    });

    // Close the RFQ.
    await ctx.db.patch(rfq._id, { status: "closed" });

    return orderId;
  },
});
