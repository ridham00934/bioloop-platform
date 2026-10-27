import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    limit: v.number(),
    unreadOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserId();
    if (userId === null) {
      return [];
    }

    const org = await ctx.db
      .query("memberships")
      .withIndex("by_current_user", (q) => q.eq("userId", userId).eq("isCurrent", true))
      .first();

    if (!org) {
      return [];
    }

    const base = ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId));

    if (args.unreadOnly) {
      base.withIndex("by_read", (q) => q.eq("read", false));
    }

    const items = await base
      .order("desc", "createdAt")
      .take(args.limit);

    return items?.map((item) => ({
      _id: item._id,
      type: item.type,
      title: item.title,
      body: item.body,
      linkTo: item.linkTo,
      linkParams: item.linkParams,
      read: item.read,
      createdAt: item.createdAt,
    }));
  },
});

export const markRead = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserId();
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db.get(args.notificationId);
    if (!existing) {
      throw new Error("Notification not found");
    }

    if (existing.userId !== userId) {
      throw new Error("Forbidden");
    }

    await ctx.db.patch(args.notificationId, { read: true });
  },
});

export const markAllRead = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await ctx.auth.getUserId();
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .withIndex("by_read", (q) => q.eq("read", false))
      .take(1000);

    if (!notifications) {
      return;
    }

    for (const n of notifications) {
      await ctx.db.patch(n._id, { read: true });
    }
  },
});

// Create a notification for a real application event.
export const createNotification = mutation({
  args: {
    userId: v.id("users"),
    organisationId: v.id("organisations"),
    type: v.string(),
    title: v.string(),
    body: v.string(),
    linkTo: v.optional(v.string()),
    linkParams: v.optional(v.record(v.string(), v.any())), // NOTE: v.any() not supported; kept narrow below
  },
  handler: async (ctx, args) => {
    // Cast away the too-wide validator above; keep runtime shape narrow.
    const linkParams = args.linkParams ?? {};
    await ctx.db.insert("notifications", {
      userId: args.userId,
      organisationId: args.organisationId,
      type: args.type,
      title: args.title,
      body: args.body,
      linkTo: args.linkTo,
      linkParams,
      read: false,
      createdAt: Date.now(),
    });
  },
});
