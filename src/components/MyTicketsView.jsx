import React from 'react';
import { Ticket, QrCode, Calendar, Clock, MapPin, Trash2, ShoppingBag, Volume2, Film } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';

export default function MyTicketsView({ onNavigateHome }) {
  const { bookings, cancelBooking } = useWatchlist();

  return (
    <div className="tickets-view-page">
      <div className="view-header">
        <h1 className="view-title">
          <Ticket className="header-icon" /> My Movie Tickets & Bookings
        </h1>
        <p className="view-subtitle">
          View your confirmed tickets, scannable QR entry passes, and interval food delivery details.
        </p>
      </div>

      {bookings.length > 0 ? (
        <div className="tickets-list">
          {bookings.map((tkt) => (
            <div key={tkt.id} className="ticket-card-item">
              {/* Left Poster */}
              <div className="tkt-poster">
                {tkt.poster ? (
                  <img src={tkt.poster} alt={tkt.movieTitle} />
                ) : (
                  <div className="no-poster-box"><Film /></div>
                )}
              </div>

              {/* Middle Details */}
              <div className="tkt-info-body">
                <div className="tkt-id-badge">Booking ID: {tkt.id}</div>
                <h2 className="tkt-movie-title">{tkt.movieTitle}</h2>

                <div className="tkt-meta-grid">
                  <div className="meta-item">
                    <MapPin className="icon" />
                    <span>{tkt.theater} ({tkt.screen})</span>
                  </div>
                  <div className="meta-item">
                    <Clock className="icon" />
                    <span>{tkt.showtime.time} ({tkt.showtime.format})</span>
                  </div>
                  <div className="meta-item">
                    <Calendar className="icon" />
                    <span>{tkt.bookingDate}</span>
                  </div>
                  <div className="meta-item seats-highlight">
                    <Ticket className="icon" />
                    <span>Seats: {tkt.seats.map(s => s.id).join(', ')} ({tkt.seats.length} Tickets)</span>
                  </div>
                </div>

                {/* Food Delivery Items */}
                {tkt.foodOrders && tkt.foodOrders.length > 0 && (
                  <div className="tkt-food-summary">
                    <span className="food-title"><ShoppingBag className="icon" /> Interval Food Delivery:</span>
                    <div className="food-pills">
                      {tkt.foodOrders.map((f, idx) => (
                        <span key={idx} className="food-pill">
                          {f.name} x{f.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="tkt-price-bar">
                  <span className="total-paid">Total Paid: ₹{tkt.grandTotal}</span>
                  <button 
                    className="cancel-tkt-btn"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to cancel this ticket booking?')) {
                        cancelBooking(tkt.id);
                      }
                    }}
                  >
                    <Trash2 className="icon" /> Cancel Ticket
                  </button>
                </div>
              </div>

              {/* Right QR Pass Code */}
              <div className="tkt-qr-section">
                <img src={tkt.qrCodeData} alt="Ticket QR Code" />
                <span className="qr-pass-lbl">Pass Entry QR</span>
                <span className="scan-desc">Scan at Screen 1 Entry</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Ticket className="empty-icon" />
          <h3>No Active Ticket Bookings</h3>
          <p>You haven't booked any movie tickets yet. Browse movies and click "Book Tickets" to select your seats!</p>
          <button className="reset-filters-btn" onClick={onNavigateHome}>
            Browse Movies & Book Now
          </button>
        </div>
      )}
    </div>
  );
}
