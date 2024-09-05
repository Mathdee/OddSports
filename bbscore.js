// DOM elements
var basketballList = document.getElementById('basketballList');

// Calls API
const API_KEY = "API_KEY"; // Replace with your actual API key
const API_URL = "https://www.thesportsdb.com/api/v2/json/livescore/Basketball";

// Function to create a game element
function createGameElement(game) {
    const homeTeam = game.teams.home.name;
    const awayTeam = game.teams.away.name;
    const homeScore = game.scores.home.total;
    const awayScore = game.scores.away.total;
    const gameStatus = game.status.long;

    const gameElement = document.createElement('li');
    gameElement.className = 'game-item';
    gameElement.innerHTML = `
        <span class="team home-team">${homeTeam} <img src="${game.teams.home.logo}" alt="${homeTeam} logo" class="team-logo"></span>
        <span class="score">${homeScore} - ${awayScore}</span>
        <span class="team away-team"><img src="${game.teams.away.logo}" alt="${awayTeam} logo" class="team-logo"> ${awayTeam}</span>
        <span class="game-status">${gameStatus}</span>
    `;
    return gameElement;
}

// Function to update the basketball scores
function updateBasketballScores(games) {
    basketballList.innerHTML = ''; // when refresh, content is cleared

    if (games.length === 0) {
        const noGameElement = document.createElement('li');
        noGameElement.textContent = "No Live Games";
        basketballList.appendChild(noGameElement);
        return;
    }

    games.forEach(game => {
        const gameElement = createGameElement(game);
        basketballList.appendChild(gameElement);
    });
}

// Fetches data from API
fetch(API_URL, {
    "method": "GET",
    "headers": {
        "x-rapidapi-host": "X_API_KEY",
        "x-rapidapi-key": API_KEY
    }
})
.then(response => response.json())
.then(data => {
    const gamesList = data.response || [];
    updateBasketballScores(gamesList);
})
.catch(err => {
    console.error("Error fetching data:", err);
    updateBasketballScores([]); // if can't fetch data, fill empty list
});