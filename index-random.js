// Assuming the JSON file is named 'youtube_video_ids.json' and located at the root or a specific path
const youtubeIdsPath = "./youtube_video_ids.json"; // Adjust the path as necessary
const youtubeStartTimesPath = "./youtube_video_start_times.json"; // Adjust the path as necessary
// Seed-based randomization function
function seededRandom(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const chr = seed.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  const random = () => {
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
  };
  return random;
}

// Function to shuffle an array based on a seed
function shuffleArray(array, seed) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;
  const random = seededRandom(seed);

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Load YouTube video IDs and start times
async function loadYoutubeData(path) {
  const response = await fetch(path);
  return response.json();
}

// Global variables to store the YouTube IDs and start times
let youtubeVideoIds = [];
let youtubeVideoStartTimes = [];
let currentString = ""; // Store the current string of letters
let availableVideoIds = []; // Array to keep track of available (unused) video IDs

// Load the YouTube video IDs and start times once and store them
document.addEventListener("DOMContentLoaded", async () => {
  youtubeVideoIds = await loadYoutubeData("./youtube_video_ids.json");
  youtubeVideoStartTimes = await loadYoutubeData(
    "./youtube_video_start_times.json"
  );
  availableVideoIds = [...youtubeVideoIds]; // Initially, all IDs are available
});

document.addEventListener("keydown", async function (event) {
  const area = document.querySelector(".area");
  const key = event.key.toUpperCase();

  // Handling keydown events for adding or removing letters
  if (
    (key.length === 1 && key >= "A" && key <= "Z") ||
    event.code === "Space"
  ) {
    currentString += key === " " ? "SPACE" : key;
    if (!availableVideoIds.length) {
      availableVideoIds = shuffleArray([...youtubeVideoIds], currentString);
    }
    addLetterForm(event, area, currentString);
  } else if (event.key === "Delete" || event.key === "Backspace") {
    if (currentString.length > 0) {
      currentString = currentString.slice(0, -1);
      // Remove the last letterform
      const lastLetterForm = area.querySelector(".letterform:last-child");
      if (lastLetterForm) {
        area.removeChild(lastLetterForm);
      }
    }
  }

  // Update the videos for all existing letterforms
  updateLetterForms(area, currentString);
});

function updateLetterForms(area, seed) {
  const letterForms = area.querySelectorAll(".letterform");
  // Reshuffle the availableVideoIds based on the current string
  availableVideoIds = shuffleArray([...youtubeVideoIds], seed);

  letterForms.forEach((letterForm, index) => {
    const videoId = availableVideoIds[index % availableVideoIds.length];
    const videoStartTime =
      youtubeVideoStartTimes[youtubeVideoIds.indexOf(videoId)] || 0;
    const iframe = letterForm.querySelector("iframe");
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&start=${videoStartTime}`;
  });
}

function addLetterForm(event, area, seed) {
  const letterForm = document.createElement("div");
  letterForm.classList.add("letterform");

  const img = document.createElement("img");
  img.src =
    event.code === "Space"
      ? `./alphabet/SPACE.svg`
      : `./alphabet/${event.key.toUpperCase()}.svg`;

  const videoId = availableVideoIds.shift(); // Take the first ID from the available list
  const videoStartTime =
    youtubeVideoStartTimes[youtubeVideoIds.indexOf(videoId)] || 0;

  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&start=${videoStartTime}`;

  letterForm.style.maskImage =
    event.code === "Space"
      ? `url(./alphabet/SPACE.svg)`
      : `url(./alphabet/${event.key.toUpperCase()}.svg)`;
  letterForm.style.maskSize = "cover";

  letterForm.appendChild(img);
  letterForm.appendChild(iframe);

  area.appendChild(letterForm);

  // If all videos have been used, reshuffle the list for the next use
  if (availableVideoIds.length === 0) {
    availableVideoIds = shuffleArray([...youtubeVideoIds], seed);
  }
}
