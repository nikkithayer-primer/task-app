# Task Tracker

A mobile-optimized task tracker for logging finances and media consumption. Built for couples to share and track their spending and entertainment choices.

## Features

### 📱 Mobile-First Design
- Fixed tabs at top for easy navigation
- Credit card-style single-line input form at bottom
- Swipe-to-delete functionality
- Responsive design that works on all devices

### 💰 Finance Tracking
- Log purchases with description and cost
- Thumbs up/down for "worth it" rating
- View spending in clean table format
- Track spending patterns over time

### 🎬 Media Tracking
- Log movies, shows, books, etc.
- Thumbs up/down for "worth it" rating
- Keep track of what you've watched
- Share recommendations with your partner

### 🎨 Design
- Midcentury modern color palette
- Minimal, clean interface
- CSS variables for easy customization
- Accessibility-friendly

## Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: Server-side API with local storage fallback
- **Architecture**: Modular JavaScript with separation of concerns

## File Structure

```
task-app/
├── index.html              # Main HTML file
├── styles.css              # All styles with CSS variables
├── js/
│   ├── config.js           # Configuration and settings
│   ├── storage.js          # Data persistence layer
│   ├── ui.js               # User interface management
│   ├── swipe.js            # Touch/swipe gesture handling
│   ├── finance.js          # Finance-specific functionality
│   ├── media.js            # Media-specific functionality
│   └── app.js              # Main application coordinator
└── README.md               # This file
```

## Setup Instructions

### For GitHub Pages Deployment

1. **Clone or download this repository**
2. **Update API configuration** in `js/config.js`:
   ```javascript
   const Config = {
       API_BASE_URL: 'https://your-api-server.com',
       // ... other settings
   };
   ```
3. **Push to GitHub repository**
4. **Enable GitHub Pages** in repository settings
5. **Access your site** at `https://yourusername.github.io/task-app`

### For Server-Side Storage

To enable shared storage between you and your husband, you'll need to:

1. **Set up a backend API** that supports:
   - `GET /finances` - Get all finance entries
   - `POST /finances` - Add new finance entry
   - `DELETE /finances/:id` - Delete finance entry
   - `GET /media` - Get all media entries
   - `POST /media` - Add new media entry
   - `DELETE /media/:id` - Delete media entry

2. **Update the API_BASE_URL** in `js/config.js`

3. **Optional**: Add authentication to prevent unauthorized access

### Fallback Mode

If no server is available, the app automatically falls back to local storage. Each person's data will be stored locally on their device.

## Usage

### Adding Entries
1. **Select tab** (Finances or Media) at the top
2. **Fill in the form** at the bottom of the screen
3. **Toggle thumbs up/down** for "worth it" rating
4. **Tap send button** to save

### Managing Entries
- **View entries** in the table format
- **Swipe left** on any entry to delete it
- **Entries are sorted** by date (newest first)

### Mobile Tips
- Form stays at bottom near keyboard for easy typing
- Tabs stay at top for quick switching
- Swipe gestures work with both touch and mouse

## Customization

### Colors
All colors are defined as CSS variables in `styles.css`:

```css
:root {
    --color-warm-white: #faf9f7;
    --color-sage: #9caf88;
    --color-terracotta: #d2691e;
    /* ... and more */
}
```

### Configuration
App settings can be modified in `js/config.js`:

```javascript
const Config = {
    SWIPE_THRESHOLD: 100,        // pixels to swipe for delete
    SWIPE_TIME_LIMIT: 1000,      // max swipe time (ms)
    DATE_FORMAT: 'DD/MM/YY',     // date display format
};
```

## Browser Support

- **Modern browsers**: Full functionality
- **Safari iOS**: Optimized for iPhone/iPad
- **Chrome Android**: Optimized for Android devices
- **Desktop browsers**: Enhanced experience with mouse support

## Future Enhancements

- [ ] Push notifications for spending alerts
- [ ] Data visualization and charts
- [ ] Export data to CSV/JSON
- [ ] Categories and tags
- [ ] Search and filtering
- [ ] Dark mode support
- [ ] Offline mode with sync

## Contributing

This is a personal project, but suggestions and improvements are welcome!

## License

MIT License - feel free to use and modify for your own needs.

