// mockData.js
// Mock data for the Sentient Retention Engine (SRE) admin app

export const mockKPIs = [
  {
    id: "kpi-1",
    title: "Churn Rate",
    value: "2.4%",
    change: "-0.8% MoM",
    type: "success", // success, warning, danger, info
    icon: "trending-down",
  },
  {
    id: "kpi-2",
    title: "Customers Saved",
    value: "1,482",
    change: "+124 this week",
    type: "info",
    icon: "people",
  },
  {
    id: "kpi-3",
    title: "Revenue Saved",
    value: "$189,450",
    change: "+$14,200 this week",
    type: "success",
    icon: "cash",
  },
  {
    id: "kpi-4",
    title: "Active Agents",
    value: "12 / 15",
    change: "86% avg efficiency",
    type: "warning",
    icon: "hardware-chip",
  },
  {
    id: "kpi-5",
    title: "Pending Approvals",
    value: "5",
    change: "Requires immediate action",
    type: "danger",
    icon: "shield-checkmark",
  },
];

export const mockCustomers = [
  {
    id: "cust-1",
    name: "Acme Corp",
    contact: "Sarah Jenkins",
    email: "sjenkins@acme.com",
    plan: "Enterprise ($2,500/mo)",
    churnRisk: 84, // 0-100
    sentiment: 32, // 0-100
    daysActive: 412,
    reason: "Competitor offering lower price & key features missing",
    recentInteractions: [
      {
        date: "2026-06-05",
        type: "Email",
        text: "Inquired about multi-region data replication support.",
      },
      {
        date: "2026-06-02",
        type: "Support Ticket",
        text: "Reported API latency spikes in EU-central endpoints.",
      },
    ],
    digitalTwin: {
      simulatedOutcome:
        "Without intervention, 90% probability of churn by June 30.",
      retentionProbability: {
        baseline: 10,
        withDiscount: 45,
        withFeatureGuarantee: 88,
      },
      recommendedPlay:
        "Offer 15% discount + priority beta access to Multi-Region sync.",
      estimatedLtvImpact: "+$90,000 (36-month projection)",
    },
  },
  {
    id: "cust-2",
    name: "Vortex Media Group",
    contact: "Marcus Vance",
    email: "m.vance@vortex.io",
    plan: "Professional ($850/mo)",
    churnRisk: 68,
    sentiment: 48,
    daysActive: 180,
    reason: "Onboarding frictions and low platform usage",
    recentInteractions: [
      {
        date: "2026-06-04",
        type: "Call",
        text: "Expressed confusion about automated campaign flow builder.",
      },
      {
        date: "2026-05-28",
        type: "System Log",
        text: "Active users dropped from 15 to 3 in past 2 weeks.",
      },
    ],
    digitalTwin: {
      simulatedOutcome:
        "Will likely downgrade or churn at the next renewal cycle.",
      retentionProbability: {
        baseline: 32,
        withDiscount: 50,
        withOnboardingSession: 92,
      },
      recommendedPlay:
        "Schedule dedicated Customer Success onboarding + 1 month free trial extension.",
      estimatedLtvImpact: "+$30,600",
    },
  },
  {
    id: "cust-3",
    name: "Hyperion Labs",
    contact: "Dr. Evelyn Foster",
    email: "evelyn@hyperion.xyz",
    plan: "Enterprise ($4,000/mo)",
    churnRisk: 91,
    sentiment: 15,
    daysActive: 730,
    reason: "Major service disruption and contract ending next month",
    recentInteractions: [
      {
        date: "2026-06-06",
        type: "Email",
        text: "Formal notice requesting SLA penalty refund details.",
      },
      {
        date: "2026-06-01",
        type: "Service Outage",
        text: "4-hour downtime in main production DB instance.",
      },
    ],
    digitalTwin: {
      simulatedOutcome:
        "Highly critical. High risk of immediate executive termination.",
      retentionProbability: {
        baseline: 5,
        withDiscount: 15,
        withSlaRefundAndDedicatedTpm: 75,
      },
      recommendedPlay:
        "Approve $5,000 SLA penalty rebate + assign dedicated Technical Program Manager.",
      estimatedLtvImpact: "+$144,000",
    },
  },
  {
    id: "cust-4",
    name: "Beacon Retail",
    contact: "Chloe Martinez",
    email: "chloe.m@beacon.net",
    plan: "Growth ($299/mo)",
    churnRisk: 42,
    sentiment: 65,
    daysActive: 95,
    reason: "Budget cuts and searching for simpler alternatives",
    recentInteractions: [
      {
        date: "2026-06-03",
        type: "Billing",
        text: "Failed credit card payment updated on third attempt.",
      },
    ],
    digitalTwin: {
      simulatedOutcome:
        "Mild risk. Churn possible if competitor contacts them.",
      retentionProbability: {
        baseline: 58,
        withDiscount: 85,
        withDowngradeOption: 95,
      },
      recommendedPlay:
        "Suggest downgrade path to Starter plan ($149/mo) with active feature lock.",
      estimatedLtvImpact: "+$10,700",
    },
  },
  {
    id: "cust-5",
    name: "Zenith Tech",
    contact: "Arthur Dent",
    email: "adent@zenith.com",
    plan: "Enterprise ($3,200/mo)",
    churnRisk: 18,
    sentiment: 88,
    daysActive: 550,
    reason: "N/A (Healthy account)",
    recentInteractions: [
      {
        date: "2026-06-04",
        type: "Email",
        text: "Requested pricing for adding 50 more seat licenses.",
      },
    ],
    digitalTwin: {
      simulatedOutcome: "Low churn risk. Candidate for expansion.",
      retentionProbability: {
        baseline: 98,
      },
      recommendedPlay:
        "Introduce new Add-on features (Advanced Security pack).",
      estimatedLtvImpact: "+$115,200",
    },
  },
];

export const mockAgents = [
  {
    id: "agent-1",
    name: "Sovereign-Retainer 9.0",
    type: "High-Value Retention",
    status: "active",
    trustLevel: "High", // High (Auto-approves < $1000/mo plays), Medium, Low
    accuracy: 94.2,
    decisionsToday: 48,
    savedToday: "$18,400",
    capabilities: [
      "Dynamic discount negotiation",
      "Custom feature SLA provisioning",
      "CS escalations",
    ],
    systemLogs: [
      "06-07 11:15 - Evaluated Acme Corp Churn Risk (84%). Simulating plays...",
      "06-07 11:17 - Generated discount play for Acme Corp. Triggered manual Approval ticket-04.",
      "06-07 11:22 - Auto-applied Growth discount to Apex Builders. Churn probability fell from 55% to 8%.",
    ],
  },
  {
    id: "agent-2",
    name: "Sentient-Navigator 4.2",
    type: "Mid-Market & Downgrades",
    status: "active",
    trustLevel: "Medium",
    accuracy: 89.7,
    decisionsToday: 112,
    savedToday: "$12,650",
    capabilities: [
      "Self-serve plan migration",
      "Onboarding assistance",
      "Interactive chatbot sessions",
    ],
    systemLogs: [
      "06-07 11:02 - Sent onboarding follow-up to Vortex Media Group.",
      "06-07 11:08 - Negotiated downgrade for TechStore from Pro to Growth. Saved contract.",
    ],
  },
  {
    id: "agent-3",
    name: "Guardian-SRE v1.0",
    type: "Outage/Incident Recovery",
    status: "paused",
    trustLevel: "Low",
    accuracy: 92.1,
    decisionsToday: 0,
    savedToday: "$0",
    capabilities: [
      "SLA penalty reconciliation",
      "Service credit offers",
      "Priority support routing",
    ],
    systemLogs: [
      "06-06 18:45 - Paused by administrator due to DB incident review window.",
      "06-06 18:30 - Initiated Hyperion Labs recovery ticket. Requesting $5,000 refund approval.",
    ],
  },
];

export const mockApprovals = [
  {
    id: "app-1",
    customerId: "cust-1",
    customerName: "Acme Corp",
    agentId: "agent-1",
    agentName: "Sovereign-Retainer 9.0",
    proposedPlay:
      "Offer 15% discount for 6 months + priority beta access to Multi-Region sync.",
    costImpact: "$375/mo (Discounted from $2,500/mo)",
    status: "pending", // pending, approved, rejected
    priority: "High",
    simulationData: {
      churnRiskBefore: 84,
      churnRiskAfter: 18,
      retentionCertainty: "High (88%)",
    },
  },
  {
    id: "app-2",
    customerId: "cust-3",
    customerName: "Hyperion Labs",
    agentId: "agent-3",
    agentName: "Guardian-SRE v1.0",
    proposedPlay:
      "Approve $5,000 one-time SLA penalty rebate + assign dedicated Technical Program Manager.",
    costImpact: "$5,000 (One-time credit)",
    status: "pending",
    priority: "Critical",
    simulationData: {
      churnRiskBefore: 91,
      churnRiskAfter: 22,
      retentionCertainty: "Moderate (75%)",
    },
  },
  {
    id: "app-3",
    customerId: "cust-2",
    customerName: "Vortex Media Group",
    agentId: "agent-2",
    agentName: "Sentient-Navigator 4.2",
    proposedPlay:
      "Offer 1 month free trial extension + mandatory onboarding coaching call.",
    costImpact: "$850 (One-time credit)",
    status: "pending",
    priority: "Medium",
    simulationData: {
      churnRiskBefore: 68,
      churnRiskAfter: 12,
      retentionCertainty: "High (92%)",
    },
  },
];
