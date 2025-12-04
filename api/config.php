<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// File paths
define('USERS_FILE', __DIR__ . '/data/users.json');
define('LEAVES_FILE', __DIR__ . '/data/leaves.json');

// Helper functions
function readJSON($file) {
    if (!file_exists($file)) {
        return [];
    }
    $content = file_get_contents($file);
    return json_decode($content, true) ?: [];
}

function writeJSON($file, $data) {
    return file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}

function getNextId($data) {
    if (empty($data)) {
        return 1;
    }
    $ids = array_column($data, 'id');
    return max($ids) + 1;
}
?>
