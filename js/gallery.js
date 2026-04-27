const galleryPhotos = [
     // New Season
    { id: 300, src: 'images/new1.jpeg', title: 'New Season', sub: 'newseason' },
    { id: 301, src: 'images/new2.jpeg', title: 'New Season', sub: 'newseason' },
    { id: 302, src: 'images/new3.jpeg', title: 'New Season', sub: 'newseason' },
    { id: 303, src: 'images/new4.jpeg', title: 'New Season', sub: 'newseason' },
    { id: 304, src: 'images/new5.jpeg', title: 'New Season', sub: 'newseason' },
    { id: 305, src: 'images/new6.jpeg', title: 'New Season', sub: 'newseason' },
    { id: 306, src: 'images/new7.jpeg', title: 'New Season', sub: 'newseason' },
    { id: 307, src: 'images/new8.jpeg', title: 'New Season', sub: 'newseason' },
    { id: 308, src: 'images/new9.jpeg', title: 'New Season', sub: 'newseason' },
    { id: 309, src: 'images/new10.jpeg', title: 'New Season', sub: 'newseason' },
    { id: 310, src: 'images/new11.jpeg', title: 'New Season', sub: 'newseason' },
    { id: 311, src: 'images/new12.jpeg', title: 'Prison Game', sub: 'newseason' },
    { id: 312, src: 'images/new3.jpeg', title: 'Prison Game', sub: 'newseason' },
    { id: 313, src: 'images/new14.jpeg', title: 'Prison Game', sub: 'newseason' },
    { id: 314, src: 'images/new15.jpeg', title: 'Prison Game', sub: 'newseason' },
    { id: 315, src: 'images/new16.jpeg', title: 'Prison Game', sub: 'newseason' },
    { id: 316, src: 'images/new17.jpeg', title: 'Prison Game', sub: 'newseason' },



    // Matchday Pictures
    { id: 1, src: 'images/tango1.jpg', title: 'Match Victory', sub: 'matchday' },
    { id: 2, src: 'images/tango2.jpg', title: 'Cup Final', sub: 'matchday' },
    { id: 3, src: 'images/tango3.jpg', title: 'League Match', sub: 'matchday' },
    { id: 4, src: 'images/tango4.jpg', title: 'Match Action', sub: 'matchday' },
    { id: 5, src: 'images/tango5.jpg', title: 'Cup Final', sub: 'matchday' },
    { id: 6, src: 'images/tango6.jpg', title: 'League Match', sub: 'matchday' },
    { id: 7, src: 'images/tango7.jpg', title: 'Match Action', sub: 'matchday' },
    { id: 8, src: 'images/tango8.jpg', title: 'Cup Final', sub: 'matchday' },
    { id: 9, src: 'images/tango9.jpg', title: 'League Match', sub: 'matchday' },
    { id: 10, src: 'images/tango10.jpg', title: 'Match Action', sub: 'matchday' },
    { id: 11, src: 'images/tango11.jpg', title: 'Cup Final', sub: 'matchday' },
    { id: 12, src: 'images/tango12.jpg', title: 'League Match', sub: 'matchday' },
    { id: 13, src: 'images/tango13.jpg', title: 'Match Action', sub: 'matchday' },
    { id: 14, src: 'images/tango14.jpg', title: 'Cup Final', sub: 'matchday' },
    { id: 15, src: 'images/tango15.jpg', title: 'League Match', sub: 'matchday' },
    { id: 16, src: 'images/tango16.jpg', title: 'Match Action', sub: 'matchday' },
    { id: 17, src: 'images/tango17.jpg', title: 'Cup Final', sub: 'matchday' },
    { id: 18, src: 'images/tango18.jpg', title: 'League Match', sub: 'matchday' },

    // Champions
    { id: 100, src: 'images/IMG_3505.jpg', title: 'Celebration', sub: 'champions' },
    { id: 101, src: 'images/IMG_3506.jpg', title: 'Celebration', sub: 'champions' },
    { id: 103, src: 'images/IMG_3508.jpg', title: 'Celebration', sub: 'champions' },
    { id: 104, src: 'images/IMG_3509.jpg', title: 'Celebration', sub: 'champions' },
    { id: 105, src: 'images/IMG_3510.jpg', title: 'Victory Moment', sub: 'champions' },
    { id: 106, src: 'images/IMG_3511.jpg', title: 'Trophy Lift', sub: 'champions' },
    { id: 108, src: 'images/IMG_3513.jpg', title: 'Victory Moment', sub: 'champions' },
    { id: 110, src: 'images/IMG_3518.jpg', title: 'Trophy Lift', sub: 'champions' },
    { id: 112, src: 'images/IMG_3520.jpg', title: 'Victory Moment', sub: 'champions' },
    { id: 225, src: 'images/IMG_3662.jpg', title: 'Trophy Lift', sub: 'champions' }

   
];

let currentImages = [];
let currentIndex = 0;

function renderGallery(filter = 'all') {
    const grids = {
        newseason: document.getElementById('newseasonPicturesGrid'),
        matchday: document.getElementById('matchdayPicturesGrid'),
        champions: document.getElementById('celebrationsPicturesGrid')
        
    };

    Object.values(grids).forEach(grid => grid.innerHTML = '');

    let filtered = filter === 'all'
        ? galleryPhotos
        : galleryPhotos.filter(p => p.sub === filter);

    currentImages = filtered;

    filtered.forEach(photo => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <img src="${photo.src}" loading="lazy" onclick="openLightbox('${photo.src}')">
            <p>${photo.title}</p>
        `;

        if (grids[photo.sub]) {
            grids[photo.sub].appendChild(item);
        }
    });
}

function filterGallery(type) {
    document.querySelectorAll('.gallery-filters button')
        .forEach(btn => btn.classList.remove('active'));

    event.target.classList.add('active');

    renderGallery(type);
}

function openLightbox(src) {
    currentIndex = currentImages.findIndex(img => img.src === src);
    document.getElementById('lightboxImage').src = src;
    document.getElementById('lightbox').style.display = 'flex';
}

function changeImage(direction) {
    if (currentImages.length === 0) return;

    currentIndex += direction;

    if (currentIndex < 0) currentIndex = currentImages.length - 1;
    if (currentIndex >= currentImages.length) currentIndex = 0;

    document.getElementById('lightboxImage').src =
        currentImages[currentIndex].src;
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    renderGallery();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') changeImage(1);
    if (e.key === 'ArrowLeft') changeImage(-1);
});

window.onload = () => filterGallery('newseason');