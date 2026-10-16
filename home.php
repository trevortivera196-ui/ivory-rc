<?php
/**
 * Tenant Home Dashboard
 * User dashboard for logged-in tenants
 */
session_start();
require_once 'config.php';
$page_title = 'My Dashboard - Ivory Apartment';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($page_title); ?></title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="home-styles.css">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="container nav-container">
            <div class="logo" onclick="window.location.href='index.php'" style="cursor: pointer;">🏢 Ivory Apartment</div>
            
            <button class="hamburger" onclick="toggleMobileMenu()">
                <span></span>
                <span></span>
                <span></span>
            </button>
            
            <ul class="nav-links" id="navMenu">
                <li><a href="index.php" onclick="closeMenu()">🏠 Home</a></li>
                <li class="nav-separator"></li>
                <li><a href="index.php#houses" onclick="closeMenu()">🏠 Houses</a></li>
                <li><a href="rooms.php" onclick="closeMenu()">🛏️ Rooms</a></li>
                <li class="nav-separator"></li>
                <li id="userMenuNav">
                    <span id="userDisplay" style="color: white; cursor: pointer;">
                        <a href="javascript:logout()" id="logoutLink">🚪 Logout</a>
                    </span>
                </li>
                <li class="nav-separator"></li>
                <li><a href="index.php" class="nav-home-btn">← Home</a></li>
            </ul>
        </div>
    </nav>

    <!-- User Dashboard -->
    <div class="container user-dashboard">
        <div class="dashboard-header">
            <h1>Welcome, <span id="userName">User</span>!</h1>
            <p id="userEmail"></p>
        </div>

        <div class="dashboard-tabs">
            <button class="tab-btn active" onclick="switchDashboardTab('profile')">👤 Profile</button>
            <button class="tab-btn" onclick="switchDashboardTab('saved')">❤️ Saved Listings</button>
            <button class="tab-btn" onclick="switchDashboardTab('payments')">💳 Payments</button>
            <button class="tab-btn" onclick="switchDashboardTab('inquiries')">📧 Inquiries</button>
        </div>

        <!-- Profile Tab -->
        <div id="profileTab" class="dashboard-tab active">
            <h2>Your Profile</h2>
            <div class="profile-info">
                <div class="info-item">
                    <label>Name:</label>
                    <p id="profileName"></p>
                </div>
                <div class="info-item">
                    <label>Email:</label>
                    <p id="profileEmail"></p>
                </div>
                <div class="info-item">
                    <label>Phone:</label>
                    <p id="profilePhone"></p>
                </div>
            </div>
            <button class="btn-primary" onclick="editProfile()">Edit Profile</button>
        </div>

        <!-- Saved Listings Tab -->
        <div id="savedTab" class="dashboard-tab">
            <h2>Saved Listings</h2>
            <div id="savedListingsList" class="listings-grid"></div>
        </div>

        <!-- Payments Tab -->
        <div id="paymentsTab" class="dashboard-tab">
            <h2>Payment History</h2>
            <a href="payment.php" class="btn-primary">💳 Make New Payment</a>
            <div id="paymentHistoryList" class="payment-list"></div>
        </div>

        <!-- Inquiries Tab -->
        <div id="inquiriesTab" class="dashboard-tab">
            <h2>My Inquiries</h2>
            <div id="inquiriesList" class="inquiries-list"></div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 Ivory Apartment. All rights reserved.</p>
        </div>
    </footer>

    <script src="script.js"></script>
    <script src="home-script.js"></script>
</body>
</html>
