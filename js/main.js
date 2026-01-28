// Viksit Vaani – SwarVyapaar - Clean Working Version
console.log('🚀 Loading Viksit Vaani – SwarVyapaar...');

// GLOBAL BACKGROUND INITIALIZATION - Start immediately on page load
(function initializeGlobalBackground() {
    // Create global background container immediately
    const bg = document.createElement('div');
    bg.className = 'agricultural-background';
    bg.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 1;
        pointer-events: none;
        overflow: hidden;
        background: linear-gradient(135deg, #FFF8E7 0%, #FFF4E0 50%, #FFFBF0 100%);
    `;
    
    // Insert at the very beginning of body
    if (document.body) {
        document.body.insertBefore(bg, document.body.firstChild);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            document.body.insertBefore(bg, document.body.firstChild);
        });
    }
    
    console.log('🌾 Global background container created');
})();

const App = {
    currentSection: 'home',
    currentLanguage: 'english',
    cart: [],
    products: [],
    lastResponse: null,
    
    init() {
        console.log('Initializing app...');
        
        // Initialize background animations FIRST - Global and immediate
        this.initGlobalBackground();
        
        // Hide loading overlay
        this.hideLoading();
        
        // Setup navigation
        this.setupNavigation();
        
        // Setup parallax effects
        this.setupParallaxEffects();
        
        // Setup marketplace
        this.setupMarketplace();
        
        // Initialize data
        this.initData();
        
        console.log('✅ App ready!');
        this.showNotification('Welcome to Viksit Vaani – SwarVyapaar! 🇮🇳', 'success');
    },
    
    hideLoading() {
        const loading = document.getElementById('loadingOverlay');
        if (loading) loading.style.display = 'none';
        document.body.style.opacity = '1';
    },
    
    setupNavigation() {
        // Navigation buttons
        document.querySelectorAll('.nav-btn, .mobile-nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const section = btn.getAttribute('href').substring(1);
                this.showSection(section);
                
                // Close mobile menu
                const mobileNav = document.getElementById('mobileNav');
                if (mobileNav) mobileNav.classList.remove('active');
            });
        });
        
        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const mobileNav = document.getElementById('mobileNav');
        if (mobileToggle && mobileNav) {
            mobileToggle.addEventListener('click', () => {
                mobileNav.classList.toggle('active');
            });
        }
        
        // Login dropdown
        const loginBtn = document.getElementById('loginBtn');
        const loginDropdown = document.getElementById('loginDropdown');
        if (loginBtn && loginDropdown) {
            loginBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                loginDropdown.classList.toggle('active');
            });
            
            document.addEventListener('click', () => {
                loginDropdown.classList.remove('active');
            });
        }
        
        // Login options
        const loginConsumer = document.getElementById('loginConsumer');
        const loginVendor = document.getElementById('loginVendor');
        
        if (loginConsumer) {
            loginConsumer.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection('buyer-dashboard');
                this.showNotification('Welcome Buyer!', 'success');
            });
        }
        
        if (loginVendor) {
            loginVendor.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection('vendor-dashboard');
                this.showNotification('Welcome Vendor!', 'success');
            });
        }
    },
    
    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const target = document.getElementById(sectionId);
        if (target) {
            target.classList.add('active');
            this.currentSection = sectionId;
            
            // Update navigation
            document.querySelectorAll('.nav-btn, .mobile-nav-item').forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('href') === `#${sectionId}`) {
                    btn.classList.add('active');
                }
            });
            
            // Ensure background animations continue (don't reset)
            this.ensureGlobalBackground();
            
            // Load section data
            this.loadSectionData(sectionId);
        }
    },
    
    ensureGlobalBackground() {
        // Check if global background exists, if not recreate it
        let bg = document.querySelector('.agricultural-background');
        if (!bg) {
            console.log('🔄 Recreating global background...');
            this.initGlobalBackground();
        }
    },
    
    loadSectionData(sectionId) {
        if (sectionId === 'voice-price') {
            this.setupVoicePrice();
        } else if (sectionId === 'vendor-dashboard') {
            this.setupVendor();
        } else if (sectionId === 'buyer-dashboard') {
            this.setupBuyer();
        } else if (sectionId === 'price-discovery') {
            this.setupPriceDiscovery();
        } else if (sectionId === 'voice-negotiation') {
            this.setupVoiceNegotiation();
        } else if (sectionId === 'receipts') {
            this.setupReceipts();
        }
    },
    
    initGlobalBackground() {
        // Create or get global background container
        let bg = document.querySelector('.agricultural-background');
        if (!bg) {
            bg = document.createElement('div');
            bg.className = 'agricultural-background';
            document.body.insertBefore(bg, document.body.firstChild);
        }
        
        // Start animations immediately - Global coverage
        this.startGlobalProduceAnimation(bg);
        this.startGlobalLetterAnimation(bg);
        this.setupCursorEffects();
        
        console.log('🌾 Global background animations started');
    },
    
    startGlobalProduceAnimation(container) {
        // PREMIUM REALISTIC PRODUCE - Well-defined agricultural elements
        const fruits = ['🍎', '🍌', '🥭', '🍇', '🍉', '🍊']; // Apple, Banana, Mango, Grapes, Watermelon, Orange
        const vegetables = ['🍅', '🧅', '🥕', '🌶️', '🥔', '🍆']; // Tomato, Onion, Carrot, Chili, Potato, Brinjal
        const leafyVegetables = ['🥬', '🌿']; // Spinach, Coriander
        const allProduce = [...fruits, ...vegetables, ...leafyVegetables];
        
        const createProduce = () => {
            const item = document.createElement('div');
            const produceEmoji = allProduce[Math.floor(Math.random() * allProduce.length)];
            
            // Classify produce type for styling
            let produceType = 'vegetable';
            if (fruits.includes(produceEmoji)) produceType = 'fruit';
            else if (leafyVegetables.includes(produceEmoji)) produceType = 'leafy';
            
            item.className = `floating-produce ${produceType}`;
            item.textContent = produceEmoji;
            
            // Position across FULL VIEWPORT width for complete global coverage
            item.style.left = Math.random() * 100 + 'vw';
            item.style.top = '-80px'; // Start above viewport
            
            // PREMIUM SPEED - Moderate-slow, natural gravity (8-12 seconds per element)
            const duration = 8 + Math.random() * 4; // 8-12 seconds for premium feel
            item.style.animationDuration = duration + 's';
            
            // Minimal horizontal drift - no heavy movement
            item.style.setProperty('--drift-distance', (Math.random() * 20 - 10) + 'px');
            
            // Add to body for global coverage (not just container)
            document.body.appendChild(item);
            
            // Clean memory management
            setTimeout(() => {
                if (item.parentNode) item.parentNode.removeChild(item);
            }, (duration + 2) * 1000);
        };
        
        // Start immediately and continue with premium density (every 2-3 seconds for premium feel)
        createProduce(); // First one immediately
        
        const createProduceInterval = () => {
            createProduce();
            setTimeout(createProduceInterval, 2000 + Math.random() * 1000); // Premium frequency
        };
        
        setTimeout(createProduceInterval, 1000); // Start interval after 1 second
    },
    
    startGlobalLetterAnimation(container) {
        // Commonly recognizable letters from each script (no complex ligatures)
        const lettersByLanguage = {
            telugu: ['అ', 'ఆ', 'ఇ', 'ఈ', 'ఉ', 'ఎ', 'ఏ', 'క', 'గ', 'న'], // Simple, recognizable Telugu letters
            hindi: ['अ', 'आ', 'इ', 'ई', 'उ', 'ए', 'ओ', 'क', 'ग', 'न'], // Basic Devanagari letters
            kannada: ['ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ', 'ಎ', 'ಏ', 'ಕ', 'ಗ', 'ನ'], // Simple Kannada letters
            tamil: ['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'எ', 'ஏ', 'க', 'ங', 'ந'], // Basic Tamil letters
            malayalam: ['അ', 'ആ', 'ഇ', 'ഈ', 'ഉ', 'എ', 'ഏ', 'ക', 'ഗ', 'ന'] // Simple Malayalam letters
        };
        
        const languages = Object.keys(lettersByLanguage);
        let sideToggle = true; // Alternate between left and right sides
        let languageIndex = 0; // Cycle through languages for balance
        
        const createSideLetter = () => {
            const item = document.createElement('div');
            
            // Balanced language distribution
            const currentLang = languages[languageIndex % languages.length];
            const langLetters = lettersByLanguage[currentLang];
            const letter = langLetters[Math.floor(Math.random() * langLetters.length)];
            
            item.className = `floating-letter ${currentLang}`;
            item.textContent = letter;
            
            // SIDE-FOCUSED POSITIONING - Alternate sides for balance
            let xPosition;
            
            if (sideToggle) {
                // Left zone: 0% - 15% of viewport width
                xPosition = Math.random() * 15; // 0-15%
            } else {
                // Right zone: 85% - 100% of viewport width
                xPosition = 85 + (Math.random() * 15); // 85-100%
            }
            
            item.style.left = xPosition + 'vw';
            item.style.top = '-80px'; // Start above viewport
            
            // PREMIUM LETTER ANIMATION - Gentle, natural movement (8-12 seconds)
            const duration = 8 + Math.random() * 4; // 8-12 seconds for premium feel
            item.style.animationDuration = duration + 's';
            
            // Very subtle horizontal drift (2-6px) - optional
            const drift = (Math.random() * 4 + 2) * (Math.random() < 0.5 ? -1 : 1); // ±2-6px
            item.style.setProperty('--side-drift', drift + 'px');
            
            // Add to body for global coverage
            document.body.appendChild(item);
            
            // Toggle side and advance language for next letter
            sideToggle = !sideToggle;
            languageIndex++;
            
            // Clean memory management
            setTimeout(() => {
                if (item.parentNode) item.parentNode.removeChild(item);
            }, (duration + 2) * 1000);
        };
        
        // Start immediately with medium density for side filling
        createSideLetter(); // First one immediately
        
        const createSideLetterInterval = () => {
            createSideLetter();
            // Premium density - every 1.5-2.5 seconds for premium feel without crowding
            setTimeout(createSideLetterInterval, 1500 + Math.random() * 1000);
        };
        
        setTimeout(createSideLetterInterval, 800); // Start interval after 0.8 seconds
        
        console.log('🔤 Side-focused multilingual letters started - balanced distribution');
    },
    
    setupCursorEffects() {
        // Add tricolor cursor effects on button clicks
        this.setupTricolorCursorEffects();
        
        // Keep existing mouse move effects but make them lighter
        let lastParticleTime = 0;
        const particleThrottle = 200; // Slower particle generation
        
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastParticleTime > particleThrottle && Math.random() > 0.99) { // Much less frequent
                this.createParticle(e.clientX, e.clientY);
                lastParticleTime = now;
            }
        });
    },
    
    setupTricolorCursorEffects() {
        // Add tricolor cursor effects on ALL clicks anywhere on the page
        document.addEventListener('click', (e) => {
            // Create tricolor burst on every click, regardless of what was clicked
            this.createTricolorBurst(e.clientX, e.clientY);
        });
        
        // Optional: Also add effects on mouse movement for extra visual appeal
        let lastMoveTime = 0;
        const moveThrottle = 100; // Every 100ms
        
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastMoveTime > moveThrottle && Math.random() > 0.98) { // Very occasional
                this.createSingleTricolorParticle(e.clientX, e.clientY);
                lastMoveTime = now;
            }
        });
    },
    
    createTricolorBurst(x, y) {
        const tricolors = ['#ff9933', '#ffffff', '#138808']; // Saffron, White, Green
        const particleCount = 8; // Number of particles per burst
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                this.createTricolorParticle(x, y, tricolors[i % 3]);
            }, i * 50); // Stagger the particles
        }
    },
    
    createSingleTricolorParticle(x, y) {
        const tricolors = ['#ff9933', '#ffffff', '#138808'];
        const randomColor = tricolors[Math.floor(Math.random() * tricolors.length)];
        this.createTricolorParticle(x, y, randomColor, 0.5); // Smaller scale for mouse move
    },
    
    createTricolorParticle(x, y, color, scale = 1) {
        const particle = document.createElement('div');
        particle.className = 'tricolor-particle';
        
        // Random direction and distance
        const angle = (Math.PI * 2 * Math.random());
        const distance = (30 + Math.random() * 40) * scale; // 30-70px spread, scaled
        const endX = x + Math.cos(angle) * distance;
        const endY = y + Math.sin(angle) * distance;
        
        const size = Math.floor(4 + Math.random() * 4) * scale; // 4-8px size, scaled
        
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            box-shadow: 0 0 ${size}px ${color}40;
            animation: tricolorBurst ${0.8 * scale}s ease-out forwards;
            --end-x: ${endX}px;
            --end-y: ${endY}px;
        `;
        
        document.body.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 800 * scale);
    },
    
    createParticle(x, y) {
        const colors = ['#ff9933', '#ffffff', '#138808'];
        
        const particle = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.className = 'cursor-particle';
        particle.textContent = '●';
        particle.style.cssText = `
            position: fixed; 
            left: ${x}px; 
            top: ${y}px; 
            width: 8px; 
            height: 8px;
            color: ${color};
            font-size: 8px;
            pointer-events: none; 
            z-index: 9999;
            animation: particleFade 1s ease-out forwards;
            line-height: 1;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) particle.parentNode.removeChild(particle);
        }, 1000);
    },
    
    // Add parallax scroll effect
    setupParallaxEffects() {
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            document.querySelectorAll('.floating-produce').forEach(item => {
                const speed = 0.2 + Math.random() * 0.3;
                item.style.transform += ` translateY(${rate * speed}px)`;
            });
            
            document.querySelectorAll('.floating-letter').forEach(item => {
                const speed = 0.1 + Math.random() * 0.2;
                item.style.transform += ` translateY(${rate * speed}px)`;
            });
            
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick);
    },
    
    setupMarketplace() {
        // Enhanced product data with realistic variety
        this.products = [
            // Fruits
            {
                id: 'fruit001',
                name: 'Red Apples',
                category: 'fruits',
                image: '🍎',
                price: 120,
                available: 100,
                unit: 'kg',
                vendor: 'Kashmir Fruits',
                location: 'Delhi'
            },
            {
                id: 'fruit002',
                name: 'Fresh Bananas',
                category: 'fruits',
                image: '🍌',
                price: 60,
                available: 150,
                unit: 'kg',
                vendor: 'South India Fruits',
                location: 'Bangalore'
            },
            {
                id: 'fruit003',
                name: 'Sweet Mangoes',
                category: 'fruits',
                image: '🥭',
                price: 180,
                available: 80,
                unit: 'kg',
                vendor: 'Alphonso Traders',
                location: 'Mumbai'
            },
            {
                id: 'fruit004',
                name: 'Fresh Grapes',
                category: 'fruits',
                image: '🍇',
                price: 140,
                available: 90,
                unit: 'kg',
                vendor: 'Maharashtra Grapes',
                location: 'Pune'
            },
            {
                id: 'fruit005',
                name: 'Watermelon',
                category: 'fruits',
                image: '🍉',
                price: 40,
                available: 200,
                unit: 'kg',
                vendor: 'Fresh Melons Co',
                location: 'Hyderabad'
            },
            {
                id: 'fruit006',
                name: 'Sweet Oranges',
                category: 'fruits',
                image: '🍊',
                price: 80,
                available: 120,
                unit: 'kg',
                vendor: 'Citrus Fresh',
                location: 'Chennai'
            },
            
            // Vegetables
            {
                id: 'veg001',
                name: 'Fresh Tomatoes',
                category: 'vegetables',
                image: '🍅',
                price: 25,
                available: 150,
                unit: 'kg',
                vendor: 'Delhi Fresh Mart',
                location: 'Delhi'
            },
            {
                id: 'veg002',
                name: 'Red Onions',
                category: 'vegetables',
                image: '🧅',
                price: 35,
                available: 200,
                unit: 'kg',
                vendor: 'Mumbai Mandi',
                location: 'Mumbai'
            },
            {
                id: 'veg003',
                name: 'Fresh Potatoes',
                category: 'vegetables',
                image: '🥔',
                price: 20,
                available: 300,
                unit: 'kg',
                vendor: 'Punjab Potatoes',
                location: 'Delhi'
            },
            {
                id: 'veg004',
                name: 'Green Brinjal',
                category: 'vegetables',
                image: '🍆',
                price: 30,
                available: 100,
                unit: 'kg',
                vendor: 'South Vegetables',
                location: 'Bangalore'
            },
            {
                id: 'veg005',
                name: 'Fresh Carrots',
                category: 'vegetables',
                image: '🥕',
                price: 45,
                available: 120,
                unit: 'kg',
                vendor: 'Root Vegetables Co',
                location: 'Pune'
            },
            {
                id: 'veg006',
                name: 'Green Peppers',
                category: 'vegetables',
                image: '🌶️',
                price: 60,
                available: 80,
                unit: 'kg',
                vendor: 'Spice Garden',
                location: 'Chennai'
            },
            
            // Leafy Vegetables
            {
                id: 'leafy001',
                name: 'Fresh Spinach',
                category: 'leafy',
                image: '🥬',
                price: 40,
                available: 50,
                unit: 'kg',
                vendor: 'Green Leafy Co',
                location: 'Delhi'
            },
            {
                id: 'leafy002',
                name: 'Coriander Leaves',
                category: 'leafy',
                image: '🌿',
                price: 80,
                available: 30,
                unit: 'kg',
                vendor: 'Herb Garden',
                location: 'Mumbai'
            },
            {
                id: 'leafy003',
                name: 'Fresh Lettuce',
                category: 'leafy',
                image: '🥬',
                price: 60,
                available: 40,
                unit: 'kg',
                vendor: 'Salad Fresh',
                location: 'Bangalore'
            },
            {
                id: 'leafy004',
                name: 'Mint Leaves',
                category: 'leafy',
                image: '🌿',
                price: 100,
                available: 25,
                unit: 'kg',
                vendor: 'Fresh Herbs',
                location: 'Pune'
            },
            {
                id: 'leafy005',
                name: 'Cabbage',
                category: 'leafy',
                image: '🥬',
                price: 35,
                available: 80,
                unit: 'kg',
                vendor: 'Leafy Greens',
                location: 'Hyderabad'
            },
            {
                id: 'leafy006',
                name: 'Fenugreek Leaves',
                category: 'leafy',
                image: '🌿',
                price: 70,
                available: 35,
                unit: 'kg',
                vendor: 'Methi Fresh',
                location: 'Chennai'
            }
        ];
        
        this.cart = JSON.parse(localStorage.getItem('buyer-cart') || '[]');
        
        // Setup category filtering
        this.setupCategoryFiltering();
        
        // Set default location (no detection)
        this.setDefaultLocation();
    },
    
    setupCategoryFiltering() {
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filterProductsByCategory(e.target.value);
            });
        }
    },
    
    filterProductsByCategory(category) {
        let filteredProducts = this.products;
        
        if (category && category !== '') {
            filteredProducts = this.products.filter(product => {
                if (category === 'vegetables') {
                    return product.category === 'vegetables';
                } else if (category === 'fruits') {
                    return product.category === 'fruits';
                } else if (category === 'leafy') {
                    return product.category === 'leafy';
                }
                return true;
            });
        }
        
        this.displayProducts(filteredProducts);
    },
    
    displayProducts(products = this.products) {
        const grid = document.getElementById('marketplaceGrid');
        if (!grid) return;
        
        grid.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <span class="product-emoji">${product.image}</span>
                    <div class="product-badge premium">FRESH</div>
                </div>
                <div class="product-info">
                    <div class="product-header">
                        <h3 class="product-name">${product.name}</h3>
                        <span class="product-category ${product.category}">${product.category.toUpperCase()}</span>
                    </div>
                    <div class="product-details">
                        <div class="product-detail">
                            <span class="product-detail-label">Vendor:</span>
                            <span class="product-detail-value">${product.vendor}</span>
                        </div>
                        <div class="product-detail">
                            <span class="product-detail-label">Location:</span>
                            <span class="product-detail-value">${product.location}</span>
                        </div>
                        <div class="product-detail">
                            <span class="product-detail-label">Available:</span>
                            <span class="product-detail-value">${product.available} ${product.unit}</span>
                        </div>
                    </div>
                    <div class="product-price">₹${product.price}/${product.unit}</div>
                    <div class="product-actions">
                        <button class="add-to-cart-btn" onclick="App.addToCart('${product.id}')">
                            🛒 Add to Cart
                        </button>
                        <div class="quantity-selector">
                            <button class="quantity-btn" onclick="App.changeQty('${product.id}', -1)">-</button>
                            <input type="number" class="quantity-input" id="qty-${product.id}" value="1" min="1">
                            <button class="quantity-btn" onclick="App.changeQty('${product.id}', 1)">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    },
    
    setDefaultLocation() {
        const locationText = document.querySelector('.location-text');
        if (locationText) {
            locationText.textContent = 'Delhi, India';
        }
    },
    
    setupVoicePrice() {
        // Language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentLanguage = btn.getAttribute('data-lang');
                this.showNotification(`Language: ${btn.textContent}`, 'info');
            });
        });
        
        // Voice button
        const voiceBtn = document.getElementById('mainVoiceBtn');
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => {
                this.startVoiceRecognition();
            });
        }
        
        // Replay button
        const replayBtn = document.getElementById('voiceReplayBtn');
        if (replayBtn) {
            replayBtn.addEventListener('click', () => {
                this.replayResponse();
            });
        }
        
        this.loadHistory();
    },
    
    startVoiceRecognition() {
        const status = document.getElementById('voiceStatus');
        const transcript = document.getElementById('voiceTranscript');
        const response = document.getElementById('priceResponse');
        const voiceBtn = document.getElementById('mainVoiceBtn');
        
        if (!status) return;
        
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.lang = 'en-IN';
            recognition.continuous = false;
            recognition.interimResults = false;
            
            status.textContent = 'Listening...';
            if (voiceBtn) voiceBtn.classList.add('listening');
            
            recognition.onresult = (event) => {
                const text = event.results[0][0].transcript;
                
                if (transcript) {
                    transcript.innerHTML = `
                        <div class="transcript-result">
                            <div class="transcript-label">You said:</div>
                            <div class="transcript-text">${text}</div>
                        </div>
                    `;
                }
                
                const priceData = this.generatePrice(text);
                
                if (response) {
                    response.innerHTML = `
                        <div class="price-response-content">
                            <div class="response-header">
                                <div class="response-icon">💰</div>
                                <div class="response-title">Price Information</div>
                            </div>
                            <div class="response-text">${priceData.text}</div>
                            <div class="price-details">
                                <div class="price-item">
                                    <span class="price-label">Price:</span>
                                    <span class="price-value">₹${priceData.price}/kg</span>
                                </div>
                                <div class="price-item">
                                    <span class="price-label">Location:</span>
                                    <span class="price-value">${priceData.location}</span>
                                </div>
                            </div>
                        </div>
                    `;
                }
                
                this.lastResponse = priceData.text;
                this.speakText(priceData.text);
                this.saveHistory(text, priceData);
                
                const replayBtn = document.getElementById('voiceReplayBtn');
                if (replayBtn) replayBtn.disabled = false;
            };
            
            recognition.onerror = () => {
                status.textContent = 'Error. Please try again.';
                if (voiceBtn) voiceBtn.classList.remove('listening');
            };
            
            recognition.onend = () => {
                status.textContent = 'Tap to Speak';
                if (voiceBtn) voiceBtn.classList.remove('listening');
            };
            
            recognition.start();
        } else {
            status.textContent = 'Voice not supported';
            this.showNotification('Voice recognition not supported', 'error');
        }
    },
    
    generatePrice(text) {
        const lower = text.toLowerCase();
        let product = 'tomato';
        let price = 25;
        
        if (lower.includes('onion')) {
            product = 'onion';
            price = 35;
        } else if (lower.includes('potato')) {
            product = 'potato';
            price = 20;
        } else if (lower.includes('apple')) {
            product = 'apple';
            price = 120;
        }
        
        price += Math.floor(Math.random() * 10) - 5;
        
        return {
            text: `Today's ${product} price is ₹${price} per kg.`,
            price: price,
            location: 'Delhi Mandi',
            product: product
        };
    },
    
    speakText(text) {
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-IN';
            speechSynthesis.speak(utterance);
        }
    },
    
    replayResponse() {
        if (this.lastResponse) {
            this.speakText(this.lastResponse);
            this.showNotification('Playing response...', 'info');
        }
    },
    
    saveHistory(transcript, response) {
        const item = {
            id: Date.now(),
            transcript: transcript,
            product: response.product,
            price: response.price,
            location: response.location,
            timestamp: new Date().toISOString()
        };
        
        let history = JSON.parse(localStorage.getItem('voice-history') || '[]');
        history.unshift(item);
        history = history.slice(0, 10);
        localStorage.setItem('voice-history', JSON.stringify(history));
        
        this.loadHistory();
    },
    
    loadHistory() {
        const history = JSON.parse(localStorage.getItem('voice-history') || '[]');
        const grid = document.getElementById('historyGrid');
        
        if (!grid) return;
        
        if (history.length === 0) {
            grid.innerHTML = `
                <div class="history-placeholder">
                    <div class="placeholder-icon">🎤</div>
                    <p>No searches yet. Try voice search!</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = history.slice(0, 6).map(item => `
            <div class="history-item" onclick="App.repeatSearch('${item.product}')">
                <div class="history-content">
                    <div class="history-product">${item.product}</div>
                    <div class="history-price">₹${item.price}/kg</div>
                    <div class="history-location">${item.location}</div>
                    <div class="history-time">${new Date(item.timestamp).toLocaleDateString()}</div>
                </div>
            </div>
        `).join('');
    },
    
    repeatSearch(product) {
        const response = this.generatePrice(`price of ${product}`);
        const priceResponse = document.getElementById('priceResponse');
        
        if (priceResponse) {
            priceResponse.innerHTML = `
                <div class="price-response-content">
                    <div class="response-header">
                        <div class="response-icon">💰</div>
                        <div class="response-title">Updated Price</div>
                    </div>
                    <div class="response-text">${response.text}</div>
                    <div class="price-details">
                        <div class="price-item">
                            <span class="price-label">Price:</span>
                            <span class="price-value">₹${response.price}/kg</span>
                        </div>
                        <div class="price-item">
                            <span class="price-label">Location:</span>
                            <span class="price-value">${response.location}</span>
                        </div>
                    </div>
                </div>
            `;
        }
        
        this.showNotification(`Updated ${product} price: ₹${response.price}/kg`, 'success');
    },
    
    setupVendor() {
        const form = document.getElementById('addProductForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addProduct();
            });
        }
        
        this.displayInventory();
    },
    
    addProduct() {
        const name = document.getElementById('productName')?.value;
        const category = document.getElementById('productCategory')?.value;
        const quantity = document.getElementById('productQuantity')?.value;
        const price = document.getElementById('productPrice')?.value;
        const quality = document.getElementById('productQuality')?.value;
        const location = document.getElementById('vendorLocationSelect')?.value;
        
        if (!location) {
            this.showNotification('Please select location', 'warning');
            return;
        }
        
        const product = {
            id: Date.now(),
            name, category, quantity: parseInt(quantity), price: parseFloat(price),
            quality, location, timestamp: new Date().toISOString()
        };
        
        let inventory = JSON.parse(localStorage.getItem('vendor-inventory') || '[]');
        inventory.push(product);
        localStorage.setItem('vendor-inventory', JSON.stringify(inventory));
        
        this.displayInventory();
        document.getElementById('addProductForm')?.reset();
        this.showNotification(`${name} added successfully!`, 'success');
    },
    
    displayInventory() {
        const inventory = JSON.parse(localStorage.getItem('vendor-inventory') || '[]');
        const grid = document.getElementById('vendorInventory');
        
        if (!grid) return;
        
        if (inventory.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: #6b7280;">No products yet. Add some!</p>';
            return;
        }
        
        grid.innerHTML = inventory.map(product => `
            <div class="inventory-item">
                <div class="item-header">
                    <span class="item-name">${product.name}</span>
                    <span class="item-category">${product.category}</span>
                </div>
                <div class="item-details">
                    <div><strong>Quantity:</strong> ${product.quantity} kg</div>
                    <div><strong>Quality:</strong> ${product.quality}</div>
                    <div><strong>Location:</strong> ${product.location}</div>
                    <div class="item-price">₹${product.price}/kg</div>
                </div>
            </div>
        `).join('');
    },
    
    setupBuyer() {
        this.loadProducts();
        this.setupCart();
    },
    
    loadProducts() {
        this.displayProducts();
    },
    
    setupCart() {
        const toggle = document.getElementById('cartToggle');
        const close = document.getElementById('cartClose');
        const sidebar = document.getElementById('cartSidebar');
        
        if (toggle) {
            toggle.addEventListener('click', () => {
                sidebar?.classList.add('active');
            });
        }
        
        if (close) {
            close.addEventListener('click', () => {
                sidebar?.classList.remove('active');
            });
        }
        
        this.updateCart();
    },
    
    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        const qtyInput = document.getElementById(`qty-${productId}`);
        const quantity = qtyInput ? parseInt(qtyInput.value) : 1;
        
        const existing = this.cart.find(item => item.id === productId);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                unit: product.unit,
                image: product.image,
                vendor: product.vendor,
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.updateCart();
        this.showNotification(`${product.name} added to cart!`, 'success');
    },
    
    changeQty(productId, change) {
        const input = document.getElementById(`qty-${productId}`);
        if (!input) return;
        
        let newQty = parseInt(input.value) + change;
        newQty = Math.max(1, newQty);
        input.value = newQty;
    },
    
    updateCartQty(productId, newQty) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;
        
        if (newQty <= 0) {
            this.removeFromCart(productId);
            return;
        }
        
        item.quantity = newQty;
        this.saveCart();
        this.updateCart();
    },
    
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCart();
        this.showNotification('Item removed', 'info');
    },
    
    saveCart() {
        localStorage.setItem('buyer-cart', JSON.stringify(this.cart));
    },
    
    updateCart() {
        const count = document.getElementById('cartCount');
        const items = document.getElementById('cartItems');
        const total = document.getElementById('cartTotal');
        
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        if (count) {
            count.textContent = totalItems;
            count.style.display = totalItems > 0 ? 'flex' : 'none';
        }
        
        if (items) {
            if (this.cart.length === 0) {
                items.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: #6b7280;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🛒</div>
                        <p>Cart is empty</p>
                    </div>
                `;
            } else {
                items.innerHTML = this.cart.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-image">${item.image}</div>
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">₹${item.price}/${item.unit}</div>
                        </div>
                        <div class="cart-item-actions">
                            <div class="quantity-selector">
                                <button class="quantity-btn" onclick="App.updateCartQty('${item.id}', ${item.quantity - 1})">-</button>
                                <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="App.updateCartQty('${item.id}', parseInt(this.value))">
                                <button class="quantity-btn" onclick="App.updateCartQty('${item.id}', ${item.quantity + 1})">+</button>
                            </div>
                            <button class="quantity-btn" onclick="App.removeFromCart('${item.id}')" style="background: #dc2626; color: white; margin-top: 0.5rem;">🗑️</button>
                        </div>
                    </div>
                `).join('');
            }
        }
        
        const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (total) {
            total.textContent = totalPrice.toFixed(0);
        }
    },
    
    initData() {
        // Add sample history if empty
        const history = JSON.parse(localStorage.getItem('voice-history') || '[]');
        if (history.length === 0) {
            const sample = [{
                id: 1,
                transcript: 'What is tomato price?',
                product: 'tomato',
                price: 25,
                location: 'Delhi Mandi',
                timestamp: new Date().toISOString()
            }];
            localStorage.setItem('voice-history', JSON.stringify(sample));
        }
    },
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 100px; right: 20px; z-index: 10000;
            padding: 1rem 1.5rem; border-radius: 0.75rem; color: white;
            font-weight: 500; max-width: 300px; transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        
        const colors = {
            success: '#059669',
            error: '#dc2626',
            warning: '#d97706',
            info: '#0ea5e9'
        };
        
        notification.style.background = colors[type] || colors.info;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.style.transform = 'translateX(0)', 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) notification.parentNode.removeChild(notification);
            }, 300);
        }, 3000);
    },
    
    // REALISTIC CONTENT IMPLEMENTATION FOR DISCOVERY, NEGOTIATION, AND RECEIPTS
    
    setupPriceDiscovery() {
        this.loadPriceMap();
        this.loadAIGuidance();
        this.setupPriceMapControls();
    },
    
    loadPriceMap() {
        const priceMapResults = document.getElementById('priceMapResults');
        if (!priceMapResults) return;
        
        // Realistic mandi price data across different locations
        const locationPrices = {
            'Delhi': { tomato: 28, onion: 32, potato: 18, carrot: 45, cabbage: 25 },
            'Mumbai': { tomato: 35, onion: 38, potato: 22, carrot: 50, cabbage: 30 },
            'Bangalore': { tomato: 30, onion: 35, potato: 20, carrot: 48, cabbage: 28 },
            'Chennai': { tomato: 32, onion: 40, potato: 24, carrot: 52, cabbage: 32 },
            'Hyderabad': { tomato: 26, onion: 30, potato: 16, carrot: 42, cabbage: 22 },
            'Kolkata': { tomato: 24, onion: 28, potato: 15, carrot: 40, cabbage: 20 },
            'Pune': { tomato: 33, onion: 36, potato: 21, carrot: 49, cabbage: 29 }
        };
        
        const selectedProduct = document.getElementById('priceMapProduct')?.value || 'tomato';
        
        priceMapResults.innerHTML = `
            <div class="price-map-grid">
                ${Object.entries(locationPrices).map(([location, prices]) => `
                    <div class="location-price-card">
                        <div class="location-header">
                            <h4>${location} Mandi</h4>
                            <span class="location-status ${prices[selectedProduct] < 25 ? 'low' : prices[selectedProduct] > 35 ? 'high' : 'medium'}">
                                ${prices[selectedProduct] < 25 ? '🟢 Low' : prices[selectedProduct] > 35 ? '🔴 High' : '🟡 Medium'}
                            </span>
                        </div>
                        <div class="price-display">
                            <span class="price-value">₹${prices[selectedProduct]}</span>
                            <span class="price-unit">per kg</span>
                        </div>
                        <div class="price-details">
                            <div class="detail-item">
                                <span>Quality:</span>
                                <span>${Math.random() > 0.5 ? 'Grade A' : 'Grade B'}</span>
                            </div>
                            <div class="detail-item">
                                <span>Stock:</span>
                                <span>${Math.floor(Math.random() * 500 + 100)} kg</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="price-insights">
                <div class="insight-card">
                    <h4>📊 Market Analysis</h4>
                    <p>Lowest price: <strong>₹${Math.min(...Object.values(locationPrices).map(p => p[selectedProduct]))}</strong> in ${Object.entries(locationPrices).find(([_, p]) => p[selectedProduct] === Math.min(...Object.values(locationPrices).map(p => p[selectedProduct])))[0]}</p>
                    <p>Highest price: <strong>₹${Math.max(...Object.values(locationPrices).map(p => p[selectedProduct]))}</strong> in ${Object.entries(locationPrices).find(([_, p]) => p[selectedProduct] === Math.max(...Object.values(locationPrices).map(p => p[selectedProduct])))[0]}</p>
                    <p>Average price: <strong>₹${Math.round(Object.values(locationPrices).reduce((sum, p) => sum + p[selectedProduct], 0) / Object.values(locationPrices).length)}</strong></p>
                </div>
            </div>
        `;
    },
    
    loadAIGuidance() {
        const aiGuidance = document.getElementById('aiGuidance');
        if (!aiGuidance) return;
        
        const selectedProduct = document.getElementById('priceMapProduct')?.value || 'tomato';
        const guidanceData = {
            tomato: {
                trend: 'rising',
                reason: 'High demand due to festival season',
                recommendation: 'Good time to sell, prices expected to rise by 10-15%',
                bestMarkets: ['Mumbai', 'Chennai', 'Pune'],
                tips: 'Focus on Grade A quality for premium pricing'
            },
            onion: {
                trend: 'stable',
                reason: 'Steady supply from Maharashtra',
                recommendation: 'Stable market, good for consistent trading',
                bestMarkets: ['Chennai', 'Mumbai', 'Pune'],
                tips: 'Storage quality is key for better prices'
            },
            potato: {
                trend: 'falling',
                reason: 'Bumper harvest in Punjab',
                recommendation: 'Consider bulk selling before further decline',
                bestMarkets: ['Chennai', 'Mumbai', 'Bangalore'],
                tips: 'Focus on processed varieties for better margins'
            }
        };
        
        const guidance = guidanceData[selectedProduct] || guidanceData.tomato;
        
        aiGuidance.innerHTML = `
            <div class="ai-guidance-content">
                <div class="guidance-header">
                    <div class="trend-indicator ${guidance.trend}">
                        <span class="trend-icon">${guidance.trend === 'rising' ? '📈' : guidance.trend === 'falling' ? '📉' : '➡️'}</span>
                        <span class="trend-text">${guidance.trend.charAt(0).toUpperCase() + guidance.trend.slice(1)} Trend</span>
                    </div>
                </div>
                
                <div class="guidance-sections">
                    <div class="guidance-section">
                        <h4>🔍 Market Analysis</h4>
                        <p><strong>Reason:</strong> ${guidance.reason}</p>
                        <p><strong>Recommendation:</strong> ${guidance.recommendation}</p>
                    </div>
                    
                    <div class="guidance-section">
                        <h4>🎯 Best Markets</h4>
                        <div class="best-markets">
                            ${guidance.bestMarkets.map(market => `
                                <span class="market-tag">${market}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="guidance-section">
                        <h4>💡 Trading Tips</h4>
                        <p>${guidance.tips}</p>
                    </div>
                    
                    <div class="guidance-section">
                        <h4>📅 Next Update</h4>
                        <p>Market analysis will be updated in 2 hours</p>
                    </div>
                </div>
            </div>
        `;
    },
    
    setupPriceMapControls() {
        const updateBtn = document.getElementById('updatePriceMap');
        const productSelect = document.getElementById('priceMapProduct');
        
        if (updateBtn) {
            updateBtn.addEventListener('click', () => {
                this.loadPriceMap();
                this.loadAIGuidance();
                this.showNotification('Price map updated!', 'success');
            });
        }
        
        if (productSelect) {
            productSelect.addEventListener('change', () => {
                this.loadPriceMap();
                this.loadAIGuidance();
            });
        }
    },
    
    setupVoiceNegotiation() {
        this.loadNegotiationChat();
        this.setupNegotiationControls();
    },
    
    loadNegotiationChat() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        // Realistic negotiation conversation examples
        const sampleConversations = [
            {
                user: "I want to buy 50kg tomatoes",
                bot: "Great! Current market rate for tomatoes is ₹28-32 per kg. What's your target price?",
                user: "Can you do ₹25 per kg?",
                bot: "That's below market rate. Considering the quality is Grade A, I can offer ₹27 per kg for 50kg. This is a fair price given current demand."
            },
            {
                user: "मुझे प्याज चाहिए 100 किलो",
                bot: "नमस्ते! प्याज का आज का भाव ₹30-35 प्रति किलो है। आप कितने में लेना चाहते हैं?",
                user: "₹28 में मिल जाएगा?",
                bot: "100 किलो के लिए ₹29 प्रति किलो अच्छा रेट है। क्वालिटी बहुत अच्छी है और मार्केट रेट भी यही है।"
            }
        ];
        
        const randomConv = sampleConversations[Math.floor(Math.random() * sampleConversations.length)];
        
        chatMessages.innerHTML = `
            <div class="message bot-message">
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    <p>Welcome to Voice Negotiation! I can help you negotiate in multiple languages. Try saying something like:</p>
                    <div class="example-phrases">
                        <div class="phrase-item">"I want to buy tomatoes"</div>
                        <div class="phrase-item">"मुझे आलू चाहिए" (Hindi)</div>
                        <div class="phrase-item">"టమాటాలు కావాలి" (Telugu)</div>
                    </div>
                    <span class="message-time">${new Date().toLocaleTimeString()}</span>
                </div>
            </div>
            
            <div class="conversation-example">
                <h4>💬 Sample Negotiation</h4>
                <div class="message user-message">
                    <div class="message-avatar">👤</div>
                    <div class="message-content">
                        <p>${randomConv.user}</p>
                        <span class="message-time">2 min ago</span>
                    </div>
                </div>
                <div class="message bot-message">
                    <div class="message-avatar">🤖</div>
                    <div class="message-content">
                        <p>${randomConv.bot}</p>
                        <span class="message-time">2 min ago</span>
                    </div>
                </div>
            </div>
        `;
    },
    
    setupNegotiationControls() {
        const startVoiceBtn = document.getElementById('startVoiceBtn');
        const sendChatBtn = document.getElementById('sendChatBtn');
        const chatInput = document.getElementById('chatInput');
        
        if (startVoiceBtn) {
            startVoiceBtn.addEventListener('click', () => {
                this.startNegotiationVoice();
            });
        }
        
        if (sendChatBtn && chatInput) {
            sendChatBtn.addEventListener('click', () => {
                this.sendNegotiationMessage();
            });
            
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendNegotiationMessage();
                }
            });
        }
    },
    
    startNegotiationVoice() {
        const voiceStatus = document.getElementById('voiceStatus');
        const voiceTranscript = document.getElementById('voiceTranscript');
        
        if (voiceStatus) voiceStatus.textContent = 'Listening for negotiation...';
        
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.lang = 'en-IN';
            recognition.continuous = false;
            recognition.interimResults = false;
            
            recognition.onresult = (event) => {
                const text = event.results[0][0].transcript;
                if (voiceTranscript) {
                    voiceTranscript.innerHTML = `
                        <div class="transcript-result">
                            <strong>You said:</strong> "${text}"
                        </div>
                    `;
                }
                this.processNegotiationInput(text);
            };
            
            recognition.onerror = () => {
                if (voiceStatus) voiceStatus.textContent = 'Voice error. Try again.';
            };
            
            recognition.onend = () => {
                if (voiceStatus) voiceStatus.textContent = 'Ready to listen...';
            };
            
            recognition.start();
        } else {
            this.showNotification('Voice recognition not supported', 'error');
        }
    },
    
    sendNegotiationMessage() {
        const chatInput = document.getElementById('chatInput');
        if (!chatInput || !chatInput.value.trim()) return;
        
        const message = chatInput.value.trim();
        this.processNegotiationInput(message);
        chatInput.value = '';
    },
    
    processNegotiationInput(input) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'message user-message';
        userMessage.innerHTML = `
            <div class="message-avatar">👤</div>
            <div class="message-content">
                <p>${input}</p>
                <span class="message-time">${new Date().toLocaleTimeString()}</span>
            </div>
        `;
        chatMessages.appendChild(userMessage);
        
        // Generate realistic bot response
        setTimeout(() => {
            const botResponse = this.generateNegotiationResponse(input);
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot-message';
            botMessage.innerHTML = `
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    <p>${botResponse}</p>
                    <span class="message-time">${new Date().toLocaleTimeString()}</span>
                </div>
            `;
            chatMessages.appendChild(botMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    },
    
    generateNegotiationResponse(input) {
        const lower = input.toLowerCase();
        
        // Realistic negotiation responses based on common patterns
        if (lower.includes('tomato') || lower.includes('टमाटर')) {
            return "Tomatoes are ₹28-32 per kg today. For bulk orders above 50kg, I can offer ₹27 per kg. What quantity do you need?";
        } else if (lower.includes('onion') || lower.includes('प्याज')) {
            return "Onion prices are stable at ₹30-35 per kg. Grade A quality available. How much quantity are you looking for?";
        } else if (lower.includes('potato') || lower.includes('आलू')) {
            return "Potatoes are ₹18-22 per kg. Fresh stock from Punjab. Minimum order 25kg. What's your target price?";
        } else if (lower.includes('price') || lower.includes('भाव') || lower.includes('rate')) {
            return "I understand you're asking about pricing. Please specify which product you're interested in - tomato, onion, potato, or others?";
        } else if (lower.includes('buy') || lower.includes('purchase') || lower.includes('खरीदना')) {
            return "Great! I can help you with your purchase. Which product and quantity are you looking for? I'll give you the best market rate.";
        } else {
            return "I can help you negotiate prices for vegetables. Please tell me which product you want to buy and your target quantity. Current market rates: Tomato ₹28-32, Onion ₹30-35, Potato ₹18-22 per kg.";
        }
    },
    
    setupReceipts() {
        this.loadSampleReceipts();
        this.setupReceiptControls();
    },
    
    loadSampleReceipts() {
        const receiptsList = document.getElementById('receiptsList');
        if (!receiptsList) return;
        
        // Realistic receipt data
        const sampleReceipts = [
            {
                id: 'RCP001',
                date: '2026-01-27',
                vendor: 'Delhi Fresh Mart',
                vendorAddress: 'Shop 45, Azadpur Mandi, Delhi - 110033',
                vendorPhone: '+91 98765 43210',
                buyer: 'Rajesh Kumar',
                buyerPhone: '+91 87654 32109',
                items: [
                    { name: 'Fresh Tomatoes', qty: 25, rate: 28, amount: 700 },
                    { name: 'Red Onions', qty: 15, rate: 32, amount: 480 }
                ],
                subtotal: 1180,
                tax: 59,
                total: 1239,
                location: 'Delhi Mandi',
                paymentMethod: 'UPI',
                transactionId: 'TXN' + Date.now()
            },
            {
                id: 'RCP002',
                date: '2026-01-26',
                vendor: 'Mumbai Vegetables Co',
                vendorAddress: 'Stall 23, Vashi APMC, Navi Mumbai - 400703',
                vendorPhone: '+91 98765 43211',
                buyer: 'Priya Sharma',
                buyerPhone: '+91 87654 32108',
                items: [
                    { name: 'Fresh Potatoes', qty: 50, rate: 20, amount: 1000 },
                    { name: 'Orange Carrots', qty: 10, rate: 45, amount: 450 }
                ],
                subtotal: 1450,
                tax: 73,
                total: 1523,
                location: 'Mumbai Mandi',
                paymentMethod: 'Cash',
                transactionId: 'TXN' + (Date.now() - 86400000)
            },
            {
                id: 'RCP003',
                date: '2026-01-25',
                vendor: 'Bangalore Fresh',
                vendorAddress: 'Unit 12, Yeshwantpur Market, Bangalore - 560022',
                vendorPhone: '+91 98765 43212',
                buyer: 'Arjun Reddy',
                buyerPhone: '+91 87654 32107',
                items: [
                    { name: 'Fresh Spinach', qty: 5, rate: 40, amount: 200 },
                    { name: 'Coriander Leaves', qty: 3, rate: 80, amount: 240 }
                ],
                subtotal: 440,
                tax: 22,
                total: 462,
                location: 'Bangalore Mandi',
                paymentMethod: 'Card',
                transactionId: 'TXN' + (Date.now() - 172800000)
            }
        ];
        
        receiptsList.innerHTML = sampleReceipts.map(receipt => `
            <div class="receipt-card" onclick="App.viewReceipt('${receipt.id}')" style="cursor: pointer;">
                <div class="receipt-header">
                    <div class="receipt-id">${receipt.id}</div>
                    <div class="receipt-date">${new Date(receipt.date).toLocaleDateString()}</div>
                </div>
                <div class="receipt-vendor">
                    <strong>${receipt.vendor}</strong>
                    <span class="receipt-location">📍 ${receipt.location}</span>
                </div>
                <div class="receipt-buyer" style="margin-bottom: 1rem; font-size: 0.875rem; color: #6b7280;">
                    👤 ${receipt.buyer} • 💳 ${receipt.paymentMethod}
                </div>
                <div class="receipt-items">
                    ${receipt.items.map(item => `
                        <div class="receipt-item">
                            ${item.name} - ${item.qty}kg × ₹${item.rate} = ₹${item.amount}
                        </div>
                    `).join('')}
                </div>
                <div class="receipt-total">
                    <strong>Total: ₹${receipt.total}</strong>
                    <small style="display: block; color: #6b7280; font-weight: normal;">
                        (Subtotal: ₹${receipt.subtotal} + Tax: ₹${receipt.tax})
                    </small>
                </div>
                <div class="receipt-actions">
                    <button class="receipt-action-btn" onclick="event.stopPropagation(); App.viewReceipt('${receipt.id}')" style="background: #3b82f6; color: white; border-color: #3b82f6;">
                        👁️ View
                    </button>
                    <button class="receipt-action-btn" onclick="event.stopPropagation(); App.downloadReceipt('${receipt.id}')" style="background: #059669; color: white; border-color: #059669;">
                        📥 Download
                    </button>
                    <button class="receipt-action-btn" onclick="event.stopPropagation(); App.shareReceipt('${receipt.id}')">
                        📤 Share
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    setupReceiptControls() {
        const generateBtn = document.getElementById('generateReceiptBtn');
        
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.generateSampleReceipt();
            });
        }
    },
    
    generateSampleReceipt() {
        const newReceipt = {
            id: 'RCP' + String(Date.now()).slice(-3),
            date: new Date().toISOString().split('T')[0],
            vendor: 'Demo Fresh Mart',
            vendorAddress: 'Demo Stall 1, Sample Mandi, Demo City - 123456',
            vendorPhone: '+91 98765 43200',
            buyer: 'Sample Buyer',
            buyerPhone: '+91 87654 32100',
            items: [
                { name: 'Demo Tomatoes', qty: 10, rate: 30, amount: 300 },
                { name: 'Demo Onions', qty: 5, rate: 35, amount: 175 }
            ],
            subtotal: 475,
            tax: 24,
            total: 499,
            location: 'Demo Mandi',
            paymentMethod: 'Demo Payment',
            transactionId: 'TXN' + Date.now()
        };
        
        // Generate and download the receipt immediately
        this.generatePDFReceipt(newReceipt);
        this.showNotification('Sample receipt generated and downloaded!', 'success');
        
        // Also refresh the receipts list to show the new receipt
        setTimeout(() => {
            this.loadSampleReceipts();
        }, 500);
    },
    
    viewReceipt(receiptId) {
        // Find the receipt data (same data as in downloadReceipt)
        const sampleReceipts = [
            {
                id: 'RCP001',
                date: '2026-01-27',
                vendor: 'Delhi Fresh Mart',
                vendorAddress: 'Shop 45, Azadpur Mandi, Delhi - 110033',
                vendorPhone: '+91 98765 43210',
                buyer: 'Rajesh Kumar',
                buyerPhone: '+91 87654 32109',
                items: [
                    { name: 'Fresh Tomatoes', qty: 25, rate: 28, amount: 700 },
                    { name: 'Red Onions', qty: 15, rate: 32, amount: 480 }
                ],
                subtotal: 1180,
                tax: 59,
                total: 1239,
                location: 'Delhi Mandi',
                paymentMethod: 'UPI',
                transactionId: 'TXN' + Date.now()
            },
            {
                id: 'RCP002',
                date: '2026-01-26',
                vendor: 'Mumbai Vegetables Co',
                vendorAddress: 'Stall 23, Vashi APMC, Navi Mumbai - 400703',
                vendorPhone: '+91 98765 43211',
                buyer: 'Priya Sharma',
                buyerPhone: '+91 87654 32108',
                items: [
                    { name: 'Fresh Potatoes', qty: 50, rate: 20, amount: 1000 },
                    { name: 'Orange Carrots', qty: 10, rate: 45, amount: 450 }
                ],
                subtotal: 1450,
                tax: 73,
                total: 1523,
                location: 'Mumbai Mandi',
                paymentMethod: 'Cash',
                transactionId: 'TXN' + (Date.now() - 86400000)
            },
            {
                id: 'RCP003',
                date: '2026-01-25',
                vendor: 'Bangalore Fresh',
                vendorAddress: 'Unit 12, Yeshwantpur Market, Bangalore - 560022',
                vendorPhone: '+91 98765 43212',
                buyer: 'Arjun Reddy',
                buyerPhone: '+91 87654 32107',
                items: [
                    { name: 'Fresh Spinach', qty: 5, rate: 40, amount: 200 },
                    { name: 'Coriander Leaves', qty: 3, rate: 80, amount: 240 }
                ],
                subtotal: 440,
                tax: 22,
                total: 462,
                location: 'Bangalore Mandi',
                paymentMethod: 'Card',
                transactionId: 'TXN' + (Date.now() - 172800000)
            }
        ];
        
        const receipt = sampleReceipts.find(r => r.id === receiptId);
        if (!receipt) {
            this.showNotification('Receipt not found', 'error');
            return;
        }
        
        // Create and show modal with receipt preview
        const modal = document.createElement('div');
        modal.className = 'receipt-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            padding: 1rem;
        `;
        
        modal.innerHTML = `
            <div class="modal-content" style="
                background: white;
                border-radius: 1rem;
                max-width: 600px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            ">
                <div class="modal-header" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem;
                    border-bottom: 1px solid #e5e7eb;
                    background: linear-gradient(135deg, #ff9933, #138808);
                    color: white;
                    border-radius: 1rem 1rem 0 0;
                ">
                    <h3 style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                        🧾 Digital Receipt - ${receipt.id}
                    </h3>
                    <button class="modal-close" style="
                        background: none;
                        border: none;
                        color: white;
                        font-size: 1.5rem;
                        cursor: pointer;
                        padding: 0.25rem;
                        border-radius: 0.25rem;
                        transition: background 0.2s;
                    " onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='none'">✕</button>
                </div>
                <div class="modal-body" style="padding: 1.5rem;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                        <div>
                            <h4 style="color: #ff9933; margin: 0 0 0.5rem 0;">🏪 Vendor Details</h4>
                            <p style="margin: 0.25rem 0;"><strong>${receipt.vendor}</strong></p>
                            <p style="margin: 0.25rem 0; font-size: 0.875rem; color: #6b7280;">${receipt.vendorAddress}</p>
                            <p style="margin: 0.25rem 0; font-size: 0.875rem;">📞 ${receipt.vendorPhone}</p>
                            <p style="margin: 0.25rem 0; font-size: 0.875rem;">📍 ${receipt.location}</p>
                        </div>
                        <div>
                            <h4 style="color: #138808; margin: 0 0 0.5rem 0;">👤 Buyer Details</h4>
                            <p style="margin: 0.25rem 0;"><strong>${receipt.buyer}</strong></p>
                            <p style="margin: 0.25rem 0; font-size: 0.875rem;">📞 ${receipt.buyerPhone}</p>
                            <p style="margin: 0.25rem 0; font-size: 0.875rem;">📅 ${new Date(receipt.date).toLocaleDateString('en-IN')}</p>
                            <p style="margin: 0.25rem 0; font-size: 0.875rem;">💳 ${receipt.paymentMethod}</p>
                        </div>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem; text-align: center;">
                        <strong style="color: #138808;">Transaction ID: ${receipt.transactionId}</strong>
                    </div>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem;">
                        <thead>
                            <tr style="background: #f8f9fa;">
                                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #dee2e6; font-size: 0.875rem;">Item</th>
                                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #dee2e6; font-size: 0.875rem;">Qty</th>
                                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #dee2e6; font-size: 0.875rem;">Rate</th>
                                <th style="padding: 0.75rem; text-align: right; border-bottom: 2px solid #dee2e6; font-size: 0.875rem;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${receipt.items.map(item => `
                                <tr>
                                    <td style="padding: 0.75rem; border-bottom: 1px solid #dee2e6;">${item.name}</td>
                                    <td style="padding: 0.75rem; text-align: center; border-bottom: 1px solid #dee2e6;">${item.qty} kg</td>
                                    <td style="padding: 0.75rem; text-align: center; border-bottom: 1px solid #dee2e6;">₹${item.rate}</td>
                                    <td style="padding: 0.75rem; text-align: right; border-bottom: 1px solid #dee2e6; font-weight: 600; color: #138808;">₹${item.amount}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    <div style="background: #f8f9fa; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #ff9933;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>Subtotal:</span>
                            <span>₹${receipt.subtotal}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>Tax (5%):</span>
                            <span>₹${receipt.tax}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 1.25rem; font-weight: bold; color: #138808; border-top: 2px solid #dee2e6; padding-top: 0.5rem; margin-top: 0.5rem;">
                            <span>Total Amount:</span>
                            <span>₹${receipt.total}</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    padding: 1.5rem;
                    border-top: 1px solid #e5e7eb;
                    background: #f9fafb;
                    border-radius: 0 0 1rem 1rem;
                ">
                    <button class="close-btn" style="
                        background: #6b7280;
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 0.5rem;
                        cursor: pointer;
                        font-weight: 500;
                        transition: background 0.2s;
                    " onmouseover="this.style.background='#4b5563'" onmouseout="this.style.background='#6b7280'">Close</button>
                    <button class="download-btn" style="
                        background: linear-gradient(135deg, #138808, #0d6e0d);
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 0.5rem;
                        cursor: pointer;
                        font-weight: 500;
                        transition: transform 0.2s;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                    " onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
                        📥 Download Receipt
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        const closeBtn = modal.querySelector('.modal-close');
        const closeBtnFooter = modal.querySelector('.close-btn');
        const downloadBtn = modal.querySelector('.download-btn');
        
        const closeModal = () => {
            document.body.removeChild(modal);
        };
        
        closeBtn.addEventListener('click', closeModal);
        closeBtnFooter.addEventListener('click', closeModal);
        downloadBtn.addEventListener('click', () => {
            this.downloadReceipt(receiptId);
            closeModal();
        });
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    },
    
    downloadReceipt(receiptId) {
        // Find the receipt data
        const sampleReceipts = [
            {
                id: 'RCP001',
                date: '2026-01-27',
                vendor: 'Delhi Fresh Mart',
                vendorAddress: 'Shop 45, Azadpur Mandi, Delhi - 110033',
                vendorPhone: '+91 98765 43210',
                buyer: 'Rajesh Kumar',
                buyerPhone: '+91 87654 32109',
                items: [
                    { name: 'Fresh Tomatoes', qty: 25, rate: 28, amount: 700 },
                    { name: 'Red Onions', qty: 15, rate: 32, amount: 480 }
                ],
                subtotal: 1180,
                tax: 59,
                total: 1239,
                location: 'Delhi Mandi',
                paymentMethod: 'UPI',
                transactionId: 'TXN' + Date.now()
            },
            {
                id: 'RCP002',
                date: '2026-01-26',
                vendor: 'Mumbai Vegetables Co',
                vendorAddress: 'Stall 23, Vashi APMC, Navi Mumbai - 400703',
                vendorPhone: '+91 98765 43211',
                buyer: 'Priya Sharma',
                buyerPhone: '+91 87654 32108',
                items: [
                    { name: 'Fresh Potatoes', qty: 50, rate: 20, amount: 1000 },
                    { name: 'Orange Carrots', qty: 10, rate: 45, amount: 450 }
                ],
                subtotal: 1450,
                tax: 73,
                total: 1523,
                location: 'Mumbai Mandi',
                paymentMethod: 'Cash',
                transactionId: 'TXN' + (Date.now() - 86400000)
            },
            {
                id: 'RCP003',
                date: '2026-01-25',
                vendor: 'Bangalore Fresh',
                vendorAddress: 'Unit 12, Yeshwantpur Market, Bangalore - 560022',
                vendorPhone: '+91 98765 43212',
                buyer: 'Arjun Reddy',
                buyerPhone: '+91 87654 32107',
                items: [
                    { name: 'Fresh Spinach', qty: 5, rate: 40, amount: 200 },
                    { name: 'Coriander Leaves', qty: 3, rate: 80, amount: 240 }
                ],
                subtotal: 440,
                tax: 22,
                total: 462,
                location: 'Bangalore Mandi',
                paymentMethod: 'Card',
                transactionId: 'TXN' + (Date.now() - 172800000)
            }
        ];
        
        const receipt = sampleReceipts.find(r => r.id === receiptId);
        if (!receipt) {
            this.showNotification('Receipt not found', 'error');
            return;
        }
        
        this.generatePDFReceipt(receipt);
    },
    
    generatePDFReceipt(receipt) {
        // Create HTML content for the receipt
        const receiptHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Digital Receipt - ${receipt.id}</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        margin: 0;
                        padding: 20px;
                        background: white;
                        color: #333;
                        line-height: 1.4;
                    }
                    .receipt-container {
                        max-width: 600px;
                        margin: 0 auto;
                        border: 2px solid #ff9933;
                        border-radius: 10px;
                        overflow: hidden;
                    }
                    .receipt-header {
                        background: linear-gradient(135deg, #ff9933, #138808);
                        color: white;
                        padding: 20px;
                        text-align: center;
                    }
                    .receipt-title {
                        font-size: 24px;
                        font-weight: bold;
                        margin: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 10px;
                    }
                    .receipt-subtitle {
                        font-size: 14px;
                        margin: 5px 0 0 0;
                        opacity: 0.9;
                    }
                    .receipt-body {
                        padding: 20px;
                    }
                    .receipt-info {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin-bottom: 20px;
                        padding-bottom: 15px;
                        border-bottom: 1px solid #eee;
                    }
                    .info-section h4 {
                        margin: 0 0 8px 0;
                        color: #ff9933;
                        font-size: 14px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .info-section p {
                        margin: 2px 0;
                        font-size: 13px;
                        color: #555;
                    }
                    .receipt-id {
                        text-align: center;
                        background: #f8f9fa;
                        padding: 10px;
                        border-radius: 5px;
                        margin-bottom: 20px;
                        border-left: 4px solid #138808;
                    }
                    .receipt-id strong {
                        color: #138808;
                        font-size: 16px;
                    }
                    .items-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    .items-table th {
                        background: #f8f9fa;
                        padding: 12px 8px;
                        text-align: left;
                        border-bottom: 2px solid #dee2e6;
                        font-size: 13px;
                        font-weight: 600;
                        color: #495057;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .items-table td {
                        padding: 10px 8px;
                        border-bottom: 1px solid #dee2e6;
                        font-size: 14px;
                    }
                    .items-table tr:hover {
                        background: #f8f9fa;
                    }
                    .amount-cell {
                        text-align: right;
                        font-weight: 600;
                        color: #138808;
                    }
                    .totals-section {
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 5px;
                        border-left: 4px solid #ff9933;
                    }
                    .total-row {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 8px;
                        font-size: 14px;
                    }
                    .total-row.final {
                        font-size: 18px;
                        font-weight: bold;
                        color: #138808;
                        border-top: 2px solid #dee2e6;
                        padding-top: 10px;
                        margin-top: 10px;
                    }
                    .receipt-footer {
                        text-align: center;
                        margin-top: 20px;
                        padding-top: 15px;
                        border-top: 1px solid #eee;
                        font-size: 12px;
                        color: #666;
                    }
                    .qr-placeholder {
                        width: 80px;
                        height: 80px;
                        background: #f0f0f0;
                        border: 2px dashed #ccc;
                        margin: 10px auto;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 10px;
                        color: #999;
                    }
                    .watermark {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) rotate(-45deg);
                        font-size: 60px;
                        color: rgba(255, 153, 51, 0.1);
                        font-weight: bold;
                        z-index: -1;
                        pointer-events: none;
                    }
                    @media print {
                        body { margin: 0; padding: 10px; }
                        .receipt-container { border: 1px solid #333; }
                    }
                </style>
            </head>
            <body>
                <div class="receipt-container">
                    <div class="watermark">VIKSIT VAANI</div>
                    
                    <div class="receipt-header">
                        <h1 class="receipt-title">
                            🇮🇳 Viksit Vaani – SwarVyapaar
                        </h1>
                        <p class="receipt-subtitle">Digital Mandi Receipt</p>
                    </div>
                    
                    <div class="receipt-body">
                        <div class="receipt-id">
                            <strong>Receipt ID: ${receipt.id}</strong><br>
                            <small>Transaction ID: ${receipt.transactionId}</small>
                        </div>
                        
                        <div class="receipt-info">
                            <div class="info-section">
                                <h4>🏪 Vendor Details</h4>
                                <p><strong>${receipt.vendor}</strong></p>
                                <p>${receipt.vendorAddress}</p>
                                <p>📞 ${receipt.vendorPhone}</p>
                                <p>📍 ${receipt.location}</p>
                            </div>
                            <div class="info-section">
                                <h4>👤 Buyer Details</h4>
                                <p><strong>${receipt.buyer}</strong></p>
                                <p>📞 ${receipt.buyerPhone}</p>
                                <p>📅 ${new Date(receipt.date).toLocaleDateString('en-IN')}</p>
                                <p>💳 ${receipt.paymentMethod}</p>
                            </div>
                        </div>
                        
                        <table class="items-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Qty</th>
                                    <th>Rate</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${receipt.items.map(item => `
                                    <tr>
                                        <td>${item.name}</td>
                                        <td>${item.qty} kg</td>
                                        <td>₹${item.rate}</td>
                                        <td class="amount-cell">₹${item.amount}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        
                        <div class="totals-section">
                            <div class="total-row">
                                <span>Subtotal:</span>
                                <span>₹${receipt.subtotal}</span>
                            </div>
                            <div class="total-row">
                                <span>Tax (5%):</span>
                                <span>₹${receipt.tax}</span>
                            </div>
                            <div class="total-row final">
                                <span>Total Amount:</span>
                                <span>₹${receipt.total}</span>
                            </div>
                        </div>
                        
                        <div class="receipt-footer">
                            <div class="qr-placeholder">QR Code</div>
                            <p><strong>Thank you for using Viksit Vaani – SwarVyapaar!</strong></p>
                            <p>Empowering India's Digital Mandi System</p>
                            <p>Generated on: ${new Date().toLocaleString('en-IN')}</p>
                            <p style="margin-top: 10px; font-size: 10px;">
                                This is a digitally generated receipt. For support, contact: support@viksitvaani.gov.in
                            </p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
        
        // Create and download the HTML file
        const blob = new Blob([receiptHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Receipt_${receipt.id}_${receipt.date}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification(`Receipt ${receipt.id} downloaded successfully!`, 'success');
        
        // Also offer to open in new window for printing
        setTimeout(() => {
            if (confirm('Would you like to open the receipt in a new window for printing?')) {
                const printWindow = window.open('', '_blank');
                printWindow.document.write(receiptHTML);
                printWindow.document.close();
            }
        }, 1000);
    },
    
    shareReceipt(receiptId) {
        this.showNotification(`Sharing receipt ${receiptId}`, 'info');
    }
};

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
@keyframes particleFade {
    0% { 
        opacity: 1; 
        transform: scale(1) translateY(0); 
    }
    50% {
        opacity: 0.8;
        transform: scale(1.2) translateY(-10px);
    }
    100% { 
        opacity: 0; 
        transform: scale(0.3) translateY(-25px); 
    }
}

.floating-produce {
    position: absolute;
    font-size: 2.2rem;
    opacity: 0.7;
    animation: governmentFallProduce linear infinite;
    pointer-events: none;
    z-index: 2;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.floating-produce.vegetable {
    opacity: 0.8;
    filter: drop-shadow(0 2px 4px rgba(5, 150, 105, 0.2));
}

.floating-produce.fruit {
    opacity: 0.9;
    filter: drop-shadow(0 2px 4px rgba(220, 38, 38, 0.2));
}

.floating-letter {
    position: absolute;
    font-size: 1.8rem;
    opacity: 0.4;
    color: #374151;
    animation: governmentFloatLetter linear infinite;
    pointer-events: none;
    z-index: 3;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.floating-letter.telugu {
    font-family: 'Noto Sans Telugu', sans-serif;
    color: #4f46e5;
}

.floating-letter.hindi {
    font-family: 'Noto Sans Devanagari', sans-serif;
    color: #dc2626;
}

.floating-letter.kannada {
    font-family: 'Noto Sans Kannada', sans-serif;
    color: #059669;
}

.floating-letter.tamil {
    font-family: 'Noto Sans Tamil', sans-serif;
    color: #7c2d12;
}

.floating-letter.malayalam {
    font-family: 'Noto Sans Malayalam', sans-serif;
    color: #1e40af;
}

.floating-letter.marathi {
    font-family: 'Noto Sans Devanagari', sans-serif;
    color: #b45309;
}

.floating-letter.odia {
    font-family: 'Noto Sans Oriya', sans-serif;
    color: #7c3aed;
}

/* OLD ANIMATIONS REPLACED - Using government-grade animations from CSS file */
/* governmentFallProduce and governmentFloatLetter are defined in css/style.css */

/* Celebration Effects for Section Changes */
.floating-produce.celebration {
    animation: celebrationBurst 2s ease-out forwards !important;
    font-size: 2.5rem !important;
    opacity: 1 !important;
    z-index: 9998;
}

.floating-letter.celebration {
    animation: celebrationFloat 1.5s ease-out forwards !important;
    font-size: 2.2rem !important;
    opacity: 0.8 !important;
    z-index: 9998;
}

@keyframes celebrationBurst {
    0% {
        transform: scale(0.8) translateY(0) rotate(0deg);
        opacity: 0;
    }
    50% {
        transform: scale(1.3) translateY(-30px) rotate(180deg);
        opacity: 1;
    }
    100% {
        transform: scale(0.5) translateY(-60px) rotate(360deg);
        opacity: 0;
    }
}

@keyframes celebrationFloat {
    0% {
        transform: scale(0.8) translateY(0) rotate(0deg);
        opacity: 0;
    }
    50% {
        transform: scale(1.2) translateY(-20px) rotate(10deg);
        opacity: 0.8;
    }
    100% {
        transform: scale(0.7) translateY(-40px) rotate(-10deg);
        opacity: 0;
    }
}

.agricultural-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
    overflow: hidden;
    background: linear-gradient(135deg, 
        rgba(255, 248, 237, 0.3) 0%,
        rgba(248, 250, 252, 0.2) 50%,
        rgba(236, 253, 245, 0.3) 100%
    );
}inter-events: none;
    background: linear-gradient(135deg, #fff8ed 0%, #f8fafc 50%, #ecfdf5 100%);
}

.voice-main-btn.listening {
    animation: voicePulse 1.5s ease-in-out infinite;
    background: linear-gradient(135deg, #dc2626, #ef4444) !important;
}

@keyframes voicePulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

/* Performance Optimizations */
.floating-produce,
.floating-letter {
    will-change: transform, opacity;
    transform: translateZ(0);
    backface-visibility: hidden;
}

/* Mobile Responsive Adjustments */
@media (max-width: 768px) {
    .floating-produce {
        font-size: 2rem;
        opacity: 0.6;
    }
    
    .floating-letter {
        font-size: 1.6rem;
        opacity: 0.3;
    }
}

@media (max-width: 480px) {
    .floating-produce {
        font-size: 1.8rem;
        opacity: 0.5;
    }
    
    .floating-letter {
        font-size: 1.4rem;
        opacity: 0.3;
    }
}

/* Accessibility - Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
    .floating-produce,
    .floating-letter,
    .cursor-particle {
        animation: none;
        opacity: 0.2;
        transform: none;
    }
    
    .floating-produce.celebration,
    .floating-letter.celebration {
        animation: none !important;
        opacity: 0.5 !important;
        transform: none !important;
    }
}
`;
document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

// Make App global for onclick handlers
window.App = App;

console.log('✅ Viksit Vaani – SwarVyapaar loaded successfully!');