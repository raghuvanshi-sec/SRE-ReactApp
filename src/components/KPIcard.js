import React from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import { useTheme } from "../hooks/use-theme";
import { Spacing } from "../constants/theme";

export default function KPICard({ title, value, change, type = "info", icon }) {
  const theme = useTheme();

  // Color mapping for different states (light and dark mode supported)
  const colorsMap = {
    success: {
      bg: theme.background === "#000000" ? "#064e3b" : "#ECFDF5",
      border: theme.background === "#000000" ? "#059669" : "#10B981",
      text: theme.background === "#000000" ? "#34D399" : "#047857",
    },
    warning: {
      bg: theme.background === "#000000" ? "#78350f" : "#FFFBEB",
      border: theme.background === "#000000" ? "#D97706" : "#F59E0B",
      text: theme.background === "#000000" ? "#FBBF24" : "#B45309",
    },
    danger: {
      bg: theme.background === "#000000" ? "#7f1d1d" : "#FEF2F2",
      border: theme.background === "#000000" ? "#DC2626" : "#EF4444",
      text: theme.background === "#000000" ? "#FCA5A5" : "#B91C1C",
    },
    info: {
      bg: theme.background === "#000000" ? "#1e3a8a" : "#EFF6FF",
      border: theme.background === "#000000" ? "#2563EB" : "#3B82F6",
      text: theme.background === "#000000" ? "#93C5FD" : "#1D4ED8",
    },
  };

  const statusColors = colorsMap[type] || colorsMap.info;

  // Let's map icons to emojis as a universal cross-platform fallback that looks good
  const iconEmoji =
    {
      "trending-down": "📉",
      people: "👥",
      cash: "💵",
      "hardware-chip": "🤖",
      "shield-checkmark": "🛡️",
    }[icon] || "📈";

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
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textSecondary }]}>
          {title}
        </Text>
        <View
          style={[styles.iconContainer, { backgroundColor: statusColors.bg }]}
        >
          <Text style={styles.icon}>{iconEmoji}</Text>
        </View>
      </View>

      <Text style={[styles.value, { color: theme.text }]}>{value}</Text>

      {change && (
        <View style={styles.changeContainer}>
          <Text style={[styles.changeText, { color: statusColors.text }]}>
            {change}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: Spacing.three,
    borderWidth: 1,
    minWidth: 150,
    flex: 1,
    margin: Spacing.one,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      },
    }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.two,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 16,
  },
  value: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginVertical: Spacing.half,
  },
  changeContainer: {
    marginTop: Spacing.one,
  },
  changeText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
