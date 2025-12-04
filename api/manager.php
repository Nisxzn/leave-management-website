<?php
include_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Fetch all leaves with user details
    $leaves = readJSON(LEAVES_FILE);
    $users = readJSON(USERS_FILE);
    
    // Create a user lookup map
    $userMap = [];
    foreach ($users as $user) {
        $userMap[$user['id']] = $user;
    }
    
    // Enrich leaves with user details
    $enrichedLeaves = array_map(function($leave) use ($userMap) {
        if (isset($userMap[$leave['user_id']])) {
            $leave['full_name'] = $userMap[$leave['user_id']]['full_name'];
            $leave['username'] = $userMap[$leave['user_id']]['username'];
        }
        return $leave;
    }, $leaves);
    
    // Sort by created_at descending
    usort($enrichedLeaves, function($a, $b) {
        return strtotime($b['created_at']) - strtotime($a['created_at']);
    });
    
    echo json_encode($enrichedLeaves);

} elseif ($method === 'POST') {
    // Update leave status
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['id']) && isset($data['status'])) {
        $leaves = readJSON(LEAVES_FILE);
        $updated = false;
        
        foreach ($leaves as &$leave) {
            if ($leave['id'] == $data['id']) {
                $leave['status'] = $data['status'];
                $updated = true;
                break;
            }
        }
        
        if ($updated && writeJSON(LEAVES_FILE, $leaves)) {
            echo json_encode(["status" => "success", "message" => "Leave status updated"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to update status"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Incomplete data"]);
    }
}
?>
