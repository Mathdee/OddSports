import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
import logging
import numpy as np

logging.basicConfig(level=logging.DEBUG)

# loads in csv file w/ data
try:
    matches = pd.read_csv("matches.csv")
    logging.info("Successfully loaded matches.csv")
except Exception as e:
    logging.error(f"Error loading matches.csv: {str(e)}")
    raise

# Feature engineering
matches["date"] = pd.to_datetime(matches["date"])
matches["target"] = (matches["result"] == "W").astype("int")

# Use LabelEncoder for categorical variables
le_venue = LabelEncoder() # Converts venue categories (e.g., 'Home', 'Away') into numbers.
le_team = LabelEncoder() # Converts team names (e.g., 'Team A', 'Team B') into numbers.
le_opponent = LabelEncoder() # Converts opponent names into numbers.

matches["venue_code"] = le_venue.fit_transform(matches["venue"])
matches["team_code"] = le_team.fit_transform(matches["team"])
matches["opponent_code"] = le_opponent.fit_transform(matches["opponent"])

matches["hour"] = pd.to_datetime(matches["time"]).dt.hour
matches["day_code"] = matches["date"].dt.dayofweek

# Define predictors
predictors = ["venue_code", "team_code", "opponent_code", "hour", "day_code"]

# trains model for accurate odds
rf = RandomForestClassifier(n_estimators=100, min_samples_split=10, random_state=1)
rf.fit(matches[predictors], matches["target"])

# Save the model and encoders
joblib.dump(rf, 'football_model.joblib')
joblib.dump(le_venue, 'le_venue.joblib')
joblib.dump(le_team, 'le_team.joblib')
joblib.dump(le_opponent, 'le_opponent.joblib')

def predict_match(team1, team2):
    try:
        model = joblib.load('football_model.joblib')
        le_venue = joblib.load('le_venue.joblib')
        le_team = joblib.load('le_team.joblib')
        le_opponent = joblib.load('le_opponent.joblib')
        
        team1_code = le_team.transform([team1])[0] if team1 in le_team.classes_ else -1
        team2_code = le_team.transform([team2])[0] if team2 in le_team.classes_ else -1
        
        if team1_code == -1 or team2_code == -1:
            logging.warning(f"No data found for {team1 if team1_code == -1 else team2}")
            return {
                "error": f"No data found for {team1 if team1_code == -1 else team2}"
            }
        
        # Predict for team1 at home
        home_prediction = model.predict_proba(np.array([[
            le_venue.transform(['Home'])[0],
            team1_code,
            team2_code,
        ]]))[0][1]  # Probability of team1 winning at home
        
        # Predict for team2 at home (reverse fixture)
        away_prediction = model.predict_proba(np.array([[
            le_venue.transform(['Home'])[0],
            team2_code,
            team1_code,
        ]]))[0][1]  # Probability of team2 winning at home
        
        # Calculate draw probability
        draw_prob = 1 - home_prediction - away_prediction
        
        # Makes sure % add up to 100
        total = home_prediction + away_prediction + draw_prob
        home_prediction /= total
        away_prediction /= total
        draw_prob /= total
        
        
        return {
            "team1_win": float(home_prediction),
            "team2_win": float(away_prediction),
            "draw": float(draw_prob)
        }
    except Exception as e:
        logging.error(f"Error in predict_match: {str(e)}")
        return {"error": str(e)}