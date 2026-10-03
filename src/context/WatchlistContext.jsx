import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiKey } from '../services/apiService';

const WatchlistContext = createContext();

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem('cineverse_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('cineverse_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [userRatings, setUserRatings] = useState(() => {
    try {
      const saved = localStorage.getItem('cineverse_ratings');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('cineverse_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [tmdbApiKey, setTmdbApiKey] = useState(() => {
    const envKey = import.meta.env.VITE_TMDB_API_KEY;
    if (envKey && envKey !== 'your_tmdb_api_key_here' && envKey.trim() !== '') {
      return envKey.trim();
    }
    return localStorage.getItem('cineverse_tmdb_key') || '';
  });

  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return import.meta.env.VITE_DEFAULT_LANGUAGE || 'te'; // 'te' for Telugu
  });

  useEffect(() => {
    localStorage.setItem('cineverse_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('cineverse_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('cineverse_ratings', JSON.stringify(userRatings));
  }, [userRatings]);

  useEffect(() => {
    localStorage.setItem('cineverse_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    if (tmdbApiKey) {
      localStorage.setItem('cineverse_tmdb_key', tmdbApiKey);
    }
  }, [tmdbApiKey]);

  const toggleWatchlist = (movieId) => {
    setWatchlist(prev => 
      prev.includes(movieId) ? prev.filter(id => id !== movieId) : [...prev, movieId]
    );
  };

  const toggleFavorite = (movieId) => {
    setFavorites(prev => 
      prev.includes(movieId) ? prev.filter(id => id !== movieId) : [...prev, movieId]
    );
  };

  const rateMovie = (movieId, rating) => {
    setUserRatings(prev => ({
      ...prev,
      [movieId]: rating
    }));
  };

  const addBooking = (newBooking) => {
    setBookings(prev => [newBooking, ...prev]);
  };

  const cancelBooking = (bookingId) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
  };

  const isInWatchlist = (movieId) => watchlist.includes(movieId);
  const isFavorite = (movieId) => favorites.includes(movieId);
  const activeKey = getApiKey(tmdbApiKey);

  return (
    <WatchlistContext.Provider value={{
      watchlist,
      favorites,
      userRatings,
      bookings,
      addBooking,
      cancelBooking,
      tmdbApiKey: activeKey,
      setTmdbApiKey,
      selectedLanguage,
      setSelectedLanguage,
      toggleWatchlist,
      toggleFavorite,
      rateMovie,
      isInWatchlist,
      isFavorite
    }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}
