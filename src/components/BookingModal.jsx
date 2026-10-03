import React, { useState, useMemo } from 'react';
import { X, Calendar, Clock, Sparkles, Check, ShoppingBag, QrCode, ArrowRight, ArrowLeft, Volume2, ShieldCheck, Plus, Minus, Film } from 'lucide-react';
import { THEATER_INFO, SHOWTIMES, SEAT_CATEGORIES, INTERVAL_FOOD_MENU, generate200SeatMap } from '../data/cinemaData';
import { useWatchlist } from '../context/WatchlistContext';

export default function BookingModal({ movie, onClose, onBookingSuccess }) {
  const { addBooking, bookings } = useWatchlist();

  // Booking Flow Steps: 1 = Showtime, 2 = 200 Seats, 3 = Interval Food, 4 = Confirmation
  const [step, setStep] = useState(1);
  const [selectedShowtime, setSelectedShowtime] = useState(SHOWTIMES[2]); // Default 06:00 PM Prime Evening
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [foodCart, setFoodCart] = useState({}); // { f1: quantity }

  // Generate 200-seat map with previously booked seats for this movie/showtime
  const bookedSeatIds = useMemo(() => {
    const existing = bookings
      .filter(b => b.movieId === movie.id && b.showtime.id === selectedShowtime.id)
      .flatMap(b => b.seats.map(s => s.id));
    return existing;
  }, [bookings, movie.id, selectedShowtime.id]);

  const seatMap = useMemo(() => {
    return generate200SeatMap(bookedSeatIds);
  }, [bookedSeatIds]);

  // Seat Click Handler
  const toggleSeat = (seat) => {
    if (seat.isOccupied) return;

    setSelectedSeats(prev => {
      const exists = prev.some(s => s.id === seat.id);
      if (exists) {
        return prev.filter(s => s.id !== seat.id);
      } else {
        if (prev.length >= 10) {
          alert('You can select a maximum of 10 seats per booking.');
          return prev;
        }
        return [...prev, seat];
      }
    });
  };

  // Food Item Quantity Handler
  const updateFoodQuantity = (foodId, delta) => {
    setFoodCart(prev => {
      const current = prev[foodId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[foodId];
        return copy;
      }
      return { ...prev, [foodId]: next };
    });
  };

  // Pricing Calculations
  const seatsTotal = useMemo(() => {
    return selectedSeats.reduce((sum, seat) => sum + Math.round(seat.price * selectedShowtime.priceMultiplier), 0);
  }, [selectedSeats, selectedShowtime]);

  const foodTotal = useMemo(() => {
    return Object.entries(foodCart).reduce((sum, [id, qty]) => {
      const item = INTERVAL_FOOD_MENU.find(f => f.id === id);
      return sum + (item ? item.price * qty : 0);
    }, 0);
  }, [foodCart]);

  const convenienceFee = selectedSeats.length > 0 ? 30 : 0;
  const grandTotal = seatsTotal + foodTotal + convenienceFee;

  // Final Confirmation Handler
  const handleConfirmBooking = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat to complete your booking.');
      return;
    }

    const bookingId = 'TKT-' + Math.floor(100000 + Math.random() * 900000);
    const bookingObject = {
      id: bookingId,
      movieId: movie.id,
      movieTitle: movie.title,
      poster: movie.poster,
      backdrop: movie.backdrop,
      theater: THEATER_INFO.name,
      screen: THEATER_INFO.screen,
      showtime: selectedShowtime,
      seats: selectedSeats,
      foodOrders: Object.entries(foodCart).map(([id, qty]) => {
        const item = INTERVAL_FOOD_MENU.find(f => f.id === id);
        return { ...item, quantity: qty };
      }),
      seatsTotal,
      foodTotal,
      convenienceFee,
      grandTotal,
      bookingDate: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
      qrCodeData: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=CINEVERSE-${bookingId}`
    };

    addBooking(bookingObject);
    if (onBookingSuccess) onBookingSuccess(bookingObject);
  };

  // Zoom & Scale controls for Mobile 200-seat layout
  const [zoomLevel, setZoomLevel] = useState(1);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="booking-header">
          <div className="header-movie-info">
            <h2>{movie.title}</h2>
            <div className="sub-meta">
              <span>⭐ {movie.rating || '8.5'}/10 TMDB Reviews</span>
              <span>•</span>
              <span>{THEATER_INFO.name}</span>
            </div>
          </div>
          
          <button className="modal-close-btn" onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="booking-steps-bar">
          <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
            <span className="step-num">1</span>
            <span className="step-lbl">Showtime & Format</span>
          </div>
          <div className={`step-line ${step >= 2 ? 'active' : ''}`} />
          <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
            <span className="step-num">2</span>
            <span className="step-lbl">Select 200-Seat Layout</span>
          </div>
          <div className={`step-line ${step >= 3 ? 'active' : ''}`} />
          <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
            <span className="step-num">3</span>
            <span className="step-lbl">Interval Snacks Delivery</span>
          </div>
          <div className={`step-line ${step >= 4 ? 'active' : ''}`} />
          <div className={`step-item ${step >= 4 ? 'active' : ''}`}>
            <span className="step-num">4</span>
            <span className="step-lbl">Ticket & Receipt</span>
          </div>
        </div>

        {/* STEP 1: SHOWTIME & FORMAT SELECTION */}
        {step === 1 && (
          <div className="step-content step-showtime">
            <div className="theater-badge-card">
              <div className="badge-header">
                <Volume2 className="icon glowing-icon" />
                <span>{THEATER_INFO.screen}</span>
              </div>
              <p>Experience 200-Seat Curved Screen layout with {THEATER_INFO.soundSystem} & {THEATER_INFO.projection}.</p>
              <div className="badges-list">
                {THEATER_INFO.experienceBadges.map((b, idx) => (
                  <span key={idx} className="exp-tag">{b}</span>
                ))}
              </div>
            </div>

            <h3 className="section-subtitle">Choose Showtime for Today</h3>
            <div className="showtimes-grid">
              {SHOWTIMES.map(st => (
                <div 
                  key={st.id}
                  className={`showtime-card ${selectedShowtime.id === st.id ? 'active' : ''}`}
                  onClick={() => setSelectedShowtime(st)}
                >
                  <div className="st-time">{st.time}</div>
                  <div className="st-label">{st.label}</div>
                  <div className="st-format">{st.format}</div>
                </div>
              ))}
            </div>

            <div className="step-actions">
              <button 
                className="btn primary-action-btn"
                onClick={() => setStep(2)}
              >
                Proceed to Seat Selection <ArrowRight className="icon" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: INTERACTIVE 200-SEAT THEATER GRID */}
        {step === 2 && (
          <div className="step-content step-seats">
            {/* Screen Curve Indicator */}
            <div className="screen-curve-container">
              <div className="curved-screen">SCREEN THIS WAY (CURVED 4K LASER)</div>
              <div className="sound-zone-badge">
                <Volume2 className="icon" /> Dolby Atmos Surround Sound 7.1.4 Zone
              </div>
            </div>

            {/* Seat Category Legend & Mobile Zoom Bar */}
            <div className="seat-legend-bar">
              <div className="seat-legend">
                <div className="legend-item"><span className="seat-box available" /> Executive (₹180)</div>
                <div className="legend-item"><span className="seat-box premium" /> Premium (₹250)</div>
                <div className="legend-item"><span className="seat-box vip" /> VIP Recliner (₹350)</div>
                <div className="legend-item"><span className="seat-box selected" /> Selected</div>
                <div className="legend-item"><span className="seat-box occupied" /> Occupied</div>
              </div>

              {/* Mobile Zoom Controls */}
              <div className="zoom-controls">
                <span className="zoom-lbl">Touch Zoom:</span>
                <button 
                  className={`zoom-btn ${zoomLevel === 1 ? 'active' : ''}`}
                  onClick={() => setZoomLevel(1)}
                  title="Fit View"
                >
                  1x
                </button>
                <button 
                  className={`zoom-btn ${zoomLevel === 1.25 ? 'active' : ''}`}
                  onClick={() => setZoomLevel(1.25)}
                  title="Medium Zoom"
                >
                  1.25x
                </button>
                <button 
                  className={`zoom-btn ${zoomLevel === 1.5 ? 'active' : ''}`}
                  onClick={() => setZoomLevel(1.5)}
                  title="Large Zoom for Easy Tapping"
                >
                  1.5x
                </button>
              </div>
            </div>

            {/* 200 Seat Matrix (10 Rows x 20 Cols) */}
            <div className="seats-matrix-scroll">
              <div 
                className="seats-matrix"
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left', transition: 'transform 0.2s ease' }}
              >
                {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map(rowLabel => {
                  const rowSeats = seatMap.filter(s => s.row === rowLabel);
                  return (
                    <div key={rowLabel} className="seat-row">
                      <span className="row-letter">{rowLabel}</span>
                      <div className="row-seats-list">
                        {rowSeats.map(seat => {
                          const isSelected = selectedSeats.some(s => s.id === seat.id);
                          let seatClass = `seat-unit ${seat.category.toLowerCase()}`;
                          if (seat.isOccupied) seatClass += ' occupied';
                          if (isSelected) seatClass += ' selected';

                          return (
                            <button
                              key={seat.id}
                              className={seatClass}
                              disabled={seat.isOccupied}
                              onClick={() => toggleSeat(seat)}
                              title={`${seat.id} - ${SEAT_CATEGORIES[seat.category].name} (₹${Math.round(seat.price * selectedShowtime.priceMultiplier)})`}
                            >
                              {seat.col}
                            </button>
                          );
                        })}
                      </div>
                      <span className="row-letter">{rowLabel}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Seats Summary Bar */}
            <div className="selected-summary-bar">
              <div className="summary-left">
                <span className="count-label">
                  Selected Seats ({selectedSeats.length}/10):
                </span>
                <span className="seats-list-text">
                  {selectedSeats.length > 0 
                    ? selectedSeats.map(s => s.id).join(', ') 
                    : 'None selected yet'}
                </span>
              </div>
              <div className="summary-right">
                <span className="total-price">₹{seatsTotal}</span>
              </div>
            </div>

            <div className="step-actions">
              <button className="btn cancel-btn" onClick={() => setStep(1)}>
                <ArrowLeft className="icon" /> Back
              </button>
              <button 
                className="btn primary-action-btn"
                disabled={selectedSeats.length === 0}
                onClick={() => setStep(3)}
              >
                Pre-Order Interval Food <ArrowRight className="icon" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: INTERVAL FOOD & BEVERAGE PRE-ORDER */}
        {step === 3 && (
          <div className="step-content step-food">
            <div className="food-banner">
              <ShoppingBag className="icon" />
              <div>
                <h3>Pre-Order Interval Snacks & Beverages</h3>
                <p>Skip the cinema lobby queues! Your food will be served directly to your seat during interval.</p>
              </div>
            </div>

            <div className="food-grid">
              {INTERVAL_FOOD_MENU.map(item => {
                const qty = foodCart[item.id] || 0;
                return (
                  <div key={item.id} className="food-card">
                    <img src={item.image} alt={item.name} />
                    <div className="food-info">
                      <h4>{item.name}</h4>
                      <p className="desc">{item.description}</p>
                      <div className="food-meta">
                        <span className="price">₹{item.price}</span>
                        <span className="cal">{item.calories}</span>
                      </div>
                    </div>

                    <div className="food-controls">
                      {qty > 0 ? (
                        <div className="qty-counter">
                          <button onClick={() => updateFoodQuantity(item.id, -1)}><Minus /></button>
                          <span className="qty-val">{qty}</span>
                          <button onClick={() => updateFoodQuantity(item.id, 1)}><Plus /></button>
                        </div>
                      ) : (
                        <button className="add-food-btn" onClick={() => updateFoodQuantity(item.id, 1)}>
                          + Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="step-actions">
              <button className="btn cancel-btn" onClick={() => setStep(2)}>
                <ArrowLeft className="icon" /> Back to Seats
              </button>
              <button className="btn primary-action-btn" onClick={() => setStep(4)}>
                Review Order & Checkout <ArrowRight className="icon" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: RECEIPT & QR CODE TICKET CONFIRMATION */}
        {step === 4 && (
          <div className="step-content step-confirmation">
            <div className="receipt-card">
              <div className="receipt-header">
                <h3>{movie.title}</h3>
                <span className="screen-tag">{THEATER_INFO.screen}</span>
              </div>

              <div className="receipt-details">
                <div className="detail-row">
                  <span className="lbl">Showtime:</span>
                  <span className="val">{selectedShowtime.time} ({selectedShowtime.format})</span>
                </div>
                <div className="detail-row">
                  <span className="lbl">Seats ({selectedSeats.length}):</span>
                  <span className="val seats-highlight">{selectedSeats.map(s => s.id).join(', ')}</span>
                </div>
                <div className="detail-row">
                  <span className="lbl">Tickets Subtotal:</span>
                  <span className="val">₹{seatsTotal}</span>
                </div>

                {foodTotal > 0 && (
                  <div className="detail-row">
                    <span className="lbl">Interval F&B Delivery:</span>
                    <span className="val">₹{foodTotal}</span>
                  </div>
                )}

                <div className="detail-row">
                  <span className="lbl">Convenience Fee:</span>
                  <span className="val">₹{convenienceFee}</span>
                </div>

                <div className="detail-row total-row">
                  <span className="lbl">Grand Total Payable:</span>
                  <span className="val total-val">₹{grandTotal}</span>
                </div>
              </div>

              {/* Scannable QR Code Simulator */}
              <div className="qr-box">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CINEVERSE-${movie.id}`} 
                  alt="QR Code" 
                />
                <span className="qr-lbl">Scan this QR Code at Screen 1 Entry & F&B Counter</span>
              </div>
            </div>

            <div className="step-actions">
              <button className="btn cancel-btn" onClick={() => setStep(3)}>
                <ArrowLeft className="icon" /> Edit Food Order
              </button>
              <button className="btn confirm-pay-btn" onClick={handleConfirmBooking}>
                <Check className="icon" /> Pay ₹{grandTotal} & Confirm Ticket
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
