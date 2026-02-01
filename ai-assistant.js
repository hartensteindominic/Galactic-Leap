// AI Assistant Module for Galactic Leap
// Provides intelligent space exploration recommendations and information

class AIAssistant {
    constructor() {
        this.knowledgeBase = {
            planets: {
                mercury: {
                    name: "Mercury",
                    description: "The smallest planet and closest to the Sun. It has extreme temperature variations.",
                    facts: ["No atmosphere", "Fastest orbit around the Sun", "Heavily cratered surface"],
                    recommendation: "Perfect for studying extreme environments and understanding planetary formation!"
                },
                venus: {
                    name: "Venus",
                    description: "The hottest planet with a thick, toxic atmosphere. Often called Earth's twin due to similar size.",
                    facts: ["Rotates backwards", "Sulfuric acid clouds", "Surface pressure 90x Earth"],
                    recommendation: "Fascinating for studying greenhouse effects and atmospheric dynamics!"
                },
                earth: {
                    name: "Earth",
                    description: "Our home planet, the only known world with life. A blue marble in space.",
                    facts: ["71% water coverage", "Protective magnetic field", "Perfect distance from Sun"],
                    recommendation: "The most precious planet we know - let's protect it!"
                },
                mars: {
                    name: "Mars",
                    description: "The Red Planet, currently being explored by rovers. Potential for past microbial life.",
                    facts: ["Has polar ice caps", "Tallest volcano in solar system", "Evidence of ancient rivers"],
                    recommendation: "Top candidate for human colonization and finding extraterrestrial life!"
                },
                jupiter: {
                    name: "Jupiter",
                    description: "The largest planet, a gas giant with a Great Red Spot storm that's been raging for centuries.",
                    facts: ["Has 79+ moons", "Strong magnetic field", "Protects inner planets"],
                    recommendation: "Amazing for studying gas giants and moon systems like Europa!"
                },
                saturn: {
                    name: "Saturn",
                    description: "Famous for its spectacular ring system made of ice and rock particles.",
                    facts: ["Least dense planet", "62+ moons including Titan", "Hexagon storm at pole"],
                    recommendation: "Most beautiful planet with stunning rings - great for photography!"
                },
                uranus: {
                    name: "Uranus",
                    description: "An ice giant that rotates on its side. Has a blue-green color from methane.",
                    facts: ["Rotates sideways", "27 known moons", "Coldest planetary atmosphere"],
                    recommendation: "Unique for its sideways rotation - perfect for studying planetary tilts!"
                },
                neptune: {
                    name: "Neptune",
                    description: "The windiest planet with supersonic winds. Deep blue color from methane.",
                    facts: ["Strongest winds in solar system", "14 known moons", "Dark spots"],
                    recommendation: "Excellent for studying extreme weather and ice giant atmospheres!"
                }
            },
            topics: {
                "black hole": "Black holes are regions of spacetime where gravity is so strong that nothing, not even light, can escape. They form from collapsed massive stars!",
                "star": "Stars are massive, luminous spheres of plasma held together by gravity. They produce energy through nuclear fusion in their cores.",
                "galaxy": "Galaxies are massive systems of stars, gas, dust, and dark matter bound by gravity. Our Milky Way contains over 200 billion stars!",
                "nebula": "Nebulae are vast clouds of dust and gas in space, often stellar nurseries where new stars are born.",
                "exoplanet": "Exoplanets are planets outside our solar system. We've discovered thousands, some potentially habitable!",
                "dark matter": "Dark matter makes up about 85% of the universe's matter but doesn't emit light. We detect it through gravitational effects.",
                "big bang": "The Big Bang theory describes the universe's origin about 13.8 billion years ago from an extremely hot, dense state.",
                "astronaut": "Astronauts are trained space explorers who conduct research in space. They undergo rigorous physical and technical training!"
            }
        };
        
        this.conversationCount = 0;
        this.exploredPlanets = new Set();
    }

    // Main AI response method
    async processInput(userInput) {
        this.conversationCount++;
        const input = userInput.toLowerCase().trim();
        
        // Check for planet queries
        for (const [key, planet] of Object.entries(this.knowledgeBase.planets)) {
            if (input.includes(key)) {
                this.exploredPlanets.add(key);
                return this.formatPlanetResponse(planet);
            }
        }
        
        // Check for general space topics
        for (const [key, info] of Object.entries(this.knowledgeBase.topics)) {
            if (input.includes(key)) {
                return this.formatTopicResponse(key, info);
            }
        }
        
        // Handle recommendations
        if (input.includes("recommend") || input.includes("suggest")) {
            return this.recommendPlanet();
        }
        
        // Handle exploration queries
        if (input.includes("explore") || input.includes("visit")) {
            return this.exploreRandomPlanet();
        }
        
        // Handle help or greeting
        if (input.includes("help") || input.includes("what can you do")) {
            return this.getHelp();
        }
        
        if (input.includes("hello") || input.includes("hi") || input.includes("hey")) {
            return "Hello, space explorer! 🚀 I'm here to guide you through the cosmos. Ask me about planets, stars, or get recommendations!";
        }
        
        // Default intelligent response
        return this.getDefaultResponse(input);
    }

    formatPlanetResponse(planet) {
        let response = `🪐 <strong>${planet.name}</strong><br><br>`;
        response += `${planet.description}<br><br>`;
        response += `<strong>Fascinating Facts:</strong><br>`;
        planet.facts.forEach(fact => {
            response += `• ${fact}<br>`;
        });
        response += `<br><strong>Why explore it?</strong><br>${planet.recommendation}`;
        return response;
    }

    formatTopicResponse(topic, info) {
        return `✨ <strong>${topic.charAt(0).toUpperCase() + topic.slice(1)}</strong><br><br>${info}<br><br>Want to learn more? Ask about specific planets or space phenomena!`;
    }

    recommendPlanet() {
        const unvisited = Object.keys(this.knowledgeBase.planets).filter(
            p => !this.exploredPlanets.has(p)
        );
        
        if (unvisited.length === 0) {
            return "🌟 Wow! You've explored all the planets! You're a true cosmic wanderer. Try asking about black holes, nebulae, or other space phenomena!";
        }
        
        const recommended = unvisited[Math.floor(Math.random() * unvisited.length)];
        const planet = this.knowledgeBase.planets[recommended];
        
        return `🎯 <strong>AI Recommendation: ${planet.name}</strong><br><br>` +
               `${planet.recommendation}<br><br>` +
               `Ask me "Tell me about ${recommended}" to learn more!`;
    }

    exploreRandomPlanet() {
        const planetNames = Object.keys(this.knowledgeBase.planets);
        const randomPlanet = planetNames[Math.floor(Math.random() * planetNames.length)];
        const planet = this.knowledgeBase.planets[randomPlanet];
        
        this.exploredPlanets.add(randomPlanet);
        
        return `🚀 <strong>Random Discovery: ${planet.name}!</strong><br><br>` +
               `${planet.description}<br><br>` +
               `<strong>Quick Fact:</strong> ${planet.facts[0]}`;
    }

    getHelp() {
        return `🤖 <strong>AI Assistant Capabilities:</strong><br><br>` +
               `• Ask about any planet: "Tell me about Mars"<br>` +
               `• Get recommendations: "Recommend a planet"<br>` +
               `• Random exploration: "Explore a planet"<br>` +
               `• Learn about space topics: "What is a black hole?"<br>` +
               `• Topics I know: planets, stars, galaxies, nebulae, exoplanets, dark matter, and more!<br><br>` +
               `Try asking anything about space exploration!`;
    }

    getDefaultResponse(input) {
        const responses = [
            `Interesting question about "${input}"! 🌌 While I specialize in planets and space exploration, I can tell you about our solar system, stars, galaxies, and more. What would you like to explore?`,
            `I'm an AI trained in space exploration! 🚀 Try asking about planets (Mars, Jupiter, etc.), space phenomena (black holes, nebulae), or get a planet recommendation!`,
            `Great curiosity! 🌟 I have extensive knowledge about our solar system and beyond. Ask me about specific planets or space topics, or say "recommend" for a suggestion!`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getConversationCount() {
        return this.conversationCount;
    }

    getExploredCount() {
        return this.exploredPlanets.size;
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIAssistant;
}
