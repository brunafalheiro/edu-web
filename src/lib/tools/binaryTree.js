class TreeNode {
	constructor(value) {
		this.value = value;
		this.left = null;
		this.right = null;
		this.isBeingVisited = false;
		this.found = false;
	}
}

class TreeFunctions {
  static createTree({ treeStore, rootValue }) {
    treeStore.value = new TreeNode(rootValue);
  }

  static async insertNode(tree, value, animate = true) {
    if (!tree) {
      return new TreeNode(value);
    }
    
    if (animate) {
      tree.isBeingVisited = true;
      await new Promise(resolve => setTimeout(resolve, 500));
      tree.isBeingVisited = false;
    }
    
    if (value === tree.value) return null;    
    if (value < tree.value) {
      tree.left = await TreeFunctions.insertNode(tree.left, value, animate);
      return tree;
    }
  
    if (value > tree.value) {
      tree.right = await TreeFunctions.insertNode(tree.right, value, animate);
      return tree;
    }
    
    return tree;
  }
  
  static async generateRandomTree(nodeCount) {
    if (nodeCount <= 0) return null;

    let usedValues = new Set();
    while (usedValues.size < nodeCount) {
      usedValues.add(Math.floor(Math.random() * 101));
    }

    let values = [...usedValues];
    let root = new TreeNode(values[0]);

    for (let i = 1; i < values.length; i++) {
      await TreeFunctions.insertNode(root, values[i], false);
    }

    return root;
  }

  static async removeNode(tree, value) {
    if (!tree) {
      return null;
    }

    if (value < tree.value) {
      tree.left = await TreeFunctions.removeNode(tree.left, value);
      return tree;
    }

    if (value > tree.value) {
      tree.right = await TreeFunctions.removeNode(tree.right, value);
      return tree;
    }

    if (!tree.left && !tree.right) {
      return null;
    }

    if (!tree.left) {
      return tree.right;
    }
    
    if (!tree.right) {
      return tree.left;
    }

    let minValueNode = TreeFunctions.findMinNode(tree.right);
    tree.value = minValueNode.value;
    tree.right = await TreeFunctions.removeNode(tree.right, minValueNode.value);
    return tree;
  }

  static findMinNode(tree) {
    while (tree.left) tree = tree.left;
    return tree;
  }

  static async searchNode(tree, value) {
    if (!tree) {
      return null;
    }

    TreeFunctions.resetFoundFlag(tree);

    tree.isBeingVisited = true;
    await new Promise(resolve => setTimeout(resolve, 500));

    if (tree.value === value) {
      tree.isBeingVisited = false;
      tree.found = true; 
      return tree;
    }

    tree.isBeingVisited = false;

    if (value < tree.value) {
      return TreeFunctions.searchNode(tree.left, value);
    }
    return TreeFunctions.searchNode(tree.right, value);
  }

  static resetFoundFlag(tree) {
    if (!tree) return;
    tree.found = false;
    TreeFunctions.resetFoundFlag(tree.left);
    TreeFunctions.resetFoundFlag(tree.right);
  }
}

export { TreeFunctions };
