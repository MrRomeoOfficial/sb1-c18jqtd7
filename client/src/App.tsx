import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import AppContent from './AppContent';
import './App.css';

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="splash-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="splash-content">
        <motion.div
          className="splash-logo"
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 1.2, 
            ease: [0.4, 0, 0.2, 1],
            delay: 0.2
          }}
        >
          <motion.div
            className="logo-icon"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { duration: 2, ease: "linear" },
              scale: { duration: 2, ease: "easeInOut", repeat: Infinity }
            }}
          >
            🎭
          </motion.div>
          <motion.h1
            className="logo-text"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            EventBook
          </motion.h1>
          <motion.p
            className="logo-subtitle"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Discover Amazing Events
          </motion.p>
        </motion.div>

        <motion.div
          className="splash-loader"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <div className="loader-bar">
            <motion.div
              className="loader-progress"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.8, delay: 1.4, ease: "easeOut" }}
            />
          </div>
          <motion.p
            className="loader-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Loading your experience...
          </motion.p>
        </motion.div>
      </div>

      {/* Animated background particles */}
      <div className="splash-particles">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" onComplete={handleSplashComplete} />
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <AuthProvider>
              <div className="app-container">
                <AppContent />
              </div>
            </AuthProvider>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'linear-gradient(135deg, rgba(28, 28, 30, 0.95) 0%, rgba(44, 44, 46, 0.9) 100%)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            fontWeight: '500',
            fontSize: '15px'
          },
          success: {
            iconTheme: {
              primary: '#30D158',
              secondary: '#ffffff'
            }
          },
          error: {
            iconTheme: {
              primary: '#FF3B30',
              secondary: '#ffffff'
            }
          }
        }}
      />
    </div>
  );
};

export default App;