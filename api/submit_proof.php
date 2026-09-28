<?php
// api/submit_proof.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/Database.php';

$input = json_decode(file_get_contents('php://input'), true);

$userId = intval($input['user_id'] ?? 0);
$taskId = intval($input['task_id'] ?? 0);
$proofLink = trim($input['proof_link'] ?? '');

if (!$userId || !$taskId || empty($proofLink)) {
    echo json_encode(["status" => "error", "message" => "User ID, Task ID, and Proof Link are required"]);
    exit;
}

$db = (new Database())->getConnection();

// Upsert user task proof submission
$stmt = $db->prepare("INSERT INTO user_tasks (user_id, task_id, proof_link, status, submitted_at) VALUES (?, ?, ?, 'pending_approval', NOW()) ON DUPLICATE KEY UPDATE proof_link = VALUES(proof_link), status = 'pending_approval', submitted_at = NOW()");
$stmt->bind_param("iis", $userId, $taskId, $proofLink);

if ($stmt->execute()) {
    $stmt->close();
    echo json_encode([
        "status" => "success",
        "message" => "Proof submitted successfully. Awaiting admin approval.",
        "proof_status" => "pending_approval"
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to submit proof: " . $db->error]);
}
