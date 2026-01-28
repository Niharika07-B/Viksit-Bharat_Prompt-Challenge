// Background Effects for Viksit Vaani – SwarVyapaar
// Creates animated tricolor background with Indian flag elements

const BackgroundEffects = {
    canvas: null,
    ctx: null,
    particles: [],
    flags: [],
    animationId: null,
    isAnimating: false,
    
    // Tricolor theme colors
    colors: {
        saffron: '#ff9933',
        white: '#ffffff',
        green: '#138808',
        ashokaBlue: '#3b82f6'
    },
    
    // Initialize background effects
    init() {
        this.canvas = document.getElementById('backgroundCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        this.createParticles();
        this.createFlags();
        this.startAnimation();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.createParticles();
            this.createFlags();
        });
    },
    
    // Setup canvas dimensions
    setupCanvas() {
        if (!this.canvas) return;
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Set canvas style
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
    },
    
    // Create tricolor particles
    createParticles() {
        this.particles = [];
        const particleCount = Math.min(50, Math.floor(this.canvas.width * this.canvas.height / 15000));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    },
    
    // Create a single particle
    createParticle() {
        const colors = [this.colors.saffron, this.colors.white, this.colors.green];
        
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 3 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: Math.random() * 0.5 + 0.2,
            life: Math.random() * 100 + 50
        };
    },
    
    // Create floating flag elements
    createFlags() {
        this.flags = [];
        const flagCount = Math.min(8, Math.floor(this.canvas.width / 200));
        
        for (let i = 0; i < flagCount; i++) {
            this.flags.push(this.createFlag());
        }
    },
    
    // Create a single flag element
    createFlag() {
        const symbols = ['🇮🇳', '🕊️', '⚡', '✨', '🌟'];
        
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            symbol: symbols[Math.floor(Math.random() * symbols.length)],
            size: Math.random() * 20 + 15,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            alpha: Math.random() * 0.3 + 0.1,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.02 + 0.01
        };
    },
    
    // Start animation loop
    startAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.animate();
    },
    
    // Stop animation
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.isAnimating = false;
    },
    
    // Main animation loop
    animate() {
        if (!this.isAnimating) return;
        
        this.clearCanvas();
        this.drawTricolorGradient();
        this.updateAndDrawParticles();
        this.updateAndDrawFlags();
        this.drawAshokaChakra();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    },
    
    // Clear canvas
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    
    // Draw subtle tricolor gradient background
    drawTricolorGradient() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, `${this.colors.saffron}08`);
        gradient.addColorStop(0.33, `${this.colors.white}05`);
        gradient.addColorStop(0.66, `${this.colors.white}05`);
        gradient.addColorStop(1, `${this.colors.green}08`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },
    
    // Update and draw particles
    updateAndDrawParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Update life
            particle.life--;
            if (particle.life <= 0) {
                this.particles[i] = this.createParticle();
                continue;
            }
            
            // Draw particle
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    },
    
    // Update and draw flag elements
    updateAndDrawFlags() {
        for (let i = 0; i < this.flags.length; i++) {
            const flag = this.flags[i];
            
            // Update position
            flag.x += flag.vx;
            flag.y += flag.vy;
            
            // Wrap around screen
            if (flag.x < -50) flag.x = this.canvas.width + 50;
            if (flag.x > this.canvas.width + 50) flag.x = -50;
            if (flag.y < -50) flag.y = this.canvas.height + 50;
            if (flag.y > this.canvas.height + 50) flag.y = -50;
            
            // Update rotation and pulse
            flag.rotation += flag.rotationSpeed;
            flag.pulsePhase += flag.pulseSpeed;
            
            // Calculate pulsing alpha
            const pulseAlpha = flag.alpha + Math.sin(flag.pulsePhase) * 0.1;
            
            // Draw flag symbol
            this.ctx.save();
            this.ctx.globalAlpha = Math.max(0, pulseAlpha);
            this.ctx.translate(flag.x, flag.y);
            this.ctx.rotate(flag.rotation);
            this.ctx.font = `${flag.size}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            // Add subtle glow effect
            this.ctx.shadowColor = this.colors.ashokaBlue;
            this.ctx.shadowBlur = 10;
            this.ctx.fillText(flag.symbol, 0, 0);
            
            this.ctx.restore();
        }
    },
    
    // Draw subtle Ashoka Chakra in background
    drawAshokaChakra() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(this.canvas.width, this.canvas.height) * 0.3;
        const time = Date.now() * 0.0005;
        
        this.ctx.save();
        this.ctx.globalAlpha = 0.03;
        this.ctx.strokeStyle = this.colors.ashokaBlue;
        this.ctx.lineWidth = 2;
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(time);
        
        // Draw outer circle
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Draw spokes
        const spokeCount = 24;
        for (let i = 0; i < spokeCount; i++) {
            const angle = (i / spokeCount) * Math.PI * 2;
            const x1 = Math.cos(angle) * (radius * 0.2);
            const y1 = Math.sin(angle) * (radius * 0.2);
            const x2 = Math.cos(angle) * (radius * 0.9);
            const y2 = Math.sin(angle) * (radius * 0.9);
            
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
        
        // Draw inner circle
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius * 0.2, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.restore();
    },
    
    // Create special Republic Day effect
    createRepublicDayEffect() {
        // Create burst of tricolor particles
        const burstCount = 30;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        for (let i = 0; i < burstCount; i++) {
            const angle = (i / burstCount) * Math.PI * 2;
            const speed = Math.random() * 3 + 2;
            const colors = [this.colors.saffron, this.colors.white, this.colors.green];
            
            this.particles.push({
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 4 + 2,
                color: colors[i % colors.length],
                alpha: 0.8,
                life: 60
            });
        }
    },
    
    // Adjust animation based on performance
    adjustPerformance() {
        const fps = this.getFPS();
        
        if (fps < 30) {
            // Reduce particle count for better performance
            this.particles = this.particles.slice(0, Math.floor(this.particles.length * 0.7));
            this.flags = this.flags.slice(0, Math.floor(this.flags.length * 0.7));
        } else if (fps > 50 && this.particles.length < 50) {
            // Add more particles if performance is good
            for (let i = 0; i < 5; i++) {
                this.particles.push(this.createParticle());
            }
        }
    },
    
    // Get approximate FPS
    getFPS() {
        // Simple FPS calculation (this is a basic implementation)
        if (!this.lastTime) {
            this.lastTime = performance.now();
            this.frameCount = 0;
            return 60;
        }
        
        this.frameCount++;
        const currentTime = performance.now();
        const elapsed = currentTime - this.lastTime;
        
        if (elapsed >= 1000) {
            const fps = (this.frameCount * 1000) / elapsed;
            this.lastTime = currentTime;
            this.frameCount = 0;
            return fps;
        }
        
        return 60; // Default assumption
    },
    
    // Handle visibility change to pause/resume animation
    handleVisibilityChange() {
        if (document.hidden) {
            this.stopAnimation();
        } else {
            this.startAnimation();
        }
    },
    
    // Cleanup resources
    cleanup() {
        this.stopAnimation();
        if (this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        this.particles = [];
        this.flags = [];
    }
};

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    BackgroundEffects.handleVisibilityChange();
});

// Export for global use
window.BackgroundEffects = BackgroundEffects;