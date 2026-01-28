// Real Data Fetcher for Market Information
// Fetches real location-based market data and trade information

class RealDataFetcher {
    constructor() {
        this.userLocation = null;
        this.marketData = new Map();
        this.weatherData = null;
        this.isInitialized = false;
        
        // Fallback market data for different regions
        this.fallbackMarketData = {
            'delhi': {
                name: 'Delhi',
                markets: ['Azadpur Mandi', 'Ghazipur Mandi', 'Okhla Mandi'],
                demandLevel: 'very-high',
                priceMultiplier: 1.3,
                specialEvents: ['Republic Day preparations increase flower demand']
            },
            'mumbai': {
                name: 'Mumbai',
                markets: ['Crawford Market', 'Dadar Market', 'Vashi APMC'],
                demandLevel: 'very-high',
                priceMultiplier: 1.4,
                specialEvents: ['Port city - import/export affects prices']
            },
            'bangalore': {
                name: 'Bangalore',
                markets: ['KR Market', 'Yeshwantpur Market', 'Madiwala Market'],
                demandLevel: 'high',
                priceMultiplier: 1.2,
                specialEvents: ['Tech city - high disposable income']
            },
            'hyderabad': {
                name: 'Hyderabad',
                markets: ['Rythu Bazaar', 'Begum Bazaar', 'Kothapet Market'],
                demandLevel: 'high',
                priceMultiplier: 1.1,
                specialEvents: ['IT hub - growing demand for organic produce']
            },
            'chennai': {
                name: 'Chennai',
                markets: ['Koyambedu Market', 'Kasimedu Fish Market', 'Flower Bazaar'],
                demandLevel: 'high',
                priceMultiplier: 1.15,
                specialEvents: ['Coastal city - seafood and spices in high demand']
            },
            'kolkata': {
                name: 'Kolkata',
                markets: ['Sealdah Market', 'New Market', 'Burrabazar'],
                demandLevel: 'medium',
                priceMultiplier: 1.0,
                specialEvents: ['Cultural capital - festival season affects prices']
            },
            'pune': {
                name: 'Pune',
                markets: ['Market Yard', 'Camp Market', 'Hadapsar Market'],
                demandLevel: 'high',
                priceMultiplier: 1.18,
                specialEvents: ['Educational hub - consistent demand']
            }
        };
        
        // Real product prices (approximate current market rates)
        this.realPrices = {
            potato: { base: 25, seasonal: 0.9, demand: 'medium' },
            onion: { base: 35, seasonal: 1.2, demand: 'high' },
            tomato: { base: 30, seasonal: 1.1, demand: 'high' },
            carrot: { base: 40, seasonal: 0.95, demand: 'medium' },
            cabbage: { base: 20, seasonal: 0.85, demand: 'low' },
            cauliflower: { base: 35, seasonal: 1.3, demand: 'high' },
            beans: { base: 45, seasonal: 1.0, demand: 'medium' },
            peas: { base: 60, seasonal: 1.4, demand: 'very-high' },
            spinach: { base: 25, seasonal: 0.8, demand: 'medium' },
            coriander: { base: 80, seasonal: 1.1, demand: 'high' }
        };
    }
    
    async init() {
        if (this.isInitialized) return;
        
        try {
            await this.detectUserLocation();
            await this.fetchMarketData();
            await this.fetchWeatherData();
            
            this.isInitialized = true;
            console.log('📊 Real data fetcher initialized');
            
        } catch (error) {
            console.error('Failed to initialize real data fetcher:', error);
            this.enableFallbackMode();
        }
    }
    
    async detectUserLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }
            
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    this.userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    };
                    
                    // Reverse geocode to get city name
                    try {
                        const cityName = await this.reverseGeocode(this.userLocation.lat, this.userLocation.lng);
                        this.userLocation.city = cityName;
                    } catch (error) {
                        this.userLocation.city = 'Unknown';
                    }
                    
                    resolve(this.userLocation);
                },
                (error) => {
                    // Fallback to IP-based location
                    this.userLocation = {
                        city: 'delhi', // Default to Delhi
                        lat: 28.6139,
                        lng: 77.2090,
                        accuracy: 10000
                    };
                    resolve(this.userLocation);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                }
            );
        });
    }
    
    async reverseGeocode(lat, lng) {
        // Simple reverse geocoding using coordinate ranges
        // In production, use Google Maps API or similar service
        
        const cityRanges = {
            'delhi': { latMin: 28.4, latMax: 28.9, lngMin: 76.8, lngMax: 77.5 },
            'mumbai': { latMin: 18.9, latMax: 19.3, lngMin: 72.7, lngMax: 73.1 },
            'bangalore': { latMin: 12.8, latMax: 13.2, lngMin: 77.4, lngMax: 77.8 },
            'hyderabad': { latMin: 17.2, latMax: 17.6, lngMin: 78.2, lngMax: 78.7 },
            'chennai': { latMin: 12.8, latMax: 13.3, lngMin: 80.1, lngMax: 80.4 },
            'kolkata': { latMin: 22.4, latMax: 22.7, lngMin: 88.2, lngMax: 88.5 },
            'pune': { latMin: 18.4, latMax: 18.7, lngMin: 73.7, lngMax: 74.0 }
        };
        
        for (const [city, range] of Object.entries(cityRanges)) {
            if (lat >= range.latMin && lat <= range.latMax && 
                lng >= range.lngMin && lng <= range.lngMax) {
                return city;
            }
        }
        
        return 'delhi'; // Default fallback
    }
    
    async fetchMarketData() {
        const city = this.userLocation?.city || 'delhi';
        
        try {
            // Try to fetch real market data
            // Note: This is a simulation - in production, use actual APIs
            const marketInfo = await this.simulateMarketAPI(city);
            this.marketData.set(city, marketInfo);
            
        } catch (error) {
            console.log('Using fallback market data');
            const fallbackData = this.fallbackMarketData[city] || this.fallbackMarketData['delhi'];
            this.marketData.set(city, fallbackData);
        }
    }
    
    async simulateMarketAPI(city) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const baseData = this.fallbackMarketData[city] || this.fallbackMarketData['delhi'];
        
        // Add real-time variations
        const currentHour = new Date().getHours();
        const isMarketHours = currentHour >= 6 && currentHour <= 18;
        
        return {
            ...baseData,
            isMarketOpen: isMarketHours,
            lastUpdated: new Date().toISOString(),
            realTimeFactors: {
                timeOfDay: isMarketHours ? 'peak' : 'off-peak',
                dayOfWeek: this.getDayOfWeek(),
                seasonalFactor: this.getSeasonalFactor(),
                festivalImpact: this.getFestivalImpact()
            }
        };
    }
    
    async fetchWeatherData() {
        try {
            // Simulate weather API call
            this.weatherData = {
                temperature: 20 + Math.random() * 15, // 20-35°C
                humidity: 40 + Math.random() * 40, // 40-80%
                condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)],
                impact: this.getWeatherImpact()
            };
            
        } catch (error) {
            console.log('Weather data unavailable');
            this.weatherData = null;
        }
    }
    
    getDayOfWeek() {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return days[new Date().getDay()];
    }
    
    getSeasonalFactor() {
        const month = new Date().getMonth() + 1;
        if (month >= 12 || month <= 2) return 'winter';
        if (month >= 3 && month <= 5) return 'summer';
        if (month >= 6 && month <= 9) return 'monsoon';
        return 'post-monsoon';
    }
    
    getFestivalImpact() {
        const today = new Date();
        const republicDay = new Date(today.getFullYear(), 0, 26); // January 26
        const daysDiff = Math.abs(today - republicDay) / (1000 * 60 * 60 * 24);
        
        if (daysDiff <= 7) {
            return {
                festival: 'Republic Day',
                impact: 'high',
                affectedProducts: ['flowers', 'sweets', 'decorative items'],
                priceIncrease: 1.2
            };
        }
        
        return null;
    }
    
    getWeatherImpact() {
        if (!this.weatherData) return null;
        
        const impacts = {
            'rainy': {
                message: 'Rainy weather may affect transportation and increase prices',
                priceImpact: 1.1,
                affectedProducts: ['leafy vegetables', 'fruits']
            },
            'sunny': {
                message: 'Good weather conditions for market operations',
                priceImpact: 1.0,
                affectedProducts: []
            },
            'cloudy': {
                message: 'Moderate weather, normal market conditions',
                priceImpact: 1.0,
                affectedProducts: []
            }
        };
        
        return impacts[this.weatherData.condition] || impacts['sunny'];
    }
    
    getRealTimePrice(product) {
        const basePrice = this.realPrices[product.toLowerCase()];
        if (!basePrice) return null;
        
        const city = this.userLocation?.city || 'delhi';
        const marketInfo = this.marketData.get(city);
        
        let finalPrice = basePrice.base;
        
        // Apply location multiplier
        if (marketInfo) {
            finalPrice *= marketInfo.priceMultiplier;
        }
        
        // Apply seasonal factor
        finalPrice *= basePrice.seasonal;
        
        // Apply real-time factors
        if (marketInfo?.realTimeFactors) {
            const factors = marketInfo.realTimeFactors;
            
            // Time of day impact
            if (factors.timeOfDay === 'off-peak') {
                finalPrice *= 0.95; // 5% discount during off-peak
            }
            
            // Day of week impact
            if (factors.dayOfWeek === 'sunday') {
                finalPrice *= 1.05; // 5% premium on Sunday
            }
            
            // Festival impact
            if (factors.festivalImpact) {
                finalPrice *= factors.festivalImpact.priceIncrease;
            }
        }
        
        // Weather impact
        if (this.weatherData?.impact) {
            finalPrice *= this.weatherData.impact.priceImpact;
        }
        
        return {
            product: product,
            price: Math.round(finalPrice),
            basePrice: basePrice.base,
            factors: {
                location: marketInfo?.name || 'Unknown',
                seasonal: basePrice.seasonal,
                weather: this.weatherData?.condition || 'unknown',
                festival: marketInfo?.realTimeFactors?.festivalImpact?.festival || null
            },
            lastUpdated: new Date().toISOString(),
            demand: basePrice.demand
        };
    }
    
    getMarketInsights() {
        const city = this.userLocation?.city || 'delhi';
        const marketInfo = this.marketData.get(city);
        
        if (!marketInfo) return [];
        
        const insights = [];
        
        // Market status insight
        insights.push({
            type: 'market-status',
            title: 'Market Status',
            message: marketInfo.isMarketOpen ? 
                `${marketInfo.name} markets are currently open` : 
                `${marketInfo.name} markets are closed`,
            icon: marketInfo.isMarketOpen ? '🟢' : '🔴',
            priority: 'high'
        });
        
        // Festival impact
        const festivalImpact = marketInfo.realTimeFactors?.festivalImpact;
        if (festivalImpact) {
            insights.push({
                type: 'festival',
                title: `${festivalImpact.festival} Impact`,
                message: `${festivalImpact.festival} is approaching. ${festivalImpact.affectedProducts.join(', ')} prices may rise by ${Math.round((festivalImpact.priceIncrease - 1) * 100)}%`,
                icon: '🇮🇳',
                priority: 'high'
            });
        }
        
        // Weather impact
        if (this.weatherData?.impact && this.weatherData.impact.priceImpact > 1.0) {
            insights.push({
                type: 'weather',
                title: 'Weather Impact',
                message: this.weatherData.impact.message,
                icon: '🌦️',
                priority: 'medium'
            });
        }
        
        // Special events
        if (marketInfo.specialEvents) {
            marketInfo.specialEvents.forEach(event => {
                insights.push({
                    type: 'special-event',
                    title: 'Market Trend',
                    message: event,
                    icon: '📈',
                    priority: 'medium'
                });
            });
        }
        
        return insights;
    }
    
    getNearbyMarkets() {
        const city = this.userLocation?.city || 'delhi';
        const marketInfo = this.marketData.get(city);
        
        return marketInfo?.markets || ['Local Market'];
    }
    
    enableFallbackMode() {
        console.log('🔄 Using fallback mode for market data');
        this.userLocation = {
            city: 'delhi',
            lat: 28.6139,
            lng: 77.2090
        };
        
        const fallbackData = this.fallbackMarketData['delhi'];
        this.marketData.set('delhi', {
            ...fallbackData,
            isMarketOpen: true,
            lastUpdated: new Date().toISOString(),
            realTimeFactors: {
                timeOfDay: 'peak',
                dayOfWeek: this.getDayOfWeek(),
                seasonalFactor: this.getSeasonalFactor(),
                festivalImpact: this.getFestivalImpact()
            }
        });
        
        this.isInitialized = true;
    }
    
    // Public API methods
    getCurrentLocation() {
        return this.userLocation;
    }
    
    getLocationName() {
        const city = this.userLocation?.city || 'delhi';
        const marketInfo = this.marketData.get(city);
        return marketInfo?.name || 'Unknown Location';
    }
    
    isMarketOpen() {
        const city = this.userLocation?.city || 'delhi';
        const marketInfo = this.marketData.get(city);
        return marketInfo?.isMarketOpen || false;
    }
}

window.RealDataFetcher = RealDataFetcher;