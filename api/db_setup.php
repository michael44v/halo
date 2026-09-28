<?php
// api/db_setup.php - Auto-initialize DB and default data if needed
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/Database.php';

$db = (new Database())->getConnection();

// Create default admin user if not existing
$adminCheck = $db->query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
if ($adminCheck && $adminCheck->num_rows === 0) {
    $adminPassword = password_hash("admin123", PASSWORD_BCRYPT);
    $stmt = $db->prepare("INSERT INTO users (full_name, email, phone, username, password_hash, role, payment_status) VALUES (?, ?, ?, ?, ?, 'admin', 'completed')");
    $fullName = "Halo Admin";
    $email = "admin@halosurvey.com";
    $phone = "+2348000000000";
    $username = "admin";
    $stmt->bind_param("sssss", $fullName, $email, $phone, $username, $adminPassword);
    $stmt->execute();
    $stmt->close();
}

// Seed initial default daily tasks if table is empty
$tasksCheck = $db->query("SELECT id FROM tasks LIMIT 1");
if ($tasksCheck && $tasksCheck->num_rows === 0) {
    $defaultTasks = [
        [
            'title' => 'Make a post on Facebook about Halo',
            'description' => 'Make a public post on Facebook about Halo using the hashtags #haloSurvey #HSG',
            'hashtags' => '#haloSurvey #HSG',
            'step_number' => 1
        ],
        [
            'title' => 'Share Halo Survey link on Facebook or WhatsApp',
            'description' => 'Share the Halo survey registration link on your Facebook feed or story.',
            'hashtags' => '#HaloSurveyGiveaway',
            'step_number' => 2
        ],
        [
            'title' => 'Tag 3 friends in a Facebook post about Halo',
            'description' => 'Post a testimonial about earning on Halo and tag 3 friends.',
            'hashtags' => '#HaloEarn #HSG',
            'step_number' => 3
        ]
    ];

    $stmt = $db->prepare("INSERT INTO tasks (title, description, hashtags, step_number) VALUES (?, ?, ?, ?)");
    foreach ($defaultTasks as $task) {
        $stmt->bind_param("sssi", $task['title'], $task['description'], $task['hashtags'], $task['step_number']);
        $stmt->execute();
    }
    $stmt->close();
}

echo json_encode(["status" => "success", "message" => "Database initialized successfully"]);
