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
- **Storage**: GitHub API with local storage fallback
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

### Quick Start (GitHub Pages + GitHub Storage)

1. **Fork this repository** to your GitHub account
2. **Enable GitHub Pages** in repository settings (Pages → Source: Deploy from a branch → main)
3. **Update configuration** in `js/config.js`:
   ```javascript
   GITHUB: {
       OWNER: 'your-username', // Your GitHub username
       REPO: 'task-app',       // Your repository name
       BRANCH: 'main',         // Your default branch
       // ... other settings stay the same
   }
   ```
4. **Access your site** at `https://yourusername.github.io/task-app`
5. **Set up GitHub token** (see below)

### GitHub Token Setup

To enable data syncing between devices, you need a GitHub Personal Access Token:

#### Step 1: Create Token
1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. Give it a name like **"Task Tracker"**
4. Set expiration (recommend "No expiration" for convenience)
5. Select scopes:
   - For **public repository**: Check `public_repo`
   - For **private repository**: Check `repo`
6. Click **"Generate token"**
7. **Copy the token immediately** (you won't see it again!)

#### Step 2: Add Token to App
1. Open your task tracker site
2. A setup modal will appear automatically
3. Paste your token and click **"Save Token"**
4. Or skip for local-only storage

#### Alternative: Manual Setup
```javascript
// In browser console:
Config.setGitHubToken('your_token_here');
```

### Data Storage

The app uses a hybrid approach:

1. **Primary**: GitHub repository (`data/finances.json` and `data/media.json`)
2. **Fallback**: Browser localStorage (when GitHub unavailable)
3. **Sync**: Automatic backup to localStorage for offline access

### Repository Structure

After first use, your repository will contain:
```
task-app/
├── data/
│   ├── finances.json    # Your finance entries
│   └── media.json       # Your media entries
├── js/
├── index.html
└── ... (other app files)
```

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

## Sharing Data

### For Couples/Multiple Users

Both you and your husband can access the same data:

1. **Same GitHub account**: Both use the same token (easiest)
2. **Separate accounts**: Add collaborator to repository
   - Go to repository Settings → Manage access
   - Click "Add people" 
   - Add your husband's GitHub username
   - He can then create his own token with access to your repo

### Privacy & Security

- **Tokens**: Store securely, don't share publicly
- **Repository**: Can be private (requires `repo` scope) or public (`public_repo` scope)
- **Data**: Stored as JSON files in your GitHub repository
- **Backup**: Always synced to localStorage for offline access

## Troubleshooting

### Common Issues

**"GitHub API error: 401"**
- Token expired or invalid
- Wrong scopes selected
- Solution: Generate new token with correct scopes

**"GitHub API error: 404"**
- Repository name/owner incorrect in config.js
- Solution: Check OWNER and REPO settings

**Data not syncing**
- Check browser console for errors
- Verify token is saved: `Config.getGitHubToken()`
- Try manual sync: `Storage.syncLocalToGitHub()`

**Rate limiting**
- GitHub allows 5000 API calls/hour with token
- For normal use, you won't hit this limit
- If you do, data falls back to localStorage

### Manual Commands

Open browser console (F12) for advanced operations:

```javascript
// Check current token
Config.getGitHubToken()

// Set new token
Config.setGitHubToken('your_new_token')

// Force sync local data to GitHub
Storage.syncLocalToGitHub()

// Clear all local data
localStorage.clear()
```

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

