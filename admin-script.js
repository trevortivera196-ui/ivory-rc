// ============================================
// ADMIN DASHBOARD DATA MANAGEMENT
// ============================================

// Data storage
let staffData = JSON.parse(localStorage.getItem('staffData')) || [];
let roomAdsData = JSON.parse(localStorage.getItem('roomAdsData')) || [];
let vacanciesData = JSON.parse(localStorage.getItem('vacanciesData')) || [];
let companySettings = JSON.parse(localStorage.getItem('companySettings')) || {
    name: 'Ivory Apartment',
    address: 'Lekki, Lagos, Nigeria',
    phone: '+234 (0) 123 456 7890',
    email: 'info@ivoryapartment.com'
};

let adminUser = {
    name: 'Admin User',
    email: 'admin@ivoryapartment.com'
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    checkAdminAccess();
    setupEventListeners();
    updateDashboard();
    loadAllData();
});

// Check admin access
function checkAdminAccess() {
    const isAdmin = sessionStorage.getItem('adminLoggedIn');
    if (!isAdmin) {
        // Redirect to admin login
        window.location.href = 'admin-login.html';
    }
    document.getElementById('adminUserDisplay').textContent = `👤 ${adminUser.name}`;
}

// Setup event listeners
function setupEventListeners() {
    // Payroll form
    const payrollForm = document.getElementById('payrollForm');
    if (payrollForm) {
        payrollForm.addEventListener('submit', handleAddStaff);
    }

    // Room ad form
    const roomAdForm = document.getElementById('roomAdForm');
    if (roomAdForm) {
        roomAdForm.addEventListener('submit', handleAddRoomAd);
    }

    // Vacancy form
    const vacancyForm = document.getElementById('vacancyForm');
    if (vacancyForm) {
        vacancyForm.addEventListener('submit', handleAddVacancy);
    }

    // Settings forms
    const companySettingsForm = document.getElementById('companySettingsForm');
    if (companySettingsForm) {
        companySettingsForm.addEventListener('submit', handleSaveCompanySettings);
    }

    const accountSettingsForm = document.getElementById('accountSettingsForm');
    if (accountSettingsForm) {
        accountSettingsForm.addEventListener('submit', handleChangePassword);
    }

    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', toggleDarkMode);
    }
}

// Load all data
function loadAllData() {
    loadPayrollData();
    loadRoomAdsData();
    loadVacanciesData();
    loadCompanySettings();
}

// ============================================
// PAYROLL MANAGEMENT
// ============================================

function handleAddStaff(e) {
    e.preventDefault();

    const newStaff = {
        id: Date.now(),
        name: document.getElementById('staffName').value,
        position: document.getElementById('staffPosition').value,
        salary: parseFloat(document.getElementById('staffSalary').value),
        status: document.getElementById('staffStatus').value,
        dateAdded: new Date().toLocaleDateString()
    };

    staffData.push(newStaff);
    localStorage.setItem('staffData', JSON.stringify(staffData));
    
    e.target.reset();
    loadPayrollData();
    updateDashboard();
    alert('Staff member added successfully!');
}

function loadPayrollData() {
    const payrollList = document.getElementById('payrollList');
    if (!payrollList) return;

    if (staffData.length === 0) {
        payrollList.innerHTML = '<p class="empty-message">No staff members added yet</p>';
        return;
    }

    let html = '';
    staffData.forEach(staff => {
        const statusClass = `status-${staff.status}`;
        html += `
            <div class="list-item">
                <div class="item-info">
                    <h4>${staff.name}</h4>
                    <p><strong>Position:</strong> ${staff.position} | <strong>Salary:</strong> ₦${staff.salary.toLocaleString()}</p>
                    <p><strong>Status:</strong> <span class="${statusClass}">${staff.status}</span></p>
                </div>
                <div class="item-actions">
                    <button class="btn-edit" onclick="editStaff(${staff.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteStaff(${staff.id})">Delete</button>
                </div>
            </div>
        `;
    });

    payrollList.innerHTML = html;
}

function deleteStaff(id) {
    if (confirm('Are you sure you want to delete this staff member?')) {
        staffData = staffData.filter(s => s.id !== id);
        localStorage.setItem('staffData', JSON.stringify(staffData));
        loadPayrollData();
        updateDashboard();
        alert('Staff member deleted!');
    }
}

function editStaff(id) {
    const staff = staffData.find(s => s.id === id);
    if (staff) {
        document.getElementById('staffName').value = staff.name;
        document.getElementById('staffPosition').value = staff.position;
        document.getElementById('staffSalary').value = staff.salary;
        document.getElementById('staffStatus').value = staff.status;
        deleteStaff(id);
    }
}

function generatePayrollReport() {
    if (staffData.length === 0) {
        alert('No staff members to generate report');
        return;
    }

    const totalPayroll = staffData.reduce((sum, staff) => sum + staff.salary, 0);
    const report = `
PAYROLL REPORT - ${new Date().toLocaleDateString()}
================================================

Total Staff: ${staffData.length}
Total Monthly Payroll: ₦${totalPayroll.toLocaleString()}

Staff Details:
${staffData.map(s => `${s.name} (${s.position}) - ₦${s.salary.toLocaleString()}`).join('\n')}
    `;

    alert(report);
    // In production, generate PDF or download
}

// ============================================
// ROOM ADVERTISEMENTS MANAGEMENT
// ============================================

function handleAddRoomAd(e) {
    e.preventDefault();

    const newAd = {
        id: Date.now(),
        title: document.getElementById('roomTitle').value,
        location: document.getElementById('roomLocation').value,
        price: parseFloat(document.getElementById('roomPrice').value),
        type: document.getElementById('roomType').value,
        description: document.getElementById('roomDescription').value,
        status: document.getElementById('roomStatus').value,
        datePosted: new Date().toLocaleDateString(),
        views: 0,
        inquiries: 0
    };

    roomAdsData.push(newAd);
    localStorage.setItem('roomAdsData', JSON.stringify(roomAdsData));
    
    e.target.reset();
    loadRoomAdsData();
    updateDashboard();
    alert('Room advertisement posted successfully!');
}

function loadRoomAdsData() {
    const roomAdsList = document.getElementById('roomAdsList');
    if (!roomAdsList) return;

    if (roomAdsData.length === 0) {
        roomAdsList.innerHTML = '<p class="empty-message">No room advertisements yet</p>';
        return;
    }

    let html = '';
    roomAdsData.forEach(ad => {
        const statusClass = `status-${ad.status}`;
        html += `
            <div class="list-item">
                <div class="item-info">
                    <h4>${ad.title}</h4>
                    <p><strong>Location:</strong> ${ad.location} | <strong>Price:</strong> ₦${ad.price.toLocaleString()}/month</p>
                    <p><strong>Type:</strong> ${ad.type} | <strong>Status:</strong> <span class="${statusClass}">${ad.status}</span></p>
                    <p><strong>Views:</strong> ${ad.views} | <strong>Inquiries:</strong> ${ad.inquiries}</p>
                </div>
                <div class="item-actions">
                    <button class="btn-edit" onclick="editRoomAd(${ad.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteRoomAd(${ad.id})">Delete</button>
                </div>
            </div>
        `;
    });

    roomAdsList.innerHTML = html;
}

function deleteRoomAd(id) {
    if (confirm('Are you sure you want to delete this advertisement?')) {
        roomAdsData = roomAdsData.filter(ad => ad.id !== id);
        localStorage.setItem('roomAdsData', JSON.stringify(roomAdsData));
        loadRoomAdsData();
        updateDashboard();
        alert('Advertisement deleted!');
    }
}

function editRoomAd(id) {
    const ad = roomAdsData.find(a => a.id === id);
    if (ad) {
        document.getElementById('roomTitle').value = ad.title;
        document.getElementById('roomLocation').value = ad.location;
        document.getElementById('roomPrice').value = ad.price;
        document.getElementById('roomType').value = ad.type;
        document.getElementById('roomDescription').value = ad.description;
        document.getElementById('roomStatus').value = ad.status;
        deleteRoomAd(id);
    }
}

function downloadAdsList() {
    if (roomAdsData.length === 0) {
        alert('No advertisements to download');
        return;
    }

    let csv = 'Title,Location,Price,Type,Status,Date Posted\n';
    roomAdsData.forEach(ad => {
        csv += `"${ad.title}","${ad.location}",${ad.price},"${ad.type}","${ad.status}","${ad.datePosted}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'room_ads_list.csv';
    a.click();
}

// ============================================
// VACANCY MANAGEMENT
// ============================================

function handleAddVacancy(e) {
    e.preventDefault();

    const newVacancy = {
        id: Date.now(),
        title: document.getElementById('vacancyTitle').value,
        department: document.getElementById('vacancyDepartment').value,
        salary: parseFloat(document.getElementById('vacancySalary').value),
        requirements: document.getElementById('vacancyRequirements').value,
        status: document.getElementById('vacancyStatus').value,
        datePosted: new Date().toLocaleDateString(),
        applicants: 0
    };

    vacanciesData.push(newVacancy);
    localStorage.setItem('vacanciesData', JSON.stringify(vacanciesData));
    
    e.target.reset();
    loadVacanciesData();
    updateDashboard();
    alert('Vacancy posted successfully!');
}

function loadVacanciesData() {
    const vacanciesList = document.getElementById('vacanciesList');
    if (!vacanciesList) return;

    if (vacanciesData.length === 0) {
        vacanciesList.innerHTML = '<p class="empty-message">No vacancies posted yet</p>';
        return;
    }

    let html = '';
    vacanciesData.forEach(vacancy => {
        const statusClass = `status-${vacancy.status}`;
        html += `
            <div class="list-item">
                <div class="item-info">
                    <h4>${vacancy.title}</h4>
                    <p><strong>Department:</strong> ${vacancy.department} | <strong>Salary:</strong> ₦${vacancy.salary.toLocaleString()}</p>
                    <p><strong>Status:</strong> <span class="${statusClass}">${vacancy.status}</span> | <strong>Applicants:</strong> ${vacancy.applicants}</p>
                </div>
                <div class="item-actions">
                    <button class="btn-edit" onclick="editVacancy(${vacancy.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteVacancy(${vacancy.id})">Delete</button>
                </div>
            </div>
        `;
    });

    vacanciesList.innerHTML = html;

    // Update vacancy statistics
    const openCount = vacanciesData.filter(v => v.status === 'open').length;
    const filledCount = vacanciesData.filter(v => v.status === 'filled').length;
    const totalApplicants = vacanciesData.reduce((sum, v) => sum + v.applicants, 0);

    document.getElementById('openPositions').textContent = openCount;
    document.getElementById('filledPositions').textContent = filledCount;
    document.getElementById('totalApplicants').textContent = totalApplicants;
}

function deleteVacancy(id) {
    if (confirm('Are you sure you want to delete this vacancy?')) {
        vacanciesData = vacanciesData.filter(v => v.id !== id);
        localStorage.setItem('vacanciesData', JSON.stringify(vacanciesData));
        loadVacanciesData();
        updateDashboard();
        alert('Vacancy deleted!');
    }
}

function editVacancy(id) {
    const vacancy = vacanciesData.find(v => v.id === id);
    if (vacancy) {
        document.getElementById('vacancyTitle').value = vacancy.title;
        document.getElementById('vacancyDepartment').value = vacancy.department;
        document.getElementById('vacancySalary').value = vacancy.salary;
        document.getElementById('vacancyRequirements').value = vacancy.requirements;
        document.getElementById('vacancyStatus').value = vacancy.status;
        deleteVacancy(id);
    }
}

// ============================================
// SETTINGS
// ============================================

function loadCompanySettings() {
    document.getElementById('companyName').value = companySettings.name;
    document.getElementById('companyAddress').value = companySettings.address;
    document.getElementById('companyPhone').value = companySettings.phone;
    document.getElementById('companyEmail').value = companySettings.email;
}

function handleSaveCompanySettings(e) {
    e.preventDefault();

    companySettings = {
        name: document.getElementById('companyName').value,
        address: document.getElementById('companyAddress').value,
        phone: document.getElementById('companyPhone').value,
        email: document.getElementById('companyEmail').value
    };

    localStorage.setItem('companySettings', JSON.stringify(companySettings));
    alert('Company settings saved successfully!');
}

function handleChangePassword(e) {
    e.preventDefault();

    const currentPassword = document.getElementById('adminPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        alert('New passwords do not match');
        return;
    }

    if (newPassword.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }

    // In production, verify current password and hash
    alert('Password changed successfully!');
    e.target.reset();
}

function toggleDarkMode(e) {
    if (e.target.checked) {
        document.body.style.backgroundColor = '#1a1a1a';
        localStorage.setItem('darkMode', 'true');
    } else {
        document.body.style.backgroundColor = '#f5f6fa';
        localStorage.setItem('darkMode', 'false');
    }
}

function backupData() {
    const backup = {
        staff: staffData,
        roomAds: roomAdsData,
        vacancies: vacanciesData,
        settings: companySettings,
        timestamp: new Date().toLocaleString()
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ivory_backup_${Date.now()}.json`;
    a.click();
    alert('Backup created successfully!');
}

function resetDashboard() {
    if (confirm('This will delete ALL data. Are you sure?')) {
        if (confirm('This action cannot be undone. Are you absolutely sure?')) {
            localStorage.removeItem('staffData');
            localStorage.removeItem('roomAdsData');
            localStorage.removeItem('vacanciesData');
            
            staffData = [];
            roomAdsData = [];
            vacanciesData = [];
            
            loadAllData();
            updateDashboard();
            alert('Dashboard has been reset!');
        }
    }
}

// ============================================
// DASHBOARD UPDATE
// ============================================

function updateDashboard() {
    const totalPayroll = staffData.reduce((sum, staff) => sum + staff.salary, 0);
    const activeAds = roomAdsData.filter(ad => ad.status === 'active').length;
    const totalRooms = roomAdsData.length;
    const vacancyRate = totalRooms > 0 ? ((roomAdsData.filter(ad => ad.status === 'active').length / totalRooms) * 100).toFixed(1) : 0;

    document.getElementById('activeStaffCount').textContent = staffData.length;
    document.getElementById('totalPayroll').textContent = `₦${totalPayroll.toLocaleString()}`;
    document.getElementById('activeAdsCount').textContent = activeAds;
    document.getElementById('vacancyRate').textContent = `${vacancyRate}%`;

    updateRecentPayroll();
    updateRecentAds();
    updateOccupancyChart();
}

function updateRecentPayroll() {
    const recentPayrollList = document.getElementById('recentPayrollList');
    if (!recentPayrollList) return;

    const recent = staffData.slice(-3).reverse();
    if (recent.length === 0) {
        recentPayrollList.innerHTML = '<p class="empty-message">No payroll entries yet</p>';
        return;
    }

    let html = '';
    recent.forEach(staff => {
        html += `
            <div class="list-item">
                <div class="item-info">
                    <h4>${staff.name}</h4>
                    <p>${staff.position} - ₦${staff.salary.toLocaleString()}</p>
                </div>
            </div>
        `;
    });
    recentPayrollList.innerHTML = html;
}

function updateRecentAds() {
    const recentAdsList = document.getElementById('recentAdsList');
    if (!recentAdsList) return;

    const recent = roomAdsData.slice(-3).reverse();
    if (recent.length === 0) {
        recentAdsList.innerHTML = '<p class="empty-message">No room ads yet</p>';
        return;
    }

    let html = '';
    recent.forEach(ad => {
        html += `
            <div class="list-item">
                <div class="item-info">
                    <h4>${ad.title}</h4>
                    <p>${ad.location} - ₦${ad.price.toLocaleString()}</p>
                </div>
            </div>
        `;
    });
    recentAdsList.innerHTML = html;
}

function updateOccupancyChart() {
    const chart = document.getElementById('occupancyChart');
    if (!chart) return;

    const totalRooms = roomAdsData.length;
    const activeRooms = roomAdsData.filter(ad => ad.status === 'active').length;
    const rentedRooms = roomAdsData.filter(ad => ad.status === 'sold').length;

    const chartHTML = `
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; width: 100%;">
            <div style="text-align: center;">
                <div style="font-size: 2rem; color: var(--accent-color); font-weight: bold;">${totalRooms}</div>
                <div>Total Rooms</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 2rem; color: var(--success-color); font-weight: bold;">${activeRooms}</div>
                <div>Available</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 2rem; color: var(--warning-color); font-weight: bold;">${rentedRooms}</div>
                <div>Rented</div>
            </div>
        </div>
    `;
    chart.innerHTML = chartHTML;
}

// ============================================
// PAGE NAVIGATION
// ============================================

function switchPage(pageName, event) {
    event.preventDefault();

    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Remove active class from all menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });

    // Show selected page
    document.getElementById(pageName + 'Page').classList.add('active');
    
    // Add active class to clicked menu item
    event.target.classList.add('active');
}

// ============================================
// MODAL FUNCTIONS
// ============================================

function openPayrollForm() {
    document.getElementById('payrollForm').reset();
    switchPage('payroll', { target: document.querySelector('[onclick*="payroll"]') || { classList: { add: () => {} } } });
}

function openRoomAdForm() {
    document.getElementById('roomAdForm').reset();
    switchPage('rooms', { target: document.querySelector('[onclick*="rooms"]') || { classList: { add: () => {} } } });
}

function openVacancyForm() {
    document.getElementById('vacancyForm').reset();
    switchPage('vacancy', { target: document.querySelector('[onclick*="vacancy"]') || { classList: { add: () => {} } } });
}

function logoutAdmin() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('adminLoggedIn');
        window.location.href = 'index.html';
    }
}
