# 🚀 Video Speed Controller

> **The ultimate browser extension for controlling HTML5 video playback speed with style and accessibility**

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

## ✨ What's New in v0.9.5

- 🎨 **Modern UI Design** - Completely redesigned interface with glassmorphism effects and smooth animations
- 🌙 **Dark Mode Support** - Automatic dark/light mode switching based on system preferences
- ⚡ **Enhanced Performance** - Optimized for better performance and reduced memory usage
- ♿ **Accessibility First** - Full screen reader support, keyboard navigation, and high contrast mode
- 📱 **Mobile-Friendly** - Responsive design that works great on all devices
- 🎯 **Visual Feedback** - Real-time notifications and keyboard shortcut indicators
- 🎛️ **Speed Presets** - Quick access buttons for common playback speeds
- 📊 **Speed Indicator** - Visual progress bar showing current playback speed

**TL;DR: Faster playback translates to better engagement and retention.**

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

## Faster HTML5 Video

HTML5 video provides a native API to accelerate playback of any video. The
problem is many players either hide or limit this functionality. For the best
results, playback speed adjustments should be easy and frequent to match the pace
and content being covered: we don't read at a fixed speed, and similarly, we
need an easy way to accelerate the video, slow it down, and quickly rewind the
last point to listen to it a few more times.

![Player](https://cloud.githubusercontent.com/assets/2400185/24076745/5723e6ae-0c41-11e7-820c-1d8e814a2888.png)

## 🎯 Key Features

### 🎮 **Intuitive Controls**
- **Modern Popup Interface** - Sleek popup with current speed display and visual indicators
- **Speed Presets** - One-click access to common speeds (0.5x, 0.75x, 1x, 1.25x, 1.5x, 1.75x, 2x, 2.5x)
- **Fine-Grained Control** - Precise speed adjustments with customizable increments
- **Visual Feedback** - Real-time notifications and smooth animations for all interactions

### ⌨️ **Powerful Keyboard Shortcuts**
- **Smart Detection** - Shortcuts only work when you're not typing in input fields
- **Visual Feedback** - On-screen indicators show which shortcut was pressed
- **Customizable** - Remap any shortcut to your preference in settings

### ♿ **Accessibility Excellence**
- **Screen Reader Support** - Full ARIA labels and live announcements
- **Keyboard Navigation** - Navigate the controller using arrow keys
- **High Contrast Mode** - Automatic detection and enhanced visibility
- **Reduced Motion** - Respects user's motion preferences

### 🎨 **Modern Design**
- **Glassmorphism UI** - Beautiful frosted glass effects with backdrop blur
- **Dark Mode** - Automatic switching based on system preferences
- **Responsive Design** - Works perfectly on all screen sizes
- **Smooth Animations** - Buttery smooth transitions and micro-interactions

## 🚀 Quick Start

### _[📥 Install Chrome Extension](https://chrome.google.com/webstore/detail/video-speed-controller/nffaoalbilbmmfgbnbgppjihopabppdk)_

Once installed, navigate to any page with HTML5 video ([try this example](http://www.youtube.com/watch?v=E9FxNzv1Tr8)). You'll see a modern speed controller in the top-left corner. Click the extension icon for the full control panel, or use these keyboard shortcuts:

## ⌨️ Keyboard Shortcuts

| Key | Action | Description |
|-----|--------|-------------|
| <kbd>S</kbd> | **Decrease Speed** | Slow down playback (customizable increment) |
| <kbd>D</kbd> | **Increase Speed** | Speed up playback (customizable increment) |
| <kbd>R</kbd> | **Reset Speed** | Return to 1.0x normal speed |
| <kbd>Z</kbd> | **Rewind** | Go back 10 seconds |
| <kbd>X</kbd> | **Fast Forward** | Skip ahead 10 seconds |
| <kbd>G</kbd> | **Toggle Preferred** | Switch between current and preferred speed |
| <kbd>V</kbd> | **Toggle Controller** | Show/hide the speed controller |
| <kbd>M</kbd> | **Set Marker** | Mark current position for quick return |
| <kbd>J</kbd> | **Jump to Marker** | Return to previously marked position |

You can customize and reassign the default shortcut keys in the extensions
settings page as well as add additional shortcut keys to match your
preferences. As an example, you can assign multiple "preferred speed" shortcuts with different values, allowing you to quickly toggle between your most frequently used speeds. To add a new shortcut, open extension settings
and click "Add New".
After making changes or adding new settings, remember to refresh the video viewing page for them to take effect.

![settings Add New shortcut](https://user-images.githubusercontent.com/121805/50726471-50242200-1172-11e9-902f-0e5958387617.jpg)

Unfortunately, some sites may assign other functionality to one of the shortcut keys - this is inevitable. As a workaround, the extension
listens both for lower and upper case values (i.e. you can use
`Shift-<shortcut>`) if there is other functionality assigned to the lowercase
key. This is not a perfect solution since some sites may listen to both, but it works
most of the time.

## 🤔 Frequently Asked Questions

### **🎥 The video controls are not showing up?**

This extension only works with **HTML5 video**. If you don't see the controls:

1. **Check if it's HTML5**: Right-click on the video. If you see Flash-related options, that's the issue.
2. **Most modern sites use HTML5** by default, but some older content might still use Flash.
3. **For Flash videos**: The extension cannot control Flash content due to browser security restrictions.

### **📁 Controls not working with local video files?**

To enable the extension for local files (File > Open File):

1. Navigate to `chrome://extensions`
2. Find "Video Speed Controller" in the list
3. Click "Details" and enable **"Allow access to file URLs"**
4. Refresh the page with your local video

### **⌨️ Keyboard shortcuts not working?**

- **Check focus**: Make sure you're not typing in a text field or input box
- **Try clicking the video first**: Some sites require the video to be focused
- **Check for conflicts**: Other extensions might be using the same shortcuts
- **Customize shortcuts**: Go to extension settings to remap conflicting keys

### **🎨 The controller looks different or broken?**

- **Clear browser cache**: Old cached styles might interfere
- **Check for site-specific CSS**: Some sites have custom styles that might conflict
- **Try incognito mode**: This helps identify if other extensions are interfering
- **Update the extension**: Make sure you have the latest version

### **🌙 Dark mode not working?**

The extension automatically detects your system's dark/light mode preference. If it's not working:

- **Check system settings**: Ensure your OS is set to dark mode
- **Browser settings**: Some browsers override system preferences
- **Force refresh**: Try refreshing the page after changing system theme

### **♿ Accessibility features not working?**

- **Screen reader**: Make sure your screen reader is running and updated
- **Keyboard navigation**: Use Tab to focus the controller, then arrow keys to navigate
- **High contrast**: The extension automatically detects Windows high contrast mode
- **Report issues**: Contact us if you encounter accessibility barriers

### License

(MIT License) - Copyright (c) 2014 Ilya Grigorik
