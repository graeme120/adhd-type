// Assuming the JSON file is named 'youtube_video_ids.json' and located at the root or a specific path
const youtubeIdsPath = "./youtube_video_ids_alphabet.json"; // Adjust the path as necessary
const youtubeStartTimesPath = "./youtube_video_start_times_alphabet.json"; // Adjust the path as necessary

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

// Global variable to store the YouTube IDs and start times
let youtubeVideoIds = [];
let youtubeVideoStartTimes = [];

// Load the YouTube video IDs once and store them
document.addEventListener("DOMContentLoaded", async () => {
  youtubeVideoIds = await loadYoutubeVideoIds();
  youtubeVideoStartTimes = await loadYoutubeVideoStartTimes();
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
      event.code === "Space"
        ? `./alphabet-impact/SPACE.svg`
        : `./alphabet-impact/${key}.svg`;

    // Determine the index based on the letter pressed (A=0, B=1, ..., Z=25)
    const letterIndex =
      event.code === "Space" ? 26 : key.charCodeAt(0) - "A".charCodeAt(0);

    // Use the letter index to get a YouTube video ID and start time
    const videoId = youtubeVideoIds[letterIndex];
    const videoStartTime = youtubeVideoStartTimes[letterIndex];

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&amp;controls=0&amp;start=${videoStartTime}`;

    letterForm.style.maskImage =
      event.code === "Space"
        ? `url(./alphabet-impact/SPACE.svg)`
        : `url(./alphabet-impact/${key}.svg)`;
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
