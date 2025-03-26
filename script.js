import { calculateDistance } from "./distBetween.js";
import { tellMeAFact } from "./tellMeFact.js";
import { getPlaceLocation } from "./placeLocation.js";
import { getMyLocation } from "./myLocation.js";
import { getCurrentWeather } from "./myWeather.js";
import { getFullForm } from "./fullForm.js";
import { calculateAge } from "./ageCal.js";




const btn = document.querySelector('input');
// const content = document.querySelector('.content');
const textDisplay = document.getElementById('text-display');

const hamburgerIcon = document.getElementById("hamburgerIcon");
const questionsContainer = document.getElementById("questionsContainer");
const questionsList = document.getElementById("questionsList");
let openedTab = null; // Store reference to opened tab
let isRepeating = false; 


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.interimResults = false;
recognition.lang = "en-US";

let isListen = false;
let isRecognizing = false; // Track recognition state
let voicesLoaded = false;

function speak(text) {
    console.log(text);
    recognition.stop(); // Stop recognition while speaking
    isRecognizing = false;
    window.speechSynthesis.cancel();
    textDisplay.textContent = text;
    
    const text_speak = new SpeechSynthesisUtterance(text);
    let voices = window.speechSynthesis.getVoices();
    text_speak.voice = voices.find(voice => voice.name.includes("Mark")) || voices[0];

    text_speak.rate = 1.0;
    text_speak.volume = 1.0;
    text_speak.pitch = 0.7;
    text_speak.onstart = () => {
        console.log("Speech started, mic is paused.");
        isListen = false;
    };
    window.speechSynthesis.speak(text_speak);

    text_speak.onend = () => {
        console.log("Speech finished");
isListen = true;
        // Restart recognition only if isListen is true
        // if (isListen) {
        //     setTimeout(() => startRecognition(), 0);
        // }
        startRecognition();
    };

    text_speak.onerror = (event) => {
        console.error("Speech synthesis error:", event);
    };
}

function speakNonListen(text) {
    console.log(text);
    recognition.stop(); // Stop recognition
    isRecognizing = false;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = window.speechSynthesis.getVoices().find(voice => voice.name.includes("David")) || null;
    utterance.rate = 1.2;
    utterance.volume = 1.0;
    utterance.pitch = 0.7;

    utterance.onend = () => console.log("Speech finished, mic remains off.");

    window.speechSynthesis.speak(utterance);
}



// Function to safely start recognition
function startRecognition() {
    if (!isRecognizing) {
        recognition.start();
        isRecognizing = true;
    }
}

// Function to safely stop recognition
function stopRecognition() {
    recognition.stop();
    isRecognizing = false;
}

recognition.onstart = () => {
    isRecognizing = true;
};

recognition.onend = () => {
    isRecognizing = false;
    if (isListen) {
        setTimeout(() => startRecognition(), 500); // Restart only if listening mode is ON
    }
};

// recognition.onresult = (event) => {
//     const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
//     console.log("Heard:", transcript);

//     if (!isListen && transcript.includes("hello")) {
//         isListen = true;
//         speak("I'm listening now.");
//     } else if (isListen) {
//         if (transcript.includes("stop responding")) {
//             isListen = false;
//             speakNonListen("Okay, I will stop responding.");
//             setTimeout(() => { recognition.start()
                
//             }, 5000);
//             return;
//         }
//         else if(transcript.includes('stop listening')||transcript.includes('shut down')||transcript.includes('shut down.')||transcript.includes('shutdown.')||transcript.includes('shutdown')||transcript.includes('turn off your mic')||transcript.includes('don\'t listen')){
//             isListen = false;
//             speakNonListen('ok! i will stop listening');
//             return;
//         }

//         takeCommand(transcript);
//     }
// };

 // Track repeating state
 recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
    console.log("Heard:", transcript);

    if (!isListen && transcript.includes("hello")) {
        isListen = true;
        speak("Hello!");
    } 
    else if (isListen) {
        if (transcript.includes("stop responding")) {
            isListen = false;
            speakNonListen("Okay, I will stop responding.");
            setTimeout(() => {
                recognition.start();
            }, 5000);
            return;
        }
        else if (transcript.includes("stop listening") || transcript.includes("shut down") || 
                 transcript.includes("turn off your mic") || transcript.includes("don't listen")) {
            isListen = false;
            recognition.stop(); 
            speakNonListen("Okay! I will stop listening permanently.");
            return;
        }
        else if (transcript.includes("repeat the sentence")) {
            isRepeating = true;
            speak("Okay, say something and I will repeat it.");
            return;
        }
        else if (transcript.includes("stop repeating")) {
            isRepeating = false;
            speak("Okay, I will stop repeating.");
            return;
        }

        if (isRepeating) {
            console.log("Repeating:", transcript);
            speak(transcript); // Repeat the spoken sentence
        } else {
            takeCommand(transcript); // Handle other commands
        }
    }
};

window.addEventListener('load', () => {
    textDisplay.innerHTML = 'I am Spark say &nbsp;<span style="color:blue;font-weight:bold;font-size:20px;">HELLO</span>&nbsp; to activate me';

    const silentUtterance = new SpeechSynthesisUtterance("");
    window.speechSynthesis.speak(silentUtterance);
});

window.speechSynthesis.onvoiceschanged = () => {
    voicesLoaded = true;
    console.log("Voices loaded");
    
    setTimeout(() => {
        // speak("I am Spark. How can I help you?");
        startRecognition();
    }, 500);
};


// -------------------------------------------//hamburger Menu ----------------------------------------------------------------//

// Array to store questions
let questionsAsked = [];



//  Function to add a question to the list
function addQuestionToList(question) {
    questionsAsked.push(question);
    const li = document.createElement("li");
    li.textContent = question;
    questionsList.appendChild(li);
}

// Event listener for the hamburger icon
hamburgerIcon.addEventListener("click", () => {
    questionsContainer.classList.toggle("open"); // Show/hide the questions container
});


function wishMe() {
    var day = new Date();
    var hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Boss..");
    } else {
        speak("Good Evening Boss..");
    }
}



function takeCommand(message) {
    addQuestionToList(message);  // adding questions to the history
    message = message.replace(/[.,!?]$/, "").trim().toLowerCase();
    console.log(message);
    if (message.includes('open camera')) {
        const isWindows = navigator.userAgent.toLowerCase().includes("windows") || navigator.platform.toLowerCase().includes("win");
    
        if (isWindows) {
            speak('Opening camera.');
            window.location.href = 'microsoft.windows.camera:'; // Open Windows system camera
        } else {
            speak('Sorry boss, I don\'t have access.');
        }
    }
    else if (/tell me about your (developer|creator|boss)/i.test(message)) {
        speak("He never said to me also");
    }
    
    else if(message.includes('good morning') || message.includes('good afternoon') || message.includes('good evening') ){
        wishMe();
    } 
    else if(message.includes('excellent')||message.includes('good')||message.includes('marvelous')){
        speak('thank you for your appreciation..');
    }
    else if(message.includes('who is shiva')){
        speak('my developer..');
    }
    
    else if(message.includes('are you listening')){
        speak('yes I am listening but i am suffering with slow internet');
    }
    else if (message.toLowerCase().includes("tell me a fact")) {
        tellMeAFact(speak, textDisplay);
    }
    

    else if (message.toLowerCase().includes("distance between")) {
        let places = message.replace("distance between", "").trim();
        let cityNames = places.split(" and ");
    
        if (cityNames.length !== 2) {
            speak("Please specify two cities to calculate the distance.");
            return;
        }
    
        let city1 = cityNames[0].trim();
        let city2 = cityNames[1].trim();
    
        // Call the separate function from DistBetween.js
        calculateDistance(city1, city2, speak, textDisplay);
    }
    
    else if (message.toLowerCase().startsWith("where is ")) {
        let place = message.replace("where is ", "").trim();
        getPlaceLocation(place, speak, textDisplay);
    }
    
    
    
    else if (message.toLowerCase().includes("my location") || message.toLowerCase().includes("ip location")) {
        getMyLocation(speak, textDisplay);
    }
    
    else if (message.toLowerCase().trim() === "current weather") {
        getCurrentWeather(speak, textDisplay);
    }
    
else if (message.toLowerCase().trim() === "give me the location of ip address") {
    // Stop listening before showing input
    isListen = false;
    stopRecognition();
    
    speakNonListen("Please enter the IP address in the box.");

    // Get elements
    const ipInput = document.getElementById("ipInput");
    const submitButton = document.getElementById("submitIp");

    // Show input box and submit button
    ipInput.style.display = "inline-block";
    submitButton.style.display = "inline-block";

    // When user clicks submit, process the IP
    submitButton.onclick = () => {
        let ip = ipInput.value.trim();

        if (!ip) {
            speakNonListen("No IP address provided.");
            return;
        }

        const url = `http://ip-api.com/json/${ip}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    const locationInfo = `The IP ${ip} is located in ${data.city}, ${data.regionName}, ${data.country}.`;
                    console.log(locationInfo);
                    document.getElementById("textDisplay").textContent = locationInfo;
                    speak(locationInfo);
                } else {
                    speakNonListen(`Unable to retrieve location for the IP ${ip}.`);
                }
            })
            .catch(error => {
                console.error("Error fetching location:", error);
                speakNonListen("Error fetching location.");
            });

        // Hide input box and button after submission
        ipInput.style.display = "none";
        submitButton.style.display = "none";
        ipInput.value = ""; // Clear input field

        // Restart recognition after input is submitted
        isListen = true;
        startRecognition();
    };
}
else if (message.includes("give me about")) {
    let topic = message.replace("give me about", "").trim(); // Extract the topic

    if (topic) {
        const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.extract) {
                    const info = data.extract;
                    speak("Here is the matter.");  // Only speaks a short confirmation
                    textDisplay.textContent = info;  // Displays the full information
                } else {
                    const errorMessage = "Sorry, I couldn't find information on that topic.";
                    speak(errorMessage);
                    textDisplay.textContent = errorMessage;
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                const errorMessage = "There was an error retrieving the information.";
                speak(errorMessage);
                textDisplay.textContent = errorMessage;
            });

    } else {
        const errorMessage = "Please specify a topic after 'give me about'.";
        speak(errorMessage);
        textDisplay.textContent = errorMessage;
    }
}


else if (message.includes("full form of")) {
    getFullForm(message, speak);
}

else if (message.startsWith("play song")) {
    let songName = message.replace("play song", "").trim();
    if (songName) {
        speakNonListen(`Searching for ${songName}.`);

        recognition.stop();
        isRecognizing = false;
        isListen = false;

        fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(songName)}&bitrate=320`)
            .then(response => response.json())
            .then(data => {
                console.log("API Response:", data);

                if (data.success && data.data?.results?.length > 0) {
                    const songResult = data.data.results[0];

                    let mp3Url = songResult.downloadUrl?.[2]?.url || 
                                 songResult.downloadUrl?.[1]?.url || 
                                 songResult.downloadUrl?.[0]?.url || 
                                 songResult.url;
                    
                    console.log("MP3 URL:", mp3Url);

                    if (mp3Url) {
                        
                        speakNonListen(`Playing ${songName}.`);
                        textDisplay.innerHTML = '<div style="display: inline-block; text-align: center;"><span style="font-size: 15px;">Click anywhere on the screen to&nbsp;</span> <span style="color: red; font-size: 17px; font-weight: bold;">STOP&nbsp;</span> <span style="font-size: 15px; font-weight: bold;">playing</span></div>';

                        

                        let audio = document.getElementById("audioPlayer");
                        if (!audio) {
                            audio = document.createElement("audio");
                            audio.id = "audioPlayer";
                            document.body.appendChild(audio);
                        }

                        audio.src = mp3Url;
                        audio.autoplay = true;
                        audio.preload = "auto"; // Preload for smoother playback
                        audio.volume = 1.0; // Max volume

                        audio.onplaying = () => console.log("Song started, mic is off.");
                        audio.onended = () => { 
                            console.log("Song finished");
                            isListen = true;
                            startRecognition();
                        };

                        audio.onerror = (event) => {
                            console.error("Audio error:", event);
                            speakNonListen("Sorry, there was an error playing the song.");
                            isListen = true;
                            startRecognition();
                        };

                        // Stop song and restart recognition on screen click
                        const stopSong = () => {
                            if (!audio.paused) {
                                audio.pause();
                                audio.currentTime = 0;
                                console.log("Song stopped, restarting mic.");
                                isListen = true;
                                startRecognition();
                                document.removeEventListener("click", stopSong);
                            }
                        };
                        document.addEventListener("click", stopSong);
                    } else {
                        speakNonListen("Sorry, no valid MP3 URL found for that song.");
                        isListen = true;
                        startRecognition();
                    }
                } else {
                    speakNonListen("Sorry, I couldn’t find that song.");
                    isListen = true;
                    startRecognition();
                }
            })
            .catch(error => {
                console.error("Fetch error:", error);
                speakNonListen("There was an error finding the song.");
                isListen = true;
                startRecognition();
            });
    } else {
        speakNonListen("Please specify a song name.");
    }
}



else if (message.includes("who are you") || message.includes("introduce yourself")) {
    speak("I am your voice assistant. I can help you with information, answer questions, and assist with tasks. Just ask me anything!");
}

else if(message.includes('where are you')){
    speak('Hello boss! I am here.. I can see you.');
}
else if(message.includes('how old are you')){
    speak('I don\'t know.. ask my developer shiva');
}
else if (message.includes('calculator')) {
    window.open('https://bharat613.github.io/Digital-Calculator/');
    const finalText = "Opening Calculator";
    speak(finalText);
}

    else if (message.startsWith("open ")) {
        const siteName = message.replace("open ", "").trim(); // Extract website name
        const url = `https://${siteName}.com`; // Construct the URL
        
        speak(`Opening ${siteName}...`);
        openedTab = window.open(url, "_blank"); // Store the opened tab reference
    }
    
    else if (message.includes("go back")) {  
        if (openedTab && !openedTab.closed) {  
            speak("going back...");
            openedTab.close(); // Close the newly opened tab
            openedTab = null; // Reset reference
        } else {
            speak("We are at home only... Otherwise, the browser is restricting me from going back.");
        }
    }
    
    
    else if(message.includes("how are you")){
        speak("I am fine what about you");
    }
    else if (message.includes("my age")) {
        calculateAge(message, speak);
    }
    
    else if (message.toLowerCase().startsWith("calculate")) {  
        try {  
            let expression = message.replace("calculate", "").trim() // Remove 'calculate'
                .replace(/times|into|x/gi, '*')  // Replace multiplication words
                .replace(/power|to the power of|\^/gi, '**') // Replace exponentiation words
                .replace(/square/gi, '**2')
                .replace(/modulus|mod/gi, '%'); // Support modulus
    
            let result = eval(expression);  
            
            if (!isNaN(result)) {
                speak(result.toString());  // Speak only the result
                console.log("Calculated result:", result);
            } else {
                speak("Sorry, I couldn't calculate that.");
            }
        } catch (error) {  
            speak("Sorry, I couldn't calculate that.");  
            console.error("Calculation Error:", error);
        }  
    }
    
    
    
    // else if (message.includes('hey') || message.includes('hello')) {  // Wishing Vexon    1
    //     speak("Hello Sir, How May I Help You?");
    // } 
    else if (message.includes('wish my friend')) {
        
        const name = message.split('wish my friend ')[1].trim();
        
        // Check if a name was provided
        if (name) {
            const wishMessage = `hello  ${name}.. How are you... gald to meet you..`;
            speak(wishMessage);
            textDisplay.textContent = wishMessage;
        } else {
            const errorMessage = "Please provide a name after 'wish my friend'.";
            speak(errorMessage);
            textDisplay.textContent = errorMessage;
        }
    }
    else if (message.includes('define')) { // Definition of a word
        let word = message.replace(/define/g, "").trim(); // Remove 'define'
        
        // Remove trailing punctuation like .,!? (especially the period Edge adds)
        word = word.replace(/[.,!?]$/, "").trim().toLowerCase();
    
        if (word.length === 0) {
            speak("Please specify a word to define.");
            return;
        }
    
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Definition not found");
                }
                return response.json();
            })
            .then(data => {
                const definition = data[0].meanings[0].definitions[0].definition;
                speak(`${word} is ${definition}`);
            })
            .catch(error => {
                console.error(error);
                speak("Sorry, I couldn't find the definition.");
            });
    }
    
    
    else if (message.includes('spelling of')) {                 // spelling of the word         6
        const word = message.replace('spelling of', '').trim();
        const spelledWord = word.split('').join(' ');
        speak(`${spelledWord}`);
    }
    else if (message.includes('today date') || message.includes("what's the date")) {  
        const today = new Date().toLocaleDateString('en-us', {  
            weekday: 'long',  
            year: 'numeric',  
            month: 'long',  
            day: 'numeric'  
        });  
        speak(`Today's date is ${today}`);  
    }  
    else if (message.includes('today day')) {   // Responds with the day name  
        const day = new Date().toLocaleString('en-us', { weekday: 'long' });  
        speak(`Today is ${day}`);  
    }
    

    else if(message.includes('your boss') || message.includes('who created you') || message.includes('developed')){      // developer name   8
        speak('SHIVA...');
    }

    else if (message.includes('internet speed')) {                              // internet speed    9
        // Checking the network speed
        if (navigator.connection) {
            const speed = navigator.connection.downlink;
            const speedMessage = `Your current internet speed is approximately ${speed} Mbps.`;6
            speak(speedMessage);
        } else {
            speak("Sorry, I can't determine the internet speed on this device.");
        }
    }
    
    
  
else if(message.includes('your name') || message.includes('what is your name')){                        // its name
    speak('My name is Spark ..');
}
else if (message.includes('time')) {                                                                           // time
    const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
    const finalText = "The current time is " + time;
    speak(finalText);
} else if (message.includes('today date')) {                                                                        // to
    const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
    const finalText = "Today's date is " + date;
    speak(finalText);
}
else if (message.startsWith('what is ') || message.startsWith('what are ')) {  
    let query = message.replace(/^what (is|are) /, '').trim();  // Remove "what is " or "what are "
    query = query.replace(/[.,!?]$/, "").trim().toLowerCase(); // Remove punctuation
    query = query.replace('the ', '').trim();  // Remove "the" for better searching

    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;

    fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
            if (data.query.search.length === 0) {
                speak(`I couldn't find information on ${query}.`);
                return;
            }

            const bestMatchTitle = data.query.search[0].title; // Get the best match

            const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(bestMatchTitle)}`;

            fetch(summaryUrl)
                .then(response => response.json())
                .then(summaryData => {
                    if (summaryData.extract) {
                        const firstSentence = summaryData.extract.split(". ")[0] + ".";
                        speak(firstSentence);
                    } else {
                        speak("Sorry, I couldn't find any information on that.");
                    }
                })
                .catch(error => {
                    speak("Sorry, there was an error fetching the information.");
                    console.error(error);
                });
        })
        .catch(error => {
            speak("Sorry, I couldn't connect to Wikipedia.");
            console.error(error);
        });
}


else if (message.startsWith("who is") || message.startsWith("who are")) {
    let query = message.replace(/who is|who are/i, "").trim();
    query = query.replace(/[.,!?]$/, "").trim().toLowerCase(); 
    if (query.length === 0) {
        speak("Can you be more specific?");
        return;
    }

    console.log("Searching for:", query);

    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            if (data.extract) {
                console.log("Wikipedia Response:", data.extract);
                speak(data.extract.length > 300 ? data.extract.substring(0, 300) + "..." : data.extract);
            } else {
                console.log("No data found for:", query);
                speak("I couldn't find information on " + query);
            }
        })
        .catch(error => {
            console.error("Error fetching Wikipedia:", error);
            speak("Sorry, I couldn't fetch the information.");
        });
}


 // Getting images from the internet
else if (message.startsWith('images of ') || message.startsWith('pictures of ')) {
    // Extract the keyword from the message
    const query = message.replace(/^(images of |pictures of )/, '').trim(); // Remove "images of" or "pictures of"
    const accessKey = "vc2rrU2FW9_l5DqcN6wIEAogduPwY9x8LeEgfKIH6SI"; // Replace with your Unsplash API key

    const textDisplay = document.getElementById('text-display');
    textDisplay.innerHTML = ""; // Clear previous content

    // Create a container div for grid layout
    const gridContainer = document.createElement("div");
    gridContainer.style = `
        display: grid;
        grid-template-columns: repeat(2, 1fr); /* Two images per row */
        gap: 10px; /* Space between images */
        justify-content: center;
        padding: 10px;
    `;

    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${accessKey}&per_page=6`; // Fetch 6 images

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.results.length > 0) {
          data.results.forEach(image => {
            // Create an anchor tag to wrap the image
            const link = document.createElement("a");
            link.href = image.links.html; // Link to Unsplash image page
            link.target = "_blank"; // Open in new tab
            link.style = "text-decoration: none;";

            // Create an image element
            const imgElement = document.createElement("img");
            imgElement.src = image.urls.small;
            imgElement.alt = query;
            imgElement.style = "width: 100%; max-width: 300px; border-radius: 10px; display: block;";

            link.appendChild(imgElement); // Add image inside link

            const imgWrapper = document.createElement("div");
            imgWrapper.appendChild(link);

            gridContainer.appendChild(imgWrapper); // Add image container inside grid
          });

          textDisplay.appendChild(gridContainer); // Add grid to display area
        } else {
          textDisplay.innerHTML = `<p>Sorry, I couldn't find any pictures of ${query}</p>`;
        }
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
        textDisplay.innerHTML = `<p>Sorry, there was an error fetching the images.</p>`;
      });
}




else if (message.includes('weight')) {
        let weightMatch = message.match(/\d+/); // Extract weight from the message
    
        if (weightMatch) {
            let weight = parseInt(weightMatch[0]); // Convert extracted number to integer
            let height = Math.sqrt((weight / 22.5)) * 100; // Approximate height calculation (BMI ~ 22.5)
    
            speak(`Based on your weight of ${weight} kg, your approximate height could be around ${height.toFixed(2)} cm.`);
        } else {
            speak("Please specify your weight in kilograms.");
        }
    }


    

    
    else if (message.includes('weather') || message.includes('report') || message.includes('temperature') || message.includes('forecast')) {
        const words = message.split(' ');
    const city = words[words.length - 1];

        const apiKey = 'e4d2848a1c8c2c8b13e32c5ae463abc6';  // Updated API key
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`; // Weather API endpoint
    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    const weatherDescription = data.weather[0].description;
                    const temperature = data.main.temp;
                    const humidity = data.main.humidity;
                    const windSpeed = data.wind.speed;
    
                    const report = `The current weather in ${city} is ${weatherDescription}. The temperature is ${temperature}°C with a humidity of ${humidity}% and wind speed of ${windSpeed} meter per second.`;
                    
                    speak(report);  
                    
                } else {

                    speak("Sorry, I couldn't fetch the weather data.");
                    
                }
            })
            .catch(error => {
                speak("Sorry, there was an error fetching the weather data.");
                console.error(error);
            });
    }
    
   else if (message.includes('thank you')) {
    speak("You're welcome!");
}
else if(message.includes('i love you')){
    speak('Sorry Boss, I am not a Human... i am developed to resolve your queries');
}
else if(message.includes('have feelings')){
    speak('I don\'t have feelings... but i understand your feelings')
}
else {
    speak("I am not trained up to that level. please read the manual..");
}


}


// for text textCommand

//For manual information
document.getElementById("manual-btn").addEventListener("click", function() {
    document.getElementById("manual-container").style.display = "block";
});

document.getElementById("close-manual").addEventListener("click", function() {
    document.getElementById("manual-container").style.display = "none";
});


// Disable right-click
document.addEventListener('contextmenu', event => event.preventDefault());

// Disable common DevTools shortcuts
document.addEventListener('keydown', event => {
    if (
        event.ctrlKey && (event.key === 'u' || event.key === 's' || event.key === 'i' || event.key === 'j' || event.key === 'c') || 
        event.key === 'F12' || 
        (event.ctrlKey && event.shiftKey && event.key === 'I') ||
        (event.ctrlKey && event.shiftKey && event.key === 'J')
    ) {
        event.preventDefault();
    }
});
