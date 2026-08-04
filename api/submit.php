<?php
// api/submit.php

require_once __DIR__ . '/config.php';

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method Not Allowed"]);
    exit;
}

// Read JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    // Fallback to $_POST if not JSON
    $input = $_POST;
}

// Validate required fields
$requiredFields = ['full_name', 'email', 'phone_number', 'business', 'selected_option', 'password'];
$missing = [];

foreach ($requiredFields as $field) {
    if (!isset($input[$field]) || trim($input[$field]) === '') {
        $missing[] = $field;
    }
}

if (!empty($missing)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields: " . implode(', ', $missing)
    ]);
    exit;
}

try {
    $pdo = getPDO(true);

    // Prepare INSERT statement using PDO to prevent SQL Injection
    $stmt = $pdo->prepare("
        INSERT INTO submissions (
            full_name,
            email,
            phone_number,
            business,
            selected_option,
            extra_field_1,
            extra_field_2,
            extra_field_3,
            password,
            status
        ) VALUES (
            :full_name,
            :email,
            :phone_number,
            :business,
            :selected_option,
            :extra_field_1,
            :extra_field_2,
            :extra_field_3,
            :password,
            'awaiting_approval'
        )
    ");

    $stmt->execute([
        ':full_name'       => $input['full_name'],
        ':email'           => $input['email'],
        ':phone_number'    => $input['phone_number'],
        ':business'        => $input['business'],
        ':selected_option' => $input['selected_option'],
        ':extra_field_1'   => $input['extra_field_1'] ?? null,
        ':extra_field_2'   => $input['extra_field_2'] ?? null,
        ':extra_field_3'   => $input['extra_field_3'] ?? null,
        ':password'        => $input['password'], // Stored as plain text per requirements
    ]);

    $id = $pdo->lastInsertId();

    echo json_encode([
        "success" => true,
        "message" => "Submission initial phase created successfully.",
        "id" => intval($id)
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database Error: " . $e->getMessage()
    ]);
}
