<?php
// api/db_setup.php

require_once __DIR__ . '/config.php';

try {
    // 1. Connect without selecting a DB
    $pdo = getPDO(false);

    // 2. Create Database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS " . DB_NAME);

    // 3. Connect to the specific DB
    $pdo = getPDO(true);

    // 4. Create Table
    $tableSql = "CREATE TABLE IF NOT EXISTS submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone_number VARCHAR(50) NOT NULL,
        business VARCHAR(255) NOT NULL,
        selected_option VARCHAR(50) NOT NULL,
        extra_field_1 VARCHAR(255),
        extra_field_2 VARCHAR(255),
        extra_field_3 VARCHAR(255),
        password VARCHAR(255) NOT NULL,
        dynamic_data JSON,
        status ENUM('awaiting_approval', 'approved', 'rejected') DEFAULT 'awaiting_approval',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";

    $pdo->exec($tableSql);

    $response = [
        "success" => true,
        "message" => "Database and tables set up successfully."
    ];

    if (php_sapi_name() === 'cli') {
        echo "SUCCESS: Database and table checked/created.\n";
    } else {
        header("Content-Type: application/json");
        echo json_encode($response);
    }
} catch (Exception $e) {
    $response = [
        "success" => false,
        "message" => "Database Setup Failed: " . $e->getMessage()
    ];

    if (php_sapi_name() === 'cli') {
        echo "ERROR: " . $e->getMessage() . "\n";
    } else {
        header("Content-Type: application/json");
        http_response_code(500);
        echo json_encode($response);
    }
}
