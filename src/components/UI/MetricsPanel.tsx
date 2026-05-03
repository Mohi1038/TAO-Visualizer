import React from 'react';
import { useGraphStore } from '../../store/graphStore';

export const MetricsPanel: React.FC = () => {
  const metrics = useGraphStore(state => state.metrics);

  return (
    <div className="panel-section">
      <h3 className="panel-title">System Telemetry</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ background: 'white', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Active Nodes</div>
          <div className="monospace" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)' }}>
            {metrics.activeNodes}
          </div>
        </div>

        <div style={{ background: 'white', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Total Events</div>
          <div className="monospace" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)' }}>
            {metrics.totalEvents}
          </div>
        </div>

        <div style={{ background: 'white', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Cache Hit %</div>
          <div className="monospace" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)' }}>
            {(metrics.cacheHitRatio * 100).toFixed(1)}%
          </div>
        </div>

        <div style={{ background: 'white', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Avg Latency</div>
          <div className="monospace" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)' }}>
            {metrics.avgLatencyMs.toFixed(0)} ms
          </div>
        </div>
      </div>
    </div>
  );
};
