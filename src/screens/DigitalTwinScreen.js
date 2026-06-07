import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useTheme } from '../hooks/use-theme';
import { Spacing } from '../constants/theme';
import { useSRE } from '../context/SREContext';

export default function DigitalTwinScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { customerId = 'cust-1' } = useLocalSearchParams();
  const { customers } = useSRE();
  const customer = customers.find((c) => c.id === customerId) || customers[0];

  // Simulator state
  const [applyDiscount, setApplyDiscount] = useState(false);
  const [applyOnboarding, setApplyOnboarding] = useState(false);
  const [applyFeatureBeta, setApplyFeatureBeta] = useState(false);

  // Re-calculate simulated risk in real-time based on active plays
  let riskReduction = 0;
  if (applyDiscount) riskReduction += 35;
  if (applyOnboarding) riskReduction += 25;
  if (applyFeatureBeta) riskReduction += 20;
  const simulatedRisk = Math.max(5, customer.churnRisk - riskReduction);

  const handleTriggerPlay = () => {
    const activePlays = [];
    if (applyDiscount) activePlays.push('15% Subscription Discount');
    if (applyOnboarding) activePlays.push('Customer Success Coaching Sync');
    if (applyFeatureBeta) activePlays.push('Priority Engineering Beta Access');

    if (activePlays.length === 0) {
      if (Platform.OS === 'web') {
        alert('Please select at least one retention play to trigger.');
      } else {
        Alert.alert('No Plays Selected', 'Select at least one retention play.');
      }
      return;
    }

    const message = `Retention playbook triggered for ${
      customer.name
    }:\n- ${activePlays.join('\n- ')}\n\nSimulated churn risk successfully dropped to ${simulatedRisk}%.`;

    if (Platform.OS === 'web') {
      alert(message);
      navigation.navigate('index');
    } else {
      Alert.alert('Retention Playbook Initialized', message, [
        { text: 'OK', onPress: () => navigation.navigate('index') },
      ]);
    }
  };

  const getRiskColor = (risk) => {
    if (risk >= 75) return theme.background === '#000000' ? '#FF6B6B' : '#DC2626';
    if (risk >= 40) return theme.background === '#000000' ? '#FCD34D' : '#D97706';
    return theme.background === '#000000' ? '#4ADE80' : '#059669';
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Customer Header Info */}
      <View
        style={[
          styles.headerCard,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.backgroundSelected,
          },
        ]}
      >
        <Text style={[styles.headerLabel, { color: theme.textSecondary }]}>CUSTOMER PROFILE</Text>
        <Text style={[styles.customerName, { color: theme.text }]}>{customer.name}</Text>
        <Text style={[styles.customerPlan, { color: theme.textSecondary }]}>{customer.plan}</Text>
        
        <View style={styles.headerMetrics}>
          <View>
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Baseline Risk</Text>
            <Text style={[styles.metricValue, { color: getRiskColor(customer.churnRisk) }]}>
              {customer.churnRisk}%
            </Text>
          </View>
          <View>
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Account Health</Text>
            <Text style={[styles.metricValue, { color: theme.text }]}>
              {customer.sentiment}% {customer.sentiment < 40 ? '😞' : '😊'}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.backgroundSelected }]} />
        
        <Text style={[styles.recLabel, { color: theme.textSecondary }]}>Primary Churn Factor:</Text>
        <Text style={[styles.recText, { color: theme.text }]}>{customer.reason}</Text>
      </View>

      {/* Simulator Section */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        🧠 Digital Twin Simulator
      </Text>
      <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
        Toggle retention actions to run real-time churn probability forecasts
      </Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.backgroundSelected,
          },
        ]}
      >
        {/* Risk Comparison Visualization */}
        <View style={styles.simulationVisualization}>
          <View style={styles.visCol}>
            <Text style={[styles.visLabel, { color: theme.textSecondary }]}>BASELINE RISK</Text>
            <View style={[styles.visCircle, { borderColor: getRiskColor(customer.churnRisk) }]}>
              <Text style={[styles.visValue, { color: getRiskColor(customer.churnRisk) }]}>
                {customer.churnRisk}%
              </Text>
            </View>
          </View>

          <View style={styles.visArrow}>
            <Text style={{ fontSize: 24 }}>➡️</Text>
          </View>

          <View style={styles.visCol}>
            <Text style={[styles.visLabel, { color: theme.textSecondary }]}>SIMULATED RISK</Text>
            <View style={[styles.visCircle, { borderColor: getRiskColor(simulatedRisk), backgroundColor: getRiskColor(simulatedRisk) + '10' }]}>
              <Text style={[styles.visValue, { color: getRiskColor(simulatedRisk) }]}>
                {simulatedRisk}%
              </Text>
            </View>
          </View>
        </View>

        {/* Play selectors */}
        <View style={styles.playsSection}>
          <Text style={[styles.playHeader, { color: theme.text }]}>Select Retention Plays:</Text>

          {/* Play 1: Discount */}
          <Pressable
            style={({ pressed }) => [
              styles.checkboxRow,
              {
                backgroundColor: applyDiscount ? theme.backgroundSelected : 'transparent',
                borderColor: theme.backgroundSelected,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            onPress={() => setApplyDiscount(!applyDiscount)}
          >
            <View style={[styles.checkbox, { borderColor: theme.text, backgroundColor: applyDiscount ? theme.text : 'transparent' }]}>
              {applyDiscount && <Text style={styles.checkboxCheck}>✓</Text>}
            </View>
            <View style={styles.checkboxLabelContainer}>
              <Text style={[styles.playTitle, { color: theme.text }]}>Apply 15% Subscription Discount</Text>
              <Text style={[styles.playEffect, { color: '#059669' }]}>Reduces risk by 35% (Forecast: High Likelihood)</Text>
            </View>
          </Pressable>

          {/* Play 2: Onboarding */}
          <Pressable
            style={({ pressed }) => [
              styles.checkboxRow,
              {
                backgroundColor: applyOnboarding ? theme.backgroundSelected : 'transparent',
                borderColor: theme.backgroundSelected,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            onPress={() => setApplyOnboarding(!applyOnboarding)}
          >
            <View style={[styles.checkbox, { borderColor: theme.text, backgroundColor: applyOnboarding ? theme.text : 'transparent' }]}>
              {applyOnboarding && <Text style={styles.checkboxCheck}>✓</Text>}
            </View>
            <View style={styles.checkboxLabelContainer}>
              <Text style={[styles.playTitle, { color: theme.text }]}>Schedule Success Coach Sync</Text>
              <Text style={[styles.playEffect, { color: '#059669' }]}>Reduces risk by 25% (Improves Sentiment)</Text>
            </View>
          </Pressable>

          {/* Play 3: Feature beta */}
          <Pressable
            style={({ pressed }) => [
              styles.checkboxRow,
              {
                backgroundColor: applyFeatureBeta ? theme.backgroundSelected : 'transparent',
                borderColor: theme.backgroundSelected,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            onPress={() => setApplyFeatureBeta(!applyFeatureBeta)}
          >
            <View style={[styles.checkbox, { borderColor: theme.text, backgroundColor: applyFeatureBeta ? theme.text : 'transparent' }]}>
              {applyFeatureBeta && <Text style={styles.checkboxCheck}>✓</Text>}
            </View>
            <View style={styles.checkboxLabelContainer}>
              <Text style={[styles.playTitle, { color: theme.text }]}>Grant Priority DB Beta Access</Text>
              <Text style={[styles.playEffect, { color: '#059669' }]}>Reduces risk by 20% (Resolves Technical Factor)</Text>
            </View>
          </Pressable>
        </View>

        {/* Trigger Button */}
        <Pressable
          style={({ pressed }) => [
            styles.triggerButton,
            {
              backgroundColor: getRiskColor(simulatedRisk),
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          onPress={handleTriggerPlay}
        >
          <Text style={styles.triggerButtonText}>Trigger Playbook Simulation</Text>
        </Pressable>
      </View>

      {/* Recent Interactions History */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Account History</Text>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.backgroundSelected,
          },
        ]}
      >
        {customer.recentInteractions.map((item, idx) => (
          <View
            key={idx}
            style={[
              styles.interactionItem,
              { borderBottomColor: theme.backgroundSelected },
            ]}
          >
            <View style={styles.interactionHeader}>
              <Text style={[styles.interactionType, { color: theme.text }]}>{item.type}</Text>
              <Text style={[styles.interactionDate, { color: theme.textSecondary }]}>{item.date}</Text>
            </View>
            <Text style={[styles.interactionText, { color: theme.textSecondary }]}>{item.text}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.three,
    paddingBottom: Spacing.six,
  },
  headerCard: {
    borderRadius: 16,
    padding: Spacing.three,
    borderWidth: 1,
    marginBottom: Spacing.four,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  customerPlan: {
    fontSize: 14,
    marginTop: 2,
  },
  headerMetrics: {
    flexDirection: 'row',
    marginTop: Spacing.three,
    gap: Spacing.five,
  },
  metricLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: Spacing.three,
  },
  recLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  recText: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: Spacing.two,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginBottom: Spacing.three,
  },
  card: {
    borderRadius: 16,
    padding: Spacing.three,
    borderWidth: 1,
    marginBottom: Spacing.four,
  },
  simulationVisualization: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  visCol: {
    alignItems: 'center',
  },
  visLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: Spacing.two,
  },
  visCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  visArrow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  playsSection: {
    marginTop: Spacing.three,
  },
  playHeader: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: Spacing.two,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.two,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: Spacing.two,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.two,
  },
  checkboxCheck: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  checkboxLabelContainer: {
    flex: 1,
  },
  playTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  playEffect: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  triggerButton: {
    marginTop: Spacing.three,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  triggerButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  interactionItem: {
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
  },
  interactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  interactionType: {
    fontSize: 14,
    fontWeight: '700',
  },
  interactionDate: {
    fontSize: 12,
  },
  interactionText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
