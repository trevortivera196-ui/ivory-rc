// ============================================
// PAYMENT PAGE SCRIPT
// ============================================

// API Base URL
const PAYMENT_API_URL = window.location.origin + '/api/payment-api.php';

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    setupPaymentListeners();
    updatePaymentSummary();
});

// Setup payment form listeners
function setupPaymentListeners() {
    // M-Pesa form listeners
    document.getElementById('mpesaAmount').addEventListener('input', updatePaymentSummary);
    document.getElementById('mpesaPaymentType').addEventListener('change', updatePaymentSummary);

    // Card form listeners
    document.getElementById('cardAmount').addEventListener('input', updatePaymentSummary);
    document.getElementById('cardPaymentType').addEventListener('change', updatePaymentSummary);
    document.getElementById('cardNumber').addEventListener('input', formatCardNumber);
    document.getElementById('cardExpiry').addEventListener('input', formatExpiry);
    document.getElementById('cardCVV').addEventListener('input', formatCVV);

    // Bank form listeners
    document.getElementById('bankAmount').addEventListener('input', updatePaymentSummary);
    document.getElementById('bankPaymentType').addEventListener('change', updatePaymentSummary);

    // Cash form listeners
    document.getElementById('cashAmount').addEventListener('input', updatePaymentSummary);
    document.getElementById('cashPaymentType').addEventListener('change', updatePaymentSummary);
}

// Select payment method
function selectPaymentMethod(method) {
    // Update active tab
    document.querySelectorAll('.method-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');

    // Hide all forms
    document.querySelectorAll('.payment-form').forEach(form => form.classList.remove('active'));

    // Show selected form
    const formId = method + 'Form';
    document.getElementById(formId).classList.add('active');

    // Update summary
    updatePaymentSummary();
}

// Update payment summary
function updatePaymentSummary() {
    const activeForm = document.querySelector('.payment-form.active');
    
    let amount = 0;
    let paymentType = '';
    let method = '';

    if (activeForm.id === 'mpesaForm') {
        amount = parseFloat(document.getElementById('mpesaAmount').value) || 0;
        paymentType = document.getElementById('mpesaPaymentType').value || 'Not selected';
        method = 'M-Pesa';
    } else if (activeForm.id === 'cardForm') {
        amount = parseFloat(document.getElementById('cardAmount').value) || 0;
        paymentType = document.getElementById('cardPaymentType').value || 'Not selected';
        method = 'Card';
    } else if (activeForm.id === 'bankForm') {
        amount = parseFloat(document.getElementById('bankAmount').value) || 0;
        paymentType = document.getElementById('bankPaymentType').value || 'Not selected';
        method = 'Bank Transfer';
    } else if (activeForm.id === 'cashForm') {
        amount = parseFloat(document.getElementById('cashAmount').value) || 0;
        paymentType = document.getElementById('cashPaymentType').value || 'Not selected';
        method = 'Cash';
    }

    // Get payment type label
    let typeLabel = 'Not selected';
    if (paymentType === 'rent') typeLabel = '🏠 Rent Payment';
    else if (paymentType === 'deposit') typeLabel = '💰 Security Deposit';
    else if (paymentType === 'utilities') typeLabel = '⚡ Utilities';
    else if (paymentType === 'other') typeLabel = '📋 Other';

    // Update summary display
    document.getElementById('summaryAmount').textContent = formatCurrency(amount);
    document.getElementById('summaryType').textContent = typeLabel;
    document.getElementById('summaryMethod').textContent = method;
    document.getElementById('summaryTotal').textContent = formatCurrency(amount);
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 2
    }).format(amount);
}

// Format card number
function formatCardNumber(e) {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
}

// Format expiry date
function formatExpiry(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
}

// Format CVV
function formatCVV(e) {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
}

// Update payment type info
function updatePaymentTypeInfo() {
    updatePaymentSummary();
}

// Handle M-Pesa payment
async function handleMpesaPayment(e) {
    e.preventDefault();

    if (!currentUser) {
        showLoginModal();
        return;
    }

    const amount = parseFloat(document.getElementById('mpesaAmount').value);
    const paymentType = document.getElementById('mpesaPaymentType').value;
    const phone = '254' + document.getElementById('mpesaPhone').value;
    const description = document.getElementById('mpesaDescription').value;

    // Validate inputs
    if (!amount || amount < 1) {
        alert('Please enter a valid amount');
        return;
    }

    if (!paymentType) {
        alert('Please select a payment type');
        return;
    }

    showLoadingSpinner();

    try {
        const response = await apiCall(PAYMENT_API_URL + '?action=initiate', 'POST', {
            amount: amount,
            currency: 'KES',
            payment_type: paymentType,
            payment_method: 'mpesa',
            phone: phone,
            description: description
        });

        hideLoadingSpinner();

        if (response.success) {
            // Show success modal
            document.getElementById('transactionId').textContent = response.data.transaction_id;
            document.getElementById('confirmAmount').textContent = formatCurrency(amount);
            document.getElementById('confirmStatus').textContent = 'Pending';
            document.getElementById('successMessage').textContent = 
                'You will receive an M-Pesa prompt shortly. Please enter your M-Pesa PIN to complete the payment.';

            document.getElementById('successModal').classList.add('active');

            // Reset form
            document.getElementById('mpesaForm').reset();
            updatePaymentSummary();
        } else {
            showErrorModal(response.message);
        }
    } catch (error) {
        hideLoadingSpinner();
        showErrorModal('Error: ' + error.message);
    }
}

// Handle card payment
async function handleCardPayment(e) {
    e.preventDefault();

    if (!currentUser) {
        showLoginModal();
        return;
    }

    const amount = parseFloat(document.getElementById('cardAmount').value);
    const paymentType = document.getElementById('cardPaymentType').value;
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const cardExpiry = document.getElementById('cardExpiry').value;
    const cardCVV = document.getElementById('cardCVV').value;

    // Validate inputs
    if (!amount || amount < 1) {
        alert('Please enter a valid amount');
        return;
    }

    if (!paymentType) {
        alert('Please select a payment type');
        return;
    }

    if (cardNumber.length !== 16) {
        alert('Please enter a valid card number');
        return;
    }

    if (!cardExpiry.match(/^\d{2}\/\d{2}$/)) {
        alert('Please enter expiry date in MM/YY format');
        return;
    }

    if (cardCVV.length < 3 || cardCVV.length > 4) {
        alert('Please enter a valid CVV');
        return;
    }

    showLoadingSpinner();

    try {
        const response = await apiCall(PAYMENT_API_URL + '?action=initiate', 'POST', {
            amount: amount,
            currency: 'KES',
            payment_type: paymentType,
            payment_method: 'card',
            phone: currentUser.email, // Using email as identifier for card
            description: 'Card payment - ' + cardNumber.slice(-4)
        });

        hideLoadingSpinner();

        if (response.success) {
            document.getElementById('transactionId').textContent = response.data.transaction_id;
            document.getElementById('confirmAmount').textContent = formatCurrency(amount);
            document.getElementById('confirmStatus').textContent = 'Processing';
            document.getElementById('successMessage').textContent = 
                'Your card payment has been submitted for processing. You will receive a confirmation email shortly.';

            document.getElementById('successModal').classList.add('active');
            document.getElementById('cardForm').reset();
            updatePaymentSummary();
        } else {
            showErrorModal(response.message);
        }
    } catch (error) {
        hideLoadingSpinner();
        showErrorModal('Error: ' + error.message);
    }
}

// Handle bank transfer
async function handleBankTransfer(e) {
    e.preventDefault();

    if (!currentUser) {
        showLoginModal();
        return;
    }

    const amount = parseFloat(document.getElementById('bankAmount').value);
    const paymentType = document.getElementById('bankPaymentType').value;
    const reference = document.getElementById('bankReference').value;

    // Validate inputs
    if (!amount || amount < 1) {
        alert('Please enter a valid amount');
        return;
    }

    if (!paymentType) {
        alert('Please select a payment type');
        return;
    }

    if (!reference.trim()) {
        alert('Please enter a reference/narration');
        return;
    }

    showLoadingSpinner();

    try {
        const response = await apiCall(PAYMENT_API_URL + '?action=initiate', 'POST', {
            amount: amount,
            currency: 'KES',
            payment_type: paymentType,
            payment_method: 'bank',
            phone: currentUser.email,
            description: reference
        });

        hideLoadingSpinner();

        if (response.success) {
            document.getElementById('transactionId').textContent = response.data.transaction_id;
            document.getElementById('confirmAmount').textContent = formatCurrency(amount);
            document.getElementById('confirmStatus').textContent = 'Pending';
            document.getElementById('successMessage').textContent = 
                'Bank transfer request submitted. Please complete the transfer within 24 hours using the reference number provided.';

            document.getElementById('successModal').classList.add('active');
            document.getElementById('bankForm').reset();
            updatePaymentSummary();
        } else {
            showErrorModal(response.message);
        }
    } catch (error) {
        hideLoadingSpinner();
        showErrorModal('Error: ' + error.message);
    }
}

// Handle cash payment
async function handleCashPayment(e) {
    e.preventDefault();

    if (!currentUser) {
        showLoginModal();
        return;
    }

    const amount = parseFloat(document.getElementById('cashAmount').value);
    const paymentType = document.getElementById('cashPaymentType').value;
    const description = document.getElementById('cashDescription').value;

    // Validate inputs
    if (!amount || amount < 1) {
        alert('Please enter a valid amount');
        return;
    }

    if (!paymentType) {
        alert('Please select a payment type');
        return;
    }

    showLoadingSpinner();

    try {
        const response = await apiCall(PAYMENT_API_URL + '?action=initiate', 'POST', {
            amount: amount,
            currency: 'KES',
            payment_type: paymentType,
            payment_method: 'cash',
            phone: currentUser.email,
            description: description || 'Cash payment'
        });

        hideLoadingSpinner();

        if (response.success) {
            document.getElementById('transactionId').textContent = response.data.transaction_id;
            document.getElementById('confirmAmount').textContent = formatCurrency(amount);
            document.getElementById('confirmStatus').textContent = 'Scheduled';
            document.getElementById('successMessage').textContent = 
                'Cash payment request submitted. Please visit our office during business hours (9:00 AM - 5:00 PM, Monday-Friday) to complete the payment.';

            document.getElementById('successModal').classList.add('active');
            document.getElementById('cashForm').reset();
            updatePaymentSummary();
        } else {
            showErrorModal(response.message);
        }
    } catch (error) {
        hideLoadingSpinner();
        showErrorModal('Error: ' + error.message);
    }
}

// Show success modal
function showSuccessModal(message) {
    document.getElementById('successMessage').textContent = message;
    document.getElementById('successModal').classList.add('active');
}

// Close success modal
function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('active');
}

// Show error modal
function showErrorModal(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorModal').classList.add('active');
}

// Close error modal
function closeErrorModal() {
    document.getElementById('errorModal').classList.remove('active');
}

// Show loading spinner
function showLoadingSpinner() {
    document.getElementById('loadingSpinner').classList.add('active');
}

// Hide loading spinner
function hideLoadingSpinner() {
    document.getElementById('loadingSpinner').classList.remove('active');
}

// Download receipt
function downloadReceipt() {
    const transactionId = document.getElementById('transactionId').textContent;
    const amount = document.getElementById('confirmAmount').textContent;
    const date = new Date().toLocaleDateString();

    let receiptContent = `
IVORY APARTMENT - PAYMENT RECEIPT
=====================================
Transaction ID: ${transactionId}
Date: ${date}
Amount: ${amount}

Thank you for your payment!

For support, contact: payments@ivoryapartment.com
`;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(receiptContent));
    element.setAttribute('download', `receipt-${transactionId}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Toggle mobile menu
function toggleMobileMenu() {
    const menu = document.getElementById('navMenu');
    const hamburger = document.querySelector('.hamburger');
    menu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Close menu
function closeMenu() {
    const menu = document.getElementById('navMenu');
    const hamburger = document.querySelector('.hamburger');
    menu.classList.remove('active');
    hamburger.classList.remove('active');
}

// Go home
function goHome() {
    window.location.href = 'index.html';
}

// Login modal functions
function showLoginModal() {
    document.getElementById('loginModal').classList.add('active');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(tabName + 'Form').classList.add('active');
    event.target.classList.add('active');
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
            if (response.status === 401) {
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

// Get auth token
function getAuthToken() {
    return sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
}

// Check auth status
function checkAuthStatus() {
    const token = getAuthToken();
    if (token) {
        apiCall(window.location.origin + '/api/auth-api.php?action=verify-token', 'POST')
            .then(response => {
                if (response.success) {
                    currentUser = response.data;
                    showUserMenu();
                } else {
                    sessionStorage.removeItem('auth_token');
                    localStorage.removeItem('auth_token');
                    currentUser = null;
                    showLoginLink();
                }
            })
            .catch(error => {
                sessionStorage.removeItem('auth_token');
                localStorage.removeItem('auth_token');
                currentUser = null;
                showLoginLink();
            });
    } else {
        currentUser = null;
        showLoginLink();
    }
}

// Show user menu
function showUserMenu() {
    const userDisplay = document.getElementById('userDisplay');
    if (currentUser) {
        const userName = currentUser.name ? currentUser.name.split(' ')[0] : 'User';
        userDisplay.innerHTML = `
            <span style="margin-right: 1rem;">👤 ${userName}</span>
            <a href="javascript:logout()" style="color: white; text-decoration: none;">Logout</a>
        `;
    }
}

// Show login link
function showLoginLink() {
    const userDisplay = document.getElementById('userDisplay');
    userDisplay.innerHTML = '<a href="javascript:showLoginModal()" id="loginLink">🔐 Login</a>';
}

// Logout
async function logout() {
    if (confirm('Are you sure you want to logout?')) {
        try {
            await apiCall(window.location.origin + '/api/auth-api.php?action=logout', 'POST');
        } catch (error) {
            console.error('Logout error:', error);
        }

        sessionStorage.removeItem('auth_token');
        localStorage.removeItem('auth_token');
        currentUser = null;
        checkAuthStatus();
        alert('You have been logged out.');
        window.location.href = 'index.html';
    }
}
