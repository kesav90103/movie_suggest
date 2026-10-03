import React, { useState, useEffect } from 'react';
import { X, Film, ExternalLink } from 'lucide-react';
import { fetchRealTrailerKey } from '../services/apiService';
import { useWatchlist } from '../context/WatchlistContext';

export default function TrailerPlayerModal({ movie, onClose }) {
  const { tmdbApiKey } = useWatchlist();
  const [trailerKey, setTrailerKey] = useState(movie ? movie.trailerKey : null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (movie && !movie.trailerKey) {
      setLoading(true);
      fetchRealTrailerKey(movie.id, tmdbApiKey).then(key => {
        if (key) setTrailerKey(key);
        setLoading(false);
      });
    } else if (movie) {
      setTrailerKey(movie.trailerKey);
    }
  }, [movie, tmdbApiKey]);

  if (!movie) return null;

  const embedUrl = trailerKey 
    ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`
    : `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(movie.title + ' official trailer')}&autoplay=1`;

  return (
    <div className="modal-backdrop video-modal-backdrop" onClick={onClose}>
      <div className="trailer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="trailer-modal-header">
          <div className="header-info">
            <Film className="icon" />
            <span className="trailer-title">{movie.title} — Official Trailer</span>
          </div>
          <button className="close-trailer-btn" onClick={onClose} title="Close Trailer">
            <X />
          </button>
        </div>

        <div className="video-responsive-wrapper">
          <iframe
            src={embedUrl}
            title={`${movie.title} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
