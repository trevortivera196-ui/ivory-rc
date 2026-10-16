# 🏢 Ivory Apartment - Complete Property Management System

A comprehensive web-based property management platform with separate portals for tenants and administrators.

## 📋 Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
- [File Structure](#file-structure)
- [User Roles](#user-roles)
- [Usage Guide](#usage-guide)
- [Demo Credentials](#demo-credentials)

---

## ✨ Features

### 🏠 Tenant Portal
- **User Authentication**
  - Sign up and login
  - Secure account management
  - Profile editing

- **Property Browsing**
  - Browse available houses and rooms
  - Filter by price, bedrooms, location
  - View detailed property information

- **User Dashboard**
  - View saved listings
  - Track inquiries
  - Manage profile information

- **Inquiry System**
  - Make property inquiries
  - Track inquiry status
  - Save favorite listings

### 💼 Admin Dashboard
- **Payroll Management**
  - Add and manage staff members
  - Track salaries
  - Generate payroll reports
  - Edit/delete staff records

- **Room Advertisements**
  - Post new room/apartment ads
  - Track ad performance (views, inquiries)
  - Manage advertisement status
  - Download ads list as CSV

- **Vacancy Management**
  - Post job vacancies
  - Track applicants
  - View vacancy statistics
  - Manage positions (open, filled, closed)

- **Settings**
  - Company information management
  - Account settings and password change
  - System settings (notifications, backup, dark mode)
  - Data backup and reset functionality

- **Dashboard Analytics**
  - Real-time statistics
  - Occupancy overview
  - Recent activities
  - Performance metrics

---

## 🚀 Getting Started

### Opening the Website

1. **Home Page (Landing/Login)**
   ```
   Open: home.html
   ```
   - View platform features
   - Choose between Tenant or Admin login
   - Create new tenant account

2. **Tenant Portal**
   ```
   Open: index.html
   ```
   - Available after tenant login
   - Browse properties
   - Access user dashboard

3. **Admin Dashboard**
   ```
   Open: admin.html
   ```
   - Available after admin login
   - Manage all business operations
   - View analytics and reports

---

## 📁 File Structure

```
IVORY APARTMENT/
├── home.html                 # Landing/Login page
├── home-styles.css          # Landing page styles
├── home-script.js           # Landing page logic
│
├── index.html               # Tenant portal main page
├── styles.css               # Tenant portal styles
├── script.js                # Tenant portal logic
│
├── admin.html               # Admin dashboard main page
├── admin-styles.css         # Admin dashboard styles
├── admin-script.js          # Admin dashboard logic
├── admin-login.html         # Admin login page (alternative)
│
└── README.md                # This file
```

---

## 👥 User Roles

### Tenant/User Role
- **Access**: `home.html` → Login → `index.html`
- **Permissions**:
  - Browse listings
  - Create account
  - View profile
  - Save listings
  - Make inquiries
  - Track saved properties

### Admin Role
- **Access**: `home.html` → Admin Login → `admin.html`
- **Permissions**:
  - Manage staff payroll
  - Post room advertisements
  - Create job vacancies
  - View analytics
  - Manage company settings
  - Backup/restore data

---

## 📖 Usage Guide

### For Tenants

#### Signing Up
1. Open `home.html`
2. Click "🏠 Tenant Login"
3. Click "Sign up here"
4. Fill in your details:
   - Full Name
   - Email
   - Phone Number
   - Password (min 6 characters)
5. Click "Create Account"
6. You'll be automatically logged in and redirected to the portal

#### Logging In
1. Open `home.html`
2. Click "🏠 Tenant Login"
3. Enter your email and password
4. Click "Login"

#### Browsing Properties
1. After login, you'll see all available houses and rooms
2. Use filters to narrow down:
   - **Houses**: Filter by price range and bedrooms
   - **Rooms**: Filter by room type and price
3. Click "Inquire Now" to make an inquiry
4. Click "❤️ Save" to save a listing to your favorites

#### Managing Your Account
1. Click your name in the navbar
2. Click "Dashboard"
3. **Profile Tab**: View and edit your information
4. **Saved Listings Tab**: View all saved properties
5. **My Inquiries Tab**: Track all inquiries you've made

---

### For Administrators

#### Admin Login
1. Open `home.html`
2. Click "💼 Admin Login"
3. Enter credentials:
   - **Email**: admin@ivoryapartment.com
   - **Password**: admin123
4. Click "Login to Admin"

#### Payroll Management
1. From sidebar, click "💰 Payroll Management"
2. **Add Staff**:
   - Fill staff details (name, position, salary, status)
   - Click "Add Staff Member"
3. **View Staff**: All staff members displayed in a list
4. **Edit Staff**: Click "Edit" button on any staff member
5. **Delete Staff**: Click "Delete" button (requires confirmation)
6. **Generate Report**: Click "Generate Report" button

#### Room Advertisements
1. From sidebar, click "🛏️ Room Advertisements"
2. **Post New Ad**:
   - Enter room title, location, price
   - Select room type
   - Add description
   - Choose status (active/inactive/sold)
   - Click "Post Advertisement"
3. **Manage Ads**: View performance metrics (views, inquiries)
4. **Download List**: Export all ads as CSV file

#### Vacancy Management
1. From sidebar, click "🏠 Vacancy Management"
2. **Create Vacancy**:
   - Enter job title, department
   - Set salary range
   - Add requirements
   - Choose status (open/filled/closed)
   - Click "Post Vacancy"
3. **View Statistics**: See open positions, filled positions, total applicants

#### Settings
1. From sidebar, click "⚙️ Settings"
2. **Company Settings**: Update company info (name, address, phone, email)
3. **Account Settings**: Change admin password
4. **System Settings**:
   - Enable/Disable notifications
   - Toggle auto-backup
   - Enable dark mode
5. **Data Management**:
   - Click "Backup Data Now" to download backup
   - Click "Reset Dashboard" to clear all data (⚠️ careful!)

#### Dashboard Overview
1. Main dashboard shows:
   - Active staff count
   - Total monthly payroll
   - Active room ads
   - Vacancy rate
   - Recent activities
   - Occupancy overview

---

## 🔑 Demo Credentials

### Tenant Account
- **Sign Up**: Create your own account on home.html
- **Or Test Account**: 
  - Email: test@example.com
  - Password: test123
  - (Create this account first)

### Admin Account
- **Email**: admin@ivoryapartment.com
- **Password**: admin123
- **Note**: This is a demo account. Change password in settings after first login.

---

## 💾 Data Storage

- **Tenant Data**: Stored in browser's Local Storage
  - User accounts
  - Saved listings
  - Inquiries
  
- **Admin Data**: Stored in browser's Local Storage
  - Staff information
  - Room advertisements
  - Job vacancies
  - Company settings

**Note**: Data persists even after closing the browser. To backup data, use the "Backup Data Now" button in admin settings.

---

## 🔐 Security Notes

- Passwords are stored locally (for demo purposes only)
- In production, implement:
  - Backend authentication
  - Password hashing
  - Secure session management
  - HTTPS encryption
  - Database storage

---

## 🎯 Sample Data

The system comes pre-loaded with:
- **12 Available Houses** (₦8.5M - ₦60M)
- **16 Available Rooms** (₦500K - ₦4M)

Sample property data is automatically loaded and searchable.

---

## 📱 Responsive Design

All pages are fully responsive:
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (Below 768px)

---

## 🛠️ Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Storage**: Browser Local Storage
- **Compatibility**: All modern browsers
- **No External Dependencies**: Pure vanilla JavaScript

---

## 🚦 Navigation Flow

```
home.html (Landing)
├── Tenant Login/Signup → index.html (Tenant Portal)
├── Admin Login → admin.html (Admin Dashboard)
└── Admin Login (Alt) → admin-login.html
```

---

## ⚡ Quick Links

| Page | URL | Purpose |
|------|-----|---------|
| Home/Landing | `home.html` | Login & signup entry point |
| Tenant Portal | `index.html` | Browse properties, manage account |
| Admin Dashboard | `admin.html` | Manage operations |
| Admin Login (Alt) | `admin-login.html` | Alternative admin entry |

---

## 📞 Support Features

- In-app alerts for user feedback
- Form validation
- Error messages
- Success notifications
- Help sections in settings

---

## ✅ Checklist for First Time Use

- [ ] Open `home.html`
- [ ] Create tenant account
- [ ] Explore property listings
- [ ] Save a property
- [ ] Make an inquiry
- [ ] View user dashboard
- [ ] Login as admin (use demo credentials)
- [ ] Explore admin dashboard
- [ ] Add a staff member
- [ ] Post a room advertisement
- [ ] Create a job vacancy
- [ ] Check company settings

---

## 🎓 Learning Resources

This platform demonstrates:
- Form handling and validation
- Local Storage API usage
- DOM manipulation
- Event listeners
- Responsive CSS Grid/Flexbox
- Modal dialogs
- Data filtering and search
- State management

---

## 📝 License

This is a demo project for property management. Use freely for learning and development purposes.

---

## 🔄 Future Enhancements

- Backend integration with Node.js/Python
- Real database (MongoDB/PostgreSQL)
- Payment processing integration
- Email notifications
- Image uploads
- Advanced analytics
- Mobile app version
- Real estate API integration

---

**Created**: 2026
**Version**: 1.0.0
**Status**: Fully Functional Demo

---

Happy Property Managing! 🏠🏢
