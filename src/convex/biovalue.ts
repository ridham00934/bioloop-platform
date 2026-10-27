import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const biovalueFormulaVersions = {
  V1: "biovalue-v1",
} as const;

export type BiovalueFormulaVersion = typeof biovalueFormulaVersions.V1;

// Compute the BioValue estimate deterministically.
// Inputs:
//  - grossMass: number, kg or tonnes depending on unit handling in the frontend
//  - usableFraction: number in (0, 1]
//  - unitPrice: number per unit of usable mass
//  - currency: string
//  - unit: string for both mass and price (frontend stores these explicitly)
//  - processingCost: number (known)
//  - handlingCost: number (known)
//  - transportCost: number (known)
// Outputs:
//  - usableMass
//  - estimatedSaleValue
//  - estimatedNetValue
//  - breakdown
export function computeBiovalue(inputs: {
  grossMass: number;
  usableFraction: number;
  unitPrice: number;
  currency: string;
  unit: string;
  processingCost: number;
  handlingCost: number;
  transportCost: number;
  note?: string;
}) {
  const { grossMass, usableFraction, unitPrice, currency, unit, processingCost, handlingCost, transportCost, note } = inputs;

  if (grossMass < 0) {
    throw new Error("Gross mass cannot be negative");
  }
  if (usableFraction <= 0 || usableFraction > 1) {
    throw new Error("Usable fraction must be greater than 0 and at most 1");
  }
  if (unitPrice < 0) {
    throw new Error("Unit price cannot be negative");
  }

  const usableMass = grossMass * usableFraction;
  const estimatedSaleValue = usableMass * unitPrice;
  const estimatedNetValue =
    estimatedSaleValue - processingCost - handlingCost - transportCost;

  return {
    usableMass,
    estimatedSaleValue,
    estimatedNetValue,
    breakdown: {
      grossMass,
      usableFraction,
      usableMass,
      unitPrice,
      currency,
      unit,
      processingCost,
      handlingCost,
      transportCost,
      saleBeforeCosts: estimatedSaleValue,
      costs: processingCost + handlingCost + transportCost,
      netBeforeTaxOverhead: estimatedNetValue,
    },
    assumptions: note ?? "Usable fraction already includes moisture and contamination losses where applicable.",
    formulaVersion: biovalueFormulaVersions.V1,
  };
}

// Save a BioValue calculation run.
export const saveBiovalueRun = mutation({
  args: {
    feedstockTypeId: v.id("feedstock_types"),
    formulaVersion: v.string(),
    inputs: v.any(),
    outputs: v.any(),
    assumptions: v.optional(v.string()),
    note: v.optional(v.string()),
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

    return await ctx.db.insert("calculation_runs", {
      organisationId: membership.organisationId,
      createdBy: userId,
      feedstockTypeId: args.feedstockTypeId,
      formulaVersion: args.formulaVersion,
      inputs: args.inputs,
      outputs: args.outputs,
      assumptions: args.assumptions ?? undefined,
      note: args.note ?? undefined,
      isDemo: false,
      createdAt: Date.now(),
    });
  },
});

// List saved calculation runs for the current organisation.
export const listBiovalueRuns = query({
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
      .query("calculation_runs")
      .withIndex("by_organisation", (q) => q.eq("organisationId", membership.organisationId))
      .take(args.limit);

    return runs?.map((run) => ({
      _id: run._id,
      feedstockTypeId: run.feedstockTypeId,
      formulaVersion: run.formulaVersion,
      inputs: run.inputs,
      outputs: run.outputs,
      assumptions: run.assumptions,
      note: run.note,
      isDemo: run.isDemo,
      createdAt: run.createdAt,
    }));
  },
});
