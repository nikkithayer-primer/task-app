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
- **Backend**: Firebase Firestore (NoSQL database)
- **Storage**: Real-time Firebase sync with local storage fallback
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

### Quick Start with Firebase (Recommended)

This setup provides **real-time syncing** with **no user authentication required** - perfect for couples!

#### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Give it a name like **"task-tracker"**
4. Disable Google Analytics (not needed)
5. Click **"Create project"**

#### Step 2: Set Up Firestore Database
1. In your Firebase project, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (allows read/write without authentication)
4. Select a location close to you
5. Click **"Done"**

#### Step 3: Get Firebase Configuration
1. In Firebase Console, click the **gear icon** → **"Project settings"**
2. Scroll down to **"Your apps"** section
3. Click **"Web app"** icon (`</>`)
4. Give it a name like **"Task Tracker Web"**
5. **Copy the config object** (you'll need this next)

#### Step 4: Update Your App Configuration
1. Open `js/config.js` in your project
2. Replace the Firebase config with your values:
   ```javascript
   FIREBASE: {
       apiKey: "your-api-key-here",
       authDomain: "your-project.firebaseapp.com", 
       projectId: "your-project-id",
       storageBucket: "your-project.appspot.com",
       messagingSenderId: "123456789",
       appId: "your-app-id"
   }
   ```

#### Step 5: Deploy Your App
**Option A: GitHub Pages**
1. Fork this repository
2. Enable GitHub Pages in repository settings
3. Access at `https://yourusername.github.io/task-app`

**Option B: Netlify (Recommended)**
1. Fork this repository
2. Connect to Netlify
3. Deploy automatically
4. Access at your Netlify URL

#### Step 6: Configure Firestore Security (Optional but Recommended)
1. In Firebase Console, go to **Firestore Database** → **Rules**
2. Replace the rules with:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow read/write to finances and media collections
       match /{collection}/{document} {
         allow read, write: if collection in ['finances', 'media'];
       }
     }
   }
   ```
3. Click **"Publish"**

### Data Storage

Firebase provides the best experience:

1. **Real-time sync**: Changes appear instantly on all devices
2. **Offline support**: Works offline, syncs when connection returns  
3. **No authentication**: Anyone with the URL can use it
4. **Automatic backup**: Data cached locally for reliability
5. **Scalable**: Free tier supports plenty of personal use

### Sharing with Your Husband

Simply share the deployed URL! Both of you can:
- Add, edit, and delete entries
- See changes in real-time
- Use it offline (syncs when back online)
- No accounts or tokens needed

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

## Advanced Features

### Real-Time Sync
- **Instant updates**: Changes appear immediately on all devices
- **Live collaboration**: Both users can edit simultaneously
- **Conflict resolution**: Firebase handles concurrent edits automatically
- **Connection status**: Works seamlessly online and offline

### Offline Support
- **Full functionality**: Add, edit, delete entries offline
- **Automatic sync**: Changes sync when connection returns
- **Local cache**: Data always available locally
- **Smart merging**: Firebase resolves conflicts intelligently

## Troubleshooting

### Common Issues

**"Firebase initialization failed"**
- Check your Firebase config in `js/config.js`
- Verify project ID and API key are correct
- Ensure Firestore is enabled in Firebase Console

**"Permission denied" errors**
- Check Firestore security rules
- Ensure rules allow read/write to `finances` and `media` collections
- Try resetting to test mode temporarily

**Data not syncing**
- Check browser console for errors
- Verify internet connection
- Try refreshing the page
- Check Firebase Console for data

**Offline functionality not working**
- Ensure browser supports IndexedDB
- Check if persistence is enabled
- Clear browser cache and try again

### Manual Commands

Open browser console (F12) for debugging:

```javascript
// Check Firebase connection
Storage.isFirebaseAvailable()

// View local storage data
Storage.getFromLocalStorage('finances')
Storage.getFromLocalStorage('media')

// Sync local data to Firestore (migration)
Storage.syncLocalToFirestore()

// Clear all local data
localStorage.clear()
```

### Firebase Console

Monitor your data in real-time:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **"Firestore Database"**
4. View `finances` and `media` collections
5. See real-time updates as you use the app

## Future Enhancements

- [ ] Data visualization and charts
- [ ] Export data to CSV/JSON
- [ ] Categories and tags
- [ ] Search and filtering
- [ ] Dark mode support
- [ ] Conflict resolution for simultaneous edits
- [ ] Data import from other formats

## Contributing

This is a personal project, but suggestions and improvements are welcome!

## License

MIT License - feel free to use and modify for your own needs.

