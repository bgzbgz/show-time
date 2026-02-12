// =============================================================================
// Dependency Graph Utilities
// =============================================================================

interface DependencyNode {
  slug: string;
  dependencies: string[];
  outputs: string[];
}

interface GraphValidationResult {
  valid: boolean;
  errors: string[];
  cycles?: string[][];
}

/**
 * Build dependency graph from config
 */
export function buildDependencyGraph(
  config: Record<string, { dependencies?: string[]; outputs?: string[] }>
): Map<string, DependencyNode> {
  const graph = new Map<string, DependencyNode>();

  for (const [slug, data] of Object.entries(config)) {
    graph.set(slug, {
      slug,
      dependencies: data.dependencies || [],
      outputs: data.outputs || [],
    });
  }

  return graph;
}

/**
 * Detect circular dependencies in the graph
 */
export function detectCircularDependencies(
  graph: Map<string, DependencyNode>
): GraphValidationResult {
  const errors: string[] = [];
  const cycles: string[][] = [];

  // Track visited nodes and current path
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const currentPath: string[] = [];

  function dfs(nodeSlug: string): boolean {
    visited.add(nodeSlug);
    recursionStack.add(nodeSlug);
    currentPath.push(nodeSlug);

    const node = graph.get(nodeSlug);
    if (!node) {
      return false;
    }

    // Get dependent nodes (tools that depend on this node's outputs)
    const dependents = findDependentNodes(graph, nodeSlug);

    for (const dependent of dependents) {
      if (!visited.has(dependent)) {
        if (dfs(dependent)) {
          return true; // Cycle detected
        }
      } else if (recursionStack.has(dependent)) {
        // Cycle detected
        const cycleStart = currentPath.indexOf(dependent);
        const cycle = currentPath.slice(cycleStart).concat(dependent);
        cycles.push(cycle);
        errors.push(`Circular dependency detected: ${cycle.join(' → ')}`);
        return true;
      }
    }

    recursionStack.delete(nodeSlug);
    currentPath.pop();
    return false;
  }

  // Check each node
  for (const nodeSlug of graph.keys()) {
    if (!visited.has(nodeSlug)) {
      dfs(nodeSlug);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    cycles: cycles.length > 0 ? cycles : undefined,
  };
}

/**
 * Find nodes that depend on a given node
 */
function findDependentNodes(
  graph: Map<string, DependencyNode>,
  targetSlug: string
): string[] {
  const targetNode = graph.get(targetSlug);
  if (!targetNode) {
    return [];
  }

  const dependents: string[] = [];

  for (const [slug, node] of graph.entries()) {
    if (slug === targetSlug) continue;

    // Check if this node depends on any of target's outputs
    const hasMatchingDependency = node.dependencies.some(dep =>
      targetNode.outputs.some(output => dep.startsWith(output))
    );

    if (hasMatchingDependency) {
      dependents.push(slug);
    }
  }

  return dependents;
}

/**
 * Topological sort of dependency graph
 * Returns tools in valid completion order
 */
export function topologicalSort(
  graph: Map<string, DependencyNode>
): string[] | null {
  const inDegree = new Map<string, number>();
  const adjList = new Map<string, string[]>();

  // Initialize in-degree and adjacency list
  for (const slug of graph.keys()) {
    inDegree.set(slug, 0);
    adjList.set(slug, []);
  }

  // Build adjacency list and calculate in-degrees
  for (const [slug, node] of graph.entries()) {
    const dependents = findDependentNodes(graph, slug);
    adjList.set(slug, dependents);

    for (const dependent of dependents) {
      inDegree.set(dependent, (inDegree.get(dependent) || 0) + 1);
    }
  }

  // Queue of nodes with no dependencies
  const queue: string[] = [];
  for (const [slug, degree] of inDegree.entries()) {
    if (degree === 0) {
      queue.push(slug);
    }
  }

  const sortedOrder: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    sortedOrder.push(current);

    const neighbors = adjList.get(current) || [];
    for (const neighbor of neighbors) {
      const newDegree = (inDegree.get(neighbor) || 0) - 1;
      inDegree.set(neighbor, newDegree);

      if (newDegree === 0) {
        queue.push(neighbor);
      }
    }
  }

  // If not all nodes processed, there's a cycle
  if (sortedOrder.length !== graph.size) {
    return null; // Cycle detected
  }

  return sortedOrder;
}

/**
 * Validate dependency graph
 */
export function validateDependencyGraph(
  config: Record<string, { dependencies?: string[]; outputs?: string[] }>
): GraphValidationResult {
  const graph = buildDependencyGraph(config);
  const errors: string[] = [];

  // Check for circular dependencies
  const circularCheck = detectCircularDependencies(graph);
  if (!circularCheck.valid) {
    errors.push(...circularCheck.errors);
  }

  // Check for missing dependencies
  for (const [slug, node] of graph.entries()) {
    for (const depFieldId of node.dependencies) {
      // Find if any tool outputs this field
      const hasProvider = Array.from(graph.values()).some(n =>
        n.outputs.some(output => depFieldId.startsWith(output))
      );

      if (!hasProvider) {
        errors.push(
          `Tool "${slug}" requires field "${depFieldId}" but no tool provides it`
        );
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    cycles: circularCheck.cycles,
  };
}

/**
 * Get tool completion order
 */
export function getCompletionOrder(
  config: Record<string, { dependencies?: string[]; outputs?: string[] }>
): string[] {
  const graph = buildDependencyGraph(config);
  const order = topologicalSort(graph);

  if (!order) {
    throw new Error('Cannot determine completion order: circular dependencies detected');
  }

  return order;
}
