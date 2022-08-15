const breadth_and_depth_first_search = (start, goal, alg) => {

    /* based on a dict of connected nodes for each node, this function will find a path from start node to goal
    node using an implementation of the Breadth First Search algorithm (if bfs is true) or Depth First Search algorith (if bfs is false)*/

    // keeping track of nodes left to be explored
    let node_queue = [];

    // keeping track of all nodes that have already been explored
    let explored = [];

    // keeping track of each explored nodes parent to be able to display the path later
    let parents = {};
    
    // add start node to queue
    parents[start] = null;
    node_queue.push(start);

    var node = undefined;


    // repeat until goal is found or there are no more nodes to be explored
    while (node_queue.length > 0) {
        
        // remove and explore the first node in the queue     
        if (alg == "bfs") {
            node = node_queue.shift();
        } else {
            node = node_queue.pop(); 
        }

        // make sure node has not already been explored        
        if (explored.includes(node) == false) { 

            // mark node as explored
            explored.push(node);

            // if node is equal to the goal node, a path has been foun
            if (node == goal) {
                let path = generatePath(node, parents, start, goal, explored, alg);
                return path;
            }
    
            // if we have not found the goal node yet, we add the neighbors of the node to the queue
            let neighbors = find_neighbors(node);
            neighbors = shuffle(neighbors);


            for (let i = 0; i < neighbors.length; i++) {
                let new_node = neighbors[i];

                // make sure neighbor has not already been explored
                if (explored.includes(new_node) == false) {

                    if (parents[new_node] === undefined) {
                        parents[new_node] = node;
                    }

                    // check if neighbor is equal to the goal node
                    if (new_node == goal) {
                        let path = generatePath(node, parents, start, goal, explored, alg);
                        return path;
                    } else {
                        // make sure each node is only added to queue once
                        if(node_queue.includes(new_node) == false & explored.includes(new_node) == false) {
                            node_queue.push(new_node);
                        }
                    }

                }
            }
        }
    }

    //if goal has not been found and there are no more nodes to be explored, there is no possible connection between start and goal node
    highlightExploring(explored, parents, goal, null, alg) 
    return null;

}
