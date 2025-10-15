// Culture Therapy - JavaScript

            // Leaf Bush Animation System
            class LeafBushAnimation {
                constructor() {
                    this.images = [
                        'assets/Creation Tool/Natal Plum Bush Leaves 1.png',
                        'assets/Creation Tool/Natal Plum Bush Leaves 2.png',
                        'assets/Creation Tool/Natal Plum Bush Leaves 3.png'
                    ];
                    this.currentIndex = 0;
                    this.interval = null;
                    this.isActive = true;
                    this.isMusicPlaying = false;
                    
                    this.init();
                }
                
                init() {
                    const leafBushImgs = document.querySelectorAll('.leaf-bush-img');
                    if (leafBushImgs.length > 0) {
                        this.startAnimation();
                        this.initFruitInteraction();
                    }
                }
                
                startAnimation() {
                    if (this.interval) {
                        clearInterval(this.interval);
                    }
                    
                    this.interval = setInterval(() => {
                        if (this.isActive) {
                            this.cycleImage();
                        }
                    }, 500); // Change every half second
                }
                
                cycleImage() {
                    const leafBushImgs = document.querySelectorAll('.leaf-bush-img');
                    leafBushImgs.forEach(img => {
                        this.currentIndex = (this.currentIndex + 1) % this.images.length;
                        img.src = this.images[this.currentIndex];
                    });
                }
                
                // Music-reactive flower animation control
                setMusicPlaying(isPlaying) {
                    this.isMusicPlaying = isPlaying;
                    const flowers = document.querySelectorAll('.bush-flower');
                    
                    flowers.forEach(flower => {
                        if (isPlaying) {
                            flower.classList.add('music-playing');
                        } else {
                            flower.classList.remove('music-playing');
                        }
                    });
                }
                
                // Fruit falling interaction
                initFruitInteraction() {
                    const leafBushes = document.querySelectorAll('.leaf-bush');
                    console.log('Found leaf bushes:', leafBushes.length);
                    
                    leafBushes.forEach((bush, index) => {
                        console.log(`Setting up mousedown for bush ${index}`);
                        
                        // Use mousedown instead of click to avoid drag interference
                        bush.addEventListener('mousedown', (e) => {
                            console.log('Bush mousedown!', e.target);
                            e.stopPropagation();
                            e.preventDefault(); // Prevent drag from starting
                            this.makeFruitsFall(bush);
                        });
                    });
                }
                
                makeFruitsFall(bush) {
                    const fruits = bush.querySelectorAll('.bush-fruit');
                    console.log('Making fruits fall! Found fruits:', fruits.length);
                    
                    if (fruits.length === 0) return;
                    
                    // Find the first fruit that's not currently animating
                    let fruitToFall = null;
                    for (let fruit of fruits) {
                        if (!fruit.classList.contains('falling') && 
                            !fruit.classList.contains('fading') && 
                            !fruit.classList.contains('reappearing')) {
                            fruitToFall = fruit;
                            break;
                        }
                    }
                    
                    if (!fruitToFall) {
                        console.log('All fruits are currently animating');
                        return;
                    }
                    
                    // Calculate fall distance based on fruit's position within the bush
                    const bushRect = bush.getBoundingClientRect();
                    const fruitRect = fruitToFall.getBoundingClientRect();
                    const relativeTop = fruitRect.top - bushRect.top;
                    const bushHeight = bushRect.height;
                    const fallDistance = bushHeight - relativeTop + 20; // Add 20px buffer
                    
                    console.log('Falling fruit:', fruitToFall, 'Distance:', fallDistance);
                    
                    // Set the fall distance as a CSS custom property
                    fruitToFall.style.setProperty('--fall-distance', `${fallDistance}px`);
                    
                    // Reset any existing animations
                    fruitToFall.classList.remove('falling', 'fading', 'reappearing');
                    
                    // Start falling animation
                    setTimeout(() => {
                        fruitToFall.classList.add('falling');
                    }, 100);
                    
                    // Immediately after hitting ground (1.2s), start fading
                    setTimeout(() => {
                        fruitToFall.classList.remove('falling');
                        fruitToFall.classList.add('fading');
                    }, 1300); // 1.2s fall + 0.1s buffer
                    
                    // After fade completes, wait a bit more then reset position invisibly
                    setTimeout(() => {
                        fruitToFall.classList.remove('fading');
                        // Wait a bit more to ensure it's completely invisible
                        setTimeout(() => {
                            // Reset to original position while invisible
                            fruitToFall.style.setProperty('--fall-distance', '0px');
                            fruitToFall.style.transform = 'translateY(0) rotate(0deg)';
                        }, 200); // Additional 200ms buffer
                    }, 1800); // 1.3s fade start + 0.5s fade duration
                    
                    // After 10 seconds total, reappear
                    setTimeout(() => {
                        fruitToFall.classList.add('reappearing');
                        
                        // Clean up after reappear animation
                        setTimeout(() => {
                            fruitToFall.classList.remove('reappearing');
                        }, 500);
                    }, 10000);
                }
                
                stopAnimation() {
                    this.isActive = false;
                    if (this.interval) {
                        clearInterval(this.interval);
                    }
                }
                
                resumeAnimation() {
                    this.isActive = true;
                    this.startAnimation();
                }
            }

// Wind System
class WindSystem {
    constructor() {
        this.windStrength = 1.0; // 0.0 to 2.0
        this.windDirection = 1; // -1 to 1 (left to right)
        this.windVariation = 0.3; // How much the wind varies
        this.isActive = true;
        
        this.init();
    }
    
    init() {
        // Apply wind to all plant elements
        this.applyWindToPlants();
        
        // Start wind variation
        this.startWindVariation();
    }
    
    applyWindToPlants() {
        const plants = document.querySelectorAll('.plants');
        plants.forEach(plant => {
            plant.style.setProperty('--wind-strength', this.windStrength);
            plant.style.setProperty('--wind-direction', this.windDirection);
        });
    }
    
    startWindVariation() {
        if (!this.isActive) return;
        
        // Gradually change wind strength
        const variation = (Math.random() - 0.5) * this.windVariation;
        this.windStrength = Math.max(0.1, Math.min(2.0, this.windStrength + variation));
        
        // Occasionally change wind direction
        if (Math.random() < 0.1) {
            this.windDirection = Math.random() < 0.5 ? -1 : 1;
        }
        
        this.applyWindToPlants();
        
        // Schedule next wind change
        setTimeout(() => this.startWindVariation(), 2000 + Math.random() * 3000);
    }
    
    setWindStrength(strength) {
        this.windStrength = Math.max(0, Math.min(2, strength));
        this.applyWindToPlants();
    }
    
    setWindDirection(direction) {
        this.windDirection = direction > 0 ? 1 : -1;
        this.applyWindToPlants();
    }
    
    stop() {
        this.isActive = false;
    }
    
    start() {
        this.isActive = true;
        this.startWindVariation();
    }
}

// (Removed) Path Tile System

// Speaker System
class SpeakerSystem {
    constructor() {
        this.speakers = [];
        this.init();
    }
    
    init() {
        // Find all speakers and add click handlers
        const speakerElements = document.querySelectorAll('.speaker');
        speakerElements.forEach((speaker, index) => {
            this.speakers.push({
                element: speaker,
                direction: 0,
                id: speaker.id || `speaker-${index}`
            });
            
            // Add click handler
            speaker.addEventListener('click', (e) => {
                e.stopPropagation();
                this.rotateSpeaker(speaker);
            });
        });
        
        console.log(`Initialized ${this.speakers.length} speakers`);
    }
    
    rotateSpeaker(speakerElement) {
        const speaker = this.speakers.find(s => s.element === speakerElement);
        if (!speaker) return;
        
        // Cycle through directions: 0 -> 1 -> 2 -> 3 -> 0
        speaker.direction = (speaker.direction + 1) % 4;
        
        // Remove all direction classes
        speakerElement.classList.remove('direction-0', 'direction-1', 'direction-2', 'direction-3');
        
        // Add new direction class
        speakerElement.classList.add(`direction-${speaker.direction}`);
        
        console.log(`Speaker ${speaker.id} rotated to direction ${speaker.direction}`);
    }
    
    getSpeakerDirection(speakerId) {
        const speaker = this.speakers.find(s => s.id === speakerId);
        return speaker ? speaker.direction : 0;
    }
    
    setSpeakerDirection(speakerId, direction) {
        const speaker = this.speakers.find(s => s.id === speakerId);
        if (!speaker) return;
        
        direction = direction % 4; // Ensure it's 0-3
        speaker.direction = direction;
        
        // Update visual state
        speaker.element.classList.remove('direction-0', 'direction-1', 'direction-2', 'direction-3');
        speaker.element.classList.add(`direction-${direction}`);
    }
}

// Artifact Click System (formerly Drag and Drop System)
class DragDropSystem {
    constructor() {
        this.init();
    }
    
    init() {
        // Add click event listeners to all clickable artifacts
        document.querySelectorAll('.draggable').forEach(element => {
            this.makeClickable(element);
        });
        
        // Setup sonarium plant
        this.setupSonariumPlant();
    }
    
    makeClickable(element) {
        // Click-to-open card stack for specific items
        if (element.classList.contains('bookshelf')) {
            element.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.cardStackSystem) {
                    window.cardStackSystem.openArtifactStack('bookshelf');
                }
            });
        }
        if (element.classList.contains('discplayer')) {
            element.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.cardStackSystem) {
                    window.cardStackSystem.openArtifactStack('discplayer');
                }
            });
        }
        if (element.classList.contains('wordswelove')) {
            element.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.cardStackSystem) {
                    window.cardStackSystem.openArtifactStack('wordswelove');
                }
            });
        }
        if (element.classList.contains('crafttable')) {
            element.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.cardStackSystem) {
                    window.cardStackSystem.openArtifactStack('crafttable');
                }
            });
        }
        if (element.classList.contains('ctxmailbox')) {
            element.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.cardStackSystem) {
                    window.cardStackSystem.openArtifactStack('ctxmailbox');
                }
            });
        }
    }
    
    setupSonariumPlant() {
        const sonariumPlant = document.querySelector('.sonarium-plant');
        if (sonariumPlant) {
            sonariumPlant.addEventListener('click', () => {
                this.showSonariumInfo();
            });
        }
    }
    
    showSonariumInfo() {
        // Get music player instance
        const musicPlayer = window.musicPlayer;
        if (musicPlayer) {
            const currentTrack = musicPlayer.getCurrentTrack();
            const playlist = musicPlayer.getPlaylist();
            
            console.log('🎵 SONARIUM PLANT INFO:');
            console.log(`Current Track: ${currentTrack.title}`);
            console.log(`Playlist (${playlist.length} tracks):`);
            playlist.forEach((track, index) => {
                console.log(`  ${index + 1}. ${track.title}`);
            });
            
            // Show a visual indicator
            const sonariumPlant = document.querySelector('.sonarium-plant');
            if (sonariumPlant) {
                sonariumPlant.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    sonariumPlant.style.transform = 'scale(1)';
                }, 200);
            }
        } else {
            console.log('🎵 SONARIUM PLANT: Music player not available');
        }
    }
    
    // Reusable modal methods (kept for backwards compatibility if needed elsewhere)
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            this.setupModalCloseListeners(modalId);
        }
    }
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    setupModalCloseListeners(modalId) {
        const modal = document.getElementById(modalId);
        const closeBtn = modal.querySelector('.modal-close');
        
        // Close button click
        if (closeBtn) {
            closeBtn.onclick = () => this.closeModal(modalId);
        }
        
        // Click outside modal to close
        modal.onclick = (e) => {
            if (e.target === modal) {
                this.closeModal(modalId);
            }
        };
        
        // ESC key to close
        const escHandler = (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                this.closeModal(modalId);
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }
    
    // Bookshelf specific method
    openBookshelfModal() {
        this.openModal('bookshelf-modal');
    }

    // Discplayer specific method
    openDiscplayerModal() {
        this.openModal('discplayer-modal');
    }

    // Words We Love specific method
    openWordsWeLoveModal() {
        this.openModal('wordswelove-modal');
    }
}



// Music Player System
class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('audioPlayer');
        this.playBtn = document.getElementById('playBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.timeDisplay = document.getElementById('timeDisplay');
        this.trackTitle = document.getElementById('trackTitle');
        this.progressBar = document.getElementById('progressBar');
        this.progressFill = document.getElementById('progressFill');
        this.progressHandle = document.getElementById('progressHandle');
        this.floatingNotes = document.getElementById('floatingNotes');
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.noteInterval = null;
        this.audioContext = null;
        this.analyser = null;
        this.isDragging = false;
        
        // Sonarium playlist - chakra healing tracks (paths updated for dreamscape/)
        this.playlist = [
            {
                title: "Grounded - Root",
                file: "sonarium/song remedy/Grounded - Root.mp3"
            },
            {
                title: "I Feel - Sacral", 
                file: "sonarium/song remedy/I Feel - Sacral.mp3"
            },
            {
                title: "On Purpose - Solar Plexus",
                file: "sonarium/song remedy/On Purpose - Solar Plexus.mp3"
            },
            {
                title: "Love Is - Heart",
                file: "sonarium/song remedy/Love Is - Heart.mp3"
            },
            {
                title: "I Speak - Throat",
                file: "sonarium/song remedy/I Speak - Throat.mp3"
            }
        ];
        
        this.init();
    }
    
    init() {
        // Set up event listeners
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.previousTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        this.audio.addEventListener('timeupdate', () => this.updateTime());
        this.audio.addEventListener('ended', () => this.nextTrack());
        this.audio.addEventListener('loadedmetadata', () => this.updateTime());
        
        // Progress bar events
        this.progressBar.addEventListener('click', (e) => this.seekTo(e));
        this.progressBar.addEventListener('mousedown', (e) => this.startDragging(e));
        document.addEventListener('mousemove', (e) => this.dragProgress(e));
        document.addEventListener('mouseup', () => this.stopDragging());
        
        // Load first track
        this.loadTrack(0);
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.togglePlay();
            } else if (e.code === 'ArrowLeft') {
                e.preventDefault();
                this.previousTrack();
            } else if (e.code === 'ArrowRight') {
                e.preventDefault();
                this.nextTrack();
            }
        });
    }
    
    loadTrack(index) {
        if (index >= 0 && index < this.playlist.length) {
            this.currentTrackIndex = index;
            const track = this.playlist[index];
            this.audio.src = track.file;
            this.audio.load();
            this.trackTitle.textContent = track.title;
            console.log(`🎵 Loaded: ${track.title}`);
        }
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.playBtn.textContent = '⏸';
            this.playBtn.classList.add('playing');
            this.startVisualEffects();
            // Start music-reactive flower animations
            if (window.leafBushAnimation) {
                window.leafBushAnimation.setMusicPlaying(true);
            }
        }).catch(error => {
            console.error('Error playing audio:', error);
        });
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.playBtn.textContent = '▶';
        this.playBtn.classList.remove('playing');
        this.stopVisualEffects();
        // Stop music-reactive flower animations
        if (window.leafBushAnimation) {
            window.leafBushAnimation.setMusicPlaying(false);
        }
    }
    
    nextTrack() {
        const nextIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.loadTrack(nextIndex);
        if (this.isPlaying) {
            this.play();
        }
    }
    
    previousTrack() {
        const prevIndex = this.currentTrackIndex === 0 ? this.playlist.length - 1 : this.currentTrackIndex - 1;
        this.loadTrack(prevIndex);
        if (this.isPlaying) {
            this.play();
        }
    }
    
    updateTime() {
        const current = this.formatTime(this.audio.currentTime);
        const duration = this.formatTime(this.audio.duration || 0);
        this.timeDisplay.textContent = `${current} / ${duration}`;
        
        // Update progress bar
        if (this.audio.duration && !this.isDragging) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.progressFill.style.width = `${progress}%`;
            this.progressHandle.style.left = `${progress}%`;
        }
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Public methods for external control
    setTrack(index) {
        this.loadTrack(index);
    }
    
    getCurrentTrack() {
        return this.playlist[this.currentTrackIndex];
    }
    
    getPlaylist() {
        return this.playlist;
    }
    
    // Visual Effects
    startVisualEffects() {
        this.startFloatingNotes();
        this.startSpeakerPulse();
        // Use basic pulsing for now to ensure audio works
        this.startBasicPulse();
    }
    
    stopVisualEffects() {
        this.stopFloatingNotes();
        this.stopSpeakerPulse();
    }
    
    startFloatingNotes() {
        // Create floating notes every 800ms
        this.noteInterval = setInterval(() => {
            this.createFloatingNote();
        }, 800);
    }
    
    stopFloatingNotes() {
        if (this.noteInterval) {
            clearInterval(this.noteInterval);
            this.noteInterval = null;
        }
    }
    
    createFloatingNote() {
        const note = document.createElement('div');
        note.className = 'music-note';
        note.textContent = Math.random() < 0.5 ? '♪' : '♫';
        
        // Get speaker positions
        const speakers = document.querySelectorAll('.speaker');
        const randomSpeaker = speakers[Math.floor(Math.random() * speakers.length)];
        const speakerRect = randomSpeaker.getBoundingClientRect();
        
        // Position note at speaker center
        note.style.left = (speakerRect.left + speakerRect.width / 2) + 'px';
        note.style.top = (speakerRect.top + speakerRect.height / 2) + 'px';
        
        // Add random variation
        note.style.left = (parseFloat(note.style.left) + (Math.random() - 0.5) * 20) + 'px';
        note.style.top = (parseFloat(note.style.top) + (Math.random() - 0.5) * 20) + 'px';
        
        this.floatingNotes.appendChild(note);
        
        // Remove note after animation
        setTimeout(() => {
            if (note.parentNode) {
                note.parentNode.removeChild(note);
            }
        }, 4000);
    }
    
    startSpeakerPulse() {
        const tweeters = document.querySelectorAll('.speaker-tweeter');
        const woofers = document.querySelectorAll('.speaker-woofer');
        const sonariumPlant = document.querySelector('.sonarium-plant');
        
        tweeters.forEach(tweeter => tweeter.classList.add('pulsing'));
        woofers.forEach(woofer => woofer.classList.add('pulsing'));
        
        // Make sonarium plant reactive to music
        if (sonariumPlant) {
            sonariumPlant.classList.add('music-playing');
        }
    }
    
    stopSpeakerPulse() {
        const tweeters = document.querySelectorAll('.speaker-tweeter');
        const woofers = document.querySelectorAll('.speaker-woofer');
        const sonariumPlant = document.querySelector('.sonarium-plant');
        
        tweeters.forEach(tweeter => tweeter.classList.remove('pulsing'));
        woofers.forEach(woofer => woofer.classList.remove('pulsing'));
        
        // Stop sonarium plant music reactivity
        if (sonariumPlant) {
            sonariumPlant.classList.remove('music-playing');
        }
    }
    
    setupAudioAnalysisDelayed() {
        // Wait a bit for audio to start playing, then try to set up analysis
        setTimeout(() => {
            if (this.isPlaying) {
                this.setupAudioAnalysis();
            }
        }, 1000);
    }
    
    setupAudioAnalysis() {
        // Only try audio analysis if not already set up
        if (this.analyser) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            const source = this.audioContext.createMediaElementSource(this.audio);
            
            // Connect source to analyser, then analyser to destination
            source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
            this.analyser.fftSize = 256;
            const bufferLength = this.analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            
            const analyzeAudio = () => {
                if (this.isPlaying) {
                    this.analyser.getByteFrequencyData(dataArray);
                    this.updateSpeakerPulse(dataArray);
                    requestAnimationFrame(analyzeAudio);
                }
            };
            
            analyzeAudio();
            console.log('🎵 Audio analysis connected');
        } catch (error) {
            console.log('Audio analysis not available, using basic pulsing:', error);
            // Fallback to basic pulsing without audio analysis
            this.startBasicPulse();
        }
    }
    
    startBasicPulse() {
        // Fallback: basic pulsing without audio analysis
        const tweeters = document.querySelectorAll('.speaker-tweeter');
        const woofers = document.querySelectorAll('.speaker-woofer');
        
        tweeters.forEach(tweeter => {
            tweeter.style.animationDuration = '0.5s';
        });
        
        woofers.forEach(woofer => {
            woofer.style.animationDuration = '0.8s';
        });
    }
    
    updateSpeakerPulse(dataArray) {
        // Calculate average frequency for reactive pulsing
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const intensity = average / 255; // Normalize to 0-1
        
        // Update pulse speed based on audio intensity
        const tweeters = document.querySelectorAll('.speaker-tweeter');
        const woofers = document.querySelectorAll('.speaker-woofer');
        
        const pulseSpeed = 0.3 + (intensity * 0.7); // 0.3s to 1s
        
        tweeters.forEach(tweeter => {
            tweeter.style.animationDuration = `${pulseSpeed}s`;
        });
        
        woofers.forEach(woofer => {
            woofer.style.animationDuration = `${pulseSpeed * 1.5}s`;
        });
    }
    
    // Progress Bar Methods
    seekTo(e) {
        if (this.isDragging) return;
        
        const rect = this.progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        const newTime = percentage * this.audio.duration;
        
        this.audio.currentTime = newTime;
    }
    
    startDragging(e) {
        this.isDragging = true;
        this.dragProgress(e);
    }
    
    dragProgress(e) {
        if (!this.isDragging) return;
        
        const rect = this.progressBar.getBoundingClientRect();
        const dragX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, dragX / rect.width));
        
        this.progressFill.style.width = `${percentage * 100}%`;
        this.progressHandle.style.left = `${percentage * 100}%`;
        
        // Update time display during drag
        const newTime = percentage * this.audio.duration;
        const current = this.formatTime(newTime);
        const duration = this.formatTime(this.audio.duration || 0);
        this.timeDisplay.textContent = `${current} / ${duration}`;
    }
    
    stopDragging() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        
        // Seek to the dragged position
        const percentage = parseFloat(this.progressFill.style.width) / 100;
        this.audio.currentTime = percentage * this.audio.duration;
    }
}

// Eye Tracking System
class EyeTracker {
    constructor() {
        this.logoContainer = document.getElementById('logoContainer');
        this.logoEyes = document.getElementById('logoEyes');
        this.leftEyeball = document.getElementById('leftEyeball');
        this.rightEyeball = document.getElementById('rightEyeball');
        this.eyeballBackgrounds = document.querySelector('.eyeball-backgrounds');
        this.isTracking = false;
        this.animationPhase = 'center'; // 'center' or 'bottom-left'
        this.blinkInterval = null;
        this.animationComplete = false;
        
        this.init();
        this.setupResizeListener();
    }
    
    setupResizeListener() {
        // Recalculate logo position when window resizes
        window.addEventListener('resize', () => {
            if (this.animationComplete && this.logoContainer) {
                this.repositionLogoToBottomLeft();
            }
        });
        
        // Wait for the intro animation to complete (2.5s), then mark as complete
        setTimeout(() => {
            this.animationComplete = true;
        }, 2500);
    }
    
    repositionLogoToBottomLeft() {
        if (!this.logoContainer) return;
        
        // Calculate the bottom-left position with proper scaling
        // The logo should be 10px from left and 80px from bottom
        const xOffset = -10 - window.innerWidth / 2;
        const yOffset = window.innerHeight - 80 - window.innerHeight / 2;
        
        this.logoContainer.style.transform = `translate(${xOffset}px, ${yOffset}px) scale(0.6)`;
        this.logoContainer.style.opacity = '1';
        
        console.log('🎨 Logo repositioned to bottom-left:', { xOffset, yOffset, windowSize: { w: window.innerWidth, h: window.innerHeight } });
    }
    
    init() {
        // Start tracking after logo animation begins
        setTimeout(() => {
            this.startTracking();
        }, 500);
        
        // Update animation phase when logo moves
        setTimeout(() => {
            this.animationPhase = 'bottom-left';
        }, 900); // When logo starts moving to bottom left
        
        // Heart blink when heart appears (0.2s delay + 0.2s for heart to appear)
        setTimeout(() => {
            this.heartBlink();
        }, 400);
        
        // Start periodic blinking after initial animations
        setTimeout(() => {
            this.startPeriodicBlinking();
        }, 3000);
    }
    
    startTracking() {
        this.isTracking = true;
        document.addEventListener('mousemove', (e) => this.trackMouse(e));
    }
    
    trackMouse(e) {
        if (!this.isTracking || !this.logoContainer || !this.logoEyes) return;
        
        const logoRect = this.logoContainer.getBoundingClientRect();
        const logoCenterX = logoRect.left + logoRect.width / 2;
        const logoCenterY = logoRect.top + logoRect.height / 2;
        
        // Calculate mouse position relative to logo center
        const mouseX = e.clientX - logoCenterX;
        const mouseY = e.clientY - logoCenterY;
        
        // Calculate distance and angle
        const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
        const maxDistance = 100; // Maximum tracking distance
        const normalizedDistance = Math.min(distance / maxDistance, 1);
        
        // Calculate eye movement (very limited range)
        const maxEyeMovement = 3; // Maximum pixels eyes can move (very subtle)
        const eyeX = (mouseX / distance) * normalizedDistance * maxEyeMovement;
        const eyeY = (mouseY / distance) * normalizedDistance * maxEyeMovement;
        
        // Apply transform to eyes
        this.logoEyes.style.transform = `translate(${eyeX}px, ${eyeY}px)`;
    }
    
    stopTracking() {
        this.isTracking = false;
        document.removeEventListener('mousemove', this.trackMouse);
    }
    
    // Heart blink - right eye only
    heartBlink() {
        if (this.rightEyeball) {
            this.rightEyeball.classList.add('blink');
            setTimeout(() => {
                this.rightEyeball.classList.remove('blink');
            }, 150);
        }
    }
    
    // Periodic blinking - both eyes together
    startPeriodicBlinking() {
        const scheduleNextBlink = () => {
            // Random interval between 2-6 seconds (like real animals)
            const nextBlink = Math.random() * 4000 + 2000;
            
            this.blinkInterval = setTimeout(() => {
                this.bothBlink();
                scheduleNextBlink(); // Schedule the next blink
            }, nextBlink);
        };
        
        scheduleNextBlink();
    }
    
    bothBlink() {
        if (this.eyeballBackgrounds) {
            this.eyeballBackgrounds.classList.add('blink');
            setTimeout(() => {
                this.eyeballBackgrounds.classList.remove('blink');
            }, 200);
        }
    }
    
    stopBlinking() {
        if (this.blinkInterval) {
            clearTimeout(this.blinkInterval);
            this.blinkInterval = null;
        }
    }
}

// Initialize wind system when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.windSystem = new WindSystem();
    // window.speakerSystem = new SpeakerSystem(); // Speakers removed
    window.dragDropSystem = new DragDropSystem();
    // Clear only saved data so CSS-defined positions remain
    if (window.dragDropSystem && typeof window.dragDropSystem.clearSavedPositionsOnly === 'function') {
        window.dragDropSystem.clearSavedPositionsOnly();
    }
    window.musicPlayer = new MusicPlayer();
    window.eyeTracker = new EyeTracker();
    window.leafBushAnimation = new LeafBushAnimation();
    window.artifactClusterSystem = new ArtifactClusterSystem();
    console.log('🎨 Artifact Cluster System initialized and available globally');
    
    // Initialize Card Stack System
    window.cardStackSystem = new CardStackSystem();
    // Connect it to the artifact content database
    window.cardStackSystem.setContentDatabase(window.artifactClusterSystem.contentDatabase);
    console.log('🎴 Card Stack System initialized and connected to content database');
    
    // Initialize Welcome Card System
    window.welcomeCardSystem = new WelcomeCardSystem();
    console.log('📝 Welcome Card System initialized');

    // Real dreamscape folder structure
    const realDreamscape = {
        name: 'dreamscape',
        children: [
            {
                name: 'sonarium',
                children: [
                    {
                        name: 'song remedy',
                        children: [
                            { name: 'Grounded - Root', type: 'audio' },
                            { name: 'I Feel - Sacral', type: 'audio' },
                            { name: 'On Purpose - Solar Plexus', type: 'audio' },
                            { name: 'Love Is - Heart', type: 'audio' },
                            { name: 'I Speak - Throat', type: 'audio' }
                        ]
                    }
                ]
            },
            {
                name: 'assets',
                children: [
                    { name: 'logo', type: 'visual' },
                    { name: 'fonts', type: 'visual' }
                ]
            },
            {
                name: 'visual',
                children: [
                    { name: 'sketches', type: 'visual' },
                    { name: 'paintings', type: 'visual' }
                ]
            },
            {
                name: 'writing',
                children: [
                    { name: 'essays', type: 'text' },
                    { name: 'poems', type: 'text' }
                ]
            }
        ]
    };

    // Use the real dreamscape structure directly
    console.log('🌳 Rendering real dreamscape structure');
    if (window.renderDreamscapeTree) window.renderDreamscapeTree(realDreamscape);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 's') {
                e.preventDefault();
                window.dragDropSystem.exportPositions();
            }
        }
    });
    
    // Add some interactive controls (optional)
    console.log('🎵 Culture Therapy - DEV MODE');
    console.log('🛠️  DRAG & DROP DEV TOOLS:');
    console.log('   • Drag any element to reposition');
    console.log('   • Positions auto-save every 2 seconds');
    console.log('   • Press Ctrl/Cmd+S to export positions JSON');
    console.log('   • dragDropSystem.showPositions() - see current layout data');
    console.log('   • dragDropSystem.resetPositions() - clear all positions');
    console.log('   • dragDropSystem.importPositions(jsonData) - import layout');
    console.log('   • dragDropSystem.setLayoutPreset("scattered") - quick layouts');
    console.log('   • dragDropSystem.listPresets() - see all available presets');
    console.log('');
    console.log('🌬️  WIND CONTROLS:');
    console.log('   • windSystem.setWindStrength(0.5) // 0 to 2');
    console.log('   • windSystem.setWindDirection(1) // 1 or -1');
    console.log('   • windSystem.stop() / windSystem.start()');
    console.log('');
    console.log('🎵 MUSIC PLAYER:');
    console.log('   • Click play button or press Spacebar to play/pause');
    console.log('   • musicPlayer.setTrack(2) // Jump to specific track');
    console.log('   • musicPlayer.getCurrentTrack() // Get current track info');
    console.log('   • musicPlayer.getPlaylist() // See all available tracks');
    console.log('');
    console.log('📰 SUBSTACK ARTICLES:');
    console.log('   • Click newspaper icon (📰) to view articles');
    console.log('   • substack.togglePanel() // Toggle articles panel');
    console.log('   • substack.loadArticles() // Reload articles');
    console.log('');
    console.log('🌱 WORD GARDEN:');
    console.log('   • Click plant icon (🌱) to open word garden');
    console.log('   • iframeComponent.togglePanel() // Toggle garden panel');
    console.log('   • iframeComponent.showPanel() // Show garden panel');
    console.log('   • iframeComponent.hidePanel() // Hide garden panel');
    console.log('');
    console.log('🎨 ARTIFACT CLUSTER SYSTEM:');
    console.log('   • Click on album covers or magazine covers to expand');
    console.log('   • artifactClusterSystem.expandClusterById("song-remedy") // Expand specific cluster');
    console.log('   • artifactClusterSystem.getClusterContent("mental-magazine") // Get cluster content');
    console.log('   • artifactClusterSystem.addContentToCluster("song-remedy", {type: "text", content: "New content", title: "New Title"}) // Add content');
});

// Substack Integration Class
class SubstackIntegration {
    constructor() {
        this.panel = document.getElementById('substackPanel');
        this.toggle = document.getElementById('substackToggle');
        this.articlesContainer = document.getElementById('substackArticles');
        this.closeBtn = document.getElementById('closeSubstack');
        this.isVisible = false;
        this.articlesLoaded = false;
        
        this.init();
    }
    
    init() {
        console.log('📰 Substack: Initializing...');
        console.log('📰 Substack: Panel element:', this.panel);
        console.log('📰 Substack: Toggle element:', this.toggle);
        
        // Check if required elements exist
        if (!this.panel) {
            console.warn('📰 Substack: Panel element not found, skipping initialization');
            return;
        }
        
        // Ensure panel starts hidden
        this.panel.classList.remove('visible');
        this.isVisible = false;
        
        // Event listeners - only if elements exist
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.togglePanel());
        }
        
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.hidePanel());
        }
        
        // Close on backdrop click
        this.panel.addEventListener('click', (e) => {
            if (e.target === this.panel) {
                this.hidePanel();
            }
        });
        
        // Load articles on first open - this will be handled in togglePanel()
        
        console.log('📰 Substack: Initialized successfully');
    }
    
    togglePanel() {
        console.log('📰 Substack: Toggle clicked, current state:', this.isVisible);
        if (this.isVisible) {
            this.hidePanel();
        } else {
            this.showPanel();
            // Load articles on first open
            if (!this.articlesLoaded) {
                console.log('📰 Substack: First time opening, loading articles...');
                this.loadArticles();
            }
        }
    }
    
    showPanel() {
        console.log('📰 Substack: Showing panel...');
        this.panel.classList.add('visible');
        this.isVisible = true;
        console.log('📰 Substack: Panel should now be visible');
    }
    
    hidePanel() {
        console.log('📰 Substack: Hiding panel...');
        this.panel.classList.remove('visible');
        this.isVisible = false;
        console.log('📰 Substack: Panel should now be hidden');
    }
    
    async loadArticles() {
        // Show loading state
        this.articlesContainer.innerHTML = '<div class="loading">Loading articles...</div>';
        
        // For now, show sample articles to avoid CORS issues
        // In production, you'd want to use a backend service to fetch RSS
        console.log('Loading sample articles (CORS-safe approach)');
        
        // Simulate a brief loading delay for better UX
        setTimeout(() => {
            this.showSampleArticles();
        }, 500);
    }
    
    parseRSSFeed(xmlDoc) {
        const items = xmlDoc.querySelectorAll('item');
        const articles = [];
        
        items.forEach(item => {
            const title = item.querySelector('title')?.textContent || 'Untitled';
            const link = item.querySelector('link')?.textContent || '#';
            const description = item.querySelector('description')?.textContent || '';
            const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();
            
            articles.push({
                title,
                link,
                description,
                pubDate
            });
        });
        
        return articles;
    }
    
    showSampleArticles() {
        const sampleArticles = [
            {
                title: "Welcome to Culture Therapy",
                description: "Exploring the intersection of creativity and mental wellness. Join us on this journey of healing through art, music, and community.",
                link: "https://culturetherapy.substack.com/",
                pubDate: new Date().toISOString()
            },
            {
                title: "The Art of Mindful Creation",
                description: "How creative practices can serve as powerful tools for mental health and personal growth. Discover the therapeutic benefits of artistic expression.",
                link: "https://culturetherapy.substack.com/",
                pubDate: new Date(Date.now() - 86400000).toISOString()
            },
            {
                title: "Building Creative Communities",
                description: "The importance of supportive creative communities in fostering mental wellness. Learn how to cultivate spaces that nurture both art and healing.",
                link: "https://culturetherapy.substack.com/",
                pubDate: new Date(Date.now() - 172800000).toISOString()
            },
            {
                title: "Healing Through Digital Spaces",
                description: "How virtual environments can become sanctuaries for mental health. Exploring the therapeutic potential of immersive digital experiences.",
                link: "https://culturetherapy.substack.com/",
                pubDate: new Date(Date.now() - 259200000).toISOString()
            },
            {
                title: "The Sound of Wellness",
                description: "Music as medicine for the mind. Understanding how audio experiences can support mental health and emotional regulation.",
                link: "https://culturetherapy.substack.com/",
                pubDate: new Date(Date.now() - 345600000).toISOString()
            }
        ];
        
        console.log('📰 Substack: Sample articles loaded:', sampleArticles.length, 'articles');
        console.log('📰 Substack: Article titles:', sampleArticles.map(a => a.title));
        this.displayArticles(sampleArticles);
        this.articlesLoaded = true;
        console.log('📰 Substack: Displaying sample articles (CORS-safe)');
    }
    
    displayArticles(articles) {
        console.log('📰 Substack: Displaying articles, count:', articles.length);
        console.log('📰 Substack: Articles container:', this.articlesContainer);
        
        this.articlesContainer.innerHTML = '';
        
        articles.forEach((article, index) => {
            console.log(`📰 Substack: Processing article ${index + 1}:`, article.title);
            
            const articleElement = document.createElement('div');
            articleElement.className = 'substack-article';
            
            // Format date
            const date = new Date(article.pubDate);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            // Clean description (remove HTML tags)
            const cleanDescription = article.description
                .replace(/<[^>]*>/g, '')
                .substring(0, 150) + '...';
            
            articleElement.innerHTML = `
                <a href="${article.link}" target="_blank">
                    <h4>${article.title}</h4>
                    <p>${cleanDescription}</p>
                    <p class="article-meta">${formattedDate}</p>
                </a>
            `;
            
            this.articlesContainer.appendChild(articleElement);
            console.log(`📰 Substack: Added article ${index + 1} to DOM`);
        });
        
        console.log('📰 Substack: All articles displayed successfully');
    }
    
    showError(message) {
        this.articlesContainer.innerHTML = `
            <div class="loading" style="color: #ff6b6b;">
                ${message}
            </div>
        `;
    }
}

// Initialize Substack integration
const substack = new SubstackIntegration();

// Make available globally
window.substack = substack;

// (Removed) L-system generator/renderer
// (Removed) Iframe component - now using artifact cluster system for Words We Love

// Artifact Cluster System
class ArtifactClusterSystem {
    constructor() {
        this.clusters = new Map();
        this.contentDatabase = {
            'song-remedy': [
                { type: 'audio', src: 'sonarium/song remedy/Grounded - Root.mp3', title: 'Grounded - Root' },
                { type: 'audio', src: 'sonarium/song remedy/I Feel - Sacral.mp3', title: 'I Feel - Sacral' },
                { type: 'audio', src: 'sonarium/song remedy/On Purpose - Solar Plexus.mp3', title: 'On Purpose - Solar Plexus' },
                { type: 'audio', src: 'sonarium/song remedy/Love Is - Heart.mp3', title: 'Love Is - Heart' },
                { type: 'audio', src: 'sonarium/song remedy/I Speak - Throat.mp3', title: 'I Speak - Throat' },
                { type: 'text', content: 'Song Remedy is a collection of chakra-healing tracks designed to support mental wellness through sound therapy.', title: 'About Song Remedy' }
            ],
            'school-music': [
                { type: 'text', content: 'School Music represents the educational journey of learning through sound and rhythm.', title: 'About School Music' },
                { type: 'text', content: 'This collection explores the intersection of learning and musical expression.', title: 'Educational Philosophy' },
                { type: 'text', content: 'Discover how music can be a powerful tool for learning and personal growth.', title: 'Learning Through Sound' }
            ],
            'mental-magazine': [
                { type: 'link', url: 'https://drive.google.com/file/d/1HPcnqWij53DcE9KbVvxlAKHkOh5RovJi/view?usp=drive_link', text: 'View Full PDF ↗', title: 'MENTAL Magazine PDF' },
                { type: 'link', url: 'https://ctx.metalabel.com/mental?variantId=1', text: 'Metalabel Release ↗', title: 'Get Physical Copy' },
                { type: 'text', content: 'An interactive zine illuminating the healing power of art and creativity. 56 pages, 5.25" x 7.75"', title: 'About MENTAL' },
                { type: 'image', src: 'neighborhood_library/Mental Magazine/7C1A0595.jpg', title: 'MENTAL Magazine' },
                { type: 'image', src: 'neighborhood_library/Mental Magazine/7C1A0614.jpg', title: 'MENTAL Magazine' },
                { type: 'image', src: 'neighborhood_library/Mental Magazine/7C1A0642.jpg', title: 'MENTAL Magazine' },
                { type: 'image', src: 'neighborhood_library/Mental Magazine/7C1A0656.jpg', title: 'MENTAL Magazine' }
            ],
            'your-way': [
                { type: 'link', url: 'https://culturetherapy.substack.com/p/this-is-your-way?utm_campaign=email-half-post&r=3dsb1&utm_source=substack&utm_medium=email', text: 'Substack Post by Ness Obad', title: 'This Is Your Way' },
                { type: 'link', url: 'https://www.dropbox.com/scl/fi/bq2e5ga19lto3ohgdvc8d/FH25_CTX_Journal_ProductionFile_0731.pdf?rlkey=0m60hy84rcc9ez9fh3kvie46c&e=1&dl=0', text: 'Design File (PDF)', title: 'Journal Production File' },
                { type: 'link', url: 'https://drive.google.com/file/d/1rVq9M1vcjE7q7FHp2j9eaHmcjM_ZcBZ8/view?usp=drive_link', text: 'Initial Project Proposal', title: 'Project Documentation' },
                { type: 'link', url: 'https://drive.google.com/file/d/18kcO8-FPhVdhEV9kJp1XG0a43OWtbYck/view?usp=drive_link', text: 'Your Way Journal One Pager', title: 'Project Overview' }
            ],
            'words-we-love': [
                { type: 'image', src: 'wordswelove/wordswelovewebsite.png', title: 'Words We Love Website' },
                { type: 'text', content: 'by Alicia', title: 'Creator' },
                { type: 'link', url: 'https://ascii-ctx.web.app/', text: 'Visit @https://ascii-ctx.web.app/ ↗', title: 'Visit Website' }
            ],
            'teenagelife-collab': [
                { type: 'link', url: 'https://culturetherapy.substack.com/p/this-teenage-life-x-culture-therapy', text: 'This Teenage Life x Culture Therapy', title: 'Read the Story' },
                { type: 'link', url: 'https://open.spotify.com/episode/2UMVWfSyuoi98lhzW3bAyX', text: 'Listen: How Art Helps Us', title: 'Spotify Podcast Episode' },
                { type: 'link', url: 'https://culturetherapy.substack.com/p/ct-x-this-teenage-life', text: 'CT x This Teenage Life: A Podcast Collab', title: 'Read More' },
                { type: 'text', content: 'Collaborators:\nMolly Joseph\nEvelyn McKenney\nLydia Bach', title: 'Team' }
            ],
            'headstream-collages': [
                { type: 'link', url: 'https://www.canva.com/design/DAGHYUDBt24/c28zDAr7l47cLXxnmJEoLg/edit?utm_content=DAGHYUDBt24&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton', text: 'View Collages on Canva ↗', title: 'Canva Collection' },
                { type: 'link', url: 'https://docs.google.com/document/d/1HUoZun66bambW5f8ppsMdM2x8bqnpwsWYn6I7DBj5lA/edit?tab=t.0', text: 'Artifact Catalog (Google Doc) ↗', title: 'Documentation' }
            ],
            'ctx-mailbox': [
                { type: 'text', content: 'Welcome to Culture Therapy\n\nExploring the intersection of creativity and mental wellness. Join us on this journey of healing through art, music, and community....', title: 'Oct 8, 2025' },
                { type: 'text', content: 'The Art of Mindful Creation\n\nHow creative practices can serve as powerful tools for mental health and personal growth. Discover the therapeutic benefits of artistic expression....', title: 'Recent Post' }
            ]
        };
        
        this.init();
    }
    
    init() {
        console.log('🎨 Artifact Cluster System: Initializing...');
        this.parseExistingClusters();
        this.setupEventListeners();
        console.log('🎨 Artifact Cluster System: Initialized successfully');
    }
    
    parseExistingClusters() {
        const clusters = document.querySelectorAll('.artifact-cluster');
        console.log(`🎨 Found ${clusters.length} artifact clusters in DOM`);
        clusters.forEach(cluster => {
            const clusterId = cluster.dataset.clusterId;
            if (clusterId) {
                // Ensure cluster starts in collapsed state
                cluster.classList.remove('expanded');
                this.clusters.set(clusterId, cluster);
                console.log(`🎨 Found cluster: ${clusterId}`, cluster);
            } else {
                console.warn('🎨 Found cluster without cluster-id:', cluster);
            }
        });
    }
    
    setupEventListeners() {
        this.clusters.forEach((cluster, clusterId) => {
            console.log(`🎨 Setting up click listener for cluster: ${clusterId}`);
            cluster.addEventListener('click', (e) => {
                console.log(`🎨 Click detected on cluster: ${clusterId}`);
                console.log('🎨 DEBUG: Cluster click handler fired!');
                console.log(`🎨 Cluster current classes:`, cluster.className);
                
                e.stopPropagation();
                e.preventDefault();
                this.expandCluster(clusterId);
            });
            
            // Also add click listeners to the cover images specifically
            const coverImages = cluster.querySelectorAll('.cluster-cover');
            coverImages.forEach(cover => {
                console.log(`🎨 Setting up click listener for cover in cluster: ${clusterId}`);
                cover.addEventListener('click', (e) => {
                    console.log(`🎨 Click detected on cover in cluster: ${clusterId}`);
                    console.log('🎨 DEBUG: Cover click handler fired!');
                    e.stopPropagation();
                    e.preventDefault();
                    this.expandCluster(clusterId);
                });
            });
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.collapseAllClusters();
            }
        });
        
        // Click events working - no global listener needed
    }
    
    expandCluster(clusterId) {
        const cluster = this.clusters.get(clusterId);
        if (!cluster) {
            console.error(`🎨 Cluster not found: ${clusterId}`);
            return;
        }
        
        console.log(`🎨 Expanding cluster: ${clusterId}`, cluster);
        console.log('🎨 DEBUG: expandCluster called!');
        
        // Find the parent modal and container
        const modal = cluster.closest('.modal');
        const artifactContainer = cluster.closest('.artifact-container');
        console.log('🎨 Cluster element:', cluster);
        console.log('🎨 Found parent modal:', modal);
        console.log('🎨 Found artifact container:', artifactContainer);
        if (!modal) {
            console.error('🎨 No parent modal found for cluster');
            console.log('🎨 Cluster parent elements:', cluster.parentElement, cluster.parentElement?.parentElement);
            return;
        }
        
        // Resize grid: make clicked cluster large, others 100px
        if (artifactContainer) {
            const allClusters = artifactContainer.querySelectorAll('.artifact-cluster');
            const clickedIndex = Array.from(allClusters).indexOf(cluster);
            
            // Update grid template based on which cluster was clicked
            if (allClusters.length === 2) {
                if (clickedIndex === 0) {
                    // First cluster clicked - make it large
                    artifactContainer.style.gridTemplateColumns = '1fr 100px';
        } else {
                    // Second cluster clicked - make it large
                    artifactContainer.style.gridTemplateColumns = '100px 1fr';
                }
            } else if (allClusters.length === 1) {
                // Single cluster - already takes full width via .single-artifact class
                console.log('🎨 Single artifact - no grid resize needed');
            }
            
            console.log(`🎨 Resized grid for cluster ${clickedIndex}`);
        }
        
        // Check if modal close button exists
        const modalCloseBtn = modal.querySelector('.modal-close');
        console.log('🎨 Modal close button found:', modalCloseBtn);
        console.log('🎨 Modal close button visible:', modalCloseBtn ? modalCloseBtn.offsetParent !== null : 'N/A');
        
        // Create a container for the cluster content within the modal
        let clusterContainer = modal.querySelector('.cluster-content-container');
        if (!clusterContainer) {
            clusterContainer = document.createElement('div');
            clusterContainer.className = 'cluster-content-container';
            modal.querySelector('.modal-content').appendChild(clusterContainer);
            console.log('🎨 Created cluster content container in modal');
        }
        
        // Clear any existing content
        clusterContainer.innerHTML = '';
        
        // Modify the existing modal close button to handle cluster closing
        this.setupModalCloseButton(modal, clusterId);
        console.log('🎨 Set up modal close button for cluster');
        
        // Add a test to verify the modal close button exists and is clickable
        setTimeout(() => {
            const modalCloseBtn = modal.querySelector('.modal-close');
            if (modalCloseBtn) {
                console.log('🎨 Modal close button found:', modalCloseBtn);
                console.log('🎨 Modal close button has cluster handler:', !!modalCloseBtn._clusterCloseHandler);
            } else {
                console.error('🎨 Modal close button not found!');
            }
        }, 100);
        
        // Get content for this cluster
        const content = this.contentDatabase[clusterId] || [];
        console.log(`🎨 Content for ${clusterId}:`, content);
        
        // Create and scatter additional components in the container
        this.createAndScatterComponents(clusterContainer, content);
        console.log('🎨 Created and scattered components in container');
        
    }
    
    createClusterCloseButton(modal, clusterId) {
        // Create a brand new close button
        const closeBtn = document.createElement('div');
        closeBtn.className = 'cluster-close-btn';
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: red;
            color: white;
            font-size: 30px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 99999;
            border-radius: 50%;
            border: 3px solid yellow;
        `;
        
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log('🎨 Cluster close button clicked!');
            this.collapseCluster(clusterId);
        });
        
        // Add to the modal
        modal.appendChild(closeBtn);
        console.log('🎨 Created new cluster close button:', closeBtn);
    }
    
    setupModalCloseButton(modal, clusterId) {
        const modalCloseBtn = modal.querySelector('.modal-close');
        if (!modalCloseBtn) {
            console.error('🎨 No modal close button found');
            return;
        }
        
        console.log('🎨 Setting up modal close button for cluster:', clusterId);
        
        // Store the original onclick handler if it exists
        if (!modalCloseBtn._originalOnclick) {
            modalCloseBtn._originalOnclick = modalCloseBtn.onclick;
        }
        
        // Create a simple cluster close handler
        const clusterCloseHandler = (e) => {
            const hasClusterOpen = !!modal.querySelector('.cluster-content-container');
            if (hasClusterOpen) {
                e.stopPropagation();
                e.preventDefault();
                console.log('🎨 Closing cluster:', clusterId);
                this.collapseCluster(clusterId);
                return;
            }
            // Otherwise, call the original onclick handler
            if (modalCloseBtn._originalOnclick) {
                modalCloseBtn._originalOnclick.call(modalCloseBtn, e);
            }
        };
        
        // Override the onclick handler
        modalCloseBtn.onclick = clusterCloseHandler;
        
        // MAXIMUM Z-INDEX POWER! 💪 Make sure this brown × stays on top of EVERYTHING!
        modalCloseBtn.style.zIndex = '999999999';
        modalCloseBtn.style.position = 'absolute'; // Just to be extra sure
        
        console.log('🎨 Modal close button ready for cluster mode with MAXIMUM POWER! ⚡');
    }
    
    restoreModalCloseButton(modal) {
        const modalCloseBtn = modal.querySelector('.modal-close');
        if (!modalCloseBtn) {
            return;
        }
        
        console.log('🎨 Restoring modal close button');
        
        // Restore the original onclick handler
        if (modalCloseBtn._originalOnclick) {
            modalCloseBtn.onclick = modalCloseBtn._originalOnclick;
            console.log('🎨 Restored original onclick handler');
        }
        
        // Clean up stored data
        delete modalCloseBtn._activeClusterId;
        delete modalCloseBtn._clusterCloseHandler;
        delete modalCloseBtn._originalOnclick;
        
        // Reset the z-index and position back to normal
        modalCloseBtn.style.zIndex = '';
        modalCloseBtn.style.position = '';
        
        console.log('🎨 Modal close button restored to original behavior');
    }
    
    createAndScatterComponents(cluster, content) {
        console.log(`🎨 Creating ${content.length} components for cluster`);
        // All content items are additional components (cover is separate)
        content.forEach((item, index) => {
            console.log(`🎨 Creating component ${index}:`, item);
            this.createComponent(cluster, item, index);
        });
    }
    
    createComponent(clusterContainer, item, index) {
        console.log(`🎨 Creating component for item:`, item);
        const component = document.createElement('div');
        component.className = 'artifact-component';
        
        // Add text-card class for text type items
        if (item.type === 'text') {
            component.classList.add('text-card');
        }
        
        component.dataset.type = item.type;
        component.dataset.title = item.title;
        
        // Position components in a grid within the expanded cluster area
        // Components will flow naturally within the cluster-content-container
        const cols = 3; // 3 columns of components
        const row = Math.floor(index / cols);
        const col = index % cols;
        
        // Calculate position as percentage
        const leftPercent = (col * 33.33) + 5; // 33.33% per column + 5% padding
        const topPercent = (row * 33.33) + 5; // 33.33% per row + 5% padding
        
        component.style.position = 'absolute';
        component.style.left = `${leftPercent}%`;
        component.style.top = `${topPercent}%`;
        component.style.width = '28%'; // Slightly less than 33% for spacing
        component.style.height = 'auto';
        component.style.minHeight = '150px';
        
        console.log(`🎨 Grid position for ${index}: row ${row}, col ${col} (${leftPercent}%, ${topPercent}%)`);
        
        // Create content based on type
        this.populateComponent(component, item);
        
        // Add to cluster container
        clusterContainer.appendChild(component);
        console.log(`🎨 Added component to cluster container:`, component);
        
        // Make component visible with animation
    setTimeout(() => {
            component.classList.add('visible');
            console.log(`🎨 Made component ${index} visible`);
        }, index * 100);
    }
    
    calculateScatterPosition(index) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const centerX = screenWidth / 2;
        const centerY = screenHeight / 2;
        
        // Create positions around the perimeter
        const positions = [
            { x: -screenWidth * 0.4, y: -screenHeight * 0.4, rotation: -45 }, // Top-left
            { x: screenWidth * 0.4, y: -screenHeight * 0.4, rotation: 45 },  // Top-right
            { x: -screenWidth * 0.4, y: screenHeight * 0.4, rotation: -135 }, // Bottom-left
            { x: screenWidth * 0.4, y: screenHeight * 0.4, rotation: 135 },  // Bottom-right
            { x: -screenWidth * 0.5, y: 0, rotation: -90 }, // Left
            { x: screenWidth * 0.5, y: 0, rotation: 90 },   // Right
            { x: 0, y: -screenHeight * 0.5, rotation: 0 },  // Top
            { x: 0, y: screenHeight * 0.5, rotation: 180 }  // Bottom
        ];
        
        // Cycle through positions
        const position = positions[index % positions.length];
        
        // Add some randomness
        const randomX = (Math.random() - 0.5) * 100;
        const randomY = (Math.random() - 0.5) * 100;
        const randomRotation = (Math.random() - 0.5) * 30;
        
        return {
            x: position.x + randomX,
            y: position.y + randomY,
            rotation: position.rotation + randomRotation
        };
    }
    
    populateComponent(component, item) {
        switch (item.type) {
            case 'image':
                const img = document.createElement('img');
                img.src = item.src;
                img.alt = item.title;
                img.style.width = '100%';
                img.style.height = 'auto';
                img.style.borderRadius = '8px';
                component.appendChild(img);
                break;
                
            case 'audio':
                const audioContainer = document.createElement('div');
                audioContainer.style.textAlign = 'center';
                audioContainer.style.padding = '20px';
                
                const audioTitle = document.createElement('h4');
                audioTitle.textContent = item.title;
                audioTitle.style.color = 'white';
                audioTitle.style.margin = '0 0 15px 0';
                audioTitle.style.fontSize = '16px';
                
                const audio = document.createElement('audio');
                audio.src = item.src;
                audio.controls = true;
                audio.style.width = '100%';
                
                audioContainer.appendChild(audioTitle);
                audioContainer.appendChild(audio);
                component.appendChild(audioContainer);
                break;
                
            case 'text':
                const textContainer = document.createElement('div');
                textContainer.style.padding = '20px';
                
                const textTitle = document.createElement('h4');
                textTitle.textContent = item.title;
                textTitle.style.color = 'white';
                textTitle.style.margin = '0 0 15px 0';
                textTitle.style.fontSize = '16px';
                
                const textContent = document.createElement('p');
                textContent.textContent = item.content;
                textContent.style.color = 'rgba(255, 255, 255, 0.8)';
                textContent.style.lineHeight = '1.5';
                textContent.style.margin = '0';
                
                textContainer.appendChild(textTitle);
                textContainer.appendChild(textContent);
                component.appendChild(textContainer);
                break;
                
            case 'pdf':
                const pdfContainer = document.createElement('div');
                pdfContainer.style.textAlign = 'center';
                pdfContainer.style.padding = '20px';
                
                const pdfTitle = document.createElement('h4');
                pdfTitle.textContent = item.title;
                pdfTitle.style.color = 'white';
                pdfTitle.style.margin = '0 0 15px 0';
                pdfTitle.style.fontSize = '16px';
                
                const pdfLink = document.createElement('a');
                pdfLink.href = item.src;
                pdfLink.target = '_blank';
                pdfLink.style.display = 'inline-block';
                pdfLink.style.padding = '10px 20px';
                pdfLink.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                pdfLink.style.color = 'white';
                pdfLink.style.textDecoration = 'none';
                pdfLink.style.borderRadius = '8px';
                pdfLink.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                pdfLink.textContent = 'Open PDF';
                
                pdfContainer.appendChild(pdfTitle);
                pdfContainer.appendChild(pdfLink);
                component.appendChild(pdfContainer);
                break;
                
            case 'link':
                const linkContainer = document.createElement('div');
                linkContainer.style.textAlign = 'center';
                linkContainer.style.padding = '20px';
                
                const linkTitle = document.createElement('h4');
                linkTitle.textContent = item.title;
                linkTitle.style.color = 'white';
                linkTitle.style.margin = '0 0 15px 0';
                linkTitle.style.fontSize = '16px';
                
                const webLink = document.createElement('a');
                webLink.href = item.url;
                webLink.target = '_blank';
                webLink.rel = 'noopener noreferrer';
                webLink.style.display = 'inline-block';
                webLink.style.padding = '10px 20px';
                webLink.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                webLink.style.color = 'white';
                webLink.style.textDecoration = 'none';
                webLink.style.borderRadius = '8px';
                webLink.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                webLink.style.transition = 'all 0.3s ease';
                webLink.textContent = item.text;
                
                // Add hover effect
                webLink.addEventListener('mouseenter', () => {
                    webLink.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    webLink.style.transform = 'scale(1.05)';
                });
                webLink.addEventListener('mouseleave', () => {
                    webLink.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    webLink.style.transform = 'scale(1)';
                });
                
                linkContainer.appendChild(linkTitle);
                linkContainer.appendChild(webLink);
                component.appendChild(linkContainer);
                break;
                
            case 'video':
                const videoContainer = document.createElement('div');
                videoContainer.style.textAlign = 'center';
                videoContainer.style.padding = '20px';
                
                const videoTitle = document.createElement('h4');
                videoTitle.textContent = item.title;
                videoTitle.style.color = 'white';
                videoTitle.style.margin = '0 0 15px 0';
                videoTitle.style.fontSize = '16px';
                
                const video = document.createElement('video');
                video.src = item.src;
                video.controls = true;
                video.style.width = '100%';
                video.style.maxHeight = '200px';
                
                videoContainer.appendChild(videoTitle);
                videoContainer.appendChild(video);
                component.appendChild(videoContainer);
                break;
        }
    }
    
    collapseCluster(clusterId) {
        console.log('🎨 Collapsing cluster:', clusterId);
        
        const cluster = this.clusters.get(clusterId);
        if (!cluster) {
            console.error(`🎨 Cluster not found: ${clusterId}`);
            return;
        }
        
        // Find the parent modal and container
        const modal = cluster.closest('.modal');
        const artifactContainer = cluster.closest('.artifact-container');
        if (!modal) {
            console.error('🎨 No parent modal found for cluster');
            return;
        }
        
        // Restore grid to equal columns
        if (artifactContainer) {
            artifactContainer.style.gridTemplateColumns = '1fr 1fr';
            console.log('🎨 Restored grid to equal columns');
        }
        
        const clusterContainer = modal.querySelector('.cluster-content-container');
        if (!clusterContainer) {
            console.log('🎨 No cluster container found to collapse');
            return;
        }
        
        console.log('🎨 Found cluster container, starting collapse animation');
        
        // Animate out all artifact components
        const components = clusterContainer.querySelectorAll('.artifact-component');
        console.log(`🎨 Animating out ${components.length} components`);
        
        components.forEach((component, index) => {
            setTimeout(() => {
                component.classList.add('scattering-out');
                setTimeout(() => {
                    component.remove();
                }, 500);
            }, index * 50);
        });
        
        // Remove container after animation and restore modal close button
        setTimeout(() => {
            if (clusterContainer.parentNode) {
                clusterContainer.parentNode.removeChild(clusterContainer);
                console.log('🎨 Removed cluster content container');
            }
            
            // Restore the original modal close button behavior
            this.restoreModalCloseButton(modal);
            console.log('🎨 Restored modal close button');
        }, components.length * 50 + 500);
    }
    
    collapseAllClusters() {
        this.clusters.forEach((cluster, clusterId) => {
            // Check if there's a cluster container in the modal
            const modal = cluster.closest('.modal');
            if (modal && modal.querySelector('.cluster-content-container')) {
                this.collapseCluster(clusterId);
            }
        });
    }
    
    // Public methods for external control
    expandClusterById(clusterId) {
        this.expandCluster(clusterId);
    }
    
    addContentToCluster(clusterId, content) {
        if (!this.contentDatabase[clusterId]) {
            this.contentDatabase[clusterId] = [];
        }
        this.contentDatabase[clusterId].push(content);
    }
    
    getClusterContent(clusterId) {
        return this.contentDatabase[clusterId] || [];
    }
}

// Card Stack System - Physics-based swipeable cards
class CardStackSystem {
    constructor() {
        this.currentLayer = 1; // 1 = dreamscape, 2 = artifact stack, 3 = content stack
        this.layerHistory = [];
        this.contentDatabase = null; // Will reference ArtifactClusterSystem's database
        this.overlayElement = null;
        this.containerElement = null;
        
        this.init();
    }
    
    init() {
        console.log('🎴 Card Stack System: Initializing...');
        this.createOverlay();
        this.setupKeyboardControls();
        console.log('🎴 Card Stack System: Ready');
    }
    
    setupKeyboardControls() {
        // Close card stack on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentLayer > 1) {
                this.planeswalkBack();
            }
        });
    }
    
    createOverlay() {
        // Create the card stack overlay
        this.overlayElement = document.createElement('div');
        this.overlayElement.className = 'card-stack-overlay';
        
        // Create the container for cards
        this.containerElement = document.createElement('div');
        this.containerElement.className = 'card-stack-container';
        
        // Create controls container
        this.controlsElement = document.createElement('div');
        this.controlsElement.className = 'card-stack-controls';
        
        // Create back section (button + label together)
        this.backSection = document.createElement('div');
        this.backSection.className = 'card-stack-back-section';
        this.backSection.style.display = 'none';
        
        // Create back button
        this.backButton = document.createElement('button');
        this.backButton.className = 'card-stack-back-btn';
        this.backButton.innerHTML = '←';
        this.backButton.addEventListener('click', () => this.planeswalkBack());
        
        // Create back label
        this.backLabel = document.createElement('div');
        this.backLabel.className = 'card-stack-back-label';
        
        // Add button and label to back section
        this.backSection.appendChild(this.backButton);
        this.backSection.appendChild(this.backLabel);
        
        // Create title element
        this.titleElement = document.createElement('div');
        this.titleElement.className = 'card-stack-title';
        
        // Create close button
        this.closeButton = document.createElement('button');
        this.closeButton.className = 'card-stack-close-btn';
        this.closeButton.innerHTML = '×';
        this.closeButton.addEventListener('click', () => this.closeAll());
        
        // Add sections to controls
        this.controlsElement.appendChild(this.backSection);
        this.controlsElement.appendChild(this.titleElement);
        this.controlsElement.appendChild(this.closeButton);
        
        this.overlayElement.appendChild(this.controlsElement);
        this.overlayElement.appendChild(this.containerElement);
        document.body.appendChild(this.overlayElement);
        
        console.log('🎴 Created overlay, container, and control elements');
    }
    
    // Special handler for CTX Mailbox - loads Substack articles
    openMailboxStack() {
        console.log('📬 Opening CTX Mailbox with Substack articles...');
        
        this.layerHistory.push({ layer: 3, id: 'ctx-mailbox', name: 'CTX Mailbox' });
        this.currentLayer = 3;
        
        // Blur the dreamscape
        this.blurLayer(1);
        
        // Get articles from Substack integration
        const articles = this.getSubstackArticles();
        
        // Create cards for each article
        this.createCardStack(articles, 'content', 'ctx-mailbox', 'CTX Mailbox');
    }
    
    // Get Substack articles from the SubstackIntegration class
    getSubstackArticles() {
        // Check if Substack integration exists
        if (window.substack) {
            // Get the same articles used by the newspaper button - with real links
            const sampleArticles = [
                {
                    title: "this is your way",
                    description: "tasneem ness obad traces her journey as an artist, student, and storyteller through 'your way,' a journal rooted in culture therapy, out soon!",
                    link: "https://culturetherapy.substack.com/p/this-is-your-way",
                    pubDate: new Date('2025-01-25').toISOString()
                },
                {
                    title: "this teenage life x culture therapy",
                    description: "today's stories come from a collaboration between culture therapy and this teenage life, a global youth podcast normalizing conversations about mental health.",
                    link: "https://culturetherapy.substack.com/p/this-teenage-life-x-culture-therapy",
                    pubDate: new Date('2024-12-10').toISOString()
                },
                {
                    title: "ct x This Teenage Life",
                    description: "a podcast collab! In May, we mentioned that sometimes you'll find our mascot holding down a collaboration with other artists or brands. We're excited to share that this summer we're holding it down with This Teenage Life!",
                    link: "https://culturetherapy.substack.com/p/ct-x-this-teenage-life",
                    pubDate: new Date('2024-07-22').toISOString()
                },
                {
                    title: "Welcome to Culture Therapy",
                    description: "Exploring the intersection of creativity and mental wellness. Join us on this journey of healing through art, music, and community.",
                    link: "https://culturetherapy.substack.com/",
                    pubDate: new Date(Date.now() - 86400000).toISOString()
                },
                {
                    title: "The Art of Mindful Creation",
                    description: "How creative practices can serve as powerful tools for mental health and personal growth. Discover the therapeutic benefits of artistic expression.",
                    link: "https://culturetherapy.substack.com/",
                    pubDate: new Date(Date.now() - 172800000).toISOString()
                }
            ];
            
            // Convert to card format with title as header, description, then date
            return sampleArticles.map(article => {
                const date = new Date(article.pubDate);
                const formattedDate = date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                });
                
                return {
                    type: 'text',
                    content: `${article.description}\n\n${formattedDate}`,
                    title: article.title,
                    link: article.link
                };
            });
        }
        
        // Fallback if Substack integration not available
        return [
            {
                type: 'text',
                content: 'Loading articles...',
                title: 'CTX Mailbox'
            }
        ];
    }
    
    // Layer 2: Open artifact stack (e.g., all albums or all books)
    openArtifactStack(artifactType) {
        console.log(`🎴 Opening artifact stack for: ${artifactType}`);
        
        this.layerHistory.push({ layer: 2, type: artifactType });
        this.currentLayer = 2;
        
        // Blur the dreamscape
        this.blurLayer(1);
        
        // Get artifacts based on type
        let artifacts = [];
        if (artifactType === 'bookshelf') {
            artifacts = [
                { id: 'mental-magazine', name: 'Mental Magazine', image: 'neighborhood_library/Mental Magazine/mentalmagcover.png' },
                { id: 'your-way', name: 'Your Way', image: 'neighborhood_library/Your Way/yourway.png' }
            ];
        } else if (artifactType === 'discplayer') {
            artifacts = [
                { id: 'song-remedy', name: 'Song Remedy', image: 'sonarium/song remedy/song remedy.png' },
                { id: 'school-music', name: 'School Music', image: 'sonarium/school music/School Music.png' }
            ];
        } else if (artifactType === 'wordswelove') {
            // Words We Love is a single artifact, go directly to Layer 3
            this.openContentStack('words-we-love', 'Words We Love');
            return;
        } else if (artifactType === 'ctxmailbox') {
            // CTX Mailbox - load Substack articles dynamically
            this.openMailboxStack();
            return;
        } else if (artifactType === 'crafttable') {
            artifacts = [
                { id: 'teenagelife-collab', name: 'This Teenage Life Collaboration', image: 'crafttable/thisteenagelifecollabs/cover.png' },
                { id: 'headstream-collages', name: 'Headstream Collages', image: 'crafttable/headstreamcollages/cover.png' }
            ];
        }
        
        // Create cards for each artifact
        this.createCardStack(artifacts, 'artifact', artifactType);
    }
    
    // Layer 3: Open content stack (e.g., all songs in an album)
    openContentStack(artifactId, artifactName) {
        console.log(`🎴 Opening content stack for: ${artifactId}`);
        
        this.layerHistory.push({ layer: 3, id: artifactId, name: artifactName });
        this.currentLayer = 3;
        
        // Blur Layer 2 (artifact stack) if it exists
        if (this.layerHistory.length > 1) {
            this.blurLayer(2);
        } else {
            // If coming directly from Layer 1, blur it
            this.blurLayer(1);
        }
        
        // Get content from database
        let content = this.contentDatabase ? this.contentDatabase[artifactId] || [] : [];
        
        // Add artifact cover image as the first card
        const coverImages = {
            'mental-magazine': 'neighborhood_library/Mental Magazine/mentalmagcover.png',
            'your-way': 'neighborhood_library/Your Way/yourway.png',
            'song-remedy': 'sonarium/song remedy/song remedy.png',
            'school-music': 'sonarium/school music/School Music.png',
            'words-we-love': 'wordswelove/wordswelovewebsite.png',
            'teenagelife-collab': 'crafttable/thisteenagelifecollabs/cover.png',
            'headstream-collages': 'crafttable/headstreamcollages/cover.png'
        };
        
        if (coverImages[artifactId]) {
            // Prepend the cover image card
            content = [
                { type: 'cover', src: coverImages[artifactId], title: artifactName },
                ...content
            ];
        }
        
        // Create cards for each content item
        this.createCardStack(content, 'content', artifactId, artifactName);
    }
    
    // Create a stack of scrollable cards
    createCardStack(items, stackType, stackId, stackName = '') {
        console.log(`🎴 Creating ${stackType} stack with ${items.length} items`);
        console.log('🎴 Items:', items);
        
        // Clear existing cards
        this.containerElement.innerHTML = '';
        
        // Create cards in normal order (top to bottom)
        for (let i = 0; i < items.length; i++) {
            const card = this.createCard(items[i], stackType, i, stackId);
            this.containerElement.appendChild(card);
            console.log(`🎴 Added card ${i}:`, card);
        }
        
        console.log('🎴 Total cards in container:', this.containerElement.children.length);
        
        // Update controls based on layer
        this.updateControls(stackName);
        
        // Show the overlay
        this.overlayElement.classList.add('active');
        console.log('🎴 Overlay active class added');
        
        // Scroll to top
        this.overlayElement.scrollTop = 0;
    }
    
    // Update control buttons based on current layer
    updateControls(stackName = '') {
        // Check if this is a single-artifact case (Layer 3 with only 1 layer in history)
        // This means we went directly from dreamscape (Layer 1) to content (Layer 3)
        const isSingleArtifact = this.currentLayer === 3 && this.layerHistory.length === 1;
        
        // Determine the title to display
        let displayTitle = '';
        if (this.currentLayer === 2) {
            // Layer 2 - show the artifact type name
            const currentHistory = this.layerHistory[this.layerHistory.length - 1];
            const artifactType = currentHistory.type;
            const artifactNames = {
                'bookshelf': 'Neighborhood Library',
                'discplayer': 'Sonarium',
                'crafttable': 'Craft Table',
                'wordswelove': 'Words We Love',
                'ctxmailbox': 'CTX Mailbox'
            };
            displayTitle = artifactNames[artifactType] || artifactType;
        } else if (this.currentLayer === 3) {
            // Layer 3 - show the specific artifact name or stack name
            const currentHistory = this.layerHistory[this.layerHistory.length - 1];
            displayTitle = currentHistory.name || stackName;
        }
        
        // Set the title
        this.titleElement.textContent = displayTitle;
        
        if (this.currentLayer === 3 && !isSingleArtifact) {
            // Layer 3 (content) from Layer 2 (artifact stack) - show back section
            this.backSection.style.display = 'flex';
            this.backLabel.textContent = `Back to ${stackName}`;
        } else {
            // Layer 2 (artifacts) or single-artifact case - hide back section
            this.backSection.style.display = 'none';
        }
        
        // Close button is always visible
        console.log(`🎴 Controls updated for layer ${this.currentLayer}, isSingleArtifact: ${isSingleArtifact}, title: ${displayTitle}`);
    }
    
    // Calculate complementary color from RGB
    getComplementaryColor(rgbaString) {
        // Extract RGB values from rgba string
        const match = rgbaString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!match) return '#fff';
        
        let [_, r, g, b] = match.map(Number);
        
        // Calculate complementary color (opposite on color wheel)
        const compR = 255 - r;
        const compG = 255 - g;
        const compB = 255 - b;
        
        // Convert to hex
        const toHex = (n) => {
            const hex = n.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        
        return `#${toHex(compR)}${toHex(compG)}${toHex(compB)}`;
    }

    // Generate random vibrant color palette
    generateColorPalette() {
        const palettes = [
            'rgb(255, 107, 107)',  // Coral red
            'rgb(78, 205, 196)',   // Turquoise
            'rgb(255, 195, 0)',    // Golden yellow
            'rgb(129, 207, 224)',  // Sky blue
            'rgb(255, 121, 198)',  // Hot pink
            'rgb(162, 155, 254)',  // Lavender
            'rgb(253, 167, 223)',  // Bubblegum pink
            'rgb(119, 221, 119)',  // Mint green
            'rgb(255, 159, 64)',   // Orange
            'rgb(99, 179, 237)',   // Ocean blue
        ];
        const bg = palettes[Math.floor(Math.random() * palettes.length)];
        const text = this.getComplementaryColor(bg);
        return { bg, text };
    }

    // Create a single card
    createCard(item, stackType, index, stackId) {
        const card = document.createElement('div');
        card.className = 'swipe-card';
        
        const inner = document.createElement('div');
        inner.className = 'card-inner';
        
        if (stackType === 'artifact') {
            // Layer 2: Artifact cover card
            card.classList.add('card-image');
            
            // Create image wrapper that will match image dimensions
            const imgWrapper = document.createElement('div');
            imgWrapper.className = 'artifact-image-wrapper';
            
            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.name;
            imgWrapper.appendChild(img);
            
            // Add title overlay with random color palette
            const titleOverlay = document.createElement('div');
            titleOverlay.className = 'artifact-title-overlay';
            titleOverlay.textContent = item.name;
            
            // Apply random color palette
            const palette = this.generateColorPalette();
            titleOverlay.style.backgroundColor = palette.bg;
            titleOverlay.style.webkitTextStroke = `2px ${palette.text}`;
            titleOverlay.style.textStroke = `2px ${palette.text}`;
            
            imgWrapper.appendChild(titleOverlay);
            inner.appendChild(imgWrapper);
            
            // Click to go to Layer 3
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log(`🎴 Artifact card clicked: ${item.id}`);
                this.openContentStack(item.id, item.name);
            });
            
        } else if (stackType === 'content') {
            // Layer 3: Content card
            this.populateContentCard(card, inner, item);
        }
        
        card.appendChild(inner);
        return card;
    }
    
    // Populate content card based on type
    populateContentCard(card, inner, item) {
        switch (item.type) {
            case 'cover':
                // Artifact cover image (full width/height, no margins)
                card.classList.add('card-image');
                card.classList.add('card-cover');
                const coverImg = document.createElement('img');
                coverImg.src = item.src;
                coverImg.alt = item.title;
                inner.appendChild(coverImg);
                break;
                
            case 'image':
                card.classList.add('card-image');
                const img = document.createElement('img');
                img.src = item.src;
                img.alt = item.title;
                inner.appendChild(img);
                break;
                
            case 'text':
                card.classList.add('card-text');
                const textTitle = document.createElement('h3');
                textTitle.textContent = item.title;
                const textContent = document.createElement('p');
                textContent.textContent = item.content;
                inner.appendChild(textTitle);
                inner.appendChild(textContent);
                
                // If the text card has a link, make it clickable
                if (item.link) {
                    card.style.cursor = 'pointer';
                    card.addEventListener('click', (e) => {
                        e.stopPropagation();
                        window.open(item.link, '_blank');
                    });
                }
                break;
                
            case 'audio':
                card.classList.add('card-audio');
                const audioTitle = document.createElement('h3');
                audioTitle.textContent = item.title;
                audioTitle.style.color = 'white';
                audioTitle.style.marginBottom = '20px';
                const audio = document.createElement('audio');
                audio.src = item.src;
                audio.controls = true;
                inner.appendChild(audioTitle);
                inner.appendChild(audio);
                break;
                
            case 'link':
                card.classList.add('card-link');
                const linkTitle = document.createElement('h3');
                linkTitle.textContent = item.title;
                linkTitle.style.color = 'white';
                linkTitle.style.marginBottom = '20px';
                const link = document.createElement('a');
                link.href = item.url;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.textContent = item.text;
                inner.appendChild(linkTitle);
                inner.appendChild(link);
                break;
                
            case 'pdf':
                card.classList.add('card-link');
                const pdfTitle = document.createElement('h3');
                pdfTitle.textContent = item.title;
                pdfTitle.style.color = 'white';
                pdfTitle.style.marginBottom = '20px';
                const pdfLink = document.createElement('a');
                pdfLink.href = item.src;
                pdfLink.target = '_blank';
                pdfLink.textContent = 'Open PDF →';
                inner.appendChild(pdfTitle);
                inner.appendChild(pdfLink);
                break;
                
            default:
                card.classList.add('card-text');
                const defaultText = document.createElement('p');
                defaultText.textContent = 'Unknown content type';
                inner.appendChild(defaultText);
        }
    }
    
    
    // Initialize Swing.js physics
    initSwing() {
        console.log('🎴 Attempting to initialize Swing.js...');
        console.log('🎴 window.gajus:', window.gajus);
        console.log('🎴 window.gajus.Swing:', window.gajus ? window.gajus.Swing : 'undefined');
        
        if (!window.gajus || !window.gajus.Swing) {
            console.error('🎴 Swing.js not loaded! Check if swing.js is included in HTML');
            return;
        }
        
        const config = {
            minThrowOutDistance: 300,
            maxThrowOutDistance: 400,
            maxRotation: 20,
            throwOutConfidence: (xOffset, yOffset, element) => {
                const xConfidence = Math.min(Math.abs(xOffset) / 300, 1);
                return xConfidence;
            }
        };
        
        console.log('🎴 Creating Swing Stack with config:', config);
        this.currentStack = window.gajus.Swing.Stack(config);
        console.log('🎴 Stack created:', this.currentStack);
        
        const cards = this.containerElement.querySelectorAll('.swipe-card');
        console.log('🎴 Found cards to make swipeable:', cards.length);
        
        cards.forEach((cardElement, index) => {
            console.log(`🎴 Attaching Swing to card ${index}:`, cardElement);
            const card = this.currentStack.createCard(cardElement);
            console.log(`🎴 Card ${index} attached to Swing:`, card);
            
            // When card is thrown out
            card.on('throwout', (e) => {
                console.log('🎴 Card thrown out:', e.target);
                const cardElement = e.target;
                cardElement.classList.remove('in-deck');
                
                // Remove from active deck array
                const cardIndex = this.activeCards.indexOf(cardElement);
                if (cardIndex > -1) {
                    this.activeCards.splice(cardIndex, 1);
                    console.log('🎴 Removed from active deck. Remaining:', this.activeCards.length);
                }
                
                // Add to discarded array
                this.discardedCards.push(cardElement);
                
                // Stop Swing from managing this card anymore
                this.currentStack.destroyCard(card);
                
                // Get the current transform values for the animation
                const transform = window.getComputedStyle(cardElement).transform;
                const matrix = new DOMMatrix(transform);
                const translateX = matrix.m41;
                const translateY = matrix.m42;
                
                // Calculate rotation from the transform matrix
                const rotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
                
                // Set CSS variables for the animation
                cardElement.style.setProperty('--throw-x', `${translateX}px`);
                cardElement.style.setProperty('--throw-y', `${translateY}px`);
                cardElement.style.setProperty('--throw-rotation', `${rotation}deg`);
                
                // Clear any inline transform from Swing
                cardElement.style.transform = '';
                
                // Add the throwing-out animation class
                cardElement.classList.add('throwing-out');
                
                // After animation, mark as discarded (keep it visible!)
                setTimeout(() => {
                    cardElement.classList.remove('throwing-out');
                    cardElement.classList.add('discarded');
                    
                    // Update interactivity for remaining cards
                    this.updateCardInteractivity();
                    
                    // Check if all cards in deck are gone
                    if (this.activeCards.length === 0) {
                        console.log('🎴 All cards discarded! They remain visible as a discard pile.');
                        // Don't close - cards stay visible in their discarded positions
                    }
                }, 350);
            });
            
            // When card returns to stack
            card.on('throwin', (e) => {
                console.log('🎴 Card thrown in (returned)');
                e.target.classList.add('in-deck');
            });
            
            // Log drag events
            card.on('dragstart', () => {
                console.log(`🎴 Card ${index} drag started`);
            });
            
            card.on('dragmove', (e) => {
                console.log(`🎴 Card ${index} dragging:`, e);
            });
            
            card.on('dragend', () => {
                console.log(`🎴 Card ${index} drag ended`);
            });
        });
        
        console.log('🎴 Swing.js initialized successfully with', cards.length, 'cards');
    }
    
    // Blur a specific layer
    blurLayer(layer) {
        if (layer === 1) {
            // Blur dreamscape
            const dreamscape = document.body;
            dreamscape.classList.add('dreamscape-blurred');
        } else if (layer === 2) {
            // Blur artifact stack
            // The cards will be blurred by CSS when Layer 3 opens
        }
    }
    
    // Unblur a specific layer
    unblurLayer(layer) {
        if (layer === 1) {
            const dreamscape = document.body;
            dreamscape.classList.remove('dreamscape-blurred');
        }
    }
    
    // Navigate back one layer
    planeswalkBack() {
        console.log('🎴 Planeswalking back...');
        
        if (this.currentLayer === 3) {
            // Going from Layer 3 → Layer 2
            this.layerHistory.pop(); // Remove Layer 3
            const previousLayer = this.layerHistory[this.layerHistory.length - 1];
            this.currentLayer = 2;
            
            if (previousLayer && previousLayer.layer === 2) {
                // Reopen Layer 2 artifact stack
                this.openArtifactStack(previousLayer.type);
            } else {
                // No Layer 2, go straight to Layer 1
                this.closeAll();
            }
            
        } else if (this.currentLayer === 2) {
            // Going from Layer 2 → Layer 1
            this.closeAll();
        }
    }
    
    // Close all layers and return to dreamscape
    closeAll() {
        console.log('🎴 Closing all layers, returning to dreamscape');
        
        // Clear overlay
        this.overlayElement.classList.remove('active');
        this.containerElement.innerHTML = '';
        
        // Unblur dreamscape
        this.unblurLayer(1);
        
        // Reset state
        this.currentLayer = 1;
        this.layerHistory = [];
        this.currentStack = null;
        
        console.log('🎴 Returned to Layer 1 (Dreamscape)');
    }
    
    // Set content database reference
    setContentDatabase(database) {
        this.contentDatabase = database;
        console.log('🎴 Content database connected');
    }
}

// Welcome Card System
class WelcomeCardSystem {
    constructor() {
        this.welcomeCard = document.querySelector('.welcome-card');
        this.closeButton = document.querySelector('.welcome-card-close');
        this.logoContainer = null;
        this.rightEyeball = null;
        this.hasMovedToCorner = false;
        this.init();
    }
    
    init() {
        if (!this.welcomeCard || !this.closeButton) {
            console.warn('Welcome card elements not found');
            return;
        }
        
        // Find logo elements
        setTimeout(() => {
            this.logoContainer = document.querySelector('.logo-container');
            this.rightEyeball = document.querySelector('.right-eyeball');
            
            if (this.logoContainer) {
                // Logo click to reopen welcome card
                this.logoContainer.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.open();
                });
            }
        }, 100);
        
        // Close button click
        this.closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.close();
        });
        
        // Click outside card to close
        document.addEventListener('click', (e) => {
            if (this.welcomeCard.classList.contains('active') && 
                !this.welcomeCard.contains(e.target) && 
                !e.target.closest('.logo-container')) {
                this.close();
            }
        });
        
        console.log('📝 Welcome Card System: Initialized');
    }
    
    close() {
        this.welcomeCard.classList.remove('active');
        
        // Move logo to bottom left corner and trigger wink
        if (this.logoContainer && !this.hasMovedToCorner) {
            setTimeout(() => {
                this.logoContainer.classList.add('moved-to-corner');
                this.hasMovedToCorner = true;
                
                // Wink after starting to move
                setTimeout(() => {
                    this.wink();
                }, 400);
            }, 300);
        }
        
        console.log('📝 Welcome card closed');
    }
    
    open() {
        this.welcomeCard.classList.add('active');
        
        // Move logo back to center bottom when card opens
        if (this.logoContainer && this.hasMovedToCorner) {
            this.logoContainer.classList.remove('moved-to-corner');
        }
        
        console.log('📝 Welcome card opened');
    }
    
    wink() {
        if (this.rightEyeball) {
            this.rightEyeball.style.animation = 'wink 0.3s ease-in-out';
            setTimeout(() => {
                this.rightEyeball.style.animation = '';
            }, 300);
        }
    }
}

// Artifact Cluster System will be initialized in the main DOMContentLoaded block