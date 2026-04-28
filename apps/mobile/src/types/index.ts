// ─── Client ──────────────────────────────────────────────
export type ClientSegment = 'vip' | 'recurrent' | 'new' | 'at-risk';
export type Gender = 'female' | 'male' | 'non-binary' | 'prefer-not-to-say';
export type SkinType = 'normal' | 'dry' | 'oily' | 'combination' | 'sensitive';
export type SkinConcern = 'wrinkles' | 'acne' | 'dark-spots' | 'pores' | 'dryness' | 'redness' | 'dullness';
export type BeautyCategory = 'skincare' | 'makeup' | 'fragrance';
export type Routine = 'day' | 'night' | 'both';
export type ConsentChannel = 'sms' | 'email' | 'whatsapp';

export interface ShadeMatch {
  category: string; // e.g. "Foundation", "Concealer", "Lipstick"
  shade: string;
  brand: string;
}

export interface BeautyProfile {
  skinType: SkinType;
  concerns: SkinConcern[];
  tone: string;
  undertone: string;
  routine: Routine;
  categories: BeautyCategory[];
  shades: ShadeMatch[];
  preferredIngredients: string[];
  avoidIngredients: string[];
}

export interface PrivacyConsent {
  accepted: boolean;
  date: string;
  version: string;
}

export interface ChannelConsents {
  sms: boolean;
  email: boolean;
  whatsapp: boolean;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  birthDate: string;
  phone: string;
  email: string;
  photoUrl: string;
  segment: ClientSegment;
  registeredAt: string;
  lastVisit: string;
  lastPurchase: string;
  preferredBrand: string;
  privacyConsent: PrivacyConsent;
  channelConsents: ChannelConsents;
  beautyProfile: BeautyProfile;
  totalSpent: number;
  visitCount: number;
}

// ─── Product ─────────────────────────────────────────────
export type ProductCategory = 'skincare' | 'makeup' | 'fragrance' | 'haircare';

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  imageUrl: string;
  description: string;
  inStock: boolean;
  attributes: Record<string, string>;
}

// ─── Purchase ────────────────────────────────────────────
export interface Purchase {
  id: string;
  clientId: string;
  productId: string;
  product: Product;
  date: string;
  quantity: number;
  price: number;
  advisorId: string;
}

// ─── Recommendation ─────────────────────────────────────
export interface Recommendation {
  id: string;
  clientId: string;
  productId: string;
  product: Product;
  date: string;
  notes: string;
  convertedToPurchase: boolean;
}

// ─── Appointment ─────────────────────────────────────────
export type AppointmentStatus = 'confirmed' | 'rescheduled' | 'cancelled' | 'completed';
export type EventType = 'cabin-service' | 'facial' | 'anniversary-event' | 'vip-cabin' | 'product-follow-up' | 'virtual-consultation';

export interface Appointment {
  id: string;
  clientId: string;
  client: Pick<Client, 'id' | 'firstName' | 'lastName' | 'photoUrl' | 'phone'>;
  eventType: EventType;
  date: string;
  time: string;
  endTime: string;
  status: AppointmentStatus;
  notes: string;
  advisorId: string;
}

// ─── Follow-Up ───────────────────────────────────────────
export type FollowUpType = '3-month' | '6-month' | 'birthday' | 'replenishment' | 'special-event';

export interface FollowUp {
  id: string;
  clientId: string;
  client: Pick<Client, 'id' | 'firstName' | 'lastName' | 'photoUrl'>;
  type: FollowUpType;
  dueDate: string;
  completed: boolean;
  notes: string;
}

// ─── Activity (timeline) ─────────────────────────────────
export type ActivityType = 'purchase' | 'recommendation' | 'appointment' | 'follow-up' | 'message' | 'sample';

export interface Activity {
  id: string;
  clientId: string;
  type: ActivityType;
  date: string;
  title: string;
  subtitle: string;
  metadata?: Record<string, string>;
}

// ─── Message ─────────────────────────────────────────────
export type MessageChannel = 'whatsapp' | 'sms' | 'email';

export interface Message {
  id: string;
  clientId: string;
  channel: MessageChannel;
  templateName: string;
  sentAt: string;
  content: string;
}

// ─── Beauty Advisor ──────────────────────────────────────
export interface BeautyAdvisor {
  id: string;
  name: string;
  photoUrl: string;
  store: string;
  brand: string;
  role: 'ba' | 'store-manager' | 'zone-supervisor' | 'admin';
}

// ─── Metrics ─────────────────────────────────────────────
export interface SalesMetric {
  label: string;
  value: number;
  target: number;
  unit: 'currency' | 'count' | 'percent';
}

// ─── Navigation ──────────────────────────────────────────
export type SidebarSection = 'client-book' | 'appointments' | 'product-catalog' | 'performance' | 'settings';
