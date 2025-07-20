# EventBook - Full Stack Event Booking App

A modern, full-stack event booking application with an iPhone-style UI built with React, TypeScript, Node.js, Express, and SQLite.

## Features

### 🎯 Core Features
- **User Authentication** - Secure registration and login with JWT tokens
- **Event Discovery** - Browse events with search and category filtering
- **Event Booking** - Book tickets with real-time availability checking
- **Profile Management** - View and manage your bookings
- **Responsive Design** - iPhone-style UI that works on all devices

### 🎨 Design Features
- **iPhone-Style UI** - Modern, sleek interface mimicking iOS design
- **Smooth Animations** - Framer Motion powered transitions
- **Dark Theme** - Beautiful dark theme with glassmorphism effects
- **Touch-Friendly** - Optimized for mobile interactions

### 🛠 Technical Features
- **TypeScript** - Full type safety across the application
- **Real-time Updates** - Live booking availability
- **Image Optimization** - Lazy loading and responsive images
- **Error Handling** - Comprehensive error handling with user feedback
- **Security** - Password hashing, JWT authentication, input validation

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **TypeScript** - Type-safe JavaScript
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Beautiful notifications
- **Heroicons** - Beautiful SVG icons
- **Date-fns** - Modern date utility library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite3** - Lightweight database
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd event-booking-app
   ```

2. **Install dependencies for all parts**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

### Manual Setup (Alternative)

If you prefer to set up each part manually:

1. **Backend Setup**
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **Frontend Setup** (in a new terminal)
   ```bash
   cd client
   npm install
   npm start
   ```

## Project Structure

```
event-booking-app/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Auth/      # Authentication components
│   │   │   ├── Events/    # Event-related components
│   │   │   ├── Home/      # Home page components
│   │   │   ├── Navigation/# Navigation components
│   │   │   └── Profile/   # Profile components
│   │   ├── contexts/      # React contexts
│   │   ├── App.tsx        # Main app component
│   │   └── index.tsx      # Entry point
│   └── package.json
├── server/                # Node.js backend
│   ├── index.js          # Express server
│   ├── database.sqlite   # SQLite database (auto-generated)
│   └── package.json
├── package.json          # Root package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Events
- `GET /api/events` - Get all events (with optional filters)
- `GET /api/events/:id` - Get event details
- `GET /api/categories` - Get event categories

### Bookings (Protected)
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create a new booking
- `DELETE /api/bookings/:id` - Cancel a booking

## Demo Account

For testing purposes, you can use the demo account:
- **Email**: demo@example.com
- **Password**: demo123

Or create your own account using the registration form.

## Sample Events

The app comes with pre-populated sample events including:
- Tech Conference 2024
- Summer Music Festival
- Startup Pitch Night
- Food & Wine Tasting
- Marathon Training Workshop

## Development

### Available Scripts

#### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run install-all` - Install dependencies for all parts
- `npm run build` - Build the frontend for production

#### Backend (server/)
- `npm run dev` - Start backend with nodemon
- `npm start` - Start backend in production mode

#### Frontend (client/)
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

## Deployment

### Frontend (Vercel/Netlify)
1. Build the client: `cd client && npm run build`
2. Deploy the `build` folder to your hosting service
3. Set the API URL environment variable

### Backend (Heroku/Railway)
1. Deploy the `server` folder
2. Set environment variables
3. The SQLite database will be created automatically

### Full Stack (Railway/Render)
1. Deploy the entire repository
2. Set build and start commands appropriately
3. Configure environment variables

## Features in Detail

### Authentication System
- Secure JWT-based authentication
- Password hashing with bcrypt
- Protected routes and middleware
- Persistent login sessions

### Event Management
- Dynamic event listing with search
- Category-based filtering
- Real-time availability tracking
- Detailed event information

### Booking System
- Multiple ticket booking
- Availability validation
- Booking history tracking
- Cancellation functionality

### User Interface
- iPhone-inspired design language
- Smooth animations and transitions
- Touch-optimized interactions
- Responsive across all devices

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspiration from iOS and modern mobile apps
- Icons provided by Heroicons
- Sample images from Unsplash
- React and Node.js communities for excellent documentation

---

**Built with ❤️ using React, TypeScript, and Node.js**