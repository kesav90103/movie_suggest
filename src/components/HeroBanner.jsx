import React, { useState, useEffect } from 'react';
import { Play, Plus, Check, Star, Info, ChevronLeft, ChevronRight, Sparkles, Ticket } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';

export default function HeroBanner({ heroMovies, onSelectMovie, onPlayTrailer, onBookMovie }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  useEffect(() => {
    if (!heroMovies || heroMovies.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % heroMovies.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [heroMovies]);

  if (!heroMovies || heroMovies.length === 0) return null;

  const currentMovie = heroMovies[currentIndex];
  const inWatchlist = isInWatchlist(currentMovie.id);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + heroMovies.length) % heroMovies.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % heroMovies.length);
  };

  return (
    <div className="hero-banner">
      {/* Background Backdrop Image & Vignette Gradients */}
      <div 
        className="hero-backdrop"
        style={{ backgroundImage: currentMovie.backdrop ? `url(${currentMovie.backdrop})` : 'none' }}
      >
        <div className="hero-gradient-overlay" />
        <div className="hero-bottom-fade" />
      </div>

      {/* Hero Content Information */}
      <div className="hero-content">
        <div className="hero-badge-row">
          <span className="hero-tag feature-tag">
            <Sparkles className="tag-icon" /> Featured Masterpiece
          </span>
          {currentMovie.match && <span className="hero-match">{currentMovie.match}</span>}
          <span className="hero-quality">{currentMovie.quality}</span>
          <span className="hero-age">{currentMovie.ageRating}</span>
        </div>

        <h1 className="hero-title">{currentMovie.title}</h1>
        {currentMovie.tagline && <p className="hero-tagline">{currentMovie.tagline}</p>}
        
        <p className="hero-overview">
          {currentMovie.overview.length > 220 
            ? `${currentMovie.overview.substring(0, 220)}...` 
            : currentMovie.overview}
        </p>

        <div className="hero-meta-row">
          <div className="hero-rating">
            <Star className="star-icon" />
            <span>{currentMovie.rating || '8.5'}</span>
            <span className="votes">({currentMovie.votes} TMDB reviews)</span>
          </div>
          <span className="dot-divider">•</span>
          <span>{currentMovie.year}</span>
          <span className="dot-divider">•</span>
          <span>Screen 1 Dolby Atmos</span>
        </div>

        {/* Action Buttons */}
        <div className="hero-actions">
          <button 
            className="hero-btn hero-book-btn"
            onClick={() => {
              if (onBookMovie) onBookMovie(currentMovie);
              else onSelectMovie(currentMovie);
            }}
          >
            <Ticket className="btn-icon" /> Book Seats (Screen 1 — 200 Seats)
          </button>

          <button 
            className="hero-btn primary-btn"
            onClick={() => onPlayTrailer(currentMovie)}
          >
            <Play className="btn-icon fill-icon" /> Trailer
          </button>

          <button 
            className={`hero-btn secondary-btn ${inWatchlist ? 'added' : ''}`}
            onClick={() => toggleWatchlist(currentMovie.id)}
          >
            {inWatchlist ? (
              <>
                <Check className="btn-icon" /> In Watchlist
              </>
            ) : (
              <>
                <Plus className="btn-icon" /> Watchlist
              </>
            )}
          </button>

          <button 
            className="hero-btn info-btn"
            onClick={() => onSelectMovie(currentMovie)}
          >
            <Info className="btn-icon" /> Info
          </button>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <div className="hero-controls">
        <button className="slider-arrow prev-arrow" onClick={handlePrev} title="Previous">
          <ChevronLeft />
        </button>
        
        <div className="slider-dots">
          {heroMovies.map((movie, idx) => (
            <button
              key={movie.id}
              className={`dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              title={movie.title}
            />
          ))}
        </div>

        <button className="slider-arrow next-arrow" onClick={handleNext} title="Next">
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
