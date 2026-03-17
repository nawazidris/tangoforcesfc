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

    if (filter === 'matchday') champions = [];
    if (filter === 'champions') matchday = [];
    if (filter === 'newseason') newseason = [];
    

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

const filterGallery = (type) => {
    renderGallery(type);
};

const openLightbox = (src) => {
    const lightbox = document.getElementById('lightbox');
    const image = document.getElementById('lightboxImage');

    image.src = src;
    lightbox.style.display = 'flex';
};

const closeLightbox = () => {
    document.getElementById('lightbox').style.display = 'none';
};

document.addEventListener('DOMContentLoaded', () => {
    renderGallery();
});

const openLightbox = (src) => {
    const lightbox = document.getElementById('lightbox');
    const image = document.getElementById('lightboxImage');
    const video = document.getElementById('lightboxVideo');
    
    // show image, hide video
    video.pause();
    video.style.display = 'none';
    image.style.display = 'block';
    image.src = src;
    lightbox.style.display = 'flex';
};

const openLightboxVideo = (src) => {
    const lightbox = document.getElementById('lightbox');
    const image = document.getElementById('lightboxImage');
    const video = document.getElementById('lightboxVideo');
    image.style.display = 'none';
    video.style.display = 'block';
    video.src = src;
    video.currentTime = 0;
    video.play().catch(() => {});
    lightbox.style.display = 'flex';
};

const closeLightbox = () => {
    document.getElementById('lightbox').style.display = 'none';
};

const toggleSection = (event) => {
    const title = event.target;
    const content = title.nextElementSibling;
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        title.textContent = title.textContent.replace('📹 Videos', '▼ Videos').replace('🖼️ Pictures', '▼ Pictures');
    } else {
        content.style.display = 'none';
        title.textContent = title.textContent.replace('▼ Videos', '📹 Videos').replace('▼ Pictures', '🖼️ Pictures');
    }
};

const toggleSubsection = (event) => {
    const title = event.target.closest('.subsection-title');
    const content = title.nextElementSibling;
    
    if (content.style.display === 'grid') {
        content.style.display = 'none';
        title.classList.remove('open');
    } else {
        content.style.display = 'grid';
        title.classList.add('open');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    displayGallery();

    // Close lightbox on outside click
    document.getElementById('lightbox').addEventListener('click', (e) => {
        if (e.target.id === 'lightbox') {
            closeLightbox();
        }
    });
    // Initialize navigation dropdown behavior: show only group titles when opened,
    // and allow each group title to expand its own items.
    const initNavDropdown = () => {
        const dropdownToggle = document.querySelector('.dropdown-toggle');
        const dropdownMenu = document.querySelector('.dropdown-menu');
        if (!dropdownToggle || !dropdownMenu) return;

        // start hidden
        dropdownMenu.style.display = 'none';

        // ensure items are hidden and group titles show an arrow next to the emoji
        dropdownMenu.querySelectorAll('.dropdown-group').forEach(group => {
            const title = group.querySelector('.dropdown-group-title');
            const items = group.querySelectorAll('.dropdown-item');
            items.forEach(i => i.style.display = 'none');
            if (title) {
                // if arrow already exists skip rebuilding
                if (!title.querySelector('.dropdown-arrow')) {
                    const raw = title.innerHTML.trim();
                    const parts = raw.split(/\s+/);
                    const emoji = parts[0] || '';
                    const rest = parts.slice(1).join(' ') || '';

                    // build structured content: emoji, arrow span, label
                    title.innerHTML = '';
                    const emojiSpan = document.createElement('span');
                    emojiSpan.className = 'dropdown-emoji';
                    emojiSpan.innerHTML = emoji;
                    const arrowSpan = document.createElement('span');
                    arrowSpan.className = 'dropdown-arrow';
                    arrowSpan.textContent = '▶';
                    const labelSpan = document.createElement('span');
                    labelSpan.className = 'dropdown-label';
                    labelSpan.textContent = rest;

                    title.appendChild(emojiSpan);
                    title.appendChild(document.createTextNode(' '));
                    title.appendChild(arrowSpan);
                    title.appendChild(document.createTextNode(' '));
                    title.appendChild(labelSpan);
                }

                const arrow = title.querySelector('.dropdown-arrow');
                // keep the anchor navigable; attach expand/collapse to the arrow only
                title.dataset.open = 'false';
                if (arrow) {
                    arrow.style.cursor = 'pointer';
                    arrow.addEventListener('click', (ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        const isOpen = title.dataset.open === 'true';
                        items.forEach(it => it.style.display = isOpen ? 'none' : 'block');
                        title.dataset.open = isOpen ? 'false' : 'true';
                        arrow.textContent = isOpen ? '▶' : '▼';
                        title.classList.toggle('open', !isOpen);
                    });
                }
            }
        });

        dropdownToggle.addEventListener('click', (ev) => {
            ev.preventDefault();
            const open = dropdownMenu.style.display === 'block';
            if (open) {
                dropdownMenu.style.display = 'none';
            } else {
                // collapse all groups and show only titles
                dropdownMenu.style.display = 'block';
                dropdownMenu.querySelectorAll('.dropdown-item').forEach(i => i.style.display = 'none');
                dropdownMenu.querySelectorAll('.dropdown-group-title').forEach(t => {
                    t.dataset.open = 'false';
                    const arrow = t.querySelector('.dropdown-arrow');
                    if (arrow) arrow.textContent = '▶';
                    t.classList.remove('open');
                });
            }
        });

        // close dropdown when clicking outside
        document.addEventListener('click', (ev) => {
            if (!dropdownMenu.contains(ev.target) && !dropdownToggle.contains(ev.target)) {
                dropdownMenu.style.display = 'none';
            }
        });
    };

    initNavDropdown();
});



