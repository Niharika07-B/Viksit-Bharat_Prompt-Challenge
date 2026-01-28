// Global Tricolor Background System for Viksit Vaani – SwarVyapaar
// Site-wide interactive Indian flag-inspired background with Three.js

class TricolorBackground {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.canvas = null;
        this.isInitialized = false;
        this.animationId = null;
        
        // Performance management
        this.performanceLevel = 'high'; // high, medium, low
        this.particleCount = 150;
        this.waveComplexity = 32;
        
        // Tricolor theme
        this.colors = {
            saffron: 0xff9933,
            white: 0xffffff,
            green: 0x138808,
            ashokaBlue: 0x3b82f6,
            transparent: 0x000000
        };
        
        // Animation elements
        this.tricolorWaves = [];
        this.floatingFlags = [];
        this.chakraLines = [];
        this.particles = [];
        this.lightRays = [];
        
        // Interaction system
        this.mousePosition = { x: 0, y: 0 };
        this.interactionEffects = [];
        this.currentSection = 'home';
        
        // Timing
        this.time = 0;
        this.deltaTime = 0;
        this.lastTime = 0;
    }
    
    // Initialize the global background system
    async init() {
        if (this.isInitialized) return;
        
        try {
            // Load Three.js if not available
            await this.loadThreeJS();
            
            // Detect performance level
            this.detectPerformanceLevel();
            
            // Setup Three.js scene
            this.setupScene();
            this.setupCamera();
            this.setupRenderer();
            this.setupLights();
            
            // Create tricolor elements
            this.createTricolorWaves();
            this.createFloatingFlags();
            this.createChakraLines();
            this.createParticleSystem();
            this.createLightRays();
            
            // Setup interaction handlers
            this.setupInteractionHandlers();
            
            // Start animation loop
            this.animate();
            
            // Handle window events
            this.setupEventHandlers();
            
            this.isInitialized = true;
            console.log('🇮🇳 Tricolor background system initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize tricolor background:', error);
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
    
    // Detect device performance level
    detectPerformanceLevel() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
            this.performanceLevel = 'low';
            return;
        }
        
        // Check device capabilities
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
        const hasSlowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        
        if (isMobile || hasLowMemory || hasSlowCPU) {
            this.performanceLevel = 'medium';
            this.particleCount = 75;
            this.waveComplexity = 16;
        }
        
        // Further reduce for very low-end devices
        if (isMobile && (hasLowMemory || hasSlowCPU)) {
            this.performanceLevel = 'low';
            this.particleCount = 30;
            this.waveComplexity = 8;
        }
        
        console.log(`🎯 Performance level: ${this.performanceLevel}`);
    }
    
    // Setup Three.js scene
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0xffffff, 50, 200);
    }
    
    // Setup camera
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            60, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(0, 0, 30);
    }
    
    // Setup renderer with full-screen canvas
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: this.performanceLevel === 'high'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0); // Transparent
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Create full-screen fixed canvas
        this.canvas = this.renderer.domElement;
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: -1;
            pointer-events: none;
        `;
        
        // Insert as first child of body
        document.body.insertBefore(this.canvas, document.body.firstChild);
    }
    
    // Setup lighting
    setupLights() {
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
        
        // Directional light for depth
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(10, 10, 5);
        this.scene.add(directionalLight);
        
        // Subtle point lights for tricolor glow
        const saffronLight = new THREE.PointLight(this.colors.saffron, 0.3, 50);
        saffronLight.position.set(-20, 15, 10);
        this.scene.add(saffronLight);
        
        const greenLight = new THREE.PointLight(this.colors.green, 0.3, 50);
        greenLight.position.set(20, -15, 10);
        this.scene.add(greenLight);
    }
    
    // Create flowing tricolor waves
    createTricolorWaves() {
        const waveGeometry = new THREE.PlaneGeometry(100, 20, this.waveComplexity, 4);
        
        // Saffron wave (top)
        const saffronMaterial = new THREE.MeshLambertMaterial({ 
            color: this.colors.saffron,
            transparent: true,
            opacity: 0.15,
            side: THREE.DoubleSide
        });
        const saffronWave = new THREE.Mesh(waveGeometry, saffronMaterial);
        saffronWave.position.set(0, 15, -20);
        saffronWave.rotation.x = -Math.PI / 8;
        this.scene.add(saffronWave);
        
        // White wave (middle)
        const whiteMaterial = new THREE.MeshLambertMaterial({ 
            color: this.colors.white,
            transparent: true,
            opacity: 0.08,
            side: THREE.DoubleSide
        });
        const whiteWave = new THREE.Mesh(waveGeometry.clone(), whiteMaterial);
        whiteWave.position.set(0, 0, -15);
        whiteWave.rotation.x = -Math.PI / 12;
        this.scene.add(whiteWave);
        
        // Green wave (bottom)
        const greenMaterial = new THREE.MeshLambertMaterial({ 
            color: this.colors.green,
            transparent: true,
            opacity: 0.15,
            side: THREE.DoubleSide
        });
        const greenWave = new THREE.Mesh(waveGeometry.clone(), greenMaterial);
        greenWave.position.set(0, -15, -10);
        greenWave.rotation.x = Math.PI / 8;
        this.scene.add(greenWave);
        
        this.tricolorWaves = [
            { mesh: saffronWave, speed: 0.008, amplitude: 1.2, phase: 0 },
            { mesh: whiteWave, speed: 0.012, amplitude: 0.8, phase: Math.PI / 3 },
            { mesh: greenWave, speed: 0.006, amplitude: 1.0, phase: Math.PI / 2 }
        ];
    }
    
    // Create floating mini Indian flags
    createFloatingFlags() {
        const flagCount = this.performanceLevel === 'low' ? 3 : 
                         this.performanceLevel === 'medium' ? 5 : 8;
        
        for (let i = 0; i < flagCount; i++) {
            const flagGroup = new THREE.Group();
            
            // Create tricolor flag
            const stripeHeight = 0.3;
            const stripeWidth = 0.8;
            
            // Saffron stripe
            const saffronGeometry = new THREE.PlaneGeometry(stripeWidth, stripeHeight);
            const saffronMaterial = new THREE.MeshLambertMaterial({ 
                color: this.colors.saffron,
                transparent: true,
                opacity: 0.7
            });
            const saffronStripe = new THREE.Mesh(saffronGeometry, saffronMaterial);
            saffronStripe.position.y = stripeHeight;
            flagGroup.add(saffronStripe);
            
            // White stripe with Ashoka Chakra
            const whiteMaterial = new THREE.MeshLambertMaterial({ 
                color: this.colors.white,
                transparent: true,
                opacity: 0.8
            });
            const whiteStripe = new THREE.Mesh(saffronGeometry.clone(), whiteMaterial);
            whiteStripe.position.y = 0;
            flagGroup.add(whiteStripe);
            
            // Simple chakra representation
            const chakraGeometry = new THREE.RingGeometry(0.08, 0.12, 8);
            const chakraMaterial = new THREE.MeshBasicMaterial({ 
                color: this.colors.ashokaBlue,
                transparent: true,
                opacity: 0.6
            });
            const chakra = new THREE.Mesh(chakraGeometry, chakraMaterial);
            chakra.position.set(0, 0, 0.01);
            flagGroup.add(chakra);
            
            // Green stripe
            const greenMaterial = new THREE.MeshLambertMaterial({ 
                color: this.colors.green,
                transparent: true,
                opacity: 0.7
            });
            const greenStripe = new THREE.Mesh(saffronGeometry.clone(), greenMaterial);
            greenStripe.position.y = -stripeHeight;
            flagGroup.add(greenStripe);
            
            // Position flag randomly
            flagGroup.position.set(
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 30
            );
            
            flagGroup.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            this.scene.add(flagGroup);
            this.floatingFlags.push({
                group: flagGroup,
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.01,
                    y: (Math.random() - 0.5) * 0.01,
                    z: (Math.random() - 0.5) * 0.01
                },
                floatSpeed: Math.random() * 0.005 + 0.002,
                originalY: flagGroup.position.y
            });
        }
    }
    
    // Create chakra-inspired radial lines
    createChakraLines() {
        const lineCount = 24; // Ashoka Chakra has 24 spokes
        const radius = 25;
        
        for (let i = 0; i < lineCount; i++) {
            const angle = (i / lineCount) * Math.PI * 2;
            const geometry = new THREE.BufferGeometry();
            
            const positions = new Float32Array([
                0, 0, 0,
                Math.cos(angle) * radius, Math.sin(angle) * radius, 0
            ]);
            
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            
            const material = new THREE.LineBasicMaterial({ 
                color: this.colors.ashokaBlue,
                transparent: true,
                opacity: 0.05
            });
            
            const line = new THREE.Line(geometry, material);
            line.position.z = -25;
            this.scene.add(line);
            
            this.chakraLines.push({
                line: line,
                originalOpacity: 0.05,
                pulsePhase: (i / lineCount) * Math.PI * 2
            });
        }
    }
    
    // Create particle system
    createParticleSystem() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);
        
        const tricolors = [
            new THREE.Color(this.colors.saffron),
            new THREE.Color(this.colors.white),
            new THREE.Color(this.colors.green)
        ];
        
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            // Position
            positions[i3] = (Math.random() - 0.5) * 100;
            positions[i3 + 1] = (Math.random() - 0.5) * 60;
            positions[i3 + 2] = (Math.random() - 0.5) * 40;
            
            // Color (tricolor)
            const color = tricolors[Math.floor(Math.random() * tricolors.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            // Size
            sizes[i] = Math.random() * 2 + 0.5;
            
            // Store particle data
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
                },
                life: Math.random() * 1000 + 500
            });
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }
    
    // Create subtle light rays
    createLightRays() {
        const rayCount = this.performanceLevel === 'low' ? 3 : 6;
        
        for (let i = 0; i < rayCount; i++) {
            const geometry = new THREE.ConeGeometry(0.5, 40, 4);
            const material = new THREE.MeshBasicMaterial({ 
                color: i % 2 === 0 ? this.colors.saffron : this.colors.green,
                transparent: true,
                opacity: 0.03
            });
            
            const ray = new THREE.Mesh(geometry, material);
            ray.position.set(
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 40,
                -30
            );
            ray.rotation.z = Math.random() * Math.PI * 2;
            
            this.scene.add(ray);
            this.lightRays.push({
                mesh: ray,
                rotationSpeed: (Math.random() - 0.5) * 0.005,
                pulseSpeed: Math.random() * 0.01 + 0.005
            });
        }
    }
    
    // Setup interaction handlers
    setupInteractionHandlers() {
        // Mouse movement tracking
        document.addEventListener('mousemove', (event) => {
            this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            this.createMouseRipple(event.clientX, event.clientY);
        });
        
        // Click effects
        document.addEventListener('click', (event) => {
            this.createClickBurst(event.clientX, event.clientY);
        });
        
        // Button hover effects
        document.addEventListener('mouseover', (event) => {
            if (event.target.matches('button, .btn, .nav-link, .action-card')) {
                this.createHoverGlow(event.clientX, event.clientY);
            }
        });
    }
    
    // Create mouse ripple effect
    createMouseRipple(x, y) {
        if (this.interactionEffects.length > 10) return; // Limit effects
        
        const worldPos = this.screenToWorld(x, y);
        
        // Create ripple geometry
        const geometry = new THREE.RingGeometry(0.5, 1, 8);
        const material = new THREE.MeshBasicMaterial({ 
            color: this.colors.ashokaBlue,
            transparent: true,
            opacity: 0.3
        });
        
        const ripple = new THREE.Mesh(geometry, material);
        ripple.position.set(worldPos.x, worldPos.y, 5);
        this.scene.add(ripple);
        
        this.interactionEffects.push({
            mesh: ripple,
            type: 'ripple',
            life: 60,
            maxLife: 60
        });
    }
    
    // Create click burst effect
    createClickBurst(x, y) {
        const worldPos = this.screenToWorld(x, y);
        
        // Create burst particles
        for (let i = 0; i < 8; i++) {
            const geometry = new THREE.SphereGeometry(0.1, 4, 4);
            const color = [this.colors.saffron, this.colors.white, this.colors.green][i % 3];
            const material = new THREE.MeshBasicMaterial({ 
                color: color,
                transparent: true,
                opacity: 0.8
            });
            
            const particle = new THREE.Mesh(geometry, material);
            particle.position.set(worldPos.x, worldPos.y, 5);
            
            const angle = (i / 8) * Math.PI * 2;
            const speed = 0.3;
            
            this.scene.add(particle);
            this.interactionEffects.push({
                mesh: particle,
                type: 'burst',
                velocity: {
                    x: Math.cos(angle) * speed,
                    y: Math.sin(angle) * speed,
                    z: 0
                },
                life: 30,
                maxLife: 30
            });
        }
    }
    
    // Create hover glow effect
    createHoverGlow(x, y) {
        const worldPos = this.screenToWorld(x, y);
        
        const geometry = new THREE.SphereGeometry(2, 8, 8);
        const material = new THREE.MeshBasicMaterial({ 
            color: this.colors.saffron,
            transparent: true,
            opacity: 0.1
        });
        
        const glow = new THREE.Mesh(geometry, material);
        glow.position.set(worldPos.x, worldPos.y, 0);
        this.scene.add(glow);
        
        this.interactionEffects.push({
            mesh: glow,
            type: 'glow',
            life: 20,
            maxLife: 20
        });
    }
    
    // Convert screen coordinates to world coordinates
    screenToWorld(screenX, screenY) {
        const vector = new THREE.Vector3();
        vector.set(
            (screenX / window.innerWidth) * 2 - 1,
            -(screenY / window.innerHeight) * 2 + 1,
            0.5
        );
        vector.unproject(this.camera);
        
        const dir = vector.sub(this.camera.position).normalize();
        const distance = -this.camera.position.z / dir.z;
        const pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
        
        return pos;
    }
    
    // Update section-aware background
    updateSectionBackground(sectionId) {
        this.currentSection = sectionId;
        
        // Adjust background intensity based on section
        const sectionSettings = {
            home: { intensity: 1.0, speed: 1.0 },
            dashboard: { intensity: 0.7, speed: 0.8 },
            'voice-price': { intensity: 0.9, speed: 1.2 },
            negotiation: { intensity: 0.6, speed: 0.7 },
            inventory: { intensity: 0.8, speed: 0.9 },
            history: { intensity: 0.5, speed: 0.6 }
        };
        
        const settings = sectionSettings[sectionId] || sectionSettings.home;
        
        // Update wave intensities
        this.tricolorWaves.forEach(wave => {
            wave.mesh.material.opacity = wave.mesh.material.opacity * settings.intensity;
        });
        
        // Update particle opacity
        if (this.particleSystem) {
            this.particleSystem.material.opacity = 0.6 * settings.intensity;
        }
    }
    
    // Setup event handlers
    setupEventHandlers() {
        // Window resize
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
        
        // Section change detection
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList.contains('section') && target.classList.contains('active')) {
                        this.updateSectionBackground(target.id);
                    }
                }
            });
        });
        
        // Observe all sections
        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section, { attributes: true });
        });
        
        // Page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimation();
            } else {
                this.resumeAnimation();
            }
        });
    }
    
    // Main animation loop
    animate() {
        if (!this.isInitialized) return;
        
        this.animationId = requestAnimationFrame(() => this.animate());
        
        const currentTime = performance.now();
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        this.time = currentTime * 0.001;
        
        // Animate tricolor waves
        this.animateWaves();
        
        // Animate floating flags
        this.animateFlags();
        
        // Animate chakra lines
        this.animateChakraLines();
        
        // Animate particles
        this.animateParticles();
        
        // Animate light rays
        this.animateLightRays();
        
        // Update interaction effects
        this.updateInteractionEffects();
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
    
    // Animate tricolor waves
    animateWaves() {
        this.tricolorWaves.forEach(wave => {
            const positions = wave.mesh.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                const originalY = positions[i + 1];
                
                positions[i + 1] = originalY + Math.sin(x * 0.1 + this.time * wave.speed + wave.phase) * wave.amplitude;
            }
            
            wave.mesh.geometry.attributes.position.needsUpdate = true;
            
            // Gentle rotation
            wave.mesh.rotation.z += wave.speed * 0.1;
        });
    }
    
    // Animate floating flags
    animateFlags() {
        this.floatingFlags.forEach(flag => {
            // Rotation
            flag.group.rotation.x += flag.rotationSpeed.x;
            flag.group.rotation.y += flag.rotationSpeed.y;
            flag.group.rotation.z += flag.rotationSpeed.z;
            
            // Floating motion
            flag.group.position.y = flag.originalY + Math.sin(this.time * flag.floatSpeed) * 2;
            
            // Gentle drift
            flag.group.position.x += Math.sin(this.time * flag.floatSpeed * 0.5) * 0.01;
        });
    }
    
    // Animate chakra lines
    animateChakraLines() {
        this.chakraLines.forEach(line => {
            const pulseIntensity = Math.sin(this.time * 2 + line.pulsePhase) * 0.5 + 0.5;
            line.line.material.opacity = line.originalOpacity + pulseIntensity * 0.02;
            
            // Gentle rotation
            line.line.rotation.z += 0.001;
        });
    }
    
    // Animate particles
    animateParticles() {
        if (!this.particleSystem) return;
        
        const positions = this.particleSystem.geometry.attributes.position.array;
        
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            const i3 = i * 3;
            
            // Move particles
            positions[i3] += particle.velocity.x;
            positions[i3 + 1] += particle.velocity.y;
            positions[i3 + 2] += particle.velocity.z;
            
            // Mouse interaction
            const mouseInfluence = 5;
            const dx = this.mousePosition.x * 50 - positions[i3];
            const dy = this.mousePosition.y * 30 - positions[i3 + 1];
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouseInfluence) {
                const force = (mouseInfluence - distance) / mouseInfluence * 0.01;
                positions[i3] += dx * force;
                positions[i3 + 1] += dy * force;
            }
            
            // Reset particles that go too far
            if (Math.abs(positions[i3]) > 50 || Math.abs(positions[i3 + 1]) > 30) {
                positions[i3] = particle.originalPosition.x;
                positions[i3 + 1] = particle.originalPosition.y;
                positions[i3 + 2] = particle.originalPosition.z;
            }
            
            // Life cycle
            particle.life--;
            if (particle.life <= 0) {
                particle.life = Math.random() * 1000 + 500;
            }
        }
        
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
    }
    
    // Animate light rays
    animateLightRays() {
        this.lightRays.forEach(ray => {
            ray.mesh.rotation.z += ray.rotationSpeed;
            
            const pulse = Math.sin(this.time * ray.pulseSpeed) * 0.5 + 0.5;
            ray.mesh.material.opacity = 0.03 + pulse * 0.02;
        });
    }
    
    // Update interaction effects
    updateInteractionEffects() {
        for (let i = this.interactionEffects.length - 1; i >= 0; i--) {
            const effect = this.interactionEffects[i];
            effect.life--;
            
            const lifeRatio = effect.life / effect.maxLife;
            
            switch (effect.type) {
                case 'ripple':
                    effect.mesh.scale.setScalar(1 + (1 - lifeRatio) * 3);
                    effect.mesh.material.opacity = lifeRatio * 0.3;
                    break;
                    
                case 'burst':
                    effect.mesh.position.add(effect.velocity);
                    effect.mesh.material.opacity = lifeRatio * 0.8;
                    effect.velocity.multiplyScalar(0.95); // Slow down
                    break;
                    
                case 'glow':
                    effect.mesh.scale.setScalar(1 + (1 - lifeRatio) * 0.5);
                    effect.mesh.material.opacity = lifeRatio * 0.1;
                    break;
            }
            
            if (effect.life <= 0) {
                this.scene.remove(effect.mesh);
                this.interactionEffects.splice(i, 1);
            }
        }
    }
    
    // Handle window resize
    onWindowResize() {
        if (!this.camera || !this.renderer) return;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Pause animation
    pauseAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    // Resume animation
    resumeAnimation() {
        if (!this.animationId && this.isInitialized) {
            this.animate();
        }
    }
    
    // Enable CSS fallback for low-end devices
    enableCSSFallback() {
        document.body.style.background = `
            linear-gradient(135deg, 
                rgba(255, 153, 51, 0.05) 0%, 
                rgba(255, 255, 255, 0.02) 33%,
                rgba(255, 255, 255, 0.02) 66%, 
                rgba(19, 136, 8, 0.05) 100%
            )
        `;
        
        // Add subtle CSS animation
        const style = document.createElement('style');
        style.textContent = `
            body::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: 
                    radial-gradient(circle at 20% 20%, rgba(255, 153, 51, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, rgba(19, 136, 8, 0.1) 0%, transparent 50%);
                z-index: -1;
                animation: tricolorPulse 10s ease-in-out infinite;
            }
            
            @keyframes tricolorPulse {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 0.6; }
            }
        `;
        document.head.appendChild(style);
        
        console.log('🎨 Using CSS fallback background');
    }
    
    // Cleanup resources
    cleanup() {
        this.pauseAnimation();
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
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
window.TricolorBackground = TricolorBackground;