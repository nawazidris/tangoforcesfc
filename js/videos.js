// videos.js

// Dataset of Tango FC videos
const galleryVideos = [
  // Matchday Videos
  { id: 2, type: 'video', src: 'images/tango1.mp4', title: 'Trophy Celebration', category: 'videos', subcategory: 'matchday' },
  { id: 3, type: 'video', src: 'images/tango2.mp4', title: 'Trophy Celebration', category: 'videos', subcategory: 'matchday' },
  { id: 2, type: 'video', src: 'images/tango3.mp4', title: 'Trophy Celebration', category: 'videos', subcategory: 'matchday' },
  { id: 2, type: 'video', src: 'images/tango4.mp4', title: 'Trophy Celebration', category: 'videos', subcategory: 'matchday' },

  // Champions Celebrations Videos
  { id: 6, type: 'video', src: 'images/tango2.mov', title: 'Team Celebration 1', category: 'videos', subcategory: 'champions' },
  { id: 10, type: 'video', src: 'images/tango1.mov', title: 'Team Celebration 2', category: 'videos', subcategory: 'champions' }
];

// Function to populate the video grid
function loadVideos() {
  const grid = document.getElementById("videoGrid");

  if (!grid) {
    console.error("Video grid container not found!");
    return;
  }

  if (galleryVideos.length === 0) {
    grid.innerHTML = "<p>No videos available at the moment.</p>";
    return;
  }

  galleryVideos.forEach(video => {
    // Create video item container
    const item = document.createElement("div");
    item.className = "gallery-item";

    // Build video element
    const videoElement = document.createElement("video");
    videoElement.controls = true;
    videoElement.width = "100%";

    const source = document.createElement("source");
    source.src = video.src;
    source.type = "video/mp4";

    videoElement.appendChild(source);

    // Title
    const title = document.createElement("p");
    title.className = "video-title";
    title.textContent = video.title;

    // Append to item
    item.appendChild(videoElement);
    item.appendChild(title);

    // Add to grid
    grid.appendChild(item);
  });
}

// Run after DOM is loaded

document.addEventListener("DOMContentLoaded", loadVideos);


