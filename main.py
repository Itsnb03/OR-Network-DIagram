from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

# Example network (you will later make it dynamic)
activities = [
    {"id": "A", "duration": 3, "predecessors": []},
    {"id": "B", "duration": 2, "predecessors": ["A"]},
    {"id": "C", "duration": 4, "predecessors": ["A"]},
    {"id": "D", "duration": 2, "predecessors": ["B", "C"]},
]

def compute_network(activities):
    earliest = {}
    latest = {}

    # Step-1: Earliest Start Times
    for act in activities:
        if not act["predecessors"]:
            earliest[act["id"]] = 0
        else:
            earliest[act["id"]] = max(
                earliest[p] + next(a['duration'] for a in activities if a["id"] == p)
                for p in act["predecessors"]
            )

    # Step-2: Latest Times (backward pass)
    max_time = max(
        earliest[a["id"]] + a["duration"] for a in activities
    )
    for act in reversed(activities):
        if act["id"] not in latest:
            latest[act["id"]] = max_time - act["duration"]

        for p in act["predecessors"]:
            latest[p] = min(
                latest.get(p, float("inf")),
                latest[act["id"]] - next(a['duration'] for a in activities if a["id"] == p)
            )

    # Step-3: Critical Path
    critical = [
        a["id"] for a in activities
        if earliest[a["id"]] == latest[a["id"]]
    ]

    return {
        "earliest": earliest,
        "latest": latest,
        "critical_path": critical
    }


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/calculate", methods=["POST"])
def calculate():
    data = request.json
    result = compute_network(data["activities"])
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)