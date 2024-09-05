// DOM elements
var footballList = document.getElementById('footballList');

// Function to create a match element
function createMatchElement(match) {
    const homeTeam = match.teams.home;
    const awayTeam = match.teams.away;
    const homeScore = match.goals.home;
    const awayScore = match.goals.away;
    const elapsedTime = match.fixture.status.elapsed;

    // Data that will be taken from API and displayed on website
    const matchElement = document.createElement('li');
    matchElement.className = 'match-item';
    matchElement.innerHTML = `
        <span class="team home-team">${homeTeam.name} <img src="${homeTeam.logo}" alt="${homeTeam.name} logo" class="team-logo"></span>
        <span class="score">${homeScore} - ${awayScore}</span>
        <span class="team away-team"><img src="${awayTeam.logo}" alt="${awayTeam.name} logo" class="team-logo"> ${awayTeam.name}</span>
        <span class="elapsed-time">${elapsedTime}'</span>
    `;
    return matchElement;
}

// Function to update the football scores
function updateFootballScores(matches) {
    footballList.innerHTML = ''; // Clear existing content when refreshing

    if (matches.length === 0) {
        const noMatchElement = document.createElement('li');
        noMatchElement.textContent = "No Live Matches";
        footballList.appendChild(noMatchElement);
        return;
    }

    matches.forEach(match => {
        const matchElement = createMatchElement(match);
        footballList.appendChild(matchElement);
    });
}

// Fetches data from API
fetch("https://v3.football.api-sports.io/fixtures?live=all", {
    "method": "GET",
    "headers": {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": "API_key"
    }
})
.then(response => response.json())
.then(data => {
    const matchesList = data.response;
    updateFootballScores(matchesList);
})
.catch(err => {
    console.error("Error fetching data:", err);
    updateFootballScores([]); // if can't fetch data, fill empty list
});