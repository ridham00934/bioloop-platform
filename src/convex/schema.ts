import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// BioLoop roles
// Public sign-up does not allow admin provisioning.
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
  SUPPLIER: "supplier",
  BUYER: "buyer",
  PROCESSOR: "processor",
  LOGISTICS: "logistics",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
  v.literal(ROLES.SUPPLIER),
  v.literal(ROLES.BUYER),
  v.literal(ROLES.PROCESSOR),
  v.literal(ROLES.LOGISTICS),
);
export type Role = Infer<typeof roleValidator>;

// Listing status lifecycle
// draft -> published -> (reserved | sold | expired) -> archived
export const LISTING_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  RESERVED: "reserved",
  SOLD: "sold",
  EXPIRED: "expired",
  ARCHIVED: "archived",
} as const;

export const listingStatusValidator = v.union(
  v.literal(LISTING_STATUS.DRAFT),
  v.literal(LISTING_STATUS.PUBLISHED),
  v.literal(LISTING_STATUS.RESERVED),
  v.literal(LISTING_STATUS.SOLD),
  v.literal(LISTING_STATUS.EXPIRED),
  v.literal(LISTING_STATUS.ARCHIVED),
);
export type ListingStatus = Infer<typeof listingStatusValidator>;

// Feedstock categories
// Covers the initial taxonomy requested by the brief.
export const FEEDSTOCK_CATEGORY = {
  AGRICULTURAL_RESIDUES: "agricultural_residues",
  SUGAR_INDUSTRY_RESIDUES: "sugar_industry_residues",
  FRUIT_VEGETABLE_RESIDUES: "fruit_vegetable_residues",
  FORESTRY_BYPRODUCTS: "forestry_byproducts",
  FOOD_PROCESSING_BYPRODUCTS: "food_processing_byproducts",
  FERMENTATION_RESIDUES: "fermentation_residues",
  OILY_SEED_RESIDUES: "oily_seed_residues",
} as const;

export const feedstockCategoryValidator = v.union(
  v.literal(FEEDSTOCK_CATEGORY.AGRICULTURAL_RESIDUES),
  v.literal(FEEDSTOCK_CATEGORY.SUGAR_INDUSTRY_RESIDUES),
  v.literal(FEEDSTOCK_CATEGORY.FRUIT_VEGETABLE_RESIDUES),
  v.literal(FEEDSTOCK_CATEGORY.FORESTRY_BYPRODUCTS),
  v.literal(FEEDSTOCK_CATEGORY.FOOD_PROCESSING_BYPRODUCTS),
  v.literal(FEEDSTOCK_CATEGORY.FERMENTATION_RESIDUES),
  v.literal(FEEDSTOCK_CATEGORY.OILY_SEED_RESIDUES),
);
export type FeedstockCategory = Infer<typeof feedstockCategoryValidator>;

// Order lifecycle
// pending_confirmation -> confirmed -> preparing -> ready_for_pickup -> in_transit -> delivered -> completed
export const ORDER_STATUS = {
  PENDING_CONFIRMATION: "pending_confirmation",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  READY_FOR_PICKUP: "ready_for_pickup",
  IN_TRANSIT: "in_transit",
  DELIVERED: "delivered",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  DISPUTED: "disputed",
} as const;

export const orderStatusValidator = v.union(
  v.literal(ORDER_STATUS.PENDING_CONFIRMATION),
  v.literal(ORDER_STATUS.CONFIRMED),
  v.literal(ORDER_STATUS.PREPARING),
  v.literal(ORDER_STATUS.READY_FOR_PICKUP),
  v.literal(ORDER_STATUS.IN_TRANSIT),
  v.literal(ORDER_STATUS.DELIVERED),
  v.literal(ORDER_STATUS.COMPLETED),
  v.literal(ORDER_STATUS.CANCELLED),
  v.literal(ORDER_STATUS.DISPUTED),
);
export type OrderStatus = Infer<typeof orderStatusValidator>;

// Shipment status
// requested -> assigned -> pickup_scheduled -> picked_up -> in_transit -> delivered -> completed -> cancelled
export const SHIPMENT_STATUS = {
  REQUESTED: "requested",
  ASSIGNED: "assigned",
  PICKUP_SCHEDULED: "pickup_scheduled",
  PICKED_UP: "picked_up",
  IN_TRANSIT: "in_transit",
  DELIVERED: "delivered",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  DELAYED: "delayed",
} as const;

export const shipmentStatusValidator = v.union(
  v.literal(SHIPMENT_STATUS.REQUESTED),
  v.literal(SHIPMENT_STATUS.ASSIGNED),
  v.literal(SHIPMENT_STATUS.PICKUP_SCHEDULED),
  v.literal(SHIPMENT_STATUS.PICKED_UP),
  v.literal(SHIPMENT_STATUS.IN_TRANSIT),
  v.literal(SHIPMENT_STATUS.DELIVERED),
  v.literal(SHIPMENT_STATUS.COMPLETED),
  v.literal(SHIPMENT_STATUS.CANCELLED),
  v.literal(SHIPMENT_STATUS.DELAYED),
);
export type ShipmentStatus = Infer<typeof shipmentStatusValidator>;

// Verification states for organisations and documents
export const VERIFICATION_STATE = {
  UNSUBMITTED: "unsubmitted",
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  EXPIRED: "expired",
} as const;

export const verificationStateValidator = v.union(
  v.literal(VERIFICATION_STATE.UNSUBMITTED),
  v.literal(VERIFICATION_STATE.PENDING),
  v.literal(VERIFICATION_STATE.APPROVED),
  v.literal(VERIFICATION_STATE.REJECTED),
  v.literal(VERIFICATION_STATE.EXPIRED),
);
export type VerificationState = Infer<typeof verificationStateValidator>;

// Evidence level for BioPassport fields
// supplier_declared -> document_provided -> document_reviewed -> sample_tested -> independently_audited
export const EVIDENCE_LEVEL = {
  SUPPLIER_DECLARED: "supplier_declared",
  DOCUMENT_PROVIDED: "document_provided",
  DOCUMENT_REVIEWED: "document_reviewed",
  SAMPLE_TESTED: "sample_tested",
  INDEPENDENTLY_AUDITED: "independently_audited",
} as const;

export const evidenceLevelValidator = v.union(
  v.literal(EVIDENCE_LEVEL.SUPPLIER_DECLARED),
  v.literal(EVIDENCE_LEVEL.DOCUMENT_PROVIDED),
  v.literal(EVIDENCE_LEVEL.DOCUMENT_REVIEWED),
  v.literal(EVIDENCE_LEVEL.SAMPLE_TESTED),
  v.literal(EVIDENCE_LEVEL.INDEPENDENTLY_AUDITED),
);
export type EvidenceLevel = Infer<typeof evidenceLevelValidator>;

// RFQ visibility
export const RFQ_VISIBILITY = {
  PUBLIC: "public",
  RESTRICTED: "restricted",
} as const;

export const rfqVisibilityValidator = v.union(
  v.literal(RFQ_VISIBILITY.PUBLIC),
  v.literal(RFQ_VISIBILITY.RESTRICTED),
);
export type RFQVisibility = Infer<typeof rfqVisibilityValidator>;

// Calculation formula versions
// Record the formula version used so results can be reproduced.
export const BIOVALUE_FORMULA_VERSIONS = {
  V1: "biovalue-v1",
} as const;

export const biovalueFormulaVersionValidator = v.literal(BIOVALUE_FORMULA_VERSIONS.V1);
export type BiovalueFormulaVersion = Infer<typeof biovalueFormulaVersionValidator>;

export const MATCHER_RULES_VERSIONS = {
  V1: "matcher-v1",
} as const;

export const matcherRulesVersionValidator = v.literal(MATCHER_RULES_VERSIONS.V1);
export type MatcherRulesVersion = Infer<typeof matcherRulesVersionValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
    }).index("by_email", ["email"]),

    // Organisations are the multi-tenant boundary for BioLoop.
    // Row-level access is enforced through memberships.
    organisations: defineTable({
      name: v.string(),
      slug: v.string(),
      role: v.optional(roleValidator), // default role for new members
      verificationState: v.optional(verificationStateValidator),
      verificationReason: v.optional(v.string()),
      verificationActorId: v.optional(v.id("admin_actions")),
      verificationReviewedAt: v.optional(v.number()),
      adminNotes: v.optional(v.string()),
      isDemo: v.boolean(),
    })
      .index("by_slug", ["slug"])
      .index("by_role", ["role"])
      .index("by_verification_state", ["verificationState"])
      .index("by_is_demo", ["isDemo"]),

    memberships: defineTable({
      userId: v.id("users"),
      organisationId: v.id("organisations"),
      role: v.union(
        v.literal(ROLES.ADMIN),
        v.literal(ROLES.USER),
        v.literal(ROLES.SUPPLIER),
        v.literal(ROLES.BUYER),
        v.literal(ROLES.PROCESSOR),
        v.literal(ROLES.LOGISTICS),
      ),
      invitedBy: v.optional(v.id("users")),
      joinedAt: v.number(),
      isCurrent: v.boolean(),
    })
      .index("by_user", ["userId"])
      .index("by_organisation", ["organisationId"])
      .index("by_user_organisation", ["userId", "organisationId"])
      .index("by_current_user", ["userId", "isCurrent"]),

    profiles: defineTable({
      userId: v.id("users"),
      // A profile belongs to one organisation at a time for navigation purposes.
      // Memberships are the source of truth for permissions.
      organisationId: v.optional(v.id("organisations")),
      organisationSlug: v.optional(v.string()),
      organisationMembershipId: v.optional(v.id("memberships")),
      displayName: v.optional(v.string()),
      phone: v.optional(v.string()),
      jobTitle: v.optional(v.string()),
    }).index("by_user", ["userId"]),

    // Feedstock taxonomy managed by administrators.
    feedstock_types: defineTable({
      name: v.string(),
      commonNames: v.array(v.string()),
      category: v.string(),
      description: v.optional(v.string()),
      typicalMoistureRangeLow: v.optional(v.number()),
      typicalMoistureRangeHigh: v.optional(v.number()),
      typicalForm: v.optional(v.string()),
      typicalContaminants: v.optional(v.array(v.string())),
      typicalCompostCNO: v.optional(v.number()), // illustrative C:N guidance only
      createdAt: v.number(),
      maintainedBy: v.optional(v.id("organisations")),
    })
      .index("by_category", ["category"])
      .index("by_name", ["name"]),

    // Marketplace listings.
    listings: defineTable({
      organisationId: v.id("organisations"),
      createdBy: v.id("users"),
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
      pricing: v.string(), // e.g. "per_unit", "negotiable", "fixed"
      moisturePercent: v.optional(v.number()),
      contaminationNote: v.optional(v.string()),
      formOrParticleSize: v.optional(v.string()),
      storageConditions: v.optional(v.string()),
      collectionWindow: v.optional(v.string()),
      minimumOrderQuantity: v.optional(v.number()),
      deliveryOptions: v.array(v.string()),
      deliveryTerms: v.optional(v.string()),
      isActive: v.boolean(),
      status: v.string(),
      isDemo: v.boolean(),
      declinedReviewCount: v.number(),
    })
      .index("by_organisation", ["organisationId"])
      .index("by_created_by", ["createdBy"])
      .index("by_feedstock_type", ["feedstockTypeId"])
      .index("by_region", ["region"])
      .index("by_status", ["status"])
      .index("by_is_active", ["isActive"])
      .index("by_category", ["category"]),

    listing_photos: defineTable({
      listingId: v.id("listings"),
      storageId: v.optional(v.string()),
      url: v.string(),
      alt: v.optional(v.string()),
      position: v.number(),
      isDemo: v.boolean(),
    }).index("by_listing", ["listingId"]),

    // Verified / lab documents attached to a listing.
    listing_documents: defineTable({
      listingId: v.id("listings"),
      submittedBy: v.id("users"),
      storageId: v.optional(v.string()),
      url: v.string(),
      filename: v.string(),
      mimeType: v.string(),
      sizeBytes: v.number(),
      label: v.string(),
      evidenceLevel: v.string(),
      reviewState: v.string(),
      reviewedById: v.optional(v.id("users")),
      reviewedAt: v.optional(v.number()),
      reviewNote: v.optional(v.string()),
      isDemo: v.boolean(),
    })
      .index("by_listing", ["listingId"])
      .index("by_review_state", ["reviewState"]),

    // Batch records give a lot a BioPassport identity.
    batch_records: defineTable({
      organisationId: v.id("organisations"),
      listingId: v.optional(v.id("listings")),
      feedstockTypeId: v.id("feedstock_types"),
      batchNumber: v.string(),
      title: v.string(),
      quantity: v.number(),
      unit: v.string(),
      collectionDate: v.number(),
      storageNote: v.optional(v.string()),
      status: v.string(),
      qrToken: v.string(),
      isDemo: v.boolean(),
    })
      .index("by_organisation", ["organisationId"])
      .index("by_listing", ["listingId"])
      .index("by_qr_token", ["qrToken"])
      .index("by_status", ["status"]),

    // Traceability events: immutable append-only log.
    // Corrections create new events rather than mutating history.
    traceability_events: defineTable({
      batchId: v.id("batch_records"),
      type: v.string(),
      actorId: v.id("users"),
      actorOrgId: v.id("organisations"),
      note: v.optional(v.string()),
      location: v.optional(v.string()),
      data: v.optional(v.any()),
      evidenceLevel: v.optional(v.string()),
      createdAt: v.number(),
    }).index("by_batch", ["batchId"]),

    // Declared quality properties for a batch.
    batch_quality: defineTable({
      batchId: v.id("batch_records"),
      moisturePercent: v.optional(v.number()),
      contaminationPercent: v.optional(v.number()),
      particleSize: v.optional(v.string()),
      foreignMatter: v.optional(v.string()),
      declaredById: v.id("users"),
      declaredAt: v.number(),
      evidenceLevel: v.string(),
      isDemo: v.boolean(),
    }).index("by_batch", ["batchId"]),

    // Laboratory test results, where available.
    quality_tests: defineTable({
      batchId: v.id("batch_records"),
      labName: v.string(),
      testDate: v.number(),
      parameters: v.array(v.string()),
      results: v.optional(v.any()),
      reportStorageId: v.optional(v.string()),
      evidenceLevel: v.string(),
      isDemo: v.boolean(),
    }).index("by_batch", ["batchId"]),

    // Public RFQs created by buyers.
    rfqs: defineTable({
      organisationId: v.id("organisations"),
      createdBy: v.id("users"),
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
      status: v.string(),
      allowSplitOrders: v.boolean(),
      isDemo: v.boolean(),
    })
      .index("by_organisation", ["organisationId"])
      .index("by_created_by", ["createdBy"])
      .index("by_feedstock_type", ["feedstockTypeId"])
      .index("by_status", ["status"])
      .index("by_delivery_region", ["deliveryRegion"])
      .index("by_visibility", ["visibility"])
      .index("by_required_by", ["requiredByDate"]),

    // Supplier quote responses.
    quotes: defineTable({
      organisationId: v.id("organisations"),
      createdBy: v.id("users"),
      rfqId: v.id("rfqs"),
      listingId: v.optional(v.id("listings")),
      batchId: v.optional(v.id("batch_records")),
      offeredQuantity: v.number(),
      unit: v.string(),
      pricePerUnit: v.number(),
      currency: v.string(),
      validityUntil: v.number(),
      leadTimeDays: v.optional(v.number()),
      deliveryTerms: v.optional(v.string()),
      deliveryCostEstimate: v.optional(v.number()),
      conditions: v.optional(v.string()),
      status: v.string(),
      isDemo: v.boolean(),
    })
      .index("by_rfq", ["rfqId"])
      .index("by_organisation", ["organisationId"])
      .index("by_status", ["status"])
      .index("by_created_by", ["createdBy"]),

    // Orders created when a quote is accepted.
    orders: defineTable({
      orderNumber: v.string(),
      organisationId: v.id("organisations"),
      buyerOrganisationId: v.id("organisations"),
      sellerOrganisationId: v.id("organisations"),
      createdBy: v.id("users"),
      rfqId: v.optional(v.id("rfqs")),
      quoteId: v.optional(v.id("quotes")),
      title: v.string(),
      status: v.string(),
      totalQuantity: v.number(),
      unit: v.string(),
      unitPrice: v.number(),
      currency: v.string(),
      totalPrice: v.number(),
      isDemo: v.boolean(),
    })
      .index("by_organisation", ["organisationId"])
      .index("by_buyer", ["buyerOrganisationId"])
      .index("by_seller", ["sellerOrganisationId"])
      .index("by_order_number", ["orderNumber"])
      .index("by_status", ["status"])
      .index("by_rfq", ["rfqId"])
      .index("by_quote", ["quoteId"]),

    // Line items hold reserved inventory detail.
    order_items: defineTable({
      orderId: v.id("orders"),
      listingId: v.optional(v.id("listings")),
      batchId: v.optional(v.id("batch_records")),
      quantity: v.number(),
      unit: v.string(),
      unitPrice: v.number(),
      currency: v.string(),
      lineTotal: v.number(),
      reservedQuantity: v.number(),
      isDemo: v.boolean(),
    }).index("by_order", ["orderId"]),

    // Historical inventory snapshots used to reserve and release stock.
    inventory_snapshots: defineTable({
      listingId: v.id("listings"),
      quantity: v.number(),
      unit: v.string(),
      reservedForOrderId: v.optional(v.id("orders")),
      createdAt: v.number(),
      isDemo: v.boolean(),
    }).index("by_listing", ["listingId"])
      .index("by_reserved_for", ["reservedForOrderId"]),

    // Shipments for logistics tracking.
    shipments: defineTable({
      organisationId: v.id("organisations"),
      orderId: v.optional(v.id("orders")),
      batchId: v.optional(v.id("batch_records")),
      createdBy: v.id("users"),
      assignedToOrgId: v.optional(v.id("organisations")),
      pickupAddress: v.string(),
      pickupPostcode: v.optional(v.string()),
      pickupRegion: v.string(),
      pickupWindowStart: v.optional(v.number()),
      pickupWindowEnd: v.optional(v.number()),
      deliveryAddress: v.string(),
      deliveryPostcode: v.optional(v.string()),
      deliveryRegion: v.string(),
      status: v.string(),
      estimatedDistanceKm: v.optional(v.number()),
      estimatedDurationMinutes: v.optional(v.number()),
      transportQuote: v.optional(v.number()),
      currency: v.optional(v.string()),
      delayNote: v.optional(v.string()),
      proofOfDeliveryStorageId: v.optional(v.string()),
      isDemo: v.boolean(),
    })
      .index("by_organisation", ["organisationId"])
      .index("by_order", ["orderId"])
      .index("by_batch", ["batchId"])
      .index("by_status", ["status"])
      .index("by_assigned_to", ["assignedToOrgId"]),

    // Saved searches for buyers.
    saved_searches: defineTable({
      organisationId: v.id("organisations"),
      createdBy: v.id("users"),
      name: v.string(),
      filters: v.optional(v.any()),
      createdAt: v.number(),
    })
      .index("by_organisation", ["organisationId"])
      .index("by_created_by", ["createdBy"]),

    // Saved materials (favorites).
    saved_items: defineTable({
      organisationId: v.id("organisations"),
      userId: v.id("users"),
      listingId: v.id("listings"),
      createdAt: v.number(),
    })
      .index("by_organisation", ["organisationId"])
      .index("by_user", ["userId"])
      .index("by_listing", ["listingId"]),

    // Messages scoped to authorised conversations.
    conversations: defineTable({
      organisationId: v.id("organisations"),
      subject: v.optional(v.string()),
      relatedRfqId: v.optional(v.id("rfqs")),
      relatedOrderId: v.optional(v.id("orders")),
      createdAt: v.number(),
    })
      .index("by_organisation", ["organisationId"])
      .index("by_rfqi", ["relatedRfqId"])
      .index("by_order", ["relatedOrderId"]),

    messages: defineTable({
      conversationId: v.id("conversations"),
      organisationId: v.id("organisations"),
      senderId: v.id("users"),
      body: v.string(),
      isDemo: v.boolean(),
      createdAt: v.number(),
    })
      .index("by_conversation", ["conversationId"])
      .index("by_createdAt", ["createdAt"]),

    // Notifications from real application events.
    notifications: defineTable({
      organisationId: v.id("organisations"),
      userId: v.id("users"),
      type: v.string(),
      title: v.string(),
      body: v.string(),
      linkTo: v.optional(v.string()),
      linkParams: v.optional(v.any()),
      read: v.boolean(),
      createdAt: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_organisation", ["organisationId"])
      .index("by_createdAt", ["createdAt"])
      .index("by_read", ["read"]),

    // Saved calculation runs.
    calculation_runs: defineTable({
      organisationId: v.id("organisations"),
      createdBy: v.id("users"),
      feedstockTypeId: v.id("feedstock_types"),
      formulaVersion: v.string(),
      inputs: v.optional(v.any()),
      outputs: v.optional(v.any()),
      assumptions: v.optional(v.string()),
      note: v.optional(v.string()),
      isDemo: v.boolean(),
      createdAt: v.number(),
    })
      .index("by_organisation", ["organisationId"])
      .index("by_created_by", ["createdBy"]),

    // AI conversations.
    ai_conversations: defineTable({
      organisationId: v.id("organisations"),
      userId: v.id("users"),
      startedAt: v.number(),
      lastMessageAt: v.optional(v.number()),
    })
      .index("by_user", ["userId"])
      .index("by_organisation", ["organisationId"]),

    ai_messages: defineTable({
      conversationId: v.id("ai_conversations"),
      role: v.string(),
      content: v.string(),
      toolName: v.optional(v.string()),
      toolResult: v.optional(v.string()),
      isDemo: v.boolean(),
      createdAt: v.number(),
    })
      .index("by_conversation", ["conversationId"])
      .index("by_createdAt", ["createdAt"]),

    // Confirmation requests pending user approval (e.g. publish listing, submit RFQ).
    pending_confirmations: defineTable({
      userId: v.id("users"),
      organisationId: v.id("organisations"),
      action: v.string(),
      subjectResourceId: v.optional(v.id("misc")), // use generic for broad resource refs
      subjectResourceType: v.string(),
      proposedInput: v.any(),
      expiresAt: v.number(),
      isDemo: v.boolean(),
      createdAt: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_organisation", ["organisationId"])
      .index("by_expiresAt", ["expiresAt"]),

    // Disputes.
    disputes: defineTable({
      organisationId: v.id("organisations"),
      orderId: v.optional(v.id("orders")),
      shipmentId: v.optional(v.id("shipments")),
      createdById: v.id("users"),
      subject: v.string(),
      description: v.string(),
      status: v.string(),
      resolutionNote: v.optional(v.string()),
      resolvedById: v.optional(v.id("users")),
      resolvedAt: v.optional(v.number()),
      isDemo: v.boolean(),
      createdAt: v.number(),
    })
      .index("by_organisation", ["organisationId"])
      .index("by_order", ["orderId"])
      .index("by_shipment", ["shipmentId"])
      .index("by_status", ["status"]),

    dispute_evidence: defineTable({
      disputeId: v.id("disputes"),
      uploadedById: v.id("users"),
      storageId: v.optional(v.string()),
      url: v.string(),
      filename: v.string(),
      mimeType: v.string(),
      sizeBytes: v.number(),
      isInternal: v.boolean(),
      createdAt: v.number(),
    }).index("by_dispute", ["disputeId"]),

    // Administrator actions and audit trail.
    admin_actions: defineTable({
      actorId: v.id("users"),
      actorOrgId: v.id("organisations"),
      action: v.string(),
      targetResourceType: v.string(),
      targetResourceId: v.optional(v.id("misc")),
      beforeState: v.optional(v.any()),
      afterState: v.optional(v.any()),
      reason: v.optional(v.string()),
      isDemo: v.boolean(),
      createdAt: v.number(),
    })
      .index("by_actor", ["actorId"])
      .index("by_target_resource_type", ["targetResourceType"])
      .index("by_createdAt", ["createdAt"]),

    // Flagged listings awaiting moderation review.
    listing_flags: defineTable({
      listingId: v.id("listings"),
      reportedById: v.id("users"),
      reason: v.string(),
      note: v.optional(v.string()),
      status: v.string(),
      reviewedById: v.optional(v.id("users")),
      reviewedAt: v.optional(v.number()),
      reviewNote: v.optional(v.string()),
      isDemo: v.boolean(),
      createdAt: v.number(),
    })
      .index("by_listing", ["listingId"])
      .index("by_status", ["status"]),

    // Match runs produced by the Smart Matcher.
    match_runs: defineTable({
      organisationId: v.id("organisations"),
      createdBy: v.id("users"),
      rulesVersion: v.string(),
      inputSnapshot: v.optional(v.any()),
      resultCount: v.number(),
      name: v.optional(v.string()),
      isDemo: v.boolean(),
      createdAt: v.number(),
    })
      .index("by_organisation", ["organisationId"])
      .index("by_created_by", ["createdBy"]),

    // Impact records derived from source transactions.
    impact_records: defineTable({
      organisationId: v.id("organisations"),
      sourceResourceType: v.string(),
      sourceResourceId: v.optional(v.id("misc")),
      metric: v.string(),
      value: v.number(),
      unit: v.string(),
      formulaVersion: v.string(),
      source: v.string(),
      calculationDate: v.number(),
      assumptions: v.optional(v.string()),
      isDemo: v.boolean(),
    })
      .index("by_organisation", ["organisationId"])
      .index("by_source_resource_type", ["sourceResourceType"])
      .index("by_metric", ["metric"])
      .index("by_calculation_date", ["calculationDate"]),

    // Integration status for the integration health dashboard.
    integration_status: defineTable({
      provider: v.string(),
      status: v.string(),
      configured: v.boolean(),
      lastCheckedAt: v.number(),
      lastError: v.optional(v.string()),
      detail: v.optional(v.string()),
    })
      .index("by_provider", ["provider"]),

    // Demo metadata, so seeded records can be clearly labelled.
    demo_metadata: defineTable({
      seededAt: v.number(),
    }),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
