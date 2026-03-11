// videos.js

// Dataset of Tango FC videos
const galleryVideos = [
  // Champions Celebrations Videos
  { id: 1, type: 'video', src: 'images/tango01.mp4', title: 'Tango', category: 'videos', subcategory: 'champions' },
  { id: 10, type: 'video', src: 'images/tango02.mp4', title: 'Tanggo', category: 'videos', subcategory: 'champions' },
  
  // Matchday Videos
  
  { id: 2, type: 'video', src: 'images/tango1.mp4', title: 'The Forces', category: 'videos', subcategory: 'matchday' },
  { id: 3, type: 'video', src: 'images/tango2.mp4', title: 'The Forces', category: 'videos', subcategory: 'matchday' },
  { id: 4, type: 'video', src: 'images/tango3.mp4', title: 'The Forces', category: 'videos', subcategory: 'matchday' },
  { id: 5, type: 'video', src: 'images/tango4.mp4', title: 'The Forces', category: 'videos', subcategory: 'matchday' },


];

// Lightbox references
const lightbox = document.getElementById("videoLightbox");
const lightboxVideo = document.getElementById("lightboxVideo");
const closeBtn = document.querySelector(".video-lightbox .close-btn");

// Function to load gallery videos
function loadVideos() {
  const grid = document.getElementById("videoGrid");
  if (!grid) return;

  galleryVideos.forEach(video => {
    const item = document.createElement("div");
    item.className = "gallery-item";

    const videoElement = document.createElement("video");
    videoElement.controls = true;
    videoElement.width = "100%";
    videoElement.preload = "metadata";

    const source = document.createElement("source");
    source.src = video.src;
    source.type = "video/mp4";
    videoElement.appendChild(source);

    const title = document.createElement("p");
    title.className = "video-title";
    title.textContent = video.title;

    item.appendChild(videoElement);
    item.appendChild(title);
    grid.appendChild(item);

    // Pause all other videos when one plays
    videoElement.addEventListener("play", () => {
      const allVideos = document.querySelectorAll(".gallery-item video");
      allVideos.forEach(v => {
        if (v !== videoElement) v.pause();
      });
    });

    // Click anywhere on card opens fullscreen
    item.addEventListener("click", () => {
      lightbox.style.display = "flex";
      lightboxVideo.src = video.src;
      lightboxVideo.play();
    });
  });

  // Close button click
  closeBtn.addEventListener("click", () => {
    lightboxVideo.pause();
    lightboxVideo.currentTime = 0;
    lightbox.style.display = "none";
  });

  // Click outside video to close
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) {
      lightboxVideo.pause();
      lightboxVideo.currentTime = 0;
      lightbox.style.display = "none";
    }
  });

  // Esc key closes lightbox
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && lightbox.style.display === "flex") {
      lightboxVideo.pause();
      lightboxVideo.currentTime = 0;
      lightbox.style.display = "none";
    }
  });
}

document.addEventListener("DOMContentLoaded", loadVideos);







