document.addEventListener("DOMContentLoaded", function() {
    let rightBox = document.getElementById("right");
    let leftBox = document.getElementById("left");
    let dropdownBtn = document.querySelector(".dropdown-btn");
    let dropdownContent = document.querySelector(".dropdown-content");
    const pickContainer = document.querySelector(".pick");
    const oddsResult = document.getElementById("odds-result");

    function closeAllDropdowns() {
        dropdownContent.classList.remove("show");
    }

    dropdownBtn.addEventListener("click", function(event) {
        event.stopPropagation();
        dropdownContent.classList.toggle("show");
    });

    dropdownContent.addEventListener("click", function(event) {
        event.preventDefault();
        
        if (event.target.tagName === 'A') {
            const selectedLeague = event.target.getAttribute('data-league');
            dropdownBtn.textContent = event.target.textContent;
            closeAllDropdowns();
            displayTeams(selectedLeague);
        }
    });

    // Lists of teams
    function displayTeams(league) {
        const leagueTeams = {
            "premier-league": [
                "Aston Villa F.C.", "Tottenham Hotspur F.C.", "Manchester United F.C.",
                "West Ham United F.C.", "Newcastle United F.C.", "Brighton & Hove Albion F.C.",
                "Wolverhampton Wanderers F.C.", "AFC Bournemouth", "Crystal Palace F.C.",
                "Nottingham Forest F.C.", "Luton Town F.C.", "Sheffield United F.C.",
                "Liverpool", "Manchester City", "Arsenal", "Chelsea", "Fulham",
                "Brentford", "Everton", "Burnley"
            ],
            "la-liga": [
                "FC Barcelona", "RC Celta de Vigo", "Rayo Vallecano", "Real Valladolid",
                "Villarreal CF", "Sevilla FC", "UD Las Palmas", "Atletico Madrid",
                "CA Osasuna", "RCD Mallorca", "Getafe CF", "Girona FC", "Athletic Bilbao",
                "Real Betis Seville", "CD Leganés", "Real Madrid", "Deportivo Alavés", "Valencia CF"
            ],
            "bundesliga": [
                "FC Bayern Munich", "VfL Bochum", "Borussia Dortmund", "Borussia Mönchengladbach",
                "SV Werder Bremen", "VfL Wolfsburg", "VfB Stuttgart", "1. FSV Mainz 05",
                "Bayer 04 Leverkusen", "SC Freiburg", "Eintracht Frankfurt", "TSG 1899 Hoffenheim",
                "1. FC Union Berlin", "FC Augsburg", "1. FC Heidenheim", "RB Leipzig"
            ],
            "eredivisie": [
                "Ajax Amsterdam", "Almere City FC", "AZ Alkmaar", "FC Groningen",
                "FC Twente Enschede", "FC Utrecht", "Feyenoord Rotterdam", "Fortuna Sittard",
                "Go Ahead Eagles", "Heracles Almelo", "N.E.C. Nijmegen", "NAC Breda",
                "PEC Zwolle", "PSV Eindhoven", "RKC Waalwijk", "SC Heerenveen",
                "Sparta Rotterdam", "Willem II Tilburg"
            ],
            "nba": [
                "Atlanta Hawks", "Boston Celtics", "Brooklyn Nets", "Charlotte Hornets",
                "Chicago Bulls", "Cleveland Cavaliers", "Dallas Mavericks", "Denver Nuggets",
                "Detroit Pistons", "Golden State Warriors", "Houston Rockets", "Indiana Pacers",
                "LA Clippers", "Los Angeles Lakers", "Memphis Grizzlies", "Miami Heat",
                "Milwaukee Bucks", "Minnesota Timberwolves", "New Orleans Pelicans",
                "New York Knicks", "Oklahoma City Thunder", "Orlando Magic", "Philadelphia 76ers",
                "Phoenix Suns", "Portland Trail Blazers", "Sacramento Kings", "San Antonio Spurs",
                "Toronto Raptors", "Utah Jazz", "Washington Wizards"
            ]
        };
    
        const teams = leagueTeams[league];
        
        if (!teams) {
            console.error("No teams found for league:", league);
            return;
        }
        
        pickContainer.innerHTML = "";

        teams.forEach((team, index) => {
            const teamDiv = document.createElement("div");
            teamDiv.className = "team";
            teamDiv.id = `team${index + 1}`;
            teamDiv.draggable = true;
            teamDiv.textContent = team;
            pickContainer.appendChild(teamDiv);
        });
        
        initializeDragAndDrop();
    }

    function initializeDragAndDrop() {
        let teams = document.getElementsByClassName("team");
        for (let team of teams) {
            team.addEventListener("dragstart", function(e) {
                e.dataTransfer.setData("text/plain", e.target.id);
            });
        }

        [rightBox, leftBox].forEach(box => {
            box.addEventListener("dragover", function(e) {
                e.preventDefault();
            });

            box.addEventListener("drop", function(e) {
                e.preventDefault();
                const data = e.dataTransfer.getData("text");
                const draggedElement = document.getElementById(data);
                if (draggedElement) {
                    this.innerHTML = '';
                    this.appendChild(draggedElement);
                    checkBoxesAndDisplayMessage();
                }
            });
        });
        
        // Removes team when double clicked on
        pickContainer.addEventListener("dblclick", function(e) {
            if (e.target.classList.contains("team")) {
                pickContainer.appendChild(e.target);
                checkBoxesAndDisplayMessage();
            }
        });
    }

    function checkBoxesAndDisplayMessage() {
        if (leftBox.textContent && rightBox.textContent) {
            const team1 = leftBox.textContent;
            const team2 = rightBox.textContent;
            
            fetch('http://localhost:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({team1, team2}),
            })
            .then(response => response.json())
            .then(data => {
                oddsResult.innerHTML = `
                    <p>${team1} win: ${(data.team1_win * 100).toFixed(2)}%</p>
                    <p>Draw: ${(data.draw * 100).toFixed(2)}%</p>
                    <p>${team2} win: ${(data.team2_win * 100).toFixed(2)}%</p>
                `;
            })
            .catch((error) => {
                console.error('Error:', error);
                oddsResult.textContent = "Error calculating odds";
            });
        } else {
            oddsResult.textContent = "";
        }
    }

    window.addEventListener("click", function(event) {
        if (!event.target.matches('.dropdown-btn')) {
            closeAllDropdowns();
        }
    });
});