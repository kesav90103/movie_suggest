import React from 'react';
import { GENRES } from '../data/moviesData';
import { SlidersHorizontal, ArrowUpDown, Film, Tv, Sparkles, Star } from 'lucide-react';

export default function FilterBar({ 
  selectedGenre, 
  setSelectedGenre, 
  mediaType, 
  setMediaType, 
  sortBy, 
  setSortBy,
  minRating,
  setMinRating
}) {
  return (
    <div className="filter-bar">
      {/* Media Type Segment Controls */}
      <div className="filter-group media-type-tabs">
        <button 
          className={`type-tab ${mediaType === 'all' ? 'active' : ''}`}
          onClick={() => setMediaType('all')}
        >
          <Sparkles className="tab-icon" /> All Media
        </button>
        <button 
          className={`type-tab ${mediaType === 'movie' ? 'active' : ''}`}
          onClick={() => setMediaType('movie')}
        >
          <Film className="tab-icon" /> Movies
        </button>
        <button 
          className={`type-tab ${mediaType === 'series' ? 'active' : ''}`}
          onClick={() => setMediaType('series')}
        >
          <Tv className="tab-icon" /> TV Series
        </button>
      </div>

      {/* Genre Pills Row */}
      <div className="genre-pills-row">
        {GENRES.map(genre => (
          <button
            key={genre.id}
            className={`genre-pill ${selectedGenre === genre.id ? 'active' : ''}`}
            onClick={() => setSelectedGenre(genre.id)}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {/* Sorting & Rating Filters */}
      <div className="filter-controls-row">
        {/* Sort selector */}
        <div className="select-wrapper">
          <ArrowUpDown className="select-icon" />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="popular">Sort: Trending & Popular</option>
            <option value="rating">Sort: Highest Rated ⭐</option>
            <option value="year_desc">Sort: Release Year (Newest)</option>
            <option value="title">Sort: Title (A-Z)</option>
          </select>
        </div>

        {/* Rating Filter Selector */}
        <div className="select-wrapper">
          <Star className="select-icon" />
          <select 
            value={minRating} 
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="filter-select"
          >
            <option value="0">All Ratings</option>
            <option value="8">8.0+ Rating (Top Tier)</option>
            <option value="8.5">8.5+ Rating (Masterpieces)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
