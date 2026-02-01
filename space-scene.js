// 3D Space Scene Module using Three.js
// Creates an interactive AR-ready 3D visualization of space

class SpaceScene {
    constructor(canvasId) {
        this.canvasId = canvasId;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.planets = [];
        this.stars = [];
        this.animationId = null;
        this.isPlanetsVisible = true;
        
        this.init();
    }

    init() {
        const canvas = document.getElementById(this.canvasId);
        if (!canvas) {
            console.error('Canvas not found');
            return;
        }

        const container = canvas.parentElement;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Setup Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        this.scene.fog = new THREE.FogExp2(0x000000, 0.00025);

        // Setup Camera
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.z = 50;
        this.camera.position.y = 10;

        // Setup Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // Create Scene Elements
        this.createStarfield();
        this.createSolarSystem();
        this.createLighting();

        // Add interactive controls
        this.setupInteraction();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Start animation
        this.animate();
    }

    createStarfield() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 2000;
        const positions = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 200;     // x
            positions[i + 1] = (Math.random() - 0.5) * 200; // y
            positions[i + 2] = (Math.random() - 0.5) * 200; // z
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.5,
            transparent: true,
            opacity: 0.8
        });

        const starfield = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(starfield);
        this.stars.push(starfield);
    }

    createSolarSystem() {
        // Create Sun
        const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xfdb813,
            emissive: 0xfdb813,
            emissiveIntensity: 1
        });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sun.name = 'Sun';
        this.scene.add(sun);
        this.planets.push(sun);

        // Planet data: [distance, size, color, speed, name]
        const planetData = [
            [8, 0.5, 0x8c7853, 0.04, 'Mercury'],
            [12, 0.9, 0xffc649, 0.015, 'Venus'],
            [16, 1.0, 0x4a90e2, 0.01, 'Earth'],
            [20, 0.7, 0xe27b58, 0.008, 'Mars'],
            [28, 2.5, 0xc88b3a, 0.002, 'Jupiter'],
            [36, 2.2, 0xfad5a5, 0.0009, 'Saturn'],
            [44, 1.5, 0x4fd0e7, 0.0004, 'Uranus'],
            [52, 1.5, 0x4166f5, 0.0001, 'Neptune']
        ];

        planetData.forEach(([distance, size, color, speed, name]) => {
            const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
            const planetMaterial = new THREE.MeshStandardMaterial({
                color: color,
                roughness: 0.7,
                metalness: 0.3
            });
            const planet = new THREE.Mesh(planetGeometry, planetMaterial);
            
            planet.position.x = distance;
            planet.userData = { 
                distance: distance, 
                speed: speed,
                angle: Math.random() * Math.PI * 2,
                name: name
            };
            
            this.scene.add(planet);
            this.planets.push(planet);

            // Create orbit line
            const orbitGeometry = new THREE.RingGeometry(distance - 0.1, distance + 0.1, 64);
            const orbitMaterial = new THREE.MeshBasicMaterial({
                color: 0x444444,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.2
            });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2;
            this.scene.add(orbit);
        });

        // Add Saturn's rings
        const saturnIndex = this.planets.findIndex(p => p.userData?.name === 'Saturn');
        if (saturnIndex > 0) {
            const saturn = this.planets[saturnIndex];
            const ringGeometry = new THREE.RingGeometry(2.5, 4, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: 0xfad5a5,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.6
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            saturn.add(ring);
        }
    }

    createLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);

        // Point light from sun
        const pointLight = new THREE.PointLight(0xffffff, 2, 100);
        pointLight.position.set(0, 0, 0);
        this.scene.add(pointLight);

        // Additional directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(10, 10, 10);
        this.scene.add(directionalLight);
    }

    setupInteraction() {
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        const canvas = document.getElementById(this.canvasId);

        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        canvas.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - previousMousePosition.x;
                const deltaY = e.clientY - previousMousePosition.y;

                this.camera.position.x += deltaX * 0.05;
                this.camera.position.y -= deltaY * 0.05;

                previousMousePosition = { x: e.clientX, y: e.clientY };
            }
        });

        canvas.addEventListener('mouseup', () => {
            isDragging = false;
        });

        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.camera.position.z += e.deltaY * 0.05;
            this.camera.position.z = Math.max(10, Math.min(100, this.camera.position.z));
        });
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        // Rotate planets around the sun
        this.planets.forEach(planet => {
            if (planet.userData && planet.userData.distance) {
                planet.userData.angle += planet.userData.speed;
                planet.position.x = Math.cos(planet.userData.angle) * planet.userData.distance;
                planet.position.z = Math.sin(planet.userData.angle) * planet.userData.distance;
                planet.rotation.y += 0.01;
            }
        });

        // Slowly rotate camera for cinematic effect
        this.camera.position.x = Math.sin(Date.now() * 0.0001) * 5;

        this.renderer.render(this.scene, this.camera);
    }

    togglePlanets() {
        this.isPlanetsVisible = !this.isPlanetsVisible;
        this.planets.forEach(planet => {
            if (planet.userData?.name) { // Don't hide the sun
                planet.visible = this.isPlanetsVisible;
            }
        });
        return this.isPlanetsVisible;
    }

    focusOnRandomPlanet() {
        const namedPlanets = this.planets.filter(p => p.userData?.name && p.userData.name !== 'Sun');
        if (namedPlanets.length === 0) return null;

        const randomPlanet = namedPlanets[Math.floor(Math.random() * namedPlanets.length)];
        
        // Smoothly move camera to planet
        const targetPosition = {
            x: randomPlanet.position.x,
            y: randomPlanet.position.y + 5,
            z: randomPlanet.position.z + 10
        };

        this.animateCameraTo(targetPosition);
        
        return randomPlanet.userData.name;
    }

    animateCameraTo(targetPosition) {
        const duration = 2000; // 2 seconds
        const startPosition = {
            x: this.camera.position.x,
            y: this.camera.position.y,
            z: this.camera.position.z
        };
        const startTime = Date.now();

        const animateCamera = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease in-out function
            const easeProgress = progress < 0.5 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            this.camera.position.x = startPosition.x + (targetPosition.x - startPosition.x) * easeProgress;
            this.camera.position.y = startPosition.y + (targetPosition.y - startPosition.y) * easeProgress;
            this.camera.position.z = startPosition.z + (targetPosition.z - startPosition.z) * easeProgress;

            if (progress < 1) {
                requestAnimationFrame(animateCamera);
            }
        };

        animateCamera();
    }

    onWindowResize() {
        const container = document.getElementById(this.canvasId).parentElement;
        const width = container.clientWidth;
        const height = container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.renderer.dispose();
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpaceScene;
}
