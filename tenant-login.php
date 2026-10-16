<?php
/**
 * Tenant Login Page
 */
session_start();
require_once 'config.php';
$page_title = 'Tenant Login - Ivory Apartment';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($page_title); ?></title>
    <link rel="stylesheet" href="styles.css">
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

    <!-- Login Container -->
    <div class="auth-container">
        <div class="auth-card">
            <h1>👤 Tenant Login</h1>
            <p>Access your dashboard</p>

            <form id="tenantLoginForm" onsubmit="handleTenantLogin(event)">
                <div class="form-group">
                    <label for="tenantEmail">Email Address</label>
                    <input type="email" id="tenantEmail" placeholder="your@email.com" required>
                </div>
                <div class="form-group">
                    <label for="tenantPassword">Password</label>
                    <input type="password" id="tenantPassword" placeholder="Enter your password" required>
                </div>
                <div class="form-group checkbox">
                    <input type="checkbox" id="rememberMe">
                    <label for="rememberMe">Remember me</label>
                </div>
                <button type="submit" class="btn-primary btn-block">Login</button>
            </form>

            <p class="auth-link">
                Don't have an account? <a href="javascript:showSignupForm()">Sign up here</a>
            </p>
            <p class="auth-link">
                <a href="javascript:showForgotPasswordForm()">Forgot your password?</a>
            </p>

            <hr style="margin: 2rem 0; border: none; border-top: 1px solid #ecf0f1;">

            <p class="auth-link">
                <a href="admin.php" class="btn-secondary btn-block">Admin Login →</a>
            </p>
        </div>
    </div>

    <!-- Signup Form Modal -->
    <div id="signupModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeSignupForm()">&times;</span>
            <h2>Create Tenant Account</h2>
            <form id="tenantSignupForm" onsubmit="handleTenantSignup(event)">
                <div class="form-group">
                    <label for="signupName">Full Name</label>
                    <input type="text" id="signupName" placeholder="Your name" required>
                </div>
                <div class="form-group">
                    <label for="signupEmail">Email</label>
                    <input type="email" id="signupEmail" placeholder="your@email.com" required>
                </div>
                <div class="form-group">
                    <label for="signupPhone">Phone</label>
                    <input type="tel" id="signupPhone" placeholder="+254712345678" required>
                </div>
                <div class="form-group">
                    <label for="signupPassword">Password</label>
                    <input type="password" id="signupPassword" placeholder="Min 8 characters" required>
                </div>
                <div class="form-group">
                    <label for="confirmPassword">Confirm Password</label>
                    <input type="password" id="confirmPassword" placeholder="Re-enter password" required>
                </div>
                <button type="submit" class="btn-primary">Create Account</button>
            </form>
        </div>
    </div>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 Ivory Apartment</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>
