import React from 'react';
import { useGraphStore } from '../../store/graphStore';
import { Activity } from 'lucide-react';

export const EventLog: React.FC = () => {
  const events = useGraphStore(state => state.events);
  
  // Show only last 20 events
  const displayEvents = [...events].slice(-20).reverse();

  const getEventDescription = (type: string) => {
    switch(type) {
      case 'POST_CREATED': return 'User authored a new post.';
      case 'FANOUT': return 'Fanning out post to connected peers.';
      case 'CACHE_HIT': return 'Data served successfully from cache layer.';
      case 'CACHE_MISS': return 'Cache miss; fallback to database fetch.';
      default: return 'System event registered.';
    }
  };

  const getEventColor = (type: string) => {
    switch(type) {
      case 'POST_CREATED': return 'var(--node-app)';
      case 'FANOUT': return 'var(--accent-primary)';
      case 'CACHE_HIT': return 'var(--node-cache)';
      case 'CACHE_MISS': return 'var(--node-db)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="panel-section" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Activity size={14} /> System Event Log
      </h3>
      
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
        {displayEvents.length === 0 ? (
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Waiting for traffic...</p>
        ) : (
          displayEvents.map((ev) => (
            <div key={ev.id} style={{ padding: '8px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span className="monospace" style={{ color: getEventColor(ev.type), fontWeight: 600 }}>{ev.type}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{new Date(ev.timestamp).toLocaleTimeString()}</span>
              </div>
              <div style={{ color: 'var(--text-main)' }}>{getEventDescription(ev.type)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
