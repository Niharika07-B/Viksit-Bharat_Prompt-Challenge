// Location-Based Pricing Manager for Viksit Vaani – SwarVyapaar
// Handles dynamic pricing based on user location, market trends, and seasonal factors

class LocationPricingManager {
    constructor() {
        this.currentLocation = null;
        this.isInitialized = false;
        this.priceCache = new Map();
        this.locationCache = new Map();
        
        // Mock market data for different locations
        this.marketData = {
            'andhra-pradesh': {
                name: 'Andhra Pradesh',
                districts: ['Chandragiri', 'Tirupati', 'Vijayawada', 'Visakhapatnam'],
                priceMultiplier: 1.0,
                demandLevel: 'high',
                supplyLevel: 'medium'
            },
            'telangana': {
                name: 'Telangana',
                districts: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
                priceMultiplier: 1.1,
                demandLevel: 'high',
                supplyLevel: 'medium'
            },
            'karnataka': {
                name: 'Karnataka',
                districts: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore'],
                priceMultiplier: 1.15,
                demandLevel: 'very-high',
                supplyLevel: 'low'
            },
            'tamil-nadu': {
                name: 'Tamil Nadu',
                districts: ['Chennai', 'Coimbatore', 'Madurai', 'Salem'],
                priceMultiplier: 1.05,
                demandLevel: 'high',
                supplyLevel: 'medium'
            },
            'kerala': {
                name: 'Kerala',
                districts: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur'],
                priceMultiplier: 1.2,
                demandLevel: 'very-high',
                supplyLevel: 'low'
            },
            'maharashtra': {
                name: 'Maharashtra',
                districts: ['Mumbai', 'Pune', 'Nashik', 'Nagpur'],
                priceMultiplier: 1.25,
                demandLevel: 'very-high',
                supplyLevel: 'low'
            },
            'odisha': {
                name: 'Odisha',
                districts: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur'],
                priceMultiplier: 0.9,
                demandLevel: 'medium',
                supplyLevel: 'high'
            }
        };
        
        // Base prices for common products (per kg)
        this.basePrices = {
            potato: { min: 20, fair: 25, max: 30 },
            onion: { min: 30, fair: 35, max: 40 },
            tomato: { min: 25, fair: 30, max: 35 },
            carrot: { min: 35, fair: 40, max: 45 },
            cabbage: { min: 15, fair: 20, max: 25 },
            cauliflower: { min: 25, fair: 30, max: 35 },
            beans: { min: 40, fair: 45, max: 50 },
            peas: { min: 50, fair: 55, max: 60 }
        };
        
        // Seasonal factors
        this.seasonalFactors = {
            winter: { potato: 0.9, onion: 1.1, tomato: 1.2 },
            summer: { potato: 1.1, onion: 0.9, tomato: 0.8 },
            monsoon: { potato: 1.2, onion: 1.3, tomato: 1.4 },
            post_monsoon: { potato: 1.0, onion: 1.0, tomato: 1.0 }
        };
    }
    
    // Initialize the location pricing manager
    async init() {
        if (this.isInitialized) return;
        
        try {
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize location detection
            await this.initializeLocation();
            
            // Setup UI components
            this.initializeUI();
            
            this.isInitialized = true;
            console.log('📍 Location Pricing Manager initialized');
            
        } catch (error) {
            console.error('Failed to initialize Location Pricing Manager:', error);
        }
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Location change button
        const changeLocationBtn = document.getElementById('changeLocationBtn');
        if (changeLocationBtn) {
            changeLocationBtn.addEventListener('click', () => {
                this.toggleLocationSelector();
            });
        }
        
        // Update location button
        const updateLocationBtn = document.getElementById('updateLocationBtn');
        if (updateLocationBtn) {
            updateLocationBtn.addEventListener('click', () => {
                this.updateLocation();
            });
        }
        
        // Listen for voice price requests
        window.addEventListener('voicePriceRequest', (event) => {
            this.handleVoicePriceRequest(event.detail);
        });
    }
    
    // Initialize location detection
    async initializeLocation() {
        try {
            // Try to get user's location
            const position = await this.getCurrentPosition();
            const locationData = await this.reverseGeocode(position.coords.latitude, position.coords.longitude);
            
            this.currentLocation = {
                type: 'auto',
                state: this.detectStateFromCoords(position.coords),
                district: locationData.district || 'Local Area',
                coordinates: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
            };
            
        } catch (error) {
            console.log('Location detection failed, using default location');
            // Default to Andhra Pradesh
            this.currentLocation = {
                type: 'default',
                state: 'andhra-pradesh',
                district: 'Chandragiri',
                coordinates: null
            };
        }
        
        this.updateLocationDisplay();
    }
    
    // Get current position
    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }
            
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            });
        });
    }
    
    // Reverse geocode coordinates
    async reverseGeocode(lat, lng) {
        // Mock reverse geocoding - in real app, use Google Maps API or similar
        return {
            district: 'Local Area',
            state: 'Detected State'
        };
    }
    
    // Detect state from coordinates
    detectStateFromCoords(coords) {
        // Simple coordinate-based state detection
        // In real app, use proper geocoding service
        const lat = coords.latitude;
        const lng = coords.longitude;
        
        if (lat >= 13.0 && lat <= 19.0 && lng >= 77.0 && lng <= 84.0) {
            return 'andhra-pradesh';
        } else if (lat >= 15.0 && lat <= 19.5 && lng >= 77.0 && lng <= 81.0) {
            return 'telangana';
        } else if (lat >= 11.5 && lat <= 18.5 && lng >= 74.0 && lng <= 78.5) {
            return 'karnataka';
        }
        
        return 'andhra-pradesh'; // Default
    }
    
    // Initialize UI components
    initializeUI() {
        this.updateLocationDisplay();
        this.populateLocationSelector();
    }
    
    // Update location display
    updateLocationDisplay() {
        const locationText = document.getElementById('currentLocationText');
        if (!locationText || !this.currentLocation) return;
        
        const marketData = this.marketData[this.currentLocation.state];
        const displayText = `${this.currentLocation.district}, ${marketData?.name || 'India'}`;
        
        locationText.textContent = displayText;
    }
    
    // Populate location selector
    populateLocationSelector() {
        const locationSelect = document.getElementById('locationSelect');
        if (!locationSelect) return;
        
        // Clear existing options except auto-detect
        const autoOption = locationSelect.querySelector('option[value="auto"]');
        locationSelect.innerHTML = '';
        if (autoOption) {
            locationSelect.appendChild(autoOption);
        }
        
        // Add state options
        Object.entries(this.marketData).forEach(([key, data]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = data.name;
            if (key === this.currentLocation?.state) {
                option.selected = true;
            }
            locationSelect.appendChild(option);
        });
    }
    
    // Toggle location selector
    toggleLocationSelector() {
        const selector = document.getElementById('locationSelector');
        if (selector) {
            const isVisible = selector.style.display !== 'none';
            selector.style.display = isVisible ? 'none' : 'block';
        }
    }
    
    // Update location
    async updateLocation() {
        const locationSelect = document.getElementById('locationSelect');
        const selector = document.getElementById('locationSelector');
        
        if (!locationSelect) return;
        
        const selectedValue = locationSelect.value;
        
        if (selectedValue === 'auto') {
            // Re-detect location
            await this.initializeLocation();
        } else {
            // Use selected state
            const marketData = this.marketData[selectedValue];
            this.currentLocation = {
                type: 'manual',
                state: selectedValue,
                district: marketData.districts[0], // Use first district as default
                coordinates: null
            };
        }
        
        this.updateLocationDisplay();
        
        // Hide selector
        if (selector) {
            selector.style.display = 'none';
        }
        
        // Refresh current price display if visible
        const priceResults = document.getElementById('priceResults');
        if (priceResults && priceResults.style.display !== 'none') {
            const currentProduct = document.getElementById('priceProduct')?.textContent;
            if (currentProduct) {
                this.updatePriceDisplay(currentProduct.toLowerCase());
            }
        }
        
        this.showNotification('Location updated successfully!', 'success');
    }
    
    // Handle voice price request
    async handleVoicePriceRequest(data) {
        const { product, language } = data;
        
        // Get location-based pricing
        const pricing = await this.getLocationBasedPricing(product);
        
        // Update price display
        this.updatePriceDisplay(product, pricing);
        
        // Update market intelligence
        this.updateMarketIntelligence(product, pricing);
    }
    
    // Get location-based pricing
    async getLocationBasedPricing(product) {
        const cacheKey = `${product}-${this.currentLocation?.state}-${Date.now()}`;
        
        // Check cache (valid for 5 minutes)
        if (this.priceCache.has(cacheKey)) {
            return this.priceCache.get(cacheKey);
        }
        
        // Get base prices
        const basePrice = this.basePrices[product.toLowerCase()] || this.basePrices.potato;
        
        // Apply location multiplier
        const locationMultiplier = this.currentLocation ? 
            (this.marketData[this.currentLocation.state]?.priceMultiplier || 1.0) : 1.0;
        
        // Apply seasonal factor
        const season = this.getCurrentSeason();
        const seasonalMultiplier = this.seasonalFactors[season]?.[product.toLowerCase()] || 1.0;
        
        // Calculate final prices
        const pricing = {
            min: Math.round(basePrice.min * locationMultiplier * seasonalMultiplier),
            fair: Math.round(basePrice.fair * locationMultiplier * seasonalMultiplier),
            max: Math.round(basePrice.max * locationMultiplier * seasonalMultiplier),
            location: this.currentLocation,
            marketData: this.marketData[this.currentLocation?.state],
            season: season,
            trend: this.calculateTrend(product),
            lastUpdated: new Date()
        };
        
        // Cache the result
        this.priceCache.set(cacheKey, pricing);
        
        // Clean old cache entries
        setTimeout(() => {
            this.priceCache.delete(cacheKey);
        }, 5 * 60 * 1000); // 5 minutes
        
        return pricing;
    }
    
    // Get current season
    getCurrentSeason() {
        const month = new Date().getMonth() + 1; // 1-12
        
        if (month >= 12 || month <= 2) return 'winter';
        if (month >= 3 && month <= 5) return 'summer';
        if (month >= 6 && month <= 9) return 'monsoon';
        return 'post_monsoon';
    }
    
    // Calculate price trend
    calculateTrend(product) {
        // Mock trend calculation - in real app, use historical data
        const trends = ['rising', 'falling', 'stable'];
        const trendIcons = { rising: '📈', falling: '📉', stable: '➡️' };
        const trend = trends[Math.floor(Math.random() * trends.length)];
        
        return {
            direction: trend,
            icon: trendIcons[trend],
            percentage: Math.floor(Math.random() * 10) + 1
        };
    }
    
    // Update price display
    updatePriceDisplay(product, pricing = null) {
        if (!pricing) {
            // Get pricing if not provided
            this.getLocationBasedPricing(product).then(p => {
                this.updatePriceDisplay(product, p);
            });
            return;
        }
        
        // Update price values
        const minPrice = document.getElementById('minPriceValue');
        const fairPrice = document.getElementById('fairPriceValue');
        const maxPrice = document.getElementById('maxPriceValue');
        
        if (minPrice) minPrice.textContent = `₹${pricing.min}`;
        if (fairPrice) fairPrice.textContent = `₹${pricing.fair}`;
        if (maxPrice) maxPrice.textContent = `₹${pricing.max}`;
        
        // Update location info
        const priceLocation = document.getElementById('priceLocation');
        if (priceLocation && pricing.location) {
            const marketData = this.marketData[pricing.location.state];
            priceLocation.textContent = `Location: ${pricing.location.district}, ${marketData?.name}`;
        }
        
        // Update trend
        const trendIcon = document.querySelector('.trend-icon');
        const trendText = document.querySelector('.trend-text');
        
        if (trendIcon) trendIcon.textContent = pricing.trend.icon;
        if (trendText) trendText.textContent = pricing.trend.direction;
    }
    
    // Update market intelligence
    updateMarketIntelligence(product, pricing) {
        const demandLevel = document.getElementById('demandLevel');
        const supplyLevel = document.getElementById('supplyLevel');
        const seasonalFactor = document.getElementById('seasonalFactor');
        const negotiationTips = document.getElementById('negotiationTipsContent');
        
        if (demandLevel && pricing.marketData) {
            demandLevel.textContent = pricing.marketData.demandLevel.replace('-', ' ');
        }
        
        if (supplyLevel && pricing.marketData) {
            supplyLevel.textContent = pricing.marketData.supplyLevel;
        }
        
        if (seasonalFactor) {
            const seasonNames = {
                winter: 'Winter Season',
                summer: 'Summer Season',
                monsoon: 'Monsoon Season',
                post_monsoon: 'Post-Monsoon'
            };
            seasonalFactor.textContent = seasonNames[pricing.season] || 'Current Season';
        }
        
        if (negotiationTips) {
            const tip = this.generateNegotiationTip(product, pricing);
            negotiationTips.innerHTML = `<p>${tip}</p>`;
        }
    }
    
    // Generate negotiation tip
    generateNegotiationTip(product, pricing) {
        const startPrice = Math.round((pricing.min + pricing.fair) / 2);
        const marketCondition = pricing.marketData?.demandLevel || 'medium';
        
        let tip = `Start negotiating at ₹${startPrice} per kg based on current market conditions.`;
        
        if (marketCondition === 'very-high') {
            tip += ' High demand - prices may be firm.';
        } else if (marketCondition === 'high') {
            tip += ' Good demand - moderate negotiation possible.';
        } else {
            tip += ' Normal demand - good negotiation opportunity.';
        }
        
        if (pricing.trend.direction === 'rising') {
            tip += ' Prices are trending up - act quickly.';
        } else if (pricing.trend.direction === 'falling') {
            tip += ' Prices are falling - wait for better deals.';
        }
        
        return tip;
    }
    
    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Get current location for external use
    getCurrentLocation() {
        return this.currentLocation;
    }
    
    // Get pricing for external use
    async getPricing(product) {
        return await this.getLocationBasedPricing(product);
    }
}

// Create global instance
LocationPricingManager.instance = new LocationPricingManager();

// Export for global use
window.LocationPricingManager = LocationPricingManager;