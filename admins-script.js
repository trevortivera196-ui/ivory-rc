// ============================================
// ADMINS MANAGEMENT SYSTEM
// ============================================

// Admin data storage
let adminsData = JSON.parse(localStorage.getItem('adminsData')) || [];
let adminUser = JSON.parse(localStorage.getItem('currentAdminUser')) || {
    name: 'Admin User',
    email: 'admin@ivoryapartment.com',
    role: 'super-admin'
};

let deleteTargetId = null;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    checkAdminAccess();
    setupFormListeners();
    loadAllAdmins();
    addDefaultAdmins();
    updateStatistics();
});

// Check admin access
function checkAdminAccess() {
    const isAdmin = sessionStorage.getItem('adminLoggedIn');
    if (!isAdmin) {
        window.location.href = 'admin-login.html';
    }
    document.getElementById('adminUserDisplay').textContent = `👤 ${adminUser.name}`;
}

// Setup form listeners
function setupFormListeners() {
    const adminForm = document.getElementById('adminForm');
    if (adminForm) {
        adminForm.addEventListener('submit', handleAddAdmin);
    }

    const editAdminForm = document.getElementById('editAdminForm');
    if (editAdminForm) {
        editAdminForm.addEventListener('submit', handleEditAdmin);
    }
}

// ============================================
// ADD DEFAULT ADMINS
// ============================================

function addDefaultAdmins() {
    // Check if default admins already exist
    if (adminsData.some(a => a.email === 'admin@ivoryapartment.com')) {
        return; // Default admins already added
    }

    const defaultAdmins = [
        {
            id: Date.now(),
            name: 'Admin User',
            email: 'admin@ivoryapartment.com',
            password: 'admin123',
            phone: '+234 (0) 123 456 7890',
            role: 'super-admin',
            department: 'Management',
            status: 'active',
            dateAdded: new Date().toLocaleDateString(),
            lastLogin: 'Today'
        },
        {
            id: Date.now() + 1,
            name: 'John Manager',
            email: 'john@ivoryapartment.com',
            password: 'john123',
            phone: '+234 (0) 987 654 3210',
            role: 'admin',
            department: 'Operations',
            status: 'active',
            dateAdded: new Date().toLocaleDateString(),
            lastLogin: 'Today'
        },
        {
            id: Date.now() + 2,
            name: 'Sarah Finance',
            email: 'sarah@ivoryapartment.com',
            password: 'sarah123',
            phone: '+234 (0) 456 789 0123',
            role: 'manager',
            department: 'Finance',
            status: 'active',
            dateAdded: new Date().toLocaleDateString(),
            lastLogin: 'Yesterday'
        }
    ];

    adminsData = defaultAdmins;
    localStorage.setItem('adminsData', JSON.stringify(adminsData));
}

// ============================================
// ADD ADMIN
// ============================================

function handleAddAdmin(e) {
    e.preventDefault();

    const name = document.getElementById('adminName').value.trim();
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    const phone = document.getElementById('adminPhone').value.trim();
    const role = document.getElementById('adminRole').value;
    const department = document.getElementById('adminDepartment').value || 'Management';
    const status = document.getElementById('adminStatus').value;

    // Validation
    if (!name || !email || !password || !role) {
        alert('Please fill in all required fields');
        return;
    }

    // Check if email already exists
    if (adminsData.some(a => a.email === email)) {
        alert('Email already exists. Please use a different email.');
        return;
    }

    // Check password strength
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }

    const newAdmin = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        phone: phone,
        role: role,
        department: department,
        status: status,
        dateAdded: new Date().toLocaleDateString(),
        lastLogin: 'Never'
    };

    adminsData.push(newAdmin);
    localStorage.setItem('adminsData', JSON.stringify(adminsData));

    e.target.reset();
    loadAllAdmins();
    updateStatistics();
    alert('Admin added successfully!');
}

// ============================================
// LOAD AND DISPLAY ADMINS
// ============================================

function loadAllAdmins() {
    const adminsList = document.getElementById('adminsList');
    if (!adminsList) return;

    if (adminsData.length === 0) {
        adminsList.innerHTML = '<p class="empty-message">No admins found. Add your first admin above.</p>';
        return;
    }

    let html = '<table class="table"><thead><tr>';
    html += '<th>Name</th>';
    html += '<th>Email</th>';
    html += '<th>Role</th>';
    html += '<th>Department</th>';
    html += '<th>Status</th>';
    html += '<th>Actions</th>';
    html += '</tr></thead><tbody>';

    adminsData.forEach(admin => {
        const roleClass = `role-${admin.role}`;
        const statusClass = `status-${admin.status}`;
        
        html += `<tr>
            <td data-label="Name">${admin.name}</td>
            <td data-label="Email">${admin.email}</td>
            <td data-label="Role"><span class="role-badge ${roleClass}">${formatRole(admin.role)}</span></td>
            <td data-label="Department">${admin.department || 'N/A'}</td>
            <td data-label="Status"><span class="status-badge ${statusClass}">${admin.status}</span></td>
            <td data-label="Actions" style="display: flex; gap: 0.5rem;">
                <button class="btn-edit" onclick="editAdmin(${admin.id})">✏️ Edit</button>
                <button class="btn-delete" onclick="deleteAdmin(${admin.id})">🗑️ Delete</button>
            </td>
        </tr>`;
    });

    html += '</tbody></table>';
    adminsList.innerHTML = html;
}

// Format role display
function formatRole(role) {
    const roles = {
        'super-admin': 'Super Admin',
        'admin': 'Admin',
        'manager': 'Manager',
        'operator': 'Operator'
    };
    return roles[role] || role;
}

// ============================================
// EDIT ADMIN
// ============================================

function editAdmin(adminId) {
    const admin = adminsData.find(a => a.id === adminId);
    
    if (!admin) {
        alert('Admin not found');
        return;
    }

    // Populate edit form
    document.getElementById('editAdminId').value = admin.id;
    document.getElementById('editAdminName').value = admin.name;
    document.getElementById('editAdminEmail').value = admin.email;
    document.getElementById('editAdminPhone').value = admin.phone;
    document.getElementById('editAdminRole').value = admin.role;
    document.getElementById('editAdminDepartment').value = admin.department;
    document.getElementById('editAdminStatus').value = admin.status;

    // Open modal
    document.getElementById('editAdminModal').classList.add('active');
}

function handleEditAdmin(e) {
    e.preventDefault();

    const adminId = parseInt(document.getElementById('editAdminId').value);
    const admin = adminsData.find(a => a.id === adminId);

    if (!admin) {
        alert('Admin not found');
        return;
    }

    // Update admin info
    admin.name = document.getElementById('editAdminName').value.trim();
    admin.email = document.getElementById('editAdminEmail').value.trim();
    admin.phone = document.getElementById('editAdminPhone').value.trim();
    admin.role = document.getElementById('editAdminRole').value;
    admin.department = document.getElementById('editAdminDepartment').value;
    admin.status = document.getElementById('editAdminStatus').value;

    localStorage.setItem('adminsData', JSON.stringify(adminsData));
    closeEditModal();
    loadAllAdmins();
    updateStatistics();
    alert('Admin updated successfully!');
}

function closeEditModal() {
    document.getElementById('editAdminModal').classList.remove('active');
    document.getElementById('editAdminForm').reset();
}

// ============================================
// DELETE ADMIN
// ============================================

function deleteAdmin(adminId) {
    const admin = adminsData.find(a => a.id === adminId);
    
    if (!admin) {
        alert('Admin not found');
        return;
    }

    // Don't allow deleting yourself
    if (admin.email === adminUser.email) {
        alert('You cannot delete your own account');
        return;
    }

    deleteTargetId = adminId;
    document.getElementById('deleteMessage').textContent = `Are you sure you want to delete ${admin.name}? This action cannot be undone.`;
    document.getElementById('deleteConfirmModal').classList.add('active');
}

function confirmDelete() {
    if (deleteTargetId === null) return;

    adminsData = adminsData.filter(a => a.id !== deleteTargetId);
    localStorage.setItem('adminsData', JSON.stringify(adminsData));

    document.getElementById('deleteConfirmModal').classList.remove('active');
    deleteTargetId = null;

    loadAllAdmins();
    updateStatistics();
    alert('Admin deleted successfully!');
}

function cancelDelete() {
    document.getElementById('deleteConfirmModal').classList.remove('active');
    deleteTargetId = null;
}

// ============================================
// FILTER ADMINS
// ============================================

function filterAdmins() {
    const searchTerm = document.getElementById('searchAdmin').value.toLowerCase();
    const roleFilter = document.getElementById('filterRole').value;
    const statusFilter = document.getElementById('filterStatus').value;

    let filtered = adminsData.filter(admin => {
        const matchesSearch = admin.name.toLowerCase().includes(searchTerm) ||
                            admin.email.toLowerCase().includes(searchTerm);
        const matchesRole = !roleFilter || admin.role === roleFilter;
        const matchesStatus = !statusFilter || admin.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    });

    displayFilteredAdmins(filtered);
}

function displayFilteredAdmins(filtered) {
    const adminsList = document.getElementById('adminsList');
    
    if (filtered.length === 0) {
        adminsList.innerHTML = '<p class="empty-message">No admins match your search criteria.</p>';
        return;
    }

    let html = '<table class="table"><thead><tr>';
    html += '<th>Name</th>';
    html += '<th>Email</th>';
    html += '<th>Role</th>';
    html += '<th>Department</th>';
    html += '<th>Status</th>';
    html += '<th>Actions</th>';
    html += '</tr></thead><tbody>';

    filtered.forEach(admin => {
        const roleClass = `role-${admin.role}`;
        const statusClass = `status-${admin.status}`;
        
        html += `<tr>
            <td data-label="Name">${admin.name}</td>
            <td data-label="Email">${admin.email}</td>
            <td data-label="Role"><span class="role-badge ${roleClass}">${formatRole(admin.role)}</span></td>
            <td data-label="Department">${admin.department || 'N/A'}</td>
            <td data-label="Status"><span class="status-badge ${statusClass}">${admin.status}</span></td>
            <td data-label="Actions" style="display: flex; gap: 0.5rem;">
                <button class="btn-edit" onclick="editAdmin(${admin.id})">✏️ Edit</button>
                <button class="btn-delete" onclick="deleteAdmin(${admin.id})">🗑️ Delete</button>
            </td>
        </tr>`;
    });

    html += '</tbody></table>';
    adminsList.innerHTML = html;
}

function resetFilters() {
    document.getElementById('searchAdmin').value = '';
    document.getElementById('filterRole').value = '';
    document.getElementById('filterStatus').value = '';
    loadAllAdmins();
}

// ============================================
// UPDATE STATISTICS
// ============================================

function updateStatistics() {
    const totalAdmins = adminsData.length;
    const activeAdmins = adminsData.filter(a => a.status === 'active').length;
    const inactiveAdmins = adminsData.filter(a => a.status === 'inactive').length;
    const superAdmins = adminsData.filter(a => a.role === 'super-admin').length;

    document.getElementById('totalAdmins').textContent = totalAdmins;
    document.getElementById('activeAdmins').textContent = activeAdmins;
    document.getElementById('inactiveAdmins').textContent = inactiveAdmins;
    document.getElementById('superAdmins').textContent = superAdmins;
}

// ============================================
// ADMIN LOGOUT
// ============================================

function logoutAdmin() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('adminLoggedIn');
        window.location.href = 'admin-login.html';
    }
}

// ============================================
// EXPORT ADMINS LIST
// ============================================

function exportAdminsList() {
    if (adminsData.length === 0) {
        alert('No admins to export');
        return;
    }

    let csv = 'Name,Email,Role,Department,Status,Date Added\n';
    adminsData.forEach(admin => {
        csv += `"${admin.name}","${admin.email}","${admin.role}","${admin.department}","${admin.status}","${admin.dateAdded}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admins_list_${Date.now()}.csv`;
    a.click();
}

// ============================================
// EXPORT ADMINS LIST AS JSON
// ============================================

function exportAdminsJSON() {
    if (adminsData.length === 0) {
        alert('No admins to export');
        return;
    }

    // Remove passwords from export for security
    const safeData = adminsData.map(admin => ({
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        department: admin.department,
        status: admin.status,
        dateAdded: admin.dateAdded,
        lastLogin: admin.lastLogin
    }));

    const blob = new Blob([JSON.stringify(safeData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admins_backup_${Date.now()}.json`;
    a.click();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Get admin by ID
function getAdminById(adminId) {
    return adminsData.find(a => a.id === adminId);
}

// Get admin by email
function getAdminByEmail(email) {
    return adminsData.find(a => a.email === email);
}

// Check if admin is super admin
function isSuperAdmin(adminId) {
    const admin = getAdminById(adminId);
    return admin && admin.role === 'super-admin';
}

// Check if admin is active
function isAdminActive(adminId) {
    const admin = getAdminById(adminId);
    return admin && admin.status === 'active';
}

// Get admin count by status
function getAdminCountByStatus(status) {
    return adminsData.filter(a => a.status === status).length;
}

// Get admin count by role
function getAdminCountByRole(role) {
    return adminsData.filter(a => a.role === role).length;
}

// Print admins list
function printAdminsList() {
    window.print();
}

// Close modal on outside click
window.onclick = function(event) {
    const editModal = document.getElementById('editAdminModal');
    const deleteModal = document.getElementById('deleteConfirmModal');
    
    if (event.target === editModal) {
        closeEditModal();
    }
    if (event.target === deleteModal) {
        cancelDelete();
    }
}
