// ============================================
// APARTMENT ROOMS PAGE FUNCTIONALITY
// ============================================

// Sample rooms data
const allRooms = [
    {
        id: 101,
        title: "Cozy Single Room",
        price: "₦650,000",
        type: "single",
        location: "Lekki Phase 1",
        area: "12m²",
        description: "Well-furnished single room with AC, fan, and wardrobe. Suitable for students or professionals.",
        priceRange: "budget",
        emoji: "🛏️"
    },
    {
        id: 102,
        title: "Luxury Self-Contained Studio",
        price: "₦2,500,000",
        type: "self-contained",
        location: "Victoria Island",
        area: "25m²",
        description: "Premium self-contained with kitchenette, bathroom, and modern furnishings. Perfect for independent living.",
        priceRange: "premium",
        emoji: "✨"
    },
    {
        id: 103,
        title: "Spacious Shared Apartment",
        price: "₦1,200,000",
        type: "shared",
        location: "Ajah",
        area: "60m²",
        description: "Shared 3-bedroom apartment with separate utilities. Friendly community of professionals.",
        priceRange: "mid",
        emoji: "👥"
    },
    {
        id: 104,
        title: "Bright Single Room with Balcony",
        price: "₦750,000",
        type: "single",
        location: "Ikoyi",
        area: "15m²",
        description: "Single room with private balcony overlooking the city. Equipped with modern amenities.",
        priceRange: "budget",
        emoji: "🌅"
    },
    {
        id: 105,
        title: "Comfortable Self-Contained Apartment",
        price: "₦1,800,000",
        type: "self-contained",
        location: "Lekki Phase 2",
        area: "22m²",
        description: "Fully equipped self-contained room with kitchen, bathroom, and living space.",
        priceRange: "mid",
        emoji: "🏠"
    },
    {
        id: 106,
        title: "Modern Shared Flat",
        price: "₦950,000",
        type: "shared",
        location: "Chevron",
        area: "50m²",
        description: "Shared 2-bedroom flat with well-maintained common areas and friendly roommates.",
        priceRange: "budget",
        emoji: "👥"
    },
    {
        id: 107,
        title: "Premium Self-Contained Penthouse",
        price: "₦3,200,000",
        type: "self-contained",
        location: "Banana Island",
        area: "35m²",
        description: "Luxury penthouse room with panoramic views, private entrance, and upscale finishes.",
        priceRange: "premium",
        emoji: "⭐"
    },
    {
        id: 108,
        title: "Budget Single Room",
        price: "₦500,000",
        type: "single",
        location: "Lekki Axis",
        area: "10m²",
        description: "Basic but clean single room with essential furnishings. Ideal for budget-conscious renters.",
        priceRange: "budget",
        emoji: "🛏️"
    },
    {
        id: 109,
        title: "Executive Self-Contained Suite",
        price: "₦2,200,000",
        type: "self-contained",
        location: "Oniru",
        area: "28m²",
        description: "Executive suite with premium amenities, workspace, and luxury finishes.",
        priceRange: "mid",
        emoji: "💼"
    },
    {
        id: 110,
        title: "Vibrant Shared House",
        price: "₦1,100,000",
        type: "shared",
        location: "Lekki",
        area: "55m²",
        description: "Shared 4-bedroom house with active community. Great for social individuals.",
        priceRange: "mid",
        emoji: "👥"
    },
    {
        id: 111,
        title: "Quiet Single Room in Residential Area",
        price: "₦580,000",
        type: "single",
        location: "Ajah",
        area: "13m²",
        description: "Peaceful single room in calm neighborhood with friendly landlord.",
        priceRange: "budget",
        emoji: "🏘️"
    },
    {
        id: 112,
        title: "Ultra-Luxury Self-Contained Apartment",
        price: "₦4,000,000",
        type: "self-contained",
        location: "Eko Atlantic",
        area: "40m²",
        description: "Ultra-premium beachfront self-contained with exclusive amenities and services.",
        priceRange: "premium",
        emoji: "👑"
    },
    {
        id: 113,
        title: "Affordable Shared Apartment",
        price: "₦850,000",
        type: "shared",
        location: "Victoria Island",
        area: "45m²",
        description: "Budget-friendly shared accommodation with good security and basic amenities.",
        priceRange: "budget",
        emoji: "👥"
    },
    {
        id: 114,
        title: "Elegant Single Room",
        price: "₦900,000",
        type: "single",
        location: "Ikoyi",
        area: "16m²",
        description: "Elegantly furnished single room with premium finishes and modern appliances.",
        priceRange: "mid",
        emoji: "✨"
    },
    {
        id: 115,
        title: "Spacious Self-Contained Bungalow",
        price: "₦2,000,000",
        type: "self-contained",
        location: "Lekki Phase 1",
        area: "32m²",
        description: "Spacious self-contained room in bungalow setting with garden and privacy.",
        priceRange: "mid",
        emoji: "🌿"
    },
    {
        id: 116,
        title: "Student Shared Accommodation",
        price: "₦700,000",
        type: "shared",
        location: "Ajah",
        area: "40m²",
        description: "Shared accommodation popular among students. Secure and with study spaces.",
        priceRange: "budget",
        emoji: "📚"
    }
];

let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let userSavedListings = JSON.parse(localStorage.getItem('userSavedListings')) || {};

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    renderRooms(allRooms);
    setupFormListeners();
});

// Check auth status
function checkAuthStatus() {
    if (currentUser) {
        showUserMenu();
    } else {
        showLoginLink();
    }
}

// Show login link
function showLoginLink() {
    const userDisplay = document.getElementById('userDisplay');
    userDisplay.innerHTML = '<a href="javascript:showLoginModal()" id="loginLink">🔐 Login</a>';
}

// Show user menu
function showUserMenu() {
    const userDisplay = document.getElementById('userDisplay');
    const userName = currentUser.name.split(' ')[0];
    userDisplay.innerHTML = `
        <span style="margin-right: 1rem;">👤 ${userName}</span>
        <a href="javascript:logout()" style="color: white; text-decoration: none;">Logout</a>
    `;
}

// Render rooms
function renderRooms(roomsToRender) {
    const roomsGrid = document.getElementById('roomsGrid');
    roomsGrid.innerHTML = '';

    if (roomsToRender.length === 0) {
        roomsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #7f8c8d;">No rooms match your search criteria.</p>';
        return;
    }

    roomsToRender.forEach(room => {
        const card = createRoomCard(room);
        roomsGrid.appendChild(card);
    });

    // Update total rooms count
    document.getElementById('totalRooms').textContent = roomsToRender.length;
}

// Create room card
function createRoomCard(room) {
    const card = document.createElement('div');
    card.className = 'room-card';

    const saveButton = currentUser ? `<button class="btn-save" onclick="saveListing(${room.id})">❤️ Save</button>` : '';

    card.innerHTML = `
        <div class="room-image">${room.emoji}</div>
        <div class="room-content">
            <div class="room-header">
                <div class="room-title">${room.title}</div>
                <div class="room-price">${room.price}</div>
            </div>
            
            <span class="room-type">${room.type === 'single' ? 'Single Room' : room.type === 'self-contained' ? 'Self-Contained' : 'Shared Apt'}</span>
            
            <div class="room-details">
                <div class="detail-item">
                    <strong>${room.area}</strong>
                    Area
                </div>
                <div class="detail-item">
                    <strong>${room.type}</strong>
                    Type
                </div>
                <div class="detail-item">
                    <strong>Available</strong>
                    Now
                </div>
            </div>
            
            <p class="room-description">${room.description}</p>
            
            <div class="room-location">
                📍 ${room.location}
            </div>
            
            <div class="room-buttons">
                <button class="btn-inquire" onclick="contactAboutRoom('${room.title}')">Inquire</button>
                ${saveButton}
            </div>
        </div>
    `;

    return card;
}

// Filter rooms
function filterRooms() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const roomType = document.getElementById('roomTypeFilter').value;
    const priceRange = document.getElementById('priceFilter').value;
    const location = document.getElementById('locationFilter').value;

    let filtered = allRooms.filter(room => {
        const matchesSearch = room.title.toLowerCase().includes(searchInput) || 
                             room.location.toLowerCase().includes(searchInput);
        const matchesType = !roomType || room.type === roomType;
        const matchesPrice = !priceRange || room.priceRange === priceRange;
        const matchesLocation = !location || room.location.toLowerCase().includes(location);

        return matchesSearch && matchesType && matchesPrice && matchesLocation;
    });

    renderRooms(filtered);
}

// Reset filters
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('roomTypeFilter').value = '';
    document.getElementById('priceFilter').value = '';
    document.getElementById('locationFilter').value = '';
    renderRooms(allRooms);
}

// Contact about room
function contactAboutRoom(title) {
    if (!currentUser) {
        alert('Please login to make an inquiry.');
        showLoginModal();
        return;
    }

    alert(`Thank you for your interest in "${title}"!\n\nYour inquiry has been submitted.\n\nWe'll contact you soon with more details.`);
}

// Save listing
function saveListing(roomId) {
    if (!currentUser) {
        showLoginModal();
        return;
    }

    const userId = currentUser.id;
    if (!userSavedListings[userId]) {
        userSavedListings[userId] = [];
    }

    if (!userSavedListings[userId].includes(roomId)) {
        userSavedListings[userId].push(roomId);
        localStorage.setItem('userSavedListings', JSON.stringify(userSavedListings));
        alert('Room saved to your favorites!');
    } else {
        alert('This room is already saved.');
    }
}

// Show login modal
function showLoginModal() {
    document.getElementById('loginModal').classList.add('active');
}

// Close login modal
function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
}

// Switch tabs
function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const tabButtons = document.querySelectorAll('.tab-btn');

    if (tab === 'login') {
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
        tabButtons[0].classList.add('active');
        tabButtons[1].classList.remove('active');
    } else {
        loginForm.classList.remove('active');
        signupForm.classList.add('active');
        tabButtons[0].classList.remove('active');
        tabButtons[1].classList.add('active');
    }
}

// Handle tenant login
function handleTenantLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('ivoryUsers')) || [];
    const user = users.find(u => u.email === email);

    if (!user) {
        alert('Email not found. Please sign up first.');
        return;
    }

    if (user.password !== password) {
        alert('Incorrect password. Please try again.');
        return;
    }

    currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
    };

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    closeLoginModal();
    checkAuthStatus();
    alert('Welcome back, ' + currentUser.name.split(' ')[0] + '!');
}

// Handle tenant signup
function handleTenantSignup(event) {
    event.preventDefault();

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const password = document.getElementById('signupPassword').value;

    let users = JSON.parse(localStorage.getItem('ivoryUsers')) || [];

    if (users.some(u => u.email === email)) {
        alert('Email already registered. Please login or use a different email.');
        return;
    }

    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        password: password
    };

    users.push(newUser);
    localStorage.setItem('ivoryUsers', JSON.stringify(users));

    currentUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone
    };

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    closeLoginModal();
    checkAuthStatus();
    alert('Welcome, ' + currentUser.name.split(' ')[0] + '! Your account has been created.');
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        checkAuthStatus();
        alert('You have been logged out.');
    }
}

// Setup form listeners
function setupFormListeners() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleTenantLogin);
    }

    if (signupForm) {
        signupForm.addEventListener('submit', handleTenantSignup);
    }
}

// Mobile menu
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

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
        closeLoginModal();
    }
}
