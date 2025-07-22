import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import EventCard from '../Events/EventCard';
import CategoryFilter from '../Events/CategoryFilter';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Home.css';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  max_attendees: number;
  image_url: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

const Home: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchCategories();
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await axios.get(`/api/events?${params.toString()}`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <motion.div 
      className="home-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="home-header">
        <motion.div
          variants={itemVariants}
          className="welcome-section"
        >
          <motion.h1 
            className="welcome-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Hello, {user?.name?.split(' ')[0]} 👋
          </motion.h1>
          <motion.p 
            className="welcome-subtitle"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Discover amazing events near you
          </motion.p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="search-section"
        >
          <div className="search-container">
            <MagnifyingGlassIcon className="search-icon" />
            <motion.input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </motion.div>
      </div>

      <div className="events-section">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="loading-container"
            >
              <motion.div 
                className="loading-spinner"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.p 
                className="loading-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Loading events...
              </motion.p>
            </motion.div>
          ) : events.length === 0 ? (
            <motion.div
              key="no-events"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="no-events"
            >
              <motion.div 
                className="no-events-icon"
                animate={{ 
                  y: [-8, 8, -8],
                  rotate: [-2, 2, -2]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                🎭
              </motion.div>
              <h3 className="no-events-title">No events found</h3>
              <p className="no-events-text">
                {searchQuery || selectedCategory !== 'all'
                  ? 'Try adjusting your search or category filter'
                  : 'Check back later for new events'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="events"
              className="events-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  custom={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Home;