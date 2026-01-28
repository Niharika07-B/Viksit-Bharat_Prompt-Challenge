// Voice Management for Viksit Vaani – SwarVyapaar
// Handles speech recognition and synthesis in multiple Indian languages

const VoiceManager = {
    recognition: null,
    synthesis: window.speechSynthesis,
    isListening: false,
    isProcessing: false,
    isVoiceEnabled: true,
    currentTranscript: '',
    
    // Initialize voice services
    init() {
        this.setupSpeechRecognition();
        this.setupVoiceControls();
        this.loadVoiceSettings();
    },

    // Setup speech recognition
    setupSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = true;
            this.recognition.lang = this.getLanguageCode();
            
            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateVoiceUI('listening');
            };
            
            this.recognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }
                
                this.currentTranscript = finalTranscript || interimTranscript;
                this.updateTranscriptDisplay(this.currentTranscript);
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isListening = false;
                this.updateVoiceUI('error');
                this.showError(`Speech recognition error: ${event.error}`);
            };
            
            this.recognition.onend = () => {
                this.isListening = false;
                if (this.currentTranscript.trim()) {
                    this.processVoiceCommand(this.currentTranscript);
                } else {
                    this.updateVoiceUI('idle');
                }
            };
        } else {
            console.warn('Speech recognition not supported');
            this.showError('Speech recognition not supported in this browser');
        }
    },

    // Setup voice control buttons
    setupVoiceControls() {
        const voiceBtn = document.getElementById('voiceBtn');
        const voiceToggle = document.getElementById('voiceToggle');
        const voiceLanguageSelect = document.getElementById('voiceLanguageSelect');
        const clearVoiceResults = document.getElementById('clearVoiceResults');
        
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => {
                this.toggleVoiceRecognition();
            });
        }
        
        if (voiceToggle) {
            voiceToggle.addEventListener('click', () => {
                this.toggleVoiceOutput();
            });
        }
        
        // Handle voice language selection
        if (voiceLanguageSelect) {
            voiceLanguageSelect.addEventListener('change', (e) => {
                const selectedLanguage = e.target.value;
                // Update main language if different
                if (window.LanguageManager && window.LanguageManager.getCurrentLanguage() !== selectedLanguage) {
                    window.LanguageManager.changeLanguage(selectedLanguage);
                }
                this.updateLanguage(selectedLanguage);
            });
            
            // Set initial value
            const currentLang = window.LanguageManager?.getCurrentLanguage() || 'english';
            voiceLanguageSelect.value = currentLang;
        }
        
        // Handle clear results
        if (clearVoiceResults) {
            clearVoiceResults.addEventListener('click', () => {
                this.clearVoiceResults();
            });
        }
    },

    // Load voice settings from localStorage
    loadVoiceSettings() {
        const saved = localStorage.getItem('swar-vyapaar-voice-enabled');
        if (saved !== null) {
            this.isVoiceEnabled = JSON.parse(saved);
            this.updateVoiceToggleUI();
        }
    },

    // Toggle voice recognition
    toggleVoiceRecognition() {
        if (!this.recognition) {
            this.showError('Speech recognition not available');
            return;
        }
        
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    },

    // Start voice recognition
    startListening() {
        if (!this.recognition || this.isListening) return;
        
        try {
            this.currentTranscript = '';
            this.recognition.lang = this.getLanguageCode();
            this.recognition.start();
            this.showTranscriptDisplay();
        } catch (error) {
            console.error('Failed to start voice recognition:', error);
            this.showError('Failed to start voice recognition');
        }
    },

    // Stop voice recognition
    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    },

    // Toggle voice output
    toggleVoiceOutput() {
        this.isVoiceEnabled = !this.isVoiceEnabled;
        localStorage.setItem('swar-vyapaar-voice-enabled', JSON.stringify(this.isVoiceEnabled));
        this.updateVoiceToggleUI();
        
        if (!this.isVoiceEnabled) {
            this.stopSpeaking();
        }
    },

    // Update voice toggle UI
    updateVoiceToggleUI() {
        const voiceToggle = document.getElementById('voiceToggle');
        const voiceStatus = document.querySelector('.voice-status');
        
        if (voiceToggle) {
            const icon = voiceToggle.querySelector('.voice-icon');
            if (icon) {
                icon.textContent = this.isVoiceEnabled ? '🔊' : '🔇';
            }
        }
        
        if (voiceStatus) {
            const lang = window.LanguageManager?.getCurrentLanguage() || 'english';
            voiceStatus.textContent = this.isVoiceEnabled 
                ? (lang === 'hindi' ? 'आवाज चालू है' : 'Voice Enabled')
                : (lang === 'hindi' ? 'आवाज बंद है' : 'Voice Disabled');
        }
    },

    // Update voice UI based on state
    updateVoiceUI(state) {
        const voiceBtn = document.getElementById('voiceBtn');
        const voiceStatus = document.getElementById('voiceStatus');
        const lang = window.LanguageManager?.getCurrentLanguage() || 'english';
        
        if (voiceBtn) {
            voiceBtn.classList.remove('listening');
            
            switch (state) {
                case 'listening':
                    voiceBtn.classList.add('listening');
                    if (voiceStatus) {
                        voiceStatus.textContent = lang === 'hindi' ? 'सुन रहा है...' : 'Listening...';
                    }
                    break;
                case 'processing':
                    if (voiceStatus) {
                        voiceStatus.textContent = lang === 'hindi' ? 'प्रोसेसिंग...' : 'Processing...';
                    }
                    break;
                case 'error':
                    if (voiceStatus) {
                        voiceStatus.textContent = lang === 'hindi' ? 'त्रुटि हुई' : 'Error occurred';
                    }
                    break;
                default:
                    if (voiceStatus) {
                        voiceStatus.textContent = lang === 'hindi' ? 'अब बोलें' : 'Tap to Speak';
                    }
            }
        }
    },

    // Update transcript display
    updateTranscriptDisplay(transcript) {
        const transcriptElement = document.getElementById('transcript');
        const transcriptText = document.getElementById('transcriptText');
        
        if (transcriptElement && transcriptText) {
            transcriptText.textContent = `"${transcript}"`;
            transcriptElement.style.display = 'block';
        }
    },

    // Show transcript display
    showTranscriptDisplay() {
        const transcriptElement = document.getElementById('transcript');
        if (transcriptElement) {
            transcriptElement.style.display = 'block';
        }
    },

    // Hide transcript display
    hideTranscriptDisplay() {
        const transcriptElement = document.getElementById('transcript');
        if (transcriptElement) {
            transcriptElement.style.display = 'none';
        }
    },

    // Process voice command - COMPLETE FLOW IMPLEMENTATION
    async processVoiceCommand(command) {
        this.isProcessing = true;
        this.updateVoiceUI('processing');
        
        try {
            const currentLanguage = window.LanguageManager?.getCurrentLanguage() || 'english';
            
            // Step 1: Display original spoken text
            this.displaySpokenText(command, currentLanguage);
            
            // Step 2: Translate to English if needed
            const translatedText = await this.translateToEnglish(command, currentLanguage);
            this.displayTranslatedText(translatedText);
            
            // Step 3: Analyze command and get price
            const result = await this.analyzeVoiceCommand(translatedText);
            
            if (result.type === 'price_check') {
                await this.handlePriceCheck(result.product, command, translatedText);
            } else if (result.type === 'negotiation') {
                await this.handleNegotiation(result.message);
            } else {
                await this.handleGeneralQuery(command);
            }
            
        } catch (error) {
            console.error('Voice command processing failed:', error);
            this.showError('Failed to process voice command');
        } finally {
            this.isProcessing = false;
            this.updateVoiceUI('idle');
            this.hideTranscriptDisplay();
        }
    },

    // Analyze voice command to determine intent
    async analyzeVoiceCommand(command) {
        const lowerCommand = command.toLowerCase();
        const lang = window.LanguageManager?.getCurrentLanguage() || 'english';
        
        // Product name mapping for different languages
        const productMapping = {
            // English
            'potato': 'potato', 'onion': 'onion', 'tomato': 'tomato', 'rice': 'rice', 'wheat': 'wheat',
            'apple': 'apple', 'banana': 'banana', 'carrot': 'carrot', 'cabbage': 'cabbage',
            
            // Hindi
            'आलू': 'potato', 'प्याज': 'onion', 'टमाटर': 'tomato', 'चावल': 'rice', 'गेहूं': 'wheat',
            'सेब': 'apple', 'केला': 'banana', 'गाजर': 'carrot', 'पत्तागोभी': 'cabbage',
            'aloo': 'potato', 'pyaz': 'onion', 'tamatar': 'tomato', 'chawal': 'rice', 'gehun': 'wheat',
            
            // Telugu
            'బంగాళాదుంప': 'potato', 'ఉల్లిపాయ': 'onion', 'టమాటో': 'tomato', 'బియ్యం': 'rice',
            
            // Tamil
            'உருளைக்கிழங்கு': 'potato', 'வெங்காயம்': 'onion', 'தக்காளி': 'tomato', 'அரிசி': 'rice',
            
            // Kannada
            'ಆಲೂಗಡ್ಡೆ': 'potato', 'ಈರುಳ್ಳಿ': 'onion', 'ಟೊಮೇಟೊ': 'tomato', 'ಅಕ್ಕಿ': 'rice'
        };
        
        // Check for product names
        for (const [keyword, product] of Object.entries(productMapping)) {
            if (lowerCommand.includes(keyword)) {
                return {
                    type: 'price_check',
                    product: product,
                    originalCommand: command
                };
            }
        }
        
        // Check for price-related keywords
        const priceKeywords = ['price', 'rate', 'cost', 'bhav', 'भाव', 'रेट', 'किंमत', 'ధర', 'விலை', 'ಬೆಲೆ'];
        if (priceKeywords.some(keyword => lowerCommand.includes(keyword))) {
            return {
                type: 'price_check',
                product: 'general',
                originalCommand: command
            };
        }
        
        // Default to general query
        return {
            type: 'general',
            message: command
        };
    },

    // Display spoken text in original language
    displaySpokenText(text, language) {
        const spokenSection = this.getOrCreateOutputSection('spoken');
        const languageName = window.LanguageManager?.getNativeName(language) || language;
        
        spokenSection.innerHTML = `
            <div class="voice-output-card spoken-card">
                <div class="output-header">
                    <span class="output-icon">🎙️</span>
                    <h3 class="output-title">Spoken Text (${languageName})</h3>
                </div>
                <div class="output-content">
                    <p class="spoken-text">"${text}"</p>
                </div>
            </div>
        `;
        spokenSection.style.display = 'block';
        
        // Show clear button
        this.showClearButton();
    },

    // Translate text to English (mock implementation with real API structure)
    async translateToEnglish(text, fromLanguage) {
        if (fromLanguage === 'english') {
            return text; // Already in English
        }
        
        try {
            // Mock Google Translate API call
            // In production, replace with: await this.callGoogleTranslateAPI(text, fromLanguage, 'english');
            const translation = await this.mockTranslateAPI(text, fromLanguage, 'english');
            return translation;
        } catch (error) {
            console.error('Translation failed:', error);
            return text; // Fallback to original text
        }
    },

    // Mock Google Translate API (replace with real API in production)
    async mockTranslateAPI(text, fromLang, toLang) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock translation mappings for common phrases
        const translations = {
            hindi: {
                'आलू का भाव क्या है': 'What is the price of potato',
                'प्याज का रेट': 'Onion rate',
                'टमाटर की कीमत': 'Tomato price',
                'चावल का भाव': 'Rice price',
                'गेहूं का रेट': 'Wheat rate'
            },
            telugu: {
                'బంగాళాదుంప రేటు ఎంత': 'What is potato rate',
                'ఉల్లిపాయ ధర': 'Onion price',
                'టమాటో రేటు': 'Tomato rate'
            },
            tamil: {
                'உருளைக்கிழங்கு விலை என்ன': 'What is potato price',
                'வெங்காயம் விலை': 'Onion price',
                'தக்காளி விலை': 'Tomato price'
            },
            kannada: {
                'ಆಲೂಗಡ್ಡೆ ಬೆಲೆ ಎಷ್ಟು': 'What is potato price',
                'ಈರುಳ್ಳಿ ಬೆಲೆ': 'Onion price'
            }
        };
        
        const langTranslations = translations[fromLang];
        if (langTranslations && langTranslations[text]) {
            return langTranslations[text];
        }
        
        // Fallback: Simple word-based translation for product names
        const productTranslations = {
            'आलू': 'potato', 'प्याज': 'onion', 'टमाटर': 'tomato', 'चावल': 'rice',
            'బంగాళాదుంప': 'potato', 'ఉల్లిపాయ': 'onion', 'టమాటో': 'tomato',
            'உருளைக்கிழங்கு': 'potato', 'வெங்காயம்': 'onion', 'தக்காளி': 'tomato',
            'ಆಲೂಗಡ್ಡೆ': 'potato', 'ಈರುಳ್ಳಿ': 'onion'
        };
        
        let translatedText = text;
        Object.entries(productTranslations).forEach(([original, translation]) => {
            translatedText = translatedText.replace(new RegExp(original, 'gi'), translation);
        });
        
        return translatedText;
    },

    // Display translated text
    displayTranslatedText(text) {
        const translatedSection = this.getOrCreateOutputSection('translated');
        
        translatedSection.innerHTML = `
            <div class="voice-output-card translated-card">
                <div class="output-header">
                    <span class="output-icon">🌐</span>
                    <h3 class="output-title">Translated Text (English)</h3>
                </div>
                <div class="output-content">
                    <p class="translated-text">"${text}"</p>
                </div>
            </div>
        `;
        translatedSection.style.display = 'block';
    },

    // Get or create output section
    getOrCreateOutputSection(type) {
        let section = document.getElementById(`voice-output-${type}`);
        if (!section) {
            section = document.createElement('div');
            section.id = `voice-output-${type}`;
            section.className = 'voice-output-section';
            
            // Insert after voice interface
            const voiceInterface = document.querySelector('.voice-interface');
            if (voiceInterface) {
                voiceInterface.parentNode.insertBefore(section, voiceInterface.nextSibling);
            }
        }
        return section;
    },

    // Handle price check command - ENHANCED WITH FULL OUTPUT
    async handlePriceCheck(product, originalText, translatedText) {
        if (product === 'general') {
            const response = this.getGeneralPriceResponse();
            this.speak(response);
            return;
        }
        
        // Get real-time pricing data from RealDataFetcher first
        let priceData;
        if (window.App?.realDataFetcher?.isInitialized) {
            const realPriceData = window.App.realDataFetcher.getRealTimePrice(product);
            if (realPriceData) {
                priceData = {
                    product: realPriceData.product,
                    min: Math.max(1, realPriceData.price - 5),
                    fair: realPriceData.price,
                    max: realPriceData.price + 5,
                    trend: realPriceData.demand === 'very-high' ? 'rising' : 
                           realPriceData.demand === 'low' ? 'falling' : 'stable',
                    location: realPriceData.factors.location,
                    lastUpdated: realPriceData.lastUpdated,
                    factors: realPriceData.factors
                };
            }
        }
        
        // Fallback to location-based pricing
        if (!priceData && window.LocationPricingManager?.instance) {
            priceData = await window.LocationPricingManager.instance.getLocationBasedPricing(product);
        }
        
        // Final fallback to basic price data
        if (!priceData) {
            priceData = await window.DataFetcher?.getPriceData(product);
        }
        
        if (priceData) {
            // Trigger voice price request event for location pricing
            window.dispatchEvent(new CustomEvent('voicePriceRequest', {
                detail: { 
                    product: product, 
                    language: window.LanguageManager?.getCurrentLanguage() || 'english' 
                }
            }));
            
            // Display suggested price section
            this.displaySuggestedPrice(product, priceData, originalText, translatedText);
            
            // Show price results in main section
            this.displayPriceResults(product, priceData);
            
            // Speak price information
            const response = this.formatPriceResponse(product, priceData);
            this.speak(response);
            
            // Save to search history
            this.saveToSearchHistory(product, priceData);
        } else {
            const errorResponse = this.getProductNotFoundResponse(product);
            this.speak(errorResponse);
        }
    },

    // Display suggested price section
    displaySuggestedPrice(product, priceData, originalText, translatedText) {
        const priceSection = this.getOrCreateOutputSection('price');
        const currentLanguage = window.LanguageManager?.getCurrentLanguage() || 'english';
        
        // Format price trend
        const trendIcon = priceData.trend === 'rising' ? '📈' : 
                         priceData.trend === 'falling' ? '📉' : '📊';
        const trendText = priceData.trend === 'rising' 
            ? (currentLanguage === 'hindi' ? 'बढ़ रहा है' : 'Rising')
            : priceData.trend === 'falling'
            ? (currentLanguage === 'hindi' ? 'गिर रहा है' : 'Falling')
            : (currentLanguage === 'hindi' ? 'स्थिर' : 'Stable');
        
        priceSection.innerHTML = `
            <div class="voice-output-card price-card">
                <div class="output-header">
                    <span class="output-icon">💰</span>
                    <h3 class="output-title">Suggested Price</h3>
                    <div class="price-trend ${priceData.trend}">
                        <span class="trend-icon">${trendIcon}</span>
                        <span class="trend-text">${trendText}</span>
                    </div>
                </div>
                <div class="output-content">
                    <div class="product-info">
                        <h4 class="product-name">${product.charAt(0).toUpperCase() + product.slice(1)}</h4>
                        <p class="product-location">${window.LocationManager?.getCurrentLocation()?.name || 'Local Market'}</p>
                    </div>
                    <div class="price-grid-mini">
                        <div class="price-item min">
                            <span class="price-label">Min</span>
                            <span class="price-value">₹${priceData.min}</span>
                        </div>
                        <div class="price-item fair">
                            <span class="price-label">Fair</span>
                            <span class="price-value">₹${priceData.fair}</span>
                        </div>
                        <div class="price-item max">
                            <span class="price-label">Max</span>
                            <span class="price-value">₹${priceData.max}</span>
                        </div>
                    </div>
                    <div class="price-summary">
                        <p><strong>Recommended:</strong> ₹${priceData.fair} per ${priceData.unit}</p>
                        <p class="price-note">Based on current market conditions</p>
                    </div>
                </div>
            </div>
        `;
        priceSection.style.display = 'block';
    },

    // Clear all voice results
    clearVoiceResults() {
        const outputSections = ['spoken', 'translated', 'price'];
        outputSections.forEach(type => {
            const section = document.getElementById(`voice-output-${type}`);
            if (section) {
                section.style.display = 'none';
                section.innerHTML = '';
            }
        });
        
        // Hide price results
        const priceResults = document.getElementById('priceResults');
        if (priceResults) {
            priceResults.style.display = 'none';
        }
        
        // Hide clear button
        const clearBtn = document.getElementById('clearVoiceResults');
        if (clearBtn) {
            clearBtn.style.display = 'none';
        }
        
        // Reset transcript
        this.hideTranscriptDisplay();
    },

    // Show clear results button
    showClearButton() {
        const clearBtn = document.getElementById('clearVoiceResults');
        if (clearBtn) {
            clearBtn.style.display = 'inline-flex';
        }
    },
        if (product === 'general') {
            const response = this.getGeneralPriceResponse();
            this.speak(response);
            return;
        }
        
        // Get price data
        const priceData = await window.DataFetcher?.getPriceData(product);
        
        if (priceData) {
            // Show price results
            this.displayPriceResults(product, priceData);
            
            // Speak price information
            const response = this.formatPriceResponse(product, priceData);
            this.speak(response);
            
            // Save to search history
            this.saveToSearchHistory(product, priceData);
        } else {
            const errorResponse = this.getProductNotFoundResponse(product);
            this.speak(errorResponse);
        }
    },

    // Handle negotiation command
    async handleNegotiation(message) {
        // Switch to negotiation section
        window.NavigationManager?.showSection('negotiation');
        
        // Add message to chat
        if (window.ChatManager) {
            window.ChatManager.addUserMessage(message);
        }
        
        const response = this.getNegotiationResponse();
        this.speak(response);
    },

    // Handle general query
    async handleGeneralQuery(command) {
        const response = this.getGeneralResponse(command);
        this.speak(response);
    },

    // Display price results
    displayPriceResults(product, priceData) {
        const priceResults = document.getElementById('priceResults');
        const priceProduct = document.getElementById('priceProduct');
        const minPriceValue = document.getElementById('minPriceValue');
        const fairPriceValue = document.getElementById('fairPriceValue');
        const maxPriceValue = document.getElementById('maxPriceValue');
        const priceTrend = document.getElementById('priceTrend');
        const priceLocation = document.getElementById('priceLocation');
        
        if (priceResults) {
            priceResults.style.display = 'block';
        }
        
        if (priceProduct) {
            priceProduct.textContent = product.charAt(0).toUpperCase() + product.slice(1);
        }
        
        if (minPriceValue) minPriceValue.textContent = `₹${priceData.min}`;
        if (fairPriceValue) fairPriceValue.textContent = `₹${priceData.fair}`;
        if (maxPriceValue) maxPriceValue.textContent = `₹${priceData.max}`;
        
        if (priceTrend) {
            const trendIcon = priceTrend.querySelector('.trend-icon');
            const trendText = priceTrend.querySelector('.trend-text');
            const lang = window.LanguageManager?.getCurrentLanguage() || 'english';
            
            priceTrend.className = `price-trend ${priceData.trend}`;
            
            if (trendIcon) {
                trendIcon.textContent = priceData.trend === 'rising' ? '📈' : 
                                       priceData.trend === 'falling' ? '📉' : '📊';
            }
            
            if (trendText) {
                trendText.textContent = priceData.trend === 'rising' 
                    ? (lang === 'hindi' ? 'बढ़ रहा है' : 'Rising')
                    : priceData.trend === 'falling'
                    ? (lang === 'hindi' ? 'गिर रहा है' : 'Falling')
                    : (lang === 'hindi' ? 'स्थिर' : 'Stable');
            }
        }
        
        if (priceLocation) {
            const location = window.LocationManager?.getCurrentLocation()?.name || 'Local Mandi';
            const lang = window.LanguageManager?.getCurrentLanguage() || 'english';
            priceLocation.textContent = `${lang === 'hindi' ? 'स्थान:' : 'Location:'} ${location}`;
        }
    },

    // Format price response for speech
    formatPriceResponse(product, priceData) {
        const lang = window.LanguageManager?.getCurrentLanguage() || 'english';
        
        if (lang === 'hindi') {
            return `${product} का भाव आज ₹${priceData.min} से ₹${priceData.max} प्रति किलो है। उचित भाव ₹${priceData.fair} है।`;
        } else {
            return `${product} price today is ₹${priceData.min} to ₹${priceData.max} per kg. Fair price is ₹${priceData.fair}.`;
        }
    },

    // Get general price response
    getGeneralPriceResponse() {
        const lang = window.LanguageManager?.getCurrentLanguage() || 'english';
        
        if (lang === 'hindi') {
            return 'कृपया सामान का नाम स्पष्ट रूप से बोलें। जैसे आलू, प्याज, या टमाटर।';
        } else {
            return 'Please specify the product name clearly. For example, potato, onion, or tomato.';
        }
    },

    // Get product not found response
    getProductNotFoundResponse(product) {
        const lang = window.LanguageManager?.getCurrentLanguage() || 'english';
        
        if (lang === 'hindi') {
            return `माफ करें, ${product} का भाव अभी उपलब्ध नहीं है। कृपया दूसरा सामान बोलें।`;
        } else {
            return `Sorry, price for ${product} is not available right now. Please try another product.`;
        }
    },

    // Get negotiation response
    getNegotiationResponse() {
        const lang = window.LanguageManager?.getCurrentLanguage() || 'english';
        
        if (lang === 'hindi') {
            return 'मैं आपको मोल-भाव में मदद करूंगा। कृपया बताएं कि आप किस सामान का भाव तय करना चाहते हैं।';
        } else {
            return 'I will help you with negotiation. Please tell me which product you want to negotiate for.';
        }
    },

    // Get general response
    getGeneralResponse(command) {
        const lang = window.LanguageManager?.getCurrentLanguage() || 'english';
        
        if (lang === 'hindi') {
            return 'मैं आपकी मदद करने के लिए यहाँ हूँ। आप भाव जांच सकते हैं या मोल-भाव की सलाह ले सकते हैं।';
        } else {
            return 'I am here to help you. You can check prices or get negotiation advice.';
        }
    },

    // Save to search history
    saveToSearchHistory(product, priceData) {
        const historyItem = {
            id: Date.now(),
            product: product,
            price: priceData,
            timestamp: new Date().toISOString(),
            language: window.LanguageManager?.getCurrentLanguage() || 'english'
        };
        
        let history = JSON.parse(localStorage.getItem('swar-vyapaar-search-history') || '[]');
        history.unshift(historyItem);
        history = history.slice(0, 10); // Keep last 10
        
        localStorage.setItem('swar-vyapaar-search-history', JSON.stringify(history));
        
        // Update history display
        this.updateSearchHistoryDisplay(history);
    },

    // Update search history display
    updateSearchHistoryDisplay(history) {
        const historyGrid = document.getElementById('historyGrid');
        if (!historyGrid || history.length === 0) return;
        
        historyGrid.innerHTML = history.slice(0, 6).map(item => `
            <div class="history-item" onclick="VoiceManager.repeatSearch('${item.product}')">
                <div>
                    <div class="history-product">${item.product.charAt(0).toUpperCase() + item.product.slice(1)}</div>
                    <div class="history-price">₹${item.price.fair} per kg</div>
                </div>
                <div class="history-date">${new Date(item.timestamp).toLocaleDateString()}</div>
            </div>
        `).join('');
    },

    // Repeat search from history
    async repeatSearch(product) {
        await this.handlePriceCheck(product);
    },

    // Text-to-speech
    speak(text) {
        if (!this.isVoiceEnabled || !this.synthesis) return;
        
        // Cancel any ongoing speech
        this.synthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.getLanguageCode();
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        // Try to find appropriate voice
        const voices = this.synthesis.getVoices();
        const preferredVoice = voices.find(voice => 
            voice.lang.startsWith(this.getLanguageCode().split('-')[0])
        );
        
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        
        utterance.onstart = () => {
            this.isProcessing = true;
        };
        
        utterance.onend = () => {
            this.isProcessing = false;
        };
        
        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
            this.isProcessing = false;
        };
        
        this.synthesis.speak(utterance);
    },

    // Stop speaking
    stopSpeaking() {
        if (this.synthesis) {
            this.synthesis.cancel();
        }
        this.isProcessing = false;
    },

    // Get language code for speech recognition
    getLanguageCode() {
        const currentLang = window.LanguageManager?.getCurrentLanguage() || 'english';
        return window.LanguageManager?.getLanguageCode(currentLang) || 'en-IN';
    },

    // Update language for voice recognition
    updateLanguage(language) {
        if (this.recognition) {
            this.recognition.lang = window.LanguageManager?.getLanguageCode(language) || 'en-IN';
        }
    },

    // Show error message
    showError(message) {
        console.error('Voice Manager Error:', message);
        
        // You could show a toast notification here
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 9999;
            background: #fef2f2; color: #dc2626; padding: 1rem; border-radius: 0.5rem;
            border: 1px solid #fecaca; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
};

// Export for global use
window.VoiceManager = VoiceManager;