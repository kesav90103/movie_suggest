import React, { useState } from 'react';
import { X, Key, Check, Info, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';

export default function SettingsModal({ onClose }) {
  const { tmdbApiKey, setTmdbApiKey } = useWatchlist();
  const [inputKey, setInputKey] = useState(tmdbApiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setTmdbApiKey(inputKey.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleClear = () => {
    setInputKey('');
    setTmdbApiKey('');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="title-row">
            <Key className="header-icon" />
            <h2>TMDB API & App Configuration</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSave} className="settings-body">
          <div className="info-alert">
            <Sparkles className="icon" />
            <span>
              CineVerse features a built-in offline dataset of 12+ top blockbusters with trailers & full cast. 
              Optionally enter a free <strong>TMDB (The Movie Database) API Key</strong> to fetch live trending movies & search millions of titles worldwide!
            </span>
          </div>

          <div className="input-group">
            <label htmlFor="tmdbKey">TMDB API v3 Key (Optional)</label>
            <div className="input-wrapper">
              <input
                id="tmdbKey"
                type="password"
                placeholder="e.g. 1a2b3c4d5e6f7g8h9i0j..."
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
              />
              {inputKey && (
                <button type="button" className="clear-btn" onClick={handleClear}>
                  Clear
                </button>
              )}
            </div>
            <small className="help-text">
              Don't have a key? You can get one for free at <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer">themoviedb.org</a>.
            </small>
          </div>

          {savedSuccess && (
            <div className="success-banner">
              <Check className="icon" /> TMDB API Settings saved successfully!
            </div>
          )}

          <div className="settings-actions">
            <button type="button" className="btn cancel-btn" onClick={onClose}>
              Close
            </button>
            <button type="submit" className="btn save-btn">
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
