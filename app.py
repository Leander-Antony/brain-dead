from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Connect to MongoDB
mongo_uri = os.getenv('MONGO_URI')
client = MongoClient(mongo_uri)
db = client['games']
data_collection = db['memory']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit_score', methods=['POST'])
def submit_score():
    data = request.get_json()
    player_name = data.get('player_name')
    score = data.get('score')

    # Insert the score into the database
    data_collection.insert_one({'player_name': player_name, 'score': score})

    # Fetch the top 10 leaderboard
    leaderboard = list(data_collection.find().sort("score", -1).limit(10))

    # Convert to JSON-friendly format
    leaderboard_data = [{'player_name': entry['player_name'], 'score': entry['score']} for entry in leaderboard]

    return jsonify({'leaderboard': leaderboard_data})

@app.route('/get-leaderboard', methods=['GET'])
def get_leaderboard():
    # Fetch the leaderboard from the database
    leaderboard = list(data_collection.find().sort("score", -1).limit(10))

    # Convert to JSON-friendly format
    leaderboard_data = [{'player_name': entry['player_name'], 'score': entry['score']} for entry in leaderboard]

    # Return the leaderboard as a JSON response
    return jsonify({'leaderboard': leaderboard_data})

if __name__ == '__main__':
    app.run(debug=True)
