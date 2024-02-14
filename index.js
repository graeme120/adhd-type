// Assuming the JSON file is named 'youtube_video_ids.json' and located at the root or a specific path
const youtubeIdsPath = "./youtube_video_ids.json"; // Adjust the path as necessary
const youtubeStartTimesPath = "./youtube_video_start_times.json"; // Adjust the path as necessary

// Function to load YouTube video IDs from the JSON file
async function loadYoutubeVideoIds() {
  const response = await fetch(youtubeIdsPath);
  const ids = await response.json();
  return ids;
}

async function loadYoutubeVideoStartTimes() {
  const response = await fetch(youtubeStartTimesPath);
  const times = await response.json();
  return times;
}

// Function to shuffle arrays in sync
function shuffleArraysInSync(arr1, arr2) {
  for (let i = arr1.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr1[i], arr1[j]] = [arr1[j], arr1[i]];
    [arr2[i], arr2[j]] = [arr2[j], arr2[i]]; // Keep the association between ids and start times
  }
}

// Global variable to store the YouTube IDs and start times
let youtubeVideoIds = [];
let youtubeVideoStartTimes = [];
let currentIndex = 0; // Keep track of the current index in the shuffled arrays

// Load the YouTube video IDs once, shuffle, and store them
document.addEventListener("DOMContentLoaded", async () => {
  youtubeVideoIds = await loadYoutubeVideoIds();
  youtubeVideoStartTimes = await loadYoutubeVideoStartTimes();
  shuffleArraysInSync(youtubeVideoIds, youtubeVideoStartTimes); // Shuffle arrays in sync
});

document.addEventListener("keydown", function (event) {
  const area = document.querySelector(".area");
  const key = event.key.toUpperCase();

  // If a letter key is pressed, create a new element
  if (
    (key.length === 1 && key >= "A" && key <= "Z") ||
    event.code === "Space"
  ) {
    const letterForm = document.createElement("div");
    letterForm.classList.add("letterform");

    const img = document.createElement("img");
    img.src =
      event.code === "Space" ? `./alphabet/SPACE.svg` : `./alphabet/${key}.svg`;

    // Use the current index to get a YouTube video ID and start time, then increment the index
    const videoId = youtubeVideoIds[currentIndex];
    const videoStartTime = youtubeVideoStartTimes[currentIndex];
    currentIndex = (currentIndex + 1) % youtubeVideoIds.length; // Cycle through the shuffled list

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&amp;controls=0&amp;start=${videoStartTime}`;

    letterForm.style.maskImage =
      event.code === "Space"
        ? `url(./alphabet/SPACE.svg)`
        : `url(./alphabet/${key}.svg)`;
    letterForm.style.maskSize = "cover";

    letterForm.appendChild(img);
    letterForm.appendChild(iframe);

    area.appendChild(letterForm);
  } else if (event.key === "Delete" || event.key === "Backspace") {
    const lastLetterForm = area.querySelector(".letterform:last-child");
    if (lastLetterForm) {
      area.removeChild(lastLetterForm);
    }
  }
});
