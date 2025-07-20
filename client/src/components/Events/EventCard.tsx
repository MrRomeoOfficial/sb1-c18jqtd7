import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDaysIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';
import './Events.css';

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

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/event/${event.id}`);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return format(date, 'h:mm a');
    } catch (error) {
      return timeString;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      technology: '#007AFF',
      music: '#FF3B30',
      business: '#30D158',
      food: '#FF9F0A',
      sports: '#5856D6',
      art: '#AF52DE',
      general: '#8E8E93'
    };
    return colors[category] || colors.general;
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: { [key: string]: string } = {
      technology: '💻',
      music: '🎵',
      business: '💼',
      food: '🍽️',
      sports: '⚽',
      art: '🎨',
      general: '🎉'
    };
    return emojis[category] || emojis.general;
  };

  return (
    <motion.div
      className="event-card"
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="event-card-image-container">
        <img
          src={event.image_url}
          alt={event.title}
          className="event-card-image"
          loading="lazy"
        />
        <div className="event-card-overlay">
          <div
            className="event-category-badge"
            style={{ backgroundColor: getCategoryColor(event.category) }}
          >
            <span className="category-emoji">{getCategoryEmoji(event.category)}</span>
            <span className="category-text">{event.category}</span>
          </div>
          {event.price === 0 && (
            <div className="free-badge">FREE</div>
          )}
        </div>
      </div>

      <div className="event-card-content">
        <h3 className="event-title">{event.title}</h3>
        <p className="event-description">{event.description}</p>

        <div className="event-details">
          <div className="event-detail-item">
            <CalendarDaysIcon className="detail-icon" />
            <span className="detail-text">{formatDate(event.date)}</span>
          </div>
          
          <div className="event-detail-item">
            <ClockIcon className="detail-icon" />
            <span className="detail-text">{formatTime(event.time)}</span>
          </div>
          
          <div className="event-detail-item">
            <MapPinIcon className="detail-icon" />
            <span className="detail-text">{event.location}</span>
          </div>
        </div>

        <div className="event-card-footer">
          <div className="event-price">
            {event.price === 0 ? (
              <span className="price-free">Free</span>
            ) : (
              <span className="price-paid">${event.price.toFixed(2)}</span>
            )}
          </div>
          <div className="event-capacity">
            <span className="capacity-text">{event.max_attendees} spots</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;