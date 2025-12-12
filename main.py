from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

activities = [
    {"id": "A", "duration": 3,"predecessors": []},
    
]