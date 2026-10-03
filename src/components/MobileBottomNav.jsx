import React from 'react';
import { Home, Compass, Search, Ticket, Bookmark, PlayCircle } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';

export default function MobileBottomNav({ 
  currentTab, 
  setCurrentTab, 
  onOpenMobileSearch 
}) {
  const { watchlist, bookings } = useWatchlist();

  const handleTabClick = (tabId) => {
    if (tabId === 'search') {
      if (onOpenMobileSearch) {
        onOpenMobileSearch();
      } else {
        setCurrentTab('explore');
      }
    } else {
      setCurrentTab(tabId);
    }
  };

  return (
    <nav className="mobile-bottom-nav">
      <div className="mobile-nav-container">
        <button 
          className={`mobile-nav-item ${currentTab === 'home' ? 'active' : ''}`}
          onClick={() => handleTabClick('home')}
        >
          <Home className="nav-icon" />
          <span className="nav-label">Home</span>
        </button>

        <button 
          className={`mobile-nav-item ${currentTab === 'explore' ? 'active' : ''}`}
          onClick={() => handleTabClick('explore')}
        >
          <Compass className="nav-icon" />
          <span className="nav-label">Explore</span>
        </button>

        <button 
          className={`mobile-nav-item search-tab-item ${currentTab === 'search' ? 'active' : ''}`}
          onClick={() => handleTabClick('search')}
        >
          <div className="mobile-search-fab">
            <Search className="nav-icon search-fab-icon" />
          </div>
          <span className="nav-label">Search</span>
        </button>

        <button 
          className={`mobile-nav-item ${currentTab === 'tickets' ? 'active' : ''}`}
          onClick={() => handleTabClick('tickets')}
        >
          <div className="icon-wrapper">
            <Ticket className="nav-icon" />
            {bookings.length > 0 && (
              <span className="mobile-nav-badge">{bookings.length}</span>
            )}
          </div>
          <span className="nav-label">Tickets</span>
        </button>

        <button 
          className={`mobile-nav-item ${currentTab === 'watchlist' ? 'active' : ''}`}
          onClick={() => handleTabClick('watchlist')}
        >
          <div className="icon-wrapper">
            <Bookmark className="nav-icon" />
            {watchlist.length > 0 && (
              <span className="mobile-nav-badge">{watchlist.length}</span>
            )}
          </div>
          <span className="nav-label">Watchlist</span>
        </button>

        <button 
          className={`mobile-nav-item ${currentTab === 'cinema' ? 'active' : ''}`}
          onClick={() => handleTabClick('cinema')}
        >
          <PlayCircle className="nav-icon glowing-icon" />
          <span className="nav-label">Theater</span>
        </button>
      </div>
    </nav>
  );
}
