<?php
// api/verify_payment.php
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

if (!$userId) {
    echo json_encode(["status" => "error", "message" => "User ID is required"]);
    exit;
}

$db = (new Database())->getConnection();

// Fetch user details
$stmt = $db->prepare("SELECT id, full_name, email, username, payment_status, password_hash FROM users WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$res = $stmt->get_result();

if ($user = $res->fetch_assoc()) {
    $stmt->close();

    // Mark payment as completed
    $updateStmt = $db->prepare("UPDATE users SET payment_status = 'completed' WHERE id = ?");
    $updateStmt->bind_param("i", $userId);
    $updateStmt->execute();
    $updateStmt->close();

    // Update payment record
    $payStmt = $db->prepare("UPDATE payments SET status = 'successful' WHERE user_id = ? AND status = 'pending'");
    $payStmt->bind_param("i", $userId);
    $payStmt->execute();
    $payStmt->close();

    // Prepare simulated email body as specified in wireframe image
    $emailBody = "Registration Successful\nFind your login details below\n\nUsername: " . $user['username'] . "\nPassword: [Sent during registration]\n\nWelcome to the Halo Family";

    echo json_encode([
        "status" => "success",
        "message" => "Payment confirmed successfully",
        "email_details" => [
            "to" => $user['email'],
            "subject" => "Registration Successful - Welcome to Halo Family",
            "username" => $user['username'],
            "body" => $emailBody
        ]
    ]);
} else {
    $stmt->close();
    echo json_encode(["status" => "error", "message" => "User not found"]);
}
