import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { SegmentationCron } from "./segmentation.cron";
import { LifecycleAlertsCron } from "./lifecycle-alerts.cron";
import { AppointmentRemindersCron } from "./appointment-reminders.cron";

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [SegmentationCron, LifecycleAlertsCron, AppointmentRemindersCron],
})
export class SchedulerModule {}
