import React from 'react';

export const Legend: React.FC = () => {
  const items = [
    { label: 'User Node', color: 'var(--node-client)', type: 'circle' },
    { label: 'Post Node', color: 'var(--node-app)', type: 'circle' },
    { label: 'Social Edge', color: 'var(--link-color)', type: 'line' },
    { label: 'Fanout Event', color: 'var(--accent-primary)', type: 'particle' },
    { label: 'Cache Hit', color: 'var(--node-cache)', type: 'particle' },
    { label: 'Cache Miss', color: 'var(--node-db)', type: 'particle' },
  ];

  return (
    <div className="panel-section">
      <h3 className="panel-title">Visual Legend</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}>
              {item.type === 'circle' && (
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: `2px solid ${item.color}`, background: 'white' }} />
              )}
              {item.type === 'line' && (
                <div style={{ width: '16px', height: '2px', background: item.color }} />
              )}
              {item.type === 'particle' && (
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
              )}
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-main)' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
