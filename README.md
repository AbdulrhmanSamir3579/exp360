# Legal Workflow Monitoring & Anomaly Detection Dashboard

A real-time monitoring dashboard for legal workflow analytics with WebSocket-powered live updates, anomaly detection, and comprehensive visualization.

![Dashboard Preview](https://img.shields.io/badge/Angular-18-red) ![Node.js](https://img.shields.io/badge/Node.js-20-green) ![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-blue) ![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)

## 🎯 Features

✅ **Real-Time Monitoring**
- WebSocket-powered live event streaming
- Auto-updating metrics and charts
- Configurable update pause/resume

✅ **Comprehensive Visualizations**
- Real-time event timeline
- Anomaly heatmap (hour × severity)
- Workflow volume charts with time filters (6h/12h/24h)
- Interactive status cards

✅ **State Management**
- Angular Signals for reactive state
- Computed properties for derived data
- LocalStorage persistence for theme

✅ **Dark/Light Mode**
- System preference detection
- Manual toggle
- Smooth transitions

✅ **Filtering & Controls**
- Event category filtering
- Anomaly type filtering
- Time range selection

✅ **Production Ready**
- Docker & Docker Compose
- Health checks
- Error handling & reconnection logic

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose installed
- Ports 3000 and 4200 available

### One-Command Start

```bash
docker-compose up --build
```

That's it! The application will be available at:
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000
- **WebSocket**: ws://localhost:3000

## 📊 Tech Stack

### Frontend
- **Framework**: Angular 18 (Standalone Components)
- **State Management**: Angular Signals
- **Charts**: ECharts via custom abstraction layer
- **Styling**: Custom CSS with CSS Variables
- **HTTP Client**: Angular HttpClient
- **WebSocket**: Native WebSocket API

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express + TypeScript
- **Real-time**: WebSocket (ws library)
- **Data**: Mock data generators

### DevOps
- **Containerization**: Docker multi-stage builds
- **Orchestration**: Docker Compose
- **Web Server**: Nginx (for production frontend)

## 🏗️ Architecture

```
exp360/
├── backend/              # Node.js + Express + WebSocket
│   ├── src/
│   │   ├── server.ts           # Main server & WebSocket init
│   │   ├── controllers/         # REST API controllers
│   │   ├── services/           # Mock data & WebSocket
│   │   └── types/              # TypeScript interfaces
│   └── Dockerfile
├── frontend/             # Angular 18 Application
│   ├── src/app/
│   │   ├── core/               # Singleton services
│   │   │   ├── services/       # API, WebSocket, Theme
│   │   │   └── models/         # TypeScript interfaces
│   │   ├── features/
│   │   │   └── dashboard/      # Dashboard feature module
│   │   │       └── components/ # All dashboard components
│   │   ├── shared/             # Reusable components & charts
│   │   │   ├── components/     # Skeleton, Toast
│   │   │   └── charts/         # Chart abstraction layer
│   │   ├── store/              # Signals-based state
│   │   │   ├── events.state.ts
│   │   │   ├── metrics.state.ts
│   │   │   ├── anomalies.state.ts
│   │   │   └── ui.state.ts
│   │   └── styles/             # CSS theming
│   ├── Dockerfile
│   └── nginx.conf
└── docker-compose.yml
```

## 💻 Manual Development Setup

### Backend

```bash
cd backend
npm install
npm run dev  # Runs on http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm start    # Runs on http://localhost:4200
```

## 📡 API Documentation

### REST Endpoints

#### GET /health
Health check endpoint
```json
Response: {
  "status": "ok",
  "timestamp": "2025-12-02T10:00:00.000Z"
}
```

#### GET /stats/overview
Get overview statistics
```json
Response: {
  "totalWorkflowsToday": 45,
  "averageCycleTime": 67,
  "slaCompliance": 94.5,
  "activeAnomaliesCount": 3
}
```

#### GET /stats/timeline
Get timeline events (last 24 hours)
```json
Response: [
  {
    "timestamp": "2025-12-02T10:00:00.000Z",
    "eventType": "workflow_completed",
    "data": { /* WorkflowEvent */ }
  }
]
```

#### GET /stats/anomalies
Get anomalies (last 24 hours)
```json
Response: [
  {
    "id": "...",
    "type": "sla_breach",
    "severity": "high",
    "timestamp": "2025-12-02T10:00:00.000Z",
    "description": "...",
    "workflowId": "WF-1234",
    "hour": 10
  }
]
```

### WebSocket Protocol

**Connection**: `ws://localhost:3000`

**Message Format**:
```json
{
  "type": "event" | "anomaly" | "stats_update",
  "data": { /* Event data */ },
  "timestamp": "2025-12-02T10:00:00.000Z"
}
```

- Events broadcast every 10-20 seconds
- Auto-reconnection with exponential backoff
- Connection status tracking

## 📦 Deployment

### Using Docker Compose (Recommended)

```bash
# Build and start
docker-compose up --build

# Stop
docker-compose down

# View logs
docker-compose logs -f
```

### Manual Deployment

#### Backend
```bash
cd backend
npm run build
npm start
```

#### Frontend
```bash
cd frontend
npm run build
# Serve dist/frontend/browser with any static server
```

**Built with ❤️ using Angular 18, Node.js, and ECharts**
