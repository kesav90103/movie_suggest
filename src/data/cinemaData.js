export const THEATER_INFO = {
  name: 'CineVerse IMAX & Dolby Cinema',
  screen: 'Screen 1 — Dolby Atmos 200-Seat Theater',
  totalSeats: 200,
  rows: 10,
  seatsPerRow: 20,
  soundSystem: 'Dolby Atmos 7.1.4 Surround Sound',
  projection: '4K Dual Laser Projection',
  experienceBadges: ['Dolby Atmos', '4K Laser', 'Recliner VIP', 'Interval F&B Delivery']
};

export const SHOWTIMES = [
  { id: 'st1', time: '10:30 AM', label: 'Morning Show', format: 'Dolby Atmos 2D', priceMultiplier: 1.0 },
  { id: 'st2', time: '02:15 PM', label: 'Matinee', format: '4K Laser 3D', priceMultiplier: 1.15 },
  { id: 'st3', time: '06:00 PM', label: 'Prime Evening', format: 'IMAX Dolby Atmos', priceMultiplier: 1.3 },
  { id: 'st4', time: '09:45 PM', label: 'Night Show', format: 'Dolby Atmos 4K', priceMultiplier: 1.2 }
];

export const SEAT_CATEGORIES = {
  VIP: { name: 'VIP Recliners (Dolby Zone)', price: 350, rows: ['A', 'B'] },
  PREMIUM: { name: 'Premium Central', price: 250, rows: ['C', 'D', 'E', 'F'] },
  EXECUTIVE: { name: 'Executive Standard', price: 180, rows: ['G', 'H', 'I', 'J'] }
};

export function generate200SeatMap(bookedSeatIds = []) {
  const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const seats = [];

  // Deterministic occupied seats for realistic booking simulation
  const occupiedSet = new Set(bookedSeatIds.concat(['A5', 'A6', 'C10', 'C11', 'D12', 'D13', 'E8', 'E9', 'G15', 'G16']));

  rowLabels.forEach((row) => {
    let cat = 'EXECUTIVE';
    if (['A', 'B'].includes(row)) cat = 'VIP';
    else if (['C', 'D', 'E', 'F'].includes(row)) cat = 'PREMIUM';

    for (let col = 1; col <= 20; col++) {
      const seatId = `${row}${col}`;
      seats.push({
        id: seatId,
        row,
        col,
        category: cat,
        price: SEAT_CATEGORIES[cat].price,
        isOccupied: occupiedSet.has(seatId),
        isWheelchair: row === 'J' && (col === 1 || col === 20)
      });
    }
  });

  return seats;
}

export const INTERVAL_FOOD_MENU = [
  {
    id: 'f1',
    name: 'Caramel & Butter Popcorn (Large)',
    category: 'Popcorn',
    price: 220,
    calories: '450 kcal',
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=400&q=80',
    description: 'Freshly popped warm popcorn drizzled with rich butter and golden caramel.'
  },
  {
    id: 'f2',
    name: 'Cheese Nachos with Jalapeño Dip',
    category: 'Snacks',
    price: 190,
    calories: '380 kcal',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=400&q=80',
    description: 'Crispy corn tortilla chips served with warm melted cheddar cheese and tangy jalapeños.'
  },
  {
    id: 'f3',
    name: 'Paneer / Chicken Samosa (2 Pcs)',
    category: 'Snacks',
    price: 140,
    calories: '290 kcal',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
    description: 'Gold-fried crispy pastry pockets filled with spiced potato & cottage cheese.'
  },
  {
    id: 'f4',
    name: 'Fountain Ice Cold Soda (750ml)',
    category: 'Beverages',
    price: 120,
    calories: '180 kcal',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
    description: 'Choice of Coca-Cola, Thums Up, Sprite, or Fanta chilled with crushed ice.'
  },
  {
    id: 'f5',
    name: 'Cold Brew Iced Coffee',
    category: 'Beverages',
    price: 160,
    calories: '140 kcal',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80',
    description: 'Creamy slow-steeped espresso iced coffee topped with cocoa powder.'
  },
  {
    id: 'f6',
    name: 'Interval Blockbuster Combo',
    category: 'Combos',
    price: 420,
    calories: '850 kcal',
    image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=400&q=80',
    description: '1 Large Popcorn + 2 Cold Beverages + 1 Cheese Nachos (Save 20%).'
  }
];
