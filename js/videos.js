// =============================
// LOCAL + ADMIN VIDEOS MERGE
// =============================

const localVideos = [

{ id: 1, src: 'images/tango01.mp4', title: 'Champions Celebration', subcategory: 'champions', date:'2026-02-01' },
{ id: 10, src: 'images/tango02.mp4', title: 'Champions Celebration', subcategory: 'champions', date:'2026-02-02' },

{ id: 2, src: 'images/tango1.mp4', title: 'The Forces', subcategory: 'matchday', date:'2026-01-10' },
{ id: 3, src: 'images/tango2.mp4', title: 'The Forces', subcategory: 'matchday', date:'2026-01-11' },
{ id: 4, src: 'images/tango3.mp4', title: 'The Forces', subcategory: 'matchday', date:'2026-01-12' },
{ id: 5, src: 'images/tango4.mp4', title: 'The Forces', subcategory: 'matchday', date:'2026-01-13' }

];

// ADMIN VIDEOS
const adminVideos = JSON.parse(localStorage.getItem("videos")) || [];

// MERGE
const galleryVideos = [...localVideos, ...adminVideos];

let currentVideos = [...galleryVideos];

// =============================
// ELEMENTS
// =============================

const grid = document.getElementById("videoGrid");
const counter = document.getElementById("videoCounter");

const lightbox = document.getElementById("videoLightbox");
const lightboxVideo = document.getElementById("lightboxVideo");
const closeBtn = document.querySelector(".close-btn");

// =============================
// LOAD VIDEOS
// =============================

function loadVideos(videos){

grid.innerHTML = "";

if(videos.length === 0){
grid.innerHTML = "<p class='empty-msg'>No videos available</p>";
return;
}

videos.forEach(video => {

const card = document.createElement("div");
card.className = "video-card";

/* VIDEO */

const thumb = document.createElement("video");

thumb.src = video.src || video.url;
thumb.muted = true;
thumb.preload = "metadata";
thumb.playsInline = true;
thumb.className = "video-thumb";

/* PLAY ICON */

const playBtn = document.createElement("div");
playBtn.className = "play-btn";
playBtn.innerHTML = "▶";

/* TITLE */

const title = document.createElement("h3");
title.textContent = video.title;

/* TAG */

const tag = document.createElement("span");
tag.className = "video-tag";
tag.textContent = video.subcategory || video.category;

/* HOVER PREVIEW */

card.addEventListener("mouseenter", () => {
thumb.currentTime = 1;
thumb.play();
});

card.addEventListener("mouseleave", () => {
thumb.pause();
thumb.currentTime = 0;
});

/* OPEN */

card.addEventListener("click", () => {

lightbox.style.display = "flex";
lightboxVideo.src = video.src || video.url;
lightboxVideo.play();

});

card.appendChild(thumb);
card.appendChild(playBtn);
card.appendChild(tag);
card.appendChild(title);

grid.appendChild(card);

});

counter.textContent = videos.length + " Videos";

}

// =============================
// FILTERS
// =============================

function setupFilters(){

const buttons = document.querySelectorAll(".video-filters button");

buttons.forEach(btn => {

btn.addEventListener("click", ()=>{

const filter = btn.dataset.filter;

if(filter === "all"){
currentVideos = [...galleryVideos];
}else{
currentVideos = galleryVideos.filter(v =>
(v.subcategory || v.category) === filter
);
}

loadVideos(currentVideos);

buttons.forEach(b=>b.classList.remove("active"));
btn.classList.add("active");

});

});

}

// =============================
// LIGHTBOX
// =============================

function closeLightbox(){

lightboxVideo.pause();
lightboxVideo.src = "";
lightbox.style.display = "none";

}

closeBtn.onclick = closeLightbox;

lightbox.addEventListener("click", e => {
if(e.target === lightbox) closeLightbox();
});

// =============================
// INIT
// =============================

document.addEventListener("DOMContentLoaded", ()=>{

loadVideos(currentVideos);
setupFilters();

});
