import React, { useState, useEffect } from 'react';
import { X, Play, Plus, Check, Star, Heart, Share2, Clock, Calendar, Film, Sparkles, Loader2, Tv, Ticket } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { fetchMovieDetails } from '../services/apiService';
import MovieCard from './MovieCard';

export default function MovieDetailModal({ movie, onClose, onPlayTrailer, onSelectMovie, onBookMovie }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [detailedMovie, setDetailedMovie] = useState(movie);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const { isInWatchlist, toggleWatchlist, isFavorite, toggleFavorite, userRatings, rateMovie, tmdbApiKey } = useWatchlist();

  useEffect(() => {
    if (movie && movie.id) {
      setDetailedMovie(movie);
      setLoadingDetails(true);
      fetchMovieDetails(movie.id, tmdbApiKey).then(res => {
        if (res) {
          setDetailedMovie(prev => ({ ...prev, ...res }));
        }
        setLoadingDetails(false);
      });
    }
  }, [movie, tmdbApiKey]);

  if (!movie) return null;

  const currentMovie = detailedMovie || movie;
  const inWatchlist = isInWatchlist(currentMovie.id);
  const favorite = isFavorite(currentMovie.id);
  const userScore = userRatings[currentMovie.id] || 0;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentMovie.title,
        text: currentMovie.overview,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Movie link copied to clipboard!');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} title="Close">
          <X />
        </button>

        {/* Header Backdrop Hero */}
        <div 
          className="modal-hero-backdrop"
          style={{ backgroundImage: currentMovie.backdrop ? `url(${currentMovie.backdrop})` : 'none' }}
        >
          <div className="backdrop-overlay-gradient" />
          
          <div className="modal-hero-content">
            <div className="hero-left-poster">
              {currentMovie.poster ? (
                <img src={currentMovie.poster} alt={currentMovie.title} />
              ) : (
                <div className="modal-no-poster">
                  <Film />
                </div>
              )}
            </div>

            <div className="hero-right-details">
              <div className="modal-badges">
                {currentMovie.match && <span className="badge-match">{currentMovie.match}</span>}
                <span className="badge-quality">{currentMovie.quality}</span>
                <span className="badge-age">{currentMovie.ageRating}</span>
                <span className="badge-lang">{currentMovie.originalLanguage || 'TE'}</span>
              </div>

              <h2 className="modal-title">{currentMovie.title}</h2>
              {currentMovie.originalTitle && currentMovie.originalTitle !== currentMovie.title && (
                <p className="modal-original-title">Original Title: {currentMovie.originalTitle}</p>
              )}
              {currentMovie.tagline && <p className="modal-tagline">"{currentMovie.tagline}"</p>}

              <div className="modal-stats-bar">
                <div className="stat-item">
                  <Star className="star-icon" />
                  <span className="val">{currentMovie.rating || 'N/A'}</span>
                  <span className="lbl">/10 ({currentMovie.votes} TMDB reviews)</span>
                </div>
                <div className="stat-divider">•</div>
                <div className="stat-item">
                  <Calendar className="icon" />
                  <span>{currentMovie.releaseDate || currentMovie.year}</span>
                </div>
                <div className="stat-divider">•</div>
                <div className="stat-item">
                  <Clock className="icon" />
                  <span>{currentMovie.duration}</span>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="modal-actions-bar">
                <button 
                  className="modal-btn book-tickets-btn"
                  onClick={() => {
                    onClose();
                    if (onBookMovie) onBookMovie(currentMovie);
                  }}
                >
                  <Ticket className="btn-icon" /> Book Seats (200-Seat Dolby Cinema)
                </button>

                <button 
                  className="modal-btn play-btn"
                  onClick={() => onPlayTrailer(currentMovie)}
                >
                  <Play className="btn-icon fill-icon" /> Trailer
                </button>

                <button 
                  className={`modal-btn watchlist-btn ${inWatchlist ? 'added' : ''}`}
                  onClick={() => toggleWatchlist(currentMovie.id)}
                >
                  {inWatchlist ? <Check className="btn-icon" /> : <Plus className="btn-icon" />}
                  {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </button>

                <button 
                  className={`modal-btn icon-only-btn ${favorite ? 'active-fav' : ''}`}
                  onClick={() => toggleFavorite(currentMovie.id)}
                  title="Favorite"
                >
                  <Heart className="btn-icon" />
                </button>

                <button 
                  className="modal-btn icon-only-btn"
                  onClick={handleShare}
                  title="Share"
                >
                  <Share2 className="btn-icon" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Navigation Tabs */}
        <div className="modal-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Storyline & Reviews
          </button>
          <button 
            className={`tab-btn ${activeTab === 'cast' ? 'active' : ''}`}
            onClick={() => setActiveTab('cast')}
          >
            Cast & Crew ({currentMovie.cast ? currentMovie.cast.length : 0})
          </button>

          {currentMovie.recommendations && currentMovie.recommendations.length > 0 && (
            <button 
              className={`tab-btn ${activeTab === 'similar' ? 'active' : ''}`}
              onClick={() => setActiveTab('similar')}
            >
              Recommended Movies ({currentMovie.recommendations.length})
            </button>
          )}
        </div>

        {/* Tab Content Section */}
        <div className="modal-body-content">
          {loadingDetails && (
            <div className="loading-bar">
              <Loader2 className="animate-spin icon" /> Fetching TMDB Cast & Live Recommendations...
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="synopsis-section">
                <h3>Synopsis</h3>
                <p className="overview-text">{currentMovie.overview}</p>
              </div>

              {/* Streaming OTT Providers */}
              {currentMovie.watchProviders && currentMovie.watchProviders.length > 0 && (
                <div className="ott-providers-box">
                  <h4><Tv className="icon" /> Stream Now On:</h4>
                  <div className="providers-list">
                    {currentMovie.watchProviders.map((p, idx) => (
                      <div key={idx} className="provider-pill">
                        <img src={p.logo} alt={p.name} />
                        <span>{p.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* User Rating Box */}
              <div className="user-rating-box">
                <div className="rating-box-title">
                  <Sparkles className="icon" /> Rate this movie based on your experience:
                </div>
                <div className="stars-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className={`star-btn ${star <= userScore ? 'filled' : ''}`}
                      onClick={() => rateMovie(currentMovie.id, star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <span className="user-rating-status">
                  {userScore > 0 ? `You rated this ${userScore}/5 stars!` : 'Click stars to rate'}
                </span>
              </div>

              {/* Real Meta Grid */}
              <div className="meta-grid">
                {currentMovie.director && (
                  <div className="meta-card">
                    <span className="label">Director</span>
                    <span className="value">{currentMovie.director}</span>
                  </div>
                )}
                {currentMovie.writer && (
                  <div className="meta-card">
                    <span className="label">Writer</span>
                    <span className="value">{currentMovie.writer}</span>
                  </div>
                )}
                <div className="meta-card">
                  <span className="label">Genres</span>
                  <span className="value">
                    {currentMovie.genreNames ? currentMovie.genreNames.join(', ') : 'Cinema'}
                  </span>
                </div>
                <div className="meta-card">
                  <span className="label">Original Language</span>
                  <span className="value">{currentMovie.originalLanguage || 'TE'}</span>
                </div>
                {currentMovie.budget && (
                  <div className="meta-card">
                    <span className="label">Production Budget</span>
                    <span className="value">{currentMovie.budget}</span>
                  </div>
                )}
                {currentMovie.revenue && (
                  <div className="meta-card">
                    <span className="label">Box Office Revenue</span>
                    <span className="value">{currentMovie.revenue}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'cast' && (
            <div className="cast-tab">
              {currentMovie.cast && currentMovie.cast.length > 0 ? (
                <div className="cast-grid">
                  {currentMovie.cast.map((c, i) => (
                    <div key={i} className="cast-card">
                      {c.avatar ? (
                        <img src={c.avatar} alt={c.name} />
                      ) : (
                        <div className="cast-avatar-placeholder">{c.name.substring(0, 2)}</div>
                      )}
                      <div className="cast-info">
                        <span className="actor-name">{c.name}</span>
                        <span className="role-name">{c.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-cast-text">Cast information currently unavailable from TMDB API.</p>
              )}
            </div>
          )}

          {activeTab === 'similar' && currentMovie.recommendations && (
            <div className="similar-tab">
              <div className="similar-grid">
                {currentMovie.recommendations.map(item => (
                  <MovieCard 
                    key={item.id} 
                    movie={item} 
                    onSelectMovie={(m) => onSelectMovie(m)}
                    onPlayTrailer={onPlayTrailer}
                    onBookMovie={(m) => {
                      onClose();
                      if (onBookMovie) onBookMovie(m);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
