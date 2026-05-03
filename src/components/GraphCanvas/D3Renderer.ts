import * as d3 from 'd3';
import type { GraphNode, GraphEdge } from '../../types';
import { useGraphStore } from '../../store/graphStore';

export class D3Renderer {
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private width: number;
  private height: number;
  private simulation: d3.Simulation<GraphNode, GraphEdge>;
  
  private linkGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
  private nodeGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
  private animationGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
  
  private nodes: GraphNode[] = [];
  private links: GraphEdge[] = [];

  private onNodeClick: (id: string) => void;

  constructor(container: SVGSVGElement, onNodeClick: (id: string) => void) {
    this.svg = d3.select(container);
    this.onNodeClick = onNodeClick;
    const rect = container.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    // Define zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        wrapper.attr('transform', event.transform);
      });
      
    this.svg.call(zoom);
    this.svg.on('dblclick.zoom', null); // Disable double-click zoom

    const wrapper = this.svg.append('g');

    // Layered rendering groups
    this.linkGroup = wrapper.append('g').attr('class', 'links');
    this.nodeGroup = wrapper.append('g').attr('class', 'nodes');
    this.animationGroup = wrapper.append('g').attr('class', 'animations');

    // Force simulation setup
    this.simulation = d3.forceSimulation<GraphNode>()
      .force('link', d3.forceLink<GraphNode, GraphEdge>().id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('collide', d3.forceCollide().radius(30))
      .on('tick', this.ticked.bind(this));

    // Listen to animation events
    window.addEventListener('tao:animate', this.handleAnimationEvent.bind(this) as EventListener);
  }

  public update(nodes: GraphNode[], links: GraphEdge[]) {
    // Clone nodes and links to prevent d3 from mutating zustand state directly
    this.nodes = nodes.map(n => {
      const existing = this.nodes.find(old => old.id === n.id);
      return existing ? { ...existing, ...n } : { ...n };
    });
    
    this.links = links.map(l => ({...l}));

    // Update Nodes
    const nodeSelection = this.nodeGroup.selectAll<SVGGElement, GraphNode>('.node')
      .data(this.nodes, d => d.id);

    const nodeEnter = nodeSelection.enter()
      .append('g')
      .attr('class', 'node')
      .on('click', (event, d) => {
        event.stopPropagation();
        this.onNodeClick(d.id);
      })
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', this.dragstarted.bind(this))
        .on('drag', this.dragged.bind(this))
        .on('end', this.dragended.bind(this)));

    nodeEnter.append('circle')
      .attr('r', d => d.type === 'USER' ? 24 : 16)
      .attr('fill', 'white')
      .attr('stroke', d => d.type === 'USER' ? 'var(--node-client)' : 'var(--node-app)') // Using new professional colors
      .attr('stroke-width', 2);

    nodeEnter.append('text')
      .text(d => d.label)
      .attr('dy', 35)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text-main)')
      .style('font-size', '12px')
      .style('font-family', 'var(--font-mono)')
      .style('pointer-events', 'none');

    nodeSelection.exit().transition().duration(300).attr('r', 0).remove();

    // Update Links
    const linkSelection = this.linkGroup.selectAll<SVGLineElement, GraphEdge>('.link')
      .data(this.links, d => d.id);

    linkSelection.enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', 'var(--link-color)')
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.6);

    linkSelection.exit().remove();

    // Restart simulation
    this.simulation.nodes(this.nodes);
    const linkForce = this.simulation.force('link') as d3.ForceLink<GraphNode, GraphEdge>;
    linkForce.links(this.links);
    this.simulation.alpha(0.3).restart();
  }

  private ticked() {
    this.linkGroup.selectAll<SVGLineElement, GraphEdge>('.link')
      .attr('x1', d => (d.source as GraphNode).x!)
      .attr('y1', d => (d.source as GraphNode).y!)
      .attr('x2', d => (d.target as GraphNode).x!)
      .attr('y2', d => (d.target as GraphNode).y!);

    this.nodeGroup.selectAll<SVGGElement, GraphNode>('.node')
      .attr('transform', d => `translate(${d.x},${d.y})`);
  }

  // Drag behaviors
  private dragstarted(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) {
    if (!event.active) this.simulation.alphaTarget(0.3).restart();
    
    // Disable repulsive forces during drag so nodes don't move away when you try to connect them
    this.simulation.force('charge', d3.forceManyBody().strength(0));
    this.simulation.force('collide', d3.forceCollide().radius(0));
    
    d.fx = d.x;
    d.fy = d.y;
  }

  private dragged(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) {
    d.fx = event.x;
    d.fy = event.y;
    
    // Optional: Could add visual feedback here (highlight target node)
  }

  private dragended(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) {
    if (!event.active) this.simulation.alphaTarget(0);
    
    // Restore professional physics
    this.simulation.force('charge', d3.forceManyBody().strength(-300));
    this.simulation.force('collide', d3.forceCollide().radius(30));
    
    const dropX = d.fx!;
    const dropY = d.fy!;
    
    d.fx = null;
    d.fy = null;

    // Check if dropped on another node to create a connection
    // Increased threshold slightly for better feel
    const RADIUS_THRESHOLD = 50;
    for (const other of this.nodes) {
      if (other.id !== d.id && other.x !== undefined && other.y !== undefined) {
        const dist = Math.hypot(other.x - dropX, other.y - dropY);
        if (dist < RADIUS_THRESHOLD) {
          window.dispatchEvent(new CustomEvent('tao:manual-connect', {
            detail: { sourceId: d.id, targetId: other.id }
          }));
          break;
        }
      }
    }
  }

  private handleAnimationEvent(e: CustomEvent) {
    const { type, sourceId, targetId } = e.detail;
    const store = useGraphStore.getState();
    const speed = store.simulationSpeed; 
    
    const baseDuration = 1500 / speed; // Slightly longer default for readability
    
    const sourceNode = this.nodes.find(n => n.id === sourceId);
    const targetNode = this.nodes.find(n => n.id === targetId);
    
    if (sourceNode && targetNode && sourceNode.x && sourceNode.y && targetNode.x && targetNode.y) {
      const particleGroup = this.animationGroup.append('g')
        .attr('transform', `translate(${sourceNode.x},${sourceNode.y})`);

      let labelText = "";
      let color = "var(--accent-primary)";
      
      if (type === 'FANOUT') {
        labelText = "FANOUT";
        color = "var(--accent-primary)";
      } else if (type === 'CACHE_HIT') {
        labelText = "CACHE HIT";
        color = "var(--node-cache)";
      } else if (type === 'CACHE_MISS') {
        labelText = "DB FETCH";
        color = "var(--node-db)";
      }

      // The Particle
      particleGroup.append('circle')
        .attr('r', 6)
        .attr('fill', color)
        .attr('filter', 'drop-shadow(0 0 4px ' + color + ')');

      // The Label
      particleGroup.append('text')
        .text(labelText)
        .attr('dy', -12)
        .attr('text-anchor', 'middle')
        .attr('fill', color)
        .style('font-size', '10px')
        .style('font-weight', '700')
        .style('font-family', 'var(--font-mono)')
        .style('pointer-events', 'none')
        .style('text-shadow', '0px 0px 4px white');

      particleGroup.transition()
        .duration(baseDuration)
        .ease(type === 'FANOUT' ? d3.easeCubicOut : d3.easeLinear)
        .attr('transform', `translate(${targetNode.x},${targetNode.y})`)
        .style('opacity', 0)
        .remove();
    }
  }

  public destroy() {
    this.simulation.stop();
    window.removeEventListener('tao:animate', this.handleAnimationEvent.bind(this) as EventListener);
  }
}
