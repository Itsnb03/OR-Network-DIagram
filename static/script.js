async function calculate() {
    const activities = [
        { id: "A", duration: 3, predecessors: [] },
        { id: "B", duration: 2, predecessors: ["A"] },
        { id: "C", duration: 4, predecessors: ["A"] },
        { id: "D", duration: 2, predecessors: ["B", "C"] }
    ];

    const response = await fetch("/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activities })
    });

    const data = await response.json();
    drawDiagram(activities, data.critical_path);
}

function drawDiagram(activities, criticalPath) {
    const svg = d3.select("svg");
    svg.selectAll("*").remove();

    const nodes = activities.map((a, i) => ({
        id: a.id,
        x: 150 + i * 150,
        y: 200
    }));

    const links = [];
    activities.forEach(act => {
        act.predecessors.forEach(p => {
            links.push({ source: p, target: act.id });
        });
    });

    // Draw arrows
    svg.append("defs")
        .append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 25)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "#333");

    // Draw links
    svg.selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("x1", d => nodes.find(n => n.id === d.source).x)
        .attr("y1", d => nodes.find(n => n.id === d.source).y)
        .attr("x2", d => nodes.find(n => n.id === d.target).x)
        .attr("y2", d => nodes.find(n => n.id === d.target).y)
        .attr("stroke", "#333")
        .attr("stroke-width", 2)
        .attr("marker-end", "url(#arrow)");

    // Draw nodes
    const g = svg.selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("transform", d => `translate(${d.x}, ${d.y})`);

    g.append("circle")
        .attr("r", 25)
        .attr("fill", d =>
            criticalPath.includes(d.id) ? "#ff4d4d" : "#4da6ff"
        );

    g.append("text")
        .text(d => d.id)
        .attr("text-anchor", "middle")
        .attr("dy", 5)
        .attr("fill", "white")
        .style("font-size", "16px");
}
