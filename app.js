// Main Application Logic for Galactic Leap
// Integrates AI Assistant, 3D Scene, and User Engagement Features

class GalacticLeapApp {
    constructor() {
        this.aiAssistant = new AIAssistant();
        this.spaceScene = null;
        this.achievements = {
            'first-visit': false,
            'planet-explorer': false,
            'ai-conversationalist': false,
            'cosmic-wanderer': false
        };
        
        this.init();
    }

    init() {
        console.log('🚀 Initializing Galactic Leap...');
        
        // Initialize 3D Scene
        try {
            this.spaceScene = new SpaceScene('space-canvas');
            console.log('✅ 3D Space Scene initialized');
        } catch (error) {
            console.error('Failed to initialize 3D scene:', error);
        }

        // Setup Event Listeners
        this.setupEventListeners();

        // Unlock first achievement
        this.unlockAchievement('first-visit');

        console.log('✅ Galactic Leap ready!');
    }

    setupEventListeners() {
        // AI Chat Input
        const userInput = document.getElementById('user-input');
        const sendBtn = document.getElementById('send-btn');

        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.handleUserMessage());
        }

        if (userInput) {
            userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleUserMessage();
                }
            });
        }

        // 3D Scene Controls
        const togglePlanetsBtn = document.getElementById('togglePlanets');
        if (togglePlanetsBtn) {
            togglePlanetsBtn.addEventListener('click', () => {
                if (this.spaceScene) {
                    const isVisible = this.spaceScene.togglePlanets();
                    togglePlanetsBtn.textContent = isVisible ? 'Hide Planets' : 'Show Planets';
                }
            });
        }

        const randomExploreBtn = document.getElementById('randomExplore');
        if (randomExploreBtn) {
            randomExploreBtn.addEventListener('click', () => this.handleRandomExplore());
        }

        const toggleARBtn = document.getElementById('toggleAR');
        if (toggleARBtn) {
            toggleARBtn.addEventListener('click', () => this.handleARMode());
        }
    }

    async handleUserMessage() {
        const userInput = document.getElementById('user-input');
        const message = userInput.value.trim();

        if (!message) return;

        // Display user message
        this.addMessage(message, 'user');

        // Clear input
        userInput.value = '';

        // Show loading indicator
        const loadingMsg = this.addMessage('Thinking...', 'ai', true);

        // Get AI response (simulate async processing)
        setTimeout(async () => {
            const response = await this.aiAssistant.processInput(message);
            
            // Remove loading message
            loadingMsg.remove();

            // Display AI response
            this.addMessage(response, 'ai');

            // Check for achievements
            this.checkAchievements();
        }, 500);
    }

    addMessage(content, type, isLoading = false) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        if (isLoading) {
            messageDiv.classList.add('loading');
        }

        const prefix = type === 'ai' ? '<strong>AI Assistant:</strong> ' : '<strong>You:</strong> ';
        messageDiv.innerHTML = prefix + content;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        return messageDiv;
    }

    handleRandomExplore() {
        if (!this.spaceScene) return;

        const planetName = this.spaceScene.focusOnRandomPlanet();
        
        if (planetName) {
            this.addMessage(`🚀 Randomly exploring ${planetName}! The camera is moving to focus on it.`, 'ai');
            
            // Trigger AI info about the planet after a delay
            setTimeout(() => {
                this.aiAssistant.processInput(planetName).then(response => {
                    this.addMessage(response, 'ai');
                });
            }, 2000);

            this.unlockAchievement('planet-explorer');
        }
    }

    handleARMode() {
        // AR Mode placeholder - would integrate with WebXR API
        this.addMessage(
            '🥽 <strong>AR Mode Coming Soon!</strong><br><br>' +
            'Future version will support:<br>' +
            '• WebXR integration for mobile AR<br>' +
            '• Marker-based AR for physical spaces<br>' +
            '• Hand tracking for gesture controls<br>' +
            '• Immersive 3D planet exploration<br><br>' +
            'Stay tuned for updates!',
            'ai'
        );
    }

    checkAchievements() {
        // Check conversation achievement
        if (this.aiAssistant.getConversationCount() >= 5) {
            this.unlockAchievement('ai-conversationalist');
        }

        // Check exploration achievement
        if (this.aiAssistant.getExploredCount() >= 3) {
            this.unlockAchievement('cosmic-wanderer');
        }
    }

    unlockAchievement(achievementId) {
        if (this.achievements[achievementId]) {
            return; // Already unlocked
        }

        this.achievements[achievementId] = true;

        const achievementElement = document.querySelector(`[data-achievement="${achievementId}"]`);
        if (achievementElement) {
            achievementElement.classList.remove('locked');
            achievementElement.classList.add('unlocked');

            // Show notification
            this.showAchievementNotification(achievementId);
        }

        console.log(`🏆 Achievement unlocked: ${achievementId}`);
    }

    showAchievementNotification(achievementId) {
        const achievementNames = {
            'first-visit': 'First Visit',
            'planet-explorer': 'Planet Explorer',
            'ai-conversationalist': 'AI Conversationalist',
            'cosmic-wanderer': 'Cosmic Wanderer'
        };

        const name = achievementNames[achievementId] || achievementId;
        
        this.addMessage(
            `🎉 <strong>Achievement Unlocked!</strong><br>You've earned: ${name}!`,
            'ai'
        );
    }

    // Utility method to get app stats
    getStats() {
        return {
            conversations: this.aiAssistant.getConversationCount(),
            planetsExplored: this.aiAssistant.getExploredCount(),
            achievementsUnlocked: Object.values(this.achievements).filter(Boolean).length,
            totalAchievements: Object.keys(this.achievements).length
        };
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.galacticLeap = new GalacticLeapApp();
    console.log('🌌 Welcome to Galactic Leap!');
});
