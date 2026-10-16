<?php
/**
 * Payment Page
 * Handles M-Pesa, Card, Bank Transfer, and Cash payments
 */
session_start();
require_once 'config.php';
$page_title = 'Make Payment - Ivory Apartment';
$page_description = 'Secure payment processing for rent, deposits, and utilities';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="<?php echo htmlspecialchars($page_description); ?>">
    <title><?php echo htmlspecialchars($page_title); ?></title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="payment-styles.css">
</head>
<body>
    <!-- Navigation Bar -->
    <nav class="navbar">
        <div class="container nav-container">
            <div class="logo" onclick="goHome()" style="cursor: pointer;">🏢 Ivory Apartment</div>
            
            <button class="hamburger" onclick="toggleMobileMenu()">
                <span></span>
                <span></span>
                <span></span>
            </button>
            
            <ul class="nav-links" id="navMenu">
                <li><a href="index.php" onclick="closeMenu()">🏠 Home</a></li>
                <li class="nav-separator"></li>
                <li><a href="index.php#houses" onclick="closeMenu()">🏠 Houses</a></li>
                <li><a href="rooms.php" onclick="closeMenu()">🛏️ Rooms</a></li>
                <li><a href="index.php#vacancies" onclick="closeMenu()">💼 Vacancies</a></li>
                <li class="nav-separator"></li>
                <li id="userMenuNav">
                    <span id="userDisplay" style="color: white; cursor: pointer;">
                        <a href="javascript:showLoginModal()" id="loginLink">🔐 Login</a>
                    </span>
                </li>
                <li class="nav-separator"></li>
                <li><a href="index.php" class="nav-home-btn">← Back</a></li>
            </ul>
        </div>
    </nav>

    <main class="payment-main">
        <div class="container payment-container">
            <!-- Payment Header -->
            <div class="payment-header">
                <h1>💳 Make a Payment</h1>
                <p>Secure payment processing with M-Pesa, Card, or Bank Transfer</p>
            </div>

            <div class="payment-wrapper">
                <!-- Payment Form Section -->
                <div class="payment-form-section">
                    <div class="payment-methods-tabs">
                        <button class="method-tab active" onclick="selectPaymentMethod('mpesa')">
                            📱 M-Pesa
                        </button>
                        <button class="method-tab" onclick="selectPaymentMethod('card')">
                            💳 Card
                        </button>
                        <button class="method-tab" onclick="selectPaymentMethod('bank')">
                            🏦 Bank Transfer
                        </button>
                        <button class="method-tab" onclick="selectPaymentMethod('cash')">
                            💵 Cash
                        </button>
                    </div>

                    <!-- M-Pesa Payment Form -->
                    <form id="mpesaForm" class="payment-form active">
                        <div class="form-section-title">
                            <h2>📱 M-Pesa Payment</h2>
                            <p>Quick and secure mobile money payment</p>
                        </div>

                        <!-- Amount Input -->
                        <div class="form-group">
                            <label for="mpesaAmount">
                                Amount (KES)
                                <span class="required">*</span>
                            </label>
                            <div class="amount-input-group">
                                <span class="currency-symbol">KES</span>
                                <input type="number" id="mpesaAmount" placeholder="0.00" min="1" step="0.01" required>
                            </div>
                            <small>Minimum amount: KES 1</small>
                        </div>

                        <!-- Payment Type -->
                        <div class="form-group">
                            <label for="mpesaPaymentType">
                                Payment Type
                                <span class="required">*</span>
                            </label>
                            <select id="mpesaPaymentType" required onchange="updatePaymentTypeInfo()">
                                <option value="">Select payment type</option>
                                <option value="rent">🏠 Rent Payment</option>
                                <option value="deposit">💰 Security Deposit</option>
                                <option value="utilities">⚡ Utilities</option>
                                <option value="other">📋 Other</option>
                            </select>
                        </div>

                        <!-- Phone Number -->
                        <div class="form-group">
                            <label for="mpesaPhone">
                                M-Pesa Phone Number
                                <span class="required">*</span>
                            </label>
                            <div class="phone-input-group">
                                <span class="country-code">+254</span>
                                <input type="tel" id="mpesaPhone" placeholder="712345678" pattern="[0-9]{9}" maxlength="9" required>
                            </div>
                            <small>Enter your 9-digit mobile number (without the 0)</small>
                        </div>

                        <!-- Description -->
                        <div class="form-group">
                            <label for="mpesaDescription">Description (Optional)</label>
                            <input type="text" id="mpesaDescription" placeholder="e.g., Rent for October - Apartment 5B">
                        </div>

                        <!-- Payment Terms Checkbox -->
                        <div class="form-group checkbox-group">
                            <input type="checkbox" id="mpesaTerms" required>
                            <label for="mpesaTerms">
                                I agree to the payment terms and conditions
                                <a href="#" style="color: #3498db; text-decoration: underline;">View terms</a>
                            </label>
                        </div>

                        <!-- Submit Button -->
                        <button type="submit" class="btn-primary btn-large" onclick="handleMpesaPayment(event)">
                            💬 Request M-Pesa Payment
                        </button>

                        <!-- Info Box -->
                        <div class="info-box">
                            <strong>ℹ️ How it works:</strong>
                            <ol>
                                <li>Enter your payment details above</li>
                                <li>Review the payment amount</li>
                                <li>You'll receive an M-Pesa prompt on your phone</li>
                                <li>Enter your M-Pesa PIN to complete payment</li>
                                <li>Receive payment confirmation</li>
                            </ol>
                        </div>
                    </form>

                    <!-- Card Payment Form -->
                    <form id="cardForm" class="payment-form">
                        <div class="form-section-title">
                            <h2>💳 Card Payment</h2>
                            <p>Visa, Mastercard, or American Express</p>
                        </div>

                        <div class="form-group">
                            <label for="cardAmount">
                                Amount (KES)
                                <span class="required">*</span>
                            </label>
                            <div class="amount-input-group">
                                <span class="currency-symbol">KES</span>
                                <input type="number" id="cardAmount" placeholder="0.00" min="1" step="0.01" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="cardPaymentType">Payment Type <span class="required">*</span></label>
                            <select id="cardPaymentType" required>
                                <option value="">Select payment type</option>
                                <option value="rent">🏠 Rent Payment</option>
                                <option value="deposit">💰 Security Deposit</option>
                                <option value="utilities">⚡ Utilities</option>
                                <option value="other">📋 Other</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="cardHolder">Card Holder Name <span class="required">*</span></label>
                            <input type="text" id="cardHolder" placeholder="John Doe" required>
                        </div>

                        <div class="form-group">
                            <label for="cardNumber">Card Number <span class="required">*</span></label>
                            <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19" required>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="cardExpiry">Expiry Date <span class="required">*</span></label>
                                <input type="text" id="cardExpiry" placeholder="MM/YY" maxlength="5" required>
                            </div>
                            <div class="form-group">
                                <label for="cardCVV">CVV <span class="required">*</span></label>
                                <input type="text" id="cardCVV" placeholder="123" maxlength="4" required>
                            </div>
                        </div>

                        <div class="form-group checkbox-group">
                            <input type="checkbox" id="cardTerms" required>
                            <label for="cardTerms">
                                I agree to the payment terms and conditions
                            </label>
                        </div>

                        <button type="submit" class="btn-primary btn-large" onclick="handleCardPayment(event)">
                            🔒 Pay Securely with Card
                        </button>

                        <div class="security-badge">
                            🔐 Secure payment processing with SSL encryption
                        </div>
                    </form>

                    <!-- Bank Transfer Form -->
                    <form id="bankForm" class="payment-form">
                        <div class="form-section-title">
                            <h2>🏦 Bank Transfer</h2>
                            <p>Direct bank transfer to our account</p>
                        </div>

                        <div class="form-group">
                            <label for="bankAmount">
                                Amount (KES)
                                <span class="required">*</span>
                            </label>
                            <div class="amount-input-group">
                                <span class="currency-symbol">KES</span>
                                <input type="number" id="bankAmount" placeholder="0.00" min="1" step="0.01" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="bankPaymentType">Payment Type <span class="required">*</span></label>
                            <select id="bankPaymentType" required>
                                <option value="">Select payment type</option>
                                <option value="rent">🏠 Rent Payment</option>
                                <option value="deposit">💰 Security Deposit</option>
                                <option value="utilities">⚡ Utilities</option>
                                <option value="other">📋 Other</option>
                            </select>
                        </div>

                        <div class="bank-details-box">
                            <h3>Our Bank Details</h3>
                            <div class="detail-row">
                                <span class="label">Bank Name:</span>
                                <span class="value">Kenya Commercial Bank (KCB)</span>
                                <button type="button" class="copy-btn" onclick="copyToClipboard('Kenya Commercial Bank (KCB)')">Copy</button>
                            </div>
                            <div class="detail-row">
                                <span class="label">Account Number:</span>
                                <span class="value">1234567890</span>
                                <button type="button" class="copy-btn" onclick="copyToClipboard('1234567890')">Copy</button>
                            </div>
                            <div class="detail-row">
                                <span class="label">Account Name:</span>
                                <span class="value">Ivory Apartment Ltd</span>
                                <button type="button" class="copy-btn" onclick="copyToClipboard('Ivory Apartment Ltd')">Copy</button>
                            </div>
                            <div class="detail-row">
                                <span class="label">Branch Code:</span>
                                <span class="value">001</span>
                                <button type="button" class="copy-btn" onclick="copyToClipboard('001')">Copy</button>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="bankReference">Reference/Narration <span class="required">*</span></label>
                            <input type="text" id="bankReference" placeholder="e.g., Rent Payment - October" required>
                        </div>

                        <div class="form-group checkbox-group">
                            <input type="checkbox" id="bankTerms" required>
                            <label for="bankTerms">
                                I confirm I will transfer this amount to the bank account above
                            </label>
                        </div>

                        <button type="submit" class="btn-primary btn-large" onclick="handleBankTransfer(event)">
                            📋 Submit Bank Transfer Request
                        </button>

                        <div class="info-box">
                            <strong>ℹ️ Important:</strong>
                            <ul>
                                <li>Use the reference number provided as narration</li>
                                <li>Payment usually processes within 1-2 business days</li>
                                <li>Keep your transfer receipt for records</li>
                            </ul>
                        </div>
                    </form>

                    <!-- Cash Payment Form -->
                    <form id="cashForm" class="payment-form">
                        <div class="form-section-title">
                            <h2>💵 Cash Payment</h2>
                            <p>Pay in cash at our office</p>
                        </div>

                        <div class="form-group">
                            <label for="cashAmount">
                                Amount (KES)
                                <span class="required">*</span>
                            </label>
                            <div class="amount-input-group">
                                <span class="currency-symbol">KES</span>
                                <input type="number" id="cashAmount" placeholder="0.00" min="1" step="0.01" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="cashPaymentType">Payment Type <span class="required">*</span></label>
                            <select id="cashPaymentType" required>
                                <option value="">Select payment type</option>
                                <option value="rent">🏠 Rent Payment</option>
                                <option value="deposit">💰 Security Deposit</option>
                                <option value="utilities">⚡ Utilities</option>
                                <option value="other">📋 Other</option>
                            </select>
                        </div>

                        <div class="office-location-box">
                            <h3>📍 Our Office Location</h3>
                            <div class="location-details">
                                <p><strong>Address:</strong> 123 Nairobi Street, Nairobi CBD, Kenya</p>
                                <p><strong>Phone:</strong> +254-20-XXXX-XXXX</p>
                                <p><strong>Email:</strong> payments@ivoryapartment.com</p>
                                <p><strong>Operating Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM</p>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="cashDescription">Description (Optional)</label>
                            <input type="text" id="cashDescription" placeholder="e.g., Rent for October - Apartment 5B">
                        </div>

                        <div class="form-group checkbox-group">
                            <input type="checkbox" id="cashTerms" required>
                            <label for="cashTerms">
                                I understand payment must be made in cash at our office
                            </label>
                        </div>

                        <button type="submit" class="btn-primary btn-large" onclick="handleCashPayment(event)">
                            📞 Schedule Cash Payment
                        </button>

                        <div class="info-box">
                            <strong>ℹ️ Information:</strong>
                            <ul>
                                <li>Bring exact amount if possible</li>
                                <li>Receipt will be issued upon payment</li>
                                <li>For large amounts, please call ahead</li>
                            </ul>
                        </div>
                    </form>
                </div>

                <!-- Payment Summary Section -->
                <aside class="payment-summary-section">
                    <div class="payment-summary">
                        <h3>💡 Payment Summary</h3>

                        <div class="summary-item">
                            <span class="label">Payment Amount:</span>
                            <span class="value" id="summaryAmount">KES 0.00</span>
                        </div>

                        <div class="summary-item">
                            <span class="label">Payment Type:</span>
                            <span class="value" id="summaryType">Not selected</span>
                        </div>

                        <div class="summary-item">
                            <span class="label">Payment Method:</span>
                            <span class="value" id="summaryMethod">M-Pesa</span>
                        </div>

                        <div class="summary-divider"></div>

                        <div class="summary-item total">
                            <span class="label">Total Due:</span>
                            <span class="value" id="summaryTotal">KES 0.00</span>
                        </div>

                        <div class="summary-divider"></div>

                        <div class="payment-security">
                            <h4>🔐 Payment Security</h4>
                            <ul>
                                <li>✓ SSL Encrypted</li>
                                <li>✓ PCI Compliant</li>
                                <li>✓ Verified Merchant</li>
                                <li>✓ Secure Gateway</li>
                            </ul>
                        </div>

                        <div class="payment-faq">
                            <h4>❓ Common Questions</h4>
                            <details>
                                <summary>Is my payment secure?</summary>
                                <p>Yes, all payments are processed through secure, encrypted channels with industry-standard security protocols.</p>
                            </details>
                            <details>
                                <summary>When will my payment be confirmed?</summary>
                                <p>M-Pesa and card payments are instant. Bank transfers may take 1-2 business days.</p>
                            </details>
                            <details>
                                <summary>Can I get a receipt?</summary>
                                <p>Yes, receipts are sent to your registered email immediately after payment confirmation.</p>
                            </details>
                            <details>
                                <summary>What if payment fails?</summary>
                                <p>You will not be charged. Please try again or contact support at payments@ivoryapartment.com</p>
                            </details>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    </main>

    <!-- Success Modal -->
    <div id="successModal" class="modal">
        <div class="modal-content payment-modal">
            <div class="modal-icon success">✓</div>
            <h2>Payment Initiated Successfully!</h2>
            <p id="successMessage">Your payment has been submitted for processing.</p>
            
            <div class="payment-details-modal">
                <div class="detail-row">
                    <span>Transaction ID:</span>
                    <span id="transactionId" class="copy-text" onclick="copyToClipboard(this.textContent)">TXN000000001</span>
                </div>
                <div class="detail-row">
                    <span>Amount:</span>
                    <span id="confirmAmount">KES 0.00</span>
                </div>
                <div class="detail-row">
                    <span>Status:</span>
                    <span id="confirmStatus">Pending</span>
                </div>
            </div>

            <button class="btn-primary" onclick="closeSuccessModal()">
                ✓ Close
            </button>
            <button class="btn-secondary" onclick="downloadReceipt()">
                📥 Download Receipt
            </button>
        </div>
    </div>

    <!-- Error Modal -->
    <div id="errorModal" class="modal">
        <div class="modal-content payment-modal">
            <div class="modal-icon error">✗</div>
            <h2>Payment Failed</h2>
            <p id="errorMessage">An error occurred while processing your payment.</p>
            
            <button class="btn-primary" onclick="closeErrorModal()">
                ↻ Try Again
            </button>
        </div>
    </div>

    <!-- Loading Spinner -->
    <div id="loadingSpinner" class="loading-spinner">
        <div class="spinner"></div>
        <p>Processing your payment...</p>
    </div>

    <!-- Login Modal -->
    <div id="loginModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeLoginModal()">&times;</span>
            <div class="modal-header">
                <h2>Login Required</h2>
                <p>Please login to make a payment</p>
            </div>
            
            <div class="tab-buttons">
                <button class="tab-btn active" onclick="switchTab('login')">Login</button>
                <button class="tab-btn" onclick="switchTab('signup')">Sign Up</button>
            </div>

            <form id="loginForm" class="tab-content active">
                <div class="form-group">
                    <label for="loginEmail">Email Address</label>
                    <input type="email" id="loginEmail" placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                    <label for="loginPassword">Password</label>
                    <input type="password" id="loginPassword" placeholder="Enter your password" required>
                </div>
                <button type="submit" class="btn-primary">Login</button>
            </form>

            <form id="signupForm" class="tab-content">
                <div class="form-group">
                    <label for="signupName">Full Name</label>
                    <input type="text" id="signupName" placeholder="Enter your full name" required>
                </div>
                <div class="form-group">
                    <label for="signupEmail">Email Address</label>
                    <input type="email" id="signupEmail" placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                    <label for="signupPhone">Phone Number</label>
                    <input type="tel" id="signupPhone" placeholder="Enter your phone number" required>
                </div>
                <div class="form-group">
                    <label for="signupPassword">Password</label>
                    <input type="password" id="signupPassword" placeholder="Create a password" required>
                </div>
                <button type="submit" class="btn-primary">Create Account</button>
            </form>
        </div>
    </div>

    <script src="script.js"></script>
    <script src="payment-script.js"></script>
</body>
</html>
