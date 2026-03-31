// Fetch and parse data.json
async function loadAppData() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to load app data:', error);
    return null;
  }
}

let heroImages = [];
let heroIndex = 0;
let heroInterval = null;

async function init() {
    const data = await loadAppData();
    if (!data) return;

    // Apply ALL data-driven styles before revealing
    const settings = data.sections.app_settings;
    document.documentElement.style.setProperty('--background-color', settings.background_color.value);
    document.documentElement.style.setProperty('--panel-bg', settings.panel_bg_color.value);
    document.documentElement.style.setProperty('--panel-border', settings.panel_border_color.value);
    document.documentElement.style.setProperty('--text-main', settings.text_main_color.value);
    document.documentElement.style.setProperty('--text-muted', settings.text_muted_color.value);
    document.documentElement.style.setProperty('--accent-gold', settings.accent_color.value);
    document.documentElement.style.setProperty('--accent-gold-dim', settings.accent_dim_color.value);

    // Apply storefront content
    const storefront = data.sections.storefront;
    document.getElementById('hotel-name').innerHTML = storefront.hotel_name.value;
    document.getElementById('room-number').innerHTML = storefront.room_number.value;
    document.getElementById('welcome-subheading').innerHTML = storefront.welcome_subheading.value;

    // Convert newlines to br tags for the guest name to preserve visual break
    document.getElementById('welcome-guest-name').innerHTML = storefront.welcome_guest_name.value.replace(/\n/g, '<br>');
    document.getElementById('welcome-message').innerText = storefront.welcome_message.value;

    // Apply widget text & images
    const widgets = data.sections.widgets;
    document.getElementById('weather-title').innerHTML = widgets.weather_title.value;
    document.getElementById('tv-title').innerHTML = widgets.tv_title.value;
    document.getElementById('dining-title').innerHTML = widgets.dining_title.value;
    document.getElementById('attractions-title').innerHTML = widgets.attractions_title.value;
    document.getElementById('rs-title').innerHTML = widgets.room_service_title.value;
    document.getElementById('rs-desc').innerText = widgets.room_service_desc.value;
    document.getElementById('rs-cta').innerText = widgets.room_service_cta.value;

    // Set RS image as background
    document.getElementById('rs-image').style.backgroundImage = `url('${widgets.room_service_image.value}')`;

    // Process Hero Images
    const heroData = [...data.sections.hero_images.value].sort((a, b) => a.sort_order - b.sort_order);
    heroImages = heroData.map(h => h.image);

    if (heroImages.length > 0) {
        document.getElementById('welcome-hero').style.backgroundImage = `url('${heroImages[0]}')`;
        if (heroImages.length > 1) {
            heroInterval = setInterval(() => {
                heroIndex = (heroIndex + 1) % heroImages.length;
                document.getElementById('welcome-hero').style.backgroundImage = `url('${heroImages[heroIndex]}')`;
            }, 15000); // Change every 15 seconds
        }
    }

    // Process TV Guide
    const tvGuideData = [...data.sections.tv_guide.value].sort((a, b) => a.sort_order - b.sort_order);
    populateTVGuide(tvGuideData);

    // Process Restaurants
    const restaurantsData = [...data.sections.restaurants.value].sort((a, b) => a.sort_order - b.sort_order);
    populateList('restaurants-scroll', restaurantsData);

    // Process Attractions
    const attractionsData = [...data.sections.attractions.value].sort((a, b) => a.sort_order - b.sort_order);
    populateList('attractions-scroll', attractionsData);

    // Reveal app
    document.getElementById('app-container').classList.add('loaded');

    // Start clock and loops
    updateClock();
    setInterval(updateClock, 10000); // Update every 10s

    // Setup auto-scrolling
    setupAutoScroll('tv-scroll');
    setupAutoScroll('restaurants-scroll');
    setupAutoScroll('attractions-scroll');
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
function populateTVGuide(tvGuideData) {
    const container = document.querySelector('#tv-scroll .scroll-content');
    if(tvGuideData.length === 0) return;
    tvGuideData.forEach((item) => {
        const div = document.createElement('div');
        div.className = `tv-item ${item.time === 'NOW PLAYING' ? 'active' : ''}`;
        div.innerHTML = `
            <div class="tv-time">${item.time}</div>
            <div class="tv-title">${item.title}</div>
            <div class="tv-desc">${item.description}</div>
        `;
        container.appendChild(div);
    });

    // Clone for infinite scroll
    const clone = container.innerHTML;
    container.innerHTML += clone;
}

function populateList(containerId, data) {
    const container = document.querySelector(`#${containerId} .scroll-content`);
    if(data.length === 0) return;
    data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <div class="item-img" style="background-image: url('${item.image}')"></div>
            <div class="item-info">
                <div class="item-title">${item.name}</div>
                <div class="item-meta">
                    <span>${item.type}</span>
                    <span class="item-dist">${item.distance}</span>
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
    if (!container) return;
    const content = container.querySelector('.scroll-content');
    if (!content || content.children.length === 0) return;

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