export function getCurrentWeather(speak, textDisplay) {
    fetch("http://ip-api.com/json/")
        .then(response => response.json())
        .then(locationData => {
            if (locationData.status === "success") {
                const city = locationData.city;
                const apiKey = "e4d2848a1c8c2c8b13e32c5ae463abc6"; // Replace with your OpenWeather API Key
                const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

                fetch(weatherUrl)
                    .then(response => response.json())
                    .then(weatherData => {
                        if (weatherData.cod === 200) {
                            const temp = weatherData.main.temp;
                            const condition = weatherData.weather[0].description;
                            const weatherInfo = `The current weather in ${city} is ${temp}°C with ${condition}.`;
                            
                            textDisplay.textContent = weatherInfo;
                            speak(weatherInfo);
                        } else {
                            speak("Sorry, I couldn't retrieve the weather information.");
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching weather data:", error);
                        speak("Sorry, there was an error fetching the weather.");
                    });
            } else {
                speak("Unable to retrieve location. Please try again.");
            }
        })
        .catch(error => {
            console.error("Error fetching location:", error);
            speak("Sorry, there was an error fetching your location.");
        });
}
