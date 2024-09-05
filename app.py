# Import necessary tools for our web application
from flask import Flask, request, jsonify
from flask_cors import CORS
from prediction import predict_match
import logging

# Create a web application
app = Flask(__name__)

# Allow our web app to be accessed from any website
CORS(app, resources={r"/predict": {"origins": "*"}})

# Set up logging to help us track what's happening in our app
logging.basicConfig(level=logging.DEBUG)

# Define what happens when someone sends a request to our '/predict' page
@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    # Handle initial request from browser
    if request.method == "OPTIONS":
        return {"message": "OK"}, 200
    
    # Get the team names from the request
    data = request.json
    team1 = data.get('team1')
    team2 = data.get('team2')
    
    # Log that we received a prediction request
    logging.info(f"Received prediction request for teams: {team1} vs {team2}")
    
    # Check if we have both team names
    if not team1 or not team2:
        logging.warning("Missing team names in request")
        return jsonify({"error": "Both team1 and team2 are required"}), 400
    
    # Use our prediction model to predict the match outcome
    result = predict_match(team1, team2)
    
    # If there was an error in prediction, return the error
    if "error" in result:
        logging.warning(f"Error in prediction: {result['error']}")
        return jsonify(result), 404
    
    # Log that the prediction was successful
    logging.info(f"Prediction successful: {result}")
    
    # Return the prediction result
    return jsonify(result)

# If this file is run directly, start the web application
if __name__ == '__main__':
    app.run(debug=True)