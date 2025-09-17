# Task Tracker

A simple, elegant task tracker for logging finances and media consumption. Built with vanilla HTML, CSS, and JavaScript for easy hosting on GitHub Pages.

## Features

### 💰 Finance Tracking
- Log spending with description and amount
- Mark whether purchases were "worth it"
- View recent transactions with timestamps
- Delete entries with confirmation

### 🎬 Media Tracking
- Log what you've watched (movies, shows, videos, etc.)
- Mark whether content was "worth it"
- View recent media consumption with timestamps
- Delete entries with confirmation

## Key Benefits

- **No Backend Required**: Uses localStorage for data persistence
- **GitHub Pages Ready**: Pure client-side application
- **Responsive Design**: Works on desktop and mobile devices
- **Modular Architecture**: Easy to extend and customize
- **Modern UI**: Clean, intuitive interface with smooth animations

## Getting Started

### For GitHub Pages Deployment

1. Fork or clone this repository
2. Enable GitHub Pages in your repository settings
3. Select "Deploy from a branch" and choose `main` branch
4. Your site will be available at `https://yourusername.github.io/task-app`

### For Local Development

1. Clone the repository
2. Open `index.html` in your browser
3. Start tracking your finances and media consumption!

## File Structure

```
task-app/
├── index.html          # Main HTML file
├── styles.css          # All CSS styles
├── js/
│   ├── app.js          # Main application initialization
│   ├── storage.js      # localStorage management
│   ├── ui.js           # UI utilities and interactions
│   ├── finance.js      # Finance tracking functionality
│   └── media.js        # Media tracking functionality
└── README.md           # This file
```

## Architecture

The application is built with a modular architecture for easy maintenance and extension:

- **Storage Module**: Handles all localStorage operations with error handling
- **UI Module**: Manages interface interactions, date formatting, and display logic
- **Finance Module**: Handles finance form validation, submission, and display
- **Media Module**: Manages media logging functionality
- **App Module**: Coordinates all modules and handles global functionality

## Extending the Application

The modular structure makes it easy to add new features:

### Adding New Fields

1. Update the HTML form in `index.html`
2. Modify the corresponding module (`finance.js` or `media.js`)
3. Update the `getFormData()` and `validateFormData()` functions
4. Adjust the display logic in the UI module if needed

### Adding New Tabs

1. Add new tab button and content section in `index.html`
2. Create a new JavaScript module following the existing pattern
3. Initialize the new module in `app.js`
4. Update the storage module with new data keys

### Adding Analytics

The modules already include helper functions for statistics:
- `Finance.getStatistics()` - spending analysis
- `Media.getStatistics()` - consumption patterns
- `App.getAppStatistics()` - combined data

## Data Storage

Data is stored in the browser's localStorage:
- Finance entries: `taskTracker_finances`
- Media entries: `taskTracker_media`

Each entry includes:
- Unique ID
- Timestamp
- Description
- Worth it flag
- Amount (finance only)

## Browser Compatibility

Works in all modern browsers that support:
- localStorage
- ES6 features (const, let, arrow functions)
- CSS Grid and Flexbox

## Contributing

This is a personal project, but feel free to fork and customize for your own needs!

## License

MIT License - feel free to use and modify as needed.
