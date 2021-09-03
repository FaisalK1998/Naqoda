/**
 * Dijkstra’s Algorithm lets us prioritise which paths to explore. Instead of exploring all possible paths equally, 
 * it favors lower cost paths. It is the algorithm of choice for finding the 
 * shortest paths with multiple destinations
 */

/**
 * This function takes in 3 parameters and calculates the shortest path using 
 * the Dijkstra algorithm
 * @param {*} grid 
 * @param {*} startNode 
 * @param {*} finishNode 
 * @returns 
 */
export function dijkstra(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);
  
        while (unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        // If we encounter a wall, we skip it.
            if (!closestNode.isWall) {
                // If the closest node is at a distance of infinity,
                // we must be trapped and should stop.
                if (closestNode.distance === Infinity) return visitedNodesInOrder;
                closestNode.isVisited = true;
                visitedNodesInOrder.push(closestNode);
                if (closestNode === finishNode) return visitedNodesInOrder;
                updateUnvisitedNeighbors(closestNode, grid);
            }
        }
    }

    /**
     * This function is used to get all nodes 
     * @param {*} grid 
     * @returns nodes
     */
    function getAllNodes(grid) {
        const nodes = [];
            //The push() method appends new elements to the end of an array, and returns the new length of the array.
            for (const row of grid) {
                for (const node of row) {
                nodes.push(node);
            }
        }
        return nodes;
    }
  
    /**
     * This function sorts unvisited nodes by distance
     * @param {*} unvisitedNodes 
     */
    function sortNodesByDistance(unvisitedNodes) {
        //Simple calculation to figure the distance from node A to B
        unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
    }
  
    /**
     * This function takes in 2 parameters and updates any unvisited neighbouring nodes
     * @param {*} node 
     * @param {*} grid 
     */
    function updateUnvisitedNeighbors(node, grid) {
        const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
            //Simple for loop to calculate the distance between neighbours
            for (const neighbor of unvisitedNeighbors) {
                neighbor.distance = node.distance + 1;
                neighbor.previousNode = node;
            }
    }
  
    /**
     * This function retrieves unvisited neighbours
     * @param {*} node 
     * @param {*} grid 
     * @returns The elements of an array that meet the condition specified in the function
     */
    function getUnvisitedNeighbors(node, grid) {
        const neighbors = [];
        const {col, row} = node;
            //The push() method appends new elements to the end of an array, and returns the new length of the array.
            if (row > 0) neighbors.push(grid[row - 1][col]);
            if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
            if (col > 0) neighbors.push(grid[row][col - 1]);
            if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
        return neighbors.filter(neighbor => !neighbor.isVisited);
    }
  