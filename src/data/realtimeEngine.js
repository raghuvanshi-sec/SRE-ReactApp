// realtimeEngine.js
// Real-time simulation engine for the Sentient Retention Engine (SRE)
// Provides live-updating data via React hooks with periodic state mutations

import { useState, useEffect, useRef, useCallback } from 'react';
import { mockKPIs, mockCustomers, mockAgents, mockApprovals } from './mockData';

// ─── Utility helpers ────────────────────────────────────────────────────────

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min, max, decimals = 1) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function pick(arr) {
  return arr[rand(0, arr.length - 1)];
}

function timestamp() {
  const now = new Date();
  return `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function todayISO() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// ─── Log message templates ──────────────────────────────────────────────────

const agentLogTemplates = {
  'agent-1': [
    (c) => `${timestamp()} - Evaluated ${c.name} Churn Risk (${c.churnRisk}%). Running retention simulations...`,
    (c) => `${timestamp()} - Generated dynamic discount play for ${c.name}. Awaiting governance approval.`,
    () => `${timestamp()} - Auto-applied loyalty extension to healthy accounts. 3 accounts retained.`,
    (c) => `${timestamp()} - Detected sentiment drop for ${c.name}. Triggering proactive outreach sequence.`,
    () => `${timestamp()} - Completed batch risk re-scoring. 2 accounts upgraded to low-risk status.`,
    (c) => `${timestamp()} - Initiated escalation workflow for ${c.name}. CS team notified via Slack.`,
  ],
  'agent-2': [
    (c) => `${timestamp()} - Sent onboarding follow-up to ${c.name}. Tracking engagement metrics.`,
    (c) => `${timestamp()} - Negotiated plan migration for ${c.name}. Contract preserved at lower tier.`,
    () => `${timestamp()} - Processed 5 mid-market renewal reminders. 4 auto-renewed successfully.`,
    (c) => `${timestamp()} - Detected usage anomaly for ${c.name}. Active users declined by 40%.`,
    () => `${timestamp()} - Launched interactive chatbot session for 3 accounts with low engagement.`,
  ],
  'agent-3': [
    (c) => `${timestamp()} - Initiated incident recovery workflow for ${c.name}. SLA review in progress.`,
    () => `${timestamp()} - Calculated SLA penalty credits for Q2 incidents. Total: $12,400 across 3 accounts.`,
    (c) => `${timestamp()} - Routing ${c.name} to priority support queue. Estimated wait: 0 minutes.`,
    () => `${timestamp()} - Service health check complete. All production endpoints nominal.`,
    (c) => `${timestamp()} - Generated compensation package for ${c.name}. Pending admin sign-off.`,
  ],
};

const interactionTemplates = [
  { type: 'Email', texts: [
    'Requested update on feature roadmap for Q3.',
    'Inquired about enterprise SSO integration timeline.',
    'Escalated billing discrepancy to finance team.',
    'Asked about volume discount for team expansion.',
  ]},
  { type: 'Support Ticket', texts: [
    'Reported intermittent API timeout errors in US-East region.',
    'Requested assistance with data export configuration.',
    'Filed bug report for dashboard rendering issue on mobile.',
  ]},
  { type: 'Call', texts: [
    'Expressed concerns about upcoming contract renewal terms.',
    'Discussed potential upgrade path to Enterprise tier.',
    'Requested demo of new analytics dashboard features.',
  ]},
  { type: 'System Log', texts: [
    'Daily active users increased by 12% week-over-week.',
    'API call volume decreased by 25% compared to last month.',
    'New team member onboarded and granted admin access.',
  ]},
];

// ─── Deep clone helper ──────────────────────────────────────────────────────

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// ─── KPI real-time engine ───────────────────────────────────────────────────

function evolveKPIs(kpis) {
  return kpis.map((kpi) => {
    const next = { ...kpi };
    switch (kpi.id) {
      case 'kpi-1': { // Churn Rate
        const val = parseFloat(kpi.value);
        const delta = randFloat(-0.3, 0.2);
        const newVal = Math.max(0.5, Math.min(8.0, val + delta));
        const change = delta < 0 ? `${delta.toFixed(1)}% MoM` : `+${delta.toFixed(1)}% MoM`;
        next.value = `${newVal.toFixed(1)}%`;
        next.change = change;
        next.type = newVal < 3 ? 'success' : newVal < 5 ? 'warning' : 'danger';
        break;
      }
      case 'kpi-2': { // Customers Saved
        const val = parseInt(kpi.value.replace(/,/g, ''), 10);
        const add = rand(1, 8);
        const newVal = val + add;
        next.value = newVal.toLocaleString();
        next.change = `+${add} this session`;
        break;
      }
      case 'kpi-3': { // Revenue Saved
        const val = parseInt(kpi.value.replace(/[$,]/g, ''), 10);
        const add = rand(200, 2500);
        const newVal = val + add;
        next.value = `$${newVal.toLocaleString()}`;
        next.change = `+$${add.toLocaleString()} this session`;
        break;
      }
      case 'kpi-4': { // Active Agents
        // Agents can toggle, reflect real count later
        break;
      }
      case 'kpi-5': { // Pending Approvals — updated by approval engine
        break;
      }
    }
    return next;
  });
}

// ─── Customer risk fluctuation engine ───────────────────────────────────────

function evolveCustomers(customers) {
  return customers.map((cust) => {
    const next = { ...cust };
    // Fluctuate churn risk slightly
    const riskDelta = rand(-3, 4);
    next.churnRisk = Math.max(5, Math.min(99, cust.churnRisk + riskDelta));

    // Fluctuate sentiment
    const sentDelta = rand(-2, 3);
    next.sentiment = Math.max(5, Math.min(99, cust.sentiment + sentDelta));

    // Increment days active
    next.daysActive = cust.daysActive;

    // Deep clone arrays
    next.recentInteractions = [...cust.recentInteractions];
    next.digitalTwin = { ...cust.digitalTwin, retentionProbability: { ...cust.digitalTwin.retentionProbability } };

    return next;
  });
}

// ─── Agent activity engine ──────────────────────────────────────────────────

function evolveAgents(agents, customers) {
  return agents.map((agent) => {
    const next = { ...agent, systemLogs: [...agent.systemLogs] };

    if (agent.status === 'active') {
      // Increment decisions
      next.decisionsToday = agent.decisionsToday + rand(1, 4);

      // Increment saved value
      const savedNum = parseInt(agent.savedToday.replace(/[$,]/g, ''), 10);
      next.savedToday = `$${(savedNum + rand(100, 800)).toLocaleString()}`;

      // Fluctuate accuracy slightly
      next.accuracy = Math.min(99.9, Math.max(80, agent.accuracy + randFloat(-0.3, 0.2)));

      // Add a new log entry (pick a random customer for context)
      const templates = agentLogTemplates[agent.id] || agentLogTemplates['agent-1'];
      const template = pick(templates);
      const customer = pick(customers);
      const newLog = template(customer);
      next.systemLogs = [newLog, ...agent.systemLogs].slice(0, 20); // Keep last 20
    }

    return next;
  });
}

// ─── Interaction injection engine ───────────────────────────────────────────

function maybeAddInteraction(customers) {
  // 30% chance per tick of adding a new interaction to a random customer
  if (Math.random() > 0.3) return customers;

  const idx = rand(0, customers.length - 1);
  const template = pick(interactionTemplates);
  const text = pick(template.texts);
  const newInteraction = { date: todayISO(), type: template.type, text };

  return customers.map((cust, i) => {
    if (i !== idx) return cust;
    return {
      ...cust,
      recentInteractions: [newInteraction, ...cust.recentInteractions].slice(0, 6),
    };
  });
}

// ─── Chart data evolution ───────────────────────────────────────────────────

function evolveChartData(prevData) {
  const newData = prevData.map((val) => {
    const delta = randFloat(-0.2, 0.15);
    return Math.max(0.5, Math.min(8, parseFloat((val + delta).toFixed(1))));
  });
  return newData;
}

// ─── Main hook: useRealtimeData ─────────────────────────────────────────────
// Returns a live-updating snapshot of the entire SRE data model.
// Tick interval defaults to 5 seconds.

export function useRealtimeData(tickIntervalMs = 5000) {
  const [kpis, setKPIs] = useState(() => deepClone(mockKPIs));
  const [customers, setCustomers] = useState(() => deepClone(mockCustomers));
  const [agents, setAgents] = useState(() => deepClone(mockAgents));
  const [approvals, setApprovals] = useState(() => deepClone(mockApprovals));
  const [chartData, setChartData] = useState([4.2, 3.8, 3.1, 2.9, 2.5, 2.4]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [tickCount, setTickCount] = useState(0);

  // Refs to avoid stale closures
  const customersRef = useRef(customers);
  const agentsRef = useRef(agents);
  const kpisRef = useRef(kpis);
  const approvalsRef = useRef(approvals);
  const chartRef = useRef(chartData);

  useEffect(() => { customersRef.current = customers; }, [customers]);
  useEffect(() => { agentsRef.current = agents; }, [agents]);
  useEffect(() => { kpisRef.current = kpis; }, [kpis]);
  useEffect(() => { approvalsRef.current = approvals; }, [approvals]);
  useEffect(() => { chartRef.current = chartData; }, [chartData]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Evolve customers
      let nextCustomers = evolveCustomers(customersRef.current);
      nextCustomers = maybeAddInteraction(nextCustomers);
      setCustomers(nextCustomers);

      // Evolve agents
      const nextAgents = evolveAgents(agentsRef.current, nextCustomers);
      setAgents(nextAgents);

      // Evolve KPIs
      let nextKPIs = evolveKPIs(kpisRef.current);
      // Sync active agents count
      const activeCount = nextAgents.filter((a) => a.status === 'active').length;
      nextKPIs = nextKPIs.map((kpi) =>
        kpi.id === 'kpi-4'
          ? { ...kpi, value: `${activeCount} / ${nextAgents.length}`, change: `${Math.round((activeCount / nextAgents.length) * 100)}% operational` }
          : kpi
      );
      // Sync pending approvals count
      const pendingCount = approvalsRef.current.filter((a) => a.status === 'pending').length;
      nextKPIs = nextKPIs.map((kpi) =>
        kpi.id === 'kpi-5'
          ? { ...kpi, value: String(pendingCount), type: pendingCount > 3 ? 'danger' : pendingCount > 0 ? 'warning' : 'success', change: pendingCount > 0 ? 'Requires attention' : 'All clear ✓' }
          : kpi
      );
      setKPIs(nextKPIs);

      // Evolve chart
      setChartData(evolveChartData(chartRef.current));

      setLastUpdated(new Date());
      setTickCount((c) => c + 1);
    }, tickIntervalMs);

    return () => clearInterval(interval);
  }, [tickIntervalMs]);

  // Exposed mutation functions for UI interactions
  const toggleAgentStatus = useCallback((agentId) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === agentId
          ? { ...a, status: a.status === 'active' ? 'paused' : 'active' }
          : a
      )
    );
  }, []);

  const cycleTrustLevel = useCallback((agentId) => {
    const cycle = { High: 'Medium', Medium: 'Low', Low: 'High' };
    setAgents((prev) =>
      prev.map((a) =>
        a.id === agentId
          ? { ...a, trustLevel: cycle[a.trustLevel] || 'Medium' }
          : a
      )
    );
  }, []);

  const handleApprovalAction = useCallback((approvalId, actionType) => {
    setApprovals((prev) =>
      prev.map((a) =>
        a.id === approvalId
          ? { ...a, status: actionType === 'approve' ? 'approved' : 'rejected' }
          : a
      )
    );
  }, []);

  return {
    kpis,
    customers,
    agents,
    approvals,
    chartData,
    lastUpdated,
    tickCount,
    // Mutations
    toggleAgentStatus,
    cycleTrustLevel,
    handleApprovalAction,
    setApprovals,
  };
}
