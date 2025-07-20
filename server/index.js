const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database setup
const db = new sqlite3.Database('./database.sqlite');

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Events table
  db.run(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date DATETIME NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    price DECIMAL(10,2) DEFAULT 0,
    max_attendees INTEGER DEFAULT 100,
    image_url TEXT,
    category TEXT DEFAULT 'general',
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users (id)
  )`);

  // Bookings table
  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    tickets INTEGER DEFAULT 1,
    total_amount DECIMAL(10,2),
    status TEXT DEFAULT 'confirmed',
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (event_id) REFERENCES events (id),
    UNIQUE(user_id, event_id)
  )`);

  // Insert demo user
  db.get("SELECT COUNT(*) as count FROM users", async (err, row) => {
    if (row.count === 0) {
      const hashedPassword = await bcrypt.hash('demo123', 10);
      db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
        ['Demo User', 'demo@example.com', hashedPassword]);
    }
  });

  // Insert sample events
  db.get("SELECT COUNT(*) as count FROM events", (err, row) => {
    if (row.count === 0) {
      const sampleEvents = [
        {
          title: "Tech Conference 2024",
          description: "Annual technology conference featuring the latest innovations in AI and web development.",
          date: "2024-03-15",
          time: "09:00",
          location: "Convention Center, San Francisco",
          price: 299.99,
          max_attendees: 500,
          category: "technology",
          image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"
        },
        {
          title: "Summer Music Festival",
          description: "Three days of amazing music with top artists from around the world.",
          date: "2024-06-20",
          time: "14:00",
          location: "Central Park, New York",
          price: 149.99,
          max_attendees: 2000,
          category: "music",
          image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800"
        },
        {
          title: "Startup Pitch Night",
          description: "Watch innovative startups pitch their ideas to top investors.",
          date: "2024-02-28",
          time: "18:00",
          location: "Innovation Hub, Austin",
          price: 25.00,
          max_attendees: 150,
          category: "business",
          image_url: "https://images.unsplash.com/photo-1559223607-a43c990c692c?w=800"
        },
        {
          title: "Food & Wine Tasting",
          description: "Experience the finest local cuisine paired with premium wines.",
          date: "2024-04-12",
          time: "19:00",
          location: "Downtown Restaurant District",
          price: 89.99,
          max_attendees: 80,
          category: "food",
          image_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800"
        },
        {
          title: "Marathon Training Workshop",
          description: "Learn proper training techniques from professional marathon runners.",
          date: "2024-05-08",
          time: "07:00",
          location: "City Sports Complex",
          price: 0,
          max_attendees: 200,
          category: "sports",
          image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"
        }
      ];

      sampleEvents.forEach(event => {
        db.run(`INSERT INTO events (title, description, date, time, location, price, max_attendees, category, image_url) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [event.title, event.description, event.date, event.time, event.location, 
           event.price, event.max_attendees, event.category, event.image_url]);
      });
    }
  });
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ message: 'Email already exists' });
          }
          return res.status(500).json({ message: 'Error creating user' });
        }

        const token = jwt.sign({ userId: this.lastID, email }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({
          message: 'User created successfully',
          token,
          user: { id: this.lastID, name, email }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }

      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
      res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, name: user.name, email: user.email }
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Events Routes
app.get('/api/events', (req, res) => {
  const { category, search } = req.query;
  let query = 'SELECT * FROM events WHERE date >= datetime("now")';
  let params = [];

  if (category && category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }

  if (search) {
    query += ' AND (title LIKE ? OR description LIKE ? OR location LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY date ASC';

  db.all(query, params, (err, events) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching events' });
    }
    res.json(events);
  });
});

app.get('/api/events/:id', (req, res) => {
  const eventId = req.params.id;
  
  db.get('SELECT * FROM events WHERE id = ?', [eventId], (err, event) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching event' });
    }
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Get booking count
    db.get('SELECT COUNT(*) as booked FROM bookings WHERE event_id = ?', [eventId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching booking data' });
      }
      
      event.booked_tickets = result.booked;
      event.available_tickets = event.max_attendees - result.booked;
      res.json(event);
    });
  });
});

// Bookings Routes
app.post('/api/bookings', authenticateToken, (req, res) => {
  const { event_id, tickets } = req.body;
  const user_id = req.user.userId;

  if (!event_id || !tickets || tickets < 1) {
    return res.status(400).json({ message: 'Valid event ID and ticket count required' });
  }

  // Check if event exists and has availability
  db.get('SELECT * FROM events WHERE id = ?', [event_id], (err, event) => {
    if (err || !event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check current bookings
    db.get('SELECT SUM(tickets) as total_booked FROM bookings WHERE event_id = ?', [event_id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error checking availability' });
      }

      const totalBooked = result.total_booked || 0;
      if (totalBooked + tickets > event.max_attendees) {
        return res.status(400).json({ message: 'Not enough tickets available' });
      }

      const totalAmount = event.price * tickets;

      db.run(
        'INSERT OR REPLACE INTO bookings (user_id, event_id, tickets, total_amount) VALUES (?, ?, ?, ?)',
        [user_id, event_id, tickets, totalAmount],
        function(err) {
          if (err) {
            return res.status(500).json({ message: 'Error creating booking' });
          }

          res.status(201).json({
            message: 'Booking created successfully',
            booking: {
              id: this.lastID,
              event_id,
              tickets,
              total_amount: totalAmount
            }
          });
        }
      );
    });
  });
});

app.get('/api/bookings', authenticateToken, (req, res) => {
  const userId = req.user.userId;

  const query = `
    SELECT b.*, e.title, e.date, e.time, e.location, e.image_url
    FROM bookings b
    JOIN events e ON b.event_id = e.id
    WHERE b.user_id = ?
    ORDER BY b.booking_date DESC
  `;

  db.all(query, [userId], (err, bookings) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching bookings' });
    }
    res.json(bookings);
  });
});

app.delete('/api/bookings/:id', authenticateToken, (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user.userId;

  db.run(
    'DELETE FROM bookings WHERE id = ? AND user_id = ?',
    [bookingId, userId],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error cancelling booking' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      res.json({ message: 'Booking cancelled successfully' });
    }
  );
});

// Categories endpoint
app.get('/api/categories', (req, res) => {
  const categories = [
    { id: 'all', name: 'All Events', icon: '🎉' },
    { id: 'technology', name: 'Technology', icon: '💻' },
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'food', name: 'Food & Drink', icon: '🍽️' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'art', name: 'Art & Culture', icon: '🎨' }
  ];
  res.json(categories);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});