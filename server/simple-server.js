const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple test routes
app.get('/', (req, res) => {
  res.json({ message: 'EventBook API is running!' });
});

app.get('/api/events', (req, res) => {
  res.json([
    {
      id: 1,
      title: "Tech Conference 2024",
      description: "Annual technology conference featuring the latest innovations in AI and web development.",
      date: "2024-03-15",
      time: "09:00",
      location: "Convention Center, San Francisco",
      price: 299.99,
      max_attendees: 500,
      category: "technology",
      image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"
    }
  ]);
});

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