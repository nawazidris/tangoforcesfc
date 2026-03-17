const galleryPhotos = [
    // Matchday Pictures
    { id: 1, type: 'image', src: 'images/tango1.jpg', title: 'Match Victory', sub: 'matchday' },
    { id: 2, type: 'image', src: 'images/tango2.jpg', title: 'Cup Final', sub: 'matchday' },
    { id: 3, type: 'image', src: 'images/tango3.jpg', title: 'League Match', sub: 'matchday' },
    { id: 4, type: 'image', src: 'images/tango4.jpg', title: 'Match Action', sub: 'matchday' },
    { id: 5, type: 'image', src: 'images/tango5.jpg', title: 'Cup Final', sub: 'matchday' },
    { id: 6, type: 'image', src: 'images/tango6.jpg', title: 'League Match', sub: 'matchday' },
    { id: 7, type: 'image', src: 'images/tango7.jpg', title: 'Match Action', sub: 'matchday' },
    { id: 8, type: 'image', src: 'images/tango8.jpg', title: 'Cup Final', sub: 'matchday' },
    { id: 9, type: 'image', src: 'images/tango9.jpg', title: 'League Match', sub: 'matchday' },
    { id: 10, type: 'image', src: 'images/tango10.jpg', title: 'Match Action', sub: 'matchday' },
    { id: 11, type: 'image', src: 'images/tango11.jpg', title: 'Cup Final', sub: 'matchday' },
    { id: 12, type: 'image', src: 'images/tango12.jpg', title: 'League Match', sub: 'matchday' },
    { id: 13, type: 'image', src: 'images/tango13.jpg', title: 'Match Action', sub: 'matchday' },
    { id: 14, type: 'image', src: 'images/tango14.jpg', title: 'Cup Final', sub: 'matchday' },
    { id: 15, type: 'image', src: 'images/tango15.jpg', title: 'League Match', sub: 'matchday' },
    { id: 16, type: 'image', src: 'images/tango16.jpg', title: 'Match Action', sub: 'matchday' },
    { id: 17, type: 'image', src: 'images/tango17.jpg', title: 'Cup Final', sub: 'matchday' },
    { id: 18, type: 'image', src: 'images/tango18.jpg', title: 'League Match', sub: 'matchday' },
    
    // Champions Celebrations Pictures - MOSSL Images
    { id: 100, type: 'image', src: 'images/IMG_3505.jpg', title: 'Celebration', sub: 'champions' },
    { id: 101, type: 'image', src: 'images/IMG_3506.jpg', title: 'Celebration', sub: 'champions' },
    { id: 103, type: 'image', src: 'images/IMG_3508.jpg', title: 'Celebration', sub: 'champions' },
    { id: 104, type: 'image', src: 'images/IMG_3509.jpg', title: 'Celebration', sub: 'champions' },
    { id: 105, type: 'image', src: 'images/IMG_3510.jpg', title: 'Victory Moment', sub: 'champions' },
    { id: 106, type: 'image', src: 'images/IMG_3511.jpg', title: 'Trophy Lift', sub: 'champions' },
    { id: 108, type: 'image', src: 'images/IMG_3513.jpg', title: 'Victory Moment', sub: 'champions' },
    { id: 110, type: 'image', src: 'images/IMG_3518.jpg', title: 'Trophy Lift', sub: 'champions' },
    { id: 112, type: 'image', src: 'images/IMG_3520.jpg', title: 'Victory Moment', sub: 'champions' },
    { id: 225, type: 'image', src: 'images/IMG_3662.jpg', title: 'Trophy Lift', sub: 'champions' },

    // New Season - MOSSL Images
    { id: 300, src: 'images/IMG_3505.jpg', title: 'New Season', sub: 'newseason' },
    { id: 301, src: 'images/IMG_3506.jpg', title: 'New Season', sub: 'newseason' },
    { id: 302, src: 'images/IMG_3508.jpg', title: 'New Season', sub: 'newseason' },
    { id: 303, src: 'images/IMG_3509.jpg', title: 'New Season', sub: 'newseason' }
    
  
];

const renderGallery = (filter = 'all') => {
    const matchdayGrid = document.getElementById('matchdayPicturesGrid');
    const championsGrid = document.getElementById('celebrationsPicturesGrid');
    const newseasonGrid = document.getElementById('newseasonPicturesGrid');

    matchdayGrid.innerHTML = '';
    championsGrid.innerHTML = '';
    newseasonGrid.innerHTML = '';

    let matchday = galleryPhotos.filter(p => p.sub === 'matchday');
    let champions = galleryPhotos.filter(p => p.sub === 'champions');
    let newseason = galleryPhotos.filter(p => p.sub === 'newseason');

    if (filter === 'matchday') {
        champions = [];
        newseason = [];
    }

    if (filter === 'champions') {
        matchday = [];
        newseason = [];
    }

    if (filter === 'newseason') {
        matchday = [];
        champions = [];
    }

    matchday.forEach(photo => {
        matchdayGrid.innerHTML += createItem(photo);
    });

    champions.forEach(photo => {
        championsGrid.innerHTML += createItem(photo);
    });

    newseason.forEach(photo => {
        newseasonGrid.innerHTML += createItem(photo);
    });
};

const createItem = (photo) => {
    return `
        <div class="gallery-item">
            <img loading="lazy" src="${photo.src}" onclick="openLightbox('${photo.src}')">
            <p>${photo.title}</p>
        </div>
    `;
};

const filterGallery = (event, type) => {
    renderGallery(type);

    document.querySelectorAll('.gallery-filters button').forEach(btn => {
        btn.classList.remove('active');
    });

    event.target.classList.add('active');
};

const openLightbox = (src) => {
    document.getElementById('lightboxImage').src = src;
    document.getElementById('lightbox').style.display = 'flex';
};

const closeLightbox = () => {
    document.getElementById('lightbox').style.display = 'none';
};

document.addEventListener('DOMContentLoaded', () => {
    renderGallery();

    document.getElementById('lightbox').addEventListener('click', (e) => {
        if (e.target.id === 'lightbox') {
            closeLightbox();
        }
    });
});

