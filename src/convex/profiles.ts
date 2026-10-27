import { query } from "./_generated/server";
import { v } from "convex/values";

export const profile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await ctx.auth.getUserId();
    if (userId === null) {
      return null;
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      return null;
    }

    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_user_organisation", (q) =>
        q.eq("userId", userId).eq("isCurrent", true)
      )
      .first();

    // Resolve organisation slug and membership id for display.
    const organisationId =
      profile.organisationId ?? membership?.organisationId;

    let orgSlug: string | undefined;
    let membershipId = profile.organisationMembershipId ?? membership?._id;

    if (organisationId) {
      const org = await ctx.db.get<typeof ctx.db.get>(organisationId);
      if (org) {
        orgSlug = org.slug;
      }
    }

    return {
      userId: profile.userId,
      organisationId,
      organisationSlug: orgSlug,
      organisationMembershipId: membershipId,
      displayName: profile.displayName,
      phone: profile.phone,
      jobTitle: profile.jobTitle,
      // Expose role from the current membership for the sidebar.
      role: (membership ?? profile).role,
    };
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const currentUserId = query({
  args: {},
  handler: async (ctx) => {
    const userId = await ctx.auth.getUserId();
    return userId;
  },
});

// This table import is used elsewhere; keep it typed.
export type ProfileView = Awaited<ReturnType<typeof profile>>;
