import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

export default function MovieRow({ title, movies, onSelectMovie, onPlayTrailer, icon: Icon }) {
  const rowRef = useRef(null);

  const handleScroll = (direction) => {
    if (!rowRef.current) return;
    const { scrollLeft, clientWidth } = rowRef.current;
    const scrollAmount = clientWidth * 0.75;

    rowRef.current.scrollTo({
      left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: 'smooth'
    });
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="movie-row-section">
      <div className="row-header">
        <h2 className="row-title">
          {Icon && <Icon className="row-title-icon" />}
          {title}
          <span className="row-count">({movies.length})</span>
        </h2>
      </div>

      <div className="row-container">
        <button 
          className="row-arrow left-arrow" 
          onClick={() => handleScroll('left')}
          title="Scroll Left"
        >
          <ChevronLeft />
        </button>

        <div className="row-cards-wrapper" ref={rowRef}>
          {movies.map(movie => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onSelectMovie={onSelectMovie}
              onPlayTrailer={onPlayTrailer}
            />
          ))}
        </div>

        <button 
          className="row-arrow right-arrow" 
          onClick={() => handleScroll('right')}
          title="Scroll Right"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
