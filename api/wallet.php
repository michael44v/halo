<?php
// api/wallet.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/Database.php';

$db = (new Database())->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $userId = intval($_GET['user_id'] ?? 0);
    if (!$userId) {
        echo json_encode(["status" => "error", "message" => "User ID is required"]);
        exit;
    }

    $stmt = $db->prepare("SELECT account_name, account_number, bank_name FROM wallets WHERE user_id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $res = $stmt->get_result();

    if ($wallet = $res->fetch_assoc()) {
        $stmt->close();
        echo json_encode(["status" => "success", "wallet" => $wallet]);
    } else {
        $stmt->close();
        echo json_encode(["status" => "success", "wallet" => null]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $userId = intval($input['user_id'] ?? 0);
    $accountName = trim($input['account_name'] ?? '');
    $accountNumber = trim($input['account_number'] ?? '');
    $bankName = trim($input['bank_name'] ?? '');

    if (!$userId || empty($accountName) || empty($accountNumber) || empty($bankName)) {
        echo json_encode(["status" => "error", "message" => "All wallet fields are required"]);
        exit;
    }

    $stmt = $db->prepare("INSERT INTO wallets (user_id, account_name, account_number, bank_name) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE account_name = VALUES(account_name), account_number = VALUES(account_number), bank_name = VALUES(bank_name)");
    $stmt->bind_param("isss", $userId, $accountName, $accountNumber, $bankName);

    if ($stmt->execute()) {
        $stmt->close();
        echo json_encode([
            "status" => "success",
            "message" => "Bank details saved successfully",
            "wallet" => [
                "account_name" => $accountName,
                "account_number" => $accountNumber,
                "bank_name" => $bankName
            ]
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to save bank details: " . $db->error]);
    }
    exit;
}
