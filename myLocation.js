export function getMyLocation(speak, textDisplay) {
    fetch("http://ip-api.com/json/")
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                const locationInfo = `You are in ${data.city}, ${data.regionName}, ${data.country}.`; 
                textDisplay.textContent = locationInfo;
                speak(locationInfo);
            } else {
                textDisplay.textContent = "Unable to retrieve location.";
                speak("Unable to retrieve location.");
            }
        })
        .catch(error => {
            console.error("Error fetching location:", error);
            textDisplay.textContent = "Error fetching location.";
            speak("Error fetching location.");
        });
}
