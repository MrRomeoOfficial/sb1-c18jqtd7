import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';
import axios from 'axios';
import toast from 'react-hot-toast';
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
  booked_tickets?: number;
  available_tickets?: number;
}

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [ticketCount, setTicketCount] = useState(1);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEvent(id);
    }
  }, [id]);

  const fetchEvent = async (eventId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/events/${eventId}`);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Failed to load event details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!event || !id) return;

    try {
      setBooking(true);
      await axios.post('/api/bookings', {
        event_id: parseInt(id),
        tickets: ticketCount,
      });

      toast.success('🎉 Booking confirmed!');
      
      // Refresh event data to update availability
      fetchEvent(id);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'EEEE, MMMM dd, yyyy');
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

  const increaseTickets = () => {
    if (event && ticketCount < (event.available_tickets || 0)) {
      setTicketCount(ticketCount + 1);
    }
  };

  const decreaseTickets = () => {
    if (ticketCount > 1) {
      setTicketCount(ticketCount - 1);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="loading-screen">
        <p>Event not found</p>
      </div>
    );
  }

  const totalPrice = event.price * ticketCount;
  const isAvailable = (event.available_tickets || 0) > 0;

  return (
    <div className="event-detail-container">
      <div className="event-detail-header">
        <img
          src={event.image_url}
          alt={event.title}
          className="event-detail-image"
        />
        <div className="event-detail-overlay" />
        <div className="event-detail-nav">
          <motion.button
            className="nav-button"
            onClick={() => navigate('/')}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeftIcon className="nav-icon" />
          </motion.button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="event-detail-content"
      >
        <h1 className="event-detail-title">{event.title}</h1>
        <p className="event-detail-description">{event.description}</p>

        <div className="event-info-grid">
          <div className="event-info-item">
            <CalendarDaysIcon className="event-info-icon" />
            <div className="event-info-content">
              <div className="event-info-label">Date</div>
              <div className="event-info-value">{formatDate(event.date)}</div>
            </div>
          </div>

          <div className="event-info-item">
            <ClockIcon className="event-info-icon" />
            <div className="event-info-content">
              <div className="event-info-label">Time</div>
              <div className="event-info-value">{formatTime(event.time)}</div>
            </div>
          </div>

          <div className="event-info-item">
            <MapPinIcon className="event-info-icon" />
            <div className="event-info-content">
              <div className="event-info-label">Location</div>
              <div className="event-info-value">{event.location}</div>
            </div>
          </div>

          <div className="event-info-item">
            <UserGroupIcon className="event-info-icon" />
            <div className="event-info-content">
              <div className="event-info-label">Availability</div>
              <div className="event-info-value">
                {event.available_tickets || 0} / {event.max_attendees} spots available
              </div>
            </div>
          </div>

          {event.price > 0 && (
            <div className="event-info-item">
              <CurrencyDollarIcon className="event-info-icon" />
              <div className="event-info-content">
                <div className="event-info-label">Price</div>
                <div className="event-info-value">${event.price.toFixed(2)} per ticket</div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {isAvailable && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="booking-section"
        >
          <div className="booking-content">
            <div className="booking-price">
              <div className="price-amount">
                {event.price === 0 ? 'Free' : `$${totalPrice.toFixed(2)}`}
              </div>
              <div className="price-label">
                {event.price === 0 ? 'No cost' : `${ticketCount} ticket${ticketCount > 1 ? 's' : ''}`}
              </div>
            </div>

            <div className="ticket-selector">
              <button
                className="ticket-button"
                onClick={decreaseTickets}
                disabled={ticketCount <= 1}
              >
                −
              </button>
              <span className="ticket-count">{ticketCount}</span>
              <button
                className="ticket-button"
                onClick={increaseTickets}
                disabled={ticketCount >= (event.available_tickets || 0)}
              >
                +
              </button>
            </div>
          </div>

          <motion.button
            className="book-button"
            onClick={handleBooking}
            disabled={booking || !isAvailable}
            whileTap={{ scale: 0.98 }}
          >
            {booking ? (
              <div className="loading-spinner small"></div>
            ) : (
              `Book ${ticketCount > 1 ? 'Tickets' : 'Ticket'}`
            )}
          </motion.button>
        </motion.div>
      )}

      {!isAvailable && (
        <div className="booking-section">
          <button className="book-button" disabled>
            Sold Out
          </button>
        </div>
      )}
    </div>
  );
};

export default EventDetail;