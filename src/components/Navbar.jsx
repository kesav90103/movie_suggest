import React, { useState, useEffect, useRef } from 'react';
import { 
  Film, Search, Bookmark, PlayCircle, Settings, SlidersHorizontal, 
  Sparkles, X, Globe, Ticket, Utensils, Star, ArrowRight, Flame, ChevronRight
} from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { LANGUAGES } from '../data/moviesData';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  searchQuery, 
  setSearchQuery, 
  onOpenSettings,
  allMovies = [],
  onSelectMovie,
  onBookMovie,
  isMobileSearchOpen,
  setIsMobileSearchOpen
}) {
  const { watchlist, bookings, tmdbApiKey, selectedLanguage, setSelectedLanguage } = useWatchlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  // Trending search tags for quick suggestions
  const QUICK_TAGS = [
    'Pushpa 2', 'Devara', 'Kalki 2898 AD', 'Dolby Atmos', '4K Ultra HD', 'Top Rated', 'Action', 'Telugu'
  ];

  // Scroll Listener for Glassmorphism Top Bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut listener (Ctrl+K or /) to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        if (searchInputRef.current) searchInputRef.current.focus();
      } else if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
        if (searchInputRef.current) searchInputRef.current.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter matching live movie suggestions for dropdown preview
  const liveSuggestions = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allMovies.filter(m => 
      m.title.toLowerCase().includes(q) || 
      (m.genreNames && m.genreNames.some(g => g.toLowerCase().includes(q))) ||
      (m.overview && m.overview.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [searchQuery, allMovies]);

  const handleSelectSuggestion = (movie) => {
    setIsFocused(false);
    setIsSearchOpen(false);
    if (setIsMobileSearchOpen) setIsMobileSearchOpen(false);
    if (onSelectMovie) onSelectMovie(movie);
  };

  const handleQuickTagClick = (tag) => {
    setSearchQuery(tag);
    if (currentTab !== 'explore') setCurrentTab('explore');
    if (searchInputRef.current) searchInputRef.current.focus();
    if (mobileSearchInputRef.current) mobileSearchInputRef.current.focus();
  };

  return (
    <>
      <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          {/* Brand Logo */}
          <div className="navbar-brand" onClick={() => setCurrentTab('home')}>
            <div className="brand-icon-wrapper">
              <Ticket className="brand-icon" />
            </div>
            <span className="brand-name">
              CINE<span className="brand-highlight">VERSE</span>
            </span>
            <span className="brand-badge">200-SEAT BOX OFFICE</span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="navbar-links">
            <button 
              className={`nav-link ${currentTab === 'home' ? 'active' : ''}`}
              onClick={() => setCurrentTab('home')}
            >
              Home
            </button>
            <button 
              className={`nav-link ${currentTab === 'explore' ? 'active' : ''}`}
              onClick={() => setCurrentTab('explore')}
            >
              Explore Movies
            </button>
            <button 
              className={`nav-link ticket-link ${currentTab === 'tickets' ? 'active' : ''}`}
              onClick={() => setCurrentTab('tickets')}
            >
              <Ticket className="nav-icon" />
              My Tickets
              {bookings.length > 0 && (
                <span className="nav-badge">{bookings.length}</span>
              )}
            </button>
            <button 
              className={`nav-link ${currentTab === 'watchlist' ? 'active' : ''}`}
              onClick={() => setCurrentTab('watchlist')}
            >
              <Bookmark className="nav-icon" />
              Watchlist
              {watchlist.length > 0 && (
                <span className="nav-badge">{watchlist.length}</span>
              )}
            </button>
            <button 
              className={`nav-link cinema-link ${currentTab === 'cinema' ? 'active' : ''}`}
              onClick={() => setCurrentTab('cinema')}
            >
              <PlayCircle className="nav-icon glowing-icon" />
              Theater Mode
            </button>
          </nav>

          {/* Right Actions: Language Selector, Desktop Search Bar & Settings */}
          <div className="navbar-actions">
            {/* Language Selector Dropdown */}
            <div className="language-selector-wrapper">
              <Globe className="lang-icon" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="navbar-lang-select"
                title="Select Movie Cinema Language"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Quick Search Button */}
            <button 
              className="mobile-search-trigger-btn"
              onClick={() => {
                if (setIsMobileSearchOpen) setIsMobileSearchOpen(true);
                else {
                  setIsSearchOpen(true);
                  if (currentTab !== 'explore') setCurrentTab('explore');
                }
              }}
              title="Search Movies"
            >
              <Search className="btn-icon" />
            </button>

            {/* Desktop & Tablet Search Bar Input */}
            <div className={`search-box ${isSearchOpen || searchQuery || isFocused ? 'expanded' : ''}`}>
              <Search 
                className="search-icon" 
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  if (searchInputRef.current) searchInputRef.current.focus();
                }} 
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search movies, genres, cast..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentTab !== 'explore' && e.target.value.trim() !== '') {
                    setCurrentTab('explore');
                  }
                }}
                onFocus={() => {
                  setIsSearchOpen(true);
                  setIsFocused(true);
                }}
                onBlur={() => {
                  // Delay blur to allow clicks inside popover
                  setTimeout(() => setIsFocused(false), 200);
                }}
              />
              <kbd className="search-shortcut">⌘K</kbd>

              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                  <X className="clear-icon" />
                </button>
              )}

              {/* Instant Search Results Dropdown Popover */}
              {isFocused && searchQuery.trim() !== '' && (
                <div className="search-popover-dropdown">
                  <div className="popover-header">
                    <span>Matches for "{searchQuery}"</span>
                    <span className="count">{liveSuggestions.length} found</span>
                  </div>

                  {liveSuggestions.length > 0 ? (
                    <div className="popover-results-list">
                      {liveSuggestions.map(movie => (
                        <div 
                          key={movie.id} 
                          className="popover-item"
                          onClick={() => handleSelectSuggestion(movie)}
                        >
                          <img 
                            src={movie.poster || movie.backdrop} 
                            alt={movie.title} 
                            className="popover-thumb"
                          />
                          <div className="popover-item-info">
                            <h4 className="movie-title">{movie.title}</h4>
                            <div className="popover-meta">
                              <span className="rating"><Star className="star-icon" /> {movie.rating || '8.5'}</span>
                              <span>•</span>
                              <span>{movie.year}</span>
                              {movie.quality && <span className="badge">{movie.quality}</span>}
                            </div>
                          </div>
                          <ChevronRight className="arrow-icon" />
                        </div>
                      ))}

                      <button 
                        className="popover-view-all-btn"
                        onClick={() => {
                          setCurrentTab('explore');
                          setIsFocused(false);
                        }}
                      >
                        View all results in Explore Catalog <ArrowRight className="icon" />
                      </button>
                    </div>
                  ) : (
                    <div className="popover-empty">
                      <p>No matching titles found.</p>
                      <span className="sub">Press enter to search TMDB live database...</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Settings / API Key Button */}
            <button 
              className={`action-btn settings-btn ${tmdbApiKey ? 'has-key' : ''}`}
              onClick={onOpenSettings}
              title="TMDB API Settings"
            >
              <Settings className="btn-icon" />
              {tmdbApiKey && <span className="active-dot" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full Screen Mobile Search Modal / Overlay */}
      {isMobileSearchOpen && (
        <div className="mobile-search-overlay" onClick={() => setIsMobileSearchOpen(false)}>
          <div className="mobile-search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-search-header">
              <div className="mobile-search-input-box">
                <Search className="search-icon" />
                <input 
                  ref={mobileSearchInputRef}
                  type="text"
                  placeholder="Search movies, cast, genres..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (currentTab !== 'explore' && e.target.value.trim() !== '') {
                      setCurrentTab('explore');
                    }
                  }}
                  autoFocus
                />
                {searchQuery && (
                  <button className="clear-btn" onClick={() => setSearchQuery('')}>
                    <X />
                  </button>
                )}
              </div>
              <button className="close-overlay-btn" onClick={() => setIsMobileSearchOpen(false)}>
                Cancel
              </button>
            </div>

            {/* Quick Suggestions & Trending Tags */}
            <div className="mobile-search-body">
              <div className="quick-tags-section">
                <div className="section-title">
                  <Flame className="icon" /> Popular & Trending Searches
                </div>
                <div className="tags-flex">
                  {QUICK_TAGS.map((tag, idx) => (
                    <button 
                      key={idx} 
                      className="quick-tag-pill"
                      onClick={() => {
                        handleQuickTagClick(tag);
                        setIsMobileSearchOpen(false);
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instant Search Results inside Mobile Modal */}
              {searchQuery.trim() !== '' && (
                <div className="mobile-search-results">
                  <div className="section-title">
                    <Sparkles className="icon" /> Live Search Results ({liveSuggestions.length})
                  </div>

                  {liveSuggestions.length > 0 ? (
                    <div className="mobile-results-grid">
                      {liveSuggestions.map(movie => (
                        <div 
                          key={movie.id} 
                          className="mobile-result-card"
                          onClick={() => {
                            setIsMobileSearchOpen(false);
                            if (onSelectMovie) onSelectMovie(movie);
                          }}
                        >
                          <img src={movie.poster || movie.backdrop} alt={movie.title} />
                          <div className="card-info">
                            <h4>{movie.title}</h4>
                            <div className="card-meta">
                              <span>⭐ {movie.rating || '8.5'}</span>
                              <span>•</span>
                              <span>{movie.year}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-mobile-search">
                      <p>Searching for "{searchQuery}" in movie database...</p>
                      <button 
                        className="btn explore-full-btn"
                        onClick={() => {
                          setCurrentTab('explore');
                          setIsMobileSearchOpen(false);
                        }}
                      >
                        Search Full TMDB Catalog
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
