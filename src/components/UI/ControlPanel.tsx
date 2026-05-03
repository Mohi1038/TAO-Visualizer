import React, { useState, useEffect } from 'react';
import { Play, Square, Gauge } from 'lucide-react';
import { eventPipeline } from '../../store/eventPipeline';
import { useGraphStore } from '../../store/graphStore';

export const ControlPanel: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const simulationSpeed = useGraphStore(state => state.simulationSpeed);
  const setSimulationSpeed = useGraphStore(state => state.setSimulationSpeed);

  // Stop simulation on unmount
  useEffect(() => {
    return () => eventPipeline.stopSimulation();
  }, []);

  const toggleSimulation = () => {
    if (isRunning) {
      eventPipeline.stopSimulation();
    } else {
      eventPipeline.startSimulation();
    }
    setIsRunning(!isRunning);
  };

  return (
    <div className="panel-section">
      <h3 className="panel-title">System Controls</h3>
      
      <div style={{ marginBottom: '16px' }}>
        <button 
          onClick={toggleSimulation}
          className={isRunning ? "" : "primary"}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '8px 16px', borderRadius: '4px', cursor: 'pointer',
            background: isRunning ? 'white' : 'var(--accent-primary)',
            color: isRunning ? '#dc3545' : 'white',
            border: isRunning ? '1px solid #dc3545' : 'none',
            fontWeight: 500, fontSize: '13px', transition: 'all 0.2s'
          }}
        >
          {isRunning ? <Square size={14} /> : <Play size={14} />}
          {isRunning ? 'Stop Traffic Simulation' : 'Start Traffic Simulation'}
        </button>
      </div>

      <div style={{ padding: '12px', background: 'var(--bg-main)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Gauge size={12} /> Simulation Speed
          </label>
          <span className="monospace" style={{ fontSize: '11px', fontWeight: 600 }}>{simulationSpeed.toFixed(1)}x</span>
        </div>
        <input 
          type="range" 
          min="0.1" 
          max="2.0" 
          step="0.1" 
          value={simulationSpeed}
          onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
          style={{ width: '100%', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
          <span>Slower</span>
          <span>Faster</span>
        </div>
      </div>

      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.4 }}>
        {isRunning ? 'System is actively routing automated social graph events.' : 'Click to begin routing simulated user traffic.'}
      </p>
    </div>
  );
};
