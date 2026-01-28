// Three.js Animated Background for Viksit Vaani – SwarVyapaar
// Creates cinematic patriotic background with Indian flag colors

class ThreeBackground {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.waves = [];
        this.flags = [];
        this.animationId = null;
        this.isInitialized = false;
        
        // Tricolor theme colors
        this.colors = {
            saffron: 0xff9933,
            white: 0xffffff,
            green: 0x138808,
            ashokaBlue: 0x3b82f6
        };
    }
    
    // Initialize Three.js background
    async init() {
        if (this.isInitialized) return;
        
        try {
            // Load Three.js from CDN
            await this.loadThreeJS();
            
            // Setup scene
            this.setupScene();
            this.setupCamera();
            this.setupRenderer();
            this.setupLights();
            
            // Create elements
            this.createTricolorWaves();
            this.createPatrioticParticles();
            this.createFloatingFlags();
            
            // Start animation
            this.animate();
            
            // Handle resize
            window.addEventListener('resize', () => this.onWindowResize());
            
            this.isInitialized = true;
            console.log('Three.js background initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize Three.js background:', error);
            // Fallback to CSS background
            this.enableCSSFallback();
        }
    }
    
    // Load Three.js library
    async loadThreeJS() {
        return new Promise((resolve, reject) => {
            if (window.THREE) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            script.onload = () => {
                if (window.THREE) {
                    resolve();
                } else {
                    reject(new Error('Three.js failed to load'));
                }
            };
            script.onerror = () => reject(new Error('Failed to load Three.js'));
            document.head.appendChild(script);
        });
    }
    
    // Setup Three.js scene
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0xffffff, 1, 1000);
    }
    
    // Setup camera
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.z = 5;
    }
    
    // Setup renderer
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0); // Transparent background
        
        // Insert canvas into hero section
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            const canvas = this.renderer.domElement;
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.zIndex = '1';
            canvas.style.pointerEvents = 'none';
            heroSection.appendChild(canvas);
        }
    }
    
    // Setup lighting
    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
    }
    
    // Create flowing tricolor waves
    createTricolorWaves() {
        const waveGeometry = new THREE.PlaneGeometry(20, 2, 32, 1);
        
        // Saffron wave
        const saffronMaterial = new THREE.MeshLambertMaterial({ 
            color: this.colors.saffron,
            transparent: true,
            opacity: 0.3
        });
        const saffronWave = new THREE.Mesh(waveGeometry, saffronMaterial);
        saffronWave.position.set(0, 2, -5);
        saffronWave.rotation.x = -Math.PI / 6;
        this.scene.add(saffronWave);
        this.waves.push({ mesh: saffronWave, speed: 0.01, amplitude: 0.5 });
        
        // White wave
        const whiteMaterial = new THREE.MeshLambertMaterial({ 
            color: this.colors.white,
            transparent: true,
            opacity: 0.2
        });
        const whiteWave = new THREE.Mesh(waveGeometry, whiteMaterial);
        whiteWave.position.set(0, 0, -4);
        whiteWave.rotation.x = -Math.PI / 8;
        this.scene.add(whiteWave);
        this.waves.push({ mesh: whiteWave, speed: 0.015, amplitude: 0.3 });
        
        // Green wave
        const greenMaterial = new THREE.MeshLambertMaterial({ 
            color: this.colors.green,
            transparent: true,
            opacity: 0.3
        });
        const greenWave = new THREE.Mesh(waveGeometry, greenMaterial);
        greenWave.position.set(0, -2, -3);
        greenWave.rotation.x = -Math.PI / 4;
        this.scene.add(greenWave);
        this.waves.push({ mesh: greenWave, speed: 0.008, amplitude: 0.4 });
    }
    
    // Create patriotic particles
    createPatrioticParticles() {
        const particleCount = 100;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        const tricolors = [
            new THREE.Color(this.colors.saffron),
            new THREE.Color(this.colors.white),
            new THREE.Color(this.colors.green)
        ];
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Position
            positions[i3] = (Math.random() - 0.5) * 20;
            positions[i3 + 1] = (Math.random() - 0.5) * 20;
            positions[i3 + 2] = (Math.random() - 0.5) * 10;
            
            // Color (tricolor)
            const color = tricolors[Math.floor(Math.random() * tricolors.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            // Size
            sizes[i] = Math.random() * 3 + 1;
            
            // Store particle data for animation
            this.particles.push({
                velocity: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                originalPosition: {
                    x: positions[i3],
                    y: positions[i3 + 1],
                    z: positions[i3 + 2]
                }
            });
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const particleSystem = new THREE.Points(geometry, material);
        this.scene.add(particleSystem);
        this.particleSystem = particleSystem;
    }
    
    // Create floating flag elements
    createFloatingFlags() {
        const flagGeometry = new THREE.PlaneGeometry(0.5, 0.3);
        
        for (let i = 0; i < 5; i++) {
            // Create tricolor flag
            const flagGroup = new THREE.Group();
            
            // Saffron stripe
            const saffronMaterial = new THREE.MeshLambertMaterial({ color: this.colors.saffron });
            const saffronStripe = new THREE.Mesh(
                new THREE.PlaneGeometry(0.5, 0.1), 
                saffronMaterial
            );
            saffronStripe.position.y = 0.1;
            flagGroup.add(saffronStripe);
            
            // White stripe
            const whiteMaterial = new THREE.MeshLambertMaterial({ color: this.colors.white });
            const whiteStripe = new THREE.Mesh(
                new THREE.PlaneGeometry(0.5, 0.1), 
                whiteMaterial
            );
            whiteStripe.position.y = 0;
            flagGroup.add(whiteStripe);
            
            // Green stripe
            const greenMaterial = new THREE.MeshLambertMaterial({ color: this.colors.green });
            const greenStripe = new THREE.Mesh(
                new THREE.PlaneGeometry(0.5, 0.1), 
                greenMaterial
            );
            greenStripe.position.y = -0.1;
            flagGroup.add(greenStripe);
            
            // Position flag
            flagGroup.position.set(
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 8
            );
            
            this.scene.add(flagGroup);
            this.flags.push({
                group: flagGroup,
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                floatSpeed: Math.random() * 0.01 + 0.005
            });
        }
    }
    
    // Animation loop
    animate() {
        if (!this.isInitialized) return;
        
        this.animationId = requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Animate waves
        this.waves.forEach(wave => {
            const positions = wave.mesh.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] = Math.sin(positions[i] * 0.1 + time * wave.speed) * wave.amplitude;
            }
            wave.mesh.geometry.attributes.position.needsUpdate = true;
        });
        
        // Animate particles
        if (this.particleSystem) {
            const positions = this.particleSystem.geometry.attributes.position.array;
            for (let i = 0; i < this.particles.length; i++) {
                const particle = this.particles[i];
                const i3 = i * 3;
                
                positions[i3] += particle.velocity.x;
                positions[i3 + 1] += particle.velocity.y;
                positions[i3 + 2] += particle.velocity.z;
                
                // Reset particle if it goes too far
                if (Math.abs(positions[i3]) > 10 || Math.abs(positions[i3 + 1]) > 10) {
                    positions[i3] = particle.originalPosition.x;
                    positions[i3 + 1] = particle.originalPosition.y;
                    positions[i3 + 2] = particle.originalPosition.z;
                }
            }
            this.particleSystem.geometry.attributes.position.needsUpdate = true;
        }
        
        // Animate flags
        this.flags.forEach(flag => {
            flag.group.rotation.x += flag.rotationSpeed.x;
            flag.group.rotation.y += flag.rotationSpeed.y;
            flag.group.rotation.z += flag.rotationSpeed.z;
            
            flag.group.position.y += Math.sin(time * flag.floatSpeed) * 0.01;
        });
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
    
    // Handle window resize
    onWindowResize() {
        if (!this.camera || !this.renderer) return;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Enable CSS fallback if Three.js fails
    enableCSSFallback() {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.style.background = `
                linear-gradient(135deg, 
                    rgba(255, 153, 51, 0.1) 0%, 
                    rgba(255, 255, 255, 0.05) 50%, 
                    rgba(19, 136, 8, 0.1) 100%
                )
            `;
        }
        console.log('Using CSS fallback background');
    }
    
    // Cleanup resources
    cleanup() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        // Clean up geometries and materials
        this.scene?.traverse((object) => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
        
        this.isInitialized = false;
    }
}

// Export for global use
window.ThreeBackground = ThreeBackground;