// Data Fetching for Viksit Vaani – SwarVyapaar
// Handles real market data fetching and mock data generation

const DataFetcher = {
    // Mock market data with realistic Indian prices
    mockPriceData: {
        potato: { min: 15, fair: 20, max: 25, trend: 'stable', unit: 'kg' },
        onion: { min: 25, fair: 35, max: 45, trend: 'rising', unit: 'kg' },
        tomato: { min: 20, fair: 30, max: 40, trend: 'falling', unit: 'kg' },
        rice: { min: 45, fair: 55, max: 65, trend: 'stable', unit: 'kg' },
        wheat: { min: 25, fair: 30, max: 35, trend: 'stable', unit: 'kg' },
        apple: { min: 80, fair: 100, max: 120, trend: 'rising', unit: 'kg' },
        banana: { min: 30, fair: 40, max: 50, trend: 'stable', unit: 'kg' },
        carrot: { min: 25, fair: 35, max: 45, trend: 'stable', unit: 'kg' },
        cabbage: { min: 15, fair: 20, max: 25, trend: 'falling', unit: 'kg' },
        cauliflower: { min: 20, fair: 30, max: 40, trend: 'stable', unit: 'kg' },
        spinach: { min: 15, fair: 20, max: 25, trend: 'stable', unit: 'kg' },
        okra: { min: 30, fair: 40, max: 50, trend: 'rising', unit: 'kg' },
        eggplant: { min: 25, fair: 35, max: 45, trend: 'stable', unit: 'kg' },
        cucumber: { min: 20, fair: 25, max: 30, trend: 'stable', unit: 'kg' },
        lemon: { min: 40, fair: 60, max: 80, trend: 'rising', unit: 'kg' }
    },

    // Initialize data fetcher
    init() {
        this.loadHistoricalData();
        this.setupDataRefresh();
    },

    // Get price data for a product
    async getPriceData(product) {
        try {
            // First try to get real data
            const realData = await this.fetchRealPriceData(product);
            if (realData) {
                return realData;
            }
            
            // Fallback to mock data
            return this.getMockPriceData(product);
        } catch (error) {
            console.error('Failed to fetch price data:', error);
            return this.getMockPriceData(product);
        }
    },

    // Fetch real price data (mock implementation)
    async fetchRealPriceData(product) {
        // In a real implementation, this would call actual APIs like:
        // - Agmarknet API
        // - eNAM (National Agriculture Market) API
        // - State government agriculture APIs
        
        // For demo purposes, we'll simulate API calls with random variations
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        
        const baseData = this.mockPriceData[product.toLowerCase()];
        if (!baseData) return null;
        
        // Add realistic variations based on location and time
        const variation = this.getLocationPriceVariation();
        const timeVariation = this.getTimeBasedVariation();
        
        return {
            min: Math.round(baseData.min * (1 + variation - 0.1)),
            fair: Math.round(baseData.fair * (1 + variation)),
            max: Math.round(baseData.max * (1 + variation + 0.1)),
            trend: this.calculateTrend(baseData.trend, timeVariation),
            unit: baseData.unit,
            lastUpdated: new Date().toISOString(),
            source: 'Market Data API',
            location: window.LocationManager?.getCurrentLocation()?.name || 'Local Market'
        };
    },

    // Get mock price data
    getMockPriceData(product) {
        const data = this.mockPriceData[product.toLowerCase()];
        if (!data) {
            // Return default data for unknown products
            return {
                min: 20,
                fair: 30,
                max: 40,
                trend: 'stable',
                unit: 'kg',
                lastUpdated: new Date().toISOString(),
                source: 'Estimated',
                location: 'Local Market'
            };
        }
        
        return {
            ...data,
            lastUpdated: new Date().toISOString(),
            source: 'Market Data',
            location: window.LocationManager?.getCurrentLocation()?.name || 'Local Market'
        };
    },

    // Get location-based price variation
    getLocationPriceVariation() {
        const location = window.LocationManager?.getCurrentLocation();
        if (!location) return 0;
        
        // Different cities have different price levels
        const locationMultipliers = {
            'Mumbai': 0.15,
            'Delhi': 0.10,
            'Bangalore': 0.12,
            'Chennai': 0.08,
            'Kolkata': 0.05,
            'Hyderabad': 0.07,
            'Pune': 0.10
        };
        
        const locationName = location.name || '';
        for (const [city, multiplier] of Object.entries(locationMultipliers)) {
            if (locationName.includes(city)) {
                return multiplier;
            }
        }
        
        return Math.random() * 0.1 - 0.05; // Random variation for other locations
    },

    // Get time-based price variation
    getTimeBasedVariation() {
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay();
        
        // Early morning prices are usually lower
        if (hour >= 5 && hour <= 8) {
            return -0.05;
        }
        
        // Evening prices might be higher
        if (hour >= 17 && hour <= 20) {
            return 0.03;
        }
        
        // Weekend prices might vary
        if (day === 0 || day === 6) {
            return Math.random() * 0.08 - 0.04;
        }
        
        return 0;
    },

    // Calculate trend based on various factors
    calculateTrend(baseTrend, timeVariation) {
        const trends = ['rising', 'falling', 'stable'];
        
        // Factor in time variation
        if (timeVariation > 0.02) return 'rising';
        if (timeVariation < -0.02) return 'falling';
        
        // Factor in seasonal trends (simplified)
        const month = new Date().getMonth();
        const seasonalTrends = {
            0: 'stable',  // January
            1: 'rising',  // February (Republic Day effect)
            2: 'stable',  // March
            3: 'rising',  // April
            4: 'falling', // May
            5: 'stable',  // June
            6: 'rising',  // July (monsoon)
            7: 'rising',  // August
            8: 'falling', // September
            9: 'stable',  // October
            10: 'rising', // November (festival season)
            11: 'stable'  // December
        };
        
        return seasonalTrends[month] || baseTrend;
    },

    // Get market insights based on current data
    getMarketInsights() {
        const insights = [];
        const currentLanguage = window.LanguageManager?.getCurrentLanguage() || 'english';
        
        // Republic Day specific insights
        insights.push({
            type: 'festival',
            title: currentLanguage === 'hindi' ? 'गणतंत्र दिवस प्रभाव' : 'Republic Day Impact',
            message: currentLanguage === 'hindi' 
                ? 'गणतंत्र दिवस के कारण फूलों और मिठाइयों की मांग बढ़ सकती है।'
                : 'Republic Day celebrations may increase demand for flowers and sweets.',
            icon: '🇮🇳',
            color: 'linear-gradient(135deg, #ff9933 0%, #ffb366 100%)',
            priority: 'high'
        });
        
        // Weather-based insights
        const season = this.getCurrentSeason();
        if (season === 'winter') {
            insights.push({
                type: 'weather',
                title: currentLanguage === 'hindi' ? 'सर्दी का प्रभाव' : 'Winter Season Impact',
                message: currentLanguage === 'hindi'
                    ? 'सर्दी में हरी सब्जियों और फलों की अच्छी मांग है।'
                    : 'Winter season shows good demand for green vegetables and seasonal fruits.',
                icon: '❄️',
                color: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                priority: 'medium'
            });
        }
        
        // Price trend insights
        const trendingUp = Object.entries(this.mockPriceData)
            .filter(([_, data]) => data.trend === 'rising')
            .map(([product, _]) => product);
        
        if (trendingUp.length > 0) {
            insights.push({
                type: 'trend',
                title: currentLanguage === 'hindi' ? 'बढ़ते भाव' : 'Rising Prices',
                message: currentLanguage === 'hindi'
                    ? `${trendingUp.slice(0, 3).join(', ')} के भाव बढ़ रहे हैं।`
                    : `Prices are rising for ${trendingUp.slice(0, 3).join(', ')}.`,
                icon: '📈',
                color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                priority: 'medium'
            });
        }
        
        return insights.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    },

    // Get current season
    getCurrentSeason() {
        const month = new Date().getMonth();
        if (month >= 11 || month <= 2) return 'winter';
        if (month >= 3 && month <= 5) return 'summer';
        if (month >= 6 && month <= 8) return 'monsoon';
        return 'post-monsoon';
    },

    // Get transaction history (mock data)
    getTransactionHistory() {
        const currentLanguage = window.LanguageManager?.getCurrentLanguage() || 'english';
        
        const mockTransactions = [
            {
                id: 'TXN001',
                product: 'Potato',
                quantity: '50 kg',
                price: '₹1,000',
                buyer: 'Raj Vegetables',
                date: '2026-01-26',
                status: 'completed',
                paymentMethod: 'UPI'
            },
            {
                id: 'TXN002',
                product: 'Onion',
                quantity: '30 kg',
                price: '₹1,050',
                buyer: 'Fresh Mart',
                date: '2026-01-25',
                status: 'completed',
                paymentMethod: 'Cash'
            },
            {
                id: 'TXN003',
                product: 'Tomato',
                quantity: '25 kg',
                price: '₹750',
                buyer: 'Local Restaurant',
                date: '2026-01-25',
                status: 'pending',
                paymentMethod: 'Bank Transfer'
            },
            {
                id: 'TXN004',
                product: 'Rice',
                quantity: '100 kg',
                price: '₹5,500',
                buyer: 'Wholesale Dealer',
                date: '2026-01-24',
                status: 'completed',
                paymentMethod: 'UPI'
            },
            {
                id: 'TXN005',
                product: 'Apple',
                quantity: '20 kg',
                price: '₹2,000',
                buyer: 'Fruit Corner',
                date: '2026-01-24',
                status: 'completed',
                paymentMethod: 'Cash'
            }
        ];
        
        return mockTransactions;
    },

    // Generate digital receipt
    generateDigitalReceipt(transactionId) {
        const transactions = this.getTransactionHistory();
        const transaction = transactions.find(t => t.id === transactionId);
        
        if (!transaction) return null;
        
        const currentLanguage = window.LanguageManager?.getCurrentLanguage() || 'english';
        const location = window.LocationManager?.getCurrentLocation()?.name || 'Local Market';
        
        return {
            receiptId: `RCP-${transaction.id}`,
            transactionId: transaction.id,
            date: new Date(transaction.date).toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            vendor: 'Viksit Vaani Vendor',
            buyer: transaction.buyer,
            location: location,
            items: [{
                product: transaction.product,
                quantity: transaction.quantity,
                unitPrice: `₹${Math.round(parseInt(transaction.price.replace(/[₹,]/g, '')) / parseInt(transaction.quantity))}`,
                totalPrice: transaction.price
            }],
            subtotal: transaction.price,
            tax: '₹0', // Assuming no tax for simplicity
            total: transaction.price,
            paymentMethod: transaction.paymentMethod,
            status: transaction.status,
            qrCode: `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="white"/><text x="50" y="50" text-anchor="middle" dy=".3em" font-family="monospace" font-size="8">${transaction.id}</text></svg>`)}`
        };
    },

    // Load historical data from localStorage
    loadHistoricalData() {
        const saved = localStorage.getItem('swar-vyapaar-historical-data');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                // Merge with current data
                this.mockPriceData = { ...this.mockPriceData, ...data };
            } catch (error) {
                console.error('Failed to load historical data:', error);
            }
        }
    },

    // Setup periodic data refresh
    setupDataRefresh() {
        // Refresh data every 5 minutes
        setInterval(() => {
            this.refreshPriceData();
        }, 5 * 60 * 1000);
        
        // Initial refresh
        this.refreshPriceData();
    },

    // Refresh price data with small variations
    refreshPriceData() {
        Object.keys(this.mockPriceData).forEach(product => {
            const data = this.mockPriceData[product];
            const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
            
            data.min = Math.max(1, Math.round(data.min * (1 + variation)));
            data.fair = Math.max(1, Math.round(data.fair * (1 + variation)));
            data.max = Math.max(1, Math.round(data.max * (1 + variation)));
        });
        
        // Save updated data
        localStorage.setItem('swar-vyapaar-historical-data', JSON.stringify(this.mockPriceData));
        
        // Trigger update event
        window.dispatchEvent(new CustomEvent('priceDataUpdated', {
            detail: { timestamp: new Date().toISOString() }
        }));
    },

    // Get product suggestions based on input
    getProductSuggestions(input) {
        const products = Object.keys(this.mockPriceData);
        const lowerInput = input.toLowerCase();
        
        return products.filter(product => 
            product.toLowerCase().includes(lowerInput)
        ).slice(0, 5);
    },

    // Get market statistics
    getMarketStatistics() {
        const products = Object.values(this.mockPriceData);
        const totalProducts = products.length;
        const avgPrice = products.reduce((sum, p) => sum + p.fair, 0) / totalProducts;
        const risingCount = products.filter(p => p.trend === 'rising').length;
        const fallingCount = products.filter(p => p.trend === 'falling').length;
        
        return {
            totalProducts,
            averagePrice: Math.round(avgPrice),
            risingPrices: risingCount,
            fallingPrices: fallingCount,
            stablePrices: totalProducts - risingCount - fallingCount,
            lastUpdated: new Date().toISOString()
        };
    }
};

// Export for global use
window.DataFetcher = DataFetcher;