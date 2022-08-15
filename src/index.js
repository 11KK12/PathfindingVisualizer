//number of nodes
var n = document.getElementById("node_number_input").value;
var neighbor_count = 5;
var connection_probability = 0.5;

var board_out = false;

//const highlightExploring = (explored, parents, goal, path, bfs)
// remeber last found paths
var last_bfs = {
    solved: false,
    "explored": [],
    "parents": {},
    goal: "",
    path: []
}

var last_dfs = {
    solved: false,
    "explored": [],
    "parents": {},
    goal: "",
    path: []
}

var displayed = null;

// animation speed
var speed = 25;

// selected algorithm
var alg = "bfs";

//dict to keep track of all nodes with id as key and top and left parameter as values
var nodes = {};
var node_connections = {};

// used to store start and goals nodes selectetd by user
var start_node = undefined;
var goal_node = undefined;

refresh();

function refresh() {

    nodes = {}
    node_connections = {}
    start_node = undefined;
    goal_node = undefined;
    displayed = null;

    resetLastSolutions();

    clearBoardContainer();
    clearTable();

    document.getElementById("speed_slider").removeAttribute("disabled");
    document.getElementById("node_number_input").removeAttribute("disabled");
    notification.className = "slide-out"
    //notification.style.setProperty("visibility", "collapse");

    console.log("Refresh called with n: " + n);
    
    for (let i = 0; i < n; i++) {
        nodes[i] = addNode(i);
    }
    
    for (let i = 0; i < n; i++) {
        //[node_connections[i], node_connections_keys[i]] = addArcs(neighbors(i));
        node_connections[i] = addArcs(neighbors(i));
        draw_arcs(i);
    }

    listen_to_node_clicks();

}

function resetLastSolutions() {
    last_bfs = {
        solved: false,
        "explored": [],
        "parents": {},
        goal: "",
        path: []
    }
    
    last_dfs = {
        solved: false,
        "explored": [],
        "parents": {},
        goal: "",
        path: []
    }
}

function clearBoardContainer() {

    try {
        clearInterval(path_interval);
    } catch{}

    try {
        clearInterval(explored_interval);
    } catch{}
    
    let nodes = document.querySelectorAll(".node");
    nodes.forEach(node => {
        node.remove();
    })

    let arcs = document.querySelectorAll(".arc");
    arcs.forEach(arc => {
        arc.remove();
    })
}

function clearTable() {
    document.getElementById("bfs_pld").innerHTML = "-";
    document.getElementById("bfs_pln").innerHTML = "-";
    document.getElementById("bfs_ne").innerHTML = "-";

    document.getElementById("dfs_pld").innerHTML = "-";
    document.getElementById("dfs_pln").innerHTML = "-";
    document.getElementById("dfs_ne").innerHTML = "-";
}

// generare a new node with a given id
function addNode (id) {
    // create a new div element with id
    let div = document.createElement('div');
    div.id = id;
    div.className = 'node';

    // add the newly created node into the DOM
    document.getElementById("board_container").appendChild(div);
    //document.body.appendChild(div);

    // generate random top and left values between 5 % and 95 %
    //let top_num = Math.floor(Math.random() * 90) + 5;
    //let left_num = Math.floor(Math.random() * 90) + 5;
    let top_num = Math.floor(Math.random() * 96) +2;
    let left_num = Math.floor(Math.random() * 96) + 2;

    let top_value = top_num + '%';
    let left_value = left_num + '%';

    let top_value_adjusted = top_num - 2 + '%';
    let left_value_adjusted = left_num - 1 + '%';

    // assign top and left values to element
    div.style.setProperty("top", top_value_adjusted);
    div.style.setProperty("left", left_value_adjusted);

    // add node to dict of all nodes
    return [top_value, left_value];
}

function addArcs(neighbor_nodes) {

    // generate and display random connections between nodes
    let connections = [];
    //let connection_keys = [];
    //let keys = Object.keys(neighbor_nodes);

    for (let i = 0; i < neighbor_nodes.length; i++) {

        // connect with certain probability
        let random = Math.random()

        if (random < connection_probability) {
            connections.push(neighbor_nodes[i]);
            //connection_keys.push(keys[i]);
        }
    }

    //make sure that there is at least one connection
    if (connections.length == 0) {
        //connect to random neighbor
        //generate random index between 0 and neighbor_count - 1
        let index = Math.floor(Math.random() * 5);
        connections.push(neighbor_nodes[index]);
        //connection_keys.push(keys[index]);
    }

    //return [connections, connection_keys];
    return connections;
}

function neighbors(node) {

    // returns array of nodes that are near to given node
    // only consider round(N * percentage) nearest nodes of node

    let neighbor_nodes = [];
    let distance = {};

    for(let i = 0; i < n; i++) {

        distance[i] = 100;

        if (i != node) {
            distance[i] = calculateDistance(node, i);
        }

    }

    // only consider round(N * percentage) nearest nodes of node
    let nearest_nodes = sort_keys_by_value(distance);
    //let number_of_connections = Math.round(N * NEIGHBOR_PERCENTAGE);

    for(let i = 0; i < neighbor_count; i++) {
        neighbor_nodes.push(nodes[nearest_nodes[i]]);
    }

    return neighbor_nodes;

}

function calculateDistance(node1, node2) {
    //calculates and returns distance between two given nodes

    let y1 = parseInt(nodes[node1][0]);
    let x1 = parseInt(nodes[node1][1]);

    let y2 = parseInt(nodes[node2][0]);
    let x2 = parseInt(nodes[node2][1]);

    let distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    return distance;   
}

function draw_arcs(node) {

    y1 = nodes[node][0];
    x1 = nodes[node][1];

    let connected_nodes = node_connections[node];
    //let connected_nodes_keys = node_connections_keys[node];

    for (let i = 0; i < connected_nodes.length; i++) {
        let line = document.createElementNS('http://www.w3.org/2000/svg','line');
        line.setAttribute("class", "arc");

        let connected_node_id = getKeyByValue(nodes, connected_nodes[i])
        line.id = "line_" + node + "_" + connected_node_id + "_";
    
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("y2", connected_nodes[i][0]);
        line.setAttribute("x2", connected_nodes[i][1]);
        line.setAttribute("stroke", "#525252");
        line.setAttribute("stroke-width", "2px");

        //line.style.setProperty("position", "absolute");
        
        document.getElementById("base_svg").appendChild(line);
    }

}

function sort_keys_by_value(dict) {
    // Step - 1
    // Create the array of key-value pairs
    var items = Object.keys(dict).map(
        (key) => { return [key, dict[key]] });
    
    // Step - 2
    // Sort the array based on the second element (i.e. the value)
    items.sort(
        (first, second) => { return first[1] - second[1] }
    );
    
    // Step - 3
    // Obtain the list of keys in sorted order of the values.
    var keys = items.map(
        (e) => { return e[0] });

    return keys;
}

function changeNodeNumber() {
    n = parseInt(document.getElementById("node_number_input").value);
    refresh();
}

function changeSpeed() {
    let input = parseInt(document.getElementById("speed_slider").value);

    switch(input) {
        case 1:
            speed = 250;
            break;
        case 2:
            speed = 100;
            break;
        case 3:
            speed = 25;
            break;
        case 4:
            speed = 8;
            break;
        case 5:
            speed = 2;
            break;
        default:
            speed = 25;
      }
}

function listen_to_node_clicks() {

    let nodes = document.querySelectorAll(".node");
    nodes.forEach(node => {
        node.addEventListener("click", () => {
            notification.className = "slide-out"

           if (start_node === undefined) {
                start_node = node.id;
                highlightNode(node.id, "#8CE937");
            } else {
                if (goal_node === undefined & start_node != node.id) {
                    goal_node = node.id;
                    highlightNode(node.id, "red");
                } else {
                    if (start_node != undefined & goal_node != undefined) {
                        reset_colors_and_arc_width()
                        clearTable();
                        resetLastSolutions();
                        highlightNode(start_node, "#525252");
                        highlightNode(goal_node, "#525252");
                        start_node = node.id;
                        goal_node = undefined;
                        highlightNode(node.id, "#8CE937");
                    }
    
                }
            }

        });
    })
}

function run_alg() {

    // reset table row
    if (alg == "bfs") {
        document.getElementById("bfs_ne").innerHTML = "-";
        document.getElementById("bfs_pld").innerHTML = "-";
        document.getElementById("bfs_pln").innerHTML = "-";
    } else {
        if (alg == "dfs") {
            document.getElementById("dfs_ne").innerHTML = "-";
            document.getElementById("dfs_pld").innerHTML = "-";
            document.getElementById("dfs_pln").innerHTML = "-";
        }
    }
    
    if (start_node != undefined & goal_node != undefined) {
        reset_colors_and_arc_width()
        switch(alg) {
            case "bfs":
                breadth_and_depth_first_search(start_node, goal_node, "bfs");
                document.getElementById("bfs_ne").innerHTML = "-";
                document.getElementById("bfs_pld").innerHTML = "-";
                document.getElementById("bfs_pln").innerHTML = "-";
                break;
            case "dfs":
                breadth_and_depth_first_search(start_node, goal_node, "dfs");
                document.getElementById("dfs_ne").innerHTML = "-";
                document.getElementById("dfs_pld").innerHTML = "-";
                document.getElementById("dfs_pln").innerHTML = "-";
                break;
        }
    } else {
        if (start_node == undefined) {
            setNotification("Select a start node!");
        } else {
            setNotification("Select a goal node!");
        }
    }

}

function change_run_button() {
    let button = document.getElementById("run_button");
    alg = document.getElementById("select_alg").value;
    switch(alg) {
        case "bfs":
            button.innerHTML = "Run Breadth First Search";
            change_info_text("bfs");
            break;
        case "dfs":
            button.innerHTML = "Run Depth First Search";
            change_info_text("dfs");
            break;
    }
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function reset_colors_and_arc_width() {

    try {
        clearInterval(path_interval);
    } catch{}

    try {
        clearInterval(explored_interval);
    } catch{}

    let nodes = document.querySelectorAll(".node");
    nodes.forEach(node => {
        node.style.setProperty("background-color", "#525252");
        node.style.setProperty("z-index", undefined);
    })

    let arcs = document.querySelectorAll(".arc");
    arcs.forEach(arc => {
        arc.setAttribute("stroke", "#525252");
        arc.setAttribute("stroke-width", "2px");
        arc.style.setProperty("z-index", undefined);
    })

    if (start_node != undefined) {
        highlightNode(start_node, "#8CE937");
    }

    if (goal_node != undefined) {
        highlightNode(goal_node, "red");
    }

    document.getElementById("speed_slider").removeAttribute("disabled");
    document.getElementById("node_number_input").removeAttribute("disabled");
    notification.className = "slide-out"
    //notification.style.setProperty("visibility", "collapse");
}

function toggleBoard() {

    let search_table = document.getElementById("search_table");
   
    /*if (search_table.className == "opacity-out" | search_table.className == "") {
        boardOut();
    } else {
        boardIn();
    }*/
    if (board_out) {
        boardIn();
        board_out = false;
    } else {
        boardOut();
        board_out = true;
    }
}

function boardIn() {
    let search_table = document.getElementById("search_table");
    let info_text = document.getElementById("info_text");
    let table_div = document.getElementById("table_div");
    let slider_chevron = document.getElementById("slider-chevron");

    slider_chevron.innerHTML = "chevron_left";
        table_div.className = "slide-table-out";
        search_table.className = "opacity-out";
        info_text.className = "opacity-out";
        /*setTimeout(() => {
            search_table.style.setProperty("visibility", "hidden");
            info_text.style.setProperty("visibility", "hidden");
        }, 1000);*/
}

function boardOut() {
    let search_table = document.getElementById("search_table");
    let info_text = document.getElementById("info_text");
    let table_div = document.getElementById("table_div");
    let slider_chevron = document.getElementById("slider-chevron");

    slider_chevron.innerHTML = "chevron_right";
        table_div.className = "slide-table-in";
        search_table.style.setProperty("visibility", "visible");
        search_table.style.removeProperty("opacity");
        search_table.className = "";
        info_text.style.setProperty("visibility", "visible");
        info_text.style.removeProperty("opacity");
        info_text.className = "";
}

function setNotification(notification_text) {
    let notification = document.getElementById("notification");
    notification.style.setProperty("visibility", "visible");
    notification.innerHTML = notification_text;
    notification.className = "slide-in"
}

function change_info_text(alg) {
    
    let info_text = document.getElementById("info_text"); 

    switch (alg) {
        case "bfs":
            info_text.innerHTML = bfs_text;
            break;
        case "dfs":
            info_text.innerHTML = dfs_text;
            break;
    }

    highlighLastSolution(alg);
}

function change_option_value(alg) {
    document.getElementById("select_alg").value = alg;
    change_run_button();
    run_alg();
}

function highlighLastSolution(alg) {

    if (alg != displayed) {

        let data = {}

        switch (alg) {
            case "bfs":
                data = last_bfs;
                break;
            case "dfs":
                data = last_dfs;
                break;
        }

        reset_colors_and_arc_width();
        displayed = null;

        if (data["solved"] != false) {

            displayed = alg;

            let explored = data["explored"];
            let goal = data["goal"];
            let parents = data["parents"];
            let path = data["path"];

            for (let i = 1; i < explored.length; i++) {
                let node = explored[i];
                highlightArc(node, parents[node], "#0C7692", false);
                highlightNode(node, "#0C7692");
            }
            let node = explored[explored.length];
            highlightArc(node, goal, "#0C7692", false);

            if (path != null) {

                for (let i = 1; i < path.length - 1; i++) {
                    highlightNode(path[i], "gold", true);
                    highlightArc(path[i], path[i-1], "gold", true);
                }
                highlightArc(path[path.length - 1], path[path.length - 2], "gold", true);
            }
        }

    }
}

var bfs_text = "<b>Breath First Search</b> explores all neighbor nodes in a first-in-first-out order, one level at a time. Doing this, BFS is <b>guarenteed to find the shortest path</b> (in terms of number of nodes), but must explore a large number of nodes to do so.";
var dfs_text = "<b>Depth First Search</b> explores all neighbor nodes in a last-in-first-out order, which means that the depth of the graph is explored quickly. DFS is unlikely to find the shortest solution, but <b>usually needs to explore fewer nodes</b> to find the goal node.";

/*
TODO infos zu algorithmen

As pointed above, BFS can only be used to find shortest path in a graph if:

    There are no loops

    All edges have same weight or no weight.

    -> BFS is unlikely to find best solution 
*/


document.getElementById("info_text").innerHTML = bfs_text;
