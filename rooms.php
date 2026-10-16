<?php
/**
 * Rooms Page - Browse rental rooms
 */
session_start();
require_once 'config.php';
$page_title = 'Browse Rooms - Ivory Apartment';
$page_description = 'Find affordable rooms for rent. Browse our collection of single rooms, self-contained studios, and shared apartments.';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="<?php echo htmlspecialchars($page_description); ?>">
    <title><?php echo htmlspecialchars($page_title); ?></title>
    <link rel="stylesheet" href="styles.css">
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
                <li><a href="rooms.php" onclick="closeMenu()" class="active">🛏️ Rooms</a></li>
                <li><a href="index.php#vacancies" onclick="closeMenu()">💼 Vacancies</a></li>
                <li class="nav-separator"></li>
                <li id="userMenuNav">
                    <span id="userDisplay" style="color: white; cursor: pointer;">
                        <a href="javascript:showLoginModal()" id="loginLink">🔐 Login</a>
                    </span>
                </li>
                <li class="nav-separator"></li>
                <li><a href="index.php" class="nav-home-btn">← Home</a></li>
            </ul>
        </div>
    </nav>

    <!-- Search & Filter Section -->
    <section class="search-section">
        <div class="container">
            <h2>🛏️ Find Your Ideal Room</h2>
            <div class="search-filters">
                <div class="filter-group">
                    <input type="text" id="searchInput" placeholder="Search by location, title..." onkeyup="filterRooms()">
                </div>
                <div class="filter-group">
                    <label>Room Type</label>
                    <select id="roomTypeFilter" onchange="filterRooms()">
                        <option value="">All Types</option>
                        <option value="single">Single Room</option>
                        <option value="self-contained">Self-Contained</option>
                        <option value="shared">Shared Apartment</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label>Price Range</label>
                    <select id="roomPriceFilter" onchange="filterRooms()">
                        <option value="">All Prices</option>
                        <option value="budget">Budget (Under ₦1M)</option>
                        <option value="mid">Mid-Range (₦1M - ₦2.5M)</option>
                        <option value="premium">Premium (Above ₦2.5M)</option>
                    </select>
                </div>
            </div>
        </div>
    </section>

    <!-- Rooms Listings -->
    <section class="listings-section">
        <div class="container">
            <div class="section-header">
                <h2>🛏️ Available Rooms</h2>
                <p id="roomCount">0</p>
            </div>
            <div id="roomsList" class="listings-grid"></div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 Ivory Apartment. All rights reserved. | <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>
