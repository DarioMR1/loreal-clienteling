ALTER TABLE "appointment_event_types" ADD COLUMN "duration_minutes" integer DEFAULT 60;--> statement-breakpoint
ALTER TABLE "appointment_event_types" ADD COLUMN "color" varchar(20);--> statement-breakpoint
ALTER TABLE "appointment_event_types" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "appointment_event_types" ADD COLUMN "brand_id" uuid;--> statement-breakpoint
ALTER TABLE "appointment_event_types" ADD COLUMN "max_capacity" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "appointment_event_types" ADD COLUMN "requires_confirmation" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "appointment_event_types" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "event_type_id" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "invitation_status" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "invited_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "invited_by_user_id" text;--> statement-breakpoint
ALTER TABLE "brand_configs" ADD COLUMN "vip_threshold_amount" numeric(12, 2);--> statement-breakpoint
ALTER TABLE "brand_configs" ADD COLUMN "vip_threshold_period_months" integer DEFAULT 12;--> statement-breakpoint
ALTER TABLE "brand_configs" ADD COLUMN "communication_rules" jsonb;--> statement-breakpoint
ALTER TABLE "brand_configs" ADD COLUMN "enabled_modules" jsonb;--> statement-breakpoint
ALTER TABLE "appointment_event_types" ADD CONSTRAINT "appointment_event_types_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_event_type_id_appointment_event_types_id_fk" FOREIGN KEY ("event_type_id") REFERENCES "public"."appointment_event_types"("id") ON DELETE no action ON UPDATE no action;