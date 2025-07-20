import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserCircleIcon,
  TicketIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Profile.css';

interface Booking {
  id: number;
  event_id: number;
  tickets: number;
  total_amount: number;
  status: string;
  booking_date: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image_url: string;
}

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    try {
      setCancellingId(bookingId);
      await axios.delete(`/api/bookings/${bookingId}`);
      toast.success('Booking cancelled successfully');
      fetchBookings(); // Refresh bookings
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
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

  const formatBookingDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const isEventPast = (dateString: string) => {
    try {
      const eventDate = parseISO(dateString);
      return eventDate < new Date();
    } catch (error) {
      return false;
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="profile-avatar"
        >
          <UserCircleIcon className="avatar-icon" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="profile-info"
        >
          <h1 className="profile-name">{user?.name}</h1>
          <p className="profile-email">{user?.email}</p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="logout-button"
          onClick={logout}
          whileTap={{ scale: 0.95 }}
        >
          Sign Out
        </motion.button>
      </div>

      <div className="bookings-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="section-header"
        >
          <TicketIcon className="section-icon" />
          <h2 className="section-title">My Bookings</h2>
        </motion.div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="no-bookings"
          >
            <div className="no-bookings-icon">🎫</div>
            <h3 className="no-bookings-title">No bookings yet</h3>
            <p className="no-bookings-text">
              Start exploring events and book your first ticket!
            </p>
          </motion.div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`booking-card ${isEventPast(booking.date) ? 'past' : ''}`}
              >
                <div className="booking-image-container">
                  <img
                    src={booking.image_url}
                    alt={booking.title}
                    className="booking-image"
                  />
                  <div className="booking-overlay">
                    <div className="booking-status">
                      {isEventPast(booking.date) ? 'Past Event' : 'Upcoming'}
                    </div>
                    {!isEventPast(booking.date) && (
                      <button
                        className="cancel-button"
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancellingId === booking.id}
                      >
                        {cancellingId === booking.id ? (
                          <div className="loading-spinner small"></div>
                        ) : (
                          <XMarkIcon className="cancel-icon" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="booking-content">
                  <h3 className="booking-title">{booking.title}</h3>

                  <div className="booking-details">
                    <div className="booking-detail-item">
                      <CalendarDaysIcon className="detail-icon" />
                      <span className="detail-text">{formatDate(booking.date)}</span>
                    </div>

                    <div className="booking-detail-item">
                      <ClockIcon className="detail-icon" />
                      <span className="detail-text">{formatTime(booking.time)}</span>
                    </div>

                    <div className="booking-detail-item">
                      <MapPinIcon className="detail-icon" />
                      <span className="detail-text">{booking.location}</span>
                    </div>
                  </div>

                  <div className="booking-footer">
                    <div className="booking-tickets">
                      <span className="tickets-count">{booking.tickets}</span>
                      <span className="tickets-label">
                        ticket{booking.tickets > 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="booking-price">
                      {booking.total_amount === 0 ? (
                        <span className="price-free">Free</span>
                      ) : (
                        <span className="price-paid">${booking.total_amount.toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  <div className="booking-meta">
                    <span className="booking-date">
                      Booked on {formatBookingDate(booking.booking_date)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;