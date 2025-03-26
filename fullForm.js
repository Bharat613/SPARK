export function getFullForm(message, speak) {
    const words = message.split(" ");
    const abbreviation = words[words.length - 1].toUpperCase(); // Extract last word

    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${abbreviation}`)
        .then(response => response.json())
        .then(data => {
            console.log("Wikipedia API Response:", data);

            if (data.extract) {
                // Extract first sentence only
                let firstSentence = data.extract.split(".")[0];

                // If there is a parenthesis, take only the text before it
                if (firstSentence.includes("(")) {
                    firstSentence = firstSentence.split("(")[0].trim();
                }

                // Ensure we are not just repeating the abbreviation
                if (firstSentence.toUpperCase().includes(abbreviation)) {
                    firstSentence = firstSentence.replace(new RegExp(`\\b${abbreviation}\\b`, "gi"), "").trim();
                }

                if (firstSentence) {
                    speak(firstSentence);
                    return;
                }
            }
            speak("Sorry, I couldn't find the full form.");
        })
        .catch(error => {
            console.error("Error fetching full form:", error);
            speak("I am unable to fetch the full form right now.");
        });
}
