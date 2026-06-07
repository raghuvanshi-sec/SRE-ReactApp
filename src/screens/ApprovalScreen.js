import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { useTheme } from '../hooks/use-theme';
import { Spacing } from '../constants/theme';
import { useSRE } from '../context/SREContext';

export default function ApprovalScreen() {
  const theme = useTheme();
  const { approvals, handleApprovalAction, lastUpdated } = useSRE();

  const handleAction = (id, customerName, actionType) => {
    const successMsg =
      actionType === 'approve'
        ? `Successfully APPROVED retention play for ${customerName}. Playbook triggered.`
        : `REJECTED proposed play for ${customerName}. Playbook cancelled.`;

    if (Platform.OS === 'web') {
      alert(successMsg);
    } else {
      Alert.alert(
        actionType === 'approve' ? 'Play Approved' : 'Play Rejected',
        successMsg
      );
    }

    handleApprovalAction(id, actionType);
  };

  const pendingApprovals = approvals.filter((a) => a.status === 'pending');
  const resolvedApprovals = approvals.filter((a) => a.status !== 'pending');

  const renderApprovalCard = (app) => {
    const isCritical = app.priority === 'Critical';
    const isHigh = app.priority === 'High';

    return (
      <View
        key={app.id}
        style={[
          styles.approvalCard,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: isCritical
              ? '#EF4444'
              : isHigh
              ? '#F59E0B'
              : theme.backgroundSelected,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.cardHeader}>
          <View>
            <Text style={[styles.customerName, { color: theme.text }]}>
              {app.customerName}
            </Text>
            <Text style={[styles.agentMeta, { color: theme.textSecondary }]}>
              Proposed by: {app.agentName}
            </Text>
          </View>
          <View
            style={[
              styles.priorityBadge,
              {
                backgroundColor: isCritical
                  ? '#EF444420'
                  : isHigh
                  ? '#F59E0B20'
                  : '#3B82F620',
                borderColor: isCritical
                  ? '#EF4444'
                  : isHigh
                  ? '#F59E0B'
                  : '#3B82F6',
              },
            ]}
          >
            <Text
              style={[
                styles.priorityText,
                {
                  color: isCritical
                    ? '#EF4444'
                    : isHigh
                    ? '#F59E0B'
                    : '#3B82F6',
                },
              ]}
            >
              {app.priority}
            </Text>
          </View>
        </View>

        {/* Proposed Retention Play */}
        <View style={[styles.playDetails, { backgroundColor: theme.backgroundSelected }]}>
          <Text style={[styles.playLabel, { color: theme.textSecondary }]}>
            Proposed Play:
          </Text>
          <Text style={[styles.playText, { color: theme.text }]}>
            {app.proposedPlay}
          </Text>
        </View>

        {/* Impact Analysis */}
        <View style={styles.impactContainer}>
          <View style={styles.impactItem}>
            <Text style={[styles.impactLabel, { color: theme.textSecondary }]}>
              Estimated Cost
            </Text>
            <Text style={[styles.impactValue, { color: theme.text }]}>
              {app.costImpact}
            </Text>
          </View>

          <View style={styles.impactItem}>
            <Text style={[styles.impactLabel, { color: theme.textSecondary }]}>
              Risk Reduction
            </Text>
            <Text style={[styles.impactValue, { color: '#10B981' }]}>
              {app.simulationData.churnRiskBefore}% ➔ {app.simulationData.churnRiskAfter}%
            </Text>
          </View>

          <View style={styles.impactItem}>
            <Text style={[styles.impactLabel, { color: theme.textSecondary }]}>
              CS Certainty
            </Text>
            <Text style={[styles.impactValue, { color: theme.text }]}>
              {app.simulationData.retentionCertainty}
            </Text>
          </View>
        </View>

        {/* Action Controls */}
        {app.status === 'pending' ? (
          <View style={styles.actionsGrid}>
            <Pressable
              style={({ pressed }) => [
                styles.rejectButton,
                { borderColor: '#EF4444', opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={() => handleAction(app.id, app.customerName, 'reject')}
            >
              <Text style={styles.rejectButtonText}>Reject Play</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.approveButton,
                { backgroundColor: '#059669', opacity: pressed ? 0.8 : 1 },
              ]}
              onPress={() => handleAction(app.id, app.customerName, 'approve')}
            >
              <Text style={styles.approveButtonText}>Approve Play</Text>
            </Pressable>
          </View>
        ) : (
          <View
            style={[
              styles.resolvedContainer,
              {
                backgroundColor:
                  app.status === 'approved' ? '#05966915' : '#EF444415',
                borderColor:
                  app.status === 'approved' ? '#10B981' : '#EF4444',
              },
            ]}
          >
            <Text
              style={[
                styles.resolvedText,
                { color: app.status === 'approved' ? '#10B981' : '#EF4444' },
              ]}
            >
              {app.status === 'approved' ? '✓ PLAY APPROVED' : '✗ PLAY REJECTED'}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Governance Approvals</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Review and sign-off on critical SRE agent proposals
        </Text>
        <View style={styles.liveIndicatorRow}>
          <View style={styles.liveDot} />
          <Text style={[styles.liveText, { color: '#10B981' }]}>
            LIVE — {lastUpdated.toLocaleTimeString()}
          </Text>
        </View>
      </View>

      {/* Pending Section */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Pending Action ({pendingApprovals.length})
      </Text>
      {pendingApprovals.length === 0 ? (
        <View style={[styles.emptyBox, { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }]}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No pending approvals found. All systems nominal!
          </Text>
        </View>
      ) : (
        pendingApprovals.map(renderApprovalCard)
      )}

      {/* Resolved Section */}
      {resolvedApprovals.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: theme.text, marginTop: Spacing.four }]}>
            Resolved Today ({resolvedApprovals.length})
          </Text>
          {resolvedApprovals.map(renderApprovalCard)}
        </>
      )}
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: Spacing.two,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  approvalCard: {
    borderRadius: 16,
    padding: Spacing.three,
    borderWidth: 1,
    marginBottom: Spacing.three,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.two,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '700',
  },
  agentMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  playDetails: {
    borderRadius: 10,
    padding: Spacing.two,
    marginBottom: Spacing.three,
  },
  playLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  playText: {
    fontSize: 13,
    lineHeight: 18,
  },
  impactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.three,
    gap: Spacing.two,
  },
  impactItem: {
    flex: 1,
  },
  impactLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  impactValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  rejectButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectButtonText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
  },
  approveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  resolvedContainer: {
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resolvedText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  emptyBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.five,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
