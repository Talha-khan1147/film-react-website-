# FreeFlix Library 🎬

> **A modern, production-grade movie discovery and streaming web application strictly dedicated to legal, public-domain, and openly licensed films.**

FreeFlix Library connects film lovers, students, researchers, and creators with authentic cinematic heritage preserved in trusted global cultural archives (such as the Internet Archive and Wikimedia Commons).

---

## ⚖️ Strict Legal & Ethical Standards

* **Zero Piracy Guarantee**: The application strictly forbids scraping, linking to, embedding, or downloading unauthorized copyrighted content.
* **No DRM or Restriction Bypass**: Paywalls, DRM protection, authentication layers, and geographical restrictions are never bypassed.
* **Gated Legal Downloads**: A **"Download"** button appears **only** when the verified legal source explicitly provides an official downloadable file (`movie.downloadable === true && movie.legalDownloadUrl`).
* **Streaming-Only Integrity**: If a title is streaming-only or does not authorize downloads, the UI clearly displays **"Watch Online"** and disables or suppresses download options.
* **Transparent Attribution**: Every title includes full copyright/licensing status (Public Domain, Creative Commons CC-BY, CC-BY-SA, CC0) and links back to the original authorized archive.

---

## 🚀 Key Features

1. **Global Search (`<SearchBar />` & `<SearchResults />`)**:
   - Debounced search queries (350ms) to prevent excessive network requests.
   - Interactive live search results dropdown immediately beneath the search bar.
   - Cross-source normalization, query combining, and deduplication.
   - Keyboard accessibility and AbortController request cancellation.
2. **Dedicated Search & Browse Page (`/search`)**:
   - Comprehensive filtering by **Genre**, **License Status** (Public Domain vs. Creative Commons), **Preservation Source**, and **Playback/Download Eligibility**.
   - URL-synchronized query parameters for shareable search states.
   - "Load More" pagination for responsive browsing without loading thousands of items at once.
3. **Film Details Page (`/movie/:id`)**:
   - Full movie metadata: high-resolution poster (with SVG placeholder fallback on `onError`), title, release year, duration, genres, director, overview, and legal status box.
   - Direct CTAs for **Watch Online**, **Download Legally** (with verification modal), and **Add to Favorites**.
   - Curated related film recommendations.
4. **Legal Streaming Player (`/watch/:id`)**:
   - Authorized HTML5 video player with fallback to official archive iframe embeds (`archive.org/embed/{id}`).
   - License banner and link to the source repository.
   - Friendly fallback when online playback is not available: *"Online playback is not available. Visit the official source."*
5. **Personal Favorites Library (`/favorites`)**:
   - Persistent `localStorage` state management using custom `useFavorites()` hook and `MovieContext`.
   - Add/remove toggle from any card or detail page.
   - Batch clear favorites with confirmation modal.
6. **Robust Error & Loading Resilience**:
   - Non-crashing multi-source architecture: If one external API experiences downtime or rate limiting, available sources remain fully functional, and a user-friendly notice is shown.
   - Full React `ErrorBoundary` protecting the entire tree with a "Try Again" recovery action.
   - Skeleton grid and spinner loading states.
7. **Responsive Cinematic Design**:
   - **Desktop (1400px+)**: 6 cards per row.
   - **Desktop (1100px - 1399px)**: 5 cards per row.
   - **Tablet Landscape (850px - 1099px)**: 4 cards per row.
   - **Tablet Portrait (600px - 849px)**: 3 cards per row.
   - **Mobile (< 600px)**: strictly 2 cards per row.
   - Mobile navigation drawer with touch-friendly targets.

---

## 🛠️ Technology Stack

* **React 18** (Component-based architecture, hooks, context)
* **Vite 5** (Ultra-fast build and development tool)
* **React Router v6** (Client-side declarative routing)
* **Modern CSS** (CSS custom properties, CSS Grid, Glassmorphism, zero CSS bloat)
* **Fetch API & AbortController** (Standardized asynchronous network communication)
* **Lucide React** (Clean, accessible SVG iconography)

---

## 📁 Project Architecture

```
freeflix-library/
├── .env                           # Environment variables
├── .env.example                   # Example environment configuration
├── index.html                     # HTML5 entry point
├── package.json                   # Dependencies and scripts
├── vite.config.js                 # Vite configuration
├── README.md                      # Documentation
└── src/
    ├── assets/
    │   ├── icons/
    │   │   └── film.svg           # Brand logo and favicon
    │   └── images/
    │       └── poster-placeholder.svg # Resilient fallback poster
    ├── components/
    │   ├── common/
    │   │   ├── Button.jsx         # Accessible button with variants & loaders
    │   │   ├── Loader.jsx         # Spinner, skeleton-grid, and fullscreen loaders
    │   │   ├── ErrorMessage.jsx   # Friendly non-technical error banners
    │   │   ├── EmptyState.jsx     # Accessible empty states
    │   │   ├── Modal.jsx          # Accessible dialog
    │   │   └── ErrorBoundary.jsx  # Global React error catcher
    │   ├── layout/
    │   │   ├── Navbar.jsx         # Header with desktop nav, mobile drawer, & favorites
    │   │   ├── Footer.jsx         # Legal disclaimers, attribution & source links
    │   │   └── PageContainer.jsx  # Content container with source error notifications
    │   ├── movies/
    │   │   ├── MovieCard.jsx      # Reusable card with lazy poster, badges, & actions
    │   │   ├── MovieGrid.jsx      # Responsive 5-6 / 3-4 / 2 card grid
    │   │   ├── MovieDetails.jsx   # Detailed film view with license verification
    │   │   ├── MoviePlayer.jsx    # Authorized HTML5 video / iframe embed player
    │   │   ├── MovieMeta.jsx      # Reusable metadata chips (license, year, duration)
    │   │   └── DownloadButton.jsx # Gated download button with verification modal
    │   └── search/
    │       ├── SearchBar.jsx      # Debounced search bar with live dropdown
    │       ├── SearchResults.jsx  # Live search results overlay
    │       └── SearchFilters.jsx  # Multi-criteria filter controls
    ├── pages/
    │   ├── Home.jsx               # Hero, search, and curated shelves
    │   ├── SearchPage.jsx         # Dedicated search with filters & pagination
    │   ├── MovieDetailsPage.jsx   # Detailed movie presentation
    │   ├── WatchPage.jsx          # Legal streaming page
    │   ├── FavoritesPage.jsx      # User's saved library
    │   ├── AboutPage.jsx          # Copyright, ethics, & source documentation
    │   └── NotFoundPage.jsx       # 404 page
    ├── services/
    │   ├── api/
    │   │   ├── archiveApi.js      # Internet Archive API adapter
    │   │   ├── wikimediaApi.js    # Wikimedia Commons media API adapter
    │   │   └── movieSources.js    # Verified public domain catalogue
    │   ├── movieService.js        # Multi-source orchestration & deduplication
    │   └── downloadService.js     # Download gating & execution
    ├── hooks/
    │   ├── useMovies.js           # Shelf browsing & pagination hook
    │   ├── useSearch.js           # Debounced search hook with AbortController
    │   └── useFavorites.js        # Persistent favorites hook
    ├── context/
    │   └── MovieContext.jsx       # Shared context for favorites & source health
    ├── utils/
    │   ├── normalizeMovie.js      # Universal movie data normalization
    │   ├── deduplicateMovies.js   # Title/year duplicate resolution
    │   ├── formatDuration.js      # Duration formatting (seconds/minutes to Xh Ym)
    │   └── storage.js             # Safe localStorage wrapper
    ├── constants/
    │   ├── routes.js              # Route constants
    │   └── sources.js             # Source & genre constants
    ├── styles/
    │   ├── variables.css          # Theme variables (colors, fonts, shadows)
    │   ├── global.css             # Base reset, typography, and badges
    │   └── responsive.css         # Responsive column rules (desktop, tablet, mobile)
    ├── App.jsx                    # Root routing shell
    └── main.jsx                   # React 18 DOM mount
```

---

## ⚙️ Installation & Running

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **NPM**: v9.0.0 or higher

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

### 3. Production Build
```bash
npm run build
```
Generates an optimized production bundle in the `dist/` folder.

### 4. Preview Production Build
```bash
npm run preview
```

---

## 🌐 Environment Variables

Environment variables are defined in `.env`:

```env
VITE_INTERNET_ARCHIVE_URL=https://archive.org
VITE_WIKIMEDIA_COMMONS_URL=https://commons.wikimedia.org/w/api.php
VITE_APP_NAME="FreeFlix Library"
```

*Note: FreeFlix Library utilizes open public APIs and never exposes private secret keys.*

---

## 🏛️ Configured Legal Movie Sources

1. **Internet Archive (`archive.org`)**:
   - Accesses `collection:(feature_films OR silent_films OR classic_tv_and_movies)`.
   - Inspects file metadata to discover legitimate `.mp4` video files with formats like `h.264` or `512Kb MPEG4`.
   - Embeds via authorized player `archive.org/embed/{identifier}`.
2. **Wikimedia Commons (`commons.wikimedia.org`)**:
   - Accesses historical public domain video files and Creative Commons media.
   - Extracts machine-readable licensing (`LicenseShortName`, `LicenseUrl`) and original author attribution.
3. **Blender Open Movie Project**:
   - Celebrates open-source films (*Sintel*, *Big Buck Bunny*, *Tears of Steel*) produced under Creative Commons CC-BY 3.0.
4. **Verified Legal Seed Catalogue**:
   - Contains 18 timeless, verified public-domain classics (*Night of the Living Dead*, *His Girl Friday*, *The General*, *Nosferatu*, *The Kid*, *Metropolis*, *Charade*, *A Trip to the Moon*, *Carnival of Souls*, *D.O.A.*, *The Cabinet of Dr. Caligari*, *White Zombie*, *Little Shop of Horrors*, etc.).
   - Ensures guaranteed uptime and catalog browsing even if external APIs throttle requests.

---

## 🔄 How Movie Normalization Works

Different APIs return disparate structures (for example, Internet Archive uses `identifier` and `fl[]`, while Wikimedia uses `pageid` and `imageinfo`).

The `normalizeMovie(raw, sourceName)` utility in [`src/utils/normalizeMovie.js`](src/utils/normalizeMovie.js) converts any external record into a uniform, guaranteed contract:

```javascript
{
  id: "ia_his_girl_friday",
  title: "His Girl Friday",
  year: 1940,
  posterUrl: "https://archive.org/services/img/his_girl_friday",
  description: "A hard-charging newspaper editor uses every trick...",
  genres: ["Comedy", "Drama", "Romance"],
  duration: "1h 32m",
  source: "Internet Archive",
  sourceUrl: "https://archive.org/details/his_girl_friday",
  watchUrl: "/watch/ia_his_girl_friday",
  embedUrl: "https://archive.org/embed/his_girl_friday",
  directStreamUrl: "https://archive.org/download/his_girl_friday/his_girl_friday.mp4",
  legalDownloadUrl: "https://archive.org/download/his_girl_friday/his_girl_friday.mp4",
  license: "Public Domain",
  licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
  downloadable: true,
  fileSize: "548 MB",
  quality: "HD 640x480 / H.264"
}
```

### Strict Normalization Invariants:
* `downloadable` is forced to `false` if `legalDownloadUrl` is null, empty, or missing.
* `posterUrl` automatically defaults to the custom SVG placeholder graphic if no image is supplied.
* `genres` is always guaranteed to be an array of strings.

---

## 🔀 How Cross-Source Deduplication Works

When multiple sources index the same movie, [`src/utils/deduplicateMovies.js`](src/utils/deduplicateMovies.js):
1. Cleans titles into an alphanumeric signature (e.g. `"His Girl Friday"` -> `"hisgirlfriday"`).
2. Pairs the title with the release year (e.g. `"hisgirlfriday_1940"`).
3. Compares metadata completeness (scoring download availability, stream availability, description length, and poster resolution).
4. Retains only the best available copy.

---

## ➕ How to Add Another Legal Source

Adding a new legal source is modular and follows our service adapter architecture:

1. **Create an API adapter in `src/services/api/`** (e.g., `locApi.js` for the Library of Congress):
   ```javascript
   export const locApi = {
     async searchMovies(query, options) {
       const res = await fetch(`https://www.loc.gov/free-to-use/movies/?fo=json`);
       const data = await res.json();
       return data.items.map(item => normalizeMovie(item, 'Library of Congress'));
     }
   };
   ```
2. **Register the source in `src/constants/sources.js`**:
   ```javascript
   LIBRARY_OF_CONGRESS: {
     id: 'loc',
     name: 'Library of Congress',
     homepage: 'https://www.loc.gov',
     licenseStandard: 'Public Domain / U.S. Government Work'
   }
   ```
3. **Connect the adapter in `src/services/movieService.js`** inside `searchMovies()` with standard `try/catch` and `settled` handling.
4. The rest of the application (Search, MovieCard, Filters, Details, Player) will immediately integrate the new source seamlessly without any UI changes!

---

## 📥 How Legal Download URLs are Handled

1. **Strict Evaluation**:
   ```javascript
   // In downloadService.js and DownloadButton.jsx:
   const isEligible = movie.downloadable === true && 
                      Boolean(movie.legalDownloadUrl) &&
                      movie.legalDownloadUrl.startsWith('http');
   ```
2. **No Fake Buttons**: If `isEligible` is false, no download link is constructed. In detail views, it explicitly displays: `Download unavailable (Streaming only)`.
3. **Confirmation Modal**: Clicking "Download Legally" opens an informative modal specifying the exact source archive, license details, file size, and direct URL, giving users confidence in their legal right to download the copy.

---

## 📄 License & Attribution

This software is released under the **MIT License**.
All films catalogued by FreeFlix Library are preserved and provided by their respective cultural archives under Public Domain declarations or Creative Commons licenses.
