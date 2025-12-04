<?php
include_once 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['username']) && isset($data['password'])) {
    $username = $data['username'];
    $password = $data['password'];

    $users = readJSON(USERS_FILE);

    foreach ($users as $user) {
        if ($user['username'] === $username && $user['password'] === $password) {
            // Remove password from response
            unset($user['password']);
            echo json_encode([
                "status" => "success",
                "message" => "Login successful",
                "user" => $user
            ]);
            exit();
        }
    }

    echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
} else {
    echo json_encode(["status" => "error", "message" => "Incomplete data"]);
}
?>
