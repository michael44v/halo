<?php
// api/update_status.php

require_once __DIR__ . '/config.php';

header("Content-Type: application/json");

$allowedMethods = ['POST', 'PATCH'];
if (!in_array($_SERVER['REQUEST_METHOD'], $allowedMethods)) {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method Not Allowed"]);
    exit;
}

// Read JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    $input = $_POST;
}

if (!isset($input['id']) || !isset($input['status'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields: id and/or status"
    ]);
    exit;
}

$allowedStatuses = ['awaiting_approval', 'approved', 'rejected'];
if (!in_array($input['status'], $allowedStatuses)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid status value. Allowed values are: " . implode(', ', $allowedStatuses)
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

    // Update submission status
    $stmt = $pdo->prepare("
        UPDATE submissions
        SET status = :status
        WHERE id = :id
    ");

    $stmt->execute([
        ':status' => $input['status'],
        ':id'     => $input['id']
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Submission status updated successfully to: " . htmlspecialchars($input['status'])
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database Error: " . $e->getMessage()
    ]);
}
