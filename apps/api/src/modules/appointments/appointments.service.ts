import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { DATABASE_TOKEN, type Database } from "../../config/database.provider";
import { appointments } from "@loreal/database";
import type { SessionUser } from "../../common/types/session";
import { ScopeService } from "../../common/services/scope.service";
import type { CreateAppointmentDto, UpdateAppointmentDto } from "../../dtos/appointments.dto";

@Injectable()
export class AppointmentsService {
  constructor(
    @Inject(DATABASE_TOKEN) private db: Database,
    @Inject(ScopeService) private scopeService: ScopeService,
  ) {}

  async findAll(user: SessionUser, filters?: { from?: Date; to?: Date }) {
    const conditions: any[] = [];

    // BA sees only their appointments; manager/supervisor/admin see by store scope
    if (user.role === "ba") {
      conditions.push(eq(appointments.baUserId, user.id));
    } else {
      const scope = await this.scopeService.scopeByStore(user, appointments.storeId);
      if (scope) conditions.push(scope);
    }

    if (filters?.from) conditions.push(gte(appointments.scheduledAt, filters.from));
    if (filters?.to) conditions.push(lte(appointments.scheduledAt, filters.to));

    return this.db
      .select()
      .from(appointments)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(appointments.scheduledAt));
  }

  async findOne(id: string) {
    const [appt] = await this.db.select().from(appointments).where(eq(appointments.id, id));
    if (!appt) throw new NotFoundException("Appointment not found");
    return appt;
  }

  async create(data: CreateAppointmentDto, user: SessionUser) {
    const storeId = this.scopeService.assertStore(user);
    const [appt] = await this.db
      .insert(appointments)
      .values({
        customerId: data.customerId,
        baUserId: user.id,
        storeId,
        eventType: data.eventType,
        scheduledAt: data.scheduledAt,
        durationMinutes: data.durationMinutes,
        comments: data.comments,
        isVirtual: data.isVirtual ?? false,
        videoLink: data.videoLink,
      })
      .returning();
    return appt;
  }

  async update(id: string, data: UpdateAppointmentDto, user: SessionUser) {
    const existing = await this.findOne(id);

    // If rescheduling: create new appointment linked to old one
    if (data.status === "rescheduled" && data.scheduledAt) {
      await this.db
        .update(appointments)
        .set({ status: "rescheduled", updatedAt: new Date() })
        .where(eq(appointments.id, id));

      const [newAppt] = await this.db
        .insert(appointments)
        .values({
          customerId: existing.customerId,
          baUserId: existing.baUserId,
          storeId: existing.storeId,
          eventType: existing.eventType,
          scheduledAt: data.scheduledAt,
          durationMinutes: data.durationMinutes ?? existing.durationMinutes,
          comments: data.comments ?? existing.comments,
          isVirtual: existing.isVirtual,
          videoLink: existing.videoLink,
          rescheduledFromAppointmentId: id,
        })
        .returning();
      return newAppt;
    }

    const [updated] = await this.db
      .update(appointments)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();
    return updated;
  }

  async getCalendar(from: Date, to: Date, user: SessionUser) {
    return this.findAll(user, { from, to });
  }
}
