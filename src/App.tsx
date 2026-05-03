
import { GraphCanvas } from './components/GraphCanvas/GraphCanvas';
import { ControlPanel } from './components/UI/ControlPanel';
import { ManualControls } from './components/UI/ManualControls';
import { MetricsPanel } from './components/UI/MetricsPanel';
import { Legend } from './components/UI/Legend';
import { EventLog } from './components/UI/EventLog';
import { Inspector } from './components/UI/Inspector';

function App() {
  return (
    <div className="app-container">
      {/* Top Navigation */}
      <div className="header-bar">
        <h1 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--accent-primary)' }}>TAO System Architecture Visualizer</h1>
      </div>
      
      {/* Main Workspace */}
      <div className="workspace">
        {/* Left Sidebar: Controls & Metrics */}
        <div className="sidebar" style={{ overflowY: 'auto' }}>
          <ControlPanel />
          <ManualControls />
          <MetricsPanel />
          <Legend />
        </div>
        
        {/* Center: D3 Graph Canvas */}
        <GraphCanvas />
        
        {/* Right Sidebar: Inspector & Logs */}
        <div className="inspector-sidebar">
          <Inspector />
          <EventLog />
        </div>
      </div>
    </div>
  );
}

export default App;
