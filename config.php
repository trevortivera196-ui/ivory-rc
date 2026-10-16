<?php
// ============================================
// IVORY APARTMENT - DATABASE CONFIGURATION
// ============================================

// Database Connection Settings
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'ivory_apartment');

// Application Settings
define('APP_NAME', 'Ivory Apartment');
define('APP_VERSION', '1.0');
define('APP_URL', 'http://localhost/IVORY%20APARTMENT');

// API Settings
define('API_VERSION', 'v1');
define('API_TIMEOUT', 30);

// Security Settings
define('JWT_SECRET', 'ivory_apartment_secret_key_2026');
define('PASSWORD_HASH_ALGO', 'bcrypt');
define('SESSION_TIMEOUT', 3600); // 1 hour

// File Upload Settings
define('UPLOAD_DIR', __DIR__ . '/uploads/');
define('ALLOWED_EXTENSIONS', ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png']);
define('MAX_UPLOAD_SIZE', 5 * 1024 * 1024); // 5MB

// Email Settings
define('MAIL_FROM', 'noreply@ivoryapartment.com');
define('MAIL_FROM_NAME', 'Ivory Apartment');
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'your-email@gmail.com');
define('SMTP_PASS', 'your-app-password');

// Payment Settings
define('MPESA_BUSINESS_SHORT_CODE', '174379');
define('MPESA_CONSUMER_KEY', 'YOUR_CONSUMER_KEY');
define('MPESA_CONSUMER_SECRET', 'YOUR_CONSUMER_SECRET');
define('MPESA_PASSKEY', 'YOUR_PASSKEY');
define('MPESA_ENVIRONMENT', 'sandbox'); // 'production' for live
define('MPESA_CALLBACK_URL', APP_URL . '/api/payment-callback.php');

// Logging Settings
define('LOG_DIR', __DIR__ . '/logs/');
define('LOG_LEVEL', 'INFO'); // DEBUG, INFO, WARNING, ERROR

// ============================================
// DATABASE CONNECTION
// ============================================

try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_PERSISTENT => false
        ]
    );
    
    // Set timezone
    $pdo->exec("SET time_zone = '+00:00'");
    
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode([
        'success' => false,
        'message' => 'Database connection failed',
        'error' => getenv('DEBUG') ? $e->getMessage() : 'Contact administrator'
    ]));
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Hash password using bcrypt
 */
function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
}

/**
 * Verify password
 */
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

/**
 * Generate JWT token
 */
function generateToken($data) {
    $header = json_encode(['alg' => 'HS256', 'typ' => 'JWT']);
    $payload = json_encode($data);
    $signature = hash_hmac('sha256', base64_encode($header) . '.' . base64_encode($payload), JWT_SECRET);
    
    return base64_encode($header) . '.' . base64_encode($payload) . '.' . base64_encode($signature);
}

/**
 * Verify JWT token
 */
function verifyToken($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return false;
    }
    
    $header = json_decode(base64_decode($parts[0]), true);
    $payload = json_decode(base64_decode($parts[1]), true);
    $signature = base64_decode($parts[2]);
    
    $expected_signature = hash_hmac('sha256', $parts[0] . '.' . $parts[1], JWT_SECRET);
    
    return hash_equals($expected_signature, bin2hex($signature)) ? $payload : false;
}

/**
 * Log message
 */
function logMessage($level, $message, $data = []) {
    if (!is_dir(LOG_DIR)) {
        mkdir(LOG_DIR, 0755, true);
    }
    
    $log_file = LOG_DIR . date('Y-m-d') . '.log';
    $timestamp = date('Y-m-d H:i:s');
    $log_entry = "[$timestamp] [$level] $message";
    
    if (!empty($data)) {
        $log_entry .= ' - ' . json_encode($data);
    }
    
    $log_entry .= "\n";
    
    file_put_contents($log_file, $log_entry, FILE_APPEND);
}

/**
 * Send JSON response
 */
function sendResponse($success = true, $message = '', $data = [], $code = 200) {
    http_response_code($code);
    
    $response = [
        'success' => $success,
        'message' => $message,
        'data' => $data,
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

/**
 * Get user from request
 */
function getAuthUser() {
    $headers = getallheaders();
    $token = null;
    
    if (isset($headers['Authorization'])) {
        preg_match('/Bearer\s+(.*)$/i', $headers['Authorization'], $matches);
        $token = $matches[1] ?? null;
    }
    
    if (!$token) {
        return null;
    }
    
    return verifyToken($token);
}

/**
 * Require authentication
 */
function requireAuth() {
    $user = getAuthUser();
    
    if (!$user) {
        sendResponse(false, 'Unauthorized', [], 401);
    }
    
    return $user;
}

/**
 * Validate required fields
 */
function validateRequired($data, $fields) {
    $missing = [];
    
    foreach ($fields as $field) {
        if (empty($data[$field])) {
            $missing[] = $field;
        }
    }
    
    if (!empty($missing)) {
        sendResponse(false, 'Missing required fields: ' . implode(', ', $missing), [], 400);
    }
}

/**
 * Sanitize input
 */
function sanitize($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

/**
 * Generate unique ID
 */
function generateUniqueId() {
    return uniqid('ID_', true);
}

/**
 * Enable CORS
 */
function enableCORS() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

?>
