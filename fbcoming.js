document.addEventListener('DOMContentLoaded', function() {
    const footballList = document.getElementById('footballList');
    const leagueIds = ['4328', '4331', '4335', '4337'];
    const baseUrl = 'https://www.thesportsdb.com/api/v1/json/487407/eventsnextleague.php?id=';

    console.log('Script loaded, fetching football games...');

    function fetchLeagueData(leagueId) {
        return fetch(baseUrl + leagueId)
            .then(response => response.json())
            .then(data => data.events || [])
            .catch(error => {
                console.error(`Error fetching data for league ${leagueId}:`, error);
                return [];
            });
    }

    function isWithinNextTwoDays(dateString) {
        const eventDate = new Date(dateString);
        const now = new Date();
        const twoDaysFromNow = new Date(now.getTime() + (9 * 24 * 60 * 60 * 1000));
        return eventDate >= now && eventDate <= twoDaysFromNow;
    }

    Promise.all(leagueIds.map(fetchLeagueData))
        .then(results => {
            const allEvents = results.flat();
            console.log('Total events fetched:', allEvents.length);

            const filteredEvents = allEvents.filter(event => isWithinNextTwoDays(event.dateEvent));
            console.log('Events in next 2 days:', filteredEvents.length);

            if (filteredEvents.length > 0) {
                footballList.innerHTML = ''; // Clear existing content
                
                filteredEvents.sort((a, b) => new Date(a.dateEvent) - new Date(b.dateEvent));

                filteredEvents.forEach((event, index) => {
                    console.log(`Processing event ${index + 1}:`, event);
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
                        <span class="league-name">${event.strLeague}</span>
                    `;
                    
                    footballList.appendChild(listItem);
                    console.log(`Added event ${index + 1} to the list`);
                });
            } else {
                console.log('No upcoming football games found in the next 2 days');
                footballList.innerHTML = '<li>No upcoming football games in the next 2 days</li>';
            }
            console.log('Total items in footballList:', footballList.children.length);
        })
        .catch(error => {
            console.error('Error processing football games:', error);
            footballList.innerHTML = '<li>Error loading upcoming football games</li>';
        });


});