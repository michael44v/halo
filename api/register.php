<?php
// api/register.php
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

if (!$input) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON payload"]);
    exit;
}

$fullName = trim($input['full_name'] ?? '');
$email = trim($input['email'] ?? '');
$phone = trim($input['phone'] ?? '');
$categoryAmount = floatval($input['category_amount'] ?? 5000);
$paymentMethod = trim($input['payment_method'] ?? 'korapay');

if (empty($fullName) || empty($email) || empty($phone)) {
    echo json_encode(["status" => "error", "message" => "All fields (Full Name, Email, Phone) are required"]);
    exit;
}

$db = (new Database())->getConnection();

// Check if email already registered
$checkStmt = $db->prepare("SELECT id, payment_status, virtual_account_number, bank_name, username FROM users WHERE email = ?");
$checkStmt->bind_param("s", $email);
$checkStmt->execute();
$res = $checkStmt->get_result();

if ($row = $res->fetch_assoc()) {
    if ($row['payment_status'] === 'completed') {
        echo json_encode(["status" => "error", "message" => "Email is already registered and activated. Please log in."]);
        exit;
    } else {
        // Return existing virtual account for pending user
        echo json_encode([
            "status" => "success",
            "message" => "Registration pending payment",
            "user_id" => $row['id'],
            "email" => $email,
            "category_amount" => $categoryAmount,
            "virtual_account_number" => $row['virtual_account_number'],
            "bank_name" => $row['bank_name'],
            "account_name" => "Halo Survey - " . $row['username']
        ]);
        exit;
    }
}
$checkStmt->close();

// Generate username and virtual account details for Korapay
$username = strtolower(explode(' ', $fullName)[0]) . rand(100, 999);
$virtualAcc = "99" . rand(10000000, 99999999); // 10 digit Korapay simulated account
$bankName = "Korapay Virtual Bank (Wema / Sterling)";
$taskReward = $categoryAmount * 0.25;

// Generate temporary secure password
$plainPassword = "Halo" . rand(1000, 9999) . "!";
$passwordHash = password_hash($plainPassword, PASSWORD_BCRYPT);

$stmt = $db->prepare("INSERT INTO users (full_name, email, phone, username, password_hash, category_amount, task_reward, payment_method, payment_status, virtual_account_number, bank_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)");
$stmt->bind_param("ssssddssss", $fullName, $email, $phone, $username, $passwordHash, $categoryAmount, $taskReward, $paymentMethod, $virtualAcc, $bankName);

if ($stmt->execute()) {
    $userId = $stmt->insert_id;
    $stmt->close();

    // Create payment transaction record
    $ref = "KORA_" . time() . "_" . $userId;
    $payStmt = $db->prepare("INSERT INTO payments (user_id, reference, amount, status, payment_method) VALUES (?, ?, ?, 'pending', ?)");
    $payStmt->bind_param("isds", $userId, $ref, $categoryAmount, $paymentMethod);
    $payStmt->execute();
    $payStmt->close();

    echo json_encode([
        "status" => "success",
        "message" => "Registration initiated. Please complete payment.",
        "user_id" => $userId,
        "email" => $email,
        "username" => $username,
        "temp_password" => $plainPassword,
        "category_amount" => $categoryAmount,
        "task_reward" => $taskReward,
        "virtual_account_number" => $virtualAcc,
        "bank_name" => $bankName,
        "account_name" => "Halo Survey - " . $fullName,
        "payment_reference" => $ref
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to create user record: " . $db->error]);
}
