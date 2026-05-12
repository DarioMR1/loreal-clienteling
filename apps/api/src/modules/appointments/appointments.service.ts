import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { DATABASE_TOKEN, type Database } from "../../config/database.provider";
import { appointments, customers } from "@loreal/database";
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

    const rows = await this.db
      .select({
        appointment: appointments,
        customer: {
          id: customers.id,
          firstName: customers.firstName,
          lastName: customers.lastName,
          phone: customers.phone,
          email: customers.email,
          lifecycleSegment: customers.lifecycleSegment,
        },
      })
      .from(appointments)
      .leftJoin(customers, eq(appointments.customerId, customers.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(appointments.scheduledAt));

    return rows.map((r) => ({ ...r.appointment, customer: r.customer }));
  }

  async findOne(id: string) {
    const [row] = await this.db
      .select({
        appointment: appointments,
        customer: {
          id: customers.id,
          firstName: customers.firstName,
          lastName: customers.lastName,
          phone: customers.phone,
          email: customers.email,
          lifecycleSegment: customers.lifecycleSegment,
        },
      })
      .from(appointments)
      .leftJoin(customers, eq(appointments.customerId, customers.id))
      .where(eq(appointments.id, id));
    if (!row) throw new NotFoundException("Appointment not found");
    return { ...row.appointment, customer: row.customer };
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
        scheduledAt: new Date(data.scheduledAt),
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
          scheduledAt: new Date(data.scheduledAt),
          durationMinutes: data.durationMinutes ?? existing.durationMinutes,
          comments: data.comments ?? existing.comments,
          isVirtual: existing.isVirtual,
          videoLink: existing.videoLink,
          rescheduledFromAppointmentId: id,
        })
        .returning();
      return newAppt;
    }

    const updateData: Record<string, unknown> = { ...data, updatedAt: new Date() };
    if (data.scheduledAt) updateData.scheduledAt = new Date(data.scheduledAt);

    const [updated] = await this.db
      .update(appointments)
      .set(updateData)
      .where(eq(appointments.id, id))
      .returning();
    return updated;
  }

  async getCalendar(from: Date, to: Date, user: SessionUser) {
    return this.findAll(user, { from, to });
  }
}
