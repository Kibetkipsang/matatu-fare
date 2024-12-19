// Fetch data from db.json and populate fareData and dropdowns
let fareData = {};

fetch('db.json')
    .then(response => response.json())
    .then(data => {
        fareData = data.fareData; // Store fetched fare data
        console.log('Fare Data:', fareData); // Log to check if fareData is populated correctly
        
        const locations = data.locations; // Locations from the fetched data
        const startDropdown = document.getElementById('start');
        const destinationDropdown = document.getElementById('destination');
        const intermediateDropdown = document.getElementById('intermediate');

        locations.forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;

            startDropdown.appendChild(option.cloneNode(true));
            destinationDropdown.appendChild(option.cloneNode(true));
            intermediateDropdown.appendChild(option.cloneNode(true));
        });
    })
    .catch(error => {
        console.error('Error fetching fare data:', error);
    });

// Event listener for fare calculation
document.getElementById('calculate').addEventListener('click', function () {
    const start = document.getElementById('start').value;
    const intermediate = document.getElementById('intermediate').value;
    const destination = document.getElementById('destination').value;

    if (!start || !destination || start === 'None' || destination === 'None') {
        alert('Select starting and destination points.');
        return;
    }

    let totalFare = 0;

    if (intermediate && intermediate !== 'None') {
        // Fare from start to intermediate
        const fare1 = fareData[start]?.[intermediate] || fareData[intermediate]?.[start];
        if (fare1 === undefined) {
            document.getElementById('result').textContent = `Fare information not available for ${start} to ${intermediate}.`;
            return;
        }
        totalFare += fare1;

        // Fare from intermediate to destination
        const fare2 = fareData[intermediate]?.[destination] || fareData[destination]?.[intermediate];
        if (fare2 === undefined) {
            document.getElementById('result').textContent = `Fare information not available for ${intermediate} to ${destination}.`;
            return;
        }
        totalFare += fare2;
    } else {
        // Direct fare from start to destination
        const fare = fareData[start]?.[destination] || fareData[destination]?.[start];
        if (fare === undefined) {
            document.getElementById('result').textContent = `Fare information not available for ${start} to ${destination}.`;
            return;
        }
        totalFare = fare;
    }

    // Display the total fare
    document.getElementById('result').textContent = `The total fare is KSh ${totalFare}.`;
});
