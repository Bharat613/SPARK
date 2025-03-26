export function getPlaceLocation(place, speak, textDisplay) {
    place = place.replace(/[.,!?]$/, "").trim().toLowerCase();

    if (place === "") {
        speak("Please specify a place to search for.");
        return;
    }

    const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                let location = data[0];
                let addressParts = location.display_name.split(", "); // Split address components

                let mainLocation = addressParts[0]; // Landmark name (e.g., "Taj Mahal")
                let country = addressParts[addressParts.length - 1]; // Always the last part is country

                // Find the city name (usually before the country)
                let city = "";
                for (let i = addressParts.length - 2; i >= 0; i--) {
                    if (!/^\d+$/.test(addressParts[i]) && addressParts[i].length > 2) { 
                        city = addressParts[i]; 
                        break; 
                    }
                }

                // Construct response
                let locationText = city ? `${mainLocation}, ${city}, ${country}.` : `${mainLocation}, ${country}.`;

                speak(locationText);
                textDisplay.textContent = locationText;
            } else {
                speak(`Sorry, I couldn't find the location of ${place}.`);
            }
        })
        .catch(error => {
            console.error("Location API Error:", error);
            speak("Sorry, there was an error fetching the location.");
        });
}
