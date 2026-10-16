// ============================================
// USER AUTHENTICATION SYSTEM
// ============================================

// API Base URL
const API_BASE_URL = window.location.origin + '/api';

// User storage (from JWT token in sessionStorage)
let currentUser = null;
let authToken = sessionStorage.getItem('auth_token') || null;

// Helper function to get auth token from sessionStorage
function getAuthToken() {
    return sessionStorage.getItem('auth_token');
}

// Helper function to make authenticated API calls
async function apiCall(endpoint, method = 'GET', body = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const token = getAuthToken();
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(endpoint, options);
        const data = await response.json();

        if (!response.ok) {
            // Handle token expiration
            if (response.status === 401 && data.message.includes('invalid') || data.message.includes('expired')) {
                sessionStorage.removeItem('auth_token');
                currentUser = null;
                checkAuthStatus();
                throw new Error('Your session has expired. Please login again.');
            }
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Navigation function
function goHome() {
    window.location.href = 'home.html';
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    checkAuthStatus();
    renderHouses(houses);
    renderRooms(rooms);
    renderVacancies();
    updateVacancyCounts();
    setupFormListeners();
});

// Check authentication status
function checkAuthStatus() {
    const token = getAuthToken();
    if (token) {
        // Try to verify token
        apiCall(API_BASE_URL + '/auth-api.php?action=verify-token', 'POST')
            .then(response => {
                if (response.success) {
                    currentUser = response.data;
                    showUserMenu();
                    lockNavigation(true);
                } else {
                    sessionStorage.removeItem('auth_token');
                    currentUser = null;
                    showLoginLink();
                    lockNavigation(false);
                }
            })
            .catch(error => {
                sessionStorage.removeItem('auth_token');
                currentUser = null;
                showLoginLink();
                lockNavigation(false);
            });
    } else {
        currentUser = null;
        showLoginLink();
        lockNavigation(false);
    }
}

// Lock/unlock navigation based on auth
function lockNavigation(isLoggedIn) {
    const navLinks = document.querySelectorAll('.nav-link-auth');
    // Remove lock - allow all to access
    navLinks.forEach(link => {
        link.style.pointerEvents = 'auto';
        link.style.opacity = '1';
    });
}

// Show login link
function showLoginLink() {
    const userDisplay = document.getElementById('userDisplay');
    userDisplay.innerHTML = '<a href="javascript:showLoginModal()" id="loginLink">Login</a>';
}

// Show user menu
function showUserMenu() {
    const userDisplay = document.getElementById('userDisplay');
    const userName = currentUser.name.split(' ')[0]; // First name
    userDisplay.innerHTML = `
        <span style="margin-right: 1rem;">👤 ${userName}</span>
        <a href="javascript:openUserDashboard()" style="color: white; text-decoration: none; margin-right: 1rem;">Dashboard</a>
        <a href="javascript:logout()" style="color: white; text-decoration: none;">Logout</a>
    `;
}

// Show login modal
function showLoginModal() {
    if (!currentUser) {
        document.getElementById('loginModal').classList.add('active');
    }
}

// Close login modal
function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
    resetForms();
}

// Close user dashboard
function closeUserDashboard() {
    document.getElementById('userDashboardModal').classList.remove('active');
}

// Switch between login and signup tabs
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName + 'Form').classList.add('active');
    event.target.classList.add('active');
}

// Switch dashboard tabs
function switchDashboardTab(tabName) {
    document.querySelectorAll('.dashboard-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.dashboard-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
}

// Setup form listeners
function setupFormListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Signup form
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Validate inputs
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await apiCall(API_BASE_URL + '/auth-api.php?action=login', 'POST', {
            email: email,
            password: password
        });

        if (response.success) {
            // Store token
            sessionStorage.setItem('auth_token', response.data.token);
            authToken = response.data.token;

            // Store user info (without password)
            currentUser = {
                id: response.data.user_id,
                name: response.data.name,
                email: response.data.email
            };

            closeLoginModal();
            checkAuthStatus();
            alert('Welcome back, ' + currentUser.name.split(' ')[0] + '!');
            
            // Scroll to home
            document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
}

// Handle signup
async function handleSignup(e) {
    e.preventDefault();

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    // Validate inputs
    if (!name || !email || !phone || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    if (password.length < 8) {
        alert('Password must be at least 8 characters long');
        return;
    }

    try {
        const response = await apiCall(API_BASE_URL + '/auth-api.php?action=register', 'POST', {
            name: name,
            email: email,
            phone: phone,
            password: password
        });

        if (response.success) {
            // Store token
            sessionStorage.setItem('auth_token', response.data.token);
            authToken = response.data.token;

            // Store user info
            currentUser = {
                id: response.data.user_id,
                name: name,
                email: email
            };

            closeLoginModal();
            checkAuthStatus();
            alert('Welcome, ' + currentUser.name.split(' ')[0] + '! Your account has been created.');
            
            // Scroll to home
            document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        alert('Registration failed: ' + error.message);
    }
}

// Logout
async function logout() {
    if (confirm('Are you sure you want to logout?')) {
        try {
            // Call logout endpoint
            await apiCall(API_BASE_URL + '/auth-api.php?action=logout', 'POST');
        } catch (error) {
            console.error('Logout API error:', error);
        }

        // Clear local storage
        sessionStorage.removeItem('auth_token');
        currentUser = null;
        authToken = null;
        
        closeUserDashboard();
        checkAuthStatus();
        alert('You have been logged out.');
        document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
    }
}

// Open user dashboard
function openUserDashboard() {
    if (!currentUser) {
        alert('Please login first');
        return;
    }

    // Populate dashboard
    document.getElementById('dashboardUserName').textContent = currentUser.name.split(' ')[0];
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profilePhone').textContent = currentUser.phone;

    // Populate saved listings
    populateSavedListings();

    // Populate inquiries
    populateInquiries();

    document.getElementById('userDashboardModal').classList.add('active');
}

// Populate saved listings
async function populateSavedListings() {
    const savedListingsDiv = document.getElementById('savedListings');
    
    if (!currentUser) {
        savedListingsDiv.innerHTML = '<p>Please login to view saved listings.</p>';
        return;
    }

    try {
        const response = await apiCall(API_BASE_URL + '/properties-api.php?action=saved&limit=100', 'GET');

        if (response.success && response.data.properties.length > 0) {
            let html = '';
            response.data.properties.forEach(property => {
                html += `
                    <div class="listing-item">
                        <h4>${property.title}</h4>
                        <p><strong>Price:</strong> ${property.price}</p>
                        <p><strong>Location:</strong> ${property.location}</p>
                        <p><strong>Bedrooms:</strong> ${property.bedrooms}</p>
                        <button onclick="removeSavedListing(${property.id})" style="background: #e74c3c; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Remove</button>
                    </div>
                `;
            });
            savedListingsDiv.innerHTML = html;
        } else {
            savedListingsDiv.innerHTML = '<p>No saved listings yet. Start saving your favorite properties!</p>';
        }
    } catch (error) {
        savedListingsDiv.innerHTML = '<p>Error loading saved listings: ' + error.message + '</p>';
    }
}

// Populate inquiries
function populateInquiries() {
    const inquiriesDiv = document.getElementById('inquiriesList');
    const userId = currentUser.id;
    const userInquiriesList = userInquiries[userId] || [];

    if (userInquiriesList.length === 0) {
        inquiriesDiv.innerHTML = '<p>No inquiries yet.</p>';
        return;
    }

    let html = '';
    userInquiriesList.forEach((inquiry, index) => {
        html += `
            <div class="inquiry-item">
                <h4>${inquiry.title}</h4>
                <p><strong>Date:</strong> ${new Date(inquiry.date).toLocaleDateString()}</p>
                <p><strong>Status:</strong> <span style="color: #f39c12; font-weight: bold;">Pending</span></p>
                <p><strong>Message:</strong> ${inquiry.message}</p>
            </div>
        `;
    });

    inquiriesDiv.innerHTML = html;
}

// Add listing to saved
async function saveListing(listingId) {
    if (!currentUser) {
        showLoginModal();
        return;
    }

    try {
        const response = await apiCall(API_BASE_URL + '/properties-api.php?action=save', 'POST', {
            property_id: listingId
        });

        if (response.success) {
            alert('Listing saved!');
        }
    } catch (error) {
        alert('Error saving listing: ' + error.message);
    }
}

// Remove saved listing
async function removeSavedListing(listingId) {
    try {
        const response = await apiCall(API_BASE_URL + '/properties-api.php?action=unsave', 'POST', {
            property_id: listingId
        });

        if (response.success) {
            populateSavedListings();
            alert('Listing removed from saved.');
        }
    } catch (error) {
        alert('Error removing listing: ' + error.message);
    }
}

// Edit profile
function editProfile() {
    const newName = prompt('Enter your full name:', currentUser.name);
    if (newName && newName.trim()) {
        currentUser.name = newName;
        
        // Update in users array
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].name = newName;
            localStorage.setItem('ivoryUsers', JSON.stringify(users));
        }
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showUserMenu();
        openUserDashboard();
        alert('Profile updated successfully!');
    }
}

// Reset forms
function resetForms() {
    document.getElementById('loginForm').reset();
    document.getElementById('signupForm').reset();
}

// ============================================
// SAMPLE DATA
// ============================================

// Sample data for houses
const houses = [
    {
        id: 1,
        title: "Modern 3-Bedroom Townhouse",
        price: "₦25,000,000",
        bedrooms: 3,
        bathrooms: 2,
        area: "250 sqm",
        location: "Lekki Phase 1, Lagos",
        description: "Newly renovated 3-bedroom townhouse with modern amenities, spacious living area, and secure compound.",
        priceRange: "mid",
        emoji: "🏠"
    },
    {
        id: 2,
        title: "Luxury 4-Bedroom Detached House",
        price: "₦45,000,000",
        bedrooms: 4,
        bathrooms: 3,
        area: "400 sqm",
        location: "Ikoyi, Lagos",
        description: "Exquisite 4-bedroom detached house with swimming pool, garden, and modern security features.",
        priceRange: "premium",
        emoji: "🏡"
    },
    {
        id: 3,
        title: "Cozy 2-Bedroom Apartment",
        price: "₦12,000,000",
        bedrooms: 2,
        bathrooms: 1,
        area: "150 sqm",
        location: "Victoria Island, Lagos",
        description: "Compact 2-bedroom apartment perfect for small families or couples. Well-maintained and secure.",
        priceRange: "budget",
        emoji: "🏢"
    },
    {
        id: 4,
        title: "Executive 4-Bedroom Villa",
        price: "₦50,000,000",
        bedrooms: 4,
        bathrooms: 4,
        area: "500 sqm",
        location: "Banana Island, Lagos",
        description: "Premium 4-bedroom villa with state-of-the-art facilities, smart home technology, and waterfront view.",
        priceRange: "premium",
        emoji: "👑"
    },
    {
        id: 5,
        title: "Spacious 3-Bedroom Bungalow",
        price: "₦28,000,000",
        bedrooms: 3,
        bathrooms: 2,
        area: "320 sqm",
        location: "Ajah, Lagos",
        description: "Single-storey bungalow with large courtyard, ideal for families seeking comfort and privacy.",
        priceRange: "mid",
        emoji: "🏘️"
    },
    {
        id: 6,
        title: "Budget-Friendly 2-Bedroom Semi-Detached",
        price: "₦8,500,000",
        bedrooms: 2,
        bathrooms: 1,
        area: "120 sqm",
        location: "Lekki Phase 2, Lagos",
        description: "Affordable semi-detached house with basic amenities and secure neighborhood.",
        priceRange: "budget",
        emoji: "🏠"
    },
    {
        id: 7,
        title: "Modern 3-Bedroom Apartment Complex",
        price: "₦32,000,000",
        bedrooms: 3,
        bathrooms: 2,
        area: "280 sqm",
        location: "Oniru, Lagos",
        description: "Contemporary apartment in secure complex with gym, pool, and 24/7 security.",
        priceRange: "mid",
        emoji: "🏗️"
    },
    {
        id: 8,
        title: "Charming 2-Bedroom Cottage",
        price: "₦10,500,000",
        bedrooms: 2,
        bathrooms: 1,
        area: "140 sqm",
        location: "Chevron, Lagos",
        description: "Quaint cottage with garden space, perfect for nature lovers and peaceful living.",
        priceRange: "budget",
        emoji: "🏡"
    },
    {
        id: 9,
        title: "Luxurious 5-Bedroom Mansion",
        price: "₦60,000,000",
        bedrooms: 5,
        bathrooms: 4,
        area: "600 sqm",
        location: "Eko Atlantic, Lagos",
        description: "Opulent 5-bedroom mansion with basement, cinema, wine cellar, and beachfront access.",
        priceRange: "premium",
        emoji: "👑"
    },
    {
        id: 10,
        title: "Elegant 3-Bedroom Terraced House",
        price: "₦22,000,000",
        bedrooms: 3,
        bathrooms: 2,
        area: "240 sqm",
        location: "Lekki Axis, Lagos",
        description: "Well-designed terraced house in premium location with excellent amenities.",
        priceRange: "mid",
        emoji: "🏠"
    },
    {
        id: 11,
        title: "Smart 3-Bedroom Eco-House",
        price: "₦26,000,000",
        bedrooms: 3,
        bathrooms: 2,
        area: "270 sqm",
        location: "Ikoyi, Lagos",
        description: "Eco-friendly 3-bedroom house with solar panels, rainwater harvesting, and modern design.",
        priceRange: "mid",
        emoji: "🌱"
    },
    {
        id: 12,
        title: "Grand 4-Bedroom Palace",
        price: "₦48,000,000",
        bedrooms: 4,
        bathrooms: 3,
        area: "420 sqm",
        location: "Lekki, Lagos",
        description: "Magnificent 4-bedroom palace with premium finishes, landscaped garden, and premium location.",
        priceRange: "premium",
        emoji: "👑"
    }
];

// Sample data for rooms
const rooms = [
    {
        id: 101,
        title: "Cozy Single Room",
        price: "₦650,000",
        type: "single",
        location: "Lekki Phase 1, Lagos",
        description: "Well-furnished single room with AC, fan, and wardrobe. Suitable for students or professionals.",
        priceRange: "budget",
        emoji: "🛏️"
    },
    {
        id: 102,
        title: "Luxury Self-Contained Studio",
        price: "₦2,500,000",
        type: "self-contained",
        location: "Victoria Island, Lagos",
        description: "Premium self-contained with kitchenette, bathroom, and modern furnishings. Perfect for independent living.",
        priceRange: "premium",
        emoji: "✨"
    },
    {
        id: 103,
        title: "Spacious Shared Apartment",
        price: "₦1,200,000",
        type: "shared",
        location: "Ajah, Lagos",
        description: "Shared 3-bedroom apartment with separate utilities. Friendly community of professionals.",
        priceRange: "mid",
        emoji: "👥"
    },
    {
        id: 104,
        title: "Bright Single Room with Balcony",
        price: "₦750,000",
        type: "single",
        location: "Ikoyi, Lagos",
        description: "Single room with private balcony overlooking the city. Equipped with modern amenities.",
        priceRange: "budget",
        emoji: "🌅"
    },
    {
        id: 105,
        title: "Comfortable Self-Contained Apartment",
        price: "₦1,800,000",
        type: "self-contained",
        location: "Lekki Phase 2, Lagos",
        description: "Fully equipped self-contained room with kitchen, bathroom, and living space.",
        priceRange: "mid",
        emoji: "🏠"
    },
    {
        id: 106,
        title: "Modern Shared Flat",
        price: "₦950,000",
        type: "shared",
        location: "Chevron, Lagos",
        description: "Shared 2-bedroom flat with well-maintained common areas and friendly roommates.",
        priceRange: "budget",
        emoji: "👥"
    },
    {
        id: 107,
        title: "Premium Self-Contained Penthouse",
        price: "₦3,200,000",
        type: "self-contained",
        location: "Banana Island, Lagos",
        description: "Luxury penthouse room with panoramic views, private entrance, and upscale finishes.",
        priceRange: "premium",
        emoji: "⭐"
    },
    {
        id: 108,
        title: "Budget Single Room",
        price: "₦500,000",
        type: "single",
        location: "Lekki Axis, Lagos",
        description: "Basic but clean single room with essential furnishings. Ideal for budget-conscious renters.",
        priceRange: "budget",
        emoji: "🛏️"
    },
    {
        id: 109,
        title: "Executive Self-Contained Suite",
        price: "₦2,200,000",
        type: "self-contained",
        location: "Oniru, Lagos",
        description: "Executive suite with premium amenities, workspace, and luxury finishes.",
        priceRange: "mid",
        emoji: "💼"
    },
    {
        id: 110,
        title: "Vibrant Shared House",
        price: "₦1,100,000",
        type: "shared",
        location: "Lekki, Lagos",
        description: "Shared 4-bedroom house with active community. Great for social individuals.",
        priceRange: "mid",
        emoji: "👥"
    },
    {
        id: 111,
        title: "Quiet Single Room in Residential Area",
        price: "₦580,000",
        type: "single",
        location: "Ajah, Lagos",
        description: "Peaceful single room in calm neighborhood with friendly landlord.",
        priceRange: "budget",
        emoji: "🏘️"
    },
    {
        id: 112,
        title: "Ultra-Luxury Self-Contained Apartment",
        price: "₦4,000,000",
        type: "self-contained",
        location: "Eko Atlantic, Lagos",
        description: "Ultra-premium beachfront self-contained with exclusive amenities and services.",
        priceRange: "premium",
        emoji: "👑"
    },
    {
        id: 113,
        title: "Affordable Shared Apartment",
        price: "₦850,000",
        type: "shared",
        location: "Victoria Island, Lagos",
        description: "Budget-friendly shared accommodation with good security and basic amenities.",
        priceRange: "budget",
        emoji: "👥"
    },
    {
        id: 114,
        title: "Elegant Single Room",
        price: "₦900,000",
        type: "single",
        location: "Ikoyi, Lagos",
        description: "Elegantly furnished single room with premium finishes and modern appliances.",
        priceRange: "mid",
        emoji: "✨"
    },
    {
        id: 115,
        title: "Spacious Self-Contained Bungalow",
        price: "₦2,000,000",
        type: "self-contained",
        location: "Lekki Phase 1, Lagos",
        description: "Spacious self-contained room in bungalow setting with garden and privacy.",
        priceRange: "mid",
        emoji: "🌿"
    },
    {
        id: 116,
        title: "Student Shared Accommodation",
        price: "₦700,000",
        type: "shared",
        location: "Ajah, Lagos",
        description: "Shared accommodation popular among students. Secure and with study spaces.",
        priceRange: "budget",
        emoji: "📚"
    }
];

// Sample data for vacancies
const vacancies = [
    {
        id: 201,
        title: "Property Manager",
        department: "Management",
        salary: "₦500,000",
        requirements: "3+ years experience in property management, excellent communication skills",
        status: "open",
        emoji: "💼"
    },
    {
        id: 202,
        title: "Receptionist",
        department: "Operations",
        salary: "₦250,000",
        requirements: "Customer service experience, fluent English, computer literate",
        status: "open",
        emoji: "📞"
    },
    {
        id: 203,
        title: "Maintenance Technician",
        department: "Maintenance",
        salary: "₦350,000",
        requirements: "Electrical and plumbing knowledge, hands-on experience required",
        status: "open",
        emoji: "🔧"
    },
    {
        id: 204,
        title: "Security Officer",
        department: "Security",
        salary: "₦280,000",
        requirements: "Security training, physical fitness, 24/7 availability",
        status: "open",
        emoji: "👮"
    },
    {
        id: 205,
        title: "Cleaning Staff",
        department: "Cleaning",
        salary: "₦200,000",
        requirements: "Attention to detail, reliability, experience in facility management",
        status: "open",
        emoji: "🧹"
    },
    {
        id: 206,
        title: "Accounting Officer",
        department: "Finance",
        salary: "₦450,000",
        requirements: "Accounting background, QuickBooks experience, attention to detail",
        status: "open",
        emoji: "📊"
    }
];

// Render listings on page load
document.addEventListener('DOMContentLoaded', () => {
    renderHouses(houses);
    renderRooms(rooms);
    updateVacancyCounts();
});

// Render houses
function renderHouses(dataToRender) {
    const housesList = document.getElementById('housesList');
    housesList.innerHTML = '';

    if (dataToRender.length === 0) {
        housesList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No houses match your criteria.</p>';
        return;
    }

    dataToRender.forEach(house => {
        const card = createListingCard(house, 'house');
        housesList.appendChild(card);
    });
}

// Render rooms
function renderRooms(dataToRender) {
    const roomsList = document.getElementById('roomsList');
    roomsList.innerHTML = '';

    if (dataToRender.length === 0) {
        roomsList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No rooms match your criteria.</p>';
        return;
    }

    dataToRender.forEach(room => {
        const card = createListingCard(room, 'room');
        roomsList.appendChild(card);
    });
}

// Render vacancies
function renderVacancies(dataToRender = vacancies) {
    const vacanciesList = document.getElementById('vacanciesList');
    if (!vacanciesList) return;
    
    vacanciesList.innerHTML = '';

    if (dataToRender.length === 0) {
        vacanciesList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No vacancies available at the moment.</p>';
        return;
    }

    dataToRender.forEach(vacancy => {
        const card = createVacancyCard(vacancy);
        vacanciesList.appendChild(card);
    });
}

// Create listing card
function createListingCard(item, type) {
    const card = document.createElement('div');
    card.className = 'listing-card';

    let detailsHTML = '';
    if (type === 'house') {
        detailsHTML = `
            <div class="detail-item">
                <strong>${item.bedrooms}</strong>
                Beds
            </div>
            <div class="detail-item">
                <strong>${item.bathrooms}</strong>
                Baths
            </div>
            <div class="detail-item">
                <strong>${item.area}</strong>
                Area
            </div>
        `;
    } else {
        detailsHTML = `
            <div class="detail-item">
                <strong>${item.type}</strong>
                Type
            </div>
            <div class="detail-item">
                <strong>Available</strong>
                Now
            </div>
            <div class="detail-item">
                <strong>Furnished</strong>
                Yes
            </div>
        `;
    }

    const saveButtonHTML = currentUser ? `<button class="listing-button" style="background-color: #27ae60; margin-left: 0.5rem;" onclick="saveListing(${item.id})">❤️ Save</button>` : '';

    card.innerHTML = `
        <div class="listing-image">${item.emoji}</div>
        <div class="listing-content">
            <div class="listing-header">
                <div class="listing-title">${item.title}</div>
                <div class="listing-price">${item.price}</div>
            </div>
            <div class="listing-details">
                ${detailsHTML}
            </div>
            <p class="listing-description">${item.description}</p>
            <div class="listing-location">
                📍 ${item.location}
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <button class="listing-button" onclick="contactAboutListing('${item.title}')">
                    Inquire Now
                </button>
                ${saveButtonHTML}
            </div>
        </div>
    `;

    return card;
}

// Create vacancy card
function createVacancyCard(vacancy) {
    const card = document.createElement('div');
    card.className = 'listing-card';

    const applyButtonHTML = currentUser ? `<button class="listing-button" style="background-color: #27ae60; margin-left: 0.5rem;" onclick="applyForJob('${vacancy.title}')">✓ Apply Now</button>` : `<button class="listing-button" style="background-color: #27ae60; margin-left: 0.5rem;" onclick="showLoginModal()">Login to Apply</button>`;

    card.innerHTML = `
        <div class="listing-image">${vacancy.emoji}</div>
        <div class="listing-content">
            <div class="listing-header">
                <div class="listing-title">${vacancy.title}</div>
                <div class="listing-price">${vacancy.salary}</div>
            </div>
            <div class="listing-details">
                <div class="detail-item">
                    <strong>${vacancy.department}</strong>
                    Department
                </div>
                <div class="detail-item">
                    <strong>${vacancy.status}</strong>
                    Status
                </div>
                <div class="detail-item">
                    <strong>Available</strong>
                    Now
                </div>
            </div>
            <p class="listing-description">${vacancy.requirements}</p>
            <div style="display: flex; gap: 0.5rem;">
                <button class="listing-button" onclick="contactAboutJob('${vacancy.title}')">
                    Inquire
                </button>
                ${applyButtonHTML}
            </div>
        </div>
    `;

    return card;
}

// Filter listings
function filterListings() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const priceFilter = document.getElementById('priceFilter').value;
    const bedroomFilter = document.getElementById('bedroomFilter').value;
    const roomTypeFilter = document.getElementById('roomTypeFilter').value;
    const roomPriceFilter = document.getElementById('roomPriceFilter').value;

    // Filter houses
    let filteredHouses = houses.filter(house => {
        const matchesSearch = house.title.toLowerCase().includes(searchInput) ||
                             house.location.toLowerCase().includes(searchInput);
        const matchesPrice = !priceFilter || house.priceRange === priceFilter;
        const matchesBedroom = !bedroomFilter || 
                              (bedroomFilter === '4' ? house.bedrooms >= 4 : house.bedrooms == bedroomFilter);

        return matchesSearch && matchesPrice && matchesBedroom;
    });

    // Filter rooms
    let filteredRooms = rooms.filter(room => {
        const matchesSearch = room.title.toLowerCase().includes(searchInput) ||
                             room.location.toLowerCase().includes(searchInput);
        const matchesType = !roomTypeFilter || room.type === roomTypeFilter;
        const matchesPrice = !roomPriceFilter || room.priceRange === roomPriceFilter;

        return matchesSearch && matchesType && matchesPrice;
    });

    renderHouses(filteredHouses);
    renderRooms(filteredRooms);
    updateVacancyCounts(filteredHouses.length, filteredRooms.length);
}

// Update vacancy counts
function updateVacancyCounts(houseCount = houses.length, roomCount = rooms.length) {
    document.getElementById('houseCount').textContent = houseCount;
    document.getElementById('roomCount').textContent = roomCount;
}

// Contact about listing
function contactAboutListing(title) {
    if (!currentUser) {
        alert('Please login to make an inquiry.');
        showLoginModal();
        return;
    }

    const userId = currentUser.id;
    if (!userInquiries[userId]) {
        userInquiries[userId] = [];
    }

    const inquiry = {
        title: title,
        date: new Date().toISOString(),
        message: `I'm interested in: ${title}. Please provide more information.`
    };

    userInquiries[userId].push(inquiry);
    localStorage.setItem('userInquiries', JSON.stringify(userInquiries));

    alert(`Thank you for your interest!\n\nInquiry for "${title}" has been sent.\n\nWe'll contact you soon with more details.`);
    
    // Scroll to contact section
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}

// Job application functions
function applyForJob(jobTitle) {
    if (!currentUser) {
        showLoginModal();
        return;
    }

    alert(`Thank you for your interest in the ${jobTitle} position!\n\nYour application has been submitted. We will review and contact you soon.`);
    
    // Scroll to contact
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}

function contactAboutJob(jobTitle) {
    alert(`Inquiry about: ${jobTitle}\n\nPlease contact us for more details:\n\n📞 +234 (0) 123 456 7890\n✉️ careers@ivoryapartment.com`);
    
    // Scroll to contact
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
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

// Handle contact form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
}


// ============================================
// MOBILE NAVIGATION MENU
// ============================================

function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const hamburger = document.querySelector('.hamburger');
    
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function closeMenu() {
    const navMenu = document.getElementById('navMenu');
    const hamburger = document.querySelector('.hamburger');
    
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const navMenu = document.getElementById('navMenu');
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('.navbar');
    
    if (!navbar.contains(event.target)) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});


// ============================================
// PAYROLL FUNCTIONALITY FOR TENANT DASHBOARD
// ============================================

// Payroll data storage
let tenantPayrollData = JSON.parse(localStorage.getItem('tenantPayrollData')) || {};
let paymentHistory = JSON.parse(localStorage.getItem('paymentHistory')) || {};

// Load and display payroll information
function loadPayrollInformation() {
    if (!currentUser) return;

    const userId = currentUser.id;
    const payroll = tenantPayrollData[userId] || {
        position: 'Tenant',
        salary: 0,
        status: 'Active',
        department: 'Residential'
    };

    const payments = paymentHistory[userId] || [];

    // Update payroll summary
    const monthlySalary = payroll.salary || 0;
    const ytdEarnings = calculateYTD(payments);
    const totalDeductions = calculateDeductions(payments);
    const netPay = calculateNetPay(payments, payroll);

    document.getElementById('monthlySalary').textContent = `₦${monthlySalary.toLocaleString()}`;
    document.getElementById('ytdEarnings').textContent = `₦${ytdEarnings.toLocaleString()}`;
    document.getElementById('totalDeductions').textContent = `₦${totalDeductions.toLocaleString()}`;
    document.getElementById('netPay').textContent = `₦${netPay.toLocaleString()}`;

    // Update current position and status
    document.getElementById('currentPosition').textContent = payroll.position;
    document.getElementById('employmentStatus').textContent = payroll.status;

    // Get last and next payment dates
    const lastPayment = payments.length > 0 ? payments[payments.length - 1] : null;
    const nextPaymentDate = calculateNextPaymentDate(lastPayment);

    document.getElementById('lastPaymentDate').textContent = lastPayment ? lastPayment.date : 'N/A';
    document.getElementById('nextPaymentDate').textContent = nextPaymentDate;

    // Render payment history
    renderPaymentHistory(payments);
}

// Calculate Year-to-Date earnings
function calculateYTD(payments) {
    if (!payments || payments.length === 0) return 0;
    
    const currentYear = new Date().getFullYear();
    return payments
        .filter(p => new Date(p.date).getFullYear() === currentYear && p.status === 'paid')
        .reduce((sum, p) => sum + (p.amount || 0), 0);
}

// Calculate total deductions
function calculateDeductions(payments) {
    if (!payments || payments.length === 0) return 0;
    
    return payments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + (p.deductions || 0), 0);
}

// Calculate net pay (gross - deductions)
function calculateNetPay(payments, payroll) {
    const ytd = calculateYTD(payments);
    const deductions = calculateDeductions(payments);
    return Math.max(0, ytd - deductions);
}

// Calculate next payment date (usually month-end or 25th)
function calculateNextPaymentDate(lastPayment) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    // Next payment on the 25th of current month or end of month
    let nextPayDate = new Date(year, month, 25);
    
    if (today.getDate() >= 25) {
        // If past 25th, next payment is next month
        nextPayDate = new Date(year, month + 1, 25);
    }
    
    return nextPayDate.toLocaleDateString();
}

// Render payment history
function renderPaymentHistory(payments) {
    const historyList = document.getElementById('paymentHistoryList');
    
    if (!payments || payments.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: #7f8c8d; padding: 2rem;">No payment records found.</p>';
        return;
    }

    let html = '';
    // Show last 6 payments
    const recent = payments.slice(-6).reverse();
    
    recent.forEach(payment => {
        const statusClass = `payment-status ${payment.status}`;
        const statusText = payment.status.charAt(0).toUpperCase() + payment.status.slice(1);
        
        html += `
            <div class="payment-item">
                <div class="payment-date">
                    ${new Date(payment.date).toLocaleDateString()}
                </div>
                <div>
                    <small>${payment.period || 'Monthly'}</small>
                </div>
                <div class="payment-amount">
                    ₦${(payment.amount || 0).toLocaleString()}
                </div>
                <div>
                    <span class="${statusClass}">${statusText}</span>
                </div>
            </div>
        `;
    });

    historyList.innerHTML = html;
}

// Download payslip
function downloadPayslip() {
    if (!currentUser) {
        alert('Please login first');
        return;
    }

    const userId = currentUser.id;
    const payroll = tenantPayrollData[userId] || {};
    const payments = paymentHistory[userId] || [];
    const lastPayment = payments.length > 0 ? payments[payments.length - 1] : null;

    if (!lastPayment) {
        alert('No payment records available for download');
        return;
    }

    const payslipContent = `
╔════════════════════════════════════════════╗
║          IVORY APARTMENT PAYSLIP          ║
║                                            ║
║ Employee: ${currentUser.name.padEnd(30)}║
║ Employee ID: ${currentUser.id.toString().padEnd(25)}║
║ Position: ${(payroll.position || 'N/A').padEnd(28)}║
║                                            ║
║ Pay Period: ${lastPayment.period || 'Monthly'.padEnd(25)}║
║ Pay Date: ${new Date(lastPayment.date).toLocaleDateString().padEnd(26)}║
║                                            ║
║ ══════════════════════════════════════════║
║ EARNINGS                                   ║
║ ══════════════════════════════════════════║
║ Basic Salary: ₦${(lastPayment.amount || 0).toString().padEnd(22)}║
║ Allowances: ₦${(lastPayment.allowances || 0).toString().padEnd(23)}║
║ ──────────────────────────────────────────║
║ Gross Pay: ₦${((lastPayment.amount || 0) + (lastPayment.allowances || 0)).toString().padEnd(26)}║
║                                            ║
║ ══════════════════════════════════════════║
║ DEDUCTIONS                                 ║
║ ══════════════════════════════════════════║
║ Tax: ₦${(lastPayment.tax || 0).toString().padEnd(33)}║
║ Insurance: ₦${(lastPayment.insurance || 0).toString().padEnd(28)}║
║ Other: ₦${(lastPayment.other || 0).toString().padEnd(30)}║
║ ──────────────────────────────────────────║
║ Total Deductions: ₦${(lastPayment.deductions || 0).toString().padEnd(19)}║
║                                            ║
║ ══════════════════════════════════════════║
║ NET PAY: ₦${((lastPayment.amount || 0) - (lastPayment.deductions || 0)).toString().padEnd(27)}║
║ ══════════════════════════════════════════║
║                                            ║
║ Bank Details:                              ║
║ Account Name: ${(currentUser.name || 'N/A').padEnd(25)}║
║ Status: ${(lastPayment.status || 'PAID').padEnd(30)}║
║                                            ║
║ Generated: ${new Date().toLocaleString().padEnd(24)}║
╚════════════════════════════════════════════╝
    `;

    // Copy to clipboard or show in alert
    alert(payslipContent);
    
    // Optional: Download as text file
    const blob = new Blob([payslipContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payslip_${currentUser.id}_${new Date().getTime()}.txt`;
    a.click();
}

// View detailed payroll information
function viewPayrollDetails() {
    if (!currentUser) {
        alert('Please login first');
        return;
    }

    const userId = currentUser.id;
    const payroll = tenantPayrollData[userId] || {};
    const payments = paymentHistory[userId] || [];

    const totalEarnings = calculateYTD(payments);
    const totalDeductions = calculateDeductions(payments);
    const netEarnings = totalEarnings - totalDeductions;
    const avgMonthly = payments.length > 0 ? (totalEarnings / payments.length).toFixed(2) : 0;

    const details = `
DETAILED PAYROLL INFORMATION
════════════════════════════════════════

Employee Details:
  Name: ${currentUser.name}
  Email: ${currentUser.email}
  Phone: ${currentUser.phone}
  Position: ${payroll.position || 'N/A'}
  Status: ${payroll.status || 'Active'}
  Department: ${payroll.department || 'N/A'}

Year-to-Date Summary:
  Total Payments: ${payments.length}
  Total Earnings: ₦${totalEarnings.toLocaleString()}
  Total Deductions: ₦${totalDeductions.toLocaleString()}
  Net Earnings: ₦${netEarnings.toLocaleString()}
  Average Monthly: ₦${parseFloat(avgMonthly).toLocaleString()}

Payment Status:
  Paid: ${payments.filter(p => p.status === 'paid').length}
  Pending: ${payments.filter(p => p.status === 'pending').length}
  Failed: ${payments.filter(p => p.status === 'failed').length}

Recent Transactions:
${payments.slice(-3).reverse().map(p => 
  `  ${new Date(p.date).toLocaleDateString()} - ₦${p.amount} (${p.status})`
).join('\n')}

Next Payment Date: ${calculateNextPaymentDate(payments[payments.length - 1] || null)}
    `;

    alert(details);
}

// Add sample payroll data for demo (admin function)
function addSamplePayrollData() {
    if (!currentUser) return;

    const userId = currentUser.id;
    
    // Set up sample payroll
    tenantPayrollData[userId] = {
        position: 'Staff Member',
        salary: 500000,
        status: 'Active',
        department: 'General',
        startDate: new Date(2024, 0, 1).toLocaleDateString()
    };

    // Add sample payment history
    const samplePayments = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
        const paymentDate = new Date(today.getFullYear(), today.getMonth() - i, 25);
        samplePayments.push({
            date: paymentDate.toLocaleDateString(),
            period: `${paymentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
            amount: 500000,
            allowances: 50000,
            tax: 75000,
            insurance: 25000,
            other: 10000,
            deductions: 110000,
            status: i > 0 ? 'paid' : 'pending'
        });
    }

    paymentHistory[userId] = samplePayments;

    localStorage.setItem('tenantPayrollData', JSON.stringify(tenantPayrollData));
    localStorage.setItem('paymentHistory', JSON.stringify(paymentHistory));

    loadPayrollInformation();
    alert('Sample payroll data added! Check your payroll tab.');
}

// Initialize payroll when dashboard opens
function initializePayroll() {
    if (currentUser) {
        // Load sample data if user has no payroll data yet
        const userId = currentUser.id;
        if (!tenantPayrollData[userId]) {
            addSamplePayrollData();
        } else {
            loadPayrollInformation();
        }
    }
}

// Update the switchDashboardTab function to initialize payroll
const originalSwitchDashboardTab = switchDashboardTab;
if (typeof originalSwitchDashboardTab === 'function') {
    switchDashboardTab = function(tabName) {
        originalSwitchDashboardTab.call(this, tabName);
        if (tabName === 'payroll') {
            initializePayroll();
        }
    };
}


// ============================================
// PAYMENT HISTORY DISPLAY (Tenant Dashboard)
// ============================================

function viewPaymentHistory() {
    const payments = getPaymentHistory() || [];

    if (payments.length === 0) {
        alert('No payment history available');
        return;
    }

    let historyText = '📊 PAYMENT HISTORY\n\n';
    historyText += '═══════════════════════════════════════\n';

    payments.slice(-10).reverse().forEach((payment, index) => {
        historyText += `\n${index + 1}. Transaction ID: ${payment.id}\n`;
        historyText += `   Amount: KES ${payment.amount.toLocaleString()}\n`;
        historyText += `   Type: ${payment.type}\n`;
        historyText += `   Method: ${payment.method}\n`;
        historyText += `   Status: ${payment.status.toUpperCase()}\n`;
        historyText += `   Date: ${payment.timestamp}\n`;
        historyText += '───────────────────────────────────────\n';
    });

    const totalPaid = getTotalPaid();
    historyText += `\nTotal Paid: KES ${totalPaid.toLocaleString()}`;

    alert(historyText);
}

// Update payment history when tab switches
const originalSwitchDashboardTab = switchDashboardTab;
if (typeof originalSwitchDashboardTab === 'function') {
    switchDashboardTab = function(tabName) {
        originalSwitchDashboardTab.call(this, tabName);
        if (tabName === 'payroll') {
            initializePaymentSystem();
        }
    };
}

// Initialize payment system on page load
document.addEventListener('DOMContentLoaded', function() {
    if (typeof initializePaymentSystem === 'function') {
        initializePaymentSystem();
    }
});
