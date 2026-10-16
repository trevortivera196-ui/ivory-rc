<?php
/**
 * Admin Dashboard
 * Administrative panel for property and user management
 */
session_start();
require_once 'config.php';
$page_title = 'Admin Dashboard - Ivory Apartment';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($page_title); ?></title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="admin-styles.css">
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
                <li id="userMenuNav">
                    <span id="userDisplay" style="color: white; cursor: pointer;">
                        <a href="javascript:showLoginModal()" id="loginLink">🔐 Admin Login</a>
                    </span>
                </li>
                <li class="nav-separator"></li>
                <li><a href="index.php" class="nav-home-btn">← Home</a></li>
            </ul>
        </div>
    </nav>

    <!-- Admin Dashboard Container -->
    <div id="adminContainer" class="admin-container" style="display: none;">
        <div class="admin-sidebar">
            <div class="sidebar-header">
                <h3>Admin Menu</h3>
            </div>
            <nav class="sidebar-nav">
                <a href="#dashboard" class="sidebar-link active" onclick="showAdminSection('dashboard')">📊 Dashboard</a>
                <a href="#properties" class="sidebar-link" onclick="showAdminSection('properties')">🏠 Properties</a>
                <a href="#users" class="sidebar-link" onclick="showAdminSection('users')">👥 Users</a>
                <a href="#payments" class="sidebar-link" onclick="showAdminSection('payments')">💳 Payments</a>
                <a href="#staff" class="sidebar-link" onclick="showAdminSection('staff')">💼 Staff</a>
                <a href="#payroll" class="sidebar-link" onclick="showAdminSection('payroll')">💰 Payroll</a>
                <a href="#admins" class="sidebar-link" onclick="showAdminSection('admins')">🔑 Admins</a>
                <a href="javascript:logout()" class="sidebar-link danger">🚪 Logout</a>
            </nav>
        </div>

        <div class="admin-content">
            <!-- Dashboard Section -->
            <section id="dashboardSection" class="admin-section active">
                <h1>📊 Admin Dashboard</h1>
                <div class="dashboard-stats">
                    <div class="stat-card">
                        <h3>Total Properties</h3>
                        <p class="stat-number" id="totalProperties">0</p>
                    </div>
                    <div class="stat-card">
                        <h3>Total Users</h3>
                        <p class="stat-number" id="totalUsers">0</p>
                    </div>
                    <div class="stat-card">
                        <h3>Pending Payments</h3>
                        <p class="stat-number" id="pendingPayments">0</p>
                    </div>
                    <div class="stat-card">
                        <h3>Staff Members</h3>
                        <p class="stat-number" id="totalStaff">0</p>
                    </div>
                </div>
            </section>

            <!-- Properties Section -->
            <section id="propertiesSection" class="admin-section">
                <h1>🏠 Properties Management</h1>
                <button class="btn-primary" onclick="showPropertyForm()">+ Add Property</button>
                <div id="propertiesList" class="admin-list"></div>
            </section>

            <!-- Users Section -->
            <section id="usersSection" class="admin-section">
                <h1>👥 Users Management</h1>
                <div id="usersList" class="admin-list"></div>
            </section>

            <!-- Payments Section -->
            <section id="paymentsSection" class="admin-section">
                <h1>💳 Payments Management</h1>
                <div id="paymentsList" class="admin-list"></div>
            </section>

            <!-- Staff Section -->
            <section id="staffSection" class="admin-section">
                <h1>💼 Staff Management</h1>
                <button class="btn-primary" onclick="showStaffForm()">+ Add Staff</button>
                <div id="staffList" class="admin-list"></div>
            </section>

            <!-- Payroll Section -->
            <section id="payrollSection" class="admin-section">
                <h1>💰 Payroll Management</h1>
                <button class="btn-primary" onclick="showPayrollForm()">+ Generate Payroll</button>
                <div id="payrollList" class="admin-list"></div>
            </section>

            <!-- Admins Section -->
            <section id="adminsSection" class="admin-section">
                <h1>🔑 Admin Accounts</h1>
                <button class="btn-primary" onclick="showAdminForm()">+ Add Admin</button>
                <div id="adminsList" class="admin-list"></div>
            </section>
        </div>
    </div>

    <!-- Login Modal -->
    <div id="adminLoginModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeAdminLoginModal()">&times;</span>
            <h2>Admin Login</h2>
            <form id="adminLoginForm" onsubmit="handleAdminLogin(event)">
                <div class="form-group">
                    <label for="adminEmail">Email</label>
                    <input type="email" id="adminEmail" placeholder="admin@ivory.com" required>
                </div>
                <div class="form-group">
                    <label for="adminPassword">Password</label>
                    <input type="password" id="adminPassword" placeholder="Enter password" required>
                </div>
                <button type="submit" class="btn-primary">Login</button>
            </form>
        </div>
    </div>

    <script src="script.js"></script>
    <script src="admin-script.js"></script>
</body>
</html>
