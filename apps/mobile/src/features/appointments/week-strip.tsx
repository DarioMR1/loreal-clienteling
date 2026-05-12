import React, { useCallback, useMemo, useRef } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Icon } from "@/components/ui/icon";
import { Radius, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { Appointment } from "@/types";
import { eventTypeColors } from "@/constants/event-colors";

const DAY_NAMES_SHORT = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day; // Monday start
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Generate N weeks centered around today (±weeks in each direction). */
function generateWeeks(weeksAround: number): Date[] {
  const today = new Date();
  const start = startOfWeek(today);
  start.setDate(start.getDate() - weeksAround * 7);

  const days: Date[] = [];
  for (let i = 0; i < (weeksAround * 2 + 1) * 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

const WEEKS_AROUND = 8;
const DAY_WIDTH = 48;

interface WeekStripProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  appointments: Appointment[];
}

export function WeekStrip({
  selectedDate,
  onSelectDate,
  appointments,
}: WeekStripProps) {
  const theme = useTheme();
  const listRef = useRef<FlatList>(null);
  const allDays = useMemo(() => generateWeeks(WEEKS_AROUND), []);
  const today = useMemo(() => new Date(), []);

  // Pre-compute appointment dots per day
  const dotsByDay = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const apt of appointments ?? []) {
      const d = new Date(apt.scheduledAt);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const colors = map.get(key) ?? [];
      const c = eventTypeColors[apt.eventType] ?? theme.textTertiary;
      if (!colors.includes(c)) colors.push(c);
      map.set(key, colors);
    }
    return map;
  }, [appointments, theme.textTertiary]);

  // Find initial scroll index (today)
  const todayIndex = useMemo(
    () => allDays.findIndex((d) => isSameDay(d, today)),
    [allDays, today]
  );

  const goToToday = useCallback(() => {
    onSelectDate(new Date());
    listRef.current?.scrollToIndex({
      index: todayIndex,
      animated: true,
      viewPosition: 0.3,
    });
  }, [todayIndex, onSelectDate]);

  // Month/year label from selected date
  const monthLabel = `${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;

  const renderDay = useCallback(
    ({ item: day }: { item: Date }) => {
      const isToday = isSameDay(day, today);
      const isSelected = isSameDay(day, selectedDate);
      const key = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
      const dots = dotsByDay.get(key) ?? [];

      return (
        <Pressable
          onPress={() => onSelectDate(day)}
          style={[
            styles.dayCell,
            isSelected && [styles.dayCellSelected, { backgroundColor: theme.accent }],
          ]}
        >
          <Text
            style={[
              styles.dayName,
              { color: isSelected ? "#FFFFFF" : theme.textTertiary },
            ]}
          >
            {DAY_NAMES_SHORT[day.getDay()]}
          </Text>
          <Text
            style={[
              styles.dayNumber,
              { color: isSelected ? "#FFFFFF" : theme.text },
              isToday && !isSelected && { color: theme.accent },
            ]}
          >
            {day.getDate()}
          </Text>
          {/* Dots */}
          <View style={styles.dotRow}>
            {dots.slice(0, 3).map((c, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  { backgroundColor: isSelected ? "#FFFFFF" : c },
                ]}
              />
            ))}
          </View>
        </Pressable>
      );
    },
    [today, selectedDate, dotsByDay, onSelectDate, theme]
  );

  return (
    <View style={styles.container}>
      {/* Month header */}
      <View style={styles.monthRow}>
        <Text style={[styles.monthLabel, { color: theme.text }]}>
          {monthLabel}
        </Text>
        <Pressable onPress={goToToday} hitSlop={8} style={[styles.todayBtn, { backgroundColor: theme.accentLight }]}>
          <Text style={[styles.todayBtnText, { color: theme.accent }]}>Hoy</Text>
        </Pressable>
      </View>

      {/* Horizontal day strip */}
      <FlatList
        ref={listRef}
        data={allDays}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(d) => d.toISOString()}
        renderItem={renderDay}
        getItemLayout={(_, index) => ({
          length: DAY_WIDTH,
          offset: DAY_WIDTH * index,
          index,
        })}
        initialScrollIndex={todayIndex}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
  },
  monthLabel: {
    ...Typography.headline,
    textTransform: "capitalize",
  },
  todayBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  todayBtnText: {
    ...Typography.caption1,
    fontWeight: "700",
  },
  listContent: {
    paddingHorizontal: Spacing.sm,
  },
  dayCell: {
    width: DAY_WIDTH,
    alignItems: "center",
    paddingVertical: Spacing.sm,
    gap: 3,
    borderRadius: Radius.lg,
  },
  dayCellSelected: {
    borderRadius: Radius.lg,
  },
  dayName: {
    ...Typography.caption2,
    textTransform: "capitalize",
    fontWeight: "600",
  },
  dayNumber: {
    ...Typography.headline,
  },
  dotRow: {
    flexDirection: "row",
    gap: 3,
    height: 6,
    alignItems: "center",
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
});
