# 🇮🇳 Viksit Vaani – SwarVyapaar

**Empowering Bharat's Trade Through Voice & AI**

*The Multilingual Mandi – creating a real-time linguistic bridge for local trade*

<img width="1024" height="1024" alt="image" src="https://github.com/user-attachments/assets/daf3daad-04bb-40db-8457-1aa5c3672e9c" />


A revolutionary voice-first, multilingual web platform designed for India's local market vendors, featuring AI-powered price discovery, negotiation assistance, and transparent trade decisions.

## 🌟 Republic Day 2026 - Viksit Bharat Theme

Built with the spirit of Republic Day and Viksit Bharat, this platform combines traditional Indian market practices with cutting-edge AI technology to empower local vendors across India.

## 🎯 Key Features

### 🎤 Voice-First Multilingual Interface
- **9 Indian Languages Supported**: English, Hindi, Telugu, Kannada, Malayalam, Tamil, Tulu, Marathi, Odia
- **Natural Speech Recognition**: Vendors can speak naturally ("Aaloo ka bhav kya hai?" "Ee onion rate entha?")
- **Voice Response**: System responds in the same language with both text and optional voice

### 🤖 AI-Powered Core Features

1. **Voice Price Discovery**
   - Instant market price lookup through voice commands
   - Real-time mandi price integration (Agmarknet-style)
   - Multi-language price explanations

2. **AI Negotiation Assistant (Bhav-Tol Bot)**
   - Smart negotiation suggestions based on market rates
   - Culturally appropriate response recommendations
   - Chat-style interface for easy interaction

3. **Visual Inventory Recognition**
   - AI-powered product identification from photos
   - Quality assessment and grading
   - Automatic multilingual descriptions

4. **Hyper-Local Demand Insights**
   - Festival and weather-based demand predictions
   - AI-generated market insights
   - Seasonal trend analysis

5. **Trust & Transparency**
   - Auto-generated digital receipts
   - Transaction history tracking
   - Downloadable/shareable records

## 🎨 Design Philosophy

### Republic Day Inspired UI
- **Tricolor Palette**: Saffron (#ff9933), White (#ffffff), Green (#138808)
- **Ashoka Chakra Blue**: (#3b82f6) for accents
- **Patriotic Elements**: Indian flag, tricolor particles, white doves
- **Clean Government-Grade Design**: Professional, accessible, respectful

### Mobile-First Approach
- Optimized for low-end smartphones
- Fast loading on slow networks
- Large buttons and clear icons
- Accessibility-friendly fonts and spacing

## 🛠️ Technology Stack

### Frontend
- **Pure HTML5/CSS3/JavaScript** (No frameworks - optimized for performance)
- **CSS Grid & Flexbox** for responsive layouts
- **Web Speech API** for voice recognition and synthesis
- **Canvas API** for animated tricolor backgrounds
- **Geolocation API** for location-based features

### Core Technologies
- **Vanilla JavaScript ES6+** for all functionality
- **CSS Custom Properties** for theming
- **Local Storage** for data persistence
- **Service Worker** for PWA capabilities

### APIs & Services
- **Web Speech API** for multilingual voice recognition
- **Speech Synthesis API** for text-to-speech
- **Geolocation API** for market location detection
- **Mock Market Data** simulating real Agmarknet APIs

## 🚀 Getting Started

### Prerequisites
- Modern web browser with JavaScript enabled
- Internet connection for initial load
- Microphone access for voice features (optional)
- Location access for market data (optional)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Niharika07-B/Viksit-Bharat_Prompt-Challenge.git
   cd Viksit-Bharat_Prompt-Challenge
   ```

2. **Start local server**
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Using Node.js
   npx http-server -p 8000
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000/
   ```

4. **Test animations**
   ```
   http://localhost:8000/test-animations.html
   ```

### No Build Process Required
This is a pure HTML/CSS/JavaScript application that runs directly in the browser without any build tools or compilation steps.

## 📱 Usage Guide

### For Vendors

1. **Voice Price Check**
   - Click the microphone button
   - Say product name in your preferred language
   - Get instant price information

2. **Negotiation Assistant**
   - Enter buyer's offered price
   - Get AI-powered counter-offer suggestions
   - Receive culturally appropriate responses

3. **Inventory Upload**
   - Take photo of products
   - Get AI identification and quality assessment
   - Add to inventory with auto-generated descriptions

4. **Transaction History**
   - View all past transactions
   - Generate and download digital receipts
   - Track business performance

## 🌐 Supported Languages

| Language | Native Name | Voice Support | UI Support |
|----------|-------------|---------------|------------|
| English | English | ✅ | ✅ |
| Hindi | हिंदी | ✅ | ✅ |
| Telugu | తెలుగు | ✅ | ✅ |
| Tamil | தமிழ் | ✅ | ✅ |
| Kannada | ಕನ್ನಡ | ✅ | ✅ |
| Malayalam | മലയാളം | ✅ | ✅ |
| Marathi | मराठी | ✅ | ✅ |
| Odia | ଓଡ଼ିଆ | ✅ | ✅ |
| Tulu | ತುಳು | ⚠️ | ✅ |

*Note: Tulu voice recognition falls back to English due to limited browser support*

## 🏗️ Project Structure

```
Viksit-Bharat_Prompt-Challenge/
├── .kiro/                    # Kiro configuration (MANDATORY)
│   ├── config.json          # Kiro configuration
│   ├── README.md             # Kiro documentation
│   ├── features.md           # Feature documentation
│   ├── architecture.md       # Architecture overview
│   └── ai-integrations.md    # AI integration details
├── index.html                # Main application entry point
├── test-animations.html      # Animation testing interface
├── feature-showcase.html     # Feature demonstration
├── css/
│   ├── style.css            # Complete styling with tricolor theme
│   └── nyaymulya.css        # Additional styles
├── js/
│   ├── main.js              # Main application controller
│   ├── language.js          # 9-language translation system
│   ├── location.js          # Geolocation and market data
│   ├── voice.js             # Speech recognition & synthesis
│   ├── data-fetch.js        # Price data and market insights
│   ├── realDataFetch.js     # Real data integration
│   ├── digitalReceipts.js   # Receipt generation
│   ├── locationPricing.js   # Location-based pricing
│   ├── nyaymulya.js         # Core business logic
│   ├── cursorEffects.js     # Interactive effects
│   ├── interactionEffects.js # User interaction animations
│   ├── background-effects.js # Canvas animations
│   ├── republicDayEffects.js # Republic Day theme effects
│   ├── republicDayBackground.js # Background animations
│   ├── tricolorBackground.js # Tricolor animations
│   └── three-background.js  # 3D background effects
├── assets/
│   ├── icons/               # Application icons
│   └── images/              # Static images
├── manifest.json            # PWA manifest
├── package.json             # Project metadata
├── package-lock.json        # Dependency lock file
└── README.md                # This file
```

## 🎯 Demo Features

### Voice Commands Examples
- **Hindi**: "आलू का भाव क्या है?"
- **Telugu**: "ఉల్లిపాయ రేటు ఎంత?"
- **Tamil**: "வெங்காயம் விலை என்ன?"
- **English**: "What is the potato price?"

### AI Responses
- Market price analysis
- Quality-based pricing suggestions
- Seasonal demand insights
- Negotiation strategies

## 🔧 Configuration

### No Environment Variables Required
This application runs entirely in the browser with no external API dependencies for the demo version.

### Customization Options
```javascript
// Language configuration in js/language.js
const translations = {
    newLanguage: {
        appName: "Translated App Name",
        // ... other translations
    }
};

// Price data configuration in js/data-fetch.js
const mockPriceData = {
    newProduct: {
        min: 10,
        fair: 15,
        max: 20,
        trend: 'stable',
        unit: 'kg'
    }
};
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Republic Day 2026** - Celebrating India's democratic values
- **Viksit Bharat** - Supporting India's development vision
- **Local Vendors** - The backbone of India's economy
- **Open Source Community** - For amazing tools and libraries

## 📞 Support

For support and queries:
- 📧 Email: support@mandimitra.in
- 📱 Phone: 1800-MANDI-AI
- 🌐 Website: [mandimitra.in](https://mandimitra.in)

---

**Made with ❤️ for Bharat** 🇮🇳

*Empowering every vendor, one voice at a time.*
