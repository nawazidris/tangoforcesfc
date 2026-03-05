const galleryPhotos = [
    // Matchday Pictures
    { id: 1, type: 'image', src: '../images/matchday/tango1.jpg', title: 'Match Victory', category: 'pictures', subcategory: 'matchday' },
    { id: 2, type: 'image', src: '../images/matchday/tango2.jpg', title: 'Cup Final', category: 'pictures', subcategory: 'matchday' },
    { id: 3, type: 'image', src: '../images/matchday/tango3.jpg', title: 'League Match', category: 'pictures', subcategory: 'matchday' },
    { id: 4, type: 'image', src: '../images/matchday/tango4.jpg', title: 'Match Victory', category: 'pictures', subcategory: 'matchday' },
    { id: 5, type: 'image', src: '../images/matchday/tango5.jpg', title: 'Cup Final', category: 'pictures', subcategory: 'matchday' },
    { id: 6, type: 'image', src: '../images/matchday/tango6.jpg', title: 'League Match', category: 'pictures', subcategory: 'matchday' },
    { id: 7, type: 'image', src: '../images/matchday/tango7.jpg', title: 'Match Victory', category: 'pictures', subcategory: 'matchday' },
    { id: 8, type: 'image', src: '../images/matchday/tango8.jpg', title: 'Cup Final', category: 'pictures', subcategory: 'matchday' },
    { id: 9, type: 'image', src: '../images/matchday/tango9.jpg', title: 'League Match', category: 'pictures', subcategory: 'matchday' },
    { id: 10, type: 'image', src: '../images/matchday/tango10.jpg', title: 'Match Victory', category: 'pictures', subcategory: 'matchday' },
    { id: 11, type: 'image', src: '../images/matchday/tango11.jpg', title: 'Cup Final', category: 'pictures', subcategory: 'matchday' },
    { id: 12, type: 'image', src: '../images/matchday/tango12.jpg', title: 'League Match', category: 'pictures', subcategory: 'matchday' },
    { id: 13, type: 'image', src: '../images/matchday/tango13.jpg', title: 'Match Victory', category: 'pictures', subcategory: 'matchday' },
    { id: 14, type: 'image', src: '../images/matchday/tango14.jpg', title: 'Cup Final', category: 'pictures', subcategory: 'matchday' },
    { id: 15, type: 'image', src: '../images/matchday/tango15.jpg', title: 'League Match', category: 'pictures', subcategory: 'matchday' },
    { id: 16, type: 'image', src: '../images/matchday/tango16.jpg', title: 'Match Victory', category: 'pictures', subcategory: 'matchday' },
    { id: 17, type: 'image', src: '../images/matchday/tango17.jpg', title: 'Cup Final', category: 'pictures', subcategory: 'matchday' },
    { id: 18, type: 'image', src: '../images/matchday/tango18.jpg', title: 'League Match', category: 'pictures', subcategory: 'matchday' },
    
    // Champions Celebrations Pictures - MOSSL Images
    { id: 100, type: 'image', src: '../images/mossl/IMG_3505.jpg', title: 'MOSSL Celebration - IMG_3505', category: 'pictures', subcategory: 'champions' },
    { id: 101, type: 'image', src: '../images/mossl/IMG_3506.jpg', title: 'MOSSL Celebration - IMG_3506', category: 'pictures', subcategory: 'champions' },
    { id: 103, type: 'image', src: '../images/mossl/IMG_3508.jpg', title: 'MOSSL Celebration - IMG_3508', category: 'pictures', subcategory: 'champions' },
    { id: 104, type: 'image', src: '../images/mossl/IMG_3509.jpg', title: 'MOSSL Celebration - IMG_3509', category: 'pictures', subcategory: 'champions' },
    { id: 105, type: 'image', src: '../images/mossl/IMG_3510.jpg', title: 'MOSSL Celebration - IMG_3510', category: 'pictures', subcategory: 'champions' },
    { id: 106, type: 'image', src: '../images/mossl/IMG_3511.jpg', title: 'MOSSL Celebration - IMG_3511', category: 'pictures', subcategory: 'champions' },
    { id: 107, type: 'image', src: '../images/mossl/IMG_3512.jpg', title: 'MOSSL Celebration - IMG_3512', category: 'pictures', subcategory: 'champions' },
    { id: 108, type: 'image', src: '../images/mossl/IMG_3513.jpg', title: 'MOSSL Celebration - IMG_3513', category: 'pictures', subcategory: 'champions' },
    { id: 109, type: 'image', src: '../images/mossl/IMG_3517.jpg', title: 'MOSSL Celebration - IMG_3517', category: 'pictures', subcategory: 'champions' },
    { id: 110, type: 'image', src: '../images/mossl/IMG_3518.jpg', title: 'MOSSL Celebration - IMG_3518', category: 'pictures', subcategory: 'champions' },
    { id: 111, type: 'image', src: '../images/mossl/IMG_3519.jpg', title: 'MOSSL Celebration - IMG_3519', category: 'pictures', subcategory: 'champions' },
    { id: 112, type: 'image', src: '../images/mossl/IMG_3520.jpg', title: 'MOSSL Celebration - IMG_3520', category: 'pictures', subcategory: 'champions' },
    { id: 113, type: 'image', src: '../images/mossl/IMG_3521.jpg', title: 'MOSSL Celebration - IMG_3521', category: 'pictures', subcategory: 'champions' },
    { id: 114, type: 'image', src: '../images/mossl/IMG_3522.jpg', title: 'MOSSL Celebration - IMG_3522', category: 'pictures', subcategory: 'champions' },
    { id: 115, type: 'image', src: '../images/mossl/IMG_3523.jpg', title: 'MOSSL Celebration - IMG_3523', category: 'pictures', subcategory: 'champions' },
    { id: 211, type: 'image', src: '../images/mossl/IMG_3648.jpg', title: 'MOSSL Celebration - IMG_3648', category: 'pictures', subcategory: 'champions' },
    { id: 212, type: 'image', src: '../images/mossl/IMG_3649.jpg', title: 'MOSSL Celebration - IMG_3649', category: 'pictures', subcategory: 'champions' },
    { id: 213, type: 'image', src: '../images/mossl/IMG_3650.jpg', title: 'MOSSL Celebration - IMG_3650', category: 'pictures', subcategory: 'champions' },
    { id: 214, type: 'image', src: '../images/mossl/IMG_3651.jpg', title: 'MOSSL Celebration - IMG_3651', category: 'pictures', subcategory: 'champions' },
    { id: 215, type: 'image', src: '../images/mossl/IMG_3652.jpg', title: 'MOSSL Celebration - IMG_3652', category: 'pictures', subcategory: 'champions' },
    { id: 216, type: 'image', src: '../images/mossl/IMG_3653.jpg', title: 'MOSSL Celebration - IMG_3653', category: 'pictures', subcategory: 'champions' },
    { id: 223, type: 'image', src: '../images/mossl/IMG_3660.jpg', title: 'MOSSL Celebration - IMG_3660', category: 'pictures', subcategory: 'champions' },
    { id: 224, type: 'image', src: '../images/mossl/IMG_3661.jpg', title: 'MOSSL Celebration - IMG_3661', category: 'pictures', subcategory: 'champions' },
    { id: 225, type: 'image', src: '../images/mossl/IMG_3662.jpg', title: 'MOSSL Celebration - IMG_3662', category: 'pictures', subcategory: 'champions' },
    
    
];

const displayGalleryInGrid = (photos, gridId) => {
    const container = document.getElementById(gridId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (photos.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 20px;">No items in this section</p>';
        return;
    }

    photos.forEach(photo => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        if (photo.type === 'video') {
            item.innerHTML = `
                <video class="gallery-thumb" src="${photo.src}" muted playsinline preload="metadata" onclick="openLightboxVideo('${photo.src}')"></video>
                <div class="play-overlay">▶</div>
                <p>${photo.title}</p>
            `;
        } else {
            item.innerHTML = `
                <img src="${photo.src}" alt="${photo.title}" onclick="openLightbox('${photo.src}')">
                <p>${photo.title}</p>
            `;
        }
        container.appendChild(item);
    });
};

const displayGallery = () => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type'); // 'videos' or 'pictures'
    const sub = urlParams.get('sub'); // 'matchday' or 'champions'

    // Update page title and description
    const titleEl = document.getElementById('galleryTitle');
    const descEl = document.getElementById('galleryDescription');
    
    if (type === 'videos') {
        if (sub === 'matchday') {
            titleEl.textContent = 'Matchday Videos';
            descEl.textContent = 'Videos from matchday events';
        } else if (sub === 'champions') {
            titleEl.textContent = 'Champions Celebration Videos';
            descEl.textContent = 'Videos from the 2025/26 MOSSL Champions celebrations';
        } else {
            titleEl.textContent = 'Club Videos';
            descEl.textContent = 'Videos from matches and team events';
        }
    } else if (type === 'pictures') {
        if (sub === 'matchday') {
            titleEl.textContent = 'Matchday Pictures';
            descEl.textContent = 'Photos from matchday events';
        } else if (sub === 'champions') {
            titleEl.textContent = 'Champions Celebration Pictures';
            descEl.textContent = 'Photos from the 2025/26 MOSSL Champions celebrations';
        } else {
            titleEl.textContent = 'Club Pictures';
            descEl.textContent = 'Photos from matches and team events';
        }
    } else {
        titleEl.textContent = 'Club Gallery';
        descEl.textContent = 'Photos and videos from matches and team events';
    }

    // Filter photos based on URL params
    let filteredPhotos = galleryPhotos;
    if (type) {
        filteredPhotos = filteredPhotos.filter(p => p.category === type);
    }
    if (sub) {
        filteredPhotos = filteredPhotos.filter(p => p.subcategory === sub);
    }

    // If no filters, show all
    if (!type && !sub) {
        const matchdayVideos = galleryPhotos.filter(p => p.category === 'videos' && p.subcategory === 'matchday');
        const celebrationsVideos = galleryPhotos.filter(p => p.category === 'videos' && p.subcategory === 'champions');
        const matchdayPictures = galleryPhotos.filter(p => p.category === 'pictures' && p.subcategory === 'matchday');
        const celebrationsPictures = galleryPhotos.filter(p => p.category === 'pictures' && p.subcategory === 'champions');
        
        displayGalleryInGrid(matchdayVideos, 'matchdayVideosGrid');
        displayGalleryInGrid(celebrationsVideos, 'celebrationsVideosGrid');
        displayGalleryInGrid(matchdayPictures, 'matchdayPicturesGrid');
        displayGalleryInGrid(celebrationsPictures, 'celebrationsPicturesGrid');
        
        // Show both sections
        document.querySelectorAll('.gallery-section').forEach(section => {
            section.style.display = 'block';
        });
        
        // Set container to two columns
        document.querySelector('.gallery-container').style.gridTemplateColumns = '1fr 1fr';
    } else {
        // Hide all sections first
        document.querySelectorAll('.gallery-section').forEach(section => {
            section.style.display = 'none';
        });

        // Set container to single column (full width)
        document.querySelector('.gallery-container').style.gridTemplateColumns = '1fr';
        
        // Show only the relevant section
        if (type === 'videos') {
            document.querySelector('.gallery-section:nth-child(1)').style.display = 'block';
            // Expand the videos section
            const videosSection = document.querySelector('.gallery-section:nth-child(1)');
            videosSection.querySelector('.section-content').style.display = 'block';
            videosSection.querySelector('.section-title').textContent = '▼ Videos';
            
            // Filter and display based on sub
            if (sub === 'matchday') {
                const matchdayVideos = filteredPhotos.filter(p => p.subcategory === 'matchday');
                displayGalleryInGrid(matchdayVideos, 'matchdayVideosGrid');
                // Show only matchday subsection
                videosSection.querySelectorAll('.subsection')[0].querySelector('.subsection-content').style.display = 'grid';
                videosSection.querySelectorAll('.subsection')[0].querySelector('.subsection-title').classList.add('open');
                videosSection.querySelectorAll('.subsection')[1].querySelector('.subsection-content').style.display = 'none';
                videosSection.querySelectorAll('.subsection')[1].querySelector('.subsection-title').classList.remove('open');
            } else if (sub === 'champions') {
                const celebrationsVideos = filteredPhotos.filter(p => p.subcategory === 'champions');
                displayGalleryInGrid(celebrationsVideos, 'celebrationsVideosGrid');
                // Show only celebrations subsection
                videosSection.querySelectorAll('.subsection')[0].querySelector('.subsection-content').style.display = 'none';
                videosSection.querySelectorAll('.subsection')[0].querySelector('.subsection-title').classList.remove('open');
                videosSection.querySelectorAll('.subsection')[1].querySelector('.subsection-content').style.display = 'grid';
                videosSection.querySelectorAll('.subsection')[1].querySelector('.subsection-title').classList.add('open');
            } else {
                // Show all videos
                const matchdayVideos = galleryPhotos.filter(p => p.category === 'videos' && p.subcategory === 'matchday');
                const celebrationsVideos = galleryPhotos.filter(p => p.category === 'videos' && p.subcategory === 'champions');
                displayGalleryInGrid(matchdayVideos, 'matchdayVideosGrid');
                displayGalleryInGrid(celebrationsVideos, 'celebrationsVideosGrid');
            }
        } else if (type === 'pictures') {
            document.querySelector('.gallery-section:nth-child(2)').style.display = 'block';
            // Similar logic for pictures
            const picturesSection = document.querySelector('.gallery-section:nth-child(2)');
            picturesSection.querySelector('.section-content').style.display = 'block';
            picturesSection.querySelector('.section-title').textContent = '▼ Pictures';
            
            if (sub === 'matchday') {
                const matchdayPictures = filteredPhotos.filter(p => p.subcategory === 'matchday');
                displayGalleryInGrid(matchdayPictures, 'matchdayPicturesGrid');
                picturesSection.querySelectorAll('.subsection')[0].querySelector('.subsection-content').style.display = 'grid';
                picturesSection.querySelectorAll('.subsection')[0].querySelector('.subsection-title').classList.add('open');
                picturesSection.querySelectorAll('.subsection')[1].querySelector('.subsection-content').style.display = 'none';
                picturesSection.querySelectorAll('.subsection')[1].querySelector('.subsection-title').classList.remove('open');
            } else if (sub === 'champions') {
                const celebrationsPictures = filteredPhotos.filter(p => p.subcategory === 'champions');
                displayGalleryInGrid(celebrationsPictures, 'celebrationsPicturesGrid');
                picturesSection.querySelectorAll('.subsection')[0].querySelector('.subsection-content').style.display = 'none';
                picturesSection.querySelectorAll('.subsection')[0].querySelector('.subsection-title').classList.remove('open');
                picturesSection.querySelectorAll('.subsection')[1].querySelector('.subsection-content').style.display = 'grid';
                picturesSection.querySelectorAll('.subsection')[1].querySelector('.subsection-title').classList.add('open');
            } else {
                const matchdayPictures = galleryPhotos.filter(p => p.category === 'pictures' && p.subcategory === 'matchday');
                const celebrationsPictures = galleryPhotos.filter(p => p.category === 'pictures' && p.subcategory === 'champions');
                displayGalleryInGrid(matchdayPictures, 'matchdayPicturesGrid');
                displayGalleryInGrid(celebrationsPictures, 'celebrationsPicturesGrid');
            }
        }
    }
};

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
