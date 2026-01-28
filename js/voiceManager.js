// Unified Voice Manager for Viksit Vaani – SwarVyapaar
// Handles Speech-to-Text, Text-to-Speech, and Language Integration

class VoiceManager {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.currentLanguage = 'english';
        this.voices = [];
        this.lastTranscript = '';
        this.lastResponse = '';
        this.hasError = false;
        this.speechTimeout = null;
        
        this.init();
    }
    
    // Initialize voice manager
    init() {
        this.setupSpeechRecognition();
        this.loadVoices();
        this.setupEventListeners();
        
        // Load voices when they become available
        if (this.synthesis.onvoiceschanged !== undefined) {
            this.synthesis.onvoiceschanged = () => this.loadVoices();
        }
        
        // Integrate with language manager
        if (window.languageManager) {
            window.languageManager.addObserver((language) => {
                this.setLanguage(language);
            });
            this.setLanguage(window.languageManager.getCurrentLanguage());
        }
        
        // Initialize history display
        this.updateHistoryDisplay();
        
        // Check microphone permissions on init
        this.checkMicrophonePermissions();
    }
    
    // Check microphone permissions
    async checkMicrophonePermissions() {
        try {
            if (navigator.permissions && navigator.permissions.query) {
                const permission = await navigator.permissions.query({ name: 'microphone' });
                console.log('Microphone permission status:', permission.state);
                
                if (permission.state === 'denied') {
                    this.showMicrophoneHelp();
                }
                
                // Listen for permission changes
                permission.onchange = () => {
                    console.log('Microphone permission changed to:', permission.state);
                    if (permission.state === 'granted') {
                        this.clearErrorDisplay();
                    }
                };
            }
        } catch (error) {
            console.log('Could not check microphone permissions:', error);
        }
    }
    
    // Show microphone help
    showMicrophoneHelp() {
        const helpDiv = document.createElement('div');
        helpDiv.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: white; padding: 2rem; border-radius: 1rem; z-index: 10000;
            box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04);
            max-width: 400px; text-align: center; border: 2px solid #f59e0b;
        `;
        
        helpDiv.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 1rem;">🎤</div>
            <h3 style="margin: 0 0 1rem 0; color: #d97706;">Microphone Access Needed</h3>
            <p style="margin: 0 0 1.5rem 0; color: #6b7280; line-height: 1.5;">
                To use voice features, please allow microphone access when prompted by your browser.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="padding: 0.5rem 1rem; background: #f3f4f6; border: none; border-radius: 0.5rem; cursor: pointer;">
                    Close
                </button>
                <button onclick="window.voiceManager.requestMicrophoneAccess(); this.parentElement.parentElement.remove();" 
                        style="padding: 0.5rem 1rem; background: #f59e0b; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">
                    Try Again
                </button>
            </div>
        `;
        
        document.body.appendChild(helpDiv);
    }
    
    // Request microphone access
    async requestMicrophoneAccess() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log('Microphone access granted');
            
            // Stop the stream immediately as we just needed permission
            stream.getTracks().forEach(track => track.stop());
            
            this.clearErrorDisplay();
            this.showSuccess('Microphone access granted! You can now use voice features.');
        } catch (error) {
            console.error('Microphone access denied:', error);
            this.showError('Microphone access denied. Please allow microphone access in your browser settings.');
        }
    }
    
    // Show success message
    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 9999;
            background: #f0fdf4; color: #16a34a; padding: 1rem; border-radius: 0.5rem;
            border: 1px solid #bbf7d0; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            max-width: 300px; font-size: 14px; line-height: 1.4;
        `;
        successDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span>✅</span>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 3000);
    }
    
    // Setup speech recognition
    setupSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            // Enhanced configuration for better reliability
            this.recognition.continuous = false;
            this.recognition.interimResults = true;
            this.recognition.maxAlternatives = 3;
            
            // Set language with fallback
            this.recognition.lang = 'en-IN';
            
            console.log('Speech recognition initialized successfully');
            
            this.recognition.onstart = () => {
                console.log('Speech recognition started successfully');
                this.isListening = true;
                this.updateVoiceStatus('listening');
                
                // Clear any previous errors
                this.clearErrorDisplay();
            };
            
            this.recognition.onresult = (event) => {
                console.log('Speech recognition result received:', event);
                let transcript = '';
                let confidence = 0;
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const result = event.results[i];
                    transcript += result[0].transcript;
                    confidence = result[0].confidence || 0.5;
                }
                
                console.log('Transcript:', transcript, 'Confidence:', confidence);
                
                this.lastTranscript = transcript;
                this.updateTranscript(transcript, !event.results[event.results.length - 1].isFinal);
                
                if (event.results[event.results.length - 1].isFinal) {
                    console.log('Final transcript:', transcript);
                    
                    // Clear timeout since we got a result
                    if (this.speechTimeout) {
                        clearTimeout(this.speechTimeout);
                        this.speechTimeout = null;
                    }
                    
                    if (transcript.trim().length > 0) {
                        this.processVoiceInput(transcript);
                    } else {
                        this.handleEmptyTranscript();
                    }
                }
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error, event);
                this.isListening = false;
                
                // Clear timeout
                if (this.speechTimeout) {
                    clearTimeout(this.speechTimeout);
                    this.speechTimeout = null;
                }
                
                let errorMessage = '';
                let shouldRetry = false;
                
                switch(event.error) {
                    case 'no-speech':
                        errorMessage = 'No speech detected. Please speak clearly and try again.';
                        shouldRetry = true;
                        break;
                    case 'audio-capture':
                        errorMessage = 'Microphone not accessible. Please check your microphone.';
                        break;
                    case 'not-allowed':
                        errorMessage = 'Microphone permission denied. Please allow microphone access.';
                        break;
                    case 'network':
                        errorMessage = 'Network error. Please check your internet connection.';
                        shouldRetry = true;
                        break;
                    case 'service-not-allowed':
                        errorMessage = 'Speech service not available. Please try again.';
                        shouldRetry = true;
                        break;
                    case 'aborted':
                        // Don't show error for aborted - it's usually intentional
                        console.log('Speech recognition was aborted');
                        this.updateVoiceStatus('ready');
                        return;
                    default:
                        errorMessage = `Speech error: ${event.error}. Please try again.`;
                        shouldRetry = true;
                }
                
                if (shouldRetry) {
                    this.updateVoiceStatus('ready');
                    this.showRetryableError(errorMessage);
                } else {
                    this.updateVoiceStatus('error');
                    this.showError(errorMessage);
                }
            };
            
            this.recognition.onend = () => {
                console.log('Speech recognition ended');
                this.isListening = false;
                
                // Clear timeout
                if (this.speechTimeout) {
                    clearTimeout(this.speechTimeout);
                    this.speechTimeout = null;
                }
                
                // Only update to ready if not in error state
                if (!this.hasError) {
                    this.updateVoiceStatus('ready');
                }
            };
        } else {
            console.warn('Speech recognition not supported in this browser');
            this.showError('Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.');
        }
    }
    
    // Load available voices
    loadVoices() {
        this.voices = this.synthesis.getVoices();
    }
    
    // Set current language
    setLanguage(language) {
        this.currentLanguage = language;
        
        if (this.recognition) {
            const config = window.languageManager?.getLanguageConfig(language);
            if (config) {
                this.recognition.lang = config.speechCode;
            }
        }
    }
    
    // Start voice recognition
    startListening() {
        console.log('startListening called, current state:', { isListening: this.isListening, hasRecognition: !!this.recognition });
        
        if (!this.recognition) {
            this.showError('Speech recognition not supported in this browser');
            return false;
        }
        
        // Force stop any existing recognition first
        this.forceStopRecognition();
        
        // Wait a moment before starting new recognition
        setTimeout(() => {
            this.actuallyStartListening();
        }, 100);
        
        return true;
    }
    
    // Force stop any existing recognition
    forceStopRecognition() {
        try {
            if (this.recognition) {
                this.recognition.abort();
                this.recognition.stop();
            }
            
            // Clear any existing timeouts
            if (this.speechTimeout) {
                clearTimeout(this.speechTimeout);
                this.speechTimeout = null;
            }
            
            this.isListening = false;
            this.hasError = false;
            
            console.log('Force stopped existing recognition');
        } catch (error) {
            console.log('Error force stopping recognition:', error);
        }
    }
    
    // Actually start listening (called after cleanup)
    actuallyStartListening() {
        try {
            // Reset error state
            this.hasError = false;
            this.clearErrorDisplay();
            
            // Set language based on current selection
            const config = window.languageManager?.getLanguageConfig(this.currentLanguage);
            if (config && config.speechCode) {
                this.recognition.lang = config.speechCode;
            } else {
                this.recognition.lang = 'en-IN'; // Default fallback
            }
            
            console.log('Starting voice recognition with language:', this.recognition.lang);
            
            // Show listening status immediately
            this.updateVoiceStatus('listening');
            
            // Start recognition
            this.recognition.start();
            this.isListening = true;
            
            // Set a timeout to give user time to speak
            this.speechTimeout = setTimeout(() => {
                if (this.isListening) {
                    console.log('Speech timeout - stopping recognition');
                    this.stopListening();
                    this.showRetryableError('Please speak within 8 seconds. Click "Tap to Speak" and try again!');
                }
            }, 8000); // 8 seconds timeout
            
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            this.hasError = true;
            this.isListening = false;
            this.updateVoiceStatus('error');
            
            if (error.name === 'InvalidStateError') {
                // Wait a bit longer and try once more
                setTimeout(() => {
                    console.log('Retrying after InvalidStateError...');
                    this.forceStopRecognition();
                    setTimeout(() => {
                        this.actuallyStartListening();
                    }, 500);
                }, 200);
            } else {
                this.showRetryableError('Could not start voice recognition. Please try again.');
            }
        }
    }
    
    // Stop voice recognition
    stopListening() {
        console.log('stopListening called');
        
        try {
            if (this.recognition && this.isListening) {
                this.recognition.stop();
            }
        } catch (error) {
            console.log('Error stopping recognition:', error);
        }
        
        // Clear timeout
        if (this.speechTimeout) {
            clearTimeout(this.speechTimeout);
            this.speechTimeout = null;
        }
        
        this.isListening = false;
    }
    
    // Handle empty transcript
    handleEmptyTranscript() {
        console.log('Empty transcript received');
        this.showRetryableError('No speech detected. Please speak clearly and try again.');
    }
    
    // Clear error display
    clearErrorDisplay() {
        this.hasError = false;
        const transcriptElements = document.querySelectorAll('#transcript, #voiceTranscript, .voice-transcript-display');
        transcriptElements.forEach(element => {
            const errorMessages = element.querySelectorAll('.error-message');
            errorMessages.forEach(msg => msg.remove());
        });
    }
    
    // Show retryable error (less severe)
    showRetryableError(message) {
        console.warn('Voice Manager Warning:', message);
        
        // Update transcript area with retry message
        const transcriptElements = document.querySelectorAll('#transcript, #voiceTranscript, .voice-transcript-display');
        transcriptElements.forEach(element => {
            element.innerHTML = `
                <div class="retry-message">
                    <div class="retry-icon">🎤</div>
                    <div class="retry-text">${message}</div>
                    <button class="retry-button" onclick="window.voiceManager.startListening()">Try Again</button>
                </div>
            `;
            element.style.display = 'block';
        });
        
        // Show brief toast
        const toastDiv = document.createElement('div');
        toastDiv.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 9999;
            background: #fef3c7; color: #d97706; padding: 1rem; border-radius: 0.5rem;
            border: 1px solid #fcd34d; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            max-width: 300px; font-size: 14px; line-height: 1.4;
        `;
        toastDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span>🎤</span>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(toastDiv);
        
        setTimeout(() => {
            if (toastDiv.parentNode) {
                toastDiv.remove();
            }
        }, 3000);
    }
    
    // Process voice input
    processVoiceInput(transcript) {
        if (!transcript.trim()) return;
        
        console.log('Processing voice input:', transcript);
        
        // Update UI with transcript
        this.updateTranscript(transcript, false);
        
        // Process the voice command
        this.handleVoiceCommand(transcript);
    }
    
    // Handle voice commands - SIMPLIFIED VERSION
    handleVoiceCommand(transcript) {
        const lowerTranscript = transcript.toLowerCase();
        
        console.log('Handling voice command:', lowerTranscript);
        
        // Simple product detection
        let product = null;
        const products = {
            'tomato': ['tomato', 'tamatar', 'टमाटर'],
            'onion': ['onion', 'pyaz', 'प्याज'],
            'potato': ['potato', 'aloo', 'आलू'],
            'rice': ['rice', 'chawal', 'चावल'],
            'wheat': ['wheat', 'gehun', 'गेहूं']
        };
        
        // Find product in transcript
        for (const [productName, keywords] of Object.entries(products)) {
            for (const keyword of keywords) {
                if (lowerTranscript.includes(keyword)) {
                    product = productName;
                    break;
                }
            }
            if (product) break;
        }
        
        if (product) {
            console.log('Product detected:', product);
            this.handlePriceInquiry(product, transcript);
        } else {
            console.log('No product detected, giving general response');
            this.generateResponse(transcript);
        }
    }
    
    // Handle price inquiry - SIMPLIFIED VERSION
    handlePriceInquiry(product, originalTranscript) {
        console.log('Handling price inquiry for:', product);
        
        // Generate simple price data
        const priceData = this.generateSimplePriceData(product);
        
        // Generate response text
        const responseText = this.generateSimplePriceResponse(product, priceData);
        
        // Display results
        this.displaySimplePriceResults(product, priceData, responseText);
        
        // Speak the response
        this.speak(responseText);
        
        // Store in history
        this.addToHistory(originalTranscript, responseText, product);
        
        console.log('Price inquiry completed for:', product);
    }
    
    // Generate simple price data
    generateSimplePriceData(product) {
        const basePrice = Math.floor(Math.random() * 40) + 20; // 20-60 range
        return {
            product: product,
            minPrice: basePrice - 5,
            fairPrice: basePrice,
            maxPrice: basePrice + 8,
            trend: Math.random() > 0.5 ? 'rising' : 'falling',
            unit: 'kg'
        };
    }
    
    // Generate simple price response text
    generateSimplePriceResponse(product, priceData) {
        const lang = window.languageManager?.getCurrentLanguage() || 'english';
        
        if (lang === 'hindi') {
            return `${product} का आज का भाव ${priceData.fairPrice} रुपये प्रति किलो है। न्यूनतम ${priceData.minPrice} और अधिकतम ${priceData.maxPrice} रुपये है।`;
        } else {
            return `Today's ${product} price is ₹${priceData.fairPrice} per kg. Price ranges from ₹${priceData.minPrice} to ₹${priceData.maxPrice}.`;
        }
    }
    
    // Display simple price results
    displaySimplePriceResults(product, priceData, responseText) {
        console.log('Displaying price results for:', product);
        
        // Update price response display
        const priceResponse = document.getElementById('priceResponse');
        if (priceResponse) {
            priceResponse.innerHTML = `
                <div class="price-response-content">
                    <div class="response-header">
                        <span class="response-icon">💰</span>
                        <h4 class="response-title">${product.charAt(0).toUpperCase() + product.slice(1)} Price</h4>
                    </div>
                    <p class="response-text">${responseText}</p>
                    <div class="price-details">
                        <div class="price-item">
                            <span class="price-label">Fair Price</span>
                            <span class="price-value">₹${priceData.fairPrice}/kg</span>
                        </div>
                        <div class="price-item">
                            <span class="price-label">Range</span>
                            <span class="price-value">₹${priceData.minPrice} - ₹${priceData.maxPrice}</span>
                        </div>
                    </div>
                </div>
            `;
            priceResponse.style.display = 'block';
        }
        
        // Enable replay button
        const replayBtn = document.getElementById('voiceReplayBtn');
        if (replayBtn) {
            replayBtn.disabled = false;
            this.lastResponse = responseText;
        }
        
        console.log('Price results displayed successfully');
    }
    
    // Generate price data
    generatePriceData(product) {
        const basePrice = Math.floor(Math.random() * 50) + 20;
        return {
            product: product,
            minPrice: basePrice - 5,
            fairPrice: basePrice,
            maxPrice: basePrice + 10,
            trend: Math.random() > 0.5 ? 'rising' : 'falling',
            demand: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
            supply: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
            season: ['Off-season', 'Peak', 'Normal'][Math.floor(Math.random() * 3)]
        };
    }
    
    // Generate price response text
    generatePriceResponse(product, priceData) {
        const lang = window.languageManager?.getCurrentLanguage() || 'english';
        
        if (lang === 'hindi') {
            return `${product} का भाव ${priceData.minPrice} से ${priceData.maxPrice} रुपये प्रति किलो है। उचित दाम ${priceData.fairPrice} रुपये है। बाजार में मांग ${priceData.demand} है।`;
        } else if (lang === 'telugu') {
            return `${product} ధర కిలోకు ${priceData.minPrice} నుండి ${priceData.maxPrice} రూపాయలు. న్యాయమైన ధర ${priceData.fairPrice} రూపాయలు. మార్కెట్‌లో డిమాండ్ ${priceData.demand}.`;
        } else if (lang === 'tamil') {
            return `${product} விலை கிலோவுக்கு ${priceData.minPrice} முதல் ${priceData.maxPrice} ரூபாய். நியாயமான விலை ${priceData.fairPrice} ரூபாய். சந்தையில் தேவை ${priceData.demand}.`;
        } else if (lang === 'kannada') {
            return `${product} ಬೆಲೆ ಕಿಲೋಗೆ ${priceData.minPrice} ರಿಂದ ${priceData.maxPrice} ರೂಪಾಯಿ. ನ್ಯಾಯಯುತ ಬೆಲೆ ${priceData.fairPrice} ರೂಪಾಯಿ. ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಬೇಡಿಕೆ ${priceData.demand}.`;
        } else if (lang === 'malayalam') {
            return `${product} വില കിലോയ്ക്ക് ${priceData.minPrice} മുതൽ ${priceData.maxPrice} രൂപ. ന്യായമായ വില ${priceData.fairPrice} രൂപ. വിപണിയിൽ ആവശ്യം ${priceData.demand}.`;
        } else {
            return `The price of ${product} ranges from ₹${priceData.minPrice} to ₹${priceData.maxPrice} per kg. Fair price is ₹${priceData.fairPrice}. Market demand is ${priceData.demand}.`;
        }
    }
    
    // Display price results in UI
    displayPriceResults(product, priceData, responseText) {
        // Update price results section
        const priceResults = document.getElementById('priceResults');
        const priceResponse = document.getElementById('priceResponse');
        
        if (priceResults) {
            // Update product name
            const priceProduct = document.getElementById('priceProduct');
            if (priceProduct) priceProduct.textContent = product.charAt(0).toUpperCase() + product.slice(1);
            
            // Update price values
            const minPriceValue = document.getElementById('minPriceValue');
            const fairPriceValue = document.getElementById('fairPriceValue');
            const maxPriceValue = document.getElementById('maxPriceValue');
            
            if (minPriceValue) minPriceValue.textContent = `₹${priceData.minPrice}`;
            if (fairPriceValue) fairPriceValue.textContent = `₹${priceData.fairPrice}`;
            if (maxPriceValue) maxPriceValue.textContent = `₹${priceData.maxPrice}`;
            
            // Update market intelligence
            const demandLevel = document.getElementById('demandLevel');
            const supplyLevel = document.getElementById('supplyLevel');
            const seasonalFactor = document.getElementById('seasonalFactor');
            
            if (demandLevel) demandLevel.textContent = priceData.demand;
            if (supplyLevel) supplyLevel.textContent = priceData.supply;
            if (seasonalFactor) seasonalFactor.textContent = priceData.season;
            
            // Show price results
            priceResults.style.display = 'block';
        }
        
        // Update voice response display
        if (priceResponse) {
            priceResponse.innerHTML = `
                <div class="price-response-content">
                    <div class="response-header">
                        <span class="response-icon">🎤</span>
                        <h4 class="response-title">Voice Response</h4>
                    </div>
                    <p class="response-text">${responseText}</p>
                    <div class="price-details">
                        <div class="price-item">
                            <span class="price-label">Min Price</span>
                            <span class="price-value">₹${priceData.minPrice}/kg</span>
                        </div>
                        <div class="price-item">
                            <span class="price-label">Fair Price</span>
                            <span class="price-value">₹${priceData.fairPrice}/kg</span>
                        </div>
                    </div>
                </div>
            `;
            priceResponse.style.display = 'block';
        }
        
        // Enable replay button
        const replayBtn = document.getElementById('voiceReplayBtn');
        if (replayBtn) {
            replayBtn.disabled = false;
            this.lastResponse = responseText;
        }
    }
    
    // Generate general response
    generateResponse(transcript) {
        const lang = window.languageManager?.getCurrentLanguage() || 'english';
        let response = '';
        
        if (lang === 'hindi') {
            response = 'मैं आपकी मदद करने के लिए यहाँ हूँ। कृपया किसी उत्पाद का नाम बताएं जिसकी कीमत आप जानना चाहते हैं।';
        } else if (lang === 'telugu') {
            response = 'నేను మీకు సహాయం చేయడానికి ఇక్కడ ఉన్నాను. దయచేసి మీరు ధర తెలుసుకోవాలనుకుంటున్న ఉత్పత్తి పేరు చెప్పండి.';
        } else if (lang === 'tamil') {
            response = 'நான் உங்களுக்கு உதவ இங்கே இருக்கிறேன். தயவுசெய்து நீங்கள் விலை தெரிந்துகொள்ள விரும்பும் பொருளின் பெயரைச் சொல்லுங்கள்.';
        } else if (lang === 'kannada') {
            response = 'ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇನೆ. ದಯವಿಟ್ಟು ನೀವು ಬೆಲೆ ತಿಳಿದುಕೊಳ್ಳಲು ಬಯಸುವ ಉತ್ಪನ್ನದ ಹೆಸರನ್ನು ಹೇಳಿ.';
        } else if (lang === 'malayalam') {
            response = 'നിങ്ങളെ സഹായിക്കാൻ ഞാൻ ഇവിടെയുണ്ട്. ദയവായി നിങ്ങൾ വില അറിയാൻ ആഗ്രഹിക്കുന്ന ഉൽപ്പന്നത്തിന്റെ പേര് പറയുക.';
        } else {
            response = 'I\'m here to help you. Please tell me the name of a product you want to know the price for.';
        }
        
        this.speak(response);
        this.displayGeneralResponse(response);
    }
    
    // Display general response
    displayGeneralResponse(response) {
        const priceResponse = document.getElementById('priceResponse');
        if (priceResponse) {
            priceResponse.innerHTML = `
                <div class="response-placeholder">
                    <div class="response-icon">💬</div>
                    <p>${response}</p>
                </div>
            `;
        }
    }
    
    // Text-to-speech
    speak(text) {
        if (!this.synthesis) return;
        
        // Cancel any ongoing speech
        this.synthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set language-specific voice
        const config = window.languageManager?.getLanguageConfig(this.currentLanguage);
        if (config) {
            utterance.lang = config.voiceCode;
            
            // Try to find a voice for the specific language
            const voice = this.voices.find(v => 
                v.lang.startsWith(config.code.split('-')[0]) || 
                v.lang === config.voiceCode
            );
            
            if (voice) {
                utterance.voice = voice;
            }
        }
        
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        this.synthesis.speak(utterance);
    }
    
    // Replay last response
    replayLastResponse() {
        if (this.lastResponse) {
            this.speak(this.lastResponse);
        }
    }
    
    // Update transcript display
    updateTranscript(transcript, isInterim = false) {
        const transcriptElements = document.querySelectorAll('#transcript, #voiceTranscript, .voice-transcript-display');
        
        transcriptElements.forEach(element => {
            if (transcript.trim()) {
                element.style.display = 'block';
                const textElement = element.querySelector('.transcript-text, .transcript-result') || element;
                
                if (textElement !== element) {
                    textElement.textContent = transcript;
                } else {
                    element.innerHTML = `
                        <div class="transcript-label">You said:</div>
                        <div class="transcript-text">${transcript}</div>
                    `;
                }
                
                if (isInterim) {
                    textElement.style.opacity = '0.7';
                } else {
                    textElement.style.opacity = '1';
                }
            }
        });
    }
    
    // Update voice status
    updateVoiceStatus(status) {
        const statusElements = document.querySelectorAll('#voiceStatus, .voice-status-text');
        const voiceButtons = document.querySelectorAll('.voice-btn, .voice-main-btn');
        
        let statusText = '';
        let buttonClass = '';
        
        switch (status) {
            case 'listening':
                statusText = window.languageManager?.translate('listening') || 'Listening...';
                buttonClass = 'listening';
                break;
            case 'processing':
                statusText = window.languageManager?.translate('processing') || 'Processing...';
                buttonClass = 'processing';
                break;
            case 'error':
                statusText = window.languageManager?.translate('error') || 'Error occurred';
                buttonClass = '';
                break;
            default:
                statusText = window.languageManager?.translate('speakNow') || 'Tap to Speak';
                buttonClass = '';
        }
        
        statusElements.forEach(element => {
            element.textContent = statusText;
        });
        
        voiceButtons.forEach(button => {
            button.className = button.className.replace(/\b(listening|processing)\b/g, '');
            if (buttonClass) {
                button.classList.add(buttonClass);
            }
        });
    }
    
    // Show error message
    showError(message) {
        console.error('Voice Manager Error:', message);
        
        // Update voice status to show error
        this.updateVoiceStatus('error');
        
        // Show error in transcript area
        const transcriptElements = document.querySelectorAll('#transcript, #voiceTranscript, .voice-transcript-display');
        transcriptElements.forEach(element => {
            element.innerHTML = `
                <div class="error-message">
                    <div class="error-icon">⚠️</div>
                    <div class="error-text">${message}</div>
                </div>
            `;
            element.style.display = 'block';
        });
        
        // Show toast notification
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 9999;
            background: #fef2f2; color: #dc2626; padding: 1rem; border-radius: 0.5rem;
            border: 1px solid #fecaca; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            max-width: 300px; font-size: 14px; line-height: 1.4;
        `;
        errorDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span>🎤</span>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }
    
    // Add to search history
    addToHistory(query, response, product) {
        try {
            const history = JSON.parse(localStorage.getItem('voiceSearchHistory') || '[]');
            const historyItem = {
                id: Date.now(),
                query: query,
                response: response,
                product: product,
                timestamp: new Date().toISOString(),
                language: this.currentLanguage
            };
            
            history.unshift(historyItem);
            
            // Keep only last 20 items
            if (history.length > 20) {
                history.splice(20);
            }
            
            localStorage.setItem('voiceSearchHistory', JSON.stringify(history));
            this.updateHistoryDisplay();
        } catch (e) {
            console.warn('Could not save to history:', e);
        }
    }
    
    // Update history display
    updateHistoryDisplay() {
        const historyGrid = document.getElementById('historyGrid');
        if (!historyGrid) return;
        
        try {
            const history = JSON.parse(localStorage.getItem('voiceSearchHistory') || '[]');
            
            if (history.length === 0) {
                historyGrid.innerHTML = `
                    <div class="history-placeholder">
                        <div class="placeholder-icon">🎤</div>
                        <p>No voice searches yet. Try asking about product prices!</p>
                    </div>
                `;
                return;
            }
            
            historyGrid.innerHTML = history.slice(0, 6).map(item => `
                <div class="history-item" onclick="voiceManager.replayHistoryItem('${item.id}')">
                    <div class="history-content">
                        <div class="history-product">${item.product || 'General Query'}</div>
                        <div class="history-query">"${item.query}"</div>
                        <div class="history-time">${new Date(item.timestamp).toLocaleString()}</div>
                    </div>
                </div>
            `).join('');
        } catch (e) {
            console.warn('Could not load history:', e);
        }
    }
    
    // Replay history item
    replayHistoryItem(id) {
        try {
            const history = JSON.parse(localStorage.getItem('voiceSearchHistory') || '[]');
            const item = history.find(h => h.id == id);
            
            if (item) {
                this.speak(item.response);
                this.updateTranscript(item.query, false);
            }
        } catch (e) {
            console.warn('Could not replay history item:', e);
        }
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Voice buttons
        document.querySelectorAll('.voice-btn, .voice-main-btn, #voiceBtn, #mainVoiceBtn').forEach(button => {
            button.addEventListener('click', () => {
                this.startListening();
            });
        });
        
        // Replay buttons
        document.querySelectorAll('#voiceReplayBtn, .voice-replay-btn').forEach(button => {
            button.addEventListener('click', () => {
                this.replayLastResponse();
            });
        });
        
        // Clear results buttons
        document.querySelectorAll('#clearVoiceResults').forEach(button => {
            button.addEventListener('click', () => {
                this.clearResults();
            });
        });
    }
    
    // Clear results
    clearResults() {
        const priceResults = document.getElementById('priceResults');
        const priceResponse = document.getElementById('priceResponse');
        const transcript = document.getElementById('transcript');
        
        if (priceResults) priceResults.style.display = 'none';
        if (priceResponse) {
            priceResponse.innerHTML = `
                <div class="response-placeholder">
                    <div class="response-icon">💬</div>
                    <p>${window.languageManager?.translate('voiceResponsePlaceholder') || 'Voice and text responses will appear here'}</p>
                </div>
            `;
        }
        if (transcript) transcript.style.display = 'none';
        
        const replayBtn = document.getElementById('voiceReplayBtn');
        if (replayBtn) replayBtn.disabled = true;
        
        this.lastResponse = '';
        this.lastTranscript = '';
    }
}

// Initialize voice manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.voiceManager = new VoiceManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VoiceManager;
}