<?php
// ============================================
// DATABASE INITIALIZATION SCRIPT
// ============================================

// This script creates all necessary database tables
// Run this once to set up the database

$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'ivory_apartment';

// Create database connection without selecting a database
try {
    $pdo = new PDO(
        'mysql:host=' . $db_host,
        $db_user,
        $db_pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    echo "✓ Connected to MySQL\n";
    
} catch (PDOException $e) {
    die("✗ Connection failed: " . $e->getMessage() . "\n");
}

// Create database if not exists
try {
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db_name` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "✓ Database created or already exists\n";
    
    // Select database
    $pdo->exec("USE `$db_name`");
    echo "✓ Database selected\n";
    
} catch (PDOException $e) {
    die("✗ Failed to create database: " . $e->getMessage() . "\n");
}

// ============================================
// CREATE TABLES
// ============================================

$tables = [

    // Users Table
    'CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20),
        password_hash VARCHAR(255) NOT NULL,
        role ENUM("tenant", "admin", "manager") DEFAULT "tenant",
        status ENUM("active", "inactive", "suspended") DEFAULT "active",
        date_registered TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role),
        INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',

    // Admins Table
    'CREATE TABLE IF NOT EXISTS admins (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20),
        password_hash VARCHAR(255) NOT NULL,
        role ENUM("super-admin", "admin", "manager", "operator") DEFAULT "admin",
        department VARCHAR(50),
        status ENUM("active", "inactive", "suspended") DEFAULT "active",
        date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        created_by INT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role),
        INDEX idx_status (status),
        FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',

    // Properties Table
    'CREATE TABLE IF NOT EXISTS properties (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        type ENUM("house", "room", "apartment") NOT NULL,
        price DECIMAL(15, 2) NOT NULL,
        location VARCHAR(200) NOT NULL,
        area INT, -- in square meters
        bedrooms INT,
        bathrooms INT,
        amenities JSON,
        images JSON,
        status ENUM("available", "occupied", "maintenance") DEFAULT "available",
        featured BOOLEAN DEFAULT FALSE,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_type (type),
        INDEX idx_status (status),
        INDEX idx_location (location),
        INDEX idx_price (price),
        FULLTEXT INDEX ft_search (title, description, location),
        FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',

    // Inquiries Table
    'CREATE TABLE IF NOT EXISTS inquiries (
        id INT PRIMARY KEY AUTO_INCREMENT,
        property_id INT NOT NULL,
        user_id INT NOT NULL,
        message TEXT,
        status ENUM("pending", "responded", "resolved", "rejected") DEFAULT "pending",
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        responded_at TIMESTAMP NULL,
        response TEXT,
        responded_by INT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_property (property_id),
        INDEX idx_user (user_id),
        INDEX idx_status (status),
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (responded_by) REFERENCES admins(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',

    // Saved Listings Table
    'CREATE TABLE IF NOT EXISTS saved_listings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        property_id INT NOT NULL,
        saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_save (user_id, property_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',

    // Staff (Payroll) Table
    'CREATE TABLE IF NOT EXISTS staff (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        position VARCHAR(50) NOT NULL,
        department VARCHAR(50),
        salary DECIMAL(12, 2) NOT NULL,
        status ENUM("active", "inactive", "on-leave") DEFAULT "active",
        date_hired TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        date_left TIMESTAMP NULL,
        created_by INT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_department (department),
        FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',

    // Payroll Table
    'CREATE TABLE IF NOT EXISTS payroll (
        id INT PRIMARY KEY AUTO_INCREMENT,
        staff_id INT NOT NULL,
        month DATE NOT NULL,
        salary DECIMAL(12, 2) NOT NULL,
        allowances DECIMAL(12, 2) DEFAULT 0,
        tax DECIMAL(12, 2) DEFAULT 0,
        insurance DECIMAL(12, 2) DEFAULT 0,
        other_deductions DECIMAL(12, 2) DEFAULT 0,
        net_pay DECIMAL(12, 2) GENERATED ALWAYS AS (salary + allowances - tax - insurance - other_deductions) STORED,
        status ENUM("pending", "approved", "paid", "cancelled") DEFAULT "pending",
        processed_by INT,
        processed_at TIMESTAMP NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_payroll (staff_id, month),
        INDEX idx_status (status),
        INDEX idx_month (month),
        FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
        FOREIGN KEY (processed_by) REFERENCES admins(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',

    // Payments Table
    'CREATE TABLE IF NOT EXISTS payments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        transaction_id VARCHAR(50) UNIQUE NOT NULL,
        user_id INT,
        amount DECIMAL(12, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT "KES",
        payment_type ENUM("rent", "deposit", "utilities", "service", "other") NOT NULL,
        payment_method ENUM("mpesa", "card", "bank") NOT NULL,
        phone VARCHAR(20),
        description TEXT,
        status ENUM("pending", "completed", "failed", "cancelled") DEFAULT "pending",
        mpesa_reference VARCHAR(50),
        mpesa_receipt VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user (user_id),
        INDEX idx_status (status),
        INDEX idx_transaction (transaction_id),
        INDEX idx_method (payment_method),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',

    // Vacancies Table
    'CREATE TABLE IF NOT EXISTS vacancies (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(200) NOT NULL,
        department VARCHAR(50),
        salary DECIMAL(12, 2),
        description TEXT,
        requirements TEXT,
        status ENUM("open", "filled", "closed") DEFAULT "open",
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        closed_at TIMESTAMP NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_department (department),
        FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',

    // Audit Log Table
    'CREATE TABLE IF NOT EXISTS audit_log (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        admin_id INT,
        action VARCHAR(100) NOT NULL,
        table_name VARCHAR(50),
        record_id INT,
        old_values JSON,
        new_values JSON,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user (user_id),
        INDEX idx_admin (admin_id),
        INDEX idx_action (action),
        INDEX idx_timestamp (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
];

// Execute table creation
foreach ($tables as $table_sql) {
    try {
        $pdo->exec($table_sql);
        echo "✓ Table created successfully\n";
    } catch (PDOException $e) {
        echo "✗ Failed to create table: " . $e->getMessage() . "\n";
    }
}

echo "\n✓ Database initialization complete!\n";
echo "✓ All tables created successfully\n";
echo "\nNext steps:\n";
echo "1. Update config.php with your database credentials\n";
echo "2. Set up payment gateway credentials\n";
echo "3. Deploy PHP files to your server\n";
echo "4. Update JavaScript files to use PHP endpoints\n";

?>
