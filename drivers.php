<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            // Get single driver with user details
            $query = "SELECT d.*, u.email, u.full_name, u.role 
                     FROM drivers d 
                     JOIN users u ON d.user_id = u.id 
                     WHERE d.id = ?";
            $stmt = $db->prepare($query);
            $stmt->execute([$_GET['id']]);
            $driver = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($driver) {
                echo json_encode([
                    "status" => "success",
                    "data" => $driver
                ]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Driver not found"]);
            }
        } else {
            // Get all drivers with user details
            $query = "SELECT d.*, u.email, u.full_name, u.role 
                     FROM drivers d 
                     JOIN users u ON d.user_id = u.id";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $drivers = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                "status" => "success",
                "data" => $drivers
            ]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        if (
            isset($data->user_id) && isset($data->license_number) && isset($data->license_expiry)
            && isset($data->name) && isset($data->experience) && isset($data->vehicle)
            && isset($data->hours) && isset($data->rating)
        ) {
            $query = "INSERT INTO drivers (user_id, license_number, license_expiry, name, experience, vehicle, hours, rating, avatar)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $db->prepare($query);
            
            if ($stmt->execute([
                $data->user_id, $data->license_number, $data->license_expiry,
                $data->name, $data->experience, $data->vehicle, $data->hours, $data->rating, $data->avatar ?? null
            ])) {
                $data->id = $db->lastInsertId();
                echo json_encode([
                    "status" => "success",
                    "message" => "Driver added successfully",
                    "data" => $data
                ]);
            } else {
                http_response_code(500);
                $errorInfo = $stmt->errorInfo();
                echo json_encode([
                    "status" => "error",
                    "message" => "Failed to add driver",
                    "error" => $errorInfo
                ]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing required fields"]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        
        if (isset($data->id)) {
            $updates = [];
            $params = [];
            
            if (isset($data->license_number)) {
                $updates[] = "license_number = ?";
                $params[] = $data->license_number;
            }
            if (isset($data->license_expiry)) {
                $updates[] = "license_expiry = ?";
                $params[] = $data->license_expiry;
            }
            if (isset($data->status)) {
                $updates[] = "status = ?";
                $params[] = $data->status;
            }
            
            if (!empty($updates)) {
                $params[] = $data->id;
                $query = "UPDATE drivers SET " . implode(", ", $updates) . " WHERE id = ?";
                $stmt = $db->prepare($query);
                
                if ($stmt->execute($params)) {
                    echo json_encode([
                        "status" => "success",
                        "message" => "Driver updated successfully"
                    ]);
                } else {
                    http_response_code(500);
                    echo json_encode(["status" => "error", "message" => "Failed to update driver"]);
                }
            } else {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "No fields to update"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Driver ID is required"]);
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $query = "DELETE FROM drivers WHERE id = ?";
            $stmt = $db->prepare($query);
            
            if ($stmt->execute([$_GET['id']])) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Driver deleted successfully"
                ]);
            } else {
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => "Failed to delete driver"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Driver ID is required"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}
?> 