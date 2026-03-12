// videos.js

// =============================
// VIDEO DATASET
// =============================

const galleryVideos = [

{ id: 1, src: 'images/tango01.mp4', title: 'Champions Celebration', subcategory: 'champions', date:'2026-02-01' },
{ id: 10, src: 'images/tango02.mp4', title: 'Champions Celebration', subcategory: 'champions', date:'2026-02-02' },

{ id: 2, src: 'images/tango1.mp4', title: 'The Forces', subcategory: 'matchday', date:'2026-01-10' },
{ id: 3, src: 'images/tango2.mp4', title: 'The Forces', subcategory: 'matchday', date:'2026-01-11' },
{ id: 4, src: 'images/tango3.mp4', title: 'The Forces', subcategory: 'matchday', date:'2026-01-12' },
{ id: 5, src: 'images/tango4.mp4', title: 'The Forces', subcategory: 'matchday', date:'2026-01-13' }

];

// =============================
// ELEMENTS
// =============================

const grid = document.getElementById("videoGrid");
const counter = document.getElementById("videoCounter");
const sortSelect = document.getElementById("videoSort");

const lightbox = document.getElementById("videoLightbox");
const lightboxVideo = document.getElementById("lightboxVideo");
const closeBtn = document.querySelector(".video-lightbox .close-btn");

let currentVideos = [...galleryVideos];

// =============================
// LOAD VIDEOS
// =============================

function loadVideos(videos){

grid.innerHTML = "";

videos.forEach(video => {

const card = document.createElement("div");
card.className = "gallery-item";

/* THUMBNAIL */

const thumb = document.createElement("video");

thumb.src = video.src;
thumb.muted = true;
thumb.preload = "metadata";
thumb.playsInline = true;
thumb.loading = "lazy";

thumb.className = "video-thumb";

/* TITLE */

const title = document.createElement("p");
title.className = "video-title";
title.textContent = video.title;

/* CATEGORY TAG */

const tag = document.createElement("span");
tag.className = "video-tag";
tag.textContent = video.subcategory;

/* HOVER PREVIEW */

card.addEventListener("mouseenter", () => {
thumb.currentTime = 1;
thumb.play();
});

card.addEventListener("mouseleave", () => {
thumb.pause();
thumb.currentTime = 0;
});

/* OPEN FULLSCREEN */

card.addEventListener("click", () => {

lightbox.style.display = "flex";
lightboxVideo.src = video.src;
lightboxVideo.play();

});

card.appendChild(thumb);
card.appendChild(tag);
card.appendChild(title);

grid.appendChild(card);

});

updateCounter(videos.length);

}

// =============================
// VIDEO COUNTER
// =============================

function updateCounter(total){

if(counter){
counter.textContent = total + " Videos";
}

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

currentVideos = galleryVideos.filter(v => v.subcategory === filter);

}

loadVideos(currentVideos);

buttons.forEach(b=>b.classList.remove("active"));
btn.classList.add("active");

});

});

}

// =============================
// SORTING
// =============================

function setupSorting(){

if(!sortSelect) return;

sortSelect.addEventListener("change", ()=>{

const value = sortSelect.value;

if(value === "newest"){

currentVideos.sort((a,b)=> new Date(b.date) - new Date(a.date));

}

if(value === "az"){

currentVideos.sort((a,b)=> a.title.localeCompare(b.title));

}

if(value === "category"){

currentVideos.sort((a,b)=> a.subcategory.localeCompare(b.subcategory));

}

loadVideos(currentVideos);

});

}

// =============================
// LIGHTBOX
// =============================

function closeLightbox(){

lightboxVideo.pause();
lightboxVideo.currentTime = 0;
lightbox.style.display = "none";

}

function setupLightbox(){

if(!lightbox) return;

closeBtn.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", e => {

if(e.target === lightbox){

closeLightbox();

}

});

document.addEventListener("keydown", e => {

if(e.key === "Escape" && lightbox.style.display === "flex"){

closeLightbox();

}

});

}

// =============================
// LAZY LOAD (IntersectionObserver)
// =============================

function setupLazyLoading(){

const videos = document.querySelectorAll(".video-thumb");

const observer = new IntersectionObserver(entries => {

entries.forEach(entry => {

if(entry.isIntersecting){

const vid = entry.target;
vid.preload = "metadata";

observer.unobserve(vid);

}

});

});

videos.forEach(v => observer.observe(v));

}

// =============================
// INIT
// =============================

document.addEventListener("DOMContentLoaded", ()=>{

loadVideos(currentVideos);

setupFilters();

setupSorting();

setupLightbox();

setTimeout(setupLazyLoading,500);

});
