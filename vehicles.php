<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    $method = $_SERVER['REQUEST_METHOD'];

    switch($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                // Get single vehicle
                $query = "SELECT * FROM vehicles WHERE id = ?";
                $stmt = $db->prepare($query);
                $stmt->execute([$_GET['id']]);
                $vehicle = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($vehicle) {
                    echo json_encode([
                        "status" => "success",
                        "data" => $vehicle
                    ]);
                } else {
                    http_response_code(404);
                    echo json_encode([
                        "status" => "error",
                        "message" => "Vehicle not found"
                    ]);
                }
            } else {
                // Get all vehicles
                $query = "SELECT * FROM vehicles";
                $stmt = $db->prepare($query);
                $stmt->execute();
                $vehicles = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                echo json_encode([
                    "status" => "success",
                    "data" => $vehicles
                ]);
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"));
            
            if (isset($data->name) && isset($data->type) && isset($data->model) && 
                isset($data->year) && isset($data->status) && isset($data->licensePlate)) {
                
                // Generate a unique vehicle_id
                $vehicle_id = 'VH' . strtoupper(substr(md5(uniqid()), 0, 6));
                
                $query = "INSERT INTO vehicles (vehicle_id, name, type, model, year, status, license_plate) 
                         VALUES (?, ?, ?, ?, ?, ?, ?)";
                $stmt = $db->prepare($query);
                
                if ($stmt->execute([
                    $vehicle_id,
                    $data->name,
                    $data->type,
                    $data->model,
                    $data->year,
                    $data->status,
                    $data->licensePlate
                ])) {
                    $data->id = $db->lastInsertId();
                    $data->vehicle_id = $vehicle_id;
                    echo json_encode([
                        "status" => "success",
                        "message" => "Vehicle added successfully",
                        "data" => $data
                    ]);
                } else {
                    http_response_code(500);
                    echo json_encode([
                        "status" => "error",
                        "message" => "Failed to add vehicle"
                    ]);
                }
            } else {
                http_response_code(400);
                echo json_encode([
                    "status" => "error",
                    "message" => "Missing required fields"
                ]);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode([
                "status" => "error",
                "message" => "Method not allowed"
            ]);
            break;
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage()
    ]);
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Server error: " . $e->getMessage()
    ]);
}
?> 