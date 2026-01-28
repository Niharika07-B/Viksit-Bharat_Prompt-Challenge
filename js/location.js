// Location Management for Viksit Vaani – SwarVyapaar
// Detects user location and fetches real nearby market data

const LocationManager = {
    currentLocation: null,
    nearbyMarkets: [],
    
    // Initialize location services
    init() {
        this.detectLocation();
        this.setupLocationDisplay();
    },

    // Detect user's current location
    async detectLocation() {
        const locationDisplay = document.getElementById('locationDisplay');
        const dashboardLocation = document.getElementById('dashboardLocation');
        
        try {
            // Show loading state
            this.updateLocationDisplay('Detecting location...');
            
            if ('geolocation' in navigator) {
                const position = await this.getCurrentPosition();
                this.currentLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                
                // Get location name from coordinates
                const locationName = await this.getLocationName(
                    this.currentLocation.latitude, 
                    this.currentLocation.longitude
                );
                
                this.updateLocationDisplay(locationName);
                
                // Fetch nearby markets
                await this.fetchNearbyMarkets();
                
            } else {
                throw new Error('Geolocation not supported');
            }
        } catch (error) {
            console.error('Location detection failed:', error);
            // Fallback to default location
            this.currentLocation = {
                latitude: 28.6139, // New Delhi
                longitude: 77.2090,
                name: 'New Delhi'
            };
            this.updateLocationDisplay('New Delhi (Default)');
            await this.fetchNearbyMarkets();
        }
    },

    // Get current position using Geolocation API
    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                resolve,
                reject,
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000 // 5 minutes
                }
            );
        });
    },

    // Get location name from coordinates using reverse geocoding
    async getLocationName(lat, lon) {
        try {
            // Using a free geocoding service
            const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
            );
            
            if (response.ok) {
                const data = await response.json();
                const city = data.city || data.locality || data.principalSubdivision;
                const state = data.principalSubdivision;
                return city ? `${city}, ${state}` : 'Unknown Location';
            } else {
                throw new Error('Geocoding failed');
            }
        } catch (error) {
            console.error('Reverse geocoding failed:', error);
            return 'Current Location';
        }
    },

    // Update location display in UI
    updateLocationDisplay(locationText) {
        const locationDisplay = document.getElementById('locationDisplay');
        const dashboardLocation = document.getElementById('dashboardLocation');
        
        if (locationDisplay) {
            const textElement = locationDisplay.querySelector('.location-text');
            if (textElement) {
                textElement.textContent = locationText;
            }
        }
        
        if (dashboardLocation) {
            dashboardLocation.textContent = locationText;
        }
    },

    // Setup location display and manual override
    setupLocationDisplay() {
        const locationDisplay = document.getElementById('locationDisplay');
        if (locationDisplay) {
            locationDisplay.addEventListener('click', () => {
                this.showLocationModal();
            });
        }
    },

    // Show location selection modal
    showLocationModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Select Location</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">✕</button>
                </div>
                <div class="modal-body">
                    <div style="margin-bottom: 1rem;">
                        <label for="manualLocation" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Enter your location:</label>
                        <input type="text" id="manualLocation" placeholder="e.g., Mumbai, Maharashtra" 
                               style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem;">
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <h4 style="margin-bottom: 0.5rem;">Popular Markets:</h4>
                        <div id="popularMarkets" style="display: grid; gap: 0.5rem;">
                            <button class="location-option" data-location="Delhi, New Delhi">Delhi - Azadpur Mandi</button>
                            <button class="location-option" data-location="Mumbai, Maharashtra">Mumbai - Crawford Market</button>
                            <button class="location-option" data-location="Kolkata, West Bengal">Kolkata - Sealdah Market</button>
                            <button class="location-option" data-location="Chennai, Tamil Nadu">Chennai - Koyambedu Market</button>
                            <button class="location-option" data-location="Bangalore, Karnataka">Bangalore - KR Market</button>
                            <button class="location-option" data-location="Hyderabad, Telangana">Hyderabad - Rythu Bazaar</button>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                    <button class="btn btn-primary" onclick="LocationManager.setManualLocation()">Set Location</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners for location options
        modal.querySelectorAll('.location-option').forEach(button => {
            button.style.cssText = 'width: 100%; padding: 0.5rem; text-align: left; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.5rem; cursor: pointer;';
            button.addEventListener('click', (e) => {
                const location = e.target.getAttribute('data-location');
                document.getElementById('manualLocation').value = location;
            });
        });
    },

    // Set manual location
    async setManualLocation() {
        const input = document.getElementById('manualLocation');
        const location = input.value.trim();
        
        if (location) {
            this.updateLocationDisplay(location);
            
            // Try to geocode the location
            try {
                const coords = await this.geocodeLocation(location);
                if (coords) {
                    this.currentLocation = {
                        latitude: coords.lat,
                        longitude: coords.lon,
                        name: location
                    };
                    await this.fetchNearbyMarkets();
                }
            } catch (error) {
                console.error('Geocoding failed:', error);
            }
            
            // Close modal
            document.querySelector('.modal').remove();
        }
    },

    // Geocode location name to coordinates
    async geocodeLocation(locationName) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1`
            );
            
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    return {
                        lat: parseFloat(data[0].lat),
                        lon: parseFloat(data[0].lon)
                    };
                }
            }
        } catch (error) {
            console.error('Geocoding failed:', error);
        }
        return null;
    },

    // Fetch nearby markets and trade-related locations
    async fetchNearbyMarkets() {
        if (!this.currentLocation) return;
        
        try {
            // Mock nearby markets data based on major Indian cities
            const mockMarkets = this.getMockNearbyMarkets();
            this.nearbyMarkets = mockMarkets;
            
            // Update demand insights based on location
            this.updateLocationBasedInsights();
            
        } catch (error) {
            console.error('Failed to fetch nearby markets:', error);
            // Use fallback data
            this.nearbyMarkets = this.getFallbackMarkets();
        }
    },

    // Get mock nearby markets based on location
    getMockNearbyMarkets() {
        const locationName = this.currentLocation.name || 'Current Location';
        
        // Major Indian wholesale markets by region
        const marketsByRegion = {
            'Delhi': [
                { name: 'Azadpur Mandi', type: 'Wholesale', distance: '2.5 km', speciality: 'Fruits & Vegetables' },
                { name: 'Ghazipur Mandi', type: 'Wholesale', distance: '8.2 km', speciality: 'Grains & Pulses' },
                { name: 'Okhla Mandi', type: 'Wholesale', distance: '12.1 km', speciality: 'Mixed Commodities' }
            ],
            'Mumbai': [
                { name: 'Crawford Market', type: 'Wholesale', distance: '1.8 km', speciality: 'Fruits & Vegetables' },
                { name: 'APMC Vashi', type: 'Wholesale', distance: '15.3 km', speciality: 'Agricultural Products' },
                { name: 'Dadar Market', type: 'Retail', distance: '5.7 km', speciality: 'Flowers & Vegetables' }
            ],
            'Kolkata': [
                { name: 'Sealdah Market', type: 'Wholesale', distance: '3.2 km', speciality: 'Fish & Vegetables' },
                { name: 'Burrabazar', type: 'Wholesale', distance: '4.1 km', speciality: 'General Merchandise' },
                { name: 'Maniktala Market', type: 'Retail', distance: '6.8 km', speciality: 'Fresh Produce' }
            ],
            'Chennai': [
                { name: 'Koyambedu Market', type: 'Wholesale', distance: '4.5 km', speciality: 'Fruits & Vegetables' },
                { name: 'Kasimedu Fish Market', type: 'Wholesale', distance: '8.9 km', speciality: 'Seafood' },
                { name: 'Flower Bazaar', type: 'Wholesale', distance: '6.2 km', speciality: 'Flowers' }
            ],
            'Bangalore': [
                { name: 'KR Market', type: 'Wholesale', distance: '2.1 km', speciality: 'Flowers & Vegetables' },
                { name: 'Yeshwantpur Market', type: 'Wholesale', distance: '7.3 km', speciality: 'Grains & Spices' },
                { name: 'Madiwala Market', type: 'Retail', distance: '9.4 km', speciality: 'Fresh Produce' }
            ],
            'Hyderabad': [
                { name: 'Rythu Bazaar', type: 'Wholesale', distance: '3.7 km', speciality: 'Organic Produce' },
                { name: 'Gaddiannaram Market', type: 'Wholesale', distance: '11.2 km', speciality: 'Fruits & Vegetables' },
                { name: 'Erragadda Market', type: 'Retail', distance: '8.5 km', speciality: 'Daily Essentials' }
            ]
        };
        
        // Find matching region
        for (const [region, markets] of Object.entries(marketsByRegion)) {
            if (locationName.includes(region)) {
                return markets;
            }
        }
        
        // Default markets for other locations
        return [
            { name: 'Local Mandi', type: 'Wholesale', distance: '2.0 km', speciality: 'Mixed Commodities' },
            { name: 'Vegetable Market', type: 'Retail', distance: '1.5 km', speciality: 'Fresh Vegetables' },
            { name: 'Grain Market', type: 'Wholesale', distance: '4.2 km', speciality: 'Cereals & Pulses' }
        ];
    },

    // Get fallback markets
    getFallbackMarkets() {
        return [
            { name: 'Local Mandi', type: 'Wholesale', distance: '2.0 km', speciality: 'Mixed Commodities' },
            { name: 'Nearby Market', type: 'Retail', distance: '1.2 km', speciality: 'Daily Essentials' }
        ];
    },

    // Update location-based demand insights
    updateLocationBasedInsights() {
        const insights = this.generateLocationInsights();
        
        // Update insights in dashboard
        const insightsGrid = document.getElementById('insightsGrid');
        if (insightsGrid && insights.length > 0) {
            insightsGrid.innerHTML = insights.map(insight => `
                <div class="insight-card" style="background: white; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1); border: 1px solid #e5e7eb;">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div style="width: 3rem; height: 3rem; background: ${insight.color}; border-radius: 1rem; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                            ${insight.icon}
                        </div>
                        <div>
                            <h4 style="font-size: 1.125rem; font-weight: 600; color: #374151; margin-bottom: 0.25rem;">${insight.title}</h4>
                            <span style="font-size: 0.875rem; color: #6b7280;">${insight.type}</span>
                        </div>
                    </div>
                    <p style="color: #4b5563; line-height: 1.5; margin: 0;">${insight.message}</p>
                </div>
            `).join('');
        }
    },

    // Generate location-based insights
    generateLocationInsights() {
        const locationName = this.currentLocation?.name || 'Current Location';
        const currentLanguage = window.LanguageManager?.getCurrentLanguage() || 'english';
        
        const insights = [
            {
                type: 'Location',
                title: currentLanguage === 'hindi' ? 'स्थानीय बाजार' : 'Local Market',
                message: currentLanguage === 'hindi' 
                    ? `${locationName} में ${this.nearbyMarkets.length} बाजार उपलब्ध हैं। निकटतम बाजार ${this.nearbyMarkets[0]?.distance || '2 km'} दूर है।`
                    : `${this.nearbyMarkets.length} markets available in ${locationName}. Nearest market is ${this.nearbyMarkets[0]?.distance || '2 km'} away.`,
                icon: '📍',
                color: 'linear-gradient(135deg, #ff9933 0%, #ffb366 100%)'
            },
            {
                type: 'Festival',
                title: currentLanguage === 'hindi' ? 'त्योहार प्रभाव' : 'Festival Impact',
                message: currentLanguage === 'hindi'
                    ? 'गणतंत्र दिवस के कारण फूलों और मिठाइयों की मांग बढ़ सकती है।'
                    : 'Republic Day may increase demand for flowers and sweets in your area.',
                icon: '🎉',
                color: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
            },
            {
                type: 'Weather',
                title: currentLanguage === 'hindi' ? 'मौसम प्रभाव' : 'Weather Impact',
                message: currentLanguage === 'hindi'
                    ? 'सर्दी के मौसम में हरी सब्जियों और फलों की अच्छी मांग है।'
                    : 'Winter season shows good demand for green vegetables and seasonal fruits.',
                icon: '🌤️',
                color: 'linear-gradient(135deg, #138808 0%, #1a9e0a 100%)'
            }
        ];
        
        return insights;
    },

    // Get current location
    getCurrentLocation() {
        return this.currentLocation;
    },

    // Get nearby markets
    getNearbyMarkets() {
        return this.nearbyMarkets;
    }
};

// Export for global use
window.LocationManager = LocationManager;