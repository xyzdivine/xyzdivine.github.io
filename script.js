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


    // Customization panel elements
    const customizeToggleBtn = document.getElementById('customizeToggleBtn');
    const customizationPanel = document.getElementById('customizationPanel');
    const closePanelBtn = document.getElementById('closePanelBtn');
    const siteNameInput = document.getElementById('siteNameInput');
    const siteDescriptionInput = document.getElementById('siteDescriptionInput');
    const viewsCountInput = document.getElementById('viewsCountInput');
    const albumArtInput = document.getElementById('albumArtInput');
    const songTitleInput = document.getElementById('songTitleInput');
    const artistNameInput = document.getElementById('artistNameInput');
    const audioSourceInput = document.getElementById('audioSourceInput');
    const backgroundUrlInput = document.getElementById('backgroundUrlInput');
    const bgOpacityInput = document.getElementById('bgOpacityInput');
    const bgOpacityValue = document.getElementById('bgOpacityValue');
    const mainColorInput = document.getElementById('mainColorInput');
    const subColorInput = document.getElementById('subColorInput');
    const cardBgColorInput = document.getElementById('cardBgColorInput');
    const resetCustomizationsBtn = document.getElementById('resetCustomizations');

    // Volume customization input
    const volumeInput = document.getElementById('volumeInput');
    const volumeValueSpan = document.getElementById('volumeValue');


    // Link Customization Elements
    const mainLinksContainer = document.getElementById('mainLinksContainer');
    const linkCustomizationSections = document.getElementById('linkCustomizationSections');
    const addLinkBtn = document.getElementById('addLinkBtn');

    // Social Link Customization Elements
    const socialLinksContainer = document.getElementById('socialLinksContainer');
    const socialLinkCustomizationSections = document.getElementById('socialLinkCustomizationSections');
    const addSocialLinkBtn = document.getElementById('addSocialLinkBtn');

    // Default values (for reset functionality)
    const defaultSettings = {
        siteName: 'divine',
        siteDescription: 'this is my divine presence',
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
        viewsIcon.style.color = settings.mainColor;

        // Music player colors (times only)
        currentTimeSpan.style.color = settings.subColor;
        durationSpan.style.color = settings.subColor;

        // Apply volume setting
        audioPlayer.volume = settings.volume;
        volumeSliderTopLeft.value = settings.volume;
        volumeInput.value = settings.volume;
        volumeValueSpan.textContent = `${Math.round(settings.volume * 100)}%`;
        updateVolumeIcon(settings.volume);

        // Update input values in the panel
        siteNameInput.value = settings.siteName;
        siteDescriptionInput.value = settings.siteDescription;
        viewsCountInput.value = settings.viewsCount;
        albumArtInput.value = settings.albumArtUrl;
        songTitleInput.value = settings.songTitle;
        artistNameInput.value = settings.artistName;
        audioSourceInput.value = settings.audioSource;
        backgroundUrlInput.value = settings.backgroundUrl;
        bgOpacityInput.value = settings.bgOpacity;
        bgOpacityValue.textContent = parseFloat(settings.bgOpacity).toFixed(2);
        mainColorInput.value = settings.mainColor;
        subColorInput.value = settings.subColor;
        cardBgColorInput.value = settings.cardBgColor;

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
        renderSocialLinkCustomizationInputs(settings.socialLinks);

        // Re-render main links and their customization inputs
        renderLinks(settings.links, settings.mainColor, settings.subColor, settings.cardBgColor);
        renderLinkCustomizationInputs(settings.links);

        // Update customization panel colors
        customizeToggleBtn.style.backgroundColor = settings.mainColor;
        customizeToggleBtn.style.color = getComputedStyle(document.body).backgroundColor;
        customizeToggleBtn.style.boxShadow = `0 0 10px ${settings.mainColor}80`;
        customizationPanel.style.backgroundColor = settings.cardBgColor;
        customizationPanel.style.borderColor = `${settings.mainColor}33`;
        customizationPanel.querySelector('h2').style.color = settings.mainColor;
        customizationPanel.querySelectorAll('.customization-section label, .customization-section span, h3').forEach(el => {
            el.style.color = settings.subColor;
        });
        customizationPanel.querySelectorAll('input[type="text"], input[type="color"], input[type="number"], input[type="range"]').forEach(input => {
            input.style.borderColor = `${settings.mainColor}33`;
            input.style.backgroundColor = '#2a3e57';
        });
        resetCustomizationsBtn.style.backgroundColor = '#dc3545';
        closePanelBtn.style.backgroundColor = settings.mainColor;
        closePanelBtn.style.color = getComputedStyle(document.body).backgroundColor;
        addLinkBtn.style.backgroundColor = '#28a745';
        addLinkBtn.style.color = 'white';
        addSocialLinkBtn.style.backgroundColor = '#28a745';
        addSocialLinkBtn.style.color = 'white';
    }

    // Load settings from Local Storage or apply defaults
    function loadSettings() {
        const savedSettings = JSON.parse(localStorage.getItem('siteCustomizations'));
        if (savedSettings) {
            currentSettings = { ...defaultSettings, ...savedSettings };
            currentSettings.links = savedSettings.links ? savedSettings.links.map(link => ({ ...defaultSettings.links[0], ...link })) : defaultSettings.links;
            currentSettings.socialLinks = savedSettings.socialLinks ? savedSettings.socialLinks.map(link => ({ ...defaultSettings.socialLinks[0], ...link })) : defaultSettings.socialLinks;
        } else {
            currentSettings = { ...defaultSettings };
        }
        applySettings(currentSettings);
    }

    // Save settings to Local Storage
    function saveSettings() {
        currentSettings.siteName = siteNameInput.value;
        currentSettings.siteDescription = siteDescriptionInput.value;
        currentSettings.viewsCount = parseInt(viewsCountInput.value);
        currentSettings.albumArtUrl = albumArtInput.value;
        currentSettings.songTitle = songTitleInput.value;
        currentSettings.artistName = artistNameInput.value;
        currentSettings.audioSource = audioSourceInput.value;
        currentSettings.backgroundUrl = backgroundUrlInput.value;
        currentSettings.bgOpacity = parseFloat(bgOpacityInput.value);
        currentSettings.mainColor = mainColorInput.value;
        currentSettings.subColor = subColorInput.value;
        currentSettings.cardBgColor = cardBgColorInput.value;
        currentSettings.volume = parseFloat(volumeInput.value);


        localStorage.setItem('siteCustomizations', JSON.stringify(currentSettings));
    }

    // --- Customization Panel Event Listeners ---
    siteNameInput.addEventListener('input', () => {
        siteTitle.textContent = siteNameInput.value;
        siteName.textContent = siteNameInput.value;
        saveSettings();
    });
    siteDescriptionInput.addEventListener('input', () => {
        siteDescription.textContent = siteDescriptionInput.value;
        saveSettings();
    });
    viewsCountInput.addEventListener('input', () => {
        viewsCountSpan.textContent = viewsCountInput.value;
        saveSettings();
    });
    albumArtInput.addEventListener('input', () => {
        albumArt.src = albumArtInput.value;
        saveSettings();
    });
    songTitleInput.addEventListener('input', () => {
        playerSongTitle.textContent = songTitleInput.value;
        saveSettings();
    });
    artistNameInput.addEventListener('input', () => {
        saveSettings();
    });
    audioSourceInput.addEventListener('input', () => {
        const wasPlaying = !audioPlayer.paused;
        audioPlayer.src = audioSourceInput.value;
        audioPlayer.load();
        if (wasPlaying) {
            audioPlayer.play().catch(e => console.error("Autoplay prevented:", e));
        } else {
            playPauseBtn.classList.remove('fa-pause');
            playPauseBtn.classList.add('fa-play');
            isPlaying = false;
        }
        saveSettings();
    });
    backgroundUrlInput.addEventListener('input', () => {
        backgroundFullImage.style.backgroundImage = `url('${backgroundUrlInput.value}')`;
        saveSettings();
    });
    bgOpacityInput.addEventListener('input', () => {
        backgroundFullImage.style.opacity = bgOpacityInput.value;
        bgOpacityValue.textContent = parseFloat(bgOpacityInput.value).toFixed(2);
        saveSettings();
    });
    mainColorInput.addEventListener('input', () => {
        currentSettings.mainColor = mainColorInput.value;
        applySettings(currentSettings);
        saveSettings();
    });
    subColorInput.addEventListener('input', () => {
        currentSettings.subColor = subColorInput.value;
        applySettings(currentSettings);
    });
    cardBgColorInput.addEventListener('input', () => {
        currentSettings.cardBgColor = cardBgColorInput.value;
        applySettings(currentSettings);
        saveSettings();
    });

    // Volume Input in Customization Panel
    volumeInput.addEventListener('input', () => {
        const newVolume = parseFloat(volumeInput.value);
        audioPlayer.volume = newVolume;
        volumeSliderTopLeft.value = newVolume; // Update top-left slider
        volumeValueSpan.textContent = `${Math.round(newVolume * 100)}%`;
        updateVolumeIcon(newVolume); // Update icon on volume change
        saveSettings();
    });

    // Main Link Customization Button Listener
    addLinkBtn.addEventListener('click', addLink);

    // Social Link Customization Button Listener
    addSocialLinkBtn.addEventListener('click', addSocialLink);

    // Toggle customization panel
    customizeToggleBtn.addEventListener('click', () => {
        customizationPanel.classList.add('open');
    });
    closePanelBtn.addEventListener('click', () => {
        customizationPanel.classList.remove('open');
    });

    // Reset to default
    resetCustomizationsBtn.addEventListener('click', () => {
        localStorage.removeItem('siteCustomizations');
        currentSettings = { ...defaultSettings };
        currentSettings.links = defaultSettings.links.map(link => ({...link}));
        currentSettings.socialLinks = defaultSettings.socialLinks.map(link => ({...link}));

        applySettings(currentSettings);
        bgOpacityInput.min = 0.5;
        bgOpacityInput.max = 1;
        bgOpacityInput.value = defaultSettings.bgOpacity;
        bgOpacityValue.textContent = parseFloat(defaultSettings.bgOpacity).toFixed(2);
        audioPlayer.src = defaultSettings.audioSource;
        audioPlayer.load();
        audioPlayer.volume = defaultSettings.volume; // Reset volume
        volumeSliderTopLeft.value = defaultSettings.volume;
        volumeInput.value = defaultSettings.volume;
        volumeValueSpan.textContent = `${Math.round(defaultSettings.volume * 100)}%`;
        updateVolumeIcon(defaultSettings.volume);

        if (isPlaying) {
             audioPlayer.pause();
             playPauseBtn.classList.remove('fa-pause');
             playPauseBtn.classList.add('fa-play');
             isPlaying = false;
        }
    });

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
        volumeInput.value = newVolume; // Update customization panel slider
        volumeValueSpan.textContent = `${Math.round(newVolume * 100)}%`;
        updateVolumeIcon(newVolume);
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
        volumeInput.value = audioPlayer.volume;
        volumeValueSpan.textContent = `${Math.round(audioPlayer.volume * 100)}%`;
        updateVolumeIcon(audioPlayer.volume);
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

    function renderLinkCustomizationInputs(links) {
        linkCustomizationSections.innerHTML = '';
        links.forEach((link, index) => {
            const linkItem = document.createElement('div');
            linkItem.classList.add('customization-section', 'link-customization-item');
            linkItem.setAttribute('data-link-id', link.id);

            linkItem.innerHTML = `
                <label>Link ${index + 1} Title:</label>
                <input type="text" data-link-prop="title" value="${link.title}">
                <label>Link ${index + 1} URL:</label>
                <input type="text" data-link-prop="url" value="${link.url}">
                <label>Link ${index + 1} Icon Class (e.g., fas fa-link):</label>
                <input type="text" data-link-prop="icon" value="${link.icon}">
                <label>Link ${index + 1} Description:</label>
                <input type="text" data-link-prop="description" value="${link.description}">
                <button class="remove-link-btn" data-link-id="${link.id}">X</button>
            `;
            linkCustomizationSections.appendChild(linkItem);
        });

        linkCustomizationSections.querySelectorAll('input[data-link-prop]').forEach(input => {
            input.addEventListener('input', updateLinkFromInput);
        });
        linkCustomizationSections.querySelectorAll('.remove-link-btn').forEach(button => {
            button.addEventListener('click', removeLink);
        });
    }

    function updateLinkFromInput(event) {
        const input = event.target;
        const linkId = parseInt(input.closest('.link-customization-item').getAttribute('data-link-id'));
        const prop = input.getAttribute('data-link-prop');
        const value = input.value;

        const linkIndex = currentSettings.links.findIndex(link => link.id === linkId);
        if (linkIndex !== -1) {
            currentSettings.links[linkIndex][prop] = value;
            saveSettings();
            renderLinks(currentSettings.links, currentSettings.mainColor, currentSettings.subColor, currentSettings.cardBgColor);
        }
    }

    function addLink() {
        const newId = Date.now();
        const newLink = {
            id: newId,
            title: 'New Link',
            url: '#',
            icon: 'fas fa-plus',
            description: 'New Description'
        };
        currentSettings.links.push(newLink);
        saveSettings();
        applySettings(currentSettings);
    }

    function removeLink(event) {
        const linkIdToRemove = parseInt(event.target.getAttribute('data-link-id'));
        currentSettings.links = currentSettings.links.filter(link => link.id !== linkIdToRemove);
        saveSettings();
        applySettings(currentSettings);
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

    function renderSocialLinkCustomizationInputs(socialLinks) {
        socialLinkCustomizationSections.innerHTML = '';
        socialLinks.forEach((socialLink, index) => {
            const socialLinkItem = document.createElement('div');
            socialLinkItem.classList.add('customization-section', 'social-link-customization-item');
            socialLinkItem.setAttribute('data-link-id', socialLink.id);

            socialLinkItem.innerHTML = `
                <label>Social Link ${index + 1} Icon Class (e.g., fab fa-discord):</label>
                <input type="text" data-link-prop="icon" value="${socialLink.icon}">
                <label>Social Link ${index + 1} URL:</label>
                <input type="text" data-link-prop="url" value="${socialLink.url}">
                <button class="remove-social-link-btn" data-link-id="${socialLink.id}">X</button>
            `;
            socialLinkCustomizationSections.appendChild(socialLinkItem);
        });

        socialLinkCustomizationSections.querySelectorAll('input[data-link-prop]').forEach(input => {
            input.addEventListener('input', updateSocialLinkFromInput);
        });
        socialLinkCustomizationSections.querySelectorAll('.remove-social-link-btn').forEach(button => {
            button.addEventListener('click', removeSocialLink);
        });
    }

    function updateSocialLinkFromInput(event) {
        const input = event.target;
        const linkId = parseInt(input.closest('.social-link-customization-item').getAttribute('data-link-id'));
        const prop = input.getAttribute('data-link-prop');
        const value = input.value;

        const linkIndex = currentSettings.socialLinks.findIndex(link => link.id === linkId);
        if (linkIndex !== -1) {
            currentSettings.socialLinks[linkIndex][prop] = value;
            saveSettings();
            renderSocialLinks(currentSettings.socialLinks, currentSettings.mainColor);
        }
    }

    function addSocialLink() {
        const newId = Date.now();
        const newSocialLink = {
            id: newId,
            icon: 'fas fa-globe',
            url: '#'
        };
        currentSettings.socialLinks.push(newSocialLink);
        saveSettings();
        applySettings(currentSettings);
    }

    function removeSocialLink(event) {
        const linkIdToRemove = parseInt(event.target.getAttribute('data-link-id'));
        currentSettings.socialLinks = currentSettings.socialLinks.filter(link => link.id !== linkIdToRemove);
        saveSettings();
        applySettings(currentSettings);
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
    }, { once: true });
});