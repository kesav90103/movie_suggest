import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, RotateCcw, RotateCw, Subtitles, ListVideo, Sparkles, ArrowLeft } from 'lucide-react';

export default function CinemaPlayerView({ movie, onBackToHome, allMovies, onSelectMovie }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(35);
  const [selectedQuality, setSelectedQuality] = useState('4K Ultra HD');

  const currentMovie = movie || allMovies[0];

  return (
    <div className="cinema-player-view">
      {/* Top Floating Control Bar */}
      <div className="cinema-top-bar">
        <button className="back-btn" onClick={onBackToHome}>
          <ArrowLeft className="icon" /> Back to Catalog
        </button>

        <div className="cinema-title-meta">
          <h2>{currentMovie.title}</h2>
          <span className="meta-tag">{currentMovie.quality}</span>
          <span className="meta-tag">{currentMovie.year}</span>
        </div>

        <div className="cinema-top-actions">
          <span className="ambient-badge">
            <Sparkles className="icon" /> Ambient Light Mode
          </span>
        </div>
      </div>

      {/* Main Video Frame & Ambient Backdrop */}
      <div className="cinema-stage">
        <div 
          className={`ambient-backdrop ${isPlaying ? 'glowing' : ''}`}
          style={{ backgroundImage: `url(${currentMovie.backdrop})` }}
        />

        <div className="video-player-box">
          <iframe
            src={`https://www.youtube.com/embed/${currentMovie.trailerKey}?autoplay=${isPlaying ? 1 : 0}&controls=0&modestbranding=1&rel=0`}
            title={currentMovie.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          {/* Custom On-Screen Overlay Controls */}
          <div className="player-controls-overlay">
            {/* Scrubber Progress Bar */}
            <div className="scrubber-container">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="scrubber-slider"
              />
              <div className="time-display">
                <span>00:42:18</span>
                <span>/ {currentMovie.duration}</span>
              </div>
            </div>

            {/* Controls Row */}
            <div className="controls-row">
              <div className="left-controls">
                <button className="control-btn" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause /> : <Play />}
                </button>

                <button className="control-btn" onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? <VolumeX /> : <Volume2 />}
                </button>

                <button className="control-btn" onClick={() => setProgress(Math.max(0, progress - 5))}>
                  <RotateCcw />
                </button>

                <button className="control-btn" onClick={() => setProgress(Math.min(100, progress + 5))}>
                  <RotateCw />
                </button>
              </div>

              <div className="right-controls">
                <button className="control-btn" title="Subtitles English">
                  <Subtitles />
                </button>

                <div className="quality-dropdown">
                  <select 
                    value={selectedQuality} 
                    onChange={(e) => setSelectedQuality(e.target.value)}
                  >
                    <option value="4K Ultra HD">4K 2160p</option>
                    <option value="1080p Full HD">1080p HD</option>
                    <option value="720p HD">720p HD</option>
                  </select>
                </div>

                <button 
                  className="control-btn"
                  onClick={() => {
                    const el = document.querySelector('.cinema-player-view');
                    if (el && el.requestFullscreen) el.requestFullscreen();
                  }}
                  title="Fullscreen"
                >
                  <Maximize />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Up Next / Recommended Tray */}
      <div className="cinema-playlist-tray">
        <h3 className="tray-title">
          <ListVideo className="icon" /> Recommended for You Next
        </h3>
        <div className="playlist-cards">
          {allMovies.filter(m => m.id !== currentMovie.id).slice(0, 5).map(m => (
            <div 
              key={m.id} 
              className="playlist-item"
              onClick={() => onSelectMovie(m)}
            >
              <img src={m.poster} alt={m.title} />
              <div className="playlist-info">
                <h4>{m.title}</h4>
                <span>{m.duration} • ⭐ {m.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
