var explored_interval = undefined;
var path_interval = undefined;

const generatePath = (node, parents, start, goal, explored, alg) => {

    /* based on the finally node that was found and the dict of each nodes parent node, this function will return the path
    that was found by the search algortihm*/

    let path = [];
    path.push(goal);
    let current_node = node;
    path.push(current_node);

    while (current_node != start) {
        current_node = parents[current_node];
        path.push(current_node);
    }

    path.reverse()

    highlightExploring(explored, parents, goal, path, alg);

    return path;

}

const highlightNode = (node, color, isPath) => {
    let highlight = document.getElementById(node);
    highlight.style.setProperty("background-color", color);
    if(isPath) {
        highlight.style.setProperty("z-index", "1");
    }
}

const highlightPath = (path, alg) => {

    if (path != null) {

        let i = 1;
        let distance = 0;

        document.getElementById("speed_slider").setAttribute("disabled", "true");
        document.getElementById("node_number_input").setAttribute("disabled", "true");

        path_interval = setInterval(() => {

            // calculate path distance
            distance += calculateDistance(path[i], path[i-1]);

            if (i < path.length - 1) {
                highlightNode(path[i], "gold", true);
                highlightArc(path[i], path[i-1], "gold", true);
                i++;
            } else {            
                highlightArc(path[i], path[i-1], "gold", true)
                clearInterval(path_interval);

                switch (alg) {
                    case "bfs":
                        document.getElementById("bfs_pld").innerHTML = Math.round(distance);
                        document.getElementById("bfs_pln").innerHTML = i;
                        break;
                    case "dfs":
                        document.getElementById("dfs_pld").innerHTML = Math.round(distance);
                        document.getElementById("dfs_pln").innerHTML = i; 
                        break;
                    case "ucs":
                        document.getElementById("ucs_pld").innerHTML = Math.round(distance);
                        document.getElementById("ucs_pln").innerHTML = i; 
                        break;
                    case "dik":
                        document.getElementById("dik_pld").innerHTML = Math.round(distance);
                        document.getElementById("dik_pln").innerHTML = i; 
                        break;
                    case "a":
                        document.getElementById("a_pld").innerHTML = Math.round(distance);
                        document.getElementById("a_pln").innerHTML = i; 
                        break;
                    case "gbf":
                        document.getElementById("gbf_pld").innerHTML = Math.round(distance);
                        document.getElementById("gbf_pln").innerHTML = i; 
                        break;
                }
               
                document.getElementById("speed_slider").removeAttribute("disabled");
                document.getElementById("node_number_input").removeAttribute("disabled");      
            }
        }, speed);

    } else {
        switch (alg) {
            case "bfs":
                document.getElementById("bfs_pld").innerHTML = "No possible path";
                document.getElementById("bfs_pln").innerHTML = "No possible path";
                break;
            case "dfs":
                document.getElementById("dfs_pld").innerHTML = "No possible path";
                document.getElementById("dfs_pln").innerHTML = "No possible path";
                break;
            case "ucs":
                document.getElementById("ucs_pld").innerHTML = "No possible path";
                document.getElementById("ucs_pln").innerHTML = "No possible path";
                break;
            case "dik":
                document.getElementById("dik_pld").innerHTML = "No possible path";
                document.getElementById("dik_pln").innerHTML = "No possible path";
                break;
            case "a":
                document.getElementById("a_pld").innerHTML = "No possible path";
                document.getElementById("a_pln").innerHTML = "No possible path";
                break;
            case "gbf":
                document.getElementById("gbf_pld").innerHTML = "No possible path";
                document.getElementById("gbf_pln").innerHTML = "No possible path";
                break;
        }
        setNotification("No possible path between the selected nodes.");
    }
    boardOut();
}

const highlightExploring = (explored, parents, goal, path, alg) => {

    switch (alg) {
        case "bfs":
            last_bfs = {
                solved: true,
                "explored": explored,
                "parents": parents,
                goal: goal,
                path: path
            }
            displayed = "bfs";
            break;
        case "dfs":
            last_dfs = {
                solved: true,
                "explored": explored,
                "parents": parents,
                goal: goal,
                path: path
            }
            displayed = "dfs";
            break;
        case "ucs":
            last_ucs = {
                solved: true,
                "explored": explored,
                "parents": parents,
                goal: goal,
                path: path
            }
            displayed = "ucs";
            break;
        case "dik":
            last_dik = {
                solved: true,
                "explored": explored,
                "parents": parents,
                goal: goal,
                path: path
            }
            displayed = "dik";
            break;
        case "a":
            last_a = {
                solved: true,
                "explored": explored,
                "parents": parents,
                goal: goal,
                path: path
            }
            displayed = "a";
            break;
        case "gbf":
            last_gbf = {
                solved: true,
                "explored": explored,
                "parents": parents,
                goal: goal,
                path: path
            }
            displayed = "gbf";
            break;
    }

    let i = 1;

    document.getElementById("speed_slider").setAttribute("disabled", "true");
    document.getElementById("node_number_input").setAttribute("disabled", "true");

    explored_interval = setInterval(() => {

        if (i < explored.length) {
            let node = explored[i];
            highlightArc(node, parents[node], "#0C7692", false);
            highlightNode(node, "#0C7692");
            i++;
        } else {
            let node = explored[i-1];
            highlightArc(node, goal, "#0C7692", false);
            clearInterval(explored_interval);
            switch (alg) {
                case "bfs":
                    document.getElementById("bfs_ne").innerHTML = explored.length;
                    break;
                case "dfs":
                    document.getElementById("dfs_ne").innerHTML = explored.length;
                    break;
                case "ucs":
                    document.getElementById("ucs_ne").innerHTML = explored.length;
                    break;
                case "dik":
                    document.getElementById("dik_ne").innerHTML = explored.length;
                    break;
                case "a":
                    document.getElementById("a_ne").innerHTML = explored.length;
                    break;
                case "gbf":
                    document.getElementById("gbf_ne").innerHTML = explored.length;
                    break;
            }
            document.getElementById("speed_slider").removeAttribute("disabled");
            document.getElementById("node_number_input").removeAttribute("disabled");
            highlightPath(path, alg);
        }
    }, speed * 2);
}

const highlightArc = (node1, node2, color, isPath) => {
    
    try {
        let id = "line_" + node1 + "_" + node2 + "_";
        let line = document.getElementById(id);
        line.setAttribute("stroke", color);
        if (isPath == true) {
            line.setAttribute("stroke-width", "8px");
            // remove line and newly add it to svg to display path in foreground
            //line.remove();
            //document.getElementById("base_svg").appendChild(line);
        }
    } catch {}

    try {
        let id = "line_" + node2 + "_" + node1 + "_";
        let line = document.getElementById(id);
        line.setAttribute("stroke", color);
        if (isPath == true) {
            line.setAttribute("stroke-width", "8px");
            // remove line and newly add it to svg to display path in foreground
            line.remove();
            document.getElementById("base_svg").appendChild(line);
        }
    } catch {}
    
}