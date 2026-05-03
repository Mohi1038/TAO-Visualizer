import React from 'react';
import { useGraphStore } from '../../store/graphStore';
import { Trash2 } from 'lucide-react';

export const Inspector: React.FC = () => {
  const selectedNodeId = useGraphStore(state => state.selectedNodeId);
  const nodes = useGraphStore(state => state.nodes);
  const edges = useGraphStore(state => state.edges);
  const removeNode = useGraphStore(state => state.removeNode);

  if (!selectedNodeId) {
    return (
      <div className="inspector-sidebar" style={{ justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: '13px' }}>Select a node to inspect</p>
      </div>
    );
  }

  const node = nodes.get(selectedNodeId);
  if (!node) return null;

  const relatedEdges = Array.from(edges.values()).filter(
    e => e.source === selectedNodeId || e.target === selectedNodeId
  );

  return (
    <div className="inspector-sidebar">
      <div className="panel-section" style={{ borderBottom: '1px solid var(--border-color)', background: '#f8f9fa' }}>
        <h3 className="panel-title" style={{ marginBottom: 0 }}>Properties Inspector</h3>
      </div>
      
      <div className="panel-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 600 }}>{node.label}</h4>
          <span className="monospace" style={{ fontSize: '10px', padding: '2px 6px', background: '#e9ecef', borderRadius: '4px' }}>{node.type}</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Node ID</label>
            <input type="text" readOnly value={node.id} className="monospace" style={{ width: '100%', padding: '6px', fontSize: '12px', border: '1px solid var(--border-color)', borderRadius: '4px', background: '#f8f9fa' }} />
          </div>
          {node.metadata && Object.keys(node.metadata).length > 0 && (
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Metadata</label>
              <div className="monospace" style={{ padding: '6px', fontSize: '12px', border: '1px solid var(--border-color)', borderRadius: '4px', background: '#f8f9fa', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(node.metadata, null, 2)}
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={() => removeNode(node.id)}
          style={{ marginTop: '20px', width: '100%', padding: '8px', border: '1px solid #dc3545', color: '#dc3545', background: 'transparent', borderRadius: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '13px' }}
        >
          <Trash2 size={14} /> Remove Node
        </button>
      </div>

      <div className="panel-section" style={{ flex: 1, borderTop: '1px solid var(--border-color)' }}>
        <h4 style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>Network Links ({relatedEdges.length})</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {relatedEdges.length === 0 ? (
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No active connections.</p>
          ) : (
            relatedEdges.map(e => {
              const isSource = e.source === selectedNodeId || (typeof e.source === 'object' && e.source.id === selectedNodeId);
              const otherNodeRaw = isSource ? e.target : e.source;
              const otherNodeId = typeof otherNodeRaw === 'object' ? otherNodeRaw.id : otherNodeRaw;
              const otherNode = nodes.get(otherNodeId);
              return (
                <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '8px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{isSource ? 'Outbound' : 'Inbound'}</span>
                  <span className="monospace">{otherNode?.label || otherNodeId}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
