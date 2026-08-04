<?php
// api/config.php

// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

define('DB_HOST', '127.0.0.1');
define('DB_USER', 'survey_user');
define('DB_PASS', 'survey_pass');
define('DB_NAME', 'survey_app');

function getPDO($select_db = true) {
    $dsn = "mysql:host=" . DB_HOST . ";charset=utf8mb4";
    if ($select_db) {
        $dsn .= ";dbname=" . DB_NAME;
    }

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        return $pdo;
    } catch (PDOException $e) {
        throw new Exception("Database Connection Failed: " . $e->getMessage());
    }
}
