# The science of accelerated playback

| Chrome Extension                                                       | Downloads                                                                        | GitHub Release                                                 |
|------------------------------------------------------------------------|----------------------------------------------------------------------------------|----------------------------------------------------------------|
| [![Chrome Web Store][chrome-web-store-version]][chrome-web-store-link] | [![Chrome Web Store Users][chrome-web-store-users-badge]][chrome-web-store-link] | [![GitHub release][github-release-badge]][github-release-link] |

<!-- Badges -->
[chrome-web-store-version]: https://img.shields.io/chrome-web-store/v/nffaoalbilbmmfgbnbgppjihopabppdk?label=Chrome%20Web%20Store
[chrome-web-store-users-badge]: https://img.shields.io/chrome-web-store/users/nffaoalbilbmmfgbnbgppjihopabppdk
[github-release-badge]: https://img.shields.io/github/v/release/igrigorik/videospeed

<!-- Links -->
[chrome-web-store-link]: https://chrome.google.com/webstore/detail/poe2-trade-butler/nffaoalbilbmmfgbnbgppjihopabppdk
[github-release-link]: https://github.com/igrigorik/videospeed/releases

**TL;DR: faster playback translates to better engagement and retention.**

The average adult reads prose text at
[250 to 300 words per minute](http://www.paperbecause.com/PIOP/files/f7/f7bb6bc5-2c4a-466f-9ae7-b483a2c0dca4.pdf)
(wpm). By contrast, the average rate of speech for English speakers is ~150 wpm,
with slide presentations often closer to 100 wpm. As a result, when given the
choice, many viewers
[speed up video playback to ~1.3\~1.5 its recorded rate](http://research.microsoft.com/en-us/um/redmond/groups/coet/compression/chi99/paper.pdf)
to compensate for the difference.

Many viewers report that
[accelerated viewing keeps their attention longer](http://www.enounce.com/docs/BYUPaper020319.pdf):
faster delivery keeps the viewer more engaged with the content. In fact, with a
little training many end up watching videos at 2x+ the recorded speed. Some
studies report that after being exposed to accelerated playback,
[listeners become uncomfortable](http://alumni.media.mit.edu/~barons/html/avios92.html#beasleyalteredspeech)
if they are forced to return to normal rate of presentation.

---

## 🚀 **Installation & Setup**

### **Method 1: Install from Source (Recommended for Latest Features)**

1. **Clone this repository:**
   ```bash
   git clone https://github.com/Abhijayshah/video-speed-controller.git
   cd video-speed-controller
   ```

2. **Install dependencies and build:**
   ```bash
   npm install
   npm run build
   ```

3. **Load in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked" and select the `dist` folder
   - The extension is now installed and ready to use!

### **Method 2: Chrome Web Store (Original Version)**
- [📥 Install from Chrome Web Store](https://chrome.google.com/webstore/detail/video-speed-controller/nffaoalbilbmmfgbnbgppjihopabppdk) *(Note: This is the original version without the enhancements)*

---

## 🎮 **How to Use**

### **Quick Start**
1. **Navigate to any video page** ([try YouTube](https://www.youtube.com/watch?v=dQw4w9WgXcQ))
2. **See the speed controller** appear in the top-left corner of the video
3. **Click the extension icon** in your browser toolbar for the full control panel
4. **Use keyboard shortcuts** for instant speed control (see table below)

### **Interface Overview**
- **🎯 Speed Controller Overlay**: Appears on video pages with current speed and quick controls
- **🎛️ Popup Interface**: Click extension icon for detailed controls and analytics
- **⌨️ Keyboard Shortcuts**: Universal shortcuts that work on any video page
- **📊 Analytics Dashboard**: Track your usage patterns and preferences

![Player](https://cloud.githubusercontent.com/assets/2400185/24076745/5723e6ae-0c41-11e7-820c-1d8e814a2888.png)

### **Keyboard Shortcuts**

Once the extension is installed simply navigate to any page that offers
HTML5 video ([example](http://www.youtube.com/watch?v=E9FxNzv1Tr8)), and you'll
see a speed indicator in top left corner. Hover over the indicator to reveal the
controls to accelerate, slowdown, and quickly rewind or advance the video. Or,
even better, simply use your keyboard:

- **S** - decrease playback speed.
- **D** - increase playback speed.
- **R** - reset playback speed to 1.0x.
- **Z** - rewind video by 10 seconds.
- **X** - advance video by 10 seconds.
- **G** - toggle between current and user configurable preferred speed.
- **V** - show/hide the controller.
- **M** - set a marker at the current playback position.
- **J** - jump back to the previously set marker.

### **Customization Options**
- **Remap Shortcuts**: Customize any keyboard shortcut in extension settings
- **Speed Increments**: Configure how much speed changes with each adjustment
- **Preferred Speeds**: Set multiple preferred speeds for quick toggling
- **Display Settings**: Control when and how the controller appears
- **Site-Specific Settings**: Different configurations for different websites

### **Smart Conflict Resolution**
- **Automatic Detection**: Extension detects when you're typing in input fields
- **Case Sensitivity**: Use `Shift+Key` if lowercase conflicts with site shortcuts
- **Site Compatibility**: Extensive testing across popular video platforms
- **Fallback Options**: Multiple ways to access controls if shortcuts conflict

---

## 🔧 **Technical Implementation**

### **Architecture Overview**
```
📁 Extension Structure
├── 🎨 UI Components
│   ├── Modern Popup Interface (HTML/CSS/JS)
│   ├── Video Overlay Controller
│   ├── Notification System
│   └── Accessibility Features
├── 🧠 Core Logic
│   ├── Video Detection & Control
│   ├── Settings Management
│   ├── Keyboard Event Handling
│   └── State Management
├── 📊 Analytics Engine
│   ├── Privacy-Focused Tracking
│   ├── Usage Statistics
│   └── Data Export/Import
└── 🔧 Site Handlers
    ├── YouTube Optimization
    ├── Netflix Compatibility
    ├── Amazon Prime Support
    └── Universal HTML5 Support
```

### **Key Technologies**
- **Manifest V3**: Latest Chrome extension standard
- **ES6+ Modules**: Modern JavaScript architecture
- **CSS Custom Properties**: Dynamic theming system
- **Web Components**: Isolated, reusable UI elements
- **ARIA Standards**: Full accessibility compliance
- **Local Storage API**: Privacy-focused data management

### **Performance Optimizations**
- **Hardware Acceleration**: CSS transforms for smooth animations
- **Efficient DOM Queries**: Optimized element selection and caching
- **Event Debouncing**: Prevents excessive API calls
- **Memory Management**: Proper cleanup and garbage collection
- **Lazy Loading**: Components load only when needed

### FAQ

**The video controls are not showing up?** This extension is only compatible
with HTML5 video. If you don't see the controls showing up, chances are you are
viewing a Flash video. If you want to confirm, try right-clicking on the video
and inspect the menu: if it mentions flash, then that's the issue. That said,
most sites will fallback to HTML5 if they detect that Flash it not available.
You can try manually disabling Flash plugin in Chrome:

- In a new tab, navigate to `chrome://settings/content/flash`
- Disable "Allow sites to run Flash"
- Restart your browser and try playing your video again

**The speed controls are not showing up for local videos?** To enable playback
of local media (e.g. File > Open File), you need to grant additional permissions
to the extension.

- In a new tab, navigate to `chrome://extensions`
- Find "Video Speed Controller" extension in the list and enable "Allow access
  to file URLs"
- Open a new tab and try opening a local file; the controls should show up.

---

## 🛠️ **Development & Contributing**

### **Development Setup**
```bash
# Clone the repository
git clone https://github.com/Abhijayshah/video-speed-controller.git
cd video-speed-controller

# Install dependencies
npm install

# Start development mode (auto-rebuild on changes)
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Package for distribution
npm run zip
```

### **Project Structure**
```
src/
├── 🎨 ui/                    # User Interface Components
│   ├── popup/               # Extension popup (HTML/CSS/JS)
│   ├── accessibility.js     # Screen reader & keyboard navigation
│   ├── analytics.js         # Privacy-focused usage tracking
│   ├── keyboard-feedback.js # Visual shortcut indicators
│   └── notification.js      # Toast notification system
├── 🧠 core/                  # Core Functionality
│   ├── action-handler.js    # Speed control logic
│   ├── settings.js          # Configuration management
│   ├── video-controller.js  # Video element control
│   └── state-manager.js     # Application state
├── 🔍 observers/             # DOM Monitoring
│   ├── media-observer.js    # Video element detection
│   └── mutation-observer.js # DOM change monitoring
├── 🌐 site-handlers/         # Site-Specific Optimizations
│   ├── youtube-handler.js   # YouTube compatibility
│   ├── netflix-handler.js   # Netflix optimization
│   └── base-handler.js      # Universal handler
└── 🎨 styles/               # Styling
    └── inject.css           # Modern UI styles
```

### **Testing**
- **115 Unit Tests**: Comprehensive test coverage
- **Integration Tests**: End-to-end functionality testing
- **E2E Tests**: Browser automation testing
- **Accessibility Tests**: Screen reader and keyboard navigation
- **Performance Tests**: Memory usage and speed optimization

### **Contributing Guidelines**
1. **Fork the repository** and create a feature branch
2. **Follow the existing code style** (ESLint configuration provided)
3. **Add tests** for new functionality
4. **Update documentation** for any new features
5. **Ensure all tests pass** before submitting PR
6. **Test across multiple sites** (YouTube, Netflix, etc.)

### **Code Quality Standards**
- **ESLint**: Enforced code style and quality
- **Prettier**: Consistent code formatting
- **JSDoc**: Comprehensive code documentation
- **Semantic Versioning**: Clear version management
- **Git Hooks**: Pre-commit quality checks

---

## 📊 **Analytics & Privacy**

### **What We Track (Locally Only)**
- **Speed Preferences**: Your most-used playback speeds
- **Keyboard Usage**: Which shortcuts you use most
- **Site Statistics**: Which websites you use the extension on
- **Session Data**: Usage patterns and frequency

### **Privacy Commitment**
- ✅ **100% Local Storage**: No data sent to external servers
- ✅ **No Personal Information**: No tracking of personal data
- ✅ **User Control**: Export or delete your data anytime
- ✅ **Transparent**: Open source code for full transparency
- ✅ **Optional**: Analytics can be disabled in settings

### **Data Export**
Your analytics data can be exported as JSON for:
- **Personal Analysis**: Understand your viewing habits
- **Data Portability**: Move data between devices
- **Research**: Contribute to speed control research (anonymously)

---

## 🌟 **Supported Platforms & Sites**

### **Browsers**
- ✅ **Chrome** (Primary support)
- ✅ **Chromium-based browsers** (Edge, Brave, Opera)
- ⚠️ **Firefox** (Original version available)

### **Video Platforms**
- ✅ **YouTube** (Optimized integration)
- ✅ **Netflix** (Full compatibility)
- ✅ **Amazon Prime Video** (Enhanced support)
- ✅ **Vimeo** (Complete functionality)
- ✅ **Facebook/Meta** (Video support)
- ✅ **Apple TV+** (Streaming support)
- ✅ **Educational Platforms** (Coursera, Udemy, Khan Academy)
- ✅ **Local Video Files** (With proper permissions)
- ✅ **Any HTML5 Video** (Universal compatibility)

---

## 🏆 **Comparison with Original**

| Feature | Original Extension | Enhanced Version |
|---------|-------------------|------------------|
| **UI Design** | Basic overlay | Modern glassmorphism with animations |
| **Dark Mode** | ❌ Not supported | ✅ Automatic system detection |
| **Accessibility** | ❌ Limited | ✅ Full ARIA support & screen readers |
| **Analytics** | ❌ None | ✅ Privacy-focused local analytics |
| **Visual Feedback** | ❌ Minimal | ✅ Rich notifications & indicators |
| **Mobile Support** | ❌ Poor | ✅ Fully responsive design |
| **Keyboard Shortcuts** | ✅ Basic | ✅ Enhanced with visual feedback |
| **Speed Presets** | ❌ None | ✅ One-click preset buttons |
| **Documentation** | ✅ Basic | ✅ Comprehensive with examples |
| **Performance** | ✅ Good | ✅ Optimized with hardware acceleration |

---

## 🤝 **Acknowledgments**

This enhanced version is built upon the excellent foundation of the original [Video Speed Controller](https://github.com/igrigorik/videospeed) by [Ilya Grigorik](https://github.com/igrigorik). 

### **Original Contributors**
- **Ilya Grigorik** - Original creator and maintainer
- **Community Contributors** - Bug fixes and feature additions

### **Enhanced Version**
- **Abhijay Shah** - Complete UI/UX redesign, accessibility features, analytics system

---

## 📄 **License**

MIT License - Copyright (c) 2024 Abhijay Shah

Based on the original Video Speed Controller:
MIT License - Copyright (c) 2014 Ilya Grigorik

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## 🚀 **Future Roadmap**

### **Planned Features**
- 🎵 **Audio-only controls** for podcasts and music
- 🎬 **Video bookmarking** system with timestamps
- 🔄 **Sync settings** across devices
- 🎯 **Advanced analytics** with usage insights
- 🌍 **Multi-language support** for international users
- 🎮 **Gamepad support** for media center usage

### **Community Requests**
Have an idea for improvement? [Open an issue](https://github.com/Abhijayshah/video-speed-controller/issues) or contribute directly!

---

<div align="center">

**⭐ If this extension helps you, please consider giving it a star on GitHub! ⭐**

[🌟 Star this Repository](https://github.com/Abhijayshah/video-speed-controller) | [🐛 Report Issues](https://github.com/Abhijayshah/video-speed-controller/issues) | [💡 Request Features](https://github.com/Abhijayshah/video-speed-controller/issues/new)

</div>
