// Hotel Display Data

const tvGuideData = [
    { time: 'NOW PLAYING', title: 'BBC World News', desc: 'Global news updates' },
    { time: 'NOW PLAYING', title: 'HBO &middot; Succession', desc: 'S4 E3: Connor\'s Wedding' },
    { time: 'NOW PLAYING', title: 'ESPN &middot; SportsCenter', desc: 'Daily sports highlights' },
    { time: '15:00', title: 'Nat Geo &middot; Planet Earth', desc: 'Jungles and Rainforests' },
    { time: '15:30', title: 'Food Network &middot; Chopped', desc: 'Dessert Champions' },
    { time: '16:00', title: 'CNN &middot; The Lead', desc: 'Political analysis' },
    { time: '16:30', title: 'Discovery &middot; MythBusters', desc: 'Car Myths' }
];

const restaurantsData = [
    { name: 'The Obsidian Room', type: 'Fine Dining', dist: 'In-Hotel', img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=200' },
    { name: 'Ocean Prime', type: 'Seafood', dist: '0.2 mi', img: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=200' },
    { name: 'Bistro 42', type: 'French', dist: '0.5 mi', img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=200' },
    { name: 'Aura Lounge', type: 'Cocktails', dist: 'In-Hotel', img: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=200' },
    { name: 'Sake Sushi', type: 'Japanese', dist: '0.8 mi', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=200' }
];

const attractionsData = [
    { name: 'Modern Art Museum', type: 'Culture', dist: '0.8 mi', img: 'https://images.unsplash.com/photo-1518998053401-b439185d5786?auto=format&fit=crop&q=80&w=200' },
    { name: 'Botanical Gardens', type: 'Nature', dist: '1.2 mi', img: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&q=80&w=200' },
    { name: 'Historic Downtown Walk', type: 'Sightseeing', dist: '0.5 mi', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=200' },
    { name: 'Grand Symphony Hall', type: 'Entertainment', dist: '1.5 mi', img: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&q=80&w=200' },
    { name: 'Luxury Shopping Plaza', type: 'Retail', dist: '0.3 mi', img: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&q=80&w=200' }
];

const heroImages = [
    'https://images.unsplash.com/photo-1542314831-c6a4d14d8387?auto=format&fit=crop&q=80&w=1920', // Exterior
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=1920', // Spa
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1920', // Lobby
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=1920'  // Room view
];

// Initialize Data
function init() {
    updateClock();
    setInterval(updateClock, 10000); // Update every 10s

    populateTVGuide();
    populateList('restaurants-scroll', restaurantsData);
    populateList('attractions-scroll', attractionsData);

    // Setup auto-scrolling
    setupAutoScroll('tv-scroll');
    setupAutoScroll('restaurants-scroll');
    setupAutoScroll('attractions-scroll');

    // Setup Hero Image Rotation
    let heroIndex = 0;
    setInterval(() => {
        heroIndex = (heroIndex + 1) % heroImages.length;
        document.getElementById('welcome-hero').style.backgroundImage = `url('${heroImages[heroIndex]}')`;
    }, 15000); // Change every 15 seconds
}

// Clock Update
function updateClock() {
    const now = new Date();

    // Time
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('current-time').textContent = `${hours}:${minutes}`;

    // Date
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', options);
}

// Populate UI
function populateTVGuide() {
    const container = document.querySelector('#tv-scroll .scroll-content');
    tvGuideData.forEach((item) => {
        const div = document.createElement('div');
        div.className = `tv-item ${item.time === 'NOW PLAYING' ? 'active' : ''}`;
        div.innerHTML = `
            <div class="tv-time">${item.time}</div>
            <div class="tv-title">${item.title}</div>
            <div class="tv-desc">${item.desc}</div>
        `;
        container.appendChild(div);
    });

    // Clone for infinite scroll
    const clone = container.innerHTML;
    container.innerHTML += clone;
}

function populateList(containerId, data) {
    const container = document.querySelector(`#${containerId} .scroll-content`);
    data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <div class="item-img" style="background-image: url('${item.img}')"></div>
            <div class="item-info">
                <div class="item-title">${item.name}</div>
                <div class="item-meta">
                    <span>${item.type}</span>
                    <span class="item-dist">${item.dist}</span>
                </div>
            </div>
        `;
        container.appendChild(div);
    });

    // Clone for infinite scroll
    const clone = container.innerHTML;
    container.innerHTML += clone;
}

// Auto Scroll Animation
function setupAutoScroll(containerId) {
    const container = document.getElementById(containerId);
    const content = container.querySelector('.scroll-content');

    let scrollPos = 0;
    const scrollSpeed = 0.5; // pixels per frame

    function scroll() {
        scrollPos += scrollSpeed;

        // When we've scrolled halfway (the height of original content), reset to 0
        if (scrollPos >= content.scrollHeight / 2) {
            scrollPos = 0;
        }

        content.style.transform = `translateY(-${scrollPos}px)`;
        requestAnimationFrame(scroll);
    }

    // Slight delay so they don't all look perfectly synced
    setTimeout(() => {
        requestAnimationFrame(scroll);
    }, Math.random() * 2000);
}

// Start
document.addEventListener('DOMContentLoaded', init);