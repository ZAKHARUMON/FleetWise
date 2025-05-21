<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/MPU6050Handler.php';

// Get database connection
$database = new Database();
$db = $database->getConnection();

// Initialize MPU6050 handler
$mpu6050 = new MPU6050Handler($db);

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'POST':
        // Get posted data
        $data = json_decode(file_get_contents("php://input"), true);
        
        if($mpu6050->processData($data)) {
            http_response_code(201);
            echo json_encode(array("message" => "MPU6050 data processed successfully."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to process MPU6050 data."));
        }
        break;
        
    case 'GET':
        // Get vehicle_id from query string
        $vehicle_id = isset($_GET['vehicle_id']) ? $_GET['vehicle_id'] : die();
        
        // Get limit from query string
        $limit = isset($_GET['limit']) ? $_GET['limit'] : 100;
        
        // Get behavior data
        $behavior_data = $mpu6050->getDriverBehavior($vehicle_id, $limit);
        
        if($behavior_data) {
            http_response_code(200);
            echo json_encode($behavior_data);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "No behavior data found."));
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed."));
        break;
}
?> 