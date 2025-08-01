# 🎓 Intern Dashboard

A modern, full-stack web application for tracking intern fundraising progress, referrals, and rewards. Built with Node.js, Express, and vanilla JavaScript with a beautiful, responsive UI.

## ✨ Features

### 🔐 Authentication
- **Login/Signup Pages**: Clean, modern interface with dummy authentication
- **Demo Credentials**: Pre-loaded test accounts for easy testing
- **Session Management**: Client-side authentication state management

### 📊 Dashboard
- **Personal Stats**: View total donations raised, referral code, and current rank
- **Progress Tracking**: Visual progress bars for Bronze, Silver, Gold, and Platinum badges
- **Rewards System**: Display unlocked/locked achievements with descriptions
- **Referral Sharing**: Copy referral code and share on social media platforms

### 🏆 Leaderboard
- **Top 3 Podium**: Visual podium display for top performers
- **Complete Rankings**: Sortable table with all intern rankings
- **Summary Statistics**: Total interns, total raised, and average amounts
- **Badge System**: Color-coded badges based on donation amounts

### 🎨 UI/UX
- **Modern Design**: Glassmorphism effects with gradient backgrounds
- **Responsive Layout**: Mobile-friendly design that works on all devices
- **Smooth Animations**: Hover effects and transitions for better user experience
- **Accessibility**: Proper color contrast and keyboard navigation support

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone the repository** (or use the existing workspace):
   ```bash
   cd /workspace
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

## 🧪 Testing the Application

### Demo Accounts
The application comes with pre-loaded demo data. Use these credentials to test:

**Test Account 1:**
- Email: `alex.johnson@company.com`
- Password: `password123`
- Features: $2,450.75 raised, Bronze & Silver badges unlocked

**Test Account 2:**
- Email: `sarah.chen@company.com`
- Password: `password123`
- Features: $3,820.50 raised, Bronze & Silver badges unlocked

**Test Account 3:**
- Email: `michael.rodriguez@company.com`
- Password: `password123`
- Features: $1,875.25 raised, Bronze badge unlocked

**Test Account 4:**
- Email: `emily.davis@company.com`
- Password: `password123`
- Features: $5,240.90 raised, Bronze, Silver & Gold badges unlocked

### Registration Testing
You can also test the registration functionality:
1. Click "Sign up here" on the login page
2. Fill in any name, email, and password
3. New users start with $0 raised and no badges unlocked

## 📁 Project Structure

```
intern-dashboard/
├── client/                    # Frontend files
│   ├── index.html            # Login/Signup page
│   ├── dashboard.html        # Main dashboard
│   ├── leaderboard.html      # Leaderboard page
│   ├── script.js             # JavaScript functionality
│   └── style.css             # CSS styling
├── server/                   # Backend files
│   ├── index.js              # Express server and API endpoints
│   └── routes/               # Additional route files (if needed)
├── package.json              # Node.js dependencies and scripts
└── README.md                 # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration

### User Data
- `GET /api/user/:userId` - Get user profile and stats
- `GET /api/leaderboard` - Get ranked list of all users

### Static Routes
- `GET /` - Serve login page
- `GET /dashboard` - Serve dashboard page
- `GET /leaderboard` - Serve leaderboard page

## 🎨 Design Features

### Color Scheme
- **Primary**: Purple gradient (#667eea to #764ba2)
- **Success**: Green (#4CAF50)
- **Warning**: Orange (#FF9800)
- **Error**: Red (#f44336)
- **Info**: Blue (#2196F3)

### Typography
- **Font Family**: Inter, Segoe UI, sans-serif
- **Headings**: Bold weights (600-700)
- **Body**: Regular weight (400)

### Effects
- **Glassmorphism**: Backdrop blur with transparency
- **Gradients**: Smooth color transitions
- **Box Shadows**: Depth and elevation
- **Hover Animations**: Subtle transform effects

## 🔧 Customization

### Adding New Users
Edit the `internData.users` array in `server/index.js` to add more users:

```javascript
{
  id: 5,
  name: "Your Name",
  email: "your.email@company.com",
  referralCode: "yourname2025",
  totalDonations: 1500.00,
  rewards: [
    { name: "Bronze Badge", unlocked: true, description: "Raise $1000+" },
    // ... more rewards
  ]
}
```

### Modifying Badge Thresholds
Update the badge amounts in the `updateProgressBars` function in `script.js`:

```javascript
const goals = [
  { id: 'bronze', amount: 1000, progressId: 'bronzeProgress', barId: 'bronzeBar' },
  { id: 'silver', amount: 2000, progressId: 'silverProgress', barId: 'silverBar' },
  // ... modify amounts as needed
];
```

### Styling Changes
- Main styles are in `client/style.css`
- Colors can be changed by updating CSS custom properties
- Responsive breakpoints can be adjusted in media queries

## 🚀 Deployment Options

### Local Development
```bash
npm run dev    # Start with nodemon for auto-restart
```

### Production
```bash
npm start      # Start production server
```

### Environment Variables
Create a `.env` file for production configuration:
```env
PORT=3000
NODE_ENV=production
```

## 📱 Mobile Responsiveness

The application is fully responsive with breakpoints at:
- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: 480px - 767px
- **Small Mobile**: Below 480px

## 🤝 Contributing

This is a demo application, but contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use a different port
PORT=3001 npm start
```

**Dependencies Issues:**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Browser Compatibility:**
- Requires modern browser with ES6+ support
- Tested on Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Development Tools

**Testing API Endpoints:**
Use Postman or curl to test the backend:

```bash
# Test login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex.johnson@company.com","password":"password123"}'

# Test leaderboard
curl http://localhost:3000/api/leaderboard
```

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the browser console for errors
3. Check the server logs in the terminal
4. Ensure all dependencies are properly installed

---

**Built with ❤️ for intern fundraising programs**