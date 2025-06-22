class HashTableFunctions {
  static createTable(size, collisionMethod = 'open') {
    if (collisionMethod === 'chaining') {
      return Array(size).fill().map(() => []);
    }
    return Array(size).fill(null);
  }

  static hash(value, size, method = 'division') {
    switch (method) {
      case 'division':
        return value % size;
      case 'folding':
        return String(value).split('').reduce((sum, digit) => sum + parseInt(digit), 0) % size;
      case 'multiplication':
        const A = 0.6180339887;
        return Math.floor(size * ((value * A) % 1));
      default:
        return 0;
    }
  }

  static linearProbing(index, size, attempt) {
    return (index + attempt) % size;
  }

  static quadraticProbing(index, size, attempt) {
    return (index + attempt * attempt) % size;
  }

  static doubleHashing(index, size, attempt, value) {
    const h2 = 1 + (value % (size - 1));
    return (index + attempt * h2) % size;
  }

  static insert(table, value, hashMethod = 'division', collisionMethod = 'open', probingMethod = 'linear') {
    if (!table || value === null) return false;
    
    if (collisionMethod === 'none') {
      const index = this.hash(value, table.length, hashMethod);
      if (table[index] !== null) {
        console.warn('Collision detected in no-collision mode');
        return false;
      }
      table[index] = value;
      return true;
    }
    
    if (collisionMethod === 'chaining') {
      const index = this.hash(value, table.length, hashMethod);
      table[index].push(value);
      return true;
    }

    // Open addressing
    const initialIndex = this.hash(value, table.length, hashMethod);
    let index = initialIndex;
    let attempt = 0;

    while (table[index] !== null) {
      attempt++;
      switch (probingMethod) {
        case 'linear':
          index = this.linearProbing(initialIndex, table.length, attempt);
          break;
        case 'quadratic':
          index = this.quadraticProbing(initialIndex, table.length, attempt);
          break;
        case 'double':
          index = this.doubleHashing(initialIndex, table.length, attempt, value);
          break;
      }
      
      if (attempt >= table.length) {
        console.warn('Table is full');
        return false;
      }
    }

    table[index] = value;
    return true;
  }

  static search(table, value, hashMethod = 'division', collisionMethod = 'open', probingMethod = 'linear') {
    if (!table || value === null) return false;
    
    if (collisionMethod === 'none') {
      const index = this.hash(value, table.length, hashMethod);
      return table[index] === value;
    }
    
    if (collisionMethod === 'chaining') {
      const index = this.hash(value, table.length, hashMethod);
      return table[index].includes(value);
    }

    // Open addressing
    const initialIndex = this.hash(value, table.length, hashMethod);
    let index = initialIndex;
    let attempt = 0;
    let visited = new Set();

    while (!visited.has(index)) {
      if (table[index] === value) return true;
      if (table[index] === null) return false;
      
      visited.add(index);
      attempt++;
      switch (probingMethod) {
        case 'linear':
          index = this.linearProbing(initialIndex, table.length, attempt);
          break;
        case 'quadratic':
          index = this.quadraticProbing(initialIndex, table.length, attempt);
          break;
        case 'double':
          index = this.doubleHashing(initialIndex, table.length, attempt, value);
          break;
      }
      
      if (attempt >= table.length) return false;
    }

    return false;
  }

  static clear(table, collisionMethod = 'open') {
    if (collisionMethod === 'chaining') {
      return table.map(() => []);
    }
    return table.fill(null);
  }

  static getLoadFactor(table, collisionMethod = 'open') {
    if (!table) return 0;
    
    if (collisionMethod === 'chaining') {
      const totalElements = table.reduce((sum, chain) => sum + chain.length, 0);
      return totalElements / table.length;
    }
    
    if (collisionMethod === 'none') {
      const filledSlots = table.filter(slot => slot !== null).length;
      return filledSlots / table.length;
    }
    
    // Open addressing
    const filledSlots = table.filter(slot => slot !== null).length;
    return filledSlots / table.length;
  }
}

export { HashTableFunctions }; 