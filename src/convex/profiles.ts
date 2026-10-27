import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const profile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
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
      .withIndex("by_current_user", (q) =>
        q.eq("userId", userId)
      )
      .first();

    // Resolve organisation slug and membership id for display.
    const organisationId =
      profile.organisationId ?? membership?.organisationId;

    let orgSlug: string | undefined;
    const membershipId =
      profile.organisationMembershipId ?? membership?._id;

    if (organisationId) {
      const org = await ctx.db.get(organisationId);
      if (org && typeof org === "object" && "slug" in org) {
        orgSlug = org.slug as string;
      }
    }

    const role =
      membership && typeof membership === "object" && "role" in membership
        ? (membership as { role?: unknown }).role
        : undefined;

    return {
      userId: profile.userId,
      organisationId,
      organisationSlug: orgSlug,
      organisationMembershipId: membershipId,
      displayName: profile.displayName,
      phone: profile.phone,
      jobTitle: profile.jobTitle,
      role: typeof role === "string" ? role : undefined,
    } satisfies ProfileView;
  },
});

export const currentUserId = query({
  args: {},
  handler: async (ctx) => {
    return await getAuthUserId(ctx);
  },
});

// Re-export a typed profile view for convenience.
export type ProfileView = {
  userId: unknown;
  organisationId: unknown;
  organisationSlug: string | undefined;
  organisationMembershipId: unknown;
  displayName: string | undefined;
  phone: string | undefined;
  jobTitle: string | undefined;
  role: unknown;
};
