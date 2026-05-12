import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Icon } from "@/components/ui/icon";
import { StatusBadge } from "@/components/ui/badge";
import { Radius, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { Appointment } from "@/types";
import {
  eventTypeLabels,
  eventTypeColors,
  eventTypeIcons,
  statusLabels,
  statusColors,
} from "@/constants/event-colors";

// ─── Constants ──────────────────────────────────────────

const HOUR_HEIGHT = 72; // px per hour
const START_HOUR = 8; // 8 AM
const END_HOUR = 20; // 8 PM
const TOTAL_HOURS = END_HOUR - START_HOUR;
const TIMELINE_LEFT = 52; // space for hour labels
const NOW_LINE_COLOR = "#C44536";

// ─── Helpers ────────────────────────────────────────────

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTopOffset(date: Date): number {
  const hours = date.getHours() - START_HOUR;
  const minutes = date.getMinutes();
  return (hours + minutes / 60) * HOUR_HEIGHT;
}

function formatDayHeader(date: Date): string {
  const today = new Date();
  if (isSameDay(date, today)) return "Hoy";
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (isSameDay(date, tomorrow)) return "Mañana";
  return date.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

// ─── Component ──────────────────────────────────────────

interface DayTimelineProps {
  date: Date;
  appointments: Appointment[];
  selectedId: string | null;
  onSelect: (appointment: Appointment) => void;
}

export function DayTimeline({
  date,
  appointments,
  selectedId,
  onSelect,
}: DayTimelineProps) {
  const theme = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const isToday = useMemo(() => isSameDay(date, new Date()), [date]);

  // Filter appointments for this day
  const dayAppointments = useMemo(() => {
    return (appointments ?? [])
      .filter((a) => isSameDay(new Date(a.scheduledAt), date))
      .sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
      );
  }, [appointments, date]);

  // Now-line position
  const [nowOffset, setNowOffset] = useState(() =>
    isToday ? getTopOffset(new Date()) : -1
  );

  useEffect(() => {
    if (!isToday) return;
    const interval = setInterval(() => {
      setNowOffset(getTopOffset(new Date()));
    }, 60_000); // update every minute
    return () => clearInterval(interval);
  }, [isToday]);

  // Auto-scroll to now or first appointment
  useEffect(() => {
    const scrollTo = isToday
      ? Math.max(0, nowOffset - HOUR_HEIGHT * 2)
      : dayAppointments.length > 0
        ? Math.max(0, getTopOffset(new Date(dayAppointments[0].scheduledAt)) - HOUR_HEIGHT)
        : 0;

    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: scrollTo, animated: false });
    }, 100);
  }, [date]);

  // Hour grid
  const hours = useMemo(() => {
    const h: number[] = [];
    for (let i = START_HOUR; i < END_HOUR; i++) h.push(i);
    return h;
  }, []);

  const dayLabel = formatDayHeader(date);

  return (
    <View style={styles.container}>
      {/* Day header */}
      <View style={[styles.dayHeader, { borderBottomColor: theme.border }]}>
        <Text style={[styles.dayLabel, { color: theme.text }]}>
          {dayLabel}
        </Text>
        <Text style={[styles.countLabel, { color: theme.textSecondary }]}>
          {dayAppointments.length}{" "}
          {dayAppointments.length === 1 ? "cita" : "citas"}
        </Text>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scrollContainer}
        contentContainerStyle={{
          height: TOTAL_HOURS * HOUR_HEIGHT,
          position: "relative",
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hour lines */}
        {hours.map((h) => {
          const top = (h - START_HOUR) * HOUR_HEIGHT;
          return (
            <View key={h} style={[styles.hourRow, { top }]}>
              <Text style={[styles.hourLabel, { color: theme.textTertiary }]}>
                {String(h).padStart(2, "0")}:00
              </Text>
              <View
                style={[styles.hourLine, { backgroundColor: theme.borderLight }]}
              />
            </View>
          );
        })}

        {/* Appointment blocks */}
        {dayAppointments.map((apt) => {
          const aptDate = new Date(apt.scheduledAt);
          const top = getTopOffset(aptDate);
          const height = Math.max(
            (apt.durationMinutes / 60) * HOUR_HEIGHT,
            36
          );
          const eColor = eventTypeColors[apt.eventType] ?? theme.textSecondary;
          const isSelected = apt.id === selectedId;

          return (
            <Pressable
              key={apt.id}
              onPress={() => onSelect(apt)}
              style={[
                styles.appointmentBlock,
                {
                  top,
                  height,
                  backgroundColor: eColor + "15",
                  borderLeftColor: eColor,
                  borderColor: isSelected ? eColor : "transparent",
                },
                isSelected && { backgroundColor: eColor + "25" },
              ]}
            >
              <View style={styles.aptContent}>
                <View style={styles.aptHeader}>
                  <Icon
                    name={eventTypeIcons[apt.eventType] ?? "calendar"}
                    size={14}
                    color={eColor}
                  />
                  <Text
                    style={[styles.aptTime, { color: eColor }]}
                  >
                    {formatTime(apt.scheduledAt)}
                  </Text>
                  <Text
                    style={[styles.aptDuration, { color: theme.textTertiary }]}
                  >
                    {apt.durationMinutes}min
                  </Text>
                </View>
                <Text
                  style={[styles.aptClient, { color: theme.text }]}
                  numberOfLines={1}
                >
                  {apt.customer
                    ? `${apt.customer.firstName} ${apt.customer.lastName}`
                    : "—"}
                </Text>
                {height >= 56 && (
                  <Text
                    style={[styles.aptType, { color: theme.textSecondary }]}
                    numberOfLines={1}
                  >
                    {eventTypeLabels[apt.eventType] ?? apt.eventType}
                  </Text>
                )}
              </View>
              {/* Status dot */}
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      statusColors[apt.status] ?? theme.textTertiary,
                  },
                ]}
              />
            </Pressable>
          );
        })}

        {/* Now indicator */}
        {isToday && nowOffset >= 0 && nowOffset <= TOTAL_HOURS * HOUR_HEIGHT && (
          <View style={[styles.nowLine, { top: nowOffset }]}>
            <View style={styles.nowDot} />
            <View style={styles.nowLineBar} />
          </View>
        )}

        {/* Empty state */}
        {dayAppointments.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="calendar" size={32} color={theme.textTertiary} />
            <Text style={[styles.emptyText, { color: theme.textTertiary }]}>
              Sin citas para este día
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dayLabel: {
    ...Typography.headline,
    textTransform: "capitalize",
  },
  countLabel: {
    ...Typography.caption1,
  },
  scrollContainer: {
    flex: 1,
  },
  // Hour grid
  hourRow: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "flex-start",
    height: HOUR_HEIGHT,
  },
  hourLabel: {
    width: TIMELINE_LEFT,
    ...Typography.caption2,
    textAlign: "right",
    paddingRight: Spacing.sm,
    marginTop: -7,
  },
  hourLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  // Appointment blocks
  appointmentBlock: {
    position: "absolute",
    left: TIMELINE_LEFT + 4,
    right: Spacing.lg,
    borderRadius: Radius.md,
    borderLeftWidth: 3,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    flexDirection: "row",
    alignItems: "flex-start",
    overflow: "hidden",
  },
  aptContent: {
    flex: 1,
    gap: 2,
  },
  aptHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  aptTime: {
    ...Typography.caption1,
    fontWeight: "700",
  },
  aptDuration: {
    ...Typography.caption2,
  },
  aptClient: {
    ...Typography.subhead,
    fontWeight: "600",
  },
  aptType: {
    ...Typography.caption1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  // Now line
  nowLine: {
    position: "absolute",
    left: TIMELINE_LEFT - 4,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },
  nowDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: NOW_LINE_COLOR,
  },
  nowLineBar: {
    flex: 1,
    height: 2,
    backgroundColor: NOW_LINE_COLOR,
  },
  // Empty
  emptyState: {
    position: "absolute",
    top: HOUR_HEIGHT * 3,
    left: TIMELINE_LEFT,
    right: 0,
    alignItems: "center",
    gap: Spacing.sm,
  },
  emptyText: {
    ...Typography.subhead,
  },
});
