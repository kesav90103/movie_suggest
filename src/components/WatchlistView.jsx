import React, { useState } from 'react';
import { Bookmark, Heart, Star, Trash2, Film, CheckCircle, Sparkles } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import MovieCard from './MovieCard';

export default function WatchlistView({ allMovies, onSelectMovie, onPlayTrailer }) {
  const { watchlist, favorites, userRatings, toggleWatchlist } = useWatchlist();
  const [activeSubTab, setActiveSubTab] = useState('watchlist'); // 'watchlist' | 'favorites' | 'rated'

  const watchlistMovies = allMovies.filter(m => watchlist.includes(m.id));
  const favoriteMovies = allMovies.filter(m => favorites.includes(m.id));
  const ratedMovies = allMovies.filter(m => userRatings[m.id]);

  return (
    <div className="watchlist-view-page">
      <div className="view-header">
        <h1 className="view-title">
          <Bookmark className="header-icon" /> My Personal Cinema Hub
        </h1>
        <p className="view-subtitle">
          Keep track of movies you plan to watch, your favorite masterpieces, and personal ratings.
        </p>
      </div>

      {/* Sub-tabs */}
      <div className="subtabs-bar">
        <button 
          className={`subtab-btn ${activeSubTab === 'watchlist' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('watchlist')}
        >
          <Bookmark className="icon" /> Watchlist ({watchlistMovies.length})
        </button>
        <button 
          className={`subtab-btn ${activeSubTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('favorites')}
        >
          <Heart className="icon" /> Favorites ({favoriteMovies.length})
        </button>
        <button 
          className={`subtab-btn ${activeSubTab === 'rated' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('rated')}
        >
          <Star className="icon" /> Rated by You ({ratedMovies.length})
        </button>
      </div>

      {/* Display Grid or Empty State */}
      <div className="watchlist-content">
        {activeSubTab === 'watchlist' && (
          watchlistMovies.length > 0 ? (
            <div className="movies-grid">
              {watchlistMovies.map(movie => (
                <div key={movie.id} className="grid-item-container">
                  <MovieCard 
                    movie={movie} 
                    onSelectMovie={onSelectMovie} 
                    onPlayTrailer={onPlayTrailer}
                  />
                  <button 
                    className="remove-watchlist-btn"
                    onClick={() => toggleWatchlist(movie.id)}
                    title="Remove from Watchlist"
                  >
                    <Trash2 className="icon" /> Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Film className="empty-icon" />
              <h3>Your Watchlist is empty</h3>
              <p>Browse movies and click the "+ Add to Watchlist" button to save titles for later!</p>
            </div>
          )
        )}

        {activeSubTab === 'favorites' && (
          favoriteMovies.length > 0 ? (
            <div className="movies-grid">
              {favoriteMovies.map(movie => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onSelectMovie={onSelectMovie} 
                  onPlayTrailer={onPlayTrailer}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Heart className="empty-icon" />
              <h3>No Favorites saved yet</h3>
              <p>Click the heart icon on any movie detail modal to mark it as a personal favorite.</p>
            </div>
          )
        )}

        {activeSubTab === 'rated' && (
          ratedMovies.length > 0 ? (
            <div className="movies-grid">
              {ratedMovies.map(movie => (
                <div key={movie.id} className="rated-item-wrapper">
                  <MovieCard 
                    movie={movie} 
                    onSelectMovie={onSelectMovie} 
                    onPlayTrailer={onPlayTrailer}
                  />
                  <div className="user-score-badge">
                    <Star className="star-icon" /> Your Rating: {userRatings[movie.id]}/5
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Star className="empty-icon" />
              <h3>No Rated Movies</h3>
              <p>Open any movie detail modal and rate it with 1 to 5 stars to build your rating history.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
