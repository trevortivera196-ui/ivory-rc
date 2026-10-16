// ============================================
// HOME PAGE LOGIN AND ROUTING
// ============================================

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    checkExistingLogin();
});

// Check existing login
function checkExistingLogin() {
    const currentUser = localStorage.getItem('currentUser');
    const adminLoggedIn = sessionStorage.getItem('adminLoggedIn');

    if (currentUser) {
        const user = JSON.parse(currentUser);
        console.log('Tenant found:', user.name);
        // User is logged in, they can still view home or go to index.html
    }

    if (adminLoggedIn) {
        console.log('Admin already logged in');
    }
}

// Show login modal
function showLoginModal(type) {
    document.getElementById('loginModal').classList.add('active');
    
    // Hide all forms
    document.getElementById('tenantLoginForm').style.display = 'none';
    document.getElementById('tenantSignupForm').style.display = 'none';
    document.getElementById('adminLoginForm').style.display = 'none';

    // Show selected form
    if (type === 'tenant') {
        document.getElementById('tenantLoginForm').style.display = 'block';
    } else if (type === 'admin') {
        document.getElementById('adminLoginForm').style.display = 'block';
    }
}

// Close login modal
function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
}

// Switch between login forms
function switchLoginForm(form) {
    document.getElementById('tenantLoginForm').style.display = 'none';
    document.getElementById('tenantSignupForm').style.display = 'none';
    document.getElementById('adminLoginForm').style.display = 'none';

    if (form === 'login') {
        document.getElementById('tenantLoginForm').style.display = 'block';
    } else if (form === 'signup') {
        document.getElementById('tenantSignupForm').style.display = 'block';
    }
}

// ============================================
// TENANT LOGIN
// ============================================

function handleTenantLogin(event) {
    event.preventDefault();

    const email = document.getElementById('tenantEmail').value.trim();
    const password = document.getElementById('tenantPassword').value;

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('ivoryUsers')) || [];

    // Find user
    const user = users.find(u => u.email === email);

    if (!user) {
        alert('Email not found. Please sign up first.');
        return;
    }

    if (user.password !== password) {
        alert('Incorrect password. Please try again.');
        return;
    }

    // Login successful
    const currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
    };

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    closeLoginModal();
    alert('Welcome back, ' + currentUser.name.split(' ')[0] + '!');
    
    // Redirect to tenant portal
    window.location.href = 'index.html';
}

// ============================================
// TENANT SIGNUP
// ============================================

function handleTenantSignup(event) {
    event.preventDefault();

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const password = document.getElementById('signupPassword').value;

    // Get existing users
    let users = JSON.parse(localStorage.getItem('ivoryUsers')) || [];

    // Validate inputs
    if (!name || !email || !phone || !password) {
        alert('Please fill in all fields');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }

    // Check if email already exists
    if (users.some(u => u.email === email)) {
        alert('Email already registered. Please login or use a different email.');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        password: password
    };

    users.push(newUser);
    localStorage.setItem('ivoryUsers', JSON.stringify(users));

    // Auto login
    const currentUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone
    };

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    closeLoginModal();
    alert('Welcome, ' + currentUser.name.split(' ')[0] + '! Your account has been created.');
    
    // Redirect to tenant portal
    window.location.href = 'index.html';
}

// ============================================
// ADMIN LOGIN
// ============================================

function handleAdminLogin(event) {
    event.preventDefault();

    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;

    // Demo credentials
    const validEmail = 'admin@ivoryapartment.com';
    const validPassword = 'admin123';

    if (email === validEmail && password === validPassword) {
        // Set session
        sessionStorage.setItem('adminLoggedIn', 'true');
        
        closeLoginModal();
        alert('Admin login successful!');
        
        // Redirect to admin dashboard
        window.location.href = 'admin.html';
    } else {
        alert('Invalid email or password. Please try again.');
        document.getElementById('adminPassword').value = '';
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
        closeLoginModal();
    }
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
