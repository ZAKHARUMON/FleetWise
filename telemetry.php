<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if (isset($_GET['vehicle_id'])) {
            // Get telemetry data for a specific vehicle
            $query = "SELECT * FROM telemetry WHERE vehicle_id = ? ORDER BY timestamp DESC LIMIT 100";
            $stmt = $db->prepare($query);
            $stmt->execute([$_GET['vehicle_id']]);
            $telemetry = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                "status" => "success",
                "data" => $telemetry
            ]);
        } else {
            // Get all telemetry data
            $query = "SELECT * FROM telemetry ORDER BY timestamp DESC LIMIT 100";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $telemetry = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                "status" => "success",
                "data" => $telemetry
            ]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        if (isset($data->vehicle_id) && isset($data->latitude) && isset($data->longitude) && 
            isset($data->speed) && isset($data->fuel_level) && isset($data->engine_status) &&
            isset($data->pollution_ppm)) {
            
            $query = "INSERT INTO telemetry (vehicle_id, latitude, longitude, speed, fuel_level, engine_status, pollution_ppm) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)";
            $stmt = $db->prepare($query);
            
            if ($stmt->execute([
                $data->vehicle_id,
                $data->latitude,
                $data->longitude,
                $data->speed,
                $data->fuel_level,
                $data->engine_status,
                $data->pollution_ppm
            ])) {
                $data->id = $db->lastInsertId();
                echo json_encode([
                    "status" => "success",
                    "message" => "Telemetry data added successfully",
                    "data" => $data
                ]);
            } else {
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => "Failed to add telemetry data"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing required fields"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}
?> 