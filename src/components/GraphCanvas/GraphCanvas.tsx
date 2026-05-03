import React, { useEffect, useRef } from 'react';
import { useGraphStore } from '../../store/graphStore';
import { D3Renderer } from './D3Renderer';

export const GraphCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const rendererRef = useRef<D3Renderer | null>(null);
  
  const nodesMap = useGraphStore(state => state.nodes);
  const edgesMap = useGraphStore(state => state.edges);
  const setSelectedNodeId = useGraphStore(state => state.setSelectedNodeId);

  const nodes = React.useMemo(() => Array.from(nodesMap.values()), [nodesMap]);
  const edges = React.useMemo(() => Array.from(edgesMap.values()), [edgesMap]);

  useEffect(() => {
    if (!svgRef.current) return;
    
    rendererRef.current = new D3Renderer(
      svgRef.current,
      (id) => setSelectedNodeId(id)
    );
    
    const handleConnect = (e: any) => {
      import('../../store/eventPipeline').then(({ eventPipeline }) => {
        eventPipeline.manualAddFriend(e.detail.sourceId, e.detail.targetId);
      });
    };
    window.addEventListener('tao:manual-connect', handleConnect);
    
    return () => {
      rendererRef.current?.destroy();
      rendererRef.current = null;
      window.removeEventListener('tao:manual-connect', handleConnect);
    };
  }, []);

  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.update(nodes, edges);
    }
  }, [nodes, edges]);

  return (
    <div 
      ref={containerRef}
      className="canvas-area"
    >
      <svg 
        ref={svgRef} 
        className="graph-svg"
        onClick={(e) => {
          if (e.target === svgRef.current) {
            setSelectedNodeId(null);
          }
        }}
      />
      
      {nodes.length === 0 && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
          pointerEvents: 'none', zIndex: 5
        }}>
          <div style={{ fontSize: '20px', fontWeight: 500, color: 'var(--text-main)' }}>
            System Idle
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Click "Start Traffic Simulation" or "Add New User" in the sidebar to begin.
          </div>
        </div>
      )}
    </div>
  );
};
