import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../hooks/use-theme';
import { Spacing } from '../constants/theme';
import KPICard from '../components/KPIcard';
import { mockKPIs, mockApprovals } from '../data/mockData';

export default function DashboardScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;

  // Chart styling options
  const chartConfig = {
    backgroundGradientFrom: theme.backgroundElement,
    backgroundGradientTo: theme.backgroundElement,
    color: (opacity = 1) =>
      theme.background === '#000000'
        ? `rgba(52, 211, 153, ${opacity})` // emerald-400 for dark mode
        : `rgba(16, 185, 129, ${opacity})`, // emerald-500 for light mode
    labelColor: (opacity = 1) =>
      theme.background === '#000000'
        ? `rgba(176, 180, 186, ${opacity})`
        : `rgba(96, 100, 108, ${opacity})`,
    strokeWidth: 3,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 1,
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [4.2, 3.8, 3.1, 2.9, 2.5, 2.4],
        strokeWidth: 3,
      },
    ],
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Sentient Retention Engine</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          AI-Powered Churn Prevention & Agent Governance
        </Text>
      </View>

      {/* KPI Section */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>System Health KPIs</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.kpiScroll}
        contentContainerStyle={styles.kpiContainer}
      >
        {mockKPIs.map((kpi) => (
          <KPICard
            key={kpi.id}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            type={kpi.type}
            icon={kpi.icon}
          />
        ))}
      </ScrollView>

      {/* Main Grid: Charts & Operations */}
      <View style={styles.gridContainer}>
        {/* Chart Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.backgroundSelected,
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Average Churn Rate Trend (%)
          </Text>
          <View style={styles.chartWrapper}>
            <LineChart
              data={chartData}
              width={Platform.OS === 'web' ? Math.max(10, Math.min(screenWidth - 64, 730)) : Math.max(10, screenWidth - 48)}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
        </View>

        {/* Quick Governance Alerts */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.backgroundSelected,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              Pending Governance Approvals
            </Text>
            <Pressable onPress={() => navigation.navigate('Approvals')}>
              <Text style={styles.viewAllLink}>View All</Text>
            </Pressable>
          </View>

          {mockApprovals.slice(0, 2).map((app) => (
            <View
              key={app.id}
              style={[
                styles.alertItem,
                { borderBottomColor: theme.backgroundSelected },
              ]}
            >
              <View style={styles.alertHeader}>
                <Text style={[styles.alertCustomer, { color: theme.text }]}>
                  {app.customerName}
                </Text>
                <Text
                  style={[
                    styles.alertPriority,
                    {
                      color:
                        app.priority === 'Critical'
                          ? '#EF4444'
                          : app.priority === 'High'
                          ? '#F59E0B'
                          : '#3B82F6',
                    },
                  ]}
                >
                  {app.priority}
                </Text>
              </View>
              <Text style={[styles.alertPlay, { color: theme.textSecondary }]} numberOfLines={1}>
                {app.proposedPlay}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Navigation Shortcuts */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Operational Centers</Text>
      <View style={styles.shortcutsGrid}>
        <Pressable
          style={({ pressed }) => [
            styles.shortcutCard,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.backgroundSelected,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          onPress={() => navigation.navigate('Customers')}
        >
          <Text style={styles.shortcutIcon}>👥</Text>
          <Text style={[styles.shortcutTitle, { color: theme.text }]}>Customers</Text>
          <Text style={[styles.shortcutDesc, { color: theme.textSecondary }]}>
            View risk profiles & simulate digital twins
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.shortcutCard,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.backgroundSelected,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          onPress={() => navigation.navigate('Agents')}
        >
          <Text style={styles.shortcutIcon}>🤖</Text>
          <Text style={[styles.shortcutTitle, { color: theme.text }]}>AI Agents</Text>
          <Text style={[styles.shortcutDesc, { color: theme.textSecondary }]}>
            Configure trust thresholds & view logs
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.shortcutCard,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.backgroundSelected,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          onPress={() => navigation.navigate('Approvals')}
        >
          <Text style={styles.shortcutIcon}>🛡️</Text>
          <Text style={[styles.shortcutTitle, { color: theme.text }]}>Approvals</Text>
          <Text style={[styles.shortcutDesc, { color: theme.textSecondary }]}>
            Approve AI-driven discount retention plays
          </Text>
        </Pressable>
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
  header: {
    marginBottom: Spacing.four,
    marginTop: Spacing.two,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: Spacing.three,
    marginBottom: Spacing.two,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  kpiScroll: {
    marginHorizontal: -Spacing.three,
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.three,
  },
  kpiContainer: {
    flexDirection: 'row',
    paddingRight: Spacing.four,
  },
  gridContainer: {
    gap: Spacing.three,
  },
  card: {
    borderRadius: 16,
    padding: Spacing.three,
    borderWidth: 1,
    marginBottom: Spacing.two,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: Spacing.two,
  },
  viewAllLink: {
    fontSize: 13,
    color: '#3B82F6',
    fontWeight: '600',
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  chart: {
    marginVertical: Spacing.one,
    borderRadius: 12,
  },
  alertItem: {
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  alertCustomer: {
    fontSize: 14,
    fontWeight: '700',
  },
  alertPriority: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  alertPlay: {
    fontSize: 13,
  },
  shortcutsGrid: {
    flexDirection: 'column',
    gap: Spacing.two,
  },
  shortcutCard: {
    flexDirection: 'column',
    borderRadius: 16,
    padding: Spacing.three,
    borderWidth: 1,
  },
  shortcutIcon: {
    fontSize: 24,
    marginBottom: Spacing.one,
  },
  shortcutTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  shortcutDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
});
