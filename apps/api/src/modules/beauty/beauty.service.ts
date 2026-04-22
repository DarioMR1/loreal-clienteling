import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { eq, and } from "drizzle-orm";
import { DATABASE_TOKEN, type Database } from "../../config/database.provider";
import { beautyProfiles, beautyProfileShades, products } from "@loreal/database";
import { findMatchingShades } from "@loreal/domain";
import type { UpsertBeautyProfile, CreateShade } from "@loreal/contracts";
import type { SessionUser } from "../../common/types/session";
import { ScopeService } from "../../common/services/scope.service";

@Injectable()
export class BeautyService {
  constructor(
    @Inject(DATABASE_TOKEN) private db: Database,
    private scopeService: ScopeService,
  ) {}

  async findProfile(customerId: string) {
    const [profile] = await this.db
      .select()
      .from(beautyProfiles)
      .where(eq(beautyProfiles.customerId, customerId));

    if (!profile) return null;

    const shades = await this.db
      .select()
      .from(beautyProfileShades)
      .where(eq(beautyProfileShades.beautyProfileId, profile.id));

    return { ...profile, shades };
  }

  async upsertProfile(data: UpsertBeautyProfile, user: SessionUser) {
    const [existing] = await this.db
      .select()
      .from(beautyProfiles)
      .where(eq(beautyProfiles.customerId, data.customerId));

    if (existing) {
      const { customerId, ...updateData } = data;
      const [updated] = await this.db
        .update(beautyProfiles)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(beautyProfiles.id, existing.id))
        .returning();
      return updated;
    }

    const [created] = await this.db
      .insert(beautyProfiles)
      .values(data)
      .returning();
    return created;
  }

  async addShade(data: CreateShade, user: SessionUser) {
    const [shade] = await this.db
      .insert(beautyProfileShades)
      .values({
        ...data,
        capturedByUserId: user.id,
        capturedAt: new Date(),
      })
      .returning();
    return shade;
  }

  async getShadeMatches(
    customerId: string,
    category: string,
    brandId?: string,
    user?: SessionUser,
  ) {
    const profile = await this.findProfile(customerId);
    if (!profile) throw new NotFoundException("Beauty profile not found");

    const currentShades = (profile.shades ?? []).map((s) => ({
      productId: s.productId,
      brandId: s.brandId,
      shadeCode: s.shadeCode,
      category: s.category as any,
      skinTone: profile.skinTone as any,
      skinSubtone: profile.skinSubtone as any,
    }));

    // Get available shades from products
    const allProducts = await this.db.select().from(products);
    const availableShades = allProducts.flatMap((p) => {
      const opts = p.shadeOptions as any[];
      if (!Array.isArray(opts)) return [];
      return opts.map((opt: any) => ({
        productId: p.id,
        brandId: p.brandId,
        shadeCode: opt.shadeCode ?? opt.code,
        category: p.category as any,
        skinTone: opt.skinTone as any,
        skinSubtone: opt.skinSubtone as any,
      }));
    });

    return findMatchingShades({
      targetCategory: category as any,
      customerSkinTone: profile.skinTone as any,
      customerSkinSubtone: profile.skinSubtone as any,
      currentShades,
      availableShades,
      targetBrandId: brandId,
    });
  }
}
