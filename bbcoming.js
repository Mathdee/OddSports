document.addEventListener('DOMContentLoaded', function() {
    const nbaList = document.getElementById('nbaList');
    const apiUrl = 'https://www.thesportsdb.com/api/v1/json/API_KEY/eventsnextleague.php?id=4387';


    function isWithinNextTwoDays(dateString) {
        const eventDate = new Date(dateString);
        const now = new Date();
        const twoDaysFromNow = new Date(now.getTime() + (2 * 24 * 60 * 60 * 1000)); // shows games upcoming in 2 days max
        return eventDate >= now && eventDate <= twoDaysFromNow;
    }

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.events && data.events.length > 0) {
                const filteredEvents = data.events.filter(event => isWithinNextTwoDays(event.dateEvent));

                if (filteredEvents.length > 0) {
                    nbaList.innerHTML = ''; 
                    
                    filteredEvents.sort((a, b) => new Date(a.dateEvent) - new Date(b.dateEvent));

                    filteredEvents.forEach((event, index) => {
                        const listItem = document.createElement('li');
                        listItem.className = 'match-item';
                        
                        const date = new Date(event.dateEvent + 'T' + event.strTime);
                        const formattedDate = date.toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                        });
                        const formattedTime = date.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                        
                        listItem.innerHTML = `
                            <span class="match-date">${formattedDate}</span>
                            <span class="team home-team">${event.strHomeTeam}</span>
                            <span class="vs">vs</span>
                            <span class="team away-team">${event.strAwayTeam}</span>
                            <span class="match-time">${formattedTime}</span>
                        `;
                        
                        nbaList.appendChild(listItem);
                    });
                } else {
                    nbaList.innerHTML = '<li class="no-games">No games played soon</li>';
                }
            } else {
                nbaList.innerHTML = '<li class="no-games">No games played soon</li>';
            }
        })
        .catch(error => {
            console.error('Error fetching upcoming NBA games:', error);
            nbaList.innerHTML = '<li class="error-message">Error loading upcoming NBA games</li>';
        });

});