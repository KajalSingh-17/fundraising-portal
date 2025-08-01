# 🎯 Intern Dashboard

A modern, full-stack web application for managing intern performance tracking, donations, and leaderboards. Built with Node.js, Express, and vanilla JavaScript with a beautiful, responsive UI.

## ✨ Features

### 🔐 Authentication
- **Login/Signup Interface**: Clean, modern forms with dummy authentication
- **Session Management**: Persistent login state using localStorage
- **Form Validation**: Client-side validation with helpful error messages

### 📊 Dashboard
- **Personalized Welcome**: Greeting with intern's name and join date
- **Key Metrics Display**: 
  - Personal referral code
  - Total donations raised (formatted currency)
  - Member since date
- **Rewards System**: Visual display of earned achievements
- **Available Rewards**: Preview of unlockable rewards with progress indicators

### 🏆 Leaderboard (Bonus)
- **Real-time Rankings**: Sorted by total donations raised
- **Medal System**: Gold, silver, bronze for top 3 performers
- **Comprehensive Data**: Name, referral code, amount raised, and rewards
- **Responsive Table**: Mobile-friendly design

### 🎁 Rewards/Unlockables
- **Achievement Badges**: Bronze, Silver, Gold based on donation thresholds
- **Special Recognition**: First donation, team player, top fundraiser awards
- **Visual Indicators**: Icons and progress tracking
- **Dynamic Updates**: Real-time reward status based on performance

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd /workspace
   ```

2. **Install backend dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Start the backend server**:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

4. **Open the frontend** (in a new terminal):
   ```bash
   cd ../client
   # Open index.html in your browser or use a simple server:
   python3 -m http.server 3000
   # or
   npx serve .
   ```

5. **Access the application**:
   - Frontend: `http://localhost:3000` (or open `client/index.html` directly)
   - Backend API: `http://localhost:5000/api`

## 🧪 Testing the Application

### Demo Credentials
Use these test accounts to explore the dashboard:

| Email | Name | Donations | Rewards |
|-------|------|-----------|---------|
| `alex@example.com` | Alex Johnson | $2,500 | Bronze Badge, First Donation, Team Player |
| `sarah@example.com` | Sarah Chen | $3,200 | Silver Badge, Top Fundraiser, Community Champion |
| `emma@example.com` | Emma Williams | $4,100 | Gold Badge, Super Fundraiser, Leadership Award |

**Password**: Any password will work (dummy auth)

### Quick Demo Tip
Press `Ctrl+T` on the login/signup form to auto-fill test data!

## 🛠️ API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Authentication
- **POST /login**
  ```json
  {
    "email": "alex@example.com",
    "password": "any_password"
  }
  ```

- **POST /signup**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "any_password"
  }
  ```

#### Data Retrieval
- **GET /interns** - Get all interns (for leaderboard)
- **GET /intern/:id** - Get specific intern by ID
- **GET /rewards** - Get available rewards
- **GET /health** - Server health check

### Response Format
All API responses follow this structure:
```json
{
  "success": true,
  "message": "Optional message",
  "data": { /* Response data */ }
}
```

## 🗂️ Project Structure

```
/workspace/
├── client/                 # Frontend (Vanilla HTML/CSS/JS)
│   ├── index.html         # Main HTML file
│   ├── style.css          # Comprehensive styling
│   └── script.js          # Application logic & API calls
└── server/                # Backend (Node.js/Express)
    ├── index.js           # Main server file
    ├── package.json       # Dependencies & scripts
    └── data/
        └── database.json  # JSON database with dummy data
```

## 🎨 Design Features

### Visual Design
- **Modern Gradient Background**: Eye-catching purple gradient
- **Card-based Layout**: Clean, organized information display
- **Responsive Design**: Mobile-first approach with breakpoints
- **Font Awesome Icons**: Professional iconography throughout
- **Smooth Animations**: Hover effects and transitions

### User Experience
- **Loading States**: Visual feedback during API calls
- **Toast Notifications**: Success/error message system
- **Form Validation**: Real-time validation with visual feedback
- **Persistent Sessions**: Automatic login restoration
- **Keyboard Shortcuts**: Demo data shortcuts for testing

## 🔧 Technical Stack

### Backend
- **Node.js & Express**: RESTful API server
- **CORS**: Cross-origin resource sharing
- **Body Parser**: JSON request parsing
- **File System**: JSON-based data storage

### Frontend
- **Vanilla JavaScript**: Modern ES6+ features
- **CSS Grid & Flexbox**: Advanced layout techniques
- **Fetch API**: HTTP requests to backend
- **Local Storage**: Client-side data persistence
- **Responsive Design**: Mobile-friendly interface

## 📱 Mobile Responsiveness

The application is fully responsive with optimized layouts for:
- **Desktop**: Full-featured layout with sidebar navigation
- **Tablet**: Responsive grid adjustments
- **Mobile**: Stacked layout with collapsible navigation

## 🧹 Development Notes

### Dummy Authentication
- Any email/password combination works for login
- Existing emails in database.json will return user data
- New signups show success but don't persist data
- Real authentication would require password hashing and validation

### Data Persistence
- Currently uses JSON file for simplicity
- In production, would use MongoDB, PostgreSQL, etc.
- User sessions persist via localStorage (demo only)

### API Testing
You can test the API endpoints using curl, Postman, or any HTTP client:

```bash
# Health check
curl http://localhost:5000/api/health

# Get all interns
curl http://localhost:5000/api/interns

# Login test
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@example.com","password":"test"}'
```

## 🚀 Future Enhancements

- Real user authentication with JWT tokens
- Database integration (MongoDB/PostgreSQL)
- Real-time updates with WebSockets
- File upload for profile pictures
- Email notifications for achievements
- Advanced analytics and reporting
- Team management features
- Mobile app version

## 📄 License

This project is created for demonstration purposes. Feel free to use and modify as needed.

---

**Built with ❤️ for the intern community**