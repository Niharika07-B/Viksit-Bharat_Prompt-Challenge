// Republic Day Cinematic Background System
// Realistic patriotic environment with fighter jets, tricolor sky, and falling flags

class RepublicDayBackground {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isInitialized = false;
        this.animationId = null;
        
        // Performance settings
        this.performanceLevel = 'high';
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Tricolor theme
        this.colors = {
            saffron: '#ff9933',
            white: '#ffffff',
            green: '#138808',
            ashokaBlue: '#3b82f6',
            skyGradient: {
                top: 'rgba(255, 153, 51, 0.15)',    // Soft saffron
                middle: 'rgba(255, 255, 255, 0.8)',  // White
                bottom: 'rgba(19, 136, 8, 0.15)'     // Light green
            }
        };
        
        // Animation elements
        this.fighterJets = [];
        this.fallingFlags = [];
        this.particles = [];
        this.cursorTrail = [];
        this.smokeTrails = [];
        
        // Timing
        this.time = 0;
        this.lastJetTime = 0;
        this.lastFlagTime = 0;
        
        // Mouse tracking
        this.mouse = { x: 0, y: 0 };
        this.lastMousePos = { x: 0, y: 0 };
    }
    
    // Initialize the Republic Day background
    async init() {
        if (this.isInitialized) return;
        
        try {
            // Detect performance level
            this.detectPerformanceLevel();
            
            // Create canvas
            this.createCanvas();
            
            // Setup sky gradient background
            this.setupSkyBackground();
            
            // Initialize elements
            this.initializeElements();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Start animation loop
            this.animate();
            
            this.isInitialized = true;
            console.log('🇮🇳 Republic Day background initialized');
            
        } catch (error) {
            console.error('Failed to initialize Republic Day background:', error);
            this.enableCSSFallback();
        }
    }
    
    // Detect device performance
    detectPerformanceLevel() {
        const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
        const hasSlowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        
        if (this.isMobile || hasLowMemory || hasSlowCPU || this.prefersReducedMotion) {
            this.performanceLevel = 'low';
        } else if (hasLowMemory || hasSlowCPU) {
            this.performanceLevel = 'medium';
        }
        
        console.log(`🎯 Performance level: ${this.performanceLevel}`);
    }
    
    // Create full-screen canvas
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Style canvas
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: -2;
            pointer-events: none;
        `;
        
        // Set canvas size
        this.resizeCanvas();
        
        // Insert as first child of body
        document.body.insertBefore(this.canvas, document.body.firstChild);
    }
    
    // Setup sky gradient background
    setupSkyBackground() {
        // Create CSS sky gradient
        const skyGradient = document.createElement('div');
        skyGradient.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: -3;
            background: linear-gradient(180deg, 
                ${this.colors.skyGradient.top} 0%,
                ${this.colors.skyGradient.middle} 50%,
                ${this.colors.skyGradient.bottom} 100%
            );
        `;
        
        // Add Ashoka Chakra watermark
        const chakraWatermark = document.createElement('div');
        chakraWatermark.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            height: 300px;
            border: 2px solid rgba(59, 130, 246, 0.03);
            border-radius: 50%;
            background: radial-gradient(circle, 
                rgba(59, 130, 246, 0.02) 0%, 
                transparent 70%
            );
            animation: rotateChakra 60s linear infinite;
        `;
        
        // Add chakra spokes
        for (let i = 0; i < 24; i++) {
            const spoke = document.createElement('div');
            spoke.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 2px;
                height: 140px;
                background: linear-gradient(180deg, 
                    rgba(59, 130, 246, 0.05) 0%, 
                    transparent 30%, 
                    transparent 70%, 
                    rgba(59, 130, 246, 0.05) 100%
                );
                transform: translate(-50%, -50%) rotate(${i * 15}deg);
                transform-origin: center;
            `;
            chakraWatermark.appendChild(spoke);
        }
        
        skyGradient.appendChild(chakraWatermark);
        document.body.insertBefore(skyGradient, document.body.firstChild);
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rotateChakra {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize animation elements
    initializeElements() {
        // Initialize particles for ambient effect
        this.initializeParticles();
    }
    
    // Initialize floating particles
    initializeParticles() {
        const particleCount = this.performanceLevel === 'low' ? 20 : 
                            this.performanceLevel === 'medium' ? 40 : 60;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                color: this.getRandomTricolor(),
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.3 + 0.1,
                life: Math.random() * 1000 + 500
            });
        }
    }
    
    // Get random tricolor
    getRandomTricolor() {
        const colors = [this.colors.saffron, this.colors.white, this.colors.green];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
        
        // Mouse tracking for cursor effects
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.addCursorTrail(e.clientX, e.clientY);
        });
        
        // Click effects
        document.addEventListener('click', (e) => {
            this.createClickSpark(e.clientX, e.clientY);
        });
        
        // Page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimation();
            } else {
                this.resumeAnimation();
            }
        });
    }
    
    // Resize canvas
    resizeCanvas() {
        if (!this.canvas) return;
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    // Add cursor trail
    addCursorTrail(x, y) {
        if (this.performanceLevel === 'low') return;
        
        // Throttle trail creation
        const distance = Math.sqrt(
            Math.pow(x - this.lastMousePos.x, 2) + 
            Math.pow(y - this.lastMousePos.y, 2)
        );
        
        if (distance < 10) return;
        
        this.cursorTrail.push({
            x: x,
            y: y,
            life: 30,
            maxLife: 30,
            color: this.getRandomTricolor(),
            size: Math.random() * 4 + 2
        });
        
        // Limit trail length
        if (this.cursorTrail.length > 15) {
            this.cursorTrail.shift();
        }
        
        this.lastMousePos = { x, y };
    }
    
    // Create click spark effect
    createClickSpark(x, y) {
        if (this.performanceLevel === 'low') return;
        
        // Create spark particles
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const speed = Math.random() * 3 + 2;
            
            this.particles.push({
                x: x,
                y: y,
                size: Math.random() * 3 + 1,
                color: this.getRandomTricolor(),
                speedX: Math.cos(angle) * speed,
                speedY: Math.sin(angle) * speed,
                opacity: 0.8,
                life: 30,
                type: 'spark'
            });
        }
    }
    
    // Create fighter jet
    createFighterJet() {
        if (this.performanceLevel === 'low') return;
        
        const jet = {
            x: -100,
            y: Math.random() * (this.canvas.height * 0.3) + 50, // Top third of screen
            speed: Math.random() * 2 + 3,
            angle: Math.random() * 0.2 - 0.1, // Slight diagonal
            size: Math.random() * 20 + 30,
            smokeTrail: [],
            life: this.canvas.width + 200
        };
        
        this.fighterJets.push(jet);
    }
    
    // Create falling flag
    createFallingFlag() {
        const flag = {
            x: Math.random() * this.canvas.width,
            y: -20,
            speedY: Math.random() * 0.5 + 0.3,
            speedX: (Math.random() - 0.5) * 0.2,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            size: Math.random() * 15 + 10,
            opacity: Math.random() * 0.4 + 0.3,
            life: this.canvas.height + 50
        };
        
        this.fallingFlags.push(flag);
    }
    
    // Main animation loop
    animate() {
        if (!this.isInitialized) return;
        
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update time
        this.time += 16; // ~60fps
        
        // Create fighter jets occasionally
        if (this.time - this.lastJetTime > 15000 + Math.random() * 20000) { // 15-35 seconds
            this.createFighterJet();
            this.lastJetTime = this.time;
        }
        
        // Create falling flags
        if (this.time - this.lastFlagTime > 3000 + Math.random() * 5000) { // 3-8 seconds
            this.createFallingFlag();
            this.lastFlagTime = this.time;
        }
        
        // Animate elements
        this.animateFighterJets();
        this.animateFallingFlags();
        this.animateParticles();
        this.animateCursorTrail();
        this.animateSmokeTrails();
    }
    
    // Animate fighter jets
    animateFighterJets() {
        for (let i = this.fighterJets.length - 1; i >= 0; i--) {
            const jet = this.fighterJets[i];
            
            // Update position
            jet.x += jet.speed;
            jet.y += Math.sin(jet.angle) * jet.speed * 0.1;
            
            // Draw jet (simplified triangle)
            this.ctx.save();
            this.ctx.translate(jet.x, jet.y);
            this.ctx.rotate(jet.angle);
            
            // Jet body
            this.ctx.fillStyle = '#4a5568';
            this.ctx.beginPath();
            this.ctx.moveTo(jet.size, 0);
            this.ctx.lineTo(-jet.size * 0.5, -jet.size * 0.3);
            this.ctx.lineTo(-jet.size * 0.3, 0);
            this.ctx.lineTo(-jet.size * 0.5, jet.size * 0.3);
            this.ctx.closePath();
            this.ctx.fill();
            
            this.ctx.restore();
            
            // Create smoke trail
            if (jet.smokeTrail.length < 20) {
                jet.smokeTrail.push({
                    x: jet.x - jet.size * 0.3,
                    y: jet.y,
                    life: 60,
                    maxLife: 60,
                    size: 5
                });
            }
            
            // Draw tricolor smoke trail
            this.drawSmokeTrail(jet.smokeTrail);
            
            // Remove jet if off screen
            jet.life--;
            if (jet.life <= 0 || jet.x > this.canvas.width + 100) {
                this.fighterJets.splice(i, 1);
            }
        }
    }
    
    // Draw smoke trail
    drawSmokeTrail(trail) {
        for (let i = trail.length - 1; i >= 0; i--) {
            const smoke = trail[i];
            const lifeRatio = smoke.life / smoke.maxLife;
            
            // Tricolor smoke layers
            const colors = [
                { color: this.colors.saffron, offset: 0 },
                { color: this.colors.white, offset: 5 },
                { color: this.colors.green, offset: 10 }
            ];
            
            colors.forEach((layer, index) => {
                this.ctx.save();
                this.ctx.globalAlpha = lifeRatio * 0.3;
                this.ctx.fillStyle = layer.color;
                
                const size = smoke.size + (1 - lifeRatio) * 10;
                this.ctx.beginPath();
                this.ctx.arc(
                    smoke.x, 
                    smoke.y + layer.offset, 
                    size, 
                    0, 
                    Math.PI * 2
                );
                this.ctx.fill();
                this.ctx.restore();
            });
            
            // Update smoke
            smoke.life--;
            smoke.y += Math.random() * 0.5 - 0.25;
            smoke.size += 0.2;
            
            if (smoke.life <= 0) {
                trail.splice(i, 1);
            }
        }
    }
    
    // Animate falling flags
    animateFallingFlags() {
        for (let i = this.fallingFlags.length - 1; i >= 0; i--) {
            const flag = this.fallingFlags[i];
            
            // Update position
            flag.x += flag.speedX;
            flag.y += flag.speedY;
            flag.rotation += flag.rotationSpeed;
            
            // Draw flag
            this.ctx.save();
            this.ctx.translate(flag.x, flag.y);
            this.ctx.rotate(flag.rotation);
            this.ctx.globalAlpha = flag.opacity;
            
            // Flag stripes
            const stripeHeight = flag.size / 3;
            
            // Saffron stripe
            this.ctx.fillStyle = this.colors.saffron;
            this.ctx.fillRect(-flag.size/2, -flag.size/2, flag.size, stripeHeight);
            
            // White stripe
            this.ctx.fillStyle = this.colors.white;
            this.ctx.fillRect(-flag.size/2, -flag.size/2 + stripeHeight, flag.size, stripeHeight);
            
            // Green stripe
            this.ctx.fillStyle = this.colors.green;
            this.ctx.fillRect(-flag.size/2, -flag.size/2 + stripeHeight * 2, flag.size, stripeHeight);
            
            // Simple Ashoka Chakra
            this.ctx.strokeStyle = this.colors.ashokaBlue;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, flag.size * 0.15, 0, Math.PI * 2);
            this.ctx.stroke();
            
            this.ctx.restore();
            
            // Remove flag if off screen
            flag.life--;
            if (flag.life <= 0 || flag.y > this.canvas.height + 50) {
                this.fallingFlags.splice(i, 1);
            }
        }
    }
    
    // Animate particles
    animateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Mouse interaction for ambient particles
            if (particle.type !== 'spark') {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const force = (100 - distance) / 100 * 0.01;
                    particle.speedX += dx * force;
                    particle.speedY += dy * force;
                }
            }
            
            // Draw particle
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
            
            // Update particle
            particle.life--;
            if (particle.type === 'spark') {
                particle.opacity *= 0.95;
                particle.speedX *= 0.98;
                particle.speedY *= 0.98;
            }
            
            // Reset or remove particle
            if (particle.life <= 0) {
                if (particle.type === 'spark') {
                    this.particles.splice(i, 1);
                } else {
                    // Reset ambient particle
                    particle.x = Math.random() * this.canvas.width;
                    particle.y = Math.random() * this.canvas.height;
                    particle.life = Math.random() * 1000 + 500;
                    particle.speedX = (Math.random() - 0.5) * 0.5;
                    particle.speedY = (Math.random() - 0.5) * 0.5;
                }
            }
            
            // Wrap around screen for ambient particles
            if (particle.type !== 'spark') {
                if (particle.x < 0) particle.x = this.canvas.width;
                if (particle.x > this.canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = this.canvas.height;
                if (particle.y > this.canvas.height) particle.y = 0;
            }
        }
    }
    
    // Animate cursor trail
    animateCursorTrail() {
        for (let i = this.cursorTrail.length - 1; i >= 0; i--) {
            const trail = this.cursorTrail[i];
            const lifeRatio = trail.life / trail.maxLife;
            
            // Draw trail point
            this.ctx.save();
            this.ctx.globalAlpha = lifeRatio * 0.6;
            this.ctx.fillStyle = trail.color;
            this.ctx.beginPath();
            this.ctx.arc(trail.x, trail.y, trail.size * lifeRatio, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
            
            trail.life--;
            if (trail.life <= 0) {
                this.cursorTrail.splice(i, 1);
            }
        }
    }
    
    // Animate smoke trails
    animateSmokeTrails() {
        // Handled in animateFighterJets
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
    
    // Enable CSS fallback
    enableCSSFallback() {
        const fallbackStyle = document.createElement('style');
        fallbackStyle.textContent = `
            body::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -2;
                background: 
                    linear-gradient(180deg, 
                        rgba(255, 153, 51, 0.1) 0%,
                        rgba(255, 255, 255, 0.8) 50%,
                        rgba(19, 136, 8, 0.1) 100%
                    );
                animation: subtleGlow 10s ease-in-out infinite;
            }
            
            @keyframes subtleGlow {
                0%, 100% { opacity: 0.8; }
                50% { opacity: 1; }
            }
        `;
        document.head.appendChild(fallbackStyle);
        
        console.log('🎨 Using CSS fallback for Republic Day background');
    }
    
    // Cleanup
    cleanup() {
        this.pauseAnimation();
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        this.isInitialized = false;
    }
}

// Export for global use
window.RepublicDayBackground = RepublicDayBackground;