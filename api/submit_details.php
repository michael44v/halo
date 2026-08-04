<?php
// api/submit_details.php

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
    $input = $_POST;
}

// Validate required fields
if (!isset($input['id']) || !isset($input['dynamic_data'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields: id and/or dynamic_data"
    ]);
    exit;
}

try {
    $pdo = getPDO(true);

    // Check if submission exists
    $checkStmt = $pdo->prepare("SELECT id FROM submissions WHERE id = :id");
    $checkStmt->execute([':id' => $input['id']]);
    if (!$checkStmt->fetch()) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Submission with ID " . htmlspecialchars($input['id']) . " not found"
        ]);
        exit;
    }

    // Update submission details
    $stmt = $pdo->prepare("
        UPDATE submissions
        SET dynamic_data = :dynamic_data,
            status = 'awaiting_approval'
        WHERE id = :id
    ");

    // Store dynamic_data as JSON
    $dynamicDataJson = is_string($input['dynamic_data']) ? $input['dynamic_data'] : json_encode($input['dynamic_data']);

    $stmt->execute([
        ':dynamic_data' => $dynamicDataJson,
        ':id'           => $input['id']
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Dynamic details submitted and status set to awaiting approval."
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database Error: " . $e->getMessage()
    ]);
}
