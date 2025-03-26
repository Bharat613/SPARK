function getCoordinates(city) {
    const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`;
    return fetch(geoUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
            } else {
                return null;
            }
        });
}

function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in KM
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2); // Distance in KM
}

export function calculateDistance(city1, city2, speak, textDisplay) {
    Promise.all([getCoordinates(city1), getCoordinates(city2)])
        .then(results => {
            let coords1 = results[0];
            let coords2 = results[1];

            if (!coords1 || !coords2) {
                speak(`Sorry, I couldn't find one of the locations.`);
                return;
            }

            let distance = haversine(coords1.lat, coords1.lon, coords2.lat, coords2.lon);
            let distanceText = `The straight-line distance between ${city1} and ${city2} is approximately ${distance} kilometers.`;
            speak(distanceText);
            textDisplay.textContent = distanceText;
        })
        .catch(error => {
            console.error("Error fetching coordinates:", error);
            speak("There was an error fetching the location details.");
        });
}
