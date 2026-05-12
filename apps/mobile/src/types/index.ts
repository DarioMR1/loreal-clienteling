/**
 * Mobile app types — built on top of @loreal/contracts enums.
 *
 * These represent the shapes returned by the API endpoints,
 * not the Drizzle schema rows. The API may join, rename, or
 * omit fields compared to the raw DB tables.
 */

// Re-export enums so feature code imports from one place
export {
  type Gender,
  type LifecycleSegment,
  type AppointmentStatus,
  type AppointmentEventType,
  type CommunicationChannel,
  type FollowupType,
  type ProductCategory,
  type StockStatus,
  type SkinType,
  type SkinTone,
  type SkinSubtone,
  type SkinConcern,
  type ShadeCategory,
  type RoutineType,
  type BeautyInterest,
  type FragrancePreference,
  type RecommendationSource,
  type VisitReason,
  type PurchaseSource,
  type AttributionReason,
  type ConsentType,
  type UserRole,
} from "@loreal/contracts";

// ─── Navigation ──────────────────────────────────────────
export type SidebarSection =
  | "client-book"
  | "appointments"
  | "product-catalog"
  | "performance"
  | "settings";

// ─── Customer (from GET /customers, GET /customers/:id) ──
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  gender: string | null;
  birthDate: string | null;
  registeredAtStoreId: string | null;
  registeredByUserId: string | null;
  lastBaUserId: string | null;
  customerSince: string | null;
  lastContactAt: string | null;
  lastTransactionAt: string | null;
  lifecycleSegment: string | null;
  inactive: boolean | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Beauty Profile (from GET /customers/:id/beauty-profile) ──
export interface BeautyProfile {
  id: string;
  customerId: string;
  skinType: string | null;
  skinTone: string | null;
  skinSubtone: string | null;
  skinConcerns: string[] | null;
  preferredIngredients: string[] | null;
  avoidedIngredients: string[] | null;
  fragrancePreferences: string[] | null;
  makeupPreferences: Record<string, unknown> | null;
  routineType: string | null;
  interests: string[] | null;
  shades: BeautyProfileShade[];
}

export interface BeautyProfileShade {
  id: string;
  beautyProfileId: string;
  category: string;
  brandId: string;
  productId: string;
  shadeCode: string;
  capturedAt: string;
  capturedByUserId: string;
}

// ─── Product (from GET /products, GET /products/:id) ──
export interface Product {
  id: string;
  sku: string;
  brandId: string;
  name: string;
  category: string;
  subcategory: string | null;
  description: string | null;
  ingredients: string[] | null;
  price: string; // numeric comes as string from API
  images: string[] | null;
  shadeOptions: unknown | null;
  estimatedDurationDays: number | null;
  technicalSheetUrl: string | null;
  tutorialUrl: string | null;
  salesArgument: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  // Joined data
  brand?: Brand;
}

export interface ProductAvailability {
  id: string;
  productId: string;
  storeId: string;
  stockStatus: string;
  lastSyncedAt: string | null;
}

// ─── Brand (from GET /brands) ──
export interface Brand {
  id: string;
  code: string;
  displayName: string;
  tier: string;
  active: boolean;
}

export interface BrandConfig {
  id: string;
  brandId: string;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  logoUrl: string | null;
  fontFamily: string | null;
  messageTemplates: unknown | null;
  replenishmentRules: unknown | null;
  virtualTryonEnabled: boolean;
}

// ─── Store (from GET /stores) ──
export interface Store {
  id: string;
  code: string;
  displayName: string;
  chain: string;
  zoneId: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  active: boolean;
}

// ─── Recommendation (from GET /customers/:id/recommendations) ──
export interface Recommendation {
  id: string;
  customerId: string;
  productId: string;
  baUserId: string;
  storeId: string;
  recommendedAt: string;
  source: string;
  aiReasoning: string | null;
  notes: string | null;
  visitReason: string | null;
  convertedToPurchase: boolean;
  conversionPurchaseId: string | null;
  // Joined
  product?: Product;
}

// ─── Purchase (from GET /customers/:id/purchases) ──
export interface Purchase {
  id: string;
  customerId: string;
  storeId: string;
  purchasedAt: string;
  totalAmount: string; // numeric as string
  posTransactionId: string | null;
  source: string;
  attributedBaUserId: string | null;
  attributionReason: string | null;
  items: PurchaseItem[];
}

export interface PurchaseItem {
  id: string;
  purchaseId: string;
  productId: string;
  sku: string;
  quantity: number;
  unitPrice: string; // numeric as string
  product?: Product;
}

// ─── Sample (from GET /customers/:id/samples) ──
export interface Sample {
  id: string;
  customerId: string;
  productId: string;
  baUserId: string;
  storeId: string;
  deliveredAt: string;
  convertedToPurchase: boolean;
  conversionPurchaseId: string | null;
  product?: Product;
}

// ─── Appointment (from GET /appointments) ──
export interface Appointment {
  id: string;
  customerId: string;
  baUserId: string;
  storeId: string;
  eventType: string;
  scheduledAt: string;
  durationMinutes: number;
  status: string;
  comments: string | null;
  reminderSentAt: string | null;
  confirmationSentAt: string | null;
  isVirtual: boolean;
  videoLink: string | null;
  rescheduledFromAppointmentId: string | null;
  createdAt: string;
  updatedAt: string;
  // Joined
  customer?: Customer;
}

// ─── Communication (from GET /customers/:id/communications) ──
export interface Communication {
  id: string;
  customerId: string;
  sentByUserId: string;
  channel: string;
  templateId: string | null;
  subject: string | null;
  body: string;
  followupType: string | null;
  sentAt: string;
  deliveredAt: string | null;
  readAt: string | null;
  respondedAt: string | null;
  trackingLinkId: string | null;
}

// ─── MessageTemplate (from GET /communications/templates) ──
export interface MessageTemplate {
  id: string;
  brandId: string | null;
  name: string;
  channel: string;
  body: string;
  followupType: string | null;
  active: boolean;
}

// ─── Consent (from GET /customers/:id/consents) ──
export interface Consent {
  id: string;
  customerId: string;
  type: string;
  version: string | null;
  acceptedAt: string;
  revokedAt: string | null;
  source: string | null;
}

// ─── Analytics (from GET /analytics/*) ──

/** GET /analytics/dashboard — matches actual API response shape */
export interface DashboardMetrics {
  totalCustomers: number;
  sales: {
    totalAmount: string;
    transactionCount: number;
  };
  appointments: number;
  newCustomers: number;
  communicationsSent: number;
  period: { from: string; to: string };
}

/** GET /analytics/conversion */
export interface ConversionMetrics {
  recommendationToSale: { total: number; converted: number; rate: number };
  sampleToSale: { total: number; converted: number; rate: number };
  period: { from: string; to: string };
}

/** GET /analytics/appointments */
export interface AppointmentMetrics {
  total: number;
  scheduled: number;
  confirmed: number;
  completed: number;
  rescheduled: number;
  cancelled: number;
  noShow: number;
  period: { from: string; to: string };
}

/** GET /analytics/sales-breakdown?groupBy=category|brand */
export interface SalesBreakdown {
  groupBy: "category" | "brand";
  data: { category?: string; brandId?: string; totalAmount: string; itemCount: number }[];
  period: { from: string; to: string };
}

/** GET /analytics/sales-trend */
export interface SalesTrend {
  interval: "day" | "week" | "month";
  data: { date: string; totalAmount: string; transactionCount: number }[];
  period: { from: string; to: string };
}

/** GET /analytics/customers */
export interface CustomerSegmentData {
  segment: string;
  count: number;
}

/** GET /analytics/ba-performance */
export interface BaPerformance {
  baId: string;
  fullName: string;
  storeId: string;
  sales: { totalAmount: string; transactionCount: number };
  registrations: number;
  communicationsSent: number;
  recommendations: { total: number; converted: number; conversionRate: number };
}

// ─── UI / Metrics ──
export interface SalesMetric {
  label: string;
  value: number;
  target: number;
  unit: "currency" | "count" | "percent";
}

// ─── Audit Log ──
export interface AuditLog {
  id: string;
  actorUserId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  changes: unknown;
  ipAddress: string | null;
  userAgent: string | null;
  timestamp: string;
}
