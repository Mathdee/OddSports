document.addEventListener("DOMContentLoaded", function() {
    // Function to fetch and display upcoming games for each sport
    function loadUpcomingGames() {
        // Example data to see position and is replaced by Fetched data through API
        const footballUpcoming = [
            { teamA: 'Team A', teamB: 'Team B', date: '2024-08-15' },
            { teamA: 'Team C', teamB: 'Team D', date: '2024-08-16' }
        ];
        const basketballUpcoming = [
            { teamA: 'Team X', teamB: 'Team Y', date: '2024-08-17' },
            { teamA: 'Team Z', teamB: 'Team W', date: '2024-08-18' }
        ];
        const cricketUpcoming = [
            { teamA: 'Team E', teamB: 'Team F', date: '2024-08-19' },
            { teamA: 'Team G', teamB: 'Team H', date: '2024-08-20' }
        ];

        // Displays upcoming games in respective dropdown lists
        displayUpcomingMatches('footballUpcomingList', footballUpcoming);
        displayUpcomingMatches('nbaUpcomingList', basketballUpcoming);
        displayUpcomingMatches('cricketUpcomingList', cricketUpcoming);
    }

    function displayUpcomingMatches(listId, matches) {
        const list = document.getElementById(listId);
        matches.forEach(match => {
            const listItem = document.createElement('li');
            listItem.textContent = `${match.teamA} vs ${match.teamB} on ${match.date}`;
            list.appendChild(listItem);
        });
    }

    // When page loads up so do the games, (they are called everytime page is refreshed)
    loadUpcomingGames();
});


document.addEventListener("DOMContentLoaded", function() {
    let lists = document.getElementsByClassName("team");
    let rightBox = document.getElementById("right");
    let leftBox = document.getElementById("left");
    let dropdownBtns = document.getElementsByClassName("dropdown-btn");


    function closeAllDropdowns() {
        let dropdownContents = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdownContents.length; i++) {
            dropdownContents[i].style.display = "none";
        }
    }

    // Close all dropdowns lists when page refreshes
    closeAllDropdowns();

    for (let team of lists) {
        team.addEventListener("dragstart", function(e) {
            let selected = e.target;

            rightBox.addEventListener("dragover", function(e) {
                e.preventDefault();
            });
            rightBox.addEventListener("drop", function(e) {
                if (rightBox.children.length === 0) {
                    rightBox.appendChild(selected);
                    selected = null;

                    rightBox.removeEventListener("dragover", dragOver);
                    rightBox.removeEventListener("drop", drop);
                }
            });

            leftBox.addEventListener("dragover", function(e) {
                e.preventDefault();
            });
            leftBox.addEventListener("drop", function(e) {
                if (leftBox.children.length === 0) {
                    leftBox.appendChild(selected);
                    selected = null;

                    leftBox.removeEventListener("dragover", dragOver);
                    leftBox.removeEventListener("drop", drop);
                }
            });
        });
    }

    leftBox.addEventListener("dblclick", function(e) {
        let item = e.target;
        if (item.classList.contains("team")) {
            item.parentNode.removeChild(item); 
            document.querySelector(".pick").appendChild(item); 
        }
    });

    rightBox.addEventListener("dblclick", function(e) {
        let item = e.target;
        if (item.classList.contains("team")) {
            item.parentNode.removeChild(item); 
            document.querySelector(".pick").appendChild(item); 
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    let dropdownBtns = document.getElementsByClassName("dropdown-btn");

    function closeAllDropdowns() {
        let dropdownContents = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdownContents.length; i++) {
            dropdownContents[i].style.display = "none";
        }
    }

    // Close all dropdowns lists when page refreshes
    closeAllDropdowns();

    // Event Listeners that allow the button to be reactive to clicks
    for (let i = 0; i < dropdownBtns.length; i++) {
        dropdownBtns[i].addEventListener("click", function(e) {
            e.stopPropagation();
            
            let dropdownContent = this.nextElementSibling;
            while (dropdownContent && !dropdownContent.classList.contains("dropdown-content")) {
                dropdownContent = dropdownContent.nextElementSibling;
            }

            if (dropdownContent) {

                // If dropdown open, closes it
                if (dropdownContent.style.display === "block") {
                    dropdownContent.style.display = "none";
                } else {
                    // If closed and clicked on, all other dropdown lists close 
                    closeAllDropdowns();
                    dropdownContent.style.display = "block";
                }
            } else {
            }
        });
    }

});
