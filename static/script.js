const svg = d3.select("svg");

function calculate() {
    const activities = [
        { id: "A", duration: 3, predecessors: [] },
        { id: "B", duration: 2, predecessors: ["A"] },
        { id: "C", duration: 4, predecessors: ["A"] },
        { id: "D", duration: 2, predecessors: ["B", "C"] }
    ];

    fetch("/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activities })
    })
    .then(res => res.json())
    .then(drawDiagram);
}

function drawDiagram(data) {
    svg.selectAll("*").remove();

    const nodes = data.activities;

    const xScale = d3.scaleLinear()
        .domain([0, nodes.length - 1])
        .range([100, 700]);

    svg.selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => xScale(i))
        .attr("cy", 150)
        .attr("r", 30)
        .attr("fill", d => d.critical ? "#ff4d4d" : "#9fd3c7")
        .attr("stroke", "#000");

    svg.selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("x", (d, i) => xScale(i))
        .attr("y", 155)
        .attr("text-anchor", "middle")
        .text(d => d.id)
        .attr("font-size", "14px")
        .attr("font-weight", "bold");
}
