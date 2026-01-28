// Enhanced Cursor Effects for Republic Day Theme
// Tricolor trails, hover glows, and interactive elements

class CursorEffects {
    constructor() {
        this.isEnabled = true;
        this.performanceLevel = 'high';
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Tricolor theme
        this.colors = {
            saffron: '#ff9933',
            white: '#ffffff',
            green: '#138808',
            ashokaBlue: '#3b82f6'
        };
        
        // Current color index for alternating trail
        this.currentColorIndex = 0;
        this.trailColors = [this.colors.green, this.colors.saffron];
        
        this.init();
    }
    
    init() {
        if (this.isMobile) {
            this.isEnabled = false;
            return;
        }
        
        this.setupGlobalStyles();
        this.setupHoverEffects();
        this.setupClickEffects();
        
        console.log('🖱️ Cursor effects initialized');
    }
    
    // Setup global cursor styles
    setupGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Custom cursor */
            * {
                cursor: none !important;
            }
            
            body {
                cursor: none !important;
            }
            
            /* Custom cursor element */
            .custom-cursor {
                position: fixed;
                width: 20px;
                height: 20px;
                border: 2px solid ${this.colors.ashokaBlue};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: all 0.1s ease;
                mix-blend-mode: difference;
            }
            
            .custom-cursor.hover {
                width: 40px;
                height: 40px;
                border-color: ${this.colors.saffron};
                background: rgba(255, 153, 51, 0.1);
            }
            
            .custom-cursor.click {
                width: 60px;
                height: 60px;
                border-color: ${this.colors.green};
                background: rgba(19, 136, 8, 0.2);
            }
            
            /* Tricolor glow effects for interactive elements */
            .tricolor-hover {
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .tricolor-hover::before {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: linear-gradient(45deg, 
                    ${this.colors.saffron} 0%, 
                    ${this.colors.white} 33%, 
                    ${this.colors.green} 66%, 
                    ${this.colors.saffron} 100%
                );
                border-radius: inherit;
                opacity: 0;
                z-index: -1;
                transition: opacity 0.3s ease;
                animation: tricolorRotate 3s linear infinite;
            }
            
            .tricolor-hover:hover::before {
                opacity: 0.7;
            }
            
            .tricolor-hover:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            }
            
            @keyframes tricolorRotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            /* Button specific effects */
            .btn {
                position: relative;
                overflow: hidden;
            }
            
            .btn::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                background: radial-gradient(circle, 
                    rgba(255, 255, 255, 0.3) 0%, 
                    transparent 70%
                );
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: all 0.3s ease;
            }
            
            .btn:hover::after {
                width: 200px;
                height: 200px;
            }
            
            /* Card hover effects */
            .feature-card,
            .action-card,
            .stat-card,
            .price-card {
                transition: all 0.3s ease;
                position: relative;
            }
            
            .feature-card:hover,
            .action-card:hover,
            .stat-card:hover,
            .price-card:hover {
                transform: translateY(-4px) scale(1.02);
                box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
            }
            
            /* Social link effects */
            .social-link {
                position: relative;
                overflow: hidden;
            }
            
            .social-link::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, 
                    transparent, 
                    rgba(255, 153, 51, 0.3), 
                    rgba(19, 136, 8, 0.3), 
                    transparent
                );
                transition: left 0.5s ease;
            }
            
            .social-link:hover::before {
                left: 100%;
            }
        `;
        document.head.appendChild(style);
        
        // Create custom cursor element
        this.createCustomCursor();
    }
    
    // Create custom cursor
    createCustomCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        document.body.appendChild(this.cursor);
        
        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX - 10 + 'px';
            this.cursor.style.top = e.clientY - 10 + 'px';
        });
        
        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
        });
    }
    
    // Setup hover effects
    setupHoverEffects() {
        // Add tricolor hover class to interactive elements
        const interactiveSelectors = [
            '.btn',
            '.nav-link',
            '.action-card',
            '.feature-card',
            '.stat-card',
            '.price-card',
            '.social-link',
            '.receipt-card',
            '.history-item',
            '.suggestion-btn',
            '.tab-btn'
        ];
        
        interactiveSelectors.forEach(selector => {
            document.addEventListener('mouseover', (e) => {
                if (e.target.matches(selector)) {
                    this.cursor.classList.add('hover');
                    this.addHoverGlow(e.target);
                }
            });
            
            document.addEventListener('mouseout', (e) => {
                if (e.target.matches(selector)) {
                    this.cursor.classList.remove('hover');
                    this.removeHoverGlow(e.target);
                }
            });
        });
    }
    
    // Add hover glow effect
    addHoverGlow(element) {
        if (!element.classList.contains('tricolor-hover')) {
            element.classList.add('tricolor-hover');
        }
        
        // Create ripple effect
        this.createHoverRipple(element);
    }
    
    // Remove hover glow effect
    removeHoverGlow(element) {
        // Keep the class for CSS transitions
        // element.classList.remove('tricolor-hover');
    }
    
    // Create hover ripple
    createHoverRipple(element) {
        const rect = element.getBoundingClientRect();
        const ripple = document.createElement('div');
        
        ripple.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, 
                rgba(255, 153, 51, 0.3) 0%, 
                rgba(19, 136, 8, 0.3) 50%, 
                transparent 70%
            );
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: rippleExpand 0.6s ease-out forwards;
        `;
        
        ripple.style.left = (rect.left + rect.width / 2 - 10) + 'px';
        ripple.style.top = (rect.top + rect.height / 2 - 10) + 'px';
        
        document.body.appendChild(ripple);
        
        // Add ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rippleExpand {
                0% {
                    width: 20px;
                    height: 20px;
                    opacity: 0.6;
                }
                100% {
                    width: 100px;
                    height: 100px;
                    opacity: 0;
                    transform: translate(-40px, -40px);
                }
            }
        `;
        document.head.appendChild(style);
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 600);
    }
    
    // Setup click effects
    setupClickEffects() {
        document.addEventListener('mousedown', (e) => {
            this.cursor.classList.add('click');
            this.createClickEffect(e.clientX, e.clientY);
        });
        
        document.addEventListener('mouseup', () => {
            this.cursor.classList.remove('click');
        });
    }
    
    // Create click effect
    createClickEffect(x, y) {
        // Create tricolor spark
        const spark = document.createElement('div');
        spark.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${this.colors.saffron};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            left: ${x - 5}px;
            top: ${y - 5}px;
            animation: sparkExpand 0.4s ease-out forwards;
        `;
        
        document.body.appendChild(spark);
        
        // Create multiple sparks
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const miniSpark = spark.cloneNode();
                miniSpark.style.background = i % 2 === 0 ? this.colors.green : this.colors.saffron;
                miniSpark.style.left = (x + (Math.random() - 0.5) * 40 - 5) + 'px';
                miniSpark.style.top = (y + (Math.random() - 0.5) * 40 - 5) + 'px';
                miniSpark.style.animationDelay = (i * 0.05) + 's';
                document.body.appendChild(miniSpark);
                
                setTimeout(() => {
                    if (miniSpark.parentNode) {
                        miniSpark.parentNode.removeChild(miniSpark);
                    }
                }, 500);
            }, i * 20);
        }
        
        // Add spark animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes sparkExpand {
                0% {
                    width: 10px;
                    height: 10px;
                    opacity: 1;
                }
                100% {
                    width: 30px;
                    height: 30px;
                    opacity: 0;
                    transform: translate(-10px, -10px);
                }
            }
        `;
        document.head.appendChild(style);
        
        // Remove spark after animation
        setTimeout(() => {
            if (spark.parentNode) {
                spark.parentNode.removeChild(spark);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 400);
    }
    
    // Enable/disable effects
    setEnabled(enabled) {
        this.isEnabled = enabled;
        if (this.cursor) {
            this.cursor.style.display = enabled ? 'block' : 'none';
        }
    }
    
    // Cleanup
    cleanup() {
        if (this.cursor && this.cursor.parentNode) {
            this.cursor.parentNode.removeChild(this.cursor);
        }
    }
}

// Create global instance
window.CursorEffects = CursorEffects;