# TAO System Architecture Visualizer

A professional, academic-grade visualization tool designed to demonstrate the data flow and architectural principles of Facebook's **TAO** (The Associated Object) social graph system.

## 🚀 Overview

This project provides a live, interactive simulation of a distributed social graph. It is designed for university instructors and engineering professionals to explain complex distributed systems concepts like **Fanout**, **Cache Hits/Misses**, and **Social Graph Propagation** in a visually intuitive way.

## 🛠 Features

- **Automated Traffic Simulation**: Toggle live traffic to see the social graph grow and interchanged data in real-time.
- **Interactive "Manual Overrides"**:
    - **Add User**: Manually inject new nodes into the system.
    - **Drag-to-Connect**: Drag one user onto another to create a social "Friend" edge.
    - **Trigger Post**: Force specific users to author posts and watch the resulting Fanout.
- **Dynamic Data Flows**: Observable particles travel between nodes with clear labels (**FANOUT**, **CACHE HIT**, **DB FETCH**).
- **Simulation Speed Control**: Slow down the simulation (up to 0.1x) to explain atomic operations step-by-step.
- **Enterprise UI**: A rigid, clean, light-themed academic interface featuring live telemetry and system event logs.

## 💡 Academic Concepts Demonstrated

1.  **Object & Association Model**: How users (Objects) and friendships (Associations) are mapped in a graph.
2.  **Write Propagation (Fanout)**: The cost and mechanics of distributing new content across a friend group.
3.  **Read-Through Caching**: Visual differentiation between fetching from the cache layer vs. the slower database layer.
4.  **Force-Directed Layouts**: How distributed systems organize relationships organically.

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
```bash
# Install dependencies
npm install
```

### Run Locally
```bash
# Start the development server
npm run dev
```
Navigate to the local URL (usually `http://localhost:5173`) to view the visualizer.

## 💻 Tech Stack
- **React**: Orchestration layer.
- **D3.js**: High-performance force-directed graph rendering and animation.
- **Zustand**: Lightweight state management for the event pipeline.
- **Lucide React**: Professional iconography.

---
*Created for academic and professional distributed systems instruction.*