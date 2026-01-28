// Republic Day Background Effects - Realistic & Cinematic
// Tricolor waves, falling flags, white birds, and galaxy animation

class RepublicDayEffects {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isInitialized = false;
        this.animationId = null;
        
        // Performance settings
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Colors
        this.colors = {
            saffron: '#ff9933',
            white: '#ffffff',
            green: '#138808',
            ashokaBlue: '#3b82f6'
        };
        
        // Animation elements
        this.tricolorWaves = [];
        this.fallingFlags = [];
        this.whiteBirds = [];
        this.galaxyParticles = [];
        
        // Timing
        this.time = 0;
        this.lastFlagTime = 0;
        this.lastBirdTime = 0;
    }
    
    async init() {
        if (this.isInitialized) return;
        
        try {
            this.createCanvas();
            this.setupBackgroundGradient();
            this.initializeElements();
            this.animate();
            
            this.isInitialized = true;
            console.log('🇮🇳 Republic Day effects initialized');
            
        } catch (error) {
            console.error('Failed to initialize Republic Day effects:', error);
            this.enableCSSFallback();
        }
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: -1;
            pointer-events: none;
        `;
        
        this.resizeCanvas();
        document.body.insertBefore(this.canvas, document.body.firstChild);
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    setupBackgroundGradient() {
        // Create CSS gradient background
        const bgDiv = document.createElement('div');
        bgDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: -2;
            background: linear-gradient(180deg, 
                rgba(255, 153, 51, 0.1) 0%,
                rgba(255, 255, 255, 0.9) 50%,
                rgba(19, 136, 8, 0.1) 100%
            );
        `;
        
        // Add Kartavya Path silhouette
        const silhouette = document.createElement('div');
        silhouette.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 200px;
            background: linear-gradient(to top, 
                rgba(0, 0, 0, 0.1) 0%, 
                transparent 100%
            );
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 200'%3E%3Cpath d='M0,200 L200,180 L400,160 L600,140 L800,160 L1000,180 L1200,200 Z' fill='rgba(0,0,0,0.05)'/%3E%3C/svg%3E");
            background-size: cover;
            background-position: bottom;
        `;
        
        bgDiv.appendChild(silhouette);
        document.body.insertBefore(bgDiv, document.body.firstChild);
    }
    
    initializeElements() {
        // Initialize tricolor waves
        for (let i = 0; i < 3; i++) {
            this.tricolorWaves.push({
                y: 100 + i * 150,
                amplitude: 30 + i * 10,
                frequency: 0.01 + i * 0.005,
                speed: 0.02 + i * 0.01,
                color: i === 0 ? this.colors.saffron : i === 1 ? this.colors.white : this.colors.green,
                opacity: 0.3 - i * 0.05
            });
        }
        
        // Initialize galaxy particles for second section
        if (!this.isMobile) {
            for (let i = 0; i < 50; i++) {
                this.galaxyParticles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    size: Math.random() * 2 + 1,
                    color: [this.colors.saffron, this.colors.white, this.colors.green][Math.floor(Math.random() * 3)],
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5,
                    opacity: Math.random() * 0.5 + 0.2
                });
            }
        }
    }
    
    animate() {
        if (!this.isInitialized) return;
        
        this.animationId = requestAnimationFrame(() => this.animate());
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.time += 16;
        
        // Create falling flags occasionally
        if (this.time - this.lastFlagTime > 4000 + Math.random() * 6000) {
            this.createFallingFlag();
            this.lastFlagTime = this.time;
        }
        
        // Create white birds occasionally
        if (this.time - this.lastBirdTime > 8000 + Math.random() * 12000) {
            this.createWhiteBird();
            this.lastBirdTime = this.time;
        }
        
        this.animateTricolorWaves();
        this.animateFallingFlags();
        this.animateWhiteBirds();
        this.animateGalaxyParticles();
    }
    
    animateTricolorWaves() {
        this.tricolorWaves.forEach(wave => {
            this.ctx.save();
            this.ctx.globalAlpha = wave.opacity;
            this.ctx.strokeStyle = wave.color;
            this.ctx.lineWidth = 3;
            
            this.ctx.beginPath();
            for (let x = 0; x <= this.canvas.width; x += 5) {
                const y = wave.y + Math.sin(x * wave.frequency + this.time * wave.speed) * wave.amplitude;
                if (x === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.stroke();
            this.ctx.restore();
        });
    }
    
    createFallingFlag() {
        this.fallingFlags.push({
            x: Math.random() * this.canvas.width,
            y: -30,
            speedY: 0.5 + Math.random() * 0.5,
            speedX: (Math.random() - 0.5) * 0.3,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.03,
            size: 15 + Math.random() * 10,
            life: this.canvas.height + 100
        });
    }
    
    animateFallingFlags() {
        for (let i = this.fallingFlags.length - 1; i >= 0; i--) {
            const flag = this.fallingFlags[i];
            
            flag.x += flag.speedX;
            flag.y += flag.speedY;
            flag.rotation += flag.rotationSpeed;
            
            this.ctx.save();
            this.ctx.translate(flag.x, flag.y);
            this.ctx.rotate(flag.rotation);
            this.ctx.globalAlpha = 0.7;
            
            // Draw Indian flag
            const w = flag.size;
            const h = flag.size * 0.6;
            
            // Saffron stripe
            this.ctx.fillStyle = this.colors.saffron;
            this.ctx.fillRect(-w/2, -h/2, w, h/3);
            
            // White stripe
            this.ctx.fillStyle = this.colors.white;
            this.ctx.fillRect(-w/2, -h/2 + h/3, w, h/3);
            
            // Green stripe
            this.ctx.fillStyle = this.colors.green;
            this.ctx.fillRect(-w/2, -h/2 + 2*h/3, w, h/3);
            
            // Ashoka Chakra
            this.ctx.strokeStyle = this.colors.ashokaBlue;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, w * 0.1, 0, Math.PI * 2);
            this.ctx.stroke();
            
            this.ctx.restore();
            
            flag.life--;
            if (flag.life <= 0 || flag.y > this.canvas.height + 50) {
                this.fallingFlags.splice(i, 1);
            }
        }
    }
    
    createWhiteBird() {
        this.whiteBirds.push({
            x: -50,
            y: 50 + Math.random() * 200,
            speedX: 1 + Math.random() * 0.5,
            speedY: Math.sin(Math.random() * Math.PI * 2) * 0.2,
            wingPhase: Math.random() * Math.PI * 2,
            size: 8 + Math.random() * 4,
            life: this.canvas.width + 100
        });
    }
    
    animateWhiteBirds() {
        for (let i = this.whiteBirds.length - 1; i >= 0; i--) {
            const bird = this.whiteBirds[i];
            
            bird.x += bird.speedX;
            bird.y += bird.speedY + Math.sin(this.time * 0.01 + bird.wingPhase) * 0.1;
            bird.wingPhase += 0.2;
            
            this.ctx.save();
            this.ctx.translate(bird.x, bird.y);
            this.ctx.fillStyle = this.colors.white;
            this.ctx.globalAlpha = 0.8;
            
            // Simple bird shape
            const wingFlap = Math.sin(bird.wingPhase) * 0.3;
            this.ctx.beginPath();
            this.ctx.ellipse(-bird.size/2, 0, bird.size/3, bird.size/6 + wingFlap, 0.3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.ellipse(bird.size/2, 0, bird.size/3, bird.size/6 + wingFlap, -0.3, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
            
            bird.life--;
            if (bird.life <= 0 || bird.x > this.canvas.width + 50) {
                this.whiteBirds.splice(i, 1);
            }
        }
    }
    
    animateGalaxyParticles() {
        // Only show galaxy particles in second section and beyond
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight * 0.8) return;
        
        this.galaxyParticles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }
    
    enableCSSFallback() {
        const style = document.createElement('style');
        style.textContent = `
            body::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                background: linear-gradient(180deg, 
                    rgba(255, 153, 51, 0.1) 0%,
                    rgba(255, 255, 255, 0.9) 50%,
                    rgba(19, 136, 8, 0.1) 100%
                );
                animation: gentleGlow 8s ease-in-out infinite;
            }
            
            @keyframes gentleGlow {
                0%, 100% { opacity: 0.8; }
                50% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    cleanup() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        this.isInitialized = false;
    }
}

window.RepublicDayEffects = RepublicDayEffects;