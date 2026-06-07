import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { useTheme } from '../hooks/use-theme';
import { Spacing } from '../constants/theme';
import { useSRE } from '../context/SREContext';

export default function AgentScreen() {
  const theme = useTheme();
  const { agents, toggleAgentStatus, cycleTrustLevel, lastUpdated } = useSRE();
  const [selectedAgentId, setSelectedAgentId] = React.useState(agents[0]?.id || '');

  const selectedAgent = agents.find((a) => a.id === selectedAgentId);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>AI Agent Control Room</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Monitor and configure autonomous sentient retention behaviors
          </Text>
          <View style={styles.liveIndicatorRow}>
            <View style={styles.liveDot} />
            <Text style={[styles.liveText, { color: '#10B981' }]}>
              LIVE — {lastUpdated.toLocaleTimeString()}
            </Text>
          </View>
        </View>

        {/* Agent Grid */}
        <View style={styles.agentList}>
          {agents.map((agent) => {
            const isActive = agent.status === 'active';
            const isSelected = agent.id === selectedAgentId;

            return (
              <Pressable
                key={agent.id}
                onPress={() => setSelectedAgentId(agent.id)}
                style={({ pressed }) => [
                  styles.agentCard,
                  {
                    backgroundColor: theme.backgroundElement,
                    borderColor: isSelected ? theme.text : theme.backgroundSelected,
                    opacity: pressed ? 0.9 : 1,
                  },
                ]}
              >
                <View style={styles.agentCardHeader}>
                  <View>
                    <Text style={[styles.agentName, { color: theme.text }]}>{agent.name}</Text>
                    <Text style={[styles.agentType, { color: theme.textSecondary }]}>
                      {agent.type}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => toggleAgentStatus(agent.id)}
                    style={[
                      styles.statusIndicator,
                      {
                        backgroundColor: isActive ? '#059669' + '20' : '#DC2626' + '20',
                        borderColor: isActive ? '#10B981' : '#EF4444',
                      },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: isActive ? '#10B981' : '#EF4444' }]}>
                      {isActive ? '🟢 Active' : '🔴 Paused'}
                    </Text>
                  </Pressable>
                </View>

                {/* Accuracy and trust */}
                <View style={styles.agentMetricsGrid}>
                  <View>
                    <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Accuracy</Text>
                    <Text style={[styles.metricVal, { color: theme.text }]}>{agent.accuracy}%</Text>
                  </View>
                  <View>
                    <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Decisions Today</Text>
                    <Text style={[styles.metricVal, { color: theme.text }]}>{agent.decisionsToday}</Text>
                  </View>
                  <View>
                    <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Saved Value</Text>
                    <Text style={[styles.metricVal, { color: '#10B981' }]}>{agent.savedToday}</Text>
                  </View>
                </View>

                {/* Trust Threshold Interactive Control */}
                <View style={[styles.trustRow, { borderTopColor: theme.backgroundSelected }]}>
                  <Text style={[styles.trustLabel, { color: theme.textSecondary }]}>
                    Trust Threshold:
                  </Text>
                  <Pressable
                    onPress={() => cycleTrustLevel(agent.id)}
                    style={[
                      styles.trustBadge,
                      {
                        backgroundColor:
                          agent.trustLevel === 'High'
                            ? '#059669' + '20'
                            : agent.trustLevel === 'Medium'
                            ? '#D97706' + '20'
                            : '#EF4444' + '20',
                        borderColor:
                          agent.trustLevel === 'High'
                            ? '#10B981'
                            : agent.trustLevel === 'Medium'
                            ? '#F59E0B'
                            : '#EF4444',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.trustBadgeText,
                        {
                          color:
                            agent.trustLevel === 'High'
                              ? '#10B981'
                              : agent.trustLevel === 'Medium'
                              ? '#F59E0B'
                              : '#EF4444',
                        },
                      ]}
                    >
                      {agent.trustLevel} (Click to change)
                    </Text>
                  </Pressable>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Selected Agent Workspace / Logs */}
        {selectedAgent && (
          <View
            style={[
              styles.logPanel,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.backgroundSelected,
              },
            ]}
          >
            <Text style={[styles.logPanelTitle, { color: theme.text }]}>
              📋 Live Logs: {selectedAgent.name}
            </Text>

            <View style={[styles.capabilitiesBox, { backgroundColor: theme.backgroundSelected }]}>
              <Text style={[styles.capLabel, { color: theme.textSecondary }]}>Agent Capabilities:</Text>
              <View style={styles.capList}>
                {selectedAgent.capabilities.map((cap, idx) => (
                  <Text key={idx} style={[styles.capItem, { color: theme.text }]}>
                    ⚡ {cap}
                  </Text>
                ))}
              </View>
            </View>

            <ScrollView style={styles.logStream} nestedScrollEnabled>
              {selectedAgent.systemLogs.map((log, idx) => (
                <Text key={idx} style={[styles.logLine, { color: '#10B981' }]}>
                  {log}
                </Text>
              ))}
            </ScrollView>
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
  liveIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  agentList: {
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  agentCard: {
    borderRadius: 16,
    padding: Spacing.three,
    borderWidth: 1,
  },
  agentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '700',
  },
  agentType: {
    fontSize: 12,
    marginTop: 2,
  },
  statusIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  agentMetricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.two,
  },
  metricLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  metricVal: {
    fontSize: 15,
    fontWeight: '700',
  },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.two,
    borderTopWidth: 1,
    marginTop: Spacing.one,
  },
  trustLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  trustBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  trustBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  logPanel: {
    borderRadius: 16,
    padding: Spacing.three,
    borderWidth: 1,
  },
  logPanelTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: Spacing.two,
  },
  capabilitiesBox: {
    padding: Spacing.two,
    borderRadius: 10,
    marginBottom: Spacing.two,
  },
  capLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  capList: {
    gap: 4,
  },
  capItem: {
    fontSize: 12,
    fontWeight: '500',
  },
  logStream: {
    maxHeight: 220,
    backgroundColor: '#0a0a0c',
    padding: Spacing.two,
    borderRadius: 8,
  },
  logLine: {
    fontFamily: Platform.select({ ios: 'CourierNewPSMT', android: 'monospace', web: 'Courier, monospace' }),
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 4,
  },
});
