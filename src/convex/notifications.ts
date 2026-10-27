import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// linkParams is stored as a generic field but limited to simple scalars
// for notification deep-links.
export const linkParamsValidator = v.optional(
  v.object({
    id: v.optional(v.string()),
    kind: v.optional(v.string()),
    slug: v.optional(v.string()),
    status: v.optional(v.string()),
  })
);

type LinkParams = {
  id?: string;
  kind?: string;
  slug?: string;
  status?: string;
};

export const list = query({
  args: {
    limit: v.number(),
    unreadOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return [];
    }

    const base = ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId));

    const items =
      args.unreadOnly === true
        ? await ctx.db
            .query("notifications")
            .withIndex("by_read", (q) => q.eq("read", false))
            .take(args.limit)
        : await base.take(args.limit);

    // If unread-only mode was used, filter to the current user manually.
    const filtered =
      args.unreadOnly === true
        ? (items ?? []).filter((item) => item.userId === userId)
        : items ?? [];

    return filtered.map((item) => ({
      _id: item._id,
      type: item.type,
      title: item.title,
      body: item.body,
      linkTo: item.linkTo,
      linkParams: (item.linkParams as unknown as LinkParams) ?? null,
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
    const userId = await getAuthUserId(ctx);
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
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const userNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .take(1000);

    if (!userNotifications) {
      return;
    }

    for (const n of userNotifications) {
      if (n.read === false) {
        await ctx.db.patch(n._id, { read: true });
      }
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
    linkParams: linkParamsValidator,
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("notifications", {
      userId: args.userId,
      organisationId: args.organisationId,
      type: args.type,
      title: args.title,
      body: args.body,
      linkTo: args.linkTo,
      linkParams: args.linkParams ?? {},
      read: false,
      createdAt: Date.now(),
    });
  },
});
