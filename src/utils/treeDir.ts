export type NodeData = {
  name: string
  children: Array<NodeData>
}

export default class Tree {
  root: NodeData

  constructor(node: NodeData) {
    this.root = node
  }

  /**
   * Tree searching with Breadth-First search.
   * To be able to check, make sure that there is no more than
   * 2 nodes having the same name exist in the same parent node.
   *
   * @param { Node | Pick<NodeData, 'name'> } nodeName - Target node to find.
   * @returns { Node | null } - Return NodeData when target node is found, otherwise, return null.
   */
  bfs(targetNode: NodeData | Pick<NodeData, 'name'>): NodeData | null {
    // Create a queue with this.root as an initial value.
    // The nearer to top the top is, the higher its order is.
    const queue = [this.root]

    while (queue.length) {
      // First in - first out. Check the first node in the queue,
      // then remove it from the queue.
      const node = queue.shift()

      // Return the node after matching with targetNode's name.
      if (node && node.name === targetNode.name) {
        return node
      }

      // Keep traversing in children nodes, if there is any.
      for (let i = 0; node && i < node.children.length; i += 1) {
        queue.push(node.children[i])
      }
    }

    return null
  }

  /**
   * Add nodes to specified nodes. If there is no specified node,
   * add to root node by default.
   *
   * @param { NodeData } node - Target node to add
   * @param { NodeData | Pick<NodeData, 'name'> } parentNode - The node that target is being added to.
   */
  add(node: NodeData, parentNode?: NodeData | Pick<NodeData, 'name'>): void {
    // Traverse the parent node.
    const parent = parentNode ? this.bfs(parentNode) : null

    if (parent) {
      // If there is no child in this parent node, add without checking.
      if (parent.children.length < 1) {
        parent.children.push(node)
      } else {
        // Check to make sure that there are no 2 folders with
        // the same name existing in this parent node.
        for (let i = 0; i < parent.children.length; i += 1) {
          if (parent.children[i].name === node.name) {
            // If there is, throw back an Error and will stop the method
            throw new Error(`${node.name} has existed on ${parent.name}`)
          }
        }

        // If it doesn't throw an error, push node to tree.
        parent.children.push(node)
      }
    } else {
      // Not recommenended.
      this.add(node, this.root)
    }
  }
}
