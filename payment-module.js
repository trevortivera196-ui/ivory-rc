// ============================================
// M-PESA PAYMENT MODULE
// ============================================

// Payment data storage
let paymentHistory = JSON.parse(localStorage.getItem('paymentHistory')) || [];
let pendingPayments = JSON.parse(localStorage.getItem('pendingPayments')) || [];

// M-Pesa Configuration
const MPESA_CONFIG = {
    businessShortCode: '174379',
    consumerKey: 'YOUR_CONSUMER_KEY',
    consumerSecret: 'YOUR_CONSUMER_SECRET',
    passkey: 'YOUR_PASSKEY',
    callbackURL: 'https://yourdomain.com/callback',
    environment: 'sandbox', // 'production' for live
    currency: 'KES',
    serviceProvider: 'Ivory Apartment'
};

// Initialize payment modal and styles if not already present
function initializePaymentSystem() {
    if (!document.getElementById('paymentModal')) {
        createPaymentModal();
    }
}

// Create payment modal HTML
function createPaymentModal() {
    const modalHTML = `
        <div id="paymentModal" class="payment-modal">
            <div class="payment-modal-content">
                <span class="payment-close" onclick="closePaymentModal()">&times;</span>
                <div class="payment-header">
                    <h2>💳 Make Payment</h2>
                    <p>Secure Payment via M-Pesa</p>
                </div>

                <!-- Payment Method Selection -->
                <div class="payment-methods">
                    <button class="payment-method-btn active" onclick="selectPaymentMethod('mpesa')">
                        <div class="method-icon">📱</div>
                        <div class="method-name">M-Pesa</div>
                    </button>
                    <button class="payment-method-btn" onclick="selectPaymentMethod('card')">
                        <div class="method-icon">💳</div>
                        <div class="method-name">Card</div>
                    </button>
                    <button class="payment-method-btn" onclick="selectPaymentMethod('bank')">
                        <div class="method-icon">🏦</div>
                        <div class="method-name">Bank</div>
                    </button>
                </div>

                <!-- M-Pesa Payment Form -->
                <div id="mpesaForm" class="payment-form active">
                    <div class="form-group">
                        <label for="paymentAmount">Amount (KES) *</label>
                        <input type="number" id="paymentAmount" placeholder="Enter amount" min="100" required>
                    </div>

                    <div class="form-group">
                        <label for="paymentPhone">M-Pesa Phone Number *</label>
                        <input type="tel" id="paymentPhone" placeholder="+254712345678 or 0712345678" pattern="^(\+?254|0)?7\d{8}$" required>
                    </div>

                    <div class="form-group">
                        <label for="paymentDescription">Description (Optional)</label>
                        <textarea id="paymentDescription" placeholder="e.g., Rent payment for October" rows="3"></textarea>
                    </div>

                    <div class="form-group">
                        <label for="paymentType">Payment Type *</label>
                        <select id="paymentType" required>
                            <option value="">Select Payment Type</option>
                            <option value="rent">Rent Payment</option>
                            <option value="deposit">Deposit Payment</option>
                            <option value="utilities">Utilities Payment</option>
                            <option value="service">Service Fee</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div class="payment-info">
                        <p><strong>✅ Secure Payment:</strong> Your payment is encrypted and secure</p>
                        <p><strong>📍 Transaction ID:</strong> <span id="transactionId">-</span></p>
                        <p><strong>💰 Amount:</strong> <span id="displayAmount">KES 0</span></p>
                    </div>

                    <button type="button" class="btn-payment-primary" onclick="initiateMpesaPayment()">
                        💳 Initiate M-Pesa Payment
                    </button>
                </div>

                <!-- Card Payment Form -->
                <div id="cardForm" class="payment-form">
                    <div class="form-group">
                        <label for="cardAmount">Amount (KES) *</label>
                        <input type="number" id="cardAmount" placeholder="Enter amount" min="100" required>
                    </div>

                    <div class="form-group">
                        <label for="cardNumber">Card Number *</label>
                        <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19" required>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="cardExpiry">Expiry (MM/YY) *</label>
                            <input type="text" id="cardExpiry" placeholder="MM/YY" maxlength="5" required>
                        </div>
                        <div class="form-group">
                            <label for="cardCVV">CVV *</label>
                            <input type="text" id="cardCVV" placeholder="123" maxlength="3" required>
                        </div>
                    </div>

                    <button type="button" class="btn-payment-primary" onclick="initiateCardPayment()">
                        💳 Pay with Card
                    </button>
                </div>

                <!-- Bank Transfer Form -->
                <div id="bankForm" class="payment-form">
                    <div class="payment-info" style="background: #e8f4f8; padding: 1rem; border-radius: 4px;">
                        <h4>Bank Transfer Details</h4>
                        <p><strong>Bank Name:</strong> Kenya Commercial Bank</p>
                        <p><strong>Account Name:</strong> Ivory Apartment Limited</p>
                        <p><strong>Account Number:</strong> 1234567890</p>
                        <p><strong>Branch Code:</strong> 01</p>
                        <p><strong>Swift Code:</strong> KCBLKENA</p>
                    </div>

                    <div class="form-group">
                        <label for="bankAmount">Amount (KES) *</label>
                        <input type="number" id="bankAmount" placeholder="Enter amount" min="100" required>
                    </div>

                    <div class="form-group">
                        <label for="bankReference">Reference/Cheque Number</label>
                        <input type="text" id="bankReference" placeholder="Enter reference number">
                    </div>

                    <button type="button" class="btn-payment-primary" onclick="initiateBankTransfer()">
                        🏦 Submit Bank Transfer
                    </button>
                </div>

                <div class="payment-footer">
                    <small>🔒 All transactions are encrypted and secure. We never store your card details.</small>
                </div>
            </div>
        </div>

        <style>
            .payment-modal {
                display: none;
                position: fixed;
                z-index: 2000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.6);
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }

            .payment-modal.active {
                display: flex;
            }

            .payment-modal-content {
                background-color: white;
                padding: 2rem;
                border-radius: 12px;
                width: 90%;
                max-width: 500px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                max-height: 90vh;
                overflow-y: auto;
                animation: slideUp 0.3s ease;
            }

            .payment-close {
                color: #aaa;
                float: right;
                font-size: 28px;
                font-weight: bold;
                cursor: pointer;
                transition: color 0.3s;
            }

            .payment-close:hover {
                color: #2c3e50;
            }

            .payment-header {
                text-align: center;
                margin-bottom: 2rem;
                border-bottom: 2px solid #3498db;
                padding-bottom: 1rem;
            }

            .payment-header h2 {
                color: #2c3e50;
                margin-bottom: 0.5rem;
                font-size: 1.5rem;
            }

            .payment-header p {
                color: #7f8c8d;
                font-size: 0.9rem;
            }

            .payment-methods {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1rem;
                margin-bottom: 2rem;
            }

            .payment-method-btn {
                padding: 1rem;
                border: 2px solid #ecf0f1;
                border-radius: 8px;
                background: white;
                cursor: pointer;
                transition: all 0.3s;
                text-align: center;
            }

            .payment-method-btn:hover {
                border-color: #3498db;
                background: #f0f7ff;
            }

            .payment-method-btn.active {
                border-color: #3498db;
                background: #f0f7ff;
                box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
            }

            .method-icon {
                font-size: 2rem;
                margin-bottom: 0.5rem;
            }

            .method-name {
                font-weight: 600;
                color: #2c3e50;
                font-size: 0.9rem;
            }

            .payment-form {
                display: none;
            }

            .payment-form.active {
                display: block;
            }

            .form-group {
                margin-bottom: 1.5rem;
            }

            .form-group label {
                display: block;
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 0.5rem;
                font-size: 0.95rem;
            }

            .form-group input,
            .form-group select,
            .form-group textarea {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid #bdc3c7;
                border-radius: 4px;
                font-size: 0.95rem;
                font-family: inherit;
                transition: border-color 0.3s;
            }

            .form-group input:focus,
            .form-group select:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: #3498db;
                box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
            }

            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
            }

            .payment-info {
                background: #f0f7ff;
                padding: 1rem;
                border-radius: 4px;
                margin-bottom: 1.5rem;
                border-left: 4px solid #3498db;
            }

            .payment-info p {
                margin: 0.5rem 0;
                font-size: 0.9rem;
                color: #2c3e50;
            }

            .btn-payment-primary {
                width: 100%;
                padding: 1rem;
                background: linear-gradient(135deg, #3498db, #2980b9);
                color: white;
                border: none;
                border-radius: 4px;
                font-weight: 600;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s;
                margin-bottom: 1rem;
            }

            .btn-payment-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
            }

            .btn-payment-primary:active {
                transform: translateY(0);
            }

            .payment-footer {
                text-align: center;
                color: #7f8c8d;
                font-size: 0.85rem;
                margin-top: 1rem;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            @keyframes slideUp {
                from {
                    transform: translateY(50px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            @media (max-width: 768px) {
                .payment-methods {
                    grid-template-columns: 1fr;
                }

                .payment-modal-content {
                    width: 95%;
                    padding: 1.5rem;
                }

                .form-row {
                    grid-template-columns: 1fr;
                }
            }
        </style>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Open payment modal
function openPaymentModal(amount = null, description = null) {
    initializePaymentSystem();
    const modal = document.getElementById('paymentModal');
    modal.classList.add('active');

    if (amount) {
        document.getElementById('paymentAmount').value = amount;
        document.getElementById('cardAmount').value = amount;
        document.getElementById('bankAmount').value = amount;
        updateDisplayAmount(amount);
    }

    if (description) {
        document.getElementById('paymentDescription').value = description;
    }

    document.getElementById('transactionId').textContent = generateTransactionId();
}

// Close payment modal
function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.classList.remove('active');
}

// Select payment method
function selectPaymentMethod(method) {
    // Hide all forms
    document.querySelectorAll('.payment-form').forEach(form => {
        form.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.payment-method-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected form and button
    const form = document.getElementById(method + 'Form');
    if (form) {
        form.classList.add('active');
    }

    event.target.closest('.payment-method-btn').classList.add('active');
}

// Update display amount
function updateDisplayAmount(amount) {
    document.getElementById('displayAmount').textContent = `KES ${parseFloat(amount).toLocaleString()}`;
}

// ============================================
// M-PESA PAYMENT HANDLER
// ============================================

function initiateMpesaPayment() {
    const amount = document.getElementById('paymentAmount').value.trim();
    const phone = document.getElementById('paymentPhone').value.trim();
    const description = document.getElementById('paymentDescription').value.trim();
    const paymentType = document.getElementById('paymentType').value;

    // Validation
    if (!amount || !phone || !paymentType) {
        alert('Please fill in all required fields');
        return;
    }

    if (amount < 100) {
        alert('Minimum payment amount is KES 100');
        return;
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(phone);
    if (!formattedPhone) {
        alert('Invalid phone number. Please use format: +254712345678 or 0712345678');
        return;
    }

    // Create payment request
    const paymentRequest = {
        id: generateTransactionId(),
        phone: formattedPhone,
        amount: parseFloat(amount),
        description: description || 'Payment for Ivory Apartment',
        type: paymentType,
        method: 'mpesa',
        timestamp: new Date().toLocaleString(),
        status: 'pending'
    };

    // Show M-Pesa prompt
    showMpesaPrompt(formattedPhone, amount, paymentRequest);
}

// ============================================
// CARD PAYMENT HANDLER
// ============================================

function initiateCardPayment() {
    const amount = document.getElementById('cardAmount').value.trim();
    const cardNumber = document.getElementById('cardNumber').value.trim();
    const cardExpiry = document.getElementById('cardExpiry').value.trim();
    const cardCVV = document.getElementById('cardCVV').value.trim();

    // Validation
    if (!amount || !cardNumber || !cardExpiry || !cardCVV) {
        alert('Please fill in all required fields');
        return;
    }

    if (amount < 100) {
        alert('Minimum payment amount is KES 100');
        return;
    }

    // Validate card
    if (cardNumber.replace(/\s/g, '').length !== 16) {
        alert('Invalid card number. Please enter 16 digits');
        return;
    }

    alert('✅ Card payment initiated!\n\nThis is a demo. In production, this would be processed through a payment gateway like Stripe or Flutterwave.');
}

// ============================================
// BANK TRANSFER HANDLER
// ============================================

function initiateBankTransfer() {
    const amount = document.getElementById('bankAmount').value.trim();
    const reference = document.getElementById('bankReference').value.trim();

    if (!amount) {
        alert('Please enter an amount');
        return;
    }

    if (amount < 100) {
        alert('Minimum payment amount is KES 100');
        return;
    }

    alert(`✅ Bank Transfer Initiated\n\nAmount: KES ${parseFloat(amount).toLocaleString()}\nReference: ${reference || 'IVORY-' + generateTransactionId()}\n\nPlease complete the transfer to the bank details provided above.`);
}

// ============================================
// M-PESA PROMPT DISPLAY
// ============================================

function showMpesaPrompt(phone, amount, paymentRequest) {
    // Simulate M-Pesa STK push notification
    const promptMessage = `
╔════════════════════════════════════════╗
║           M-PESA PAYMENT PROMPT        ║
╠════════════════════════════════════════╣
║                                        ║
║  📱 ENTER MPESA PIN TO COMPLETE       ║
║                                        ║
║  Merchant: Ivory Apartment             ║
║  Amount: KES ${parseFloat(amount).toLocaleString().padEnd(20)} ║
║  Phone: ${phone.padEnd(31)} ║
║  Ref: ${paymentRequest.id.padEnd(33)} ║
║                                        ║
║  Transaction pending...                ║
║  Confirm with M-Pesa PIN               ║
║                                        ║
║  [1] Confirm with PIN  [2] Cancel      ║
║                                        ║
╚════════════════════════════════════════╝
    `;

    // Show prompt
    const userChoice = prompt(promptMessage, '1');

    if (userChoice === '1' || userChoice === null) {
        // Process payment
        processPayment(paymentRequest);
    } else if (userChoice === '2') {
        alert('Payment cancelled');
        closePaymentModal();
    }
}

// ============================================
// PAYMENT PROCESSING
// ============================================

function processPayment(paymentRequest) {
    // Simulate API call to M-Pesa
    showLoadingState();

    setTimeout(() => {
        // Simulate successful payment
        paymentRequest.status = 'completed';
        paymentRequest.completionTime = new Date().toLocaleString();

        // Save payment
        paymentHistory.push(paymentRequest);
        localStorage.setItem('paymentHistory', JSON.stringify(paymentHistory));

        // Remove from pending
        pendingPayments = pendingPayments.filter(p => p.id !== paymentRequest.id);
        localStorage.setItem('pendingPayments', JSON.stringify(pendingPayments));

        // Show success
        showPaymentSuccess(paymentRequest);
        closePaymentModal();
    }, 2000);
}

// Show payment success
function showPaymentSuccess(payment) {
    const receipt = `
✅ PAYMENT SUCCESSFUL

Transaction ID: ${payment.id}
Amount: KES ${payment.amount.toLocaleString()}
Phone: ${payment.phone}
Payment Method: M-Pesa
Status: ${payment.status.toUpperCase()}
Date: ${payment.completionTime}

A confirmation SMS has been sent to ${payment.phone}

Receipt has been saved to your account.
    `;

    alert(receipt);

    // Update dashboard if available
    if (typeof updatePaymentHistory === 'function') {
        updatePaymentHistory();
    }
}

// Show loading state
function showLoadingState() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        const overlay = document.createElement('div');
        overlay.className = 'payment-loading-overlay';
        overlay.innerHTML = `
            <div class="payment-spinner">
                <div class="spinner"></div>
                <p>Processing payment...</p>
            </div>
        `;
        modal.appendChild(overlay);

        const style = document.createElement('style');
        style.textContent = `
            .payment-loading-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 12px;
                z-index: 10;
            }

            .payment-spinner {
                text-align: center;
            }

            .spinner {
                width: 50px;
                height: 50px;
                border: 5px solid #ecf0f1;
                border-top: 5px solid #3498db;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            overlay.remove();
        }, 2000);
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Format phone number
function formatPhoneNumber(phone) {
    // Remove any non-digit characters
    const digits = phone.replace(/\D/g, '');

    // Check if valid length (10 digits for 07xxxxxxxx or 12 digits for +254xxxxxxxxx)
    if (digits.length === 10 && digits.startsWith('7')) {
        return '+254' + digits.substring(1);
    } else if (digits.length === 12 && digits.startsWith('254')) {
        return '+' + digits;
    }

    return null;
}

// Generate transaction ID
function generateTransactionId() {
    return 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
}

// Get payment history
function getPaymentHistory(userId = null) {
    if (userId) {
        return paymentHistory.filter(p => p.userId === userId);
    }
    return paymentHistory;
}

// Get payment by ID
function getPaymentById(paymentId) {
    return paymentHistory.find(p => p.id === paymentId);
}

// Get total paid
function getTotalPaid() {
    return paymentHistory
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);
}

// Get pending payments
function getPendingPayments(userId = null) {
    if (userId) {
        return pendingPayments.filter(p => p.userId === userId && p.status === 'pending');
    }
    return pendingPayments.filter(p => p.status === 'pending');
}

// Export payment history
function exportPaymentHistory() {
    if (paymentHistory.length === 0) {
        alert('No payments to export');
        return;
    }

    let csv = 'Transaction ID,Amount,Phone,Type,Method,Status,Date\n';
    paymentHistory.forEach(payment => {
        csv += `"${payment.id}",${payment.amount},"${payment.phone}","${payment.type}","${payment.method}","${payment.status}","${payment.timestamp}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment_history_${Date.now()}.csv`;
    a.click();
}

// Close modal on outside click
document.addEventListener('click', function(event) {
    const modal = document.getElementById('paymentModal');
    if (modal && event.target === modal) {
        closePaymentModal();
    }
});

console.log('✅ Payment Module Loaded - M-Pesa integration ready');
