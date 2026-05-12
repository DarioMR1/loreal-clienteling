import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DATABASE_TOKEN, type Database } from "../../config/database.provider";
import { appointmentEventTypes } from "@loreal/database";
import type {
  CreateAppointmentEventTypeDto,
  UpdateAppointmentEventTypeDto,
} from "../../dtos/appointment-event-types.dto";

@Injectable()
export class AppointmentEventTypesService {
  constructor(@Inject(DATABASE_TOKEN) private db: Database) {}

  async findAll() {
    return this.db
      .select()
      .from(appointmentEventTypes)
      .orderBy(appointmentEventTypes.displayName);
  }

  async findActive() {
    return this.db
      .select()
      .from(appointmentEventTypes)
      .where(eq(appointmentEventTypes.active, true))
      .orderBy(appointmentEventTypes.displayName);
  }

  async findOne(id: string) {
    const [eventType] = await this.db
      .select()
      .from(appointmentEventTypes)
      .where(eq(appointmentEventTypes.id, id));
    if (!eventType) throw new NotFoundException("Appointment event type not found");
    return eventType;
  }

  async create(data: CreateAppointmentEventTypeDto) {
    const [eventType] = await this.db
      .insert(appointmentEventTypes)
      .values(data)
      .returning();
    return eventType;
  }

  async update(id: string, data: UpdateAppointmentEventTypeDto) {
    const [eventType] = await this.db
      .update(appointmentEventTypes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(appointmentEventTypes.id, id))
      .returning();
    if (!eventType) throw new NotFoundException("Appointment event type not found");
    return eventType;
  }
}
