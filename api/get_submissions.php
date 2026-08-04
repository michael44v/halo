<?php
// api/get_submissions.php

require_once __DIR__ . '/config.php';

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method Not Allowed"]);
    exit;
}

try {
    $pdo = getPDO(true);

    $stmt = $pdo->query("SELECT * FROM submissions ORDER BY created_at DESC");
    $submissions = $stmt->fetchAll();

    // Convert dynamic_data JSON string to associative array
    foreach ($submissions as &$sub) {
        if (isset($sub['dynamic_data']) && is_string($sub['dynamic_data'])) {
            $sub['dynamic_data'] = json_decode($sub['dynamic_data'], true);
        }
    }
    unset($sub); // Break the reference

    echo json_encode([
        "success" => true,
        "submissions" => $submissions
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database Error: " . $e->getMessage()
    ]);
}
