import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { eq, and, ilike, or } from "drizzle-orm";
import { DATABASE_TOKEN, type Database } from "../../config/database.provider";
import { products, productAvailability, brands } from "@loreal/database";
import type { SessionUser } from "../../common/types/session";
import { ScopeService } from "../../common/services/scope.service";
import type { PaginationDto } from "../../dtos/common.dto";
import type { CreateProductDto, UpdateProductDto } from "../../dtos/products.dto";

@Injectable()
export class ProductsService {
  constructor(
    @Inject(DATABASE_TOKEN) private db: Database,
    @Inject(ScopeService) private scopeService: ScopeService,
  ) {}

  async findAll(user: SessionUser, pagination: PaginationDto, filters?: { category?: string; search?: string }) {
    const brandScope = this.scopeService.scopeByBrand(user, products.brandId);

    const conditions = [
      eq(products.active, true),
      ...(brandScope ? [brandScope] : []),
      ...(filters?.category ? [eq(products.category, filters.category)] : []),
      ...(filters?.search
        ? [or(ilike(products.name, `%${filters.search}%`), ilike(products.sku, `%${filters.search}%`))]
        : []),
    ];

    const where = conditions.length > 1 ? and(...conditions) : conditions[0];

    const rows = await this.db
      .select({
        product: products,
        brand: brands,
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .where(where)
      .limit(pagination.limit)
      .offset((pagination.page - 1) * pagination.limit);

    return rows.map((r) => ({ ...r.product, brand: r.brand }));
  }

  async findOne(id: string) {
    const [row] = await this.db
      .select({
        product: products,
        brand: brands,
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .where(eq(products.id, id));
    if (!row) throw new NotFoundException("Product not found");
    return { ...row.product, brand: row.brand };
  }

  async create(data: CreateProductDto) {
    const [product] = await this.db
      .insert(products)
      .values({
        ...data,
        price: String(data.price),
      })
      .returning();
    return product;
  }

  async update(id: string, data: UpdateProductDto) {
    const { price, ...rest } = data;
    const [product] = await this.db
      .update(products)
      .set({
        ...rest,
        ...(price !== undefined ? { price: String(price) } : {}),
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();
    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  async getAvailability(productId: string, user: SessionUser) {
    const scope = await this.scopeService.scopeByStore(user, productAvailability.storeId);
    const conditions = [eq(productAvailability.productId, productId)];
    if (scope) conditions.push(scope);

    return this.db
      .select()
      .from(productAvailability)
      .where(and(...conditions));
  }

  async updateAvailability(productId: string, storeId: string, stockStatus: string) {
    const [existing] = await this.db
      .select()
      .from(productAvailability)
      .where(and(eq(productAvailability.productId, productId), eq(productAvailability.storeId, storeId)));

    if (existing) {
      const [updated] = await this.db
        .update(productAvailability)
        .set({ stockStatus, lastSyncedAt: new Date() })
        .where(eq(productAvailability.id, existing.id))
        .returning();
      return updated;
    }

    const [created] = await this.db
      .insert(productAvailability)
      .values({ productId, storeId, stockStatus })
      .returning();
    return created;
  }
}
