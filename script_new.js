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

