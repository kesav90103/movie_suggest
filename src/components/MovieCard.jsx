import React from 'react';
import { Star, Play, Plus, Check, Info, Film, Ticket } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';

export default function MovieCard({ movie, onSelectMovie, onPlayTrailer, onBookMovie }) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.id);

  const genreDisplay = movie.genreNames && movie.genreNames.length > 0
    ? movie.genreNames[0]
    : 'CINEMA';

  return (
    <div className="movie-card" onClick={() => onSelectMovie(movie)}>
      <div className="card-media">
        {movie.poster ? (
          <img 
            src={movie.poster} 
            alt={movie.title} 
            className="card-poster"
            loading="lazy"
          />
        ) : (
          <div className="no-poster-placeholder">
            <Film className="placeholder-icon" />
            <span className="placeholder-title">{movie.title}</span>
            <span className="placeholder-year">{movie.year}</span>
          </div>
        )}

        {/* Floating Top Rating Badge */}
        <div className="card-top-badges">
          {movie.rating > 0 && (
            <div className="rating-badge">
              <Star className="star-icon" />
              <span>{movie.rating}</span>
            </div>
          )}
          {movie.originalLanguage && (
            <div className="lang-badge">{movie.originalLanguage}</div>
          )}
        </div>

        {/* Hover Overlay with Quick Controls */}
        <div className="card-hover-overlay">
          <div className="overlay-content">
            <h4 className="hover-title">{movie.title}</h4>
            <div className="hover-meta">
              <span className="hover-year">{movie.year}</span>
              <span className="hover-match">{movie.match}</span>
            </div>

            <button 
              className="card-book-now-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (onBookMovie) onBookMovie(movie);
                else onSelectMovie(movie);
              }}
            >
              <Ticket className="icon" /> Book Seats Now
            </button>

            <div className="hover-actions" onClick={(e) => e.stopPropagation()}>
              <button 
                className="hover-btn play-btn"
                onClick={() => onPlayTrailer(movie)}
                title="Watch Trailer"
              >
                <Play className="btn-icon fill-icon" />
              </button>

              <button 
                className={`hover-btn watchlist-btn ${inWatchlist ? 'added' : ''}`}
                onClick={() => toggleWatchlist(movie.id)}
                title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
              >
                {inWatchlist ? <Check className="btn-icon" /> : <Plus className="btn-icon" />}
              </button>

              <button 
                className="hover-btn info-btn"
                onClick={() => onSelectMovie(movie)}
                title="Movie Details"
              >
                <Info className="btn-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card Info Bottom */}
      <div className="card-info">
        <h3 className="card-title">{movie.title}</h3>
        <div className="card-sub-meta">
          <span className="card-year">{movie.year}</span>
          <span className="dot">•</span>
          <span className="card-genre">{genreDisplay}</span>
        </div>
      </div>
    </div>
  );
}
