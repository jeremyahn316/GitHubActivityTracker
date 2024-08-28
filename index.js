import readLine from "readline";

// Given a username, fetch user GitHub Activity history using API Call
async function fetchGitHubActivity(username) {
    const url = `https://api.github.com/users/${username}/events`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Not a valid Github Username");
        }

        const json = await response.json();
        console.log(json)
        return json

    } catch (error) {
        console.error(error.message);
    }    
}


// Output activities found ing User's Github event API call
function outputActivity(json) {
    console.log("Output:")

    json.forEach((event) => {
    let action;
    switch (event.type) {
        case "PushEvent":
        const commitCount = event.payload.commits.length;
        action = `Pushed ${commitCount} commit(s) to ${event.repo.name}`;
        break;
        case "IssuesEvent":
        action = `${event.payload.action.charAt(0).toUpperCase() + event.payload.action.slice(1)} an issue in ${event.repo.name}`;
        break;
        case "WatchEvent":
        action = `Starred ${event.repo.name}`;
        break;
        case "ForkEvent":
        action = `Forked ${event.repo.name}`;
        break;
        case "CreateEvent":
        action = `Created ${event.payload.ref_type} in ${event.repo.name}`;
        break;
        default:
        action = `${event.type.replace("Event", "")} in ${event.repo.name}`;
        break;
    }
    console.log(`- ${action}`);
    });
}

// Read CLI input 
const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise((resolve) => rl.question(query, resolve));
}

let userInput = await askQuestion("Enter a valid Github username: ");

fetchGitHubActivity(userInput)
.then(json => {
    outputActivity(json);
})
.catch((err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
})


