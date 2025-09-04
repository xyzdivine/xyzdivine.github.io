// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const siteTitle = document.getElementById('siteTitle');
    const siteName = document.getElementById('siteName');
    const siteDescription = document.getElementById('siteDescription');
    const backgroundFullImage = document.querySelector('.background-full-image');
    const headerH1 = document.querySelector('.header h1');
    const footerStats = document.querySelector('.footer-stats');
    const viewsIcon = document.getElementById('viewsIcon');
    const viewsCountSpan = document.getElementById('viewsCount');

    // Splash Screen Elements
    const splashScreen = document.getElementById('splashScreen');
    const mainContent = document.getElementById('mainContent');

    // Music Player Elements
    const audioPlayer = document.getElementById('audioPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentTimeSpan = document.getElementById('currentTime');
    const durationSpan = document.getElementById('duration');
    const seekSlider = document.getElementById('seekSlider');

    const albumArt = document.getElementById('albumArt');
    const playerSongTitle = document.getElementById('playerSongTitle');

    // Top-Left Volume Control Elements - NEW
    const volumeIconTopLeft = document.getElementById('volumeIconTopLeft');
    const volumeSliderTopLeft = document.getElementById('volumeSliderTopLeft');

    // Link Customization Elements
    const mainLinksContainer = document.getElementById('mainLinksContainer');

    // Social Link Customization Elements
    const socialLinksContainer = document.getElementById('socialLinksContainer');

    // Default values (for reset functionality)
    const defaultSettings = {
        siteName: 'divine',
        siteDescription: '400+ vouches - click below for my market',
        viewsCount: 181,
        albumArtUrl: 'assets/album_art.jpg',
        songTitle: 'Superpowers',
        artistName: 'Tegam Sharem',
        audioSource: 'assets/audio.mp3',
        backgroundUrl: 'background.jpg',
        bgOpacity: 0.8,
        splashBgUrl: 'background.jpg',
        mainColor: '#9dc6ff',
        subColor: '#aaccff',
        cardBgColor: '#1f2f45',
        volume: 0.7, // Default volume
        socialLinks: [
            { id: Date.now() + 100, icon: 'fab fa-discord', url: 'https://discord.com' },
            { id: Date.now() + 101, icon: 'fab fa-twitter', url: 'https://twitter.com' },
            { id: Date.now() + 102, icon: 'fab fa-instagram', url: 'https://instagram.com' },
            { id: Date.now() + 103, icon: 'fab fa-tiktok', url: 'https://tiktok.com' },
            { id: Date.now() + 104, icon: 'fab fa-youtube', url: 'https://youtube.com' }
        ],
        links: [
            { id: Date.now() + 1, title: 'guns.lol', url: 'https://guns.lol', icon: 'fas fa-link', description: 'https://guns.lol' },
            { id: Date.now() + 2, title: 'Discord Server', url: 'https://discord.gg/guns', icon: 'fab fa-discord', description: 'https://discord.gg/guns' }
        ]
    };

    // Global variable to hold current settings
    let currentSettings = {};
    let isPlaying = false; // Music player state

    // Function to format time (e.g., 0:00)
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds === null) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Function to update player UI
    function updatePlayerUI() {
        currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);
        // Update seek slider value directly based on current time
        if (!seekSlider.dataset.isDragging) { // Only update if not currently being dragged by user
            seekSlider.value = audioPlayer.currentTime;
        }
    }

    // Function to update volume icon based on volume level
    function updateVolumeIcon(volume) {
        if (volume === 0) {
            volumeIconTopLeft.classList.remove('fa-volume-up', 'fa-volume-down');
            volumeIconTopLeft.classList.add('fa-volume-mute');
        } else if (volume > 0 && volume < 0.5) {
            volumeIconTopLeft.classList.remove('fa-volume-up', 'fa-volume-mute');
            volumeIconTopLeft.classList.add('fa-volume-down');
        } else {
            volumeIconTopLeft.classList.remove('fa-volume-down', 'fa-volume-mute');
            volumeIconTopLeft.classList.add('fa-volume-up');
        }
    }

    // Function to apply settings
    function applySettings(settings) {
        siteTitle.textContent = settings.siteName;
        siteName.textContent = settings.siteName;
        siteDescription.textContent = settings.siteDescription;
        viewsCountSpan.textContent = settings.viewsCount;

        backgroundFullImage.style.backgroundImage = `url('${settings.backgroundUrl}')`;
        backgroundFullImage.style.opacity = settings.bgOpacity;

        // Music player updates
        albumArt.src = settings.albumArtUrl;
        playerSongTitle.textContent = settings.songTitle;

        if (audioPlayer.src !== settings.audioSource && audioPlayer.src !== new URL(settings.audioSource, window.location.href).href) {
            const wasPlaying = !audioPlayer.paused;
            audioPlayer.src = settings.audioSource;
            audioPlayer.load();
            if (wasPlaying) {
                audioPlayer.play().catch(e => console.error("Autoplay prevented:", e));
            }
        }

        // Apply colors
        headerH1.style.color = settings.mainColor;
        siteDescription.style.color = settings.subColor;
        footerStats.style.color = settings.mainColor;
        footerStats.style.textShadow = `0 0 5px ${settings.mainColor}80`;
        // viewsIcon.style.color = settings.mainColor; // viewsIcon is not in the html, commented out.

        // Music player colors (times only)
        currentTimeSpan.style.color = settings.subColor;
        durationSpan.style.color = settings.subColor;

        // Apply volume setting
        audioPlayer.volume = settings.volume;
        volumeSliderTopLeft.value = settings.volume;
        updateVolumeIcon(settings.volume);

        // Set seek slider max based on audio duration
        if (audioPlayer.duration && !isNaN(audioPlayer.duration)) {
            seekSlider.max = audioPlayer.duration;
            durationSpan.textContent = formatTime(audioPlayer.duration);
        } else {
            durationSpan.textContent = "0:00";
            seekSlider.max = 1;
        }

        // Re-render social links and their customization inputs
        renderSocialLinks(settings.socialLinks, settings.mainColor);

        // Re-render main links and their customization inputs
        renderLinks(settings.links, settings.mainColor, settings.subColor, settings.cardBgColor);
    }

    // Load settings from Local Storage or apply defaults
    function loadSettings() {
        const savedSettings = JSON.parse(localStorage.getItem('siteCustomizations'));
        if (savedSettings) {
            // Only apply a limited set of customizations if they exist, but don't show the panel
            currentSettings = { ...defaultSettings,
                siteName: savedSettings.siteName || defaultSettings.siteName,
                siteDescription: savedSettings.siteDescription || defaultSettings.siteDescription,
                viewsCount: savedSettings.viewsCount || defaultSettings.viewsCount,
                albumArtUrl: savedSettings.albumArtUrl || defaultSettings.albumArtUrl,
                songTitle: savedSettings.songTitle || defaultSettings.songTitle,
                artistName: savedSettings.artistName || defaultSettings.artistName,
                audioSource: savedSettings.audioSource || defaultSettings.audioSource,
                backgroundUrl: savedSettings.backgroundUrl || defaultSettings.backgroundUrl,
                bgOpacity: savedSettings.bgOpacity || defaultSettings.bgOpacity,
                mainColor: savedSettings.mainColor || defaultSettings.mainColor,
                subColor: savedSettings.subColor || defaultSettings.subColor,
                cardBgColor: savedSettings.cardBgColor || defaultSettings.cardBgColor,
                volume: savedSettings.volume || defaultSettings.volume,
                socialLinks: savedSettings.socialLinks || defaultSettings.socialLinks,
                links: savedSettings.links || defaultSettings.links,
            };
        } else {
            currentSettings = { ...defaultSettings
            };
        }
        applySettings(currentSettings);
    }

    // Save settings to Local Storage - This function is now simplified as inputs are removed
    function saveSettings() {
        localStorage.setItem('siteCustomizations', JSON.stringify(currentSettings));
    }


    // --- Music Player Logic ---
    audioPlayer.addEventListener('loadedmetadata', () => {
        durationSpan.textContent = formatTime(audioPlayer.duration);
        seekSlider.max = audioPlayer.duration;
        // Keep initial play icon if not playing
        if (audioPlayer.paused) {
            playPauseBtn.classList.remove('fa-pause');
            playPauseBtn.classList.add('fa-play');
        } else {
            playPauseBtn.classList.remove('fa-play');
            playPauseBtn.classList.add('fa-pause');
        }
        updatePlayerUI(); // Call once metadata is loaded
    });

    audioPlayer.addEventListener('timeupdate', updatePlayerUI);

    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            audioPlayer.pause();
            playPauseBtn.classList.remove('fa-pause');
            playPauseBtn.classList.add('fa-play');
        } else {
            audioPlayer.play().catch(e => console.error("Autoplay prevented:", e));
            playPauseBtn.classList.remove('fa-play');
            playPauseBtn.classList.add('fa-pause');
        }
        isPlaying = !isPlaying;
    });

    seekSlider.addEventListener('mousedown', () => {
        seekSlider.dataset.isDragging = 'true';
    });

    seekSlider.addEventListener('mouseup', () => {
        seekSlider.dataset.isDragging = 'false';
        audioPlayer.currentTime = seekSlider.value;
    });

    seekSlider.addEventListener('input', () => {
        // Update current time display immediately during drag
        currentTimeSpan.textContent = formatTime(seekSlider.value);
    });

    prevBtn.addEventListener('click', () => {
        audioPlayer.currentTime = 0; // Or implement playlist skip logic
        if (!isPlaying) {
            audioPlayer.play().catch(e => console.error("Autoplay prevented:", e));
            playPauseBtn.classList.remove('fa-play');
            playPauseBtn.classList.add('fa-pause');
            isPlaying = true;
        }
    });

    nextBtn.addEventListener('click', () => {
        audioPlayer.currentTime = 0; // Or implement playlist skip logic
        if (!isPlaying) {
            audioPlayer.play().catch(e => console.error("Autoplay prevented:", e));
            playPauseBtn.classList.remove('fa-play');
            playPauseBtn.classList.add('fa-pause');
            isPlaying = true;
        }
    });

    audioPlayer.addEventListener('ended', () => {
        playPauseBtn.classList.remove('fa-pause');
        playPauseBtn.classList.add('fa-play');
        isPlaying = false;
        audioPlayer.currentTime = 0;
    });

    // --- Top-Left Volume Control Logic - NEW ---
    volumeSliderTopLeft.addEventListener('input', () => {
        const newVolume = parseFloat(volumeSliderTopLeft.value);
        audioPlayer.volume = newVolume;
        updateVolumeIcon(newVolume);
        // This is the only place we need to manually update and save settings now
        currentSettings.volume = newVolume;
        saveSettings();
    });

    // Toggle mute on volume icon click (top-left)
    let lastVolume = defaultSettings.volume; // Store last volume before mute
    volumeIconTopLeft.addEventListener('click', () => {
        if (audioPlayer.volume > 0) {
            lastVolume = audioPlayer.volume; // Save current volume
            audioPlayer.volume = 0;
        } else {
            audioPlayer.volume = lastVolume > 0 ? lastVolume : 0.7; // Restore or default
        }
        volumeSliderTopLeft.value = audioPlayer.volume;
        updateVolumeIcon(audioPlayer.volume);
        currentSettings.volume = audioPlayer.volume;
        saveSettings();
    });


    // --- Main Link Customization Functions ---
    function renderLinks(links, mainColor, subColor, cardBgColor) {
        mainLinksContainer.innerHTML = '';
        links.forEach(link => {
            const linkCard = document.createElement('a');
            linkCard.href = link.url;
            linkCard.classList.add('link-card');
            linkCard.target = '_blank';

            linkCard.style.backgroundColor = `${cardBgColor}b3`;
            linkCard.style.borderColor = `${mainColor}33`;

            linkCard.innerHTML = `
                <i class="${link.icon}" style="color: ${mainColor};"></i>
                <div class="link-text">
                    <h2 style="color: white;">${link.title}</h2>
                    <p style="color: ${subColor};">${link.description}</p>
                </div>
            `;
            mainLinksContainer.appendChild(linkCard);
        });
    }


    // --- Social Link Customization Functions ---
    function renderSocialLinks(socialLinks, mainColor) {
        socialLinksContainer.innerHTML = '';
        socialLinks.forEach(socialLink => {
            const socialIconElement = document.createElement('a');
            socialIconElement.href = socialLink.url;
            socialIconElement.classList.add('social-icon');
            socialIconElement.target = '_blank';
            socialIconElement.innerHTML = `<i class="${socialLink.icon}" style="color: ${mainColor}; text-shadow: 0 0 8px ${mainColor}80;"></i>`;
            socialLinksContainer.appendChild(socialIconElement);
        });
    }

    // Handle splash screen click
    splashScreen.addEventListener('click', () => {
        splashScreen.classList.add('hidden');
        mainContent.classList.add('visible');
        // Try to play audio after user interaction
        audioPlayer.play().catch(e => {
            console.error("Autoplay prevented:", e);
            playPauseBtn.classList.remove('fa-pause');
            playPauseBtn.classList.add('fa-play');
            isPlaying = false;
        });
        // If autoplay succeeds, change to pause icon, otherwise keep play
        if (!audioPlayer.paused) {
            playPauseBtn.classList.remove('fa-play');
            playPauseBtn.classList.add('fa-pause');
            isPlaying = true;
        } else {
            playPauseBtn.classList.remove('fa-pause');
            playPauseBtn.classList.add('fa-play');
            isPlaying = false;
        }
    });

    // Initial load of settings
    loadSettings();
    // Ensure music player UI is updated on initial load, even if paused
    audioPlayer.addEventListener('loadeddata', () => {
        updatePlayerUI();
    }, {
        once: true
    });
});
