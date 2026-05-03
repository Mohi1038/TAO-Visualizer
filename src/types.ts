export type NodeType = 'USER' | 'POST';

export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  metadata?: Record<string, any>;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  vx?: number;
  vy?: number;
  radius?: number;
}

export type EdgeType = 'FRIEND' | 'CREATED' | 'LIKE';

export interface GraphEdge {
  id: string;
  source: string | GraphNode;
  target: string | GraphNode;
  type: EdgeType;
  cacheStatus?: 'HIT' | 'MISS' | 'NONE';
  timestamp: number;
}

export interface DomainEvent {
  type: 'POST_CREATED' | 'FANOUT' | 'CACHE_HIT' | 'CACHE_MISS' | 'USER_CREATED' | 'FRIEND_ADDED';
  payload: any;
  timestamp: number;
  id: string;
}

export interface SystemMetrics {
  cacheHitRatio: number;
  avgLatencyMs: number;
  activeNodes: number;
  totalEvents: number;
}
