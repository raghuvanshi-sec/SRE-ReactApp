import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
} from "react-native";
import { useNavigation } from "expo-router";
import { useTheme } from "../hooks/use-theme";
import { Spacing } from "../constants/theme";
import CustomerCard from "../components/CustomerCard";
import { useSRE } from "../context/SREContext";

export default function CustomerListScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { customers } = useSRE();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL"); // ALL, HIGH, MEDIUM, LOW

  const filteredCustomers = customers.filter((cust) => {
    // Search filter
    const matchesSearch =
      cust.name.toLowerCase().includes(search.toLowerCase()) ||
      cust.email.toLowerCase().includes(search.toLowerCase()) ||
      cust.plan.toLowerCase().includes(search.toLowerCase());

    // Risk category filter
    if (activeFilter === "HIGH") {
      return matchesSearch && cust.churnRisk >= 75;
    }
    if (activeFilter === "MEDIUM") {
      return matchesSearch && cust.churnRisk >= 40 && cust.churnRisk < 75;
    }
    if (activeFilter === "LOW") {
      return matchesSearch && cust.churnRisk < 40;
    }
    return matchesSearch;
  });

  const handleViewTwin = (customer) => {
    // Navigate to Digital Twin simulation
    navigation.navigate("DigitalTwin", { customerId: customer.id });
  };

  const handleViewDetails = (customer) => {
    // Navigate to Digital Twin screen directly (it acts as the comprehensive customer workspace)
    navigation.navigate("DigitalTwin", { customerId: customer.id });
  };

  const filterTabs = [
    { label: "All", value: "ALL" },
    { label: "🔥 High Risk", value: "HIGH" },
    { label: "⚠️ Med Risk", value: "MEDIUM" },
    { label: "✅ Low Risk", value: "LOW" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Live indicator */}
      <View style={styles.liveBar}>
        <View style={styles.liveDot} />
        <Text style={[styles.liveText, { color: "#10B981" }]}>
          LIVE — Risks updating in real time
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.backgroundSelected,
              color: theme.text,
            },
          ]}
          placeholder="Search customer, plan, or email..."
          placeholderTextColor={theme.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {filterTabs.map((tab) => {
          const isSelected = activeFilter === tab.value;
          return (
            <Pressable
              key={tab.value}
              onPress={() => setActiveFilter(tab.value)}
              style={({ pressed }) => [
                styles.filterTab,
                {
                  backgroundColor: isSelected
                    ? theme.backgroundSelected
                    : theme.backgroundElement,
                  borderColor: isSelected ? theme.text : "transparent",
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: isSelected ? theme.text : theme.textSecondary,
                    fontWeight: isSelected ? "700" : "500",
                  },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Customer List */}
      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CustomerCard
            customer={item}
            onViewTwin={handleViewTwin}
            onViewDetails={handleViewDetails}
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No customers match your search criteria.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  liveBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
  },
  liveText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  searchContainer: {
    padding: Spacing.three,
    paddingBottom: Spacing.one,
  },
  searchInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    fontSize: 14,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
  },
  filterTab: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 12,
  },
  listContainer: {
    padding: Spacing.three,
    paddingBottom: Spacing.six,
  },
  emptyContainer: {
    padding: Spacing.six,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
});
