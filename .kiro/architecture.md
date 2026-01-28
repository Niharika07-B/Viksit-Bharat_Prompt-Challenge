# 🏗️ Architecture Documentation

## System Architecture Overview

Viksit Vaani – SwarVyapaar follows a **client-side first architecture** with modular JavaScript components and API-ready design patterns.

## 📐 Architecture Principles

### 1. **Modular Design**
- Each feature is a self-contained JavaScript module
- Clear separation of concerns
- Easy to maintain and extend
- Independent testing capabilities

### 2. **Progressive Enhancement**
- Core functionality works without JavaScript
- Enhanced features with JavaScript enabled
- Graceful degradation for older browsers
- Offline-first approach

### 3. **Mobile-First Architecture**
- Responsive design from 320px upwards
- Touch-optimized interactions
- Performance optimized for low-end devices
- Bandwidth-conscious resource loading

## 🧩 Component Architecture

### Core Modules

#### 1. **Language Manager** (`js/language.js`)
```javascript
const LanguageManager = {
    // Translation system for 9 Indian languages
    translations: { /* 9 language objects */ },
    currentLanguage: 'english',
    
    // Core methods
    init(),
    changeLanguage(language),
    t(key), // Translation function
    getLanguageCode(language)
};
```

**Responsibilities:**
- Manage 9-language translation system
- Handle language switching
- Provide translation utilities
- Store language preferences

#### 2. **Voice Manager** (`js/voice.js`)
```javascript
const VoiceManager = {
    recognition: null, // Web Speech API
    synthesis: window.speechSynthesis,
    
    // Voice processing pipeline
    processVoiceCommand(command),
    translateToEnglish(text, fromLanguage),
    displaySpokenText(text, language),
    displayTranslatedText(text),
    displaySuggestedPrice(product, priceData)
};
```

**Responsibilities:**
- Handle speech recognition in 9 languages
- Process voice commands
- Translate speech to English
- Display voice output in structured cards
- Manage voice settings

#### 3. **Location Manager** (`js/location.js`)
```javascript
const LocationManager = {
    currentLocation: null,
    nearbyMarkets: [],
    
    // Location services
    detectLocation(),
    fetchNearbyMarkets(),
    updateLocationBasedInsights()
};
```

**Responsibilities:**
- Detect user location via Geolocation API
- Fetch nearby market data
- Generate location-based insights
- Handle location permissions

#### 4. **Data Fetcher** (`js/data-fetch.js`)
```javascript
const DataFetcher = {
    mockPriceData: { /* Product prices */ },
    
    // Data management
    getPriceData(product),
    getMarketInsights(),
    getTransactionHistory(),
    generateDigitalReceipt(transactionId)
};
```

**Responsibilities:**
- Manage market price data
- Generate market insights
- Handle transaction history
- Create digital receipts

#### 5. **Three.js Background** (`js/three-background.js`)
```javascript
class ThreeBackground {
    // 3D scene management
    setupScene(),
    createTricolorWaves(),
    createPatrioticParticles(),
    createFloatingFlags(),
    animate()
}
```

**Responsibilities:**
- Create cinematic 3D background
- Animate tricolor elements
- Handle performance optimization
- Provide CSS fallback

#### 6. **Application Controller** (`js/main.js`)
```javascript
const App = {
    // Application lifecycle
    init(),
    initializeModules(),
    setupNavigation(),
    showSection(sectionId),
    loadSectionData(sectionId)
};
```

**Responsibilities:**
- Coordinate all modules
- Handle application lifecycle
- Manage navigation
- Control section switching

## 🔄 Data Flow Architecture

### Voice Processing Pipeline
```
User Speech → Web Speech API → Text Recognition → Language Detection → Translation → Price Analysis → Display Results
```

### Translation Flow
```
Original Text → Language Detection → Mock Translation API → English Text → Display Both Versions
```

### Price Discovery Flow
```
Product Name → Data Fetcher → Mock Price API → Location Adjustment → Trend Analysis → Formatted Display
```

## 🎨 UI Architecture

### Component Hierarchy
```
App
├── Navigation
│   ├── Language Selector
│   ├── Location Display
│   └── Menu Toggle
├── Sections
│   ├── Home (Hero + Features)
│   ├── Dashboard (Stats + Insights)
│   ├── Voice Price (Voice Interface + Results)
│   ├── Negotiation (Chat Interface)
│   ├── Inventory (Upload + Recognition)
│   └── History (Transactions + Filters)
└── Footer (Features + Support + Patriotic Message)
```

### CSS Architecture
```css
/* CSS Variables for theming */
:root { --saffron: #ff9933; /* ... */ }

/* Component-based styles */
.navbar { /* Navigation styles */ }
.voice-interface { /* Voice UI styles */ }
.voice-output-card { /* Result display styles */ }
.footer { /* Footer styles */ }

/* Responsive breakpoints */
@media (max-width: 768px) { /* Tablet */ }
@media (max-width: 480px) { /* Mobile */ }
```

## 🔌 API Integration Architecture

### Mock API Pattern
```javascript
// Current: Mock implementation
async mockTranslateAPI(text, fromLang, toLang) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock translation logic
    return translatedText;
}

// Future: Real API integration
async realTranslateAPI(text, fromLang, toLang) {
    const response = await fetch('https://api.googletranslate.com/v1/translate', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${API_KEY}` },
        body: JSON.stringify({ text, from: fromLang, to: toLang })
    });
    return response.json();
}
```

### API Integration Points
1. **Google Translate API** - Text translation
2. **Agmarknet API** - Real market prices
3. **Weather API** - Market condition insights
4. **Gemini AI API** - Advanced negotiation logic

## 📱 Progressive Web App Architecture

### Service Worker Strategy
```javascript
// Cache-first for static assets
// Network-first for dynamic data
// Offline fallback for core functionality
```

### Manifest Configuration
```json
{
    "name": "Viksit Vaani – SwarVyapaar",
    "short_name": "SwarVyapaar",
    "theme_color": "#ff9933",
    "background_color": "#ffffff",
    "display": "standalone",
    "start_url": "/demo.html"
}
```

## 🔒 Security Architecture

### Client-Side Security
- No sensitive data storage
- Local-only voice processing
- Sanitized user inputs
- XSS prevention measures

### Privacy by Design
- Minimal data collection
- User consent for permissions
- Local storage only
- No tracking or analytics

## 📊 Performance Architecture

### Loading Strategy
1. **Critical Path**: HTML + CSS + Core JS
2. **Progressive Enhancement**: Voice features
3. **Lazy Loading**: Three.js background
4. **Deferred**: Non-critical features

### Optimization Techniques
- CSS minification
- JavaScript bundling
- Image optimization
- Resource preloading
- Service worker caching

## 🧪 Testing Architecture

### Testing Pyramid
```
E2E Tests (Manual)
├── Cross-browser testing
├── Mobile device testing
└── Voice recognition testing

Integration Tests (Automated)
├── Module interaction tests
├── API integration tests
└── Performance tests

Unit Tests (Future)
├── Individual function tests
├── Component tests
└── Utility tests
```

## 🚀 Deployment Architecture

### Static Hosting Strategy
```
Source Code → Build Process → Static Files → CDN Distribution → Global Availability
```

### Environment Configuration
- **Development**: Local server with hot reload
- **Staging**: Preview deployment with test data
- **Production**: Optimized build with real APIs

## 🔮 Future Architecture Considerations

### Scalability Plans
- Microservices for backend APIs
- CDN for global distribution
- Database for user preferences
- Real-time updates via WebSockets

### Technology Evolution
- WebAssembly for performance-critical features
- WebRTC for peer-to-peer communication
- WebGL for advanced graphics
- Web Components for reusability

---

This architecture ensures **scalability**, **maintainability**, and **performance** while keeping the codebase simple and accessible for the Republic Day 2026 demonstration.