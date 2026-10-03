import React, { useState, useRef } from 'react';
import { Search, X, Sparkles, SlidersHorizontal, Film, Star, Flame } from 'lucide-react';

export default function HomeSearchBar({ 
  searchQuery, 
  setSearchQuery, 
  onSearchSubmit,
  selectedLanguage,
  setSelectedLanguage
}) {
  const inputRef = useRef(null);

  const POPULAR_SEARCHES = [
    'Pushpa 2', 'Devara', 'Avatar', 'Kalki 2898 AD', 'Dolby Atmos', '4K Masterpieces'
  ];

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    if (onSearchSubmit) onSearchSubmit(tag);
  };

  return (
    <div className="home-search-section">
      <div className="home-search-container">
        <div className="search-bar-headline">
          <div className="headline-tag">
            <Sparkles className="sparkle-icon" /> Live TMDB Box Office Search
          </div>
          <h2>Find & Book Your Favorite Movies</h2>
          <p>Search over 100,000+ movies in 4K Ultra HD Dolby Atmos Screen 1.</p>
        </div>

        {/* Big Search Input Box */}
        <div className="main-search-input-wrapper">
          <Search className="main-search-icon" onClick={() => inputRef.current?.focus()} />
          <input 
            ref={inputRef}
            type="text"
            className="main-search-input"
            placeholder="Search movies by title, actor, genre (e.g. 'Pushpa', 'Action')..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (onSearchSubmit) onSearchSubmit(e.target.value);
            }}
          />
          {searchQuery ? (
            <button 
              className="main-clear-btn"
              onClick={() => {
                setSearchQuery('');
                if (onSearchSubmit) onSearchSubmit('');
              }}
              title="Clear Search"
            >
              <X />
            </button>
          ) : (
            <div className="search-badge-hint">Press '/' to search</div>
          )}
        </div>

        {/* Quick Tag Pills */}
        <div className="home-search-tags">
          <span className="tags-label">
            <Flame className="flame-icon" /> Trending Searches:
          </span>
          <div className="tags-scroll-row">
            {POPULAR_SEARCHES.map((tag, idx) => (
              <button 
                key={idx}
                className={`tag-chip ${searchQuery === tag ? 'active' : ''}`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
