<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($data->email) && isset($data->password)) {
        // Login
        $query = "SELECT id, email, password, full_name, role FROM users WHERE email = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$data->email]);
        
        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if (password_verify($data->password, $row['password'])) {
                // Generate JWT token
                $token = bin2hex(random_bytes(32));
                
                echo json_encode([
                    "status" => "success",
                    "message" => "Login successful",
                    "data" => [
                        "token" => $token,
                        "user" => [
                            "id" => $row['id'],
                            "email" => $row['email'],
                            "full_name" => $row['full_name'],
                            "role" => $row['role']
                        ]
                    ]
                ]);
            } else {
                http_response_code(401);
                echo json_encode(["status" => "error", "message" => "Invalid password"]);
            }
        } else {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "User not found"]);
        }
    } elseif (isset($data->email) && isset($data->password) && isset($data->full_name)) {
        // Register
        $query = "INSERT INTO users (email, password, full_name, role) VALUES (?, ?, ?, ?)";
        $stmt = $db->prepare($query);
        $hashed_password = password_hash($data->password, PASSWORD_DEFAULT);
        $role = isset($data->role) ? $data->role : 'driver';
        
        if ($stmt->execute([$data->email, $hashed_password, $data->full_name, $role])) {
            echo json_encode([
                "status" => "success",
                "message" => "User registered successfully"
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Registration failed"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}
?> 