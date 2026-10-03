import React, { useState, useEffect, useMemo } from 'react';
import { WatchlistProvider, useWatchlist } from './context/WatchlistContext';
import { fetchMovies, fetchHomePageCollections } from './services/apiService';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import HomeSearchBar from './components/HomeSearchBar';
import HeroBanner from './components/HeroBanner';
import MovieRow from './components/MovieRow';
import FilterBar from './components/FilterBar';
import MovieDetailModal from './components/MovieDetailModal';
import TrailerPlayerModal from './components/TrailerPlayerModal';
import CinemaPlayerView from './components/CinemaPlayerView';
import WatchlistView from './components/WatchlistView';
import SettingsModal from './components/SettingsModal';
import BookingModal from './components/BookingModal';
import MyTicketsView from './components/MyTicketsView';
import { Flame, Star, Zap, Film, Tv, Sparkles, Filter, Search, Clapperboard, Compass, Key, Globe, AlertCircle, RefreshCw, Calendar, Ticket } from 'lucide-react';
import MovieCard from './components/MovieCard';
import './index.css';

function MainApp() {
  const { tmdbApiKey, selectedLanguage, setSelectedLanguage } = useWatchlist();
  
  // Navigation & Filter State
  const [currentTab, setCurrentTab] = useState('home'); // 'home' | 'explore' | 'watchlist' | 'tickets' | 'cinema'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [mediaType, setMediaType] = useState('all');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [minRating, setMinRating] = useState(0);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Movie Data Collections (100% Real from TMDB)
  const [homeCollections, setHomeCollections] = useState({
    trending: [],
    topRated: [],
    action: [],
    upcoming: []
  });

  const [exploreMovies, setExploreMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Modals & Active Selections
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerMovie, setTrailerMovie] = useState(null);
  const [bookingMovie, setBookingMovie] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Combine all movies for instant live search
  const allMoviesCombined = useMemo(() => {
    const map = new Map();
    const list = [
      ...homeCollections.trending,
      ...homeCollections.topRated,
      ...homeCollections.action,
      ...homeCollections.upcoming,
      ...exploreMovies
    ];
    list.forEach(m => {
      if (m && m.id && !map.has(m.id)) {
        map.set(m.id, m);
      }
    });
    return Array.from(map.values());
  }, [homeCollections, exploreMovies]);

  // Load Real TMDB Collections for Home Page
  useEffect(() => {
    if (!tmdbApiKey) return;
    setLoading(true);
    fetchHomePageCollections(tmdbApiKey, selectedLanguage)
      .then(collections => {
        setHomeCollections(collections);
        setLoading(false);
      })
      .catch(err => {
        console.error('Home collections error:', err);
        setErrorMsg('Failed to load collections from TMDB API');
        setLoading(false);
      });
  }, [tmdbApiKey, selectedLanguage]);

  // Load Real TMDB Movies for Explore / Search Tab
  useEffect(() => {
    if (!tmdbApiKey) return;
    setLoading(true);
    fetchMovies({
      apiKey: tmdbApiKey,
      query: searchQuery,
      genre: selectedGenre,
      language: selectedLanguage,
      sortBy: sortBy
    }).then(results => {
      setExploreMovies(results);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setErrorMsg(err.message || 'Failed to connect to TMDB API');
      setLoading(false);
    });
  }, [tmdbApiKey, searchQuery, selectedGenre, selectedLanguage, sortBy]);

  // Filter Catalog
  const processedExploreMovies = useMemo(() => {
    let list = [...exploreMovies];
    if (minRating > 0) {
      list = list.filter(m => m.rating >= minRating);
    }
    return list;
  }, [exploreMovies, minRating]);

  // Hero Movies for Slider
  const heroMovies = useMemo(() => homeCollections.trending.slice(0, 5), [homeCollections.trending]);

  return (
    <div className="cineverse-app">
      {/* Top Navigation Bar */}
      {currentTab !== 'cinema' && (
        <Navbar 
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenSettings={() => setIsSettingsOpen(true)}
          allMovies={allMoviesCombined}
          onSelectMovie={(m) => setSelectedMovie(m)}
          onBookMovie={(m) => setBookingMovie(m)}
          isMobileSearchOpen={isMobileSearchOpen}
          setIsMobileSearchOpen={setIsMobileSearchOpen}
        />
      )}

      {/* Main Viewport */}
      <main className="main-viewport">
        {/* Missing API Key Setup Alert Banner */}
        {!tmdbApiKey && (
          <div className="api-required-banner">
            <div className="api-required-container">
              <Key className="key-icon animate-bounce" />
              <div className="api-text">
                <h2>TMDB API Key Required for Real Data</h2>
                <p>
                  To stream live real-time movies, posters, cast, and recommendations directly from TMDB, enter your API key in <code>.env</code> file (<code>VITE_TMDB_API_KEY</code>) or click below.
                </p>
              </div>
              <button className="setup-key-btn" onClick={() => setIsSettingsOpen(true)}>
                <Key className="btn-icon" /> Configure API Key
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: HOME PAGE */}
        {currentTab === 'home' && (
          <div className="home-page">
            {/* Hero Banner Spotlight Carousel */}
            {heroMovies.length > 0 && (
              <HeroBanner 
                heroMovies={heroMovies}
                onSelectMovie={(m) => setSelectedMovie(m)}
                onPlayTrailer={(m) => setTrailerMovie(m)}
                onBookMovie={(m) => setBookingMovie(m)}
              />
            )}

            {/* Standalone Interactive Search Bar */}
            <HomeSearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              onSearchSubmit={(q) => {
                if (q.trim() !== '') {
                  setCurrentTab('explore');
                }
              }}
            />

            {/* Quick Language Selection Bar */}
            <div className="home-quick-tags">
              <button 
                className={selectedLanguage === 'te' ? 'active-lang-pill' : ''} 
                onClick={() => setSelectedLanguage('te')}
              >
                🎬 Telugu Cinema (తెలుగు)
              </button>
              <button 
                className={selectedLanguage === 'hi' ? 'active-lang-pill' : ''} 
                onClick={() => setSelectedLanguage('hi')}
              >
                🔥 Hindi Cinema
              </button>
              <button 
                className={selectedLanguage === 'ta' ? 'active-lang-pill' : ''} 
                onClick={() => setSelectedLanguage('ta')}
              >
                🌟 Tamil Cinema
              </button>
              <button 
                className={selectedLanguage === 'en' ? 'active-lang-pill' : ''} 
                onClick={() => setSelectedLanguage('en')}
              >
                🌐 Global Hollywood
              </button>
              <button 
                className={selectedLanguage === 'all' ? 'active-lang-pill' : ''} 
                onClick={() => setSelectedLanguage('all')}
              >
                ✨ All World Cinema
              </button>
            </div>

            {/* Loading Indicator */}
            {loading && (
              <div className="live-loading-state">
                <RefreshCw className="animate-spin loading-icon" />
                <span>Requesting 100% real live data from TMDB API...</span>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="api-error-state">
                <AlertCircle className="error-icon" />
                <h3>{errorMsg}</h3>
                <p>Please check your TMDB API credentials in <code>.env</code> file.</p>
              </div>
            )}

            {/* Real Movie Rows */}
            {homeCollections.trending.length > 0 && (
              <div className="home-content-rows">
                <MovieRow 
                  title={selectedLanguage === 'te' ? "Trending Telugu Blockbusters" : "Trending Now worldwide"}
                  icon={Flame}
                  movies={homeCollections.trending}
                  onSelectMovie={(m) => setSelectedMovie(m)}
                  onPlayTrailer={(m) => setTrailerMovie(m)}
                  onBookMovie={(m) => setBookingMovie(m)}
                />

                {homeCollections.topRated.length > 0 && (
                  <MovieRow 
                    title="Top Rated Masterpieces (TMDB Rated)"
                    icon={Star}
                    movies={homeCollections.topRated}
                    onSelectMovie={(m) => setSelectedMovie(m)}
                    onPlayTrailer={(m) => setTrailerMovie(m)}
                    onBookMovie={(m) => setBookingMovie(m)}
                  />
                )}

                {homeCollections.action.length > 0 && (
                  <MovieRow 
                    title="High-Octane Action & Adventure"
                    icon={Clapperboard}
                    movies={homeCollections.action}
                    onSelectMovie={(m) => setSelectedMovie(m)}
                    onPlayTrailer={(m) => setTrailerMovie(m)}
                    onBookMovie={(m) => setBookingMovie(m)}
                  />
                )}

                {homeCollections.upcoming.length > 0 && (
                  <MovieRow 
                    title="New & Upcoming Releases"
                    icon={Calendar}
                    movies={homeCollections.upcoming}
                    onSelectMovie={(m) => setSelectedMovie(m)}
                    onPlayTrailer={(m) => setTrailerMovie(m)}
                    onBookMovie={(m) => setBookingMovie(m)}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: EXPLORE & BROWSE CATALOG PAGE */}
        {currentTab === 'explore' && (
          <div className="explore-page">
            <div className="page-header">
              <h1>
                <Compass className="header-icon" /> Real-Time Cinema Catalog & Booking
              </h1>
              <p>Select any movie based on ratings & reviews to book your 200-seat theater tickets.</p>
            </div>

            {/* Interactive Search Bar in Explore View */}
            <HomeSearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
            />

            {/* Filter Bar */}
            <FilterBar 
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
              mediaType={mediaType}
              setMediaType={setMediaType}
              sortBy={sortBy}
              setSortBy={setSortBy}
              minRating={minRating}
              setMinRating={setMinRating}
            />

            {/* Search result indicator */}
            {searchQuery && (
              <div className="search-result-label">
                <Search className="icon" /> Live search results for "<strong>{searchQuery}</strong>" 
                <span className="count">({processedExploreMovies.length} found)</span>
              </div>
            )}

            {/* Grid View */}
            {processedExploreMovies.length > 0 ? (
              <div className="explore-grid">
                {processedExploreMovies.map(movie => (
                  <MovieCard 
                    key={movie.id}
                    movie={movie}
                    onSelectMovie={(m) => setSelectedMovie(m)}
                    onPlayTrailer={(m) => setTrailerMovie(m)}
                    onBookMovie={(m) => setBookingMovie(m)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-catalog-state">
                <Filter className="empty-icon" />
                <h3>No movies found for current search/filters</h3>
                <p>Try clearing search text or choosing another genre.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: MY TICKETS & BOOKINGS DASHBOARD */}
        {currentTab === 'tickets' && (
          <MyTicketsView 
            onNavigateHome={() => setCurrentTab('home')}
          />
        )}

        {/* Tab 4: MY WATCHLIST & FAVORITES PAGE */}
        {currentTab === 'watchlist' && (
          <WatchlistView 
            allMovies={allMoviesCombined}
            onSelectMovie={(m) => setSelectedMovie(m)}
            onPlayTrailer={(m) => setTrailerMovie(m)}
          />
        )}

        {/* Tab 5: THEATER / CINEMA PLAYER MODE */}
        {currentTab === 'cinema' && (
          <CinemaPlayerView 
            movie={selectedMovie || homeCollections.trending[0]}
            onBackToHome={() => setCurrentTab('home')}
            allMovies={homeCollections.trending}
            onSelectMovie={(m) => setSelectedMovie(m)}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Visible on screens < 900px) */}
      {currentTab !== 'cinema' && (
        <MobileBottomNav 
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          onOpenMobileSearch={() => setIsMobileSearchOpen(true)}
        />
      )}

      {/* Footer */}
      {currentTab !== 'cinema' && (
        <footer className="cineverse-footer">
          <div className="footer-container">
            <div className="footer-brand">
              <span className="brand-logo">CINE<span>VERSE</span></span>
              <p>100% Movie Booking Platform with 200-Seat Layout & Interval F&B Delivery.</p>
            </div>
            <div className="footer-links">
              <span>Selected Language: {selectedLanguage.toUpperCase()}</span>
              <span>•</span>
              <span>Screen 1: Dolby Atmos 200-Seat</span>
              <span>•</span>
              <span>Instant QR Ticket Generation</span>
            </div>
            <p className="copyright">© 2026 CineVerse Ticket Matrix Inc.</p>
          </div>
        </footer>
      )}

      {/* Detail View Modal */}
      {selectedMovie && (
        <MovieDetailModal 
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onPlayTrailer={(m) => setTrailerMovie(m)}
          onSelectMovie={(m) => setSelectedMovie(m)}
          onBookMovie={(m) => setBookingMovie(m)}
        />
      )}

      {/* Booking Modal (Interactive 200-Seat Grid & Interval F&B) */}
      {bookingMovie && (
        <BookingModal 
          movie={bookingMovie}
          onClose={() => setBookingMovie(null)}
          onBookingSuccess={(tkt) => {
            setBookingMovie(null);
            setCurrentTab('tickets');
          }}
        />
      )}

      {/* Trailer Video Player Overlay */}
      {trailerMovie && (
        <TrailerPlayerModal 
          movie={trailerMovie}
          onClose={() => setTrailerMovie(null)}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal 
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <WatchlistProvider>
      <MainApp />
    </WatchlistProvider>
  );
}
