# Ivory Apartment Backend API Documentation

This document describes the PHP/MySQL backend API for the Ivory Apartment property management system.

## Table of Contents

1. [Setup & Configuration](#setup--configuration)
2. [Database Schema](#database-schema)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Error Handling](#error-handling)
6. [Security](#security)
7. [Examples](#examples)

---

## Setup & Configuration

### Prerequisites

- PHP 7.4+ with PDO MySQL extension
- MySQL 5.7+ or MariaDB 10.2+
- Apache with mod_rewrite enabled (optional, for clean URLs)

### Installation Steps

1. **Clone/Copy the project** to your web server root:
   ```
   c:\xampp\htdocs\ivory-apartment
   ```

2. **Create MySQL database and user**:
   ```sql
   CREATE DATABASE ivory_apartment CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'ivory_user'@'localhost' IDENTIFIED BY 'secure_password';
   GRANT ALL PRIVILEGES ON ivory_apartment.* TO 'ivory_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Update `config.php`** with your database credentials:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'ivory_user');
   define('DB_PASS', 'secure_password');
   define('DB_NAME', 'ivory_apartment');
   define('JWT_SECRET', 'your-strong-secret-key-here');
   ```

4. **Initialize the database** by running `init_db.php` in your browser:
   ```
   http://localhost/ivory-apartment/init_db.php
   ```
   This creates all necessary tables, indexes, and triggers.

5. **Enable .htaccess** (optional, for clean REST URLs):
   - Ensure Apache has `mod_rewrite` enabled
   - Place `.htaccess` in the project root

6. **Set up logging directory**:
   ```
   mkdir -p logs
   chmod 755 logs
   ```

---

## Database Schema

### Tables Overview

#### 1. `users` - Property seekers/tenants
```sql
- id: INT PRIMARY KEY AUTO_INCREMENT
- name: VARCHAR(255)
- email: VARCHAR(255) UNIQUE
- phone: VARCHAR(20)
- password_hash: VARCHAR(255) [bcrypt]
- role: ENUM('user', 'admin') DEFAULT 'user'
- status: ENUM('active', 'inactive', 'suspended') DEFAULT 'active'
- date_registered: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- last_login: TIMESTAMP NULL
- INDEX: email, status, role
```

#### 2. `admins` - System administrators
```sql
- id: INT PRIMARY KEY AUTO_INCREMENT
- name: VARCHAR(255)
- email: VARCHAR(255) UNIQUE
- phone: VARCHAR(20)
- password_hash: VARCHAR(255) [bcrypt]
- role: ENUM('admin', 'super_admin', 'manager') DEFAULT 'admin'
- department: VARCHAR(100)
- status: ENUM('active', 'inactive', 'suspended') DEFAULT 'active'
- date_added: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- created_by: INT UNSIGNED
- INDEX: email, role, status, created_by
- FK: created_by -> admins.id
```

#### 3. `properties` - Rental properties
```sql
- id: INT PRIMARY KEY AUTO_INCREMENT
- title: VARCHAR(255)
- description: LONGTEXT
- type: ENUM('apartment', 'house', 'studio', 'commercial') DEFAULT 'apartment'
- price: DECIMAL(10,2)
- location: VARCHAR(255)
- area: VARCHAR(100) [e.g., "Nairobi CBD"]
- bedrooms: INT
- bathrooms: INT
- amenities: JSON [e.g., {"wifi": true, "gym": true}]
- images: JSON [array of image URLs]
- status: ENUM('available', 'occupied', 'maintenance') DEFAULT 'available'
- featured: BOOLEAN DEFAULT FALSE
- created_by: INT UNSIGNED
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
- FULLTEXT INDEX: (title, description, location)
- FK: created_by -> admins.id
```

#### 4. `inquiries` - Property inquiries
```sql
- id: INT PRIMARY KEY AUTO_INCREMENT
- property_id: INT UNSIGNED
- user_id: INT UNSIGNED
- message: TEXT
- status: ENUM('new', 'responded', 'closed') DEFAULT 'new'
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- responded_at: TIMESTAMP NULL
- response: LONGTEXT
- responded_by: INT UNSIGNED
- INDEX: property_id, user_id, status
- FK: property_id -> properties.id
- FK: user_id -> users.id
- FK: responded_by -> admins.id
```

#### 5. `saved_listings` - User saved properties
```sql
- id: INT PRIMARY KEY AUTO_INCREMENT
- user_id: INT UNSIGNED
- property_id: INT UNSIGNED
- saved_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- UNIQUE(user_id, property_id)
- FK: user_id -> users.id
- FK: property_id -> properties.id
```

#### 6. `staff` - Company employees
```sql
- id: INT PRIMARY KEY AUTO_INCREMENT
- name: VARCHAR(255)
- position: VARCHAR(100)
- department: VARCHAR(100)
- salary: DECIMAL(10,2)
- status: ENUM('active', 'inactive', 'on_leave') DEFAULT 'active'
- date_hired: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- created_by: INT UNSIGNED
- INDEX: department, status, created_by
- FK: created_by -> admins.id
```

#### 7. `payroll` - Payroll records
```sql
- id: INT PRIMARY KEY AUTO_INCREMENT
- staff_id: INT UNSIGNED
- month: DATE [first day of month, e.g., 2024-10-01]
- salary: DECIMAL(10,2)
- allowances: DECIMAL(10,2) DEFAULT 0
- tax: DECIMAL(10,2) DEFAULT 0
- insurance: DECIMAL(10,2) DEFAULT 0
- other_deductions: DECIMAL(10,2) DEFAULT 0
- net_pay: DECIMAL(10,2) [GENERATED: salary + allowances - tax - insurance - other_deductions]
- status: ENUM('pending', 'processed', 'paid') DEFAULT 'pending'
- processed_by: INT UNSIGNED
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- UNIQUE(staff_id, month)
- FK: staff_id -> staff.id
- FK: processed_by -> admins.id
```

#### 8. `payments` - Payment transactions
```sql
- id: INT PRIMARY KEY AUTO_INCREMENT
- transaction_id: VARCHAR(50) UNIQUE
- user_id: INT UNSIGNED
- amount: DECIMAL(10,2)
- currency: VARCHAR(3) DEFAULT 'KES'
- payment_type: ENUM('rent', 'deposit', 'utilities', 'other') DEFAULT 'rent'
- payment_method: ENUM('mpesa', 'card', 'bank', 'cash') DEFAULT 'mpesa'
- phone: VARCHAR(20)
- description: VARCHAR(255)
- status: ENUM('pending', 'completed', 'failed') DEFAULT 'pending'
- mpesa_reference: VARCHAR(50)
- mpesa_receipt: VARCHAR(50)
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- completed_at: TIMESTAMP NULL
- INDEX: user_id, transaction_id, status, created_at
- FK: user_id -> users.id
```

#### 9. `vacancies` - Job vacancies
```sql
- id: INT PRIMARY KEY AUTO_INCREMENT
- title: VARCHAR(255)
- department: VARCHAR(100)
- salary: DECIMAL(10,2)
- description: LONGTEXT
- requirements: LONGTEXT
- status: ENUM('open', 'closed') DEFAULT 'open'
- created_by: INT UNSIGNED
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- closed_at: TIMESTAMP NULL
- FULLTEXT INDEX: (title, description, requirements)
- FK: created_by -> admins.id
```

#### 10. `audit_log` - System audit trail
```sql
- id: INT PRIMARY KEY AUTO_INCREMENT
- user_id: INT UNSIGNED
- admin_id: INT UNSIGNED
- action: VARCHAR(100)
- table_name: VARCHAR(50)
- record_id: INT
- old_values: JSON
- new_values: JSON
- ip_address: VARCHAR(45)
- user_agent: VARCHAR(255)
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- INDEX: user_id, admin_id, action, created_at
- FK: user_id -> users.id
- FK: admin_id -> admins.id
```

---

## Authentication

### Token Generation & Verification

The backend uses JWT (JSON Web Tokens) for stateless authentication:

```php
// Token structure: header.payload.signature
// Algorithm: HS256 (HMAC-SHA256)
// Expiration: 7 days (604800 seconds)
// Secret: defined in config.php as JWT_SECRET
```

### Authentication Flow

1. **User logs in** → `/api/auth-api.php?action=login` with email/password
2. **Server returns** JWT token in response
3. **Client stores** token in sessionStorage (or localStorage)
4. **Client sends** token in every request header: `Authorization: Bearer TOKEN`
5. **Server verifies** token signature and expiration

### Token Refresh

When token expires:
1. Call `/api/auth-api.php?action=refresh-token` with expired token
2. Server returns new token if original is valid but expired
3. Update token in client storage

---

## API Endpoints

### Base URL
```
http://localhost/ivory-apartment/api/
```

### Authentication Endpoints

#### 1. User Registration
```
POST /api/auth-api.php?action=register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+254712345678",
  "password": "SecurePassword123"
}

Response (201):
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user_id": 1,
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  },
  "timestamp": "2024-10-16T10:30:00Z"
}
```

#### 2. User Login
```
POST /api/auth-api.php?action=login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user_id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  },
  "timestamp": "2024-10-16T10:30:00Z"
}
```

#### 3. Admin Login
```
POST /api/auth-api.php?action=admin-login
Content-Type: application/json

{
  "email": "admin@ivory.com",
  "password": "AdminPassword123"
}

Response (200):
{
  "success": true,
  "message": "Admin login successful",
  "data": {
    "admin_id": 1,
    "name": "Admin User",
    "email": "admin@ivory.com",
    "role": "super_admin",
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  },
  "timestamp": "2024-10-16T10:30:00Z"
}
```

#### 4. Verify Token
```
POST /api/auth-api.php?action=verify-token
Authorization: Bearer TOKEN

Response (200):
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "id": 1,
    "email": "john@example.com",
    "role": "user"
  },
  "timestamp": "2024-10-16T10:30:00Z"
}
```

#### 5. Refresh Token
```
POST /api/auth-api.php?action=refresh-token
Authorization: Bearer EXPIRED_TOKEN

Response (200):
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  },
  "timestamp": "2024-10-16T10:30:00Z"
}
```

#### 6. Change Password
```
POST /api/auth-api.php?action=change-password
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "old_password": "OldPassword123",
  "new_password": "NewPassword456"
}

Response (200):
{
  "success": true,
  "message": "Password changed successfully",
  "timestamp": "2024-10-16T10:30:00Z"
}
```

### Properties Endpoints

#### 1. List Properties
```
GET /api/properties-api.php?action=list&limit=10&offset=0

Optional query params:
- type: apartment|house|studio|commercial
- status: available|occupied|maintenance
- featured: true|false
- min_price: 10000
- max_price: 100000
- area: Nairobi CBD

Response (200):
{
  "success": true,
  "message": "Properties retrieved",
  "data": {
    "properties": [
      {
        "id": 1,
        "title": "Modern Apartment",
        "price": 25000,
        "location": "Westlands",
        "bedrooms": 2,
        "bathrooms": 2,
        "status": "available",
        "amenities": {"wifi": true, "gym": true},
        "images": ["image1.jpg", "image2.jpg"]
      }
    ],
    "total": 45,
    "limit": 10,
    "offset": 0
  },
  "timestamp": "2024-10-16T10:30:00Z"
}
```

#### 2. Get Single Property
```
GET /api/properties-api.php?action=get&id=1

Response (200):
{
  "success": true,
  "message": "Property retrieved",
  "data": {
    "id": 1,
    "title": "Modern Apartment",
    "description": "Beautiful apartment...",
    "price": 25000,
    ...
  },
  "timestamp": "2024-10-16T10:30:00Z"
}
```

#### 3. Create Property (Admin only)
```
POST /api/properties-api.php?action=create
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "title": "Modern Apartment",
  "description": "Beautiful apartment in Westlands",
  "type": "apartment",
  "price": 25000,
  "location": "Westlands",
  "area": "Nairobi",
  "bedrooms": 2,
  "bathrooms": 2,
  "amenities": {
    "wifi": true,
    "gym": true,
    "parking": true
  },
  "images": ["image1.jpg", "image2.jpg"]
}

Response (201):
{
  "success": true,
  "message": "Property created successfully",
  "data": {"property_id": 1},
  "timestamp": "2024-10-16T10:30:00Z"
}
```

#### 4. Update Property (Admin only)
```
PUT /api/properties-api.php?action=update
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "id": 1,
  "title": "Updated Apartment",
  "price": 27000,
  ...
}

Response (200):
{
  "success": true,
  "message": "Property updated successfully",
  "timestamp": "2024-10-16T10:30:00Z"
}
```

#### 5. Delete Property (Admin only)
```
DELETE /api/properties-api.php?action=delete
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "id": 1
}

Response (200):
{
  "success": true,
  "message": "Property deleted successfully",
  "timestamp": "2024-10-16T10:30:00Z"
}
```

#### 6. Search Properties
```
GET /api/properties-api.php?action=search&q=apartment&limit=20

Response (200):
{
  "success": true,
  "message": "Search results",
  "data": {
    "properties": [...],
    "total": 5
  },
  "timestamp": "2024-10-16T10:30:00Z"
}
```

#### 7. Save Property
```
POST /api/properties-api.php?action=save
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "property_id": 1
}

Response (200):
{
  "success": true,
  "message": "Property saved",
  "timestamp": "2024-10-16T10:30:00Z"
}
```

#### 8. Unsave Property
```
POST /api/properties-api.php?action=unsave
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "property_id": 1
}

Response (200):
{
  "success": true,
  "message": "Property unsaved",
  "timestamp": "2024-10-16T10:30:00Z"
}
```

#### 9. Get Saved Properties
```
GET /api/properties-api.php?action=saved&limit=10&offset=0
Authorization: Bearer TOKEN

Response (200):
{
  "success": true,
  "message": "Saved properties retrieved",
  "data": {
    "properties": [...],
    "total": 3
  },
  "timestamp": "2024-10-16T10:30:00Z"
}
```

### Payment Endpoints

#### 1. Initiate Payment
```
POST /api/payment-api.php?action=initiate
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "amount": 25000,
  "currency": "KES",
  "payment_type": "rent",
  "payment_method": "mpesa",
  "phone": "254712345678",
  "description": "Rent payment for apartment #1"
}

Response (200):
{
  "success": true,
  "message": "Payment initiated",
  "data": {
    "transaction_id": "TXN20241016001",
    "status": "pending",
    "checkout_url": "https://mpesa.sandbox.com/checkout?..."
  },
  "timestamp": "2024-10-16T10:30:00Z"
}
```

#### 2. Confirm Payment
```
POST /api/payment-api.php?action=confirm
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "transaction_id": "TXN20241016001",
  "mpesa_receipt": "LHD61H15RG3"
}

Response (200):
{
  "success": true,
  "message": "Payment confirmed",
  "timestamp": "2024-10-16T10:30:00Z"
}
```

#### 3. Get Payment History
```
GET /api/payment-api.php?action=history&limit=10&offset=0
Authorization: Bearer TOKEN

Optional query params:
- status: pending|completed|failed
- payment_type: rent|deposit|utilities|other
- start_date: 2024-01-01
- end_date: 2024-12-31

Response (200):
{
  "success": true,
  "message": "Payment history retrieved",
  "data": {
    "payments": [...],
    "total": 25,
    "limit": 10,
    "offset": 0
  },
  "timestamp": "2024-10-16T10:30:00Z"
}
```

#### 4. Get Single Payment
```
GET /api/payment-api.php?action=get&id=1
Authorization: Bearer TOKEN

Response (200):
{
  "success": true,
  "message": "Payment retrieved",
  "data": {
    "id": 1,
    "transaction_id": "TXN20241016001",
    "amount": 25000,
    "status": "completed",
    ...
  },
  "timestamp": "2024-10-16T10:30:00Z"
}
```

#### 5. M-Pesa Callback
```
POST /api/payment-api.php?action=callback
Content-Type: application/json

{
  "Body": {
    "stkCallback": {
      "MerchantRequestID": "...",
      "CheckoutRequestID": "...",
      "ResultCode": 0,
      "ResultDesc": "The service request has been processed successfully",
      "CallbackMetadata": {
        "Item": [
          {"Name": "Amount", "Value": 25000},
          {"Name": "MpesaReceiptNumber", "Value": "LHD61H15RG3"},
          {"Name": "TransactionDate", "Value": "20241016103000"},
          {"Name": "PhoneNumber", "Value": "254712345678"}
        ]
      }
    }
  }
}

Response (200):
{
  "ResultCode": 0,
  "ResultDesc": "Callback processed successfully"
}
```

### Admin Management Endpoints

#### 1. List Admins (Super-admin only)
```
GET /api/admin-api.php?action=list&limit=10&offset=0
Authorization: Bearer SUPER_ADMIN_TOKEN

Response (200):
{
  "success": true,
  "message": "Admins retrieved",
  "data": {
    "admins": [...],
    "total": 5,
    "limit": 10,
    "offset": 0
  },
  "timestamp": "2024-10-16T10:30:00Z"
}
```

#### 2. Create Admin (Super-admin only)
```
POST /api/admin-api.php?action=create
Authorization: Bearer SUPER_ADMIN_TOKEN
Content-Type: application/json

{
  "name": "New Admin",
  "email": "newadmin@ivory.com",
  "phone": "+254712345678",
  "password": "SecurePassword123",
  "role": "manager",
  "department": "Operations"
}

Response (201):
{
  "success": true,
  "message": "Admin created successfully",
  "data": {"admin_id": 2},
  "timestamp": "2024-10-16T10:30:00Z"
}
```

#### 3. Update Admin Role (Super-admin only)
```
POST /api/admin-api.php?action=update-role
Authorization: Bearer SUPER_ADMIN_TOKEN
Content-Type: application/json

{
  "id": 2,
  "role": "admin"
}

Response (200):
{
  "success": true,
  "message": "Admin role updated successfully",
  "timestamp": "2024-10-16T10:30:00Z"
}
```

#### 4. Update Admin Status (Super-admin only)
```
POST /api/admin-api.php?action=update-status
Authorization: Bearer SUPER_ADMIN_TOKEN
Content-Type: application/json

{
  "id": 2,
  "status": "inactive"
}

Response (200):
{
  "success": true,
  "message": "Admin status updated successfully",
  "timestamp": "2024-10-16T10:30:00Z"
}
```

### Payroll Endpoints

#### 1. List Staff
```
GET /api/payroll-api.php?action=list-staff&limit=10
Authorization: Bearer ADMIN_TOKEN

Response (200):
{
  "success": true,
  "message": "Staff retrieved",
  "data": {
    "staff": [...],
    "total": 25,
    "limit": 10,
    "offset": 0
  },
  "timestamp": "2024-10-16T10:30:00Z"
}
```

#### 2. Create Payroll
```
POST /api/payroll-api.php?action=create-payroll
Authorization: Bearer MANAGER_TOKEN
Content-Type: application/json

{
  "staff_id": 1,
  "month": "2024-10",
  "salary": 50000,
  "allowances": 5000,
  "tax": 7500,
  "insurance": 2500,
  "other_deductions": 1000
}

Response (201):
{
  "success": true,
  "message": "Payroll created successfully",
  "data": {"payroll_id": 1},
  "timestamp": "2024-10-16T10:30:00Z"
}
```

#### 3. List Payroll
```
GET /api/payroll-api.php?action=list-payroll&staff_id=1&month=2024-10
Authorization: Bearer MANAGER_TOKEN

Optional query params:
- status: pending|processed|paid
- limit: 10
- offset: 0

Response (200):
{
  "success": true,
  "message": "Payroll records retrieved",
  "data": {
    "payroll": [...],
    "total": 12,
    "limit": 10,
    "offset": 0
  },
  "timestamp": "2024-10-16T10:30:00Z"
}
```

#### 4. Get Payroll History
```
GET /api/payroll-api.php?action=payroll-history&staff_id=1&limit=12
Authorization: Bearer ADMIN_TOKEN

Response (200):
{
  "success": true,
  "message": "Payroll history retrieved",
  "data": {
    "staff": {
      "id": 1,
      "name": "John Doe"
    },
    "history": [...],
    "total": 12,
    "limit": 12,
    "offset": 0
  },
  "timestamp": "2024-10-16T10:30:00Z"
}
```

#### 5. Process Payroll
```
POST /api/payroll-api.php?action=process-payroll
Authorization: Bearer MANAGER_TOKEN
Content-Type: application/json

{
  "id": 1
}

Response (200):
{
  "success": true,
  "message": "Payroll processed successfully",
  "timestamp": "2024-10-16T10:30:00Z"
}
```

---

## Error Handling

All API responses follow a consistent JSON format:

```json
{
  "success": boolean,
  "message": "Human-readable message",
  "data": object|null,
  "timestamp": "ISO 8601 timestamp"
}
```

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200  | OK | GET request successful |
| 201  | Created | Resource created |
| 400  | Bad Request | Missing required fields |
| 401  | Unauthorized | Invalid/missing token |
| 403  | Forbidden | Insufficient permissions |
| 404  | Not Found | Resource doesn't exist |
| 409  | Conflict | Email already exists, duplicate record |
| 500  | Server Error | Unexpected error |

### Common Error Responses

**Missing Token**
```json
{
  "success": false,
  "message": "Unauthorized: no token provided",
  "data": null,
  "timestamp": "2024-10-16T10:30:00Z"
}
```

**Invalid Token**
```json
{
  "success": false,
  "message": "Unauthorized: invalid token",
  "data": null,
  "timestamp": "2024-10-16T10:30:00Z"
}
```

**Insufficient Permissions**
```json
{
  "success": false,
  "message": "Unauthorized: insufficient permissions",
  "data": null,
  "timestamp": "2024-10-16T10:30:00Z"
}
```

**Validation Error**
```json
{
  "success": false,
  "message": "Missing required field: email",
  "data": null,
  "timestamp": "2024-10-16T10:30:00Z"
}
```

---

## Security

### Password Security
- Passwords are hashed using **bcrypt** with cost factor 12
- Passwords are never stored in plaintext
- Passwords are never returned in API responses

### Token Security
- JWT tokens are signed using HMAC-SHA256
- Token expiration: 7 days
- Tokens must be sent in `Authorization: Bearer TOKEN` header
- Never expose tokens in URLs

### Data Protection
- All inputs are sanitized with `htmlspecialchars()` and `strip_tags()`
- SQL injection prevention: all queries use parameterized statements with PDO
- CORS enabled for specified origins

### Headers & Policies
- `.htaccess` sets security headers (X-Content-Type-Options, X-XSS-Protection, X-Frame-Options)
- Sensitive files denied access (config.php, init_db.php, .env, .git)

### HTTPS
- Always use HTTPS in production
- Set `Secure` flag on cookies

---

## Examples

### JavaScript Fetch Examples

#### Login and Store Token
```javascript
const response = await fetch('/api/auth-api.php?action=login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

const data = await response.json();
if (data.success) {
  sessionStorage.setItem('auth_token', data.data.token);
  console.log('Logged in successfully');
}
```

#### Make Authenticated Request
```javascript
const token = sessionStorage.getItem('auth_token');

const response = await fetch('/api/properties-api.php?action=list', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log(data.data.properties);
```

#### Create Property (Admin)
```javascript
const token = sessionStorage.getItem('admin_token');

const response = await fetch('/api/properties-api.php?action=create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Modern Apartment',
    description: 'Beautiful 2-bedroom apartment',
    type: 'apartment',
    price: 25000,
    location: 'Westlands',
    area: 'Nairobi',
    bedrooms: 2,
    bathrooms: 2,
    amenities: {
      wifi: true,
      gym: true,
      parking: true
    },
    images: ['img1.jpg', 'img2.jpg']
  })
});

const data = await response.json();
console.log('Property created:', data.data.property_id);
```

### cURL Examples

#### Login
```bash
curl -X POST http://localhost/ivory-apartment/api/auth-api.php?action=login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

#### Get Properties
```bash
curl -X GET "http://localhost/ivory-apartment/api/properties-api.php?action=list&limit=10"
```

#### Create Payment (with authentication)
```bash
curl -X POST http://localhost/ivory-apartment/api/payment-api.php?action=initiate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "amount": 25000,
    "currency": "KES",
    "payment_type": "rent",
    "payment_method": "mpesa",
    "phone": "254712345678",
    "description": "Rent payment for apartment #1"
  }'
```

---

## Support & Troubleshooting

### Database Connection Fails
- Check MySQL server is running
- Verify credentials in `config.php`
- Check database exists: `SHOW DATABASES;`

### Token Expired
- Call refresh endpoint: `/api/auth-api.php?action=refresh-token`
- Or prompt user to login again

### Permission Denied
- Verify token is valid: `/api/auth-api.php?action=verify-token`
- Check user role has required permissions
- Super-admin role required for admin management

### CORS Errors
- Check `.htaccess` headers are correctly configured
- Ensure `enableCORS()` is called in API files
- Verify request origin is allowed

---

## Version History

- **v1.0** (2024-10-16): Initial release
  - Auth API with JWT tokens
  - Properties CRUD and search
  - Payment processing with M-Pesa
  - Admin management
  - Payroll management
  - 10 database tables with indexes and foreign keys

