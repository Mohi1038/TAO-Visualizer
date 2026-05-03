import { useGraphStore } from './graphStore';
import type { DomainEvent, GraphNode, GraphEdge } from '../types';

class EventPipeline {
  private intervalId: number | null = null;
  private eventIdCounter = 0;

  startSimulation() {
    if (this.intervalId) return;

    // Simulate initial nodes and edges if map is empty
    const store = useGraphStore.getState();
    if (store.nodes.size === 0) {
      const initialUsers: GraphNode[] = [
        { id: 'u1', type: 'USER', label: 'Alice', metadata: { activity: 10 } },
        { id: 'u2', type: 'USER', label: 'Bob', metadata: { activity: 5 } },
        { id: 'u3', type: 'USER', label: 'Charlie', metadata: { activity: 15 } },
      ];

      const initialEdges: GraphEdge[] = [
        { id: 'e-u1-u2', source: 'u1', target: 'u2', type: 'FRIEND', timestamp: Date.now() },
        { id: 'e-u2-u3', source: 'u2', target: 'u3', type: 'FRIEND', timestamp: Date.now() },
        { id: 'e-u3-u1', source: 'u3', target: 'u1', type: 'FRIEND', timestamp: Date.now() }
      ];

      initialUsers.forEach(u => store.addNode(u));
      initialEdges.forEach(e => store.addEdge(e));
    }

    this.runStep();
  }

  private runStep() {
    const store = useGraphStore.getState();
    // Base delay is 3000ms, divided by speed (0.1 to 2.0)
    // At speed 1.0, delay is 3000ms. At speed 0.5, delay is 6000ms. At speed 2.0, delay is 1500ms.
    const delay = 3000 / store.simulationSpeed;
    
    this.intervalId = window.setTimeout(() => {
      this.generateRandomEvent();
      if (this.intervalId) {
        this.runStep();
      }
    }, delay);
  }

  stopSimulation() {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
  }

  private generateRandomEvent() {
    const types: DomainEvent['type'][] = ['POST_CREATED', 'FANOUT', 'CACHE_HIT', 'CACHE_MISS'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const event: DomainEvent = {
      id: `ev-${++this.eventIdCounter}`,
      type,
      payload: {},
      timestamp: Date.now()
    };

    this.processEvent(event);
  }

  // --- MANUAL OVERRIDES ---
  
  public manualAddUser() {
    const id = `u-${Date.now()}`;
    const event: DomainEvent = {
      id: `ev-${++this.eventIdCounter}`,
      type: 'USER_CREATED',
      payload: { userId: id },
      timestamp: Date.now()
    };
    this.processEvent(event);
  }

  public manualTriggerPost(authorId: string) {
    const event: DomainEvent = {
      id: `ev-${++this.eventIdCounter}`,
      type: 'POST_CREATED',
      payload: { authorId },
      timestamp: Date.now()
    };
    this.processEvent(event);
  }

  public manualAddFriend(sourceId: string, targetId: string) {
    const event: DomainEvent = {
      id: `ev-${++this.eventIdCounter}`,
      type: 'FRIEND_ADDED',
      payload: { sourceId, targetId },
      timestamp: Date.now()
    };
    this.processEvent(event);
  }

  // ------------------------

  private processEvent(event: DomainEvent) {
    const store = useGraphStore.getState();
    store.addEvent(event);

    switch (event.type) {
      case 'USER_CREATED': {
        const userId = event.payload.userId || `u-${Date.now()}`;
        const newUser: GraphNode = {
          id: userId,
          type: 'USER',
          label: `User ${userId.slice(-4)}`,
          metadata: { activity: 0 }
        };
        store.addNode(newUser);
        store.updateMetrics({ activeNodes: store.nodes.size + 1 });
        break;
      }
      case 'FRIEND_ADDED': {
        const { sourceId, targetId } = event.payload;
        if (!sourceId || !targetId || sourceId === targetId) break;
        
        const newEdge: GraphEdge = {
          id: `e-${sourceId}-${targetId}-${Date.now()}`,
          source: sourceId,
          target: targetId,
          type: 'FRIEND',
          timestamp: Date.now()
        };
        store.addEdge(newEdge);
        
        // Update metrics
        store.updateMetrics({
          totalEvents: store.metrics.totalEvents + 1
        });
        break;
      }
      case 'POST_CREATED': {
        const postId = `p-${Date.now()}`;
        
        // Use provided authorId from manual trigger, or fallback to random
        let authorId = event.payload?.authorId;
        if (!authorId) {
          const users = Array.from(store.nodes.values()).filter(n => n.type === 'USER');
          if (users.length === 0) break;
          authorId = users[Math.floor(Math.random() * users.length)].id;
        }
        
        const newPost: GraphNode = {
          id: postId,
          type: 'POST',
          label: `Post ${postId.slice(-4)}`,
          metadata: { authorId }
        };
        
        const newEdge: GraphEdge = {
          id: `e-${authorId}-${postId}`,
          source: authorId,
          target: postId,
          type: 'CREATED',
          timestamp: Date.now()
        };

        store.addNode(newPost);
        store.addEdge(newEdge);
        
        // Update metrics
        store.updateMetrics({
          totalEvents: store.metrics.totalEvents + 1,
          activeNodes: store.nodes.size + 1
        });
        
        // Dispatch custom DOM event for the D3 layer to animate fanout
        window.dispatchEvent(new CustomEvent('tao:animate', {
            detail: { type: 'FANOUT', sourceId: authorId, targetId: postId }
        }));
        
        break;
      }
      case 'CACHE_HIT':
      case 'CACHE_MISS': {
        const users = Array.from(store.nodes.values()).filter(n => n.type === 'USER');
        const posts = Array.from(store.nodes.values()).filter(n => n.type === 'POST');
        if (users.length > 0 && posts.length > 0) {
            const u = users[Math.floor(Math.random() * users.length)];
            const p = posts[Math.floor(Math.random() * posts.length)];
            
            store.updateMetrics({
                cacheHitRatio: Math.min(1, Math.max(0, store.metrics.cacheHitRatio + (event.type === 'CACHE_HIT' ? 0.05 : -0.05)))
            });

            window.dispatchEvent(new CustomEvent('tao:animate', {
                detail: { type: event.type, sourceId: u.id, targetId: p.id }
            }));
        }
        break;
      }
    }
  }
}

export const eventPipeline = new EventPipeline();
