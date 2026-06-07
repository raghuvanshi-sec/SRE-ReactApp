import React from "react";
import { View, StyleSheet, Text, Pressable, Platform } from "react-native";
import { useTheme } from "../hooks/use-theme";
import { Spacing } from "../constants/theme";

export default function CustomerCard({ customer, onViewTwin, onViewDetails }) {
  const theme = useTheme();

  const getRiskColor = (risk) => {
    if (risk >= 75)
      return theme.background === "#000000" ? "#FF6B6B" : "#DC2626";
    if (risk >= 40)
      return theme.background === "#000000" ? "#FCD34D" : "#D97706";
    return theme.background === "#000000" ? "#4ADE80" : "#059669";
  };

  const getRiskLabel = (risk) => {
    if (risk >= 75) return "CRITICAL RISK";
    if (risk >= 40) return "MEDIUM RISK";
    return "LOW RISK";
  };

  const riskColor = getRiskColor(customer.churnRisk);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.backgroundSelected,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.name, { color: theme.text }]}>
            {customer.name}
          </Text>
          <Text style={[styles.plan, { color: theme.textSecondary }]}>
            {customer.plan}
          </Text>
        </View>
        <View
          style={[
            styles.badge,
            { backgroundColor: riskColor + "20", borderColor: riskColor },
          ]}
        >
          <Text style={[styles.badgeText, { color: riskColor }]}>
            {getRiskLabel(customer.churnRisk)} ({customer.churnRisk}%)
          </Text>
        </View>
      </View>

      {/* Info Rows */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
            Sentiment
          </Text>
          <Text
            style={[
              styles.metricValue,
              { color: customer.sentiment < 40 ? "#EF4444" : theme.text },
            ]}
          >
            {customer.sentiment}%{" "}
            {customer.sentiment < 40
              ? "😞"
              : customer.sentiment < 70
                ? "😐"
                : "😊"}
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
            Active Since
          </Text>
          <Text style={[styles.metricValue, { color: theme.text }]}>
            {customer.daysActive} days
          </Text>
        </View>
      </View>

      {/* Recommendation Section */}
      {customer.digitalTwin && (
        <View
          style={[
            styles.recommendationBox,
            { backgroundColor: theme.backgroundSelected },
          ]}
        >
          <Text style={[styles.recLabel, { color: theme.textSecondary }]}>
            🤖 Recommended Retention Play:
          </Text>
          <Text
            style={[styles.recText, { color: theme.text }]}
            numberOfLines={2}
          >
            {customer.digitalTwin.recommendedPlay}
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            {
              borderColor: theme.backgroundSelected,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
          onPress={() => onViewDetails(customer)}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.text }]}>
            View Details
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            { backgroundColor: riskColor, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={() => onViewTwin(customer)}
        >
          <Text style={styles.primaryButtonText}>Simulate Twin</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: Spacing.three,
    borderWidth: 1,
    marginBottom: Spacing.three,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
      },
    }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.three,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  plan: {
    fontSize: 13,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  metricsContainer: {
    flexDirection: "row",
    marginBottom: Spacing.three,
    gap: Spacing.three,
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: "600",
  },
  recommendationBox: {
    borderRadius: 12,
    padding: Spacing.two,
    marginBottom: Spacing.three,
  },
  recLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  recText: {
    fontSize: 13,
    lineHeight: 18,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
