const find_neighbors = (node) => {
    
    let connections = []

    let arcs = document.querySelectorAll(".arc");
    arcs.forEach(arc => {
     
        let ids_in_arc = arc.id.match(/[0-9]+/g)

        if (ids_in_arc[0] == node) {
            connections.push(ids_in_arc[1]);
        } else {
            if (ids_in_arc[1] == node) {
                connections.push(ids_in_arc[0]);
            }
        }
    })

    return connections;

}

const shuffle = (array) => {
    var m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}