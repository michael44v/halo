<?php
// api/admin.php
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

$action = $_GET['action'] ?? ($_POST['action'] ?? '');
if (empty($action)) {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? '';
}

// Action: GET ALL SUBMISSIONS FOR ADMIN
if ($action === 'get_submissions' || $_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "SELECT ut.id as submission_id, ut.user_id, ut.task_id, ut.proof_link, ut.status, ut.submitted_at,
                     u.full_name, u.email, u.category_amount, u.task_reward,
                     t.title as task_title, t.step_number
              FROM user_tasks ut
              JOIN users u ON ut.user_id = u.id
              JOIN tasks t ON ut.task_id = t.id
              ORDER BY ut.submitted_at DESC";

    $res = $db->query($query);
    $submissions = [];
    while ($row = $res->fetch_assoc()) {
        $submissions[] = $row;
    }

    // Also get all tasks
    $tasksRes = $db->query("SELECT * FROM tasks ORDER BY step_number ASC");
    $tasks = [];
    while ($t = $tasksRes->fetch_assoc()) {
        $tasks[] = $t;
    }

    echo json_encode([
        "status" => "success",
        "submissions" => $submissions,
        "tasks" => $tasks
    ]);
    exit;
}

// Action: REVIEW PROOF (APPROVE / REJECT)
if ($action === 'review_proof') {
    $input = json_decode(file_get_contents('php://input'), true);
    $submissionId = intval($input['submission_id'] ?? 0);
    $newStatus = $input['status'] ?? ''; // 'approved' or 'rejected'
    $reason = trim($input['rejection_reason'] ?? '');

    if (!$submissionId || !in_array($newStatus, ['approved', 'rejected'])) {
        echo json_encode(["status" => "error", "message" => "Invalid parameters for review"]);
        exit;
    }

    // Get submission details
    $subStmt = $db->prepare("SELECT ut.user_id, ut.task_id, ut.status as old_status, u.task_reward FROM user_tasks ut JOIN users u ON ut.user_id = u.id WHERE ut.id = ?");
    $subStmt->bind_param("i", $submissionId);
    $subStmt->execute();
    $subRes = $subStmt->get_result();
    $sub = $subRes->fetch_assoc();
    $subStmt->close();

    if (!$sub) {
        echo json_encode(["status" => "error", "message" => "Submission not found"]);
        exit;
    }

    // Update submission status
    $stmt = $db->prepare("UPDATE user_tasks SET status = ?, rejection_reason = ?, reviewed_at = NOW() WHERE id = ?");
    $stmt->bind_param("ssi", $newStatus, $reason, $submissionId);

    if ($stmt->execute()) {
        $stmt->close();

        // If newly approved, credit user balance with task_reward (25% of category)
        if ($newStatus === 'approved' && $sub['old_status'] !== 'approved') {
            $reward = floatval($sub['task_reward']);
            $userId = intval($sub['user_id']);
            $balStmt = $db->prepare("UPDATE users SET balance = balance + ? WHERE id = ?");
            $balStmt->bind_param("di", $reward, $userId);
            $balStmt->execute();
            $balStmt->close();
        }

        echo json_encode(["status" => "success", "message" => "Task proof status updated to " . $newStatus]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to update submission: " . $db->error]);
    }
    exit;
}

// Action: ADD TASK
if ($action === 'add_task') {
    $input = json_decode(file_get_contents('php://input'), true);
    $title = trim($input['title'] ?? '');
    $description = trim($input['description'] ?? '');
    $hashtags = trim($input['hashtags'] ?? '#haloSurvey #HSG');
    $stepNumber = intval($input['step_number'] ?? 1);

    if (empty($title) || empty($description)) {
        echo json_encode(["status" => "error", "message" => "Task title and description are required"]);
        exit;
    }

    $stmt = $db->prepare("INSERT INTO tasks (title, description, hashtags, step_number) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sssi", $title, $description, $hashtags, $stepNumber);

    if ($stmt->execute()) {
        $taskId = $stmt->insert_id;
        $stmt->close();
        echo json_encode(["status" => "success", "message" => "Task added successfully", "task_id" => $taskId]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to add task: " . $db->error]);
    }
    exit;
}

// Action: DELETE TASK
if ($action === 'delete_task') {
    $input = json_decode(file_get_contents('php://input'), true);
    $taskId = intval($input['task_id'] ?? 0);

    if (!$taskId) {
        echo json_encode(["status" => "error", "message" => "Task ID is required"]);
        exit;
    }

    $stmt = $db->prepare("DELETE FROM tasks WHERE id = ?");
    $stmt->bind_param("i", $taskId);

    if ($stmt->execute()) {
        $stmt->close();
        echo json_encode(["status" => "success", "message" => "Task deleted successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to delete task: " . $db->error]);
    }
    exit;
}
