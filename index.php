<?php
/**
 * Ivory Apartment - Main Entry Point
 * This is the primary landing page for the application
 */

// Start session for managing user data
session_start();

// Include configuration
require_once 'config.php';

// Set page metadata
$page_title = 'Ivory Apartment - Find Your Perfect Home';
$page_description = 'Browse beautiful apartments, houses, and rooms. Find your perfect home with Ivory Apartment.';
$page_keywords = 'apartments, houses, rooms, rental, properties';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="<?php echo htmlspecialchars($page_description); ?>">
    <meta name="keywords" content="<?php echo htmlspecialchars($page_keywords); ?>">
    <title><?php echo htmlspecialchars($page_title); ?></title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Navigation Bar -->
    <nav class="navbar">
        <div class="container nav-container">
            <div class="logo" onclick="goHome()" style="cursor: pointer;">🏢 Ivory Apartment</div>
            
            <!-- Hamburger Menu for Mobile -->
            <button class="hamburger" onclick="toggleMobileMenu()">
                <span></span>
                <span></span>
                <span></span>
            </button>
            
            <!-- Navigation Menu -->
            <ul class="nav-links" id="navMenu">
                <li><a href="#home" onclick="closeMenu()">🏠 Home</a></li>
                <li class="nav-separator"></li>
                <li><a href="#houses" onclick="closeMenu()">🏠 Houses</a></li>
                <li><a href="rooms.php" onclick="closeMenu()">🛏️ Rooms</a></li>
                <li><a href="#vacancies" onclick="closeMenu()">💼 Vacancies</a></li>
                <li class="nav-separator"></li>
                <li><a href="#contact" onclick="closeMenu()">📞 Contact</a></li>
                <li class="nav-separator"></li>
                <li id="userMenuNav">
                    <span id="userDisplay" style="color: white; cursor: pointer;">
                        <a href="javascript:showLoginModal()" id="loginLink">🔐 Login</a>
                    </span>
                </li>
                <li class="nav-separator"></li>
                <li><a href="tenant-login.php" class="nav-tenant-btn">👤 Tenant Login</a></li>
                <li><a href="admin.php" class="nav-admin-btn">💼 Admin</a></li>
                <li><a href="home.php" class="nav-home-btn">← Back</a></li>
            </ul>
        </div>
    </nav>

    <!-- Login Modal -->
    <div id="loginModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeLoginModal()">&times;</span>
            <div class="modal-header">
                <h2>Welcome to Ivory Apartment</h2>
                <p>Login to view your saved listings and inquiries</p>
            </div>
            
            <div class="tab-buttons">
                <button class="tab-btn active" onclick="switchTab('login')">Login</button>
                <button class="tab-btn" onclick="switchTab('signup')">Sign Up</button>
            </div>

            <!-- Login Form -->
            <form id="loginForm" class="tab-content active">
                <div class="form-group">
                    <label for="loginEmail">Email Address</label>
                    <input type="email" id="loginEmail" placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                    <label for="loginPassword">Password</label>
                    <input type="password" id="loginPassword" placeholder="Enter your password" required>
                </div>
                <div class="form-group checkbox">
                    <input type="checkbox" id="rememberMe">
                    <label for="rememberMe">Remember me</label>
                </div>
                <button type="submit" class="btn-primary">Login</button>
                <p class="form-link">Don't have an account? <a href="javascript:switchTab('signup')">Sign up here</a></p>
            </form>

            <!-- Signup Form -->
            <form id="signupForm" class="tab-content">
                <div class="form-group">
                    <label for="signupName">Full Name</label>
                    <input type="text" id="signupName" placeholder="Enter your full name" required>
                </div>
                <div class="form-group">
                    <label for="signupEmail">Email Address</label>
                    <input type="email" id="signupEmail" placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                    <label for="signupPhone">Phone Number</label>
                    <input type="tel" id="signupPhone" placeholder="Enter your phone number" required>
                </div>
                <div class="form-group">
                    <label for="signupPassword">Password</label>
                    <input type="password" id="signupPassword" placeholder="Create a password" required>
                </div>
                <div class="form-group">
                    <label for="signupConfirmPassword">Confirm Password</label>
                    <input type="password" id="signupConfirmPassword" placeholder="Confirm your password" required>
                </div>
                <button type="submit" class="btn-primary">Create Account</button>
                <p class="form-link">Already have an account? <a href="javascript:switchTab('login')">Login here</a></p>
            </form>
        </div>
    </div>

    <!-- User Dashboard Modal -->
    <div id="userDashboardModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeUserDashboard()">&times;</span>
            <div class="dashboard-header">
                <h2>Welcome, <span id="dashboardUserName"></span>!</h2>
                <button class="btn-logout" onclick="logout()">Logout</button>
            </div>
            
            <div class="dashboard-tabs">
                <button class="dashboard-tab-btn active" onclick="switchDashboardTab('profile')">Profile</button>
                <button class="dashboard-tab-btn" onclick="switchDashboardTab('saved')">Saved Listings</button>
                <button class="dashboard-tab-btn" onclick="switchDashboardTab('inquiries')">My Inquiries</button>
            </div>

            <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                <button class="btn-primary" onclick="window.location.href='payment.php'">💳 Make Payment</button>
                <button class="btn-secondary" onclick="viewPaymentHistory()">📊 Payment History</button>
            </div>

            <!-- Profile Tab -->
            <div id="profileTab" class="dashboard-tab-content active">
                <div class="profile-info">
                    <h3>User Information</h3>
                    <div class="info-group">
                        <label>Name:</label>
                        <p id="profileName"></p>
                    </div>
                    <div class="info-group">
                        <label>Email:</label>
                        <p id="profileEmail"></p>
                    </div>
                    <div class="info-group">
                        <label>Phone:</label>
                        <p id="profilePhone"></p>
                    </div>
                    <button class="btn-primary" onclick="editProfile()">Edit Profile</button>
                </div>
            </div>

            <!-- Saved Listings Tab -->
            <div id="savedTab" class="dashboard-tab-content">
                <h3>Your Saved Listings</h3>
                <div id="savedListings" class="saved-listings">
                    <p>No saved listings yet. Start saving your favorite properties!</p>
                </div>
            </div>

            <!-- Inquiries Tab -->
            <div id="inquiriesTab" class="dashboard-tab-content">
                <h3>Your Inquiries</h3>
                <div id="inquiriesList" class="inquiries-list">
                    <p>No inquiries yet.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Hero Section -->
    <section id="home" class="hero">
        <div class="container">
            <h1>Find Your Perfect Home</h1>
            <p>Discover beautiful apartments, houses, and rooms tailored to your lifestyle</p>
            <div class="hero-buttons">
                <button class="btn-primary" onclick="document.getElementById('houses').scrollIntoView({ behavior: 'smooth' })">
                    🏠 Browse Houses
                </button>
                <button class="btn-secondary" onclick="document.getElementById('roomsBtn').click()">
                    🛏️ Browse Rooms
                </button>
            </div>
        </div>
    </section>

    <!-- Search & Filter Section -->
    <section class="search-section">
        <div class="container">
            <h2>Search & Filter Properties</h2>
            <div class="search-filters">
                <div class="filter-group">
                    <input type="text" id="searchInput" placeholder="Search by location, title..." onkeyup="filterListings()">
                </div>
                <div class="filter-group">
                    <label>Price Range</label>
                    <select id="priceFilter" onchange="filterListings()">
                        <option value="">All Prices</option>
                        <option value="budget">Budget (Under ₦15M)</option>
                        <option value="mid">Mid-Range (₦15M - ₦35M)</option>
                        <option value="premium">Premium (Above ₦35M)</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label>Bedrooms</label>
                    <select id="bedroomFilter" onchange="filterListings()">
                        <option value="">All Bedrooms</option>
                        <option value="1">1 Bedroom</option>
                        <option value="2">2 Bedrooms</option>
                        <option value="3">3 Bedrooms</option>
                        <option value="4">4+ Bedrooms</option>
                    </select>
                </div>
            </div>
        </div>
    </section>

    <!-- Houses Section -->
    <section id="houses" class="listings-section">
        <div class="container">
            <div class="section-header">
                <h2>🏠 Featured Houses</h2>
                <p id="houseCount">0</p>
            </div>
            <div id="housesList" class="listings-grid"></div>
        </div>
    </section>

    <!-- Vacancies Section -->
    <section id="vacancies" class="listings-section">
        <div class="container">
            <div class="section-header">
                <h2>💼 Job Vacancies</h2>
                <p id="vacancyCount">0</p>
            </div>
            <div id="vacanciesList" class="listings-grid"></div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact-section">
        <div class="container">
            <h2>📞 Get in Touch</h2>
            <div class="contact-content">
                <div class="contact-info">
                    <h3>Contact Information</h3>
                    <div class="contact-item">
                        <strong>📍 Address:</strong>
                        <p>123 Nairobi Street, Nairobi CBD, Kenya</p>
                    </div>
                    <div class="contact-item">
                        <strong>📞 Phone:</strong>
                        <p>+254-20-XXXX-XXXX</p>
                    </div>
                    <div class="contact-item">
                        <strong>📧 Email:</strong>
                        <p>info@ivoryapartment.com</p>
                    </div>
                    <div class="contact-item">
                        <strong>⏰ Hours:</strong>
                        <p>Monday - Friday: 9:00 AM - 5:00 PM<br>Saturday: 10:00 AM - 3:00 PM<br>Sunday: Closed</p>
                    </div>
                </div>
                <form class="contact-form" onsubmit="handleContactForm(event)">
                    <div class="form-group">
                        <input type="text" placeholder="Your Name" required>
                    </div>
                    <div class="form-group">
                        <input type="email" placeholder="Your Email" required>
                    </div>
                    <div class="form-group">
                        <textarea placeholder="Your Message" rows="5" required></textarea>
                    </div>
                    <button type="submit" class="btn-primary">Send Message</button>
                </form>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 Ivory Apartment. All rights reserved. | <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="script.js"></script>
    <script>
        // Initialize on page load
        document.addEventListener('DOMContentLoaded', () => {
            checkAuthStatus();
            renderHouses(houses);
            renderRooms(rooms);
            renderVacancies();
            updateVacancyCounts();
            setupFormListeners();
        });
    </script>
</body>
</html>
