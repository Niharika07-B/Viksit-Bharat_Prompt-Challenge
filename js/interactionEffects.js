// Interaction Effects Manager for Tricolor Background
// Handles instant user interaction feedback with patriotic elements

class InteractionEffects {
    constructor(tricolorBackground) {
        this.background = tricolorBackground;
        this.activeEffects = [];
        this.isEnabled = true;
        
        // Effect settings
        this.settings = {
            mouseTrail: true,
            clickBursts: true,
            hoverGlows: true,
            buttonEffects: true,
            sectionTransitions: true
        };
        
        // Tricolor theme
        this.colors = {
            saffron: 0xff9933,
            white: 0xffffff,
            green: 0x138808,
            ashokaBlue: 0x3b82f6
        };
        
        this.init();
    }
    
    // Initialize interaction effects
    init() {
        this.setupGlobalInteractions();
        this.setupButtonEffects();
        this.setupSectionEffects();
        this.setupLanguageEffects();
        this.setupVoiceEffects();
        
        console.log('🎯 Interaction effects system initialized');
    }
    
    // Setup global mouse and touch interactions
    setupGlobalInteractions() {
        let mouseTrailTimer = null;
        
        // Mouse movement with throttling
        document.addEventListener('mousemove', (event) => {
            if (!this.isEnabled || !this.settings.mouseTrail) return;
            
            clearTimeout(mouseTrailTimer);
            mouseTrailTimer = setTimeout(() => {
                this.createMouseTrail(event.clientX, event.clientY);
            }, 50); // Throttle to 20fps
        });
        
        // Click effects
        document.addEventListener('click', (event) => {
            if (!this.isEnabled || !this.settings.clickBursts) return;
            
            this.createClickEffect(event.clientX, event.clientY, event.target);
        });
        
        // Touch effects for mobile
        document.addEventListener('touchstart', (event) => {
            if (!this.isEnabled) return;
            
            const touch = event.touches[0];
            this.createTouchEffect(touch.clientX, touch.clientY);
        });
        
        // Hover effects
        document.addEventListener('mouseover', (event) => {
            if (!this.isEnabled || !this.settings.hoverGlows) return;
            
            if (this.isInteractiveElement(event.target)) {
                this.createHoverEffect(event.clientX, event.clientY, event.target);
            }
        });
    }
    
    // Setup button-specific effects
    setupButtonEffects() {
        // Voice button special effects
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) {
            voiceBtn.addEventListener('click', (event) => {
                this.createVoiceActivationEffect(event.clientX, event.clientY);
            });
        }
        
        // Navigation buttons
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (event) => {
                this.createNavigationEffect(event.clientX, event.clientY);
            });
        });
        
        // CTA buttons
        document.querySelectorAll('.btn-primary').forEach(btn => {
            btn.addEventListener('click', (event) => {
                this.createPrimaryButtonEffect(event.clientX, event.clientY);
            });
        });
        
        // Action cards
        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('click', (event) => {
                this.createActionCardEffect(event.clientX, event.clientY);
            });
        });
    }
    
    // Setup section transition effects
    setupSectionEffects() {
        // Observe section changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList.contains('section') && target.classList.contains('active')) {
                        this.createSectionTransitionEffect(target.id);
                    }
                }
            });
        });
        
        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section, { attributes: true });
        });
    }
    
    // Setup language switching effects
    setupLanguageEffects() {
        const languageSelector = document.getElementById('languageSelector');
        const voiceLanguageSelect = document.getElementById('voiceLanguageSelect');
        
        [languageSelector, voiceLanguageSelect].forEach(selector => {
            if (selector) {
                selector.addEventListener('change', (event) => {
                    this.createLanguageChangeEffect(event.target);
                });
            }
        });
    }
    
    // Setup voice-specific effects
    setupVoiceEffects() {
        // Listen for voice events
        window.addEventListener('voiceRecognitionStart', () => {
            this.createVoiceListeningEffect();
        });
        
        window.addEventListener('voiceRecognitionEnd', () => {
            this.createVoiceProcessingEffect();
        });
        
        window.addEventListener('voiceResultsDisplayed', () => {
            this.createVoiceResultsEffect();
        });
    }
    
    // Create mouse trail effect
    createMouseTrail(x, y) {
        if (!this.background.isInitialized) return;
        
        const worldPos = this.background.screenToWorld(x, y);
        
        // Create subtle particle trail
        const geometry = new THREE.SphereGeometry(0.1, 4, 4);
        const color = this.getRandomTricolor();
        const material = new THREE.MeshBasicMaterial({ 
            color: color,
            transparent: true,
            opacity: 0.4
        });
        
        const particle = new THREE.Mesh(geometry, material);
        particle.position.set(worldPos.x, worldPos.y, 2);
        this.background.scene.add(particle);
        
        this.activeEffects.push({
            mesh: particle,
            type: 'trail',
            life: 30,
            maxLife: 30,
            fadeSpeed: 0.02
        });
    }
    
    // Create click effect based on target element
    createClickEffect(x, y, target) {
        if (!this.background.isInitialized) return;
        
        const worldPos = this.background.screenToWorld(x, y);
        const effectType = this.getEffectTypeForElement(target);
        
        switch (effectType) {
            case 'primary':
                this.createTricolorBurst(worldPos, 12, 0.8);
                break;
            case 'navigation':
                this.createRippleEffect(worldPos, this.colors.ashokaBlue);
                break;
            case 'voice':
                this.createVoiceClickEffect(worldPos);
                break;
            default:
                this.createSimpleRipple(worldPos);
        }
    }
    
    // Create touch effect for mobile
    createTouchEffect(x, y) {
        if (!this.background.isInitialized) return;
        
        const worldPos = this.background.screenToWorld(x, y);
        this.createRippleEffect(worldPos, this.colors.saffron, 1.5);
    }
    
    // Create hover effect
    createHoverEffect(x, y, target) {
        if (!this.background.isInitialized) return;
        
        const worldPos = this.background.screenToWorld(x, y);
        
        // Create subtle glow
        const geometry = new THREE.SphereGeometry(1.5, 8, 8);
        const material = new THREE.MeshBasicMaterial({ 
            color: this.colors.saffron,
            transparent: true,
            opacity: 0.08
        });
        
        const glow = new THREE.Mesh(geometry, material);
        glow.position.set(worldPos.x, worldPos.y, 1);
        this.background.scene.add(glow);
        
        this.activeEffects.push({
            mesh: glow,
            type: 'hover',
            life: 15,
            maxLife: 15,
            pulseSpeed: 0.2
        });
    }
    
    // Create voice activation effect
    createVoiceActivationEffect(x, y) {
        if (!this.background.isInitialized) return;
        
        const worldPos = this.background.screenToWorld(x, y);
        
        // Create concentric rings
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const geometry = new THREE.RingGeometry(0.5, 1, 16);
                const material = new THREE.MeshBasicMaterial({ 
                    color: this.colors.ashokaBlue,
                    transparent: true,
                    opacity: 0.6
                });
                
                const ring = new THREE.Mesh(geometry, material);
                ring.position.set(worldPos.x, worldPos.y, 3);
                this.background.scene.add(ring);
                
                this.activeEffects.push({
                    mesh: ring,
                    type: 'voiceRing',
                    life: 60,
                    maxLife: 60,
                    expandSpeed: 0.1
                });
            }, i * 200);
        }
    }
    
    // Create navigation effect
    createNavigationEffect(x, y) {
        if (!this.background.isInitialized) return;
        
        const worldPos = this.background.screenToWorld(x, y);
        this.createTricolorWave(worldPos);
    }
    
    // Create primary button effect
    createPrimaryButtonEffect(x, y) {
        if (!this.background.isInitialized) return;
        
        const worldPos = this.background.screenToWorld(x, y);
        this.createTricolorBurst(worldPos, 8, 0.6);
    }
    
    // Create action card effect
    createActionCardEffect(x, y) {
        if (!this.background.isInitialized) return;
        
        const worldPos = this.background.screenToWorld(x, y);
        this.createRippleEffect(worldPos, this.colors.green);
    }
    
    // Create section transition effect
    createSectionTransitionEffect(sectionId) {
        if (!this.background.isInitialized) return;
        
        // Create screen-wide subtle flash
        const geometry = new THREE.PlaneGeometry(100, 60);
        const color = this.getSectionColor(sectionId);
        const material = new THREE.MeshBasicMaterial({ 
            color: color,
            transparent: true,
            opacity: 0.05
        });
        
        const flash = new THREE.Mesh(geometry, material);
        flash.position.set(0, 0, 10);
        this.background.scene.add(flash);
        
        this.activeEffects.push({
            mesh: flash,
            type: 'sectionFlash',
            life: 20,
            maxLife: 20
        });
    }
    
    // Create language change effect
    createLanguageChangeEffect(selector) {
        if (!this.background.isInitialized) return;
        
        const rect = selector.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const worldPos = this.background.screenToWorld(x, y);
        
        // Create flag-inspired effect
        this.createTricolorWave(worldPos, 2);
    }
    
    // Create voice listening effect
    createVoiceListeningEffect() {
        if (!this.background.isInitialized) return;
        
        // Create pulsing effect around voice button
        const voiceBtn = document.getElementById('voiceBtn');
        if (!voiceBtn) return;
        
        const rect = voiceBtn.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const worldPos = this.background.screenToWorld(x, y);
        
        // Create listening pulse
        const geometry = new THREE.SphereGeometry(3, 16, 16);
        const material = new THREE.MeshBasicMaterial({ 
            color: this.colors.ashokaBlue,
            transparent: true,
            opacity: 0.1
        });
        
        const pulse = new THREE.Mesh(geometry, material);
        pulse.position.set(worldPos.x, worldPos.y, 2);
        this.background.scene.add(pulse);
        
        this.activeEffects.push({
            mesh: pulse,
            type: 'voicePulse',
            life: 120, // Longer duration for listening
            maxLife: 120,
            pulseSpeed: 0.05
        });
    }
    
    // Create voice processing effect
    createVoiceProcessingEffect() {
        if (!this.background.isInitialized) return;
        
        // Create processing particles
        for (let i = 0; i < 20; i++) {
            const geometry = new THREE.SphereGeometry(0.1, 4, 4);
            const material = new THREE.MeshBasicMaterial({ 
                color: this.getRandomTricolor(),
                transparent: true,
                opacity: 0.7
            });
            
            const particle = new THREE.Mesh(geometry, material);
            particle.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 10,
                5
            );
            
            this.background.scene.add(particle);
            
            this.activeEffects.push({
                mesh: particle,
                type: 'processing',
                life: 90,
                maxLife: 90,
                velocity: {
                    x: (Math.random() - 0.5) * 0.2,
                    y: (Math.random() - 0.5) * 0.2,
                    z: 0
                }
            });
        }
    }
    
    // Create voice results effect
    createVoiceResultsEffect() {
        if (!this.background.isInitialized) return;
        
        // Create celebration burst
        this.createTricolorBurst({ x: 0, y: 0, z: 5 }, 15, 1.0);
    }
    
    // Helper: Create tricolor burst
    createTricolorBurst(position, count = 8, intensity = 0.6) {
        const colors = [this.colors.saffron, this.colors.white, this.colors.green];
        
        for (let i = 0; i < count; i++) {
            const geometry = new THREE.SphereGeometry(0.15, 6, 6);
            const material = new THREE.MeshBasicMaterial({ 
                color: colors[i % colors.length],
                transparent: true,
                opacity: intensity
            });
            
            const particle = new THREE.Mesh(geometry, material);
            particle.position.set(position.x, position.y, position.z);
            
            const angle = (i / count) * Math.PI * 2;
            const speed = 0.4;
            
            this.background.scene.add(particle);
            
            this.activeEffects.push({
                mesh: particle,
                type: 'burst',
                life: 40,
                maxLife: 40,
                velocity: {
                    x: Math.cos(angle) * speed,
                    y: Math.sin(angle) * speed,
                    z: (Math.random() - 0.5) * 0.2
                }
            });
        }
    }
    
    // Helper: Create ripple effect
    createRippleEffect(position, color, scale = 1) {
        const geometry = new THREE.RingGeometry(0.5 * scale, 1 * scale, 16);
        const material = new THREE.MeshBasicMaterial({ 
            color: color,
            transparent: true,
            opacity: 0.4
        });
        
        const ripple = new THREE.Mesh(geometry, material);
        ripple.position.set(position.x, position.y, position.z || 2);
        this.background.scene.add(ripple);
        
        this.activeEffects.push({
            mesh: ripple,
            type: 'ripple',
            life: 30,
            maxLife: 30,
            expandSpeed: 0.15
        });
    }
    
    // Helper: Create simple ripple
    createSimpleRipple(position) {
        this.createRippleEffect(position, this.colors.ashokaBlue, 0.8);
    }
    
    // Helper: Create tricolor wave
    createTricolorWave(position, scale = 1) {
        const geometry = new THREE.PlaneGeometry(4 * scale, 1 * scale, 8, 2);
        const material = new THREE.MeshBasicMaterial({ 
            color: this.colors.saffron,
            transparent: true,
            opacity: 0.3
        });
        
        const wave = new THREE.Mesh(geometry, material);
        wave.position.set(position.x, position.y, position.z || 1);
        this.background.scene.add(wave);
        
        this.activeEffects.push({
            mesh: wave,
            type: 'wave',
            life: 45,
            maxLife: 45,
            waveSpeed: 0.1
        });
    }
    
    // Helper: Create voice click effect
    createVoiceClickEffect(position) {
        // Create sound wave visualization
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const geometry = new THREE.RingGeometry(0.3, 0.5, 8);
                const material = new THREE.MeshBasicMaterial({ 
                    color: this.colors.ashokaBlue,
                    transparent: true,
                    opacity: 0.5
                });
                
                const ring = new THREE.Mesh(geometry, material);
                ring.position.set(position.x, position.y, 3);
                this.background.scene.add(ring);
                
                this.activeEffects.push({
                    mesh: ring,
                    type: 'soundWave',
                    life: 35,
                    maxLife: 35,
                    expandSpeed: 0.08
                });
            }, i * 100);
        }
    }
    
    // Update all active effects
    updateEffects() {
        for (let i = this.activeEffects.length - 1; i >= 0; i--) {
            const effect = this.activeEffects[i];
            effect.life--;
            
            const lifeRatio = effect.life / effect.maxLife;
            
            this.updateEffect(effect, lifeRatio);
            
            if (effect.life <= 0) {
                this.background.scene.remove(effect.mesh);
                this.activeEffects.splice(i, 1);
            }
        }
    }
    
    // Update individual effect
    updateEffect(effect, lifeRatio) {
        switch (effect.type) {
            case 'trail':
                effect.mesh.material.opacity = lifeRatio * 0.4;
                effect.mesh.scale.setScalar(1 + (1 - lifeRatio) * 0.5);
                break;
                
            case 'ripple':
                effect.mesh.scale.setScalar(1 + (1 - lifeRatio) * 4);
                effect.mesh.material.opacity = lifeRatio * 0.4;
                break;
                
            case 'burst':
                effect.mesh.position.add(effect.velocity);
                effect.mesh.material.opacity = lifeRatio * 0.8;
                effect.velocity.multiplyScalar(0.96);
                break;
                
            case 'hover':
                const pulse = Math.sin(Date.now() * effect.pulseSpeed) * 0.5 + 0.5;
                effect.mesh.material.opacity = lifeRatio * 0.08 + pulse * 0.02;
                break;
                
            case 'voiceRing':
                effect.mesh.scale.setScalar(1 + (1 - lifeRatio) * 3);
                effect.mesh.material.opacity = lifeRatio * 0.6;
                break;
                
            case 'voicePulse':
                const voicePulse = Math.sin(Date.now() * effect.pulseSpeed) * 0.5 + 0.5;
                effect.mesh.scale.setScalar(1 + voicePulse * 0.3);
                effect.mesh.material.opacity = lifeRatio * 0.1 + voicePulse * 0.05;
                break;
                
            case 'processing':
                effect.mesh.position.add(effect.velocity);
                effect.mesh.material.opacity = lifeRatio * 0.7;
                effect.mesh.rotation.x += 0.1;
                effect.mesh.rotation.y += 0.1;
                break;
                
            case 'wave':
                effect.mesh.scale.x += effect.waveSpeed;
                effect.mesh.material.opacity = lifeRatio * 0.3;
                break;
                
            case 'soundWave':
                effect.mesh.scale.setScalar(1 + (1 - lifeRatio) * 2);
                effect.mesh.material.opacity = lifeRatio * 0.5;
                break;
                
            case 'sectionFlash':
                effect.mesh.material.opacity = lifeRatio * 0.05;
                break;
        }
    }
    
    // Helper functions
    isInteractiveElement(element) {
        return element.matches('button, .btn, .nav-link, .action-card, input, select, .voice-btn, .feature-card');
    }
    
    getEffectTypeForElement(element) {
        if (element.matches('.btn-primary, .cta-button')) return 'primary';
        if (element.matches('.nav-link, .menu-toggle')) return 'navigation';
        if (element.matches('#voiceBtn, .voice-btn')) return 'voice';
        return 'default';
    }
    
    getRandomTricolor() {
        const colors = [this.colors.saffron, this.colors.white, this.colors.green];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    getSectionColor(sectionId) {
        const sectionColors = {
            home: this.colors.saffron,
            dashboard: this.colors.ashokaBlue,
            'voice-price': this.colors.green,
            negotiation: this.colors.saffron,
            inventory: this.colors.green,
            history: this.colors.ashokaBlue
        };
        return sectionColors[sectionId] || this.colors.ashokaBlue;
    }
    
    // Enable/disable effects
    setEnabled(enabled) {
        this.isEnabled = enabled;
    }
    
    // Configure effect settings
    configure(settings) {
        this.settings = { ...this.settings, ...settings };
    }
}

// Export for global use
window.InteractionEffects = InteractionEffects;