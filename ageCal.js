export function calculateAge(message, speak) {
    console.log("Function triggered with message:", message);

    const dobMatch = message.match(/(\d{1,2})\s*(\w+|\d{1,2})\s*(\d{4})/);

    if (dobMatch) {
        console.log("Date extracted:", dobMatch);

        const day = parseInt(dobMatch[1], 10);
        const monthInput = dobMatch[2].toLowerCase();
        const year = parseInt(dobMatch[3], 10);

        const months = {
            january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
            july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
        };

        // Handle both word-based and numeric month inputs
        const month = months[monthInput] !== undefined ? months[monthInput] : parseInt(monthInput, 10) - 1;

        if (month !== undefined && month >= 0 && month <= 11) { 
            const dob = new Date(year, month, day);
            const today = new Date();

            let ageYears = today.getFullYear() - dob.getFullYear();
            let ageMonths = today.getMonth() - dob.getMonth();
            let ageDays = today.getDate() - dob.getDate();

            // Adjust for negative month difference
            if (ageMonths < 0) {
                ageYears--;
                ageMonths += 12;
            }

            // Adjust for negative day difference
            if (ageDays < 0) {
                const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of the previous month
                ageDays += lastMonth.getDate();
                ageMonths--;

                if (ageMonths < 0) {
                    ageMonths += 12;
                    ageYears--;
                }
            }

            console.log(`Calculated age: ${ageYears} years, ${ageMonths} months, ${ageDays} days`);
            speak(`Your age is ${ageYears} years, ${ageMonths} months, and ${ageDays} days.`);
        } else {
            console.log("Month not recognized:", monthInput);
            speak("I couldn't understand your date of birth.");
        }
    } else {
        console.log("No date found in message.");
        speak("I couldn't understand your date of birth.");
    }
}
