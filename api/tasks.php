<?php
// api/tasks.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/Database.php';

$userId = intval($_GET['user_id'] ?? 0);

if (!$userId) {
    echo json_encode(["status" => "error", "message" => "User ID is required"]);
    exit;
}

$db = (new Database())->getConnection();

// Fetch user data
$userStmt = $db->prepare("SELECT id, full_name, category_amount, task_reward, balance FROM users WHERE id = ?");
$userStmt->bind_param("i", $userId);
$userStmt->execute();
$userRes = $userStmt->get_result();
$user = $userRes->fetch_assoc();
$userStmt->close();

if (!$user) {
    echo json_encode(["status" => "error", "message" => "User not found"]);
    exit;
}

// Fetch all defined tasks sorted by step_number
$tasksRes = $db->query("SELECT * FROM tasks ORDER BY step_number ASC, id ASC");
$allTasks = [];
while ($row = $tasksRes->fetch_assoc()) {
    $allTasks[] = $row;
}

// Fetch user task submissions
$userTasksStmt = $db->prepare("SELECT task_id, proof_link, status, rejection_reason FROM user_tasks WHERE user_id = ?");
$userTasksStmt->bind_param("i", $userId);
$userTasksStmt->execute();
$userTasksRes = $userTasksStmt->get_result();

$userSubmissions = [];
while ($sub = $userTasksRes->fetch_assoc()) {
    $userSubmissions[$sub['task_id']] = $sub;
}
$userTasksStmt->close();

// Build sequential task list with unlock status
$tasksWithStatus = [];
$canUnlockNext = true; // First task is unlocked by default

foreach ($allTasks as $index => $task) {
    $taskId = $task['id'];
    $submission = $userSubmissions[$taskId] ?? null;

    $status = $submission ? $submission['status'] : 'not_started';
    $proofLink = $submission ? $submission['proof_link'] : null;
    $rejectionReason = $submission ? $submission['rejection_reason'] : null;

    $isUnlocked = $canUnlockNext;

    // A task is completed if approved
    if ($status === 'approved') {
        $canUnlockNext = true;
    } else {
        // If pending approval, not started, or rejected, next task stays locked
        $canUnlockNext = false;
    }

    $tasksWithStatus[] = [
        "id" => $task['id'],
        "title" => $task['title'],
        "description" => $task['description'],
        "hashtags" => $task['hashtags'],
        "step_number" => $task['step_number'],
        "status" => $status, // 'not_started', 'pending_approval', 'approved', 'rejected'
        "proof_link" => $proofLink,
        "rejection_reason" => $rejectionReason,
        "is_unlocked" => $isUnlocked
    ];
}

echo json_encode([
    "status" => "success",
    "user" => $user,
    "tasks" => $tasksWithStatus
]);
