export function tellMeAFact(speak, textDisplay) {
    const factUrl = "https://uselessfacts.jsph.pl/random.json?language=en";

    fetch(factUrl)
        .then(response => response.json())
        .then(data => {
            if (data.text) {
                let fact = data.text;
                speak(fact);
                textDisplay.textContent = fact;
            } else {
                speak("Sorry, I couldn't fetch a fact right now.");
            }
        })
        .catch(error => {
            console.error("Fact API Error:", error);
            speak("Sorry, there was an error fetching a fact.");
        });
}
