document.addEventListener('DOMContentLoaded', function() {
    const pickContainer = document.querySelector('.pick');
    const leftBox = document.getElementById('left');
    const rightBox = document.getElementById('right');
    const oddsResult = document.getElementById('odds-result');

    function drag(ev) {
        ev.dataTransfer.setData("text", ev.target.textContent);
    }

    function allowDrop(ev) {
        ev.preventDefault();
    }

    function drop(ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        ev.target.textContent = data;
        
        checkBoxesAndDisplayMessage();
    }

    function checkBoxesAndDisplayMessage() {
        if (leftBox.textContent && rightBox.textContent) {
            oddsResult.textContent = "This section has not been worked on yet!!!";
        } else {
            oddsResult.textContent = "";
        }
    }

    // Event Listeners
    document.querySelector('.dropdown-btn').addEventListener('click', function() {
        this.nextElementSibling.classList.toggle('show');
    });

    document.querySelectorAll('.dropdown-content a').forEach(a => {
        a.addEventListener('click', function(e) {
            e.preventDefault();
            displayTeams(this.getAttribute('data-league'));
        });
    });

    leftBox.addEventListener('dragover', allowDrop);
    leftBox.addEventListener('drop', drop);
    rightBox.addEventListener('dragover', allowDrop);
    rightBox.addEventListener('drop', drop);

    function displayTeams(league) {
        // Simulated team data (replace with actual API call)
        const teams = ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'];
        
        pickContainer.innerHTML = '';
        teams.forEach(team => {
            const teamDiv = document.createElement('div');
            teamDiv.className = 'team';
            teamDiv.draggable = true;
            teamDiv.textContent = team;
            teamDiv.addEventListener('dragstart', drag);
            pickContainer.appendChild(teamDiv);
        });
    }
});