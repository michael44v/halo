<?php
// api/login.php
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

$usernameOrEmail = trim($input['username'] ?? '');
$password = trim($input['password'] ?? '');

if (empty($usernameOrEmail) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "Username/Email and password are required"]);
    exit;
}

$db = (new Database())->getConnection();

$stmt = $db->prepare("SELECT id, full_name, email, phone, username, password_hash, role, category_amount, task_reward, balance, payment_status FROM users WHERE username = ? OR email = ?");
$stmt->bind_param("ss", $usernameOrEmail, $usernameOrEmail);
$stmt->execute();
$res = $stmt->get_result();

if ($user = $res->fetch_assoc()) {
    $stmt->close();

    if ($user['payment_status'] !== 'completed' && $user['role'] !== 'admin') {
        echo json_encode(["status" => "error", "message" => "Registration payment not completed. Please finish registration payment."]);
        exit;
    }

    if (password_verify($password, $user['password_hash'])) {
        unset($user['password_hash']);
        echo json_encode([
            "status" => "success",
            "message" => "Login successful",
            "user" => $user
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
    }
} else {
    $stmt->close();
    echo json_encode(["status" => "error", "message" => "User not found"]);
}
