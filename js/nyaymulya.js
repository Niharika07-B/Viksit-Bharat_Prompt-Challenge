// NyayMulya Engine - Voice-First Price Discovery Platform
// Clean, minimal, and focused on fairness-based pricing

class NyayMulyaEngine {
    constructor() {
        this.userRole = null;
        this.currentLanguage = 'english';
        this.isListening = false;
        this.recognition = null;
        this.currentLocation = 'Delhi';
        
        // Mock product database with fair pricing
        this.productDatabase = {
            'tomato': {
                name: 'Tomato',
                basePrice: 26,
                priceRange: { min: 24, max: 28 },
                quality: 'medium',
                demand: 'high',
                supply: 'medium',
                trend: 'rising',
                factors: ['Azadpur Mandi trend', 'Seasonal supply', 'Medium quality produce', 'Local evening demand']
            },
            'onion': {
                name: 'Onion',
                basePrice: 32,
                priceRange: { min: 30, max: 35 },
                quality: 'good',
                demand: 'very-high',
                supply: 'low',
                trend: 'rising',
                factors: ['Export demand', 'Storage shortage', 'Good quality produce', 'Festival season']
            },
            'potato': {
                name: 'Potato',
                basePrice: 22,
                priceRange: { min: 20, max: 25 },
                quality: 'good',
                demand: 'medium',
                supply: 'high',
                trend: 'stable',
                factors: ['Harvest season', 'Good storage', 'Consistent quality', 'Steady demand']
            }
        };
        
        // Location-based price variations
        this.locationMultipliers = {
            'delhi': 1.0,
            'mumbai': 1.2,
            'bangalore': 1.1,
            'chennai': 1.05,
            'hyderabad': 0.95,
            'kolkata': 0.9,
            'chandragiri': 0.85,
            'tirupati': 0.9,
            'chittoor': 0.8
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupSpeechRecognition();
        this.detectLocation();
    }
    
    setupEventListeners() {
        // Role selection
        document.querySelectorAll('.role-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectRole(e.currentTarget.dataset.role);
            });
        });
        
        // Voice button
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => {
                this.toggleVoiceRecognition();
            });
        }
        
        // Action buttons
        const generateReceiptBtn = document.getElementById('generateReceipt');
        if (generateReceiptBtn) {
            generateReceiptBtn.addEventListener('click', () => {
                this.generateReceipt();
            });
        }
        
        const compareLocationsBtn = document.getElementById('compareLocations');
        if (compareLocationsBtn) {
            compareLocationsBtn.addEventListener('click', () => {
                this.showLocationComparison();
            });
        }
        
        const speakAgainBtn = document.getElementById('speakAgain');
        if (speakAgainBtn) {
            speakAgainBtn.addEventListener('click', () => {
                this.resetVoiceInterface();
            });
        }
        
        // Modal controls
        const modalClose = document.getElementById('modalClose');
        const modalOverlay = document.getElementById('modalOverlay');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        // Language selector
        const languageSelector = document.getElementById('languageSelector');
        if (languageSelector) {
            languageSelector.addEventListener('change', (e) => {
                this.currentLanguage = e.target.value;
            });
        }
    }
    
    setupSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = this.getLanguageCode(this.currentLanguage);
            
            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateVoiceUI('listening');
            };
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.processVoiceInput(transcript);
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.updateVoiceUI('error');
            };
            
            this.recognition.onend = () => {
                this.isListening = false;
                this.updateVoiceUI('idle');
            };
        }
    }
    
    getLanguageCode(language) {
        const languageCodes = {
            'english': 'en-IN',
            'hindi': 'hi-IN',
            'telugu': 'te-IN',
            'tamil': 'ta-IN',
            'kannada': 'kn-IN',
            'malayalam': 'ml-IN',
            'marathi': 'mr-IN',
            'odia': 'or-IN',
            'tulu': 'en-IN' // Fallback to English for Tulu
        };
        return languageCodes[language] || 'en-IN';
    }
    
    detectLocation() {
        // Mock location detection
        const locations = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Chandragiri'];
        this.currentLocation = locations[Math.floor(Math.random() * locations.length)];
        
        const locationIndicator = document.getElementById('locationIndicator');
        if (locationIndicator) {
            locationIndicator.querySelector('.location-text').textContent = this.currentLocation;
        }
    }
    
    selectRole(role) {
        this.userRole = role;
        
        // Hide login screen and show platform
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('platform').style.display = 'block';
        
        // Store role in localStorage
        localStorage.setItem('nyaymulya-role', role);
    }
    
    toggleVoiceRecognition() {
        if (!this.recognition) {
            alert('Speech recognition not supported in this browser');
            return;
        }
        
        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.lang = this.getLanguageCode(this.currentLanguage);
            this.recognition.start();
        }
    }
    
    updateVoiceUI(state) {
        const voiceBtn = document.getElementById('voiceBtn');
        const voiceStatus = document.getElementById('voiceStatus');
        
        if (!voiceBtn || !voiceStatus) return;
        
        switch (state) {
            case 'listening':
                voiceBtn.classList.add('listening');
                voiceStatus.textContent = 'Listening...';
                break;
            case 'processing':
                voiceBtn.classList.remove('listening');
                voiceStatus.textContent = 'Processing...';
                break;
            case 'error':
                voiceBtn.classList.remove('listening');
                voiceStatus.textContent = 'Error - Try again';
                break;
            default:
                voiceBtn.classList.remove('listening');
                voiceStatus.textContent = 'Tap to speak';
        }
    }
    
    processVoiceInput(transcript) {
        console.log('Voice input:', transcript);
        
        // Show transcript
        const transcriptElement = document.getElementById('transcript');
        const transcriptText = document.getElementById('transcriptText');
        if (transcriptElement && transcriptText) {
            transcriptText.textContent = `"${transcript}"`;
            transcriptElement.style.display = 'block';
        }
        
        this.updateVoiceUI('processing');
        
        // Simulate processing delay
        setTimeout(() => {
            const analysis = this.analyzeVoiceInput(transcript);
            this.showPriceResults(analysis);
        }, 1500);
    }
    
    analyzeVoiceInput(transcript) {
        const lowerTranscript = transcript.toLowerCase();
        
        // Extract product
        let product = null;
        const productKeywords = {
            'tomato': ['tomato', 'टमाटर', 'టమాట', 'தக்காளி'],
            'onion': ['onion', 'प्याज', 'ఉల్లిపాయ', 'வெங்காயம்'],
            'potato': ['potato', 'आलू', 'బంగాళాదుంప', 'உருளைக்கிழங்கு']
        };
        
        for (const [key, keywords] of Object.entries(productKeywords)) {
            if (keywords.some(keyword => lowerTranscript.includes(keyword))) {
                product = key;
                break;
            }
        }
        
        // Extract quantity
        const quantityMatch = lowerTranscript.match(/(\d+)\s*(kg|kilo|किलो)/i);
        const quantity = quantityMatch ? `${quantityMatch[1]} kg` : '1 kg';
        
        // Extract location
        const locationKeywords = {
            'chandragiri': ['chandragiri', 'చంద్రగిరి'],
            'delhi': ['delhi', 'दिल्ली'],
            'mumbai': ['mumbai', 'मुंबई'],
            'bangalore': ['bangalore', 'bengaluru', 'बैंगलोर']
        };
        
        let location = this.currentLocation.toLowerCase();
        for (const [key, keywords] of Object.entries(locationKeywords)) {
            if (keywords.some(keyword => lowerTranscript.includes(keyword))) {
                location = key;
                break;
            }
        }
        
        return {
            product: product || 'tomato', // Default to tomato
            quantity: quantity,
            location: location,
            originalText: transcript
        };
    }
    
    showPriceResults(analysis) {
        const productData = this.productDatabase[analysis.product];
        if (!productData) return;
        
        // Calculate location-adjusted prices
        const locationMultiplier = this.locationMultipliers[analysis.location] || 1.0;
        const adjustedMin = Math.round(productData.priceRange.min * locationMultiplier);
        const adjustedMax = Math.round(productData.priceRange.max * locationMultiplier);
        
        // Update product header
        document.getElementById('productName').textContent = productData.name;
        document.getElementById('quantity').textContent = analysis.quantity;
        document.getElementById('location').textContent = this.formatLocation(analysis.location);
        
        // Update trust meter
        this.updateTrustMeter(productData.demand);
        
        // Update price band
        document.querySelector('.price-value').textContent = `₹${adjustedMin} – ₹${adjustedMax}`;
        
        // Update role-specific guidance
        this.updateRoleGuidance(adjustedMin, adjustedMax, productData);
        
        // Update compass
        this.updatePriceCompass(productData.trend);
        
        // Update explanation
        this.updatePriceExplanation(productData.factors);
        
        // Show results
        document.getElementById('priceResults').style.display = 'block';
        
        // Hide transcript after showing results
        setTimeout(() => {
            document.getElementById('transcript').style.display = 'none';
        }, 3000);
    }
    
    updateTrustMeter(demand) {
        const trustIndicator = document.getElementById('trustIndicator');
        const trustLevel = trustIndicator.querySelector('.trust-level');
        
        // Determine trust level based on demand
        let level, label, description;
        if (demand === 'very-high' || demand === 'high') {
            level = 'high';
            label = 'High Trust';
            description = 'Local mandi + nearby vendors agree';
        } else if (demand === 'medium') {
            level = 'medium';
            label = 'Medium Trust';
            description = 'Moderate variation in prices';
        } else {
            level = 'low';
            label = 'Low Trust';
            description = 'Prices fluctuating today';
        }
        
        trustLevel.className = `trust-level ${level}`;
        trustLevel.querySelector('.trust-label').textContent = label;
        trustLevel.querySelector('.trust-desc').textContent = description;
    }
    
    updateRoleGuidance(minPrice, maxPrice, productData) {
        const roleGuidance = document.getElementById('roleGuidance');
        const midPrice = Math.round((minPrice + maxPrice) / 2);
        
        let guidanceHTML = '';
        
        if (this.userRole === 'vendor') {
            guidanceHTML = `
                <h4 class="guidance-title">Vendor Guidance</h4>
                <div class="guidance-item safe">
                    <span class="guidance-icon">✅</span>
                    <p class="guidance-text">Safe selling range: ₹${minPrice} - ₹${maxPrice} per kg</p>
                </div>
                <div class="guidance-item warning">
                    <span class="guidance-icon">⚠️</span>
                    <p class="guidance-text">Below ₹${minPrice - 2}/kg = Loss Zone</p>
                </div>
                <div class="guidance-item safe">
                    <span class="guidance-icon">💰</span>
                    <p class="guidance-text">Profit-safe zone: ₹${midPrice}+ per kg</p>
                </div>
            `;
        } else {
            guidanceHTML = `
                <h4 class="guidance-title">Buyer Guidance</h4>
                <div class="guidance-item safe">
                    <span class="guidance-icon">✅</span>
                    <p class="guidance-text">Fair buying range: ₹${minPrice} - ₹${maxPrice} per kg</p>
                </div>
                <div class="guidance-item warning">
                    <span class="guidance-icon">⚠️</span>
                    <p class="guidance-text">Above ₹${maxPrice + 2}/kg = Overpriced</p>
                </div>
                <div class="guidance-item safe">
                    <span class="guidance-icon">💡</span>
                    <p class="guidance-text">Best value: Around ₹${midPrice} per kg</p>
                </div>
            `;
        }
        
        roleGuidance.innerHTML = guidanceHTML;
    }
    
    updatePriceCompass(trend) {
        const needle = document.querySelector('.compass-needle');
        const reading = document.querySelector('.compass-reading strong');
        
        let rotation, direction;
        switch (trend) {
            case 'rising':
                rotation = 45; // Northeast
                direction = 'Rising Demand';
                break;
            case 'falling':
                rotation = 225; // Southwest
                direction = 'High Supply';
                break;
            case 'stable':
                rotation = 90; // East
                direction = 'Stable Market';
                break;
            default:
                rotation = 0; // North
                direction = 'High Demand';
        }
        
        needle.style.transform = `translate(-50%, -100%) rotate(${rotation}deg)`;
        reading.textContent = direction;
    }
    
    updatePriceExplanation(factors) {
        const factorsList = document.querySelector('.influence-factors');
        const icons = ['🏪', '🌱', '⭐', '🌅', '📈', '🚛', '🌧️', '🎉'];
        
        factorsList.innerHTML = factors.map((factor, index) => `
            <li>
                <span class="factor-icon">${icons[index % icons.length]}</span>
                ${factor}
            </li>
        `).join('');
    }
    
    formatLocation(location) {
        const locationNames = {
            'delhi': 'Delhi, India',
            'mumbai': 'Mumbai, MH',
            'bangalore': 'Bangalore, KA',
            'chennai': 'Chennai, TN',
            'hyderabad': 'Hyderabad, TS',
            'kolkata': 'Kolkata, WB',
            'chandragiri': 'Chandragiri, AP',
            'tirupati': 'Tirupati, AP',
            'chittoor': 'Chittoor, AP'
        };
        return locationNames[location] || location;
    }
    
    showLocationComparison() {
        const locationComparison = document.getElementById('locationComparison');
        locationComparison.style.display = 'block';
        
        // Scroll to comparison
        locationComparison.scrollIntoView({ behavior: 'smooth' });
    }
    
    resetVoiceInterface() {
        document.getElementById('priceResults').style.display = 'none';
        document.getElementById('locationComparison').style.display = 'none';
        document.getElementById('transcript').style.display = 'none';
        this.updateVoiceUI('idle');
    }
    
    generateReceipt() {
        const receiptContent = document.getElementById('receiptContent');
        const productName = document.getElementById('productName').textContent;
        const quantity = document.getElementById('quantity').textContent;
        const location = document.getElementById('location').textContent;
        const priceRange = document.querySelector('.price-value').textContent;
        
        const receiptHTML = `
            <div class="receipt-header" style="text-align: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 2px solid var(--saffron);">
                <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <span style="font-size: 1.5rem;">🇮🇳</span>
                    <h3 style="margin: 0; color: var(--saffron);">NyayMulya Receipt</h3>
                </div>
                <p style="margin: 0; color: var(--gray-600); font-size: 0.875rem;">Fair Price Discovery Engine</p>
            </div>
            
            <div class="receipt-details" style="margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="color: var(--gray-600);">Product:</span>
                    <span style="font-weight: 600;">${productName}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="color: var(--gray-600);">Quantity:</span>
                    <span style="font-weight: 600;">${quantity}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="color: var(--gray-600);">Location:</span>
                    <span style="font-weight: 600;">${location}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="color: var(--gray-600);">Fair Price Band:</span>
                    <span style="font-weight: 600; color: var(--saffron);">${priceRange} per kg</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="color: var(--gray-600);">Role:</span>
                    <span style="font-weight: 600; text-transform: capitalize;">${this.userRole}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--gray-600);">Date:</span>
                    <span style="font-weight: 600;">${new Date().toLocaleDateString()}</span>
                </div>
            </div>
            
            <div class="receipt-footer" style="text-align: center; padding-top: 1rem; border-top: 1px solid var(--gray-200);">
                <p style="margin: 0; color: var(--gray-600); font-size: 0.875rem;">
                    Empowering Bharat's Trade Through Fair Pricing
                </p>
                <div style="height: 3px; background: linear-gradient(90deg, var(--saffron) 0%, var(--white) 50%, var(--green) 100%); margin-top: 1rem; border-radius: 2px;"></div>
            </div>
        `;
        
        receiptContent.innerHTML = receiptHTML;
        document.getElementById('receiptModal').style.display = 'flex';
    }
    
    closeModal() {
        document.getElementById('receiptModal').style.display = 'none';
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.nyayMulyaEngine = new NyayMulyaEngine();
});

// Export for global access
window.NyayMulyaEngine = NyayMulyaEngine;