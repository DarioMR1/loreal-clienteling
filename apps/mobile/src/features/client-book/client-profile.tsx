import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Avatar } from "@/components/ui/avatar";
import { SegmentBadge } from "@/components/ui/badge";
import { TabBar } from "@/components/ui/tab-bar";
import { Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { Customer } from "@/types";
import { useCustomerProfile } from "./hooks/use-clients";

import { ActivityFeed } from "./activity-feed";
import { BeautyProfileView } from "./beauty-profile";
import { ClientSummary } from "./client-summary";
import { FollowUpView } from "./follow-up";
import { Recommendations } from "./recommendations";

const profileTabs = [
  { key: "summary", label: "Resumen" },
  { key: "beauty", label: "Belleza" },
  { key: "history", label: "Historial" },
  { key: "recommendations", label: "Recomendaciones" },
  { key: "follow-up", label: "Seguimiento" },
];

interface ClientProfileProps {
  customer: Customer;
}

export function ClientProfile({ customer }: ClientProfileProps) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("summary");
  const profile = useCustomerProfile(customer.id);

  const renderContent = () => {
    if (profile.isLoading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="small" color={theme.accent} />
        </View>
      );
    }

    switch (activeTab) {
      case "summary":
        return (
          <ClientSummary
            customer={customer}
            purchases={profile.purchases}
            consents={profile.consents}
            communications={profile.communications}
          />
        );
      case "beauty":
        return <BeautyProfileView beautyProfile={profile.beautyProfile} />;
      case "history":
        return (
          <ActivityFeed
            purchases={profile.purchases}
            recommendations={profile.recommendations}
            communications={profile.communications}
            samples={profile.samples}
          />
        );
      case "recommendations":
        return (
          <Recommendations recommendations={profile.recommendations} />
        );
      case "follow-up":
        return (
          <FollowUpView
            customer={customer}
            consents={profile.consents}
            communications={profile.communications}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <View style={styles.headerTop}>
          <Avatar
            uri={undefined}
            size={64}
            borderColor={
              customer.lifecycleSegment === "vip"
                ? theme.vip
                : customer.lifecycleSegment === "at_risk"
                  ? theme.atRisk
                  : theme.border
            }
          />
          <View style={styles.headerInfo}>
            <View style={styles.nameRow}>
              <Text style={[styles.name, { color: theme.text }]}>
                {customer.firstName} {customer.lastName}
              </Text>
              <SegmentBadge segment={customer.lifecycleSegment} />
            </View>
            <Text style={[styles.meta, { color: theme.textSecondary }]}>
              {customer.phone ?? "Sin teléfono"} ·{" "}
              {customer.email ?? "Sin email"}
            </Text>
            <Text style={[styles.meta, { color: theme.textTertiary }]}>
              Cliente desde{" "}
              {customer.customerSince
                ? new Date(customer.customerSince).toLocaleDateString("es-MX", {
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </Text>
          </View>
        </View>

        <TabBar
          tabs={profileTabs}
          activeTab={activeTab}
          onTabPress={setActiveTab}
        />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing["3xl"],
  },
  header: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
    padding: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  name: {
    ...Typography.title2,
  },
  meta: {
    ...Typography.subhead,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    padding: Spacing.xl,
    paddingBottom: Spacing["4xl"],
  },
});
