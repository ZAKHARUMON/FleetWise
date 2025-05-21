<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../config/database.php';
use Config\Database;

try {
    $database = new Database();
    $db = $database->getConnection();

    // Get vehicle_id from query parameter
    $vehicle_id = isset($_GET['vehicle_id']) ? $_GET['vehicle_id'] : null;

    // Base query
    $query = "SELECT 
        m.vehicle_id,
        m.timestamp,
        m.harsh_braking,
        m.rapid_acceleration,
        m.sharp_turn,
        m.behavior_score,
        m.acceleration_x,
        m.acceleration_y,
        m.acceleration_z,
        m.gyro_x,
        m.gyro_y,
        m.gyro_z,
        m.magnetometer_x,
        m.magnetometer_y,
        m.magnetometer_z,
        m.temperature,
        CASE 
            WHEN m.magnetometer_x != 0 OR m.magnetometer_y != 0 
            THEN DEGREES(ATAN2(m.magnetometer_y, m.magnetometer_x))
            ELSE NULL 
        END as heading
    FROM mpu9250_data m";

    // Add vehicle filter if specified
    if ($vehicle_id && $vehicle_id !== 'all') {
        $query .= " WHERE m.vehicle_id = :vehicle_id";
    }

    // Order by timestamp descending
    $query .= " ORDER BY m.timestamp DESC";

    $stmt = $db->prepare($query);
    
    if ($vehicle_id && $vehicle_id !== 'all') {
        $stmt->bindParam(':vehicle_id', $vehicle_id);
    }

    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format the data
    $formattedData = array_map(function($row) {
        return [
            'vehicle_id' => $row['vehicle_id'],
            'timestamp' => $row['timestamp'],
            'harsh_braking' => (bool)$row['harsh_braking'],
            'rapid_acceleration' => (bool)$row['rapid_acceleration'],
            'sharp_turn' => (bool)$row['sharp_turn'],
            'behavior_score' => (int)$row['behavior_score'],
            'acceleration' => [
                'x' => (float)$row['acceleration_x'],
                'y' => (float)$row['acceleration_y'],
                'z' => (float)$row['acceleration_z']
            ],
            'gyro' => [
                'x' => (float)$row['gyro_x'],
                'y' => (float)$row['gyro_y'],
                'z' => (float)$row['gyro_z']
            ],
            'magnetometer' => [
                'x' => (float)$row['magnetometer_x'],
                'y' => (float)$row['magnetometer_y'],
                'z' => (float)$row['magnetometer_z']
            ],
            'temperature' => (float)$row['temperature'],
            'heading' => $row['heading'] !== null ? (float)$row['heading'] : null
        ];
    }, $data);

    echo json_encode([
        'status' => 'success',
        'data' => $formattedData
    ]);

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?> 