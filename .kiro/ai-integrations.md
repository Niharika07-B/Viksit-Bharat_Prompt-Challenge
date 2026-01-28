# 🤖 AI Integrations Documentation

## AI Integration Strategy

Viksit Vaani – SwarVyapaar employs a **modular AI architecture** with mock implementations that can be seamlessly replaced with real AI services. This approach ensures immediate functionality while maintaining production-ready integration patterns.

## 🧠 AI Components Overview

### 1. **Speech Recognition AI**
- **Current**: Web Speech API (Browser Native)
- **Future**: Google Cloud Speech-to-Text API
- **Fallback**: Mozilla DeepSpeech (Offline)

### 2. **Translation AI**
- **Current**: Mock Translation with Pattern Matching
- **Future**: Google Translate API
- **Fallback**: Microsoft Translator API

### 3. **Price Intelligence AI**
- **Current**: Mock Market Data with Smart Variations
- **Future**: Real-time Agmarknet API + ML Predictions
- **Fallback**: Historical Price Patterns

### 4. **Negotiation AI**
- **Current**: Rule-based Response System
- **Future**: Google Gemini API / OpenAI GPT
- **Fallback**: Template-based Responses

### 5. **Product Recognition AI**
- **Current**: Mock Computer Vision
- **Future**: Google Vision API / Custom ML Model
- **Fallback**: Manual Product Selection

## 🎤 Speech Recognition Integration

### Current Implementation
```javascript
// Web Speech API Integration
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'hi-IN'; // Hindi India
recognition.continuous = false;
recognition.interimResults = true;

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    processVoiceCommand(transcript);
};
```

### Production-Ready Integration
```javascript
// Google Cloud Speech-to-Text API
async function recognizeSpeech(audioBlob, languageCode) {
    const response = await fetch('https://speech.googleapis.com/v1/speech:recognize', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GOOGLE_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            config: {
                encoding: 'WEBM_OPUS',
                sampleRateHertz: 48000,
                languageCode: languageCode,
                enableAutomaticPunctuation: true
            },
            audio: {
                content: await blobToBase64(audioBlob)
            }
        })
    });
    
    const result = await response.json();
    return result.results[0].alternatives[0].transcript;
}
```

### Language Code Mapping
```javascript
const speechLanguageCodes = {
    english: 'en-IN',
    hindi: 'hi-IN',
    telugu: 'te-IN',
    tamil: 'ta-IN',
    kannada: 'kn-IN',
    malayalam: 'ml-IN',
    marathi: 'mr-IN',
    odia: 'or-IN',
    tulu: 'en-IN' // Fallback to English
};
```

## 🌐 Translation AI Integration

### Current Mock Implementation
```javascript
async function mockTranslateAPI(text, fromLang, toLang) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Pattern-based translation for common phrases
    const translations = {
        hindi: {
            'आलू का भाव क्या है': 'What is the price of potato',
            'प्याज का रेट': 'Onion rate',
            'टमाटर की कीमत': 'Tomato price'
        },
        telugu: {
            'బంగాళాదుంప రేటు ఎంత': 'What is potato rate',
            'ఉల్లిపాయ ధర': 'Onion price'
        }
        // ... more language mappings
    };
    
    return translations[fromLang]?.[text] || text;
}
```

### Google Translate API Integration
```javascript
async function googleTranslateAPI(text, fromLang, toLang) {
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            q: text,
            source: fromLang,
            target: toLang,
            format: 'text'
        })
    });
    
    const result = await response.json();
    return result.data.translations[0].translatedText;
}
```

### Translation Quality Enhancement
```javascript
// Context-aware translation for market terminology
const marketTerminology = {
    'भाव': 'price',
    'रेट': 'rate',
    'कीमत': 'cost',
    'मंडी': 'market',
    'व्यापारी': 'trader'
};

function enhanceTranslation(text, domain = 'market') {
    // Apply domain-specific terminology
    // Improve context accuracy
    // Handle cultural nuances
    return enhancedText;
}
```

## 💰 Price Intelligence AI

### Current Mock System
```javascript
const mockPriceData = {
    potato: { min: 15, fair: 20, max: 25, trend: 'stable', unit: 'kg' },
    onion: { min: 25, fair: 35, max: 45, trend: 'rising', unit: 'kg' }
    // ... more products
};

// Smart price variations based on location and time
function getLocationPriceVariation() {
    const locationMultipliers = {
        'Mumbai': 0.15,
        'Delhi': 0.10,
        'Bangalore': 0.12
    };
    return locationMultipliers[currentLocation] || 0;
}
```

### Real Market Data Integration
```javascript
// Agmarknet API Integration
async function fetchRealMarketPrices(product, location) {
    const response = await fetch(`https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070`, {
        method: 'GET',
        headers: {
            'api-key': AGMARKNET_API_KEY
        },
        params: {
            'filters[commodity]': product,
            'filters[market]': location,
            'limit': 10
        }
    });
    
    const data = await response.json();
    return processMarketData(data.records);
}

// ML-based price prediction
async function predictPriceMovement(product, historicalData) {
    const response = await fetch('/api/ml/predict-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            product,
            historical_data: historicalData,
            features: ['season', 'weather', 'demand', 'supply']
        })
    });
    
    return response.json();
}
```

## 🤝 Negotiation AI Integration

### Current Rule-Based System
```javascript
function generateNegotiationResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Pattern matching for common scenarios
    if (lowerMessage.includes('potato') || lowerMessage.includes('आलू')) {
        return 'आलू का आज का भाव ₹20-25 प्रति किलो है। आप ₹22 प्रति किलो से शुरुआत कर सकते हैं।';
    }
    
    // Default responses based on context
    const responses = [
        'बाजार भाव के अनुसार मोल-भाव करें। गुणवत्ता को ध्यान में रखें।',
        'धैर्य रखें और विनम्र भाषा का उपयोग करें।'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}
```

### Google Gemini AI Integration
```javascript
async function geminiNegotiationAssistant(context) {
    const prompt = `
    You are a helpful negotiation assistant for Indian market vendors.
    Context: ${context.product}, Current Price: ₹${context.currentPrice}, 
    Buyer Offer: ₹${context.buyerOffer}, Market Trend: ${context.trend}
    
    Provide culturally appropriate negotiation advice in ${context.language}.
    Be respectful, practical, and consider Indian trading customs.
    `;
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GEMINI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 200
            }
        })
    });
    
    const result = await response.json();
    return result.candidates[0].content.parts[0].text;
}
```

### Cultural Context Integration
```javascript
const culturalNegotiationPatterns = {
    hindi: {
        politeOpening: 'भाई साहब, ',
        respectfulClosing: 'आपका भला हो।',
        priceJustification: 'यह भाव बाजार के अनुसार उचित है।'
    },
    tamil: {
        politeOpening: 'அண்ணா, ',
        respectfulClosing: 'உங்களுக்கு நல்லது நடக்கும்।',
        priceJustification: 'இந்த விலை சந்தை விலைக்கு ஏற்றது।'
    }
    // ... more cultural patterns
};
```

## 📷 Product Recognition AI

### Current Mock Implementation
```javascript
async function mockProductRecognition(imageFile) {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock recognition results
    const products = ['Potato', 'Onion', 'Tomato', 'Carrot', 'Cabbage'];
    const grades = ['Grade A', 'Grade B', 'Premium'];
    
    return {
        product: products[Math.floor(Math.random() * products.length)],
        grade: grades[Math.floor(Math.random() * grades.length)],
        confidence: Math.floor(Math.random() * 20) + 80, // 80-99%
        quality_notes: 'Fresh and good quality product suitable for market.'
    };
}
```

### Google Vision API Integration
```javascript
async function recognizeProduct(imageFile) {
    const base64Image = await fileToBase64(imageFile);
    
    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            requests: [{
                image: {
                    content: base64Image
                },
                features: [
                    { type: 'LABEL_DETECTION', maxResults: 10 },
                    { type: 'OBJECT_LOCALIZATION', maxResults: 10 }
                ]
            }]
        })
    });
    
    const result = await response.json();
    return processVisionResults(result.responses[0]);
}

// Custom ML model for Indian vegetables
async function customVegetableRecognition(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await fetch('/api/ml/recognize-vegetable', {
        method: 'POST',
        body: formData
    });
    
    return response.json();
}
```

## 📊 Market Intelligence AI

### Demand Prediction System
```javascript
async function predictMarketDemand(product, factors) {
    const features = {
        season: getCurrentSeason(),
        weather: await getWeatherData(),
        festivals: getUpcomingFestivals(),
        historical_demand: getHistoricalDemand(product),
        price_trend: getCurrentPriceTrend(product)
    };
    
    const response = await fetch('/api/ml/predict-demand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, features })
    });
    
    return response.json();
}
```

### Insight Generation AI
```javascript
async function generateMarketInsights(location, language) {
    const context = {
        location,
        current_season: getCurrentSeason(),
        upcoming_festivals: getUpcomingFestivals(),
        weather_forecast: await getWeatherForecast(),
        price_trends: await getPriceTrends()
    };
    
    const prompt = `Generate market insights for ${location} in ${language}. 
    Consider: ${JSON.stringify(context)}
    Provide 3 actionable insights for local vendors.`;
    
    return await callAIService(prompt);
}
```

## 🔄 AI Integration Patterns

### Graceful Degradation
```javascript
async function robustAICall(primaryService, fallbackService, input) {
    try {
        return await primaryService(input);
    } catch (error) {
        console.warn('Primary AI service failed, using fallback:', error);
        try {
            return await fallbackService(input);
        } catch (fallbackError) {
            console.error('All AI services failed:', fallbackError);
            return getStaticFallback(input);
        }
    }
}
```

### Caching Strategy
```javascript
const aiCache = new Map();

async function cachedAICall(service, input, ttl = 300000) { // 5 minutes
    const cacheKey = `${service.name}_${JSON.stringify(input)}`;
    
    if (aiCache.has(cacheKey)) {
        const cached = aiCache.get(cacheKey);
        if (Date.now() - cached.timestamp < ttl) {
            return cached.result;
        }
    }
    
    const result = await service(input);
    aiCache.set(cacheKey, { result, timestamp: Date.now() });
    return result;
}
```

### Rate Limiting
```javascript
class AIRateLimiter {
    constructor(maxRequests = 100, timeWindow = 3600000) { // 100 requests per hour
        this.requests = [];
        this.maxRequests = maxRequests;
        this.timeWindow = timeWindow;
    }
    
    async makeRequest(aiFunction, ...args) {
        const now = Date.now();
        this.requests = this.requests.filter(time => now - time < this.timeWindow);
        
        if (this.requests.length >= this.maxRequests) {
            throw new Error('Rate limit exceeded');
        }
        
        this.requests.push(now);
        return await aiFunction(...args);
    }
}
```

## 🚀 Production Deployment Strategy

### API Key Management
```javascript
const AI_CONFIG = {
    google_translate: {
        apiKey: process.env.GOOGLE_TRANSLATE_API_KEY,
        endpoint: 'https://translation.googleapis.com/language/translate/v2'
    },
    google_speech: {
        apiKey: process.env.GOOGLE_SPEECH_API_KEY,
        endpoint: 'https://speech.googleapis.com/v1/speech:recognize'
    },
    gemini: {
        apiKey: process.env.GEMINI_API_KEY,
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
    }
};
```

### Monitoring & Analytics
```javascript
function trackAIUsage(service, input, output, responseTime, success) {
    const metrics = {
        service,
        timestamp: Date.now(),
        input_length: JSON.stringify(input).length,
        output_length: JSON.stringify(output).length,
        response_time: responseTime,
        success,
        user_language: getCurrentLanguage(),
        location: getCurrentLocation()
    };
    
    // Send to analytics service
    sendMetrics(metrics);
}
```

---

This AI integration architecture ensures **scalability**, **reliability**, and **cultural appropriateness** while maintaining the flexibility to upgrade from mock implementations to production-grade AI services seamlessly.