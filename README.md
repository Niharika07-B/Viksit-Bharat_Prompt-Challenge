# 🇮🇳 Viksit Vaani – SwarVyapaar 
Checkout here :- https://viskit-vaani-swar-vyapaar.netlify.app/

**Empowering Bharat's Trade Through Voice & AI**

*The Multilingual Mandi – creating a real-time linguistic bridge for local trade*
A revolutionary voice-first, multilingual web platform designed for India's local market vendors, featuring AI-powered price discovery, negotiation assistance, and transparent trade decisions.


<img width="1024" height="1024" alt="image" src="https://github.com/user-attachments/assets/daf3daad-04bb-40db-8457-1aa5c3672e9c" />


---

## 🌟 Republic Day 2026 - Viksit Bharat Theme
<img width="1024" height="367" alt="image" src="https://github.com/user-attachments/assets/a04e6c57-d72f-4246-80b4-1594272fdd1f" />


Built with the spirit of Republic Day and Viksit Bharat, this platform combines traditional Indian market practices with cutting-edge AI technology to empower local vendors across India.

---

# 🎯 Key Features

### 🎤 Voice-First Multilingual Interface
- **5 Indian Languages Supported**: English, Hindi, Telugu, Kannada, Tamil.
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

 <img width="1470" height="919" alt="Screenshot 2026-02-01 at 22 57 16" src="https://github.com/user-attachments/assets/6aa513e2-e9ba-4422-84c7-142dfee0fc67" />
---

## 🎨 Design Philosophy

### Republic Day Inspired UI
- **Tricolor Palette**: Saffron (#ff9933), White (#ffffff), Green (#138808)
- **Ashoka Chakra Blue**: (#3b82f6) for accents
- **Patriotic Elements**: Indian flag, tricolor particles, white doves
- **Clean Government-Grade Design**: Professional, accessible, respectful


![PHOTO-2026-02-01-23-00-24](https://github.com/user-attachments/assets/76802d45-7911-4eaa-bf74-f2f3c7113ff9)

### Mobile-First Approach
- Optimized for low-end smartphones
- Fast loading on slow networks
- Large buttons and clear icons
- Accessibility-friendly fonts and spacing

![PHOTO-2026-02-01-22-59-41](https://github.com/user-attachments/assets/b53d61ba-eebe-4c46-a636-64d0868192ef)

---
# 🛠️ Technology Stack

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

---

# 🚀 Getting Started

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

---

# 📱 Usage Guide

### For Vendors

1. **Voice Price Check**
   - Click the microphone button
   - Say product name in your preferred language
   - Get instant price information

2. **Negotiation Assistant**
   - Enter buyer's offered price
   - Get AI-powered counter-offer suggestions
   - Receive culturally appropriate responses
  
<div align="center">
  <img src="https://github.com/user-attachments/assets/04cf5d84-9404-464b-b4e2-7eea391d7e5c" width="45%" />
  <img src="https://github.com/user-attachments/assets/1cc419ce-a180-4823-9823-bb9fabdbe2d4" width="45%" />
</div>


3. **Inventory Upload**
   - Take photo of products
   - Get AI identification and quality assessment
   - Add to inventory with auto-generated descriptions
  

5. **Transaction History**
   - View all past transactions
   - Generate and download digital receipts
   - Track business performance
  
<div align="center">
<img width="429" height="449" alt="Screenshot 2026-02-02 at 06 37 55" src="https://github.com/user-attachments/assets/c8b5eddc-8e18-4324-8c53-aa0ef4fb7391" />

<img width="429" height="462" alt="Screenshot 2026-02-02 at 06 36 56" src="https://github.com/user-attachments/assets/327c15c9-fa2c-4c36-8a37-d4c0eaa09e17" />
 
</div>

---

# 🌐 Supported Languages

| Language | Native Name | Voice Support | UI Support |
|----------|-------------|---------------|------------|
| English | English | ✅ | ✅ |
| Hindi | हिंदी | ✅ | ✅ |
| Telugu | తెలుగు | ✅ | ✅ |
| Tamil | தமிழ் | ✅ | ✅ |
| Kannada | ಕನ್ನಡ | ✅ | ✅ |

---
# 🏗️ Project Structure

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
---

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
---

# 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---
# 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

# 💜 About Kiro 💜
I’ve truly fallen in love with **Kiro** 💫 — it made building this project so much smoother and more intuitive.  
From AI-assisted integrations to feature walkthroughs, **Kiro helped me at every step** — turning my ideas into reality faster than I imagined.  


<img width="690" height="458" alt="image" src="https://github.com/user-attachments/assets/adb1a27c-41ee-4c65-9807-0489843b78a1" />


If you haven’t explored it yet, I highly recommend giving it a try for your next project. 🚀  

---

# 🧑‍💻 Connect With Me  
Hey! I'm Niharika B – Who loves building emotionally intelligent, visually rich applications ✨  

Let's connect and collaborate as diving into the ocean of knowledge brings nature and technology together 🚀:  

<div align="center">

  <a href="mailto:niharika.bandaru5002@gmail.com">
    <img src="https://img.shields.io/badge/Email-FF9933?style=for-the-badge&logo=gmail&logoColor=white&labelColor=138808" />
  </a>
  
  <a href="https://www.linkedin.com/in/bandaru-niharika/">
    <img src="https://img.shields.io/badge/LinkedIn-FF9933?style=for-the-badge&logo=linkedin&logoColor=white&labelColor=138808" />
  </a>
  
  <a href="https://instagram.com/17_n.i.h.a.r.i.k.a_07">
    <img src="https://img.shields.io/badge/Instagram-FF9933?style=for-the-badge&logo=instagram&logoColor=white&labelColor=138808" />
  </a>
  
  <a href="https://medium.com/@niharika.bandaru5002">
    <img src="https://img.shields.io/badge/Medium-FF9933?style=for-the-badge&logo=medium&logoColor=white&labelColor=138808" />
  </a>
  
  <a href="https://x.com/NihaNiharika777">
    <img src="https://img.shields.io/badge/X-FF9933?style=for-the-badge&logo=x&logoColor=white&labelColor=138808" />
  </a>

</div>

---

**Made with ❤️ for Bharat** 🇮🇳

*Empowering every vendor, one voice at a time.*
