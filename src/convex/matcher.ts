import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const matcherRulesVersions = {
  V1: "matcher-v1",
} as const;

export type MatcherRulesVersion = typeof matcherRulesVersions.V1;

// Weights used by the initial explainable matcher (v1).
// These are configurable through the application; this constant documents the
// default formula version used by stored match runs.
export const MATCHER_WEIGHTS_V1 = {
  applicationCompatibility: 0.3,
  quantityFit: 0.2,
  qualityDataFit: 0.15,
  deliveryFeasibility: 0.15,
  availabilityTiming: 0.1,
  commercialFit: 0.1,
};

type MatchCandidate = {
  listingId: string;
  title: string;
  category: string;
  region: string;
  availableQuantity: number;
  unit: string;
  pricePerUnit: number | null;
  currency: string;
  moisturePercent: number | null;
  formOrParticleSize: string | null;
  storageConditions: string | null;
  collectionWindow: string | null;
  deliveryOptions: string[];
  deliveryTerms: string | null;
  isDemo: boolean;
};

type MatchInput = {
  application: string;
  preferredFeedstock: string;
  requiredQuantity: number;
  unit: string;
  deliveryRegion: string;
  maxDeliveryDistanceKm: number | null;
  requiredByDate: number | null;
  moistureRequirement: string | null;
  priceCeiling: number | null;
  allowSplitOrders: boolean;
};

// Hard filters applied before ranking.
export function passesHardFilters(
  candidate: MatchCandidate,
  input: MatchInput
): { passed: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const quantityInSameUnit: number =
    candidate.unit === input.unit ? candidate.availableQuantity : candidate.availableQuantity; // unit conversion is handled in the frontend/application layer

  // Minimum quantity requirement.
  if (!input.allowSplitOrders && candidate.availableQuantity < input.requiredQuantity) {
    return { passed: false, reasons: ["Does not meet minimum quantity as a single lot"] };
  }

  // Price ceiling.
  if (input.priceCeiling !== null && candidate.pricePerUnit !== null && candidate.pricePerUnit > input.priceCeiling) {
    reasons.push(`Price per unit exceeds ceiling`);
  }

  // Basic data sanity.
  if (candidate.availableQuantity <= 0) {
    return { passed: false, reasons: ["No available quantity"] };
  }

  return { passed: true, reasons };
}

// Explainable scoring for a candidate against an input.
export function scoreCandidate(candidate: MatchCandidate, input: MatchInput): {
  score: number;
  factors: Record<string, { weight: number; value: number; note: string }>;
  reasons: string[];
  missing: string[];
  knownMismatches: string[];
} {
  const factors: Record<string, { weight: number; value: number; note: string }> = {};
  const reasons: string[] = [];
  const missing: string[] = [];
  const knownMismatches: string[] = [];

  // Application compatibility: heuristic text overlap between application and
  // feedstock/category. This is intentionally simple and explainable.
  const applicationTokens = input.application.toLowerCase().split(/\s+/).filter(Boolean);
  const feedstockTokens = (candidate.title + " " + candidate.category)
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  const overlap = applicationTokens.filter((t) => feedstockTokens.includes(t));
  const applicationScore = overlap.length === 0 ? 0 : overlap.length / Math.max(applicationTokens.length, 1);
  factors.applicationCompatibility = {
    weight: MATCHER_WEIGHTS_V1.applicationCompatibility,
    value: applicationScore,
    note: `${overlap.length} of ${applicationTokens.length} request terms match the feedstock name/category`,
  };
  if (applicationScore === 0) {
    reasons.push("Application compatibility is low based on the request terms");
  }

  // Quantity fit: how well the available quantity matches the required quantity.
  const quantityRatio = candidate.availableQuantity / Math.max(input.requiredQuantity, 1);
  const quantityScore = quantityRatio >= 1 ? 1 : quantityRatio;
  factors.quantityFit = {
    weight: MATCHER_WEIGHTS_V1.quantityFit,
    value: quantityScore,
    note: `${candidate.availableQuantity} ${candidate.unit} available vs ${input.requiredQuantity} ${input.unit} required`,
  };
  if (quantityRatio < 1 && !input.allowSplitOrders) {
    knownMismatches.push("Available quantity is less than required without splitting");
  }

  // Quality-data fit: reward listings with more declared quality info.
  const declaredQualityFields = [
    candidate.moisturePercent !== null,
    candidate.formOrParticleSize !== null,
    candidate.storageConditions !== null,
    candidate.collectionWindow !== null,
  ].filter(Boolean).length;
  const qualityScore = declaredQualityFields / 4;
  factors.qualityDataFit = {
    weight: MATCHER_WEIGHTS_V1.qualityDataFit,
    value: qualityScore,
    note: `${declaredQualityFields} of 4 quality fields declared`,
  };
  if (candidate.moisturePercent === null) {
    missing.push("Moisture percentage unknown");
  }
  if (candidate.formOrParticleSize === null) {
    missing.push("Material form / particle size unknown");
  }

  // Delivery feasibility: region match and delivery options.
  const regionMatch = candidate.region.toLowerCase().includes(input.deliveryRegion.toLowerCase()) ||
    input.deliveryRegion.toLowerCase().includes(candidate.region.toLowerCase());
  const hasDeliveryOption = candidate.deliveryOptions.some(
    (opt) => opt.toLowerCase().includes("pickup") || opt.toLowerCase().includes("delivery")
  );
  const deliveryScore = regionMatch && hasDeliveryOption ? 1 : regionMatch ? 0.5 : 0;
  factors.deliveryFeasibility = {
    weight: MATCHER_WEIGHTS_V1.deliveryFeasibility,
    value: deliveryScore,
    note: regionMatch ? `Region overlap with ${input.deliveryRegion}` : `No region overlap with ${input.deliveryRegion}`,
  };
  if (!regionMatch) {
    knownMismatches.push("Pickup region differs from requested delivery region");
  }

  // Availability timing: required-by date vs collection window where available.
  if (input.requiredByDate !== null && candidate.collectionWindow !== null) {
    factors.availabilityTiming = {
      weight: MATCHER_WEIGHTS_V1.availabilityTiming,
      value: 0.5,
      note: "Collection window is declared; confirm timing against required-by date with the supplier",
    };
  } else if (input.requiredByDate !== null && candidate.collectionWindow === null) {
    factors.availabilityTiming = {
      weight: MATCHER_WEIGHTS_V1.availabilityTiming,
      value: 0,
      note: "No collection window declared; timing cannot be assessed",
    };
    missing.push("Collection window unknown");
  } else {
    factors.availabilityTiming = {
      weight: MATCHER_WEIGHTS_V1.availabilityTiming,
      value: 0.5,
      note: "No required-by date; timing not critical",
    };
  }

  // Commercial fit: price reasonableness relative to price ceiling where available.
  let commercialScore = 0;
  if (candidate.pricePerUnit !== null) {
    if (input.priceCeiling !== null) {
      commercialScore = candidate.pricePerUnit <= input.priceCeiling ? 1 : Math.max(0, 1 - (candidate.pricePerUnit - input.priceCeiling) / Math.max(input.priceCeiling, 1));
    } else {
      commercialScore = 0.5;
    }
  }
  factors.commercialFit = {
    weight: MATCHER_WEIGHTS_V1.commercialFit,
    value: commercialScore,
    note: candidate.pricePerUnit !== null
      ? `${candidate.pricePerUnit} ${candidate.currency} per ${candidate.unit}${input.priceCeiling !== null ? ` vs ceiling ${input.priceCeiling}` : ""}`
      : "No price declared; commercial fit cannot be assessed",
  };
  if (candidate.pricePerUnit === null) {
    missing.push("Price per unit unknown");
  }

  // Weighted total.
  let score = 0;
  for (const key of Object.keys(factors) as (keyof typeof factors)[]) {
    score += factors[key].weight * factors[key].value;
  }

  if (missing.length === 0) {
    reasons.push("Most key fields are declared for this candidate");
  } else {
    reasons.push(`Missing: ${missing.join(", ")}`);
  }

  return { score, factors, reasons, missing, knownMismatches };
}

// Run a matcher query against permitted listings.
// This is the backend entry point the frontend calls. It performs the actual
// database query and deterministic scoring, then stores the run.
export const runMatch = mutation({
  args: {
    rulesVersion: v.string(),
    name: v.optional(v.string()),
    input: v.any(),
    candidateIds: v.array(v.id("listings")),
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

    const input = args.input as MatchInput;
    const results: Array<{
      listingId: string;
      title: string;
      score: number;
      factors: Record<string, { weight: number; value: number; note: string }>;
      reasons: string[];
      missing: string[];
      knownMismatches: string[];
    }> = [];

    for (const listingId of args.candidateIds) {
      const listing = await ctx.db.get(listingId);
      if (!listing || listing.isActive === false) {
        continue;
      }

      const candidate: MatchCandidate = {
        listingId: listing._id,
        title: listing.title,
        category: listing.category,
        region: listing.region,
        availableQuantity: listing.availableQuantity,
        unit: listing.unit,
        pricePerUnit: listing.pricePerUnit ?? null,
        currency: listing.currency,
        moisturePercent: listing.moisturePercent ?? null,
        formOrParticleSize: listing.formOrParticleSize ?? null,
        storageConditions: listing.storageConditions ?? null,
        collectionWindow: listing.collectionWindow ?? null,
        deliveryOptions: listing.deliveryOptions,
        deliveryTerms: listing.deliveryTerms ?? null,
        isDemo: listing.isDemo,
      };

      const hard = passesHardFilters(candidate, input);
      if (!hard.passed) {
        continue;
      }

      const scored = scoreCandidate(candidate, input);
      results.push({
        listingId: candidate.listingId,
        title: candidate.title,
        score: scored.score,
        factors: scored.factors,
        reasons: scored.reasons,
        missing: scored.missing,
        knownMismatches: scored.knownMismatches,
      });
    }

    results.sort((a, b) => b.score - a.score);

    // Persist the match run.
    await ctx.db.insert("match_runs", {
      organisationId: membership.organisationId,
      createdBy: userId,
      rulesVersion: args.rulesVersion,
      inputSnapshot: args.input,
      resultCount: results.length,
      name: args.name ?? `Match ${Date.now()}`,
      isDemo: false,
      createdAt: Date.now(),
    });

    return { results, rulesVersion: args.rulesVersion };
  },
});

// List saved match runs for the current organisation.
export const listMatchRuns = query({
  args: { limit: v.number() },
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

    const runs = await ctx.db
      .query("match_runs")
      .withIndex("by_organisation", (q) => q.eq("organisationId", membership.organisationId))
      .take(args.limit);

    return runs?.map((run) => ({
      _id: run._id,
      rulesVersion: run.rulesVersion,
      inputSnapshot: run.inputSnapshot,
      resultCount: run.resultCount,
      name: run.name,
      isDemo: run.isDemo,
      createdAt: run.createdAt,
    }));
  },
});

// Explain a stored match result by listing id (a lightweight summary).
export const explainMatchForListing = query({
  args: {
    listingId: v.id("listings"),
  },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.listingId);
    if (!listing) {
      return null;
    }

    return {
      listingId: listing._id,
      title: listing.title,
      category: listing.category,
      region: listing.region,
      availableQuantity: listing.availableQuantity,
      unit: listing.unit,
      pricePerUnit: listing.pricePerUnit,
      currency: listing.currency,
      moisturePercent: listing.moisturePercent,
      formOrParticleSize: listing.formOrParticleSize,
      storageConditions: listing.storageConditions,
      collectionWindow: listing.collectionWindow,
      deliveryOptions: listing.deliveryOptions,
      deliveryTerms: listing.deliveryTerms,
      isDemo: listing.isDemo,
    };
  },
});
