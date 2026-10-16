<?php
/**
 * Admin Login Page
 */
session_start();
require_once 'config.php';
$page_title = 'Admin Login - Ivory Apartment';
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
            <ul class="nav-links">
                <li><a href="index.php">← Back to Home</a></li>
            </ul>
        </div>
    </nav>

    <!-- Admin Login Container -->
    <div class="auth-container">
        <div class="auth-card admin-auth">
            <h1>🔐 Admin Login</h1>
            <p>Access administrative panel</p>

            <form id="adminLoginForm" onsubmit="handleAdminLogin(event)">
                <div class="form-group">
                    <label for="adminEmail">Admin Email</label>
                    <input type="email" id="adminEmail" placeholder="admin@ivory.com" required>
                </div>
                <div class="form-group">
                    <label for="adminPassword">Password</label>
                    <input type="password" id="adminPassword" placeholder="Enter admin password" required>
                </div>
                <div class="form-group checkbox">
                    <input type="checkbox" id="adminRemember">
                    <label for="adminRemember">Remember me</label>
                </div>
                <button type="submit" class="btn-primary btn-block">Login to Admin Panel</button>
            </form>

            <p class="auth-link">
                <a href="javascript:showForgotPasswordForm()">Forgot password?</a>
            </p>

            <hr style="margin: 2rem 0; border: none; border-top: 1px solid #ecf0f1;">

            <p class="auth-link">
                <a href="tenant-login.php" class="btn-secondary btn-block">← Tenant Login</a>
            </p>
        </div>
    </div>

    <!-- Forgot Password Modal -->
    <div id="forgotModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeForgotPasswordForm()">&times;</span>
            <h2>Reset Password</h2>
            <p>Enter your email to receive password reset instructions</p>
            <form id="forgotForm" onsubmit="handleForgotPassword(event)">
                <div class="form-group">
                    <label for="forgotEmail">Email Address</label>
                    <input type="email" id="forgotEmail" placeholder="your@email.com" required>
                </div>
                <button type="submit" class="btn-primary">Send Reset Link</button>
            </form>
        </div>
    </div>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 Ivory Apartment - Admin Portal</p>
        </div>
    </footer>

    <script src="script.js"></script>
    <script src="admin-script.js"></script>
</body>
</html>
