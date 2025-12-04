<?php
include_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Fetch leave history for a specific user
    if (isset($_GET['user_id'])) {
        $user_id = intval($_GET['user_id']);
        $leaves = readJSON(LEAVES_FILE);
        
        // Filter leaves by user_id
        $userLeaves = array_filter($leaves, function($leave) use ($user_id) {
            return $leave['user_id'] == $user_id;
        });
        
        // Re-index array and sort by created_at descending
        $userLeaves = array_values($userLeaves);
        usort($userLeaves, function($a, $b) {
            return strtotime($b['created_at']) - strtotime($a['created_at']);
        });
        
        echo json_encode($userLeaves);
    }
} elseif ($method === 'POST') {
    // Apply for leave
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['user_id']) && isset($data['leave_type']) && isset($data['start_date']) && isset($data['end_date'])) {
        $leaves = readJSON(LEAVES_FILE);
        
        $newLeave = [
            'id' => getNextId($leaves),
            'user_id' => intval($data['user_id']),
            'leave_type' => $data['leave_type'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'reason' => $data['reason'] ?? '',
            'status' => 'pending',
            'created_at' => date('Y-m-d H:i:s')
        ];
        
        $leaves[] = $newLeave;
        
        if (writeJSON(LEAVES_FILE, $leaves)) {
            echo json_encode(["status" => "success", "message" => "Leave application submitted"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to submit leave"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Incomplete data"]);
    }
}
?>
