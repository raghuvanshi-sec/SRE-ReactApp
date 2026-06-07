# Sentient Retention Engine (SRE)

The Sentient Retention Engine (SRE) is a next-generation customer retention platform built for SaaS platforms. By combining proactive client simulators (Digital Twins), reactive AI autonomous agents, and a human-in-the-loop governance structure, SRE automatically identifies churn hazards, simulates optimal retention plays, and processes targeted customer recovery interventions while maintaining strict audit compliance.

---

## Architecture

### System Overview

```mermaid
graph TB
    subgraph Client["📱 Client Layer"]
        WEB["🌐 Web Browser"]
        IOS["🍎 iOS / Expo Go"]
        AND["🤖 Android / Expo Go"]
    end

    subgraph App["⚛️ React Native App (Expo SDK 54)"]
        ROUTER["Expo Router\n(File-Based Navigation)"]

        subgraph Screens["Screen Modules"]
            DASH["📊 Dashboard\nKPIs · Charts · Alerts"]
            CUST["👥 Customer List\nRisk Profiles · Search"]
            TWIN["🧠 Digital Twin\nSimulator · Playbooks"]
            AGENT["🤖 Agent Control Room\nLogs · Trust Config"]
            APPROVE["🛡️ Governance Approvals\nReview · Sign-Off"]
        end

        subgraph State["State Management"]
            CTX["SREContext\n(React Context)"]
            ENGINE["⚡ Real-Time Engine\n(5s tick interval)"]
        end

        subgraph Data["Data Layer"]
            MOCK["mockData.js\n(Seed Data)"]
            RT["realtimeEngine.js\n(Live Mutations)"]
        end

        subgraph UI["Shared Components"]
            KPI["KPICard"]
            CC["CustomerCard"]
            THEME["Theme System\n(Light/Dark HSL)"]
        end
    end

    WEB & IOS & AND --> ROUTER
    ROUTER --> DASH & CUST & TWIN & AGENT & APPROVE
    DASH & CUST & TWIN & AGENT & APPROVE --> CTX
    CTX --> ENGINE
    ENGINE --> RT
    RT --> MOCK
    DASH & CUST --> KPI & CC
    KPI & CC --> THEME

    style ENGINE fill:#059669,stroke:#10B981,color:#fff
    style CTX fill:#2563EB,stroke:#3B82F6,color:#fff
    style ROUTER fill:#7C3AED,stroke:#8B5CF6,color:#fff
```

### Real-Time Data Flow

```mermaid
sequenceDiagram
    participant Engine as ⚡ RealtimeEngine
    participant Context as 🔄 SREContext
    participant Dashboard as 📊 Dashboard
    participant Agents as 🤖 Agent Screen
    participant Customers as 👥 Customer List
    participant Twin as 🧠 Digital Twin
    participant Approvals as 🛡️ Approvals

    Note over Engine: Tick every 5 seconds

    loop Every 5s
        Engine->>Engine: evolveKPIs()
        Engine->>Engine: evolveCustomers()
        Engine->>Engine: evolveAgents()
        Engine->>Engine: evolveChartData()
        Engine->>Engine: maybeAddInteraction()
        Engine->>Context: setState(newSnapshot)
        Context-->>Dashboard: kpis, chartData, approvals
        Context-->>Agents: agents, toggleStatus()
        Context-->>Customers: customers (live risk scores)
        Context-->>Twin: customer (live baseline)
        Context-->>Approvals: approvals, handleAction()
    end

    Note over Dashboard,Approvals: All screens re-render with fresh data

    Agents->>Context: toggleAgentStatus(id)
    Context->>Engine: Update agent state
    Engine-->>Dashboard: KPI "Active Agents" synced

    Approvals->>Context: handleApprovalAction(id, approve)
    Context->>Engine: Update approval state
    Engine-->>Dashboard: KPI "Pending Approvals" synced
```

### Screen Navigation Map

```mermaid
graph LR
    subgraph TabBar["Bottom Tab Navigation"]
        HOME["🏠 Home"]
        EXPLORE["🔍 Explore"]
    end

    subgraph HomeStack["Home Stack (index/)"]
        DASH["📊 Dashboard"]
        CUST["👥 Customers"]
        TWIN["🧠 Digital Twin"]
        AGENTS["🤖 Agents"]
        APPROVALS["🛡️ Approvals"]
    end

    HOME --> DASH
    DASH -->|"View Customers"| CUST
    DASH -->|"View Agents"| AGENTS
    DASH -->|"View All Approvals"| APPROVALS
    CUST -->|"Simulate Twin"| TWIN
    CUST -->|"View Details"| TWIN
    TWIN -->|"Trigger Playbook"| DASH

    style DASH fill:#7C3AED,stroke:#8B5CF6,color:#fff
    style TWIN fill:#059669,stroke:#10B981,color:#fff
```

### AI Agent Decision Flow

```mermaid
flowchart TD
    START(["⏱️ Engine Tick"]) --> CHECK{Agent Active?}
    CHECK -->|Yes| EVAL["Evaluate Customer Pool"]
    CHECK -->|No| SKIP["Skip - Agent Paused"]

    EVAL --> RISK["Score Churn Risk"]
    RISK --> SIM["Run Retention Simulation"]
    SIM --> PLAY["Generate Retention Play"]

    PLAY --> TRUST{"Trust Level?"}
    TRUST -->|High| AUTO["Auto-Execute Play"]
    TRUST -->|Medium| QUEUE["Queue for Approval"]
    TRUST -->|Low| ESCALATE["Escalate to Admin"]

    AUTO --> LOG["📋 Append to Agent Logs"]
    QUEUE --> APPROVE{"Admin Decision"}
    ESCALATE --> APPROVE

    APPROVE -->|Approved| EXEC["Execute Playbook"]
    APPROVE -->|Rejected| CANCEL["Cancel Play"]
    EXEC --> LOG
    CANCEL --> LOG

    LOG --> KPI["📊 Update KPIs"]

    style START fill:#F59E0B,stroke:#D97706,color:#000
    style AUTO fill:#059669,stroke:#10B981,color:#fff
    style QUEUE fill:#2563EB,stroke:#3B82F6,color:#fff
    style ESCALATE fill:#DC2626,stroke:#EF4444,color:#fff
```

---

## Key Features

*   **System Health Dashboard**: Comprehensive operations room displaying average churn trends, financial KPIs (saved revenue, saved customers), active agent status, and real-time governance activity logs.
*   **Risk Profiles**: Granular list views mapping customer health, sentiment, current plans, active tenure, and specific qualitative churn factors.
*   **Digital Twin Simulation**: Reactive client simulators enabling developers and administrators to toggle specific playbooks (discounts, coaching calls, priority feature beta programs) and instantly calculate projected churn reduction before issuing offers.
*   **AI Control Room**: Configuration space for auditing autonomous retention agents, monitoring execution accuracy, viewing live agent activity logs, and modifying permission/trust configurations.
*   **Governance Approvals**: Human-in-the-loop oversight console ensuring high-impact playbooks, large refunds, and critical SLA rebates undergo formal administrative validation.

---

## Tech Stack

*   **Framework**: Expo SDK ~54.0.0 (downgraded for target mobile client version compatibility)
*   **Core**: React Native 0.81.5 / React Native Web ~0.21.0
*   **Routing**: Expo Router ~6.0.24 (file-based navigation stack)
*   **Data Visualization**: React Native Chart Kit ^6.12.3 (customized vector charts)
*   **Vector Components**: React Native SVG 15.12.1
*   **Styling System**: Vanilla React Native StyleSheet with custom HSL-based light/dark theme hooks
*   **Language**: TypeScript and JavaScript ES6+

---

## Getting Started

### Prerequisites

*   **Node.js**: Version 18.0.0 or higher is required.
*   **Package Manager**: `npm` (bundled with Node.js) or `yarn` is recommended.
*   **Expo Go Mobile Client**: If testing on physical mobile hardware, download the Expo Go app. To ensure full compatibility with the application dependencies, your Expo Go app should support **Expo SDK 54** (specifically version **54.0.8**).

### Local Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/raghuvanshi-sec/SRE-ReactApp.git
    cd SRE-ReactApp/SentientRetentionApp
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```
    *Note: If there are peer dependency warnings from legacy packages, run with `--legacy-peer-deps`.*

3.  **Launch the Development Server**
    ```bash
    npm run web
    ```
    This command starts the Expo Bundler server on `http://localhost:8081`.

4.  **Run on Mobile Emulator / Device**
    *   **iOS Simulator**: Press `i` in the Expo terminal command line.
    *   **Android Emulator**: Press `a` in the Expo terminal command line.
    *   **Physical Mobile Device**: Open the Expo Go app on your phone and scan the QR code displayed in the command line interface or developer tools web portal. Ensure your device is on the same local area network as your development computer.

---

## Project Architecture & Directory Structure

The Sentient Retention Engine follows a modular React Native architecture leveraging Expo Router for cross-platform layouts:

```text
SentientRetentionApp/
├── src/
│   ├── app/                    # File-based routing navigation stack
│   │   ├── _layout.tsx         # Root layout configuring theme providers
│   │   ├── explore.tsx         # Sample route for feature exploration
│   │   └── index/              # Nested main views mapping to tab routes
│   │       ├── _layout.tsx     # Home Stack header styles and screen options
│   │       ├── index.tsx       # Entry path pointing to DashboardScreen
│   │       ├── Customers.tsx   # Entry path pointing to CustomerListScreen
│   │       ├── DigitalTwin.tsx # Entry path pointing to DigitalTwinScreen
│   │       ├── Agents.tsx      # Entry path pointing to AgentScreen
│   │       └── Approvals.tsx   # Entry path pointing to ApprovalScreen
│   │
│   ├── screens/                # Core screen component views
│   │   ├── DashboardScreen.js  # Main operations metrics and KPI trackers
│   │   ├── CustomerListScreen.js # Client list, search filters, and risk scores
│   │   ├── DigitalTwinScreen.js  # Playbook toggles and real-time simulator
│   │   ├── AgentScreen.js      # Trust configuration, logs, and activity stats
│   │   └── ApprovalScreen.js   # Governance validation queue for agents
│   │
│   ├── components/             # Reusable UI widgets and layout modules
│   │   ├── CustomerCard.js     # Single user info item with sentiment badges
│   │   ├── KPICard.js          # Core statistics metric card
│   │   └── themed-text.tsx     # Custom text styling supporting dark mode
│   │
│   ├── context/                # Global state management
│   │   └── SREContext.js       # React Context providing real-time data
│   │
│   ├── constants/              # Application layout guidelines and constants
│   │   └── theme.ts            # HSL color values and spacing variables
│   │
│   ├── data/                   # Data structures & engines
│   │   ├── mockData.js         # Seed data (customer profiles, agents, KPIs)
│   │   └── realtimeEngine.js   # Real-time simulation engine (5s tick)
│   │
│   └── hooks/                  # Custom application hooks
│       └── use-theme.ts        # Color scheme resolver and styling utilities
│
├── scripts/                    # Development automation
│   └── reset-project.js        # Script to clear template directories
│
├── App.json                    # Project configuration and Expo metadata
├── package.json                # Project dependencies and script shortcuts
└── tsconfig.json               # TypeScript configuration parameters
```

---

## Data Models & Core Logic

### Customer Profiles
Each client profile contains attributes for calculating churn threat vectors:
*   `churnRisk` (0-100%): Calculated probability of client termination.
*   `sentiment` (0-100%): Qualitative metric aggregating support interactions, downtime, and active sessions.
*   `digitalTwin.retentionProbability`: The potential likelihood of customer recovery mapped to discount incentives, coaching syncs, or custom SLA agreements.

### AI Autonomous Agents
*   **Sovereign-Retainer**: Focused on high-value client subscriptions. Requires administrative approval for operations exceeding $1,000/month.
*   **Sentient-Navigator**: Mid-market agent specialized in plan migration, self-serve onboarding, and feature extension.
*   **Guardian-SRE**: Outage and incident recovery agent managing credits, SLA refunds, and critical communication during system disruptions.

### The Simulation Loop
When a developer or admin interacts with the **Digital Twin Simulator**:
1.  Target plays are selected (e.g., *Apply 15% Subscription Discount*).
2.  The reactive state machine updates `riskReduction` parameters.
3.  `simulatedRisk` is calculated in real-time (`Math.max(5, baseline - reduction)`).
4.  Submitting the simulation package packages the playbook and triggers a manual governance approval request if the risk drop is significant, routing the task to the Governance Approvals queue.

---

## Configuration & Environment Variables

To protect credentials and sensitive APIs, all configuration details must be managed using environment variables. Avoid hardcoding credentials in files like `src/data/mockData.js`.

### Variable Reference

*   `EXPO_PUBLIC_API_URL`
    *   *Description*: Backend endpoint URL for resolving customer stats and triggering webhooks.
    *   *Example*: `https://api.sentientretention.yourdomain.com`
*   `EXPO_PUBLIC_NEON_DATABASE_URL`
    *   *Description*: Postgres connection string pointing to customer logs and audit databases.
    *   *Example*: `postgresql://neondb_owner:***@ep-cool-water-a5.us-east-2.aws.neon.tech/neondb`
*   `EXPO_PUBLIC_AUTH_CLIENT_ID`
    *   *Description*: Client token identifier for corporate Single Sign-On integration.
    *   *Example*: `client_sre_prod_90234`

### Local Setup

Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_NEON_DATABASE_URL=postgresql://localhost:5432/sre_dev
EXPO_PUBLIC_AUTH_CLIENT_ID=client_sre_dev_12345
```

---

## Available Scripts

The following npm commands are available in the project:

*   `npm start` / `npx expo start`: Launches the Expo Go dev server in interactive CLI mode.
*   `npm run web` / `npx expo start --web`: Bundles and opens the application on your computer's default web browser.
*   `npm run android` / `npx expo start --android`: Prepares the application bundle and loads it onto an active Android emulator.
*   `npm run ios` / `npx expo start --ios`: Prepares the application bundle and loads it onto an active iOS simulator.
*   `npm run lint` / `npx expo lint`: Runs the ESLint parser to scan the codebase for syntax guidelines and errors.
*   `npm run reset-project`: Safely moves the starter screens into an `example/` directory and creates a clean `src/app/` folder for fresh development.

---

## Troubleshooting

### Color Hydration Exceptions on Web
*   **Problem**: In browser environments, layout headers or screens crash with errors referencing `undefined` properties of themes (e.g. `backgroundElement` is undefined).
*   **Cause**: On web platforms, Expo's `useColorScheme()` hook occasionally resolves as `null` or `undefined` during early client-side rendering before scheme detection is established.
*   **Solution**: The custom theme utility `src/hooks/use-theme.ts` safely catches undefined systems schemes. Ensure that your theme configuration specifies a reliable default fallback structure (e.g. `'light'`) if the scheme is not explicitly `'dark'`.

### Version Compatibility Conflicts in Expo Go
*   **Problem**: The application loads on computer web browsers, but fails to launch in Expo Go on physical mobile devices.
*   **Cause**: The project uses **Expo SDK 54** dependencies. If your mobile device runs a newer or older build of Expo Go, the native bundles will fail to synchronize.
*   **Solution**: Double-check that the physical device Expo Go version supports **SDK 54 (v54.0.8)**. If needed, download the matching Expo Go build or launch using local Android/iOS emulator targets matching SDK 54.

### Chart Rerender Performance Spikes
*   **Problem**: Significant frame lag when accessing the Dashboard screen on older devices.
*   **Cause**: Real-time rendering of SVGs and grids in `LineChart` components during state updates.
*   **Solution**: Avoid rapid state updates on parent container scrolls. Memoize custom components and control chart resolution details within `chartConfig` options.
