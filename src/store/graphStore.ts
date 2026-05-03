import { create } from 'zustand';
import type { GraphNode, GraphEdge, SystemMetrics, DomainEvent } from '../types';

interface GraphState {
  nodes: Map<string, GraphNode>;
  edges: Map<string, GraphEdge>;
  events: DomainEvent[];
  metrics: SystemMetrics;
  simulationSpeed: number; // 0.1 to 2.0
  
  // Actions
  addNode: (node: GraphNode) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: GraphEdge) => void;
  addEvent: (event: DomainEvent) => void;
  updateMetrics: (metrics: Partial<SystemMetrics>) => void;
  setSimulationSpeed: (speed: number) => void;
  
  // Interactions
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
}

export const useGraphStore = create<GraphState>((set) => ({
  nodes: new Map(),
  edges: new Map(),
  events: [],
  metrics: {
    cacheHitRatio: 0,
    avgLatencyMs: 0,
    activeNodes: 0,
    totalEvents: 0,
  },
  simulationSpeed: 0.5, // Default to a slower, more observable speed
  
  addNode: (node) => set((state) => {
    const newNodes = new Map(state.nodes);
    newNodes.set(node.id, node);
    return { nodes: newNodes };
  }),
  
  removeNode: (id) => set((state) => {
    const newNodes = new Map(state.nodes);
    newNodes.delete(id);
    
    const newEdges = new Map(state.edges);
    for (const [edgeId, edge] of Array.from(newEdges.entries())) {
      const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source;
      const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target;
      if (sourceId === id || targetId === id) {
        newEdges.delete(edgeId);
      }
    }
    
    return { 
      nodes: newNodes, 
      edges: newEdges,
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId 
    };
  }),
  
  addEdge: (edge) => set((state) => {
    const newEdges = new Map(state.edges);
    newEdges.set(edge.id, edge);
    return { edges: newEdges };
  }),
  
  addEvent: (event) => set((state) => ({
    events: [...state.events, event]
  })),
  
  updateMetrics: (metricsUpdate) => set((state) => ({
    metrics: { ...state.metrics, ...metricsUpdate }
  })),

  setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),
  
  selectedNodeId: null,
  setSelectedNodeId: (id) => set({ selectedNodeId: id })
}));
