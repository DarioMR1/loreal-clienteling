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
import { IconButton } from "@/components/ui/icon-button";
import { TabBar } from "@/components/ui/tab-bar";
import { Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { Customer } from "@/types";
import { useCustomerProfile } from "./hooks/use-clients";

import { ActivityFeed } from "./activity-feed";
import { BeautyProfileView } from "./beauty-profile";
import { ClientSummary } from "./client-summary";
import { CreateAppointmentModal } from "../appointments/create-appointment-modal";
import { CreateRecommendationModal } from "../product-catalog/create-recommendation-modal";
import { EditCustomerModal } from "./edit-customer-modal";
import { FollowUpView } from "./follow-up";
import { PurchaseCloset } from "./purchase-closet";
import { Recommendations } from "./recommendations";

const profileTabs = [
  { key: "summary", label: "Resumen" },
  { key: "beauty", label: "Belleza" },
  { key: "purchases", label: "Compras" },
  { key: "history", label: "Historial" },
  { key: "recommendations", label: "Recomendaciones" },
  { key: "follow-up", label: "Seguimiento" },
];

function daysAgo(dateStr: string | null): string {
  if (!dateStr) return "sin visita";
  const diff = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 86_400_000
  );
  if (diff === 0) return "hoy";
  if (diff === 1) return "ayer";
  return `hace ${diff}d`;
}

function formatCurrency(amount: number): string {
  return "$" + amount.toLocaleString("es-MX", { minimumFractionDigits: 0 });
}

interface ClientProfileProps {
  customer: Customer;
}

export function ClientProfile({ customer }: ClientProfileProps) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("summary");
  const profile = useCustomerProfile(customer.id);

  // Modal state
  const [showAppointment, setShowAppointment] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [showEditCustomer, setShowEditCustomer] = useState(false);

  // LTV calculations
  const totalSpent = profile.purchases.reduce(
    (sum, p) => sum + Number(p.totalAmount),
    0
  );
  const purchaseCount = profile.purchases.length;

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
        return (
          <BeautyProfileView
            beautyProfile={profile.beautyProfile}
            customerId={customer.id}
            onUpdate={profile.refetch}
          />
        );
      case "purchases":
        return <PurchaseCloset purchases={profile.purchases} />;
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

            {/* LTV metrics */}
            <Text style={[styles.ltv, { color: theme.accent }]}>
              LTV: {formatCurrency(totalSpent)} · {purchaseCount} compras ·
              Último contacto: {daysAgo(customer.lastContactAt)}
            </Text>
          </View>
        </View>

        {/* Quick actions */}
        <View style={styles.quickActions}>
          <IconButton
            icon="calendar"
            label="Agendar cita"
            variant="accent"
            size="sm"
            onPress={() => setShowAppointment(true)}
          />
          <IconButton
            icon="sparkles"
            label="Recomendar"
            variant="default"
            size="sm"
            onPress={() => setShowRecommendation(true)}
          />
          <IconButton
            icon="create"
            label="Editar"
            variant="default"
            size="sm"
            onPress={() => setShowEditCustomer(true)}
          />
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

      {/* Modals */}
      <CreateAppointmentModal
        visible={showAppointment}
        onClose={() => setShowAppointment(false)}
        customerId={customer.id}
        customerName={`${customer.firstName} ${customer.lastName}`}
        onSuccess={profile.refetch}
      />
      <CreateRecommendationModal
        visible={showRecommendation}
        onClose={() => setShowRecommendation(false)}
        customerId={customer.id}
        customerName={`${customer.firstName} ${customer.lastName}`}
        onSuccess={profile.refetch}
      />
      <EditCustomerModal
        visible={showEditCustomer}
        onClose={() => setShowEditCustomer(false)}
        customer={customer}
        onSuccess={profile.refetch}
      />
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
    gap: 3,
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
  ltv: {
    ...Typography.caption1,
    fontWeight: "600",
    marginTop: 2,
  },
  quickActions: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    padding: Spacing.xl,
    paddingBottom: Spacing["4xl"],
  },
});
